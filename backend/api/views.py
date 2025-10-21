# api/views.py
from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .permissions import HasPermission, check_permission
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
#class BaseTenantViewSet(viewsets.ModelViewSet):
#    permission_classes = [IsAuthenticated]
#
#    def get_queryset(self):
#        try:
#            empleado = self.request.user.empleado
#            return self.queryset.filter(empresa=empleado.empresa)
#        except Empleado.DoesNotExist:
#            return self.queryset.none()
#
#    def perform_create(self, serializer):
#        empleado = self.request.user.empleado
#        serializer.save(empresa=empleado.empresa)

class BaseTenantViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            # Add print statements to debug
            print(f"DEBUG: get_queryset called by user: {self.request.user}")
            empleado = self.request.user.empleado
            print(f"DEBUG: Found empleado: {empleado}, for empresa: {empleado.empresa}")
            # Ensure 'self.queryset' is correctly defined in the inheriting ViewSet
            # For EmpleadoViewSet, self.queryset is Empleado.objects.all()
            queryset = self.queryset.filter(empresa=empleado.empresa)
            print(f"DEBUG: Filtered queryset count: {queryset.count()}")
            return queryset
        except Empleado.DoesNotExist:
            print(f"DEBUG: Empleado.DoesNotExist for user: {self.request.user}")
            # This should only happen if the logged-in user isn't linked to an Empleado
            # (like the SuperAdmin, maybe?)
            # Or if the OneToOneField link is broken.
            return self.queryset.none()
        except Exception as e: # Catch any other unexpected error
             print(f"ERROR in get_queryset: {e}")
             return self.queryset.none()        

    def perform_create(self, serializer):
        try:
            empleado = self.request.user.empleado
            print(f"DEBUG: perform_create assigning empresa: {empleado.empresa}")
            # This should automatically save the correct empresa
            serializer.save(empresa=empleado.empresa) 
            print(f"DEBUG: perform_create successful for user: {serializer.instance.usuario.username}")
        except Empleado.DoesNotExist:
             print(f"ERROR in perform_create: Empleado.DoesNotExist for user: {self.request.user}")
             # Handle error - maybe raise validation error?
        except Exception as e:
             print(f"ERROR in perform_create: {e}")
             # Handle error

    def check_permissions(self, request):
        """
        Runs default permission checks (IsAuthenticated) first.
        Then, if a specific permission is required by the viewset,
        it checks that too using our custom logic.
        """
        # Run default checks (like IsAuthenticated)
        super().check_permissions(request) 

        # Check for specific management permission if defined on the viewset
        required_permission = getattr(self, 'required_manage_permission', None)
        if required_permission and request.method not in permissions.SAFE_METHODS:
             if not check_permission(request, self, required_permission):
                 # If the custom check fails, explicitly deny permission
                 self.permission_denied(
                     request, message=f'Permission "{required_permission}" required for this action.'
                 )

# --- VIEWSETS DE LA APLICACIÓN ---
class CargoViewSet(BaseTenantViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer
    required_manage_permission = 'manage_cargo'

class DepartamentoViewSet(BaseTenantViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
    required_manage_permission = 'manage_departamento'

#class EmpleadoViewSet(BaseTenantViewSet):
#    queryset = Empleado.objects.all()
#    serializer_class = EmpleadoSerializer
#
#    # --- AÑADE ESTE MÉTODO ---
#    def create(self, request, *args, **kwargs):
#        """
#        Sobrescribe el método create para devolver una respuesta simple.
#        """
#        serializer = self.get_serializer(data=request.data)
#        serializer.is_valid(raise_exception=True)
#        # perform_create asigna la empresa automáticamente
#        self.perform_create(serializer) 
#        
#        # En lugar de devolver serializer.data (que puede fallar),
#        # devolvemos solo el ID y un mensaje.
#        headers = self.get_success_headers(serializer.data)
#        return Response(
#            {"id": serializer.instance.id, "detail": "Empleado creado con éxito."}, 
#            status=status.HTTP_201_CREATED, 
#            headers=headers
#        )

class EmpleadoViewSet(BaseTenantViewSet):
    queryset = Empleado.objects.all().select_related('usuario', 'cargo', 'departamento').prefetch_related('roles') # Optimization
    serializer_class = EmpleadoSerializer
    required_manage_permission = 'manage_empleado'

    def create(self, request, *args, **kwargs):
        # ... (Your existing create method returning simple response)
        # Ensure perform_create is called correctly within this method if you override it
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer) # Make sure this line exists and is called
        headers = self.get_success_headers(serializer.data)
        # Ensure serializer.instance is available AFTER perform_create
        if hasattr(serializer, 'instance'):
             return Response(
                 {"id": serializer.instance.id, "detail": "Empleado creado con éxito."},
                 status=status.HTTP_201_CREATED,
                 headers=headers
            )
        else: # Should not happen if perform_create works
             print("ERROR: serializer.instance not found after perform_create")
             return Response({"detail":"Error creating employee instance."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ActivoFijoViewSet(BaseTenantViewSet):
    queryset = ActivoFijo.objects.all()
    serializer_class = ActivoFijoSerializer
    required_manage_permission = 'manage_activofijo'

class PresupuestoViewSet(BaseTenantViewSet):
    queryset = Presupuesto.objects.all()
    serializer_class = PresupuestoSerializer
    # Apply the custom permission check for non-GET requests
    #permission_classes = [IsAuthenticated, HasPermission('manage_presupuesto')]
    required_manage_permission = 'manage_presupuesto'

class RolesViewSet(BaseTenantViewSet):
    queryset = Roles.objects.all()
    serializer_class = RolesSerializer
    required_manage_permission = 'manage_rol'

class CategoriaActivoViewSet(BaseTenantViewSet):
    queryset = CategoriaActivo.objects.all()
    serializer_class = CategoriaActivoSerializer
    required_manage_permission = 'manage_categoriaactivo'

class EstadoViewSet(BaseTenantViewSet):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer
    required_manage_permission = 'manage_estadoactivo'

class UbicacionViewSet(BaseTenantViewSet):
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer
    required_manage_permission = 'manage_ubicacion'

class ProveedorViewSet(BaseTenantViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    required_manage_permission = 'manage_proveedor'

class PermisosViewSet(viewsets.ModelViewSet): 
    """
    ViewSet para gestionar los Permisos Globales...
    """
    queryset = Permisos.objects.all().order_by('nombre')
    serializer_class = PermisosSerializer
    
    def get_permissions(self):
        # ... (permission logic) ...
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        # Requiere ser Superusuario (is_staff=True) para otras acciones (POST, PUT, DELETE)
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

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
            'categoria', 'estado', 'ubicacion' # Include related models needed
        )
        ubicacion_id = request.query_params.get('ubicacion_id') 
        fecha_min = request.query_params.get('fecha_min')
        fecha_max = request.query_params.get('fecha_max')
        if ubicacion_id:
            queryset = queryset.filter(ubicacion_id=ubicacion_id)
        if fecha_min:
            queryset = queryset.filter(fecha_adquisicion__gte=fecha_min)
        if fecha_max:
            queryset = queryset.filter(fecha_adquisicion__lte=fecha_max)
        return queryset.order_by('fecha_adquisicion')

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset(request)
        # Use .values() for the specific fields needed in the preview table
        data = queryset.values(
            'id', 'nombre', 'codigo_interno', 'fecha_adquisicion', 'valor_actual',
            'ubicacion__nombre', 'categoria__nombre' # Use double underscore for related fields
        )
        return Response(list(data)) # Convert queryset values to list


# --- RESTORE THIS VIEW COMPLETELY ---
class ReporteActivosExport(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self, request):
        # Reutiliza la lógica de filtrado de la vista previa
        # IMPORTANT: Ensure ReporteActivosPreview().get_queryset(request) 
        # includes all necessary related models (select_related)
        # for the PDF/Excel generation below.
        return ReporteActivosPreview().get_queryset(request).select_related(
            'ubicacion', 'estado' # Add any other related models needed below
        ) 

    def get(self, request, *args, **kwargs):
        print(f"\n---> ReporteActivosExport GET method reached! Format requested: {request.query_params.get('format')}\n")
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

        # Encabezados (Adjust based on your model - using Ubicacion now)
        headers = ["Nombre", "Código Interno", "Ubicación", "Fecha Adquisición", "Valor Actual (Bs.)", "Estado"] 
        ws.append(headers)
        for cell in ws[1]:
            cell.font = Font(bold=True)
        
        # Datos
        for activo in queryset:
            ws.append([
                activo.nombre,
                activo.codigo_interno,
                activo.ubicacion.nombre if activo.ubicacion else 'N/A', # Use ubicacion
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
        width, height = letter

        p.setFont('Helvetica-Bold', 16)
        p.drawString(inch, height - inch, "Reporte de Activos Fijos")

        p.setFont('Helvetica-Bold', 10)
        y = height - 1.5 * inch
        # Adjust headers for Ubicacion
        headers = ["Nombre", "Código", "Ubicación", "Fecha Adq.", "Valor (Bs.)"] 
        col_widths = [2.5 * inch, 1 * inch, 1.5 * inch, 1 * inch, 1 * inch]
        x = inch
        for i, header in enumerate(headers):
            p.drawString(x, y, header)
            x += col_widths[i]

        p.line(inch, y - 0.1 * inch, width - inch, y - 0.1 * inch)
        y -= 0.25 * inch

        p.setFont('Helvetica', 9)
        for activo in queryset:
            if y < inch: 
                p.showPage()
                p.setFont('Helvetica', 9)
                y = height - inch
                
            data = [
                activo.nombre[:30], # Limit length if needed
                activo.codigo_interno,
                activo.ubicacion.nombre[:20] if activo.ubicacion else 'N/A', # Use ubicacion
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
            refresh = RefreshToken.for_user(user)
            token = refresh.access_token
            empleado = user.empleado

            try:
                empleado = user.empleado
                token['username'] = user.username
                token['email'] = user.email
                token['nombre_completo'] = f"{user.first_name} {empleado.apellido_p}"
                token['empresa_id'] = str(empleado.empresa.id)
                token['empresa_nombre'] = empleado.empresa.nombre
                # Asumimos que al registrarse no tiene roles asignados aún
                token['roles'] = [] 
                token['is_admin'] = user.is_staff
            except Empleado.DoesNotExist: # Seguridad por si algo falla
                token['roles'] = []
                token['is_admin'] = user.is_staff
            return Response({
                'refresh': str(refresh),
                'access': str(token), # Enviamos el access token modificado
            }, status=status.HTTP_201_CREATED) # type: ignore
        
        # Si no es válido, devuelve los errores de validación (ej. "NIT ya existe")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserPermissionsView(APIView):
    """
    Returns a list of permission names assigned to the current user
    through their roles.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        permissions_set = set()
        try:
            empleado = request.user.empleado
            # Efficiently get all permission names linked to the user's roles
            permissions_set = set(
                empleado.roles.values_list('permisos__nombre', flat=True).distinct()
            )
            # Add check for superuser
            if request.user.is_staff:
                 permissions_set.add('is_superuser') # Add a special permission flag

        except Empleado.DoesNotExist:
            # Handle case where user isn't an employee (maybe just superuser)
            if request.user.is_staff:
                 permissions_set.add('is_superuser')
            pass # Regular users without employee link have no permissions
        except Exception as e:
            print(f"Error fetching user permissions: {e}")
            # Return empty list on error

        return Response(list(permissions_set)) # Return as a simple list of strings
