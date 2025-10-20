# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'cargos', CargoViewSet)
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'empleados', EmpleadoViewSet)
router.register(r'activos-fijos', ActivoFijoViewSet)
router.register(r'presupuestos', PresupuestoViewSet)
router.register(r'roles', RolesViewSet)
router.register(r'logs', LogViewSet, basename='log') # <-- AÑADE ESTA LÍNEA
router.register(r'categorias-activos', CategoriaActivoViewSet)
router.register(r'estados', EstadoViewSet)
router.register(r'ubicaciones', UbicacionViewSet)
router.register(r'proveedores', ProveedorViewSet)
router.register(r'permisos', PermisosViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]