# api/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
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
            token['empresa_id'] = str(empleado.empresa.id)
            token['empresa_nombre'] = empleado.empresa.nombre
            token['nombre_completo'] = f"{user.first_name} {empleado.apellido_p}"
        except Empleado.DoesNotExist:
            token['empresa_id'] = None
            token['empresa_nombre'] = None
            token['nombre_completo'] = user.username
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
        
class EmpleadoSerializer(serializers.ModelSerializer):
    # Ahora 'UsuarioSerializer' está definido y esta línea funcionará
    usuario = UsuarioSerializer(read_only=True)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    
    class Meta:
        model = Empleado
        # Excluimos los campos 'write_only' de la lectura por defecto
        exclude = ('password',) 
        read_only_fields = ('empresa', 'usuario')

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        email = validated_data.pop('email')
        
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            email=email,
            last_name=validated_data.get('apellido_p', ''),
            is_active=True
        )
        
        empleado = Empleado.objects.create(usuario=user, **validated_data)
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
        
class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'
        read_only_fields = ('empresa',)

# --- NUEVO SERIALIZER PARA LOGS ---
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        # Definimos los campos que esperamos recibir del frontend
        fields = ['accion', 'payload']