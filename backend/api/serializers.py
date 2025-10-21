# api/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .permissions import check_permission, HasPermission
from .models import *

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['id', 'nombre', 'nit']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            empleado = user.empleado
            token['username'] = user.username
            token['email'] = user.email
            token['nombre_completo'] = f"{user.first_name} {empleado.apellido_p}"
            token['empresa_id'] = str(empleado.empresa.id)
            token['empresa_nombre'] = empleado.empresa.nombre
            
            # --- !!! CHANGE THIS LINE !!! ---
            # Send role NAMES instead of IDs
            token['roles'] = [rol.nombre for rol in empleado.roles.all()] 
            # --- END OF CHANGE ---
            
            token['is_admin'] = user.is_staff 
        except Empleado.DoesNotExist:
            token['username'] = user.username
            token['email'] = user.email
            token['nombre_completo'] = user.username
            token['empresa_id'] = None
            token['empresa_nombre'] = None
            token['roles'] = [] # Keep this empty
            token['is_admin'] = user.is_staff
        return token

# --- CLASE FALTANTE AÑADIDA AQUÍ ---
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = '__all__'
        read_only_fields = ('empresa',)

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = '__all__'
        read_only_fields = ('empresa',)

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'
        read_only_fields = ('empresa',)
        
class EmpleadoSerializer(serializers.ModelSerializer):
    # Ahora 'UsuarioSerializer' está definido y esta línea funcionará
    usuario = UsuarioSerializer(read_only=True)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    
    roles = serializers.PrimaryKeyRelatedField(
        queryset=Roles.objects.all(), 
        many=True, 
        write_only=True, 
        required=False # Hazlo opcional si un empleado puede no tener roles
    )

    class Meta:
        model = Empleado
        # Asegúrate de incluir 'roles' en los fields si quieres leerlos,
        # pero para escribir usamos el campo write_only de arriba.
        # Quitamos '__all__' para ser explícitos
        fields = [
            'id', 'usuario', 'ci', 'apellido_p', 'apellido_m', 
            'direccion', 'telefono', 'sueldo', 'cargo', 
            'departamento', 'empresa', 
            # Campos write_only para la creación/actualización del usuario
            'username', 'password', 'first_name', 'email', 
            # Campo write_only para asignar roles
            'roles', 
             # Campos read_only que se añadirán al leer
            'cargo_nombre', 'departamento_nombre', 'roles_asignados' 
        ]      
        read_only_fields = ('empresa', 'usuario', 'cargo_nombre', 'departamento_nombre', 'roles_asignados') # Añade campos calculados
        # Campo extra para mostrar nombres en la lectura
        extra_kwargs = {
            'cargo': {'write_only': True, 'required': False, 'allow_null': True}, # Espera ID al escribir
            'departamento': {'write_only': True, 'required': False, 'allow_null': True}, # Espera ID al escribir
        }

    # --- Campos extra para la lectura ---
    cargo_nombre = serializers.CharField(source='cargo.nombre', read_only=True, allow_null=True)
    departamento_nombre = serializers.CharField(source='departamento.nombre', read_only=True, allow_null=True)
    roles_asignados = RolesSerializer(source='roles', many=True, read_only=True) # Serializador anidado para leer

    # --- MÉTODO CREATE CORREGIDO ---

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        email = validated_data.pop('email')
        roles_data = validated_data.pop('roles', [])

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            email=email,
            last_name=validated_data.get('apellido_p', ''),
            is_active=True
        )
        
        empleado = Empleado.objects.create(usuario=user, **validated_data)
        if roles_data: # Solo si se enviaron roles
            empleado.roles.set(roles_data)
        return empleado

class ActivoFijoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivoFijo
        fields = '__all__'
        read_only_fields = ('empresa',)

class PresupuestoSerializer(serializers.ModelSerializer):
    # Le decimos que anide la información del departamento al leer
    departamento = DepartamentoSerializer(read_only=True)
    # Al escribir, esperamos solo el ID del departamento
    departamento_id = serializers.PrimaryKeyRelatedField(
        queryset=Departamento.objects.all(), source='departamento', write_only=True
    )

    class Meta:
        model = Presupuesto
        fields = ['id', 'descripcion', 'monto', 'fecha', 'departamento', 'departamento_id']
        read_only_fields = ('empresa',)
        


class CategoriaActivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaActivo
        fields = '__all__'
        read_only_fields = ('empresa',)

class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'
        read_only_fields = ('empresa',)

class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = '__all__'
        read_only_fields = ('empresa',)

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'
        read_only_fields = ('empresa',)

class PermisosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permisos
        fields = '__all__'

class RegisterEmpresaSerializer(serializers.Serializer):
    """
    Serializer para registrar una nueva empresa y su primer usuario admin.
    No está ligado a un modelo, solo valida datos de entrada.
    """
    # Datos de la Empresa
    empresa_nombre = serializers.CharField(max_length=100)
    empresa_nit = serializers.CharField(max_length=20)
    
    # Datos del Admin (User)
    admin_username = serializers.CharField(max_length=100)
    admin_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    admin_first_name = serializers.CharField(max_length=100)
    admin_email = serializers.EmailField()
    
    # Datos del Admin (Empleado)
    admin_ci = serializers.CharField(max_length=20)
    admin_apellido_p = serializers.CharField(max_length=100)
    admin_apellido_m = serializers.CharField(max_length=100)

    # Datos de Pago (simulados, no los usamos pero los recibimos)
    card_number = serializers.CharField(write_only=True)
    card_expiry = serializers.CharField(write_only=True)
    card_cvc = serializers.CharField(write_only=True)

    def validate_empresa_nombre(self, value):
        if Empresa.objects.filter(nombre__iexact=value).exists():
            raise serializers.ValidationError("Ya existe una empresa con este nombre.")
        return value
        
    def validate_empresa_nit(self, value):
        if Empresa.objects.filter(nit__iexact=value).exists():
            raise serializers.ValidationError("Ya existe una empresa con este NIT.")
        return value
        
    def validate_admin_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def create(self, validated_data):
        # 1. Crear la Empresa
        empresa = Empresa.objects.create(
            nombre=validated_data['empresa_nombre'],
            nit=validated_data['empresa_nit']
        )
        
        # 2. Crear el User (Admin)
        user = User.objects.create_user(
            username=validated_data['admin_username'],
            password=validated_data['admin_password'],
            first_name=validated_data['admin_first_name'],
            email=validated_data['admin_email'],
            last_name=validated_data['admin_apellido_p'],
            is_active=True
        )
        
        # 3. Crear el Empleado (Admin) y ligarlo a la Empresa y al User
        empleado = Empleado.objects.create(
            usuario=user,
            empresa=empresa,
            ci=validated_data['admin_ci'],
            apellido_p=validated_data['admin_apellido_p'],
            apellido_m=validated_data['admin_apellido_m'],
            # (Puedes asignar un Cargo o Rol por defecto si quieres aquí)
        )
        
        # Devolvemos el usuario para poder generar su token
        return user
    
# --- NUEVO SERIALIZER PARA LOGS ---
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        # Definimos los campos que esperamos recibir del frontend
        fields = ['accion', 'payload']

