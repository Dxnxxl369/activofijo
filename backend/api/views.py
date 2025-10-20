# api/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
import io
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

# Importaciones de OpenPyXL (Excel)
from openpyxl import Workbook
from openpyxl.styles import Font
from .models import *
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

# --- VISTA DE LOGIN PERSONALIZADA ---
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# --- VIEWSET BASE PARA LÓGICA MULTI-TENANT ---
class BaseTenantViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            empleado = self.request.user.empleado
            return self.queryset.filter(empresa=empleado.empresa)
        except Empleado.DoesNotExist:
            return self.queryset.none()

    def perform_create(self, serializer):
        empleado = self.request.user.empleado
        serializer.save(empresa=empleado.empresa)

# --- VIEWSETS DE LA APLICACIÓN ---
class CargoViewSet(BaseTenantViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer

class DepartamentoViewSet(BaseTenantViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer

class EmpleadoViewSet(BaseTenantViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer

class ActivoFijoViewSet(BaseTenantViewSet):
    queryset = ActivoFijo.objects.all()
    serializer_class = ActivoFijoSerializer

class PresupuestoViewSet(BaseTenantViewSet):
    queryset = Presupuesto.objects.all()
    serializer_class = PresupuestoSerializer

class RolesViewSet(BaseTenantViewSet):
    queryset = Roles.objects.all()
    serializer_class = RolesSerializer

class CategoriaActivoViewSet(BaseTenantViewSet):
    queryset = CategoriaActivo.objects.all()
    serializer_class = CategoriaActivoSerializer

class EstadoViewSet(BaseTenantViewSet):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer

class UbicacionViewSet(BaseTenantViewSet):
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer

class ProveedorViewSet(BaseTenantViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

class PermisosViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de Solo Lectura para los Permisos.
    Estos son definidos por el sistema y no pueden ser
    creados o modificados por los usuarios.
    """
    queryset = Permisos.objects.all()
    serializer_class = PermisosSerializer
    permission_classes = [IsAuthenticated]

# --- NUEVO VIEWSET PARA LA BITÁCORA/LOG ---
class LogViewSet(viewsets.ModelViewSet):
    """
    ViewSet para recibir y guardar registros de log desde el frontend.
    No usa el filtro de tenant porque es una función a nivel de sistema.
    """
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    permission_classes = [IsAuthenticated] # Solo usuarios autenticados pueden registrar logs

    def perform_create(self, serializer):
        # Obtenemos la IP del cliente de forma segura
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')

        # Asignamos los datos automáticos antes de guardar
        empleado = self.request.user.empleado
        serializer.save(
            usuario=self.request.user,
            ip_address=ip,
            tenant_id=empleado.empresa.id if empleado else None
        )

class ReporteActivosPreview(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self, request):
        empleado = request.user.empleado
        queryset = ActivoFijo.objects.filter(empresa=empleado.empresa).select_related(
            'categoria', 'estado', 'ubicacion'
        )
        
        # Aplicar filtros desde query params
        # --- LÍNEA CORREGIDA ---
        ubicacion_id = request.query_params.get('ubicacion_id') 
        fecha_min = request.query_params.get('fecha_min')
        fecha_max = request.query_params.get('fecha_max')

        # --- LÍNEA CORREGIDA ---
        if ubicacion_id:
            queryset = queryset.filter(ubicacion_id=ubicacion_id)
        if fecha_min:
            queryset = queryset.filter(fecha_adquisicion__gte=fecha_min)
        if fecha_max:
            queryset = queryset.filter(fecha_adquisicion__lte=fecha_max)
            
        return queryset.order_by('fecha_adquisicion')

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset(request)
        # --- CORRECCIÓN DE CAMPO ---
        # Usamos un serializer más simple aquí para mostrar los datos del reporte
        # ya que ActivoFijoSerializer espera campos que no estamos usando
        data = queryset.values(
            'id', 'nombre', 'codigo_interno', 'fecha_adquisicion', 'valor_actual',
            'ubicacion__nombre', 'categoria__nombre'
        )
        return Response(data)

# --- VISTA PARA LA EXPORTACIÓN DE REPORTES (PDF/EXCEL) ---
class ReporteActivosExport(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self, request):
        # Reutilizamos la misma lógica de filtrado de la vista previa
        return ReporteActivosPreview().get_queryset(request)

    def get(self, request, *args, **kwargs):
        """
        Genera y retorna un archivo PDF o Excel basado en los filtros.
        """
        export_format = request.query_params.get('format', 'pdf')
        queryset = self.get_queryset(request)
        
        if export_format == 'excel':
            return self.create_excel(queryset)
        else: # Default a PDF
            return self.create_pdf(queryset)

    def create_excel(self, queryset):
        buffer = io.BytesIO()
        wb = Workbook()
        ws = wb.active
        ws.title = "Reporte de Activos"

        # Encabezados
        headers = ["Nombre", "Código Interno", "Departamento", "Fecha Adquisición", "Valor Actual (Bs.)", "Estado"]
        ws.append(headers)
        for cell in ws[1]:
            cell.font = Font(bold=True)
        
        # Datos
        for activo in queryset:
            ws.append([
                activo.nombre,
                activo.codigo_interno,
                activo.departamento.nombre if activo.departamento else 'N/A',
                activo.fecha_adquisicion,
                activo.valor_actual,
                activo.estado.nombre if activo.estado else 'N/A'
            ])
        
        wb.save(buffer)
        buffer.seek(0)
        
        response = HttpResponse(
            buffer,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="reporte_activos.xlsx"'
        return response

    def create_pdf(self, queryset):
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter # (612, 792)

        # Título
        p.setFont('Helvetica-Bold', 16)
        p.drawString(inch, height - inch, "Reporte de Activos Fijos")

        # Encabezados
        p.setFont('Helvetica-Bold', 10)
        y = height - 1.5 * inch
        headers = ["Nombre", "Código", "Departamento", "Fecha Adq.", "Valor (Bs.)"]
        col_widths = [2.5 * inch, 1 * inch, 1.5 * inch, 1 * inch, 1 * inch]
        x = inch
        for i, header in enumerate(headers):
            p.drawString(x, y, header)
            x += col_widths[i]

        p.line(inch, y - 0.1 * inch, width - inch, y - 0.1 * inch)
        y -= 0.25 * inch

        # Datos
        p.setFont('Helvetica', 9)
        for activo in queryset:
            if y < inch: # Si se acaba la página, crea una nueva
                p.showPage()
                p.setFont('Helvetica', 9)
                y = height - inch
                
            data = [
                activo.nombre[:30],
                activo.codigo_interno,
                activo.departamento.nombre[:20] if activo.departamento else 'N/A',
                str(activo.fecha_adquisicion),
                str(activo.valor_actual)
            ]
            x = inch
            for i, item in enumerate(data):
                p.drawString(x, y, item)
                x += col_widths[i]
            y -= 0.25 * inch
            
        p.showPage()
        p.save()
        buffer.seek(0)
        
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="reporte_activos.pdf"'
        return response

class RegisterEmpresaView(APIView):
    """
    Endpoint público para registrar una nueva empresa (Suscripción).
    """
    permission_classes = [AllowAny] # No requiere autenticación

    def post(self, request, *args, **kwargs):
        serializer = RegisterEmpresaSerializer(data=request.data)
        if serializer.is_valid():
            # El .save() llama al método .create() del serializer
            user = serializer.save() 
            
            # Generamos un token para el nuevo usuario
            refresh = RefreshToken.for_user(user)
            empleado = user.empleado

            token = refresh.access_token 
            token['username'] = user.username
            token['email'] = user.email
            token['nombre_completo'] = f"{user.first_name} {empleado.apellido_p}"
            token['empresa_id'] = str(empleado.empresa.id)
            token['empresa_nombre'] = empleado.empresa.nombre
            
            return Response({
                'refresh': str(refresh),
                'access': str(token), # Enviamos el access token modificado
            }, status=status.HTTP_201_CREATED)
        
        # Si no es válido, devuelve los errores de validación (ej. "NIT ya existe")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)