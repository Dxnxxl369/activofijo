import uuid
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth.models import User
from api.models import (
    Empresa, Empleado, Departamento, Cargo, Roles, Permisos,
    CategoriaActivo, Estado, Ubicacion, Proveedor, ActivoFijo, Presupuesto
)

# --- CONTRASEÑA ACTUALIZADA ---
PASSWORD = "empresa123"

class Command(BaseCommand):
    help = 'Limpia y puebla la base de datos con datos de ejemplo para 3 empresas'

    @transaction.atomic(using='default') # Asegura que todo se haga en la BD 'default'
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Limpiando la base de datos "default"...'))
        
        # Limpiar modelos en orden inverso de dependencias
        ActivoFijo.objects.all().delete()
        Presupuesto.objects.all().delete()
        Empleado.objects.all().delete()
        User.objects.all().exclude(is_superuser=True).delete() # Borra todos menos el superadmin
        Roles.objects.all().delete()
        Permisos.objects.all().delete()
        Proveedor.objects.all().delete()
        Ubicacion.objects.all().delete()
        Estado.objects.all().delete()
        CategoriaActivo.objects.all().delete()
        Cargo.objects.all().delete()
        Departamento.objects.all().delete()
        Empresa.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Base de datos "default" limpia.'))
        self.stdout.write(self.style.WARNING('Creando nuevos datos...'))

        # --- Crear Permisos Globales ---
        perm_ver = Permisos.objects.create(nombre='ver_todo', descripcion='Ver todo en la empresa')
        perm_editar = Permisos.objects.create(nombre='editar_todo', descripcion='Editar todo en la empresa')
        perm_reportes = Permisos.objects.create(nombre='ver_reportes', descripcion='Ver reportes')

        # --- EMPRESA 1: Innovatech Solutions ---
        empresa1 = Empresa.objects.create(nombre='Innovatech Solutions', nit='123456001')
        self.stdout.write(f'Creada Empresa: {empresa1.nombre}')
        
        admin1_user = self.crear_usuario('admin_innovatech', 'Ana', 'Gomez', 'ana@innovatech.com')
        admin1_emp = self.crear_empleado(admin1_user, empresa1, '1111111', 'Gomez', 'Perez', 3000)
        
        rol_admin1 = Roles.objects.create(empresa=empresa1, nombre='Admin')
        rol_admin1.permisos.add(perm_ver, perm_editar, perm_reportes)
        admin1_emp.roles.add(rol_admin1)

        dep1_inno = Departamento.objects.create(empresa=empresa1, nombre='TI')
        dep2_inno = Departamento.objects.create(empresa=empresa1, nombre='Finanzas')
        cat1_inno = CategoriaActivo.objects.create(empresa=empresa1, nombre='Laptops')
        est1_inno = Estado.objects.create(empresa=empresa1, nombre='Nuevo')
        ubi1_inno = Ubicacion.objects.create(empresa=empresa1, nombre='Piso 3 - Oficina TI')

        ActivoFijo.objects.create(
            empresa=empresa1, nombre='Laptop Dell XPS 15', codigo_interno='INNO-LT-001',
            fecha_adquisicion='2025-01-10', valor_actual=1500, vida_util=3,
            categoria=cat1_inno, estado=est1_inno, ubicacion=ubi1_inno
        )

        # --- EMPRESA 2: Constructora Andina ---
        empresa2 = Empresa.objects.create(nombre='Constructora Andina', nit='789012002')
        self.stdout.write(f'Creada Empresa: {empresa2.nombre}')

        admin2_user = self.crear_usuario('admin_andina', 'Carlos', 'Vega', 'carlos@andina.com')
        admin2_emp = self.crear_empleado(admin2_user, empresa2, '2222222', 'Vega', 'Lopez', 3500)
        
        rol_admin2 = Roles.objects.create(empresa=empresa2, nombre='Admin')
        rol_admin2.permisos.add(perm_ver, perm_editar)
        admin2_emp.roles.add(rol_admin2)
        
        cat1_andi = CategoriaActivo.objects.create(empresa=empresa2, nombre='Maquinaria Pesada')
        est1_andi = Estado.objects.create(empresa=empresa2, nombre='En Uso')
        ubi1_andi = Ubicacion.objects.create(empresa=empresa2, nombre='Almacén Central')

        ActivoFijo.objects.create(
            empresa=empresa2, nombre='Excavadora CAT 320', codigo_interno='ANDI-MP-001',
            fecha_adquisicion='2024-05-20', valor_actual=80000, vida_util=10,
            categoria=cat1_andi, estado=est1_andi, ubicacion=ubi1_andi
        )

        # --- EMPRESA 3: Café del Valle ---
        empresa3 = Empresa.objects.create(nombre='Café del Valle', nit='333444003')
        self.stdout.write(f'Creada Empresa: {empresa3.nombre}')

        admin3_user = self.crear_usuario('admin_cafe', 'Lucia', 'Mendez', 'lucia@cafevalle.com')
        admin3_emp = self.crear_empleado(admin3_user, empresa3, '3333333', 'Mendez', 'Rios', 2800)
        
        cat1_cafe = CategoriaActivo.objects.create(empresa=empresa3, nombre='Equipo de Tostado')
        est1_cafe = Estado.objects.create(empresa=empresa3, nombre='Mantenimiento')
        ubi1_cafe = Ubicacion.objects.create(empresa=empresa3, nombre='Planta de Procesamiento')

        ActivoFijo.objects.create(
            empresa=empresa3, nombre='Tostadora Probat 25kg', codigo_interno='CAFE-TOST-001',
            fecha_adquisicion='2023-11-01', valor_actual=25000, vida_util=15,
            categoria=cat1_cafe, estado=est1_cafe, ubicacion=ubi1_cafe
        )

        self.stdout.write(self.style.SUCCESS('¡Datos de ejemplo creados con éxito!'))
        self.stdout.write(self.style.NOTICE(f'--- Usuarios Admin Creados (Pass: {PASSWORD}) ---'))
        self.stdout.write(f'admin_innovatech (Empresa: Innovatech Solutions)')
        self.stdout.write(f'admin_andina (Empresa: Constructora Andina)')
        self.stdout.write(f'admin_cafe (Empresa: Café del Valle)')

    def crear_usuario(self, username, first_name, last_name, email):
        return User.objects.create_user(
            username=username, password=PASSWORD, first_name=first_name,
            last_name=last_name, email=email, is_active=True
        )

    def crear_empleado(self, user, empresa, ci, ap_p, ap_m, sueldo):
        return Empleado.objects.create(
            usuario=user, empresa=empresa, ci=ci, apellido_p=ap_p,
            apellido_m=ap_m, sueldo=sueldo
        )