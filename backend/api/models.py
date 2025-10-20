# api/models.py
import uuid
from django.db import models
from django.contrib.auth.models import User

class Empresa(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100, unique=True)
    nit = models.CharField(max_length=20, unique=True)
    direccion = models.CharField(max_length=255, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(max_length=100, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.nombre

class Departamento(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='departamentos')
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    class Meta: unique_together = ('empresa', 'nombre')
    def __str__(self): return f"{self.nombre} ({self.empresa.nombre})"

class Permisos(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField()
    def __str__(self): return self.nombre

class Roles(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='roles')
    nombre = models.CharField(max_length=100)
    permisos = models.ManyToManyField(Permisos, blank=True)
    class Meta: unique_together = ('empresa', 'nombre')
    def __str__(self): return f"{self.nombre} ({self.empresa.nombre})"

class Cargo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='cargos')
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    class Meta: unique_together = ('empresa', 'nombre')
    def __str__(self): return f"{self.nombre} ({self.empresa.nombre})"

class Empleado(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='empleados')
    ci = models.CharField(max_length=20)
    apellido_p = models.CharField(max_length=100)
    apellido_m = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    sueldo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cargo = models.ForeignKey(Cargo, on_delete=models.SET_NULL, null=True, blank=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True)
    roles = models.ManyToManyField(Roles, blank=True)
    def __str__(self): return f"{self.usuario.first_name} {self.apellido_p}"

class ActivoFijo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='activos_fijos')
    nombre = models.CharField(max_length=100)
    codigo_interno = models.CharField(max_length=50)
    fecha_adquisicion = models.DateField()
    valor_actual = models.DecimalField(max_digits=12, decimal_places=2)
    vida_util = models.IntegerField() # En años
    categoria = models.ForeignKey('CategoriaActivo', on_delete=models.PROTECT)
    estado = models.ForeignKey('Estado', on_delete=models.PROTECT)
    ubicacion = models.ForeignKey('Ubicacion', on_delete=models.PROTECT)
    proveedor = models.ForeignKey('Proveedor', on_delete=models.SET_NULL, null=True, blank=True)
    class Meta: unique_together = ('empresa', 'codigo_interno')
    def __str__(self): return self.nombre

class CategoriaActivo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='categorias_activos')
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    def __str__(self): return self.nombre

class Estado(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='estados_activos')
    nombre = models.CharField(max_length=50)
    detalle = models.TextField(blank=True, null=True)
    def __str__(self): return self.nombre

class Ubicacion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='ubicaciones')
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    detalle = models.TextField(blank=True, null=True)
    def __str__(self): return self.nombre

class Proveedor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='proveedores')
    nombre = models.CharField(max_length=100)
    nit = models.CharField(max_length=20)
    email = models.EmailField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    pais = models.CharField(max_length=50, blank=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    estado = models.CharField(max_length=20, default='activo')
    def __str__(self): return self.nombre

class Presupuesto(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='presupuestos')
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=15, decimal_places=2)
    fecha = models.DateField()
    descripcion = models.TextField(blank=True, null=True)
    def __str__(self): return f"Presupuesto {self.departamento.nombre} - {self.fecha}"

# --- Modelos de Log/Bitácora (Punto 3 del PDF) ---
class Log(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # No tiene FK a Empresa para que sea un registro global y seguro
    timestamp = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    accion = models.CharField(max_length=255) # ej: "CREATE: ActivoFijo, ID: xxx"
    tenant_id = models.UUIDField(null=True, blank=True) # Guarda el ID de la empresa afectada
    payload = models.JSONField(null=True, blank=True) # Guarda los datos de la petición