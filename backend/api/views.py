# api/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
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