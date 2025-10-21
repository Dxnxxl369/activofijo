from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import Permisos

# --- LISTA DE PERMISOS A CREAR ---
# (Nombre Clave, Descripción)
PERMISSIONS_LIST = [
    # General
    ('view_dashboard', 'Ver el Dashboard principal'),
    # Activos Fijos
    ('view_activofijo', 'Ver la lista de activos fijos'),
    ('create_activofijo', 'Crear nuevos activos fijos'),
    ('edit_activofijo', 'Editar activos fijos existentes'),
    ('delete_activofijo', 'Dar de baja (eliminar lógicamente) activos fijos'),
    ('assign_activofijo', 'Asignar activos fijos a empleados/ubicaciones'),
    # Organización
    ('view_departamento', 'Ver la lista de departamentos'),
    ('manage_departamento', 'Crear, editar y eliminar departamentos'),
    ('view_cargo', 'Ver la lista de cargos'),
    ('manage_cargo', 'Crear, editar y eliminar cargos'),
    ('view_empleado', 'Ver la lista de empleados'),
    ('manage_empleado', 'Crear, editar y eliminar empleados'),
    # Roles y Permisos
    ('view_rol', 'Ver la lista de roles de la empresa'),
    ('manage_rol', 'Crear, editar y eliminar roles (y asignar permisos)'),
    ('view_permiso', 'Ver la lista de permisos globales (para asignar a roles)'),
    ('manage_permiso', 'Crear, editar, eliminar permisos globales (SOLO SUPERADMIN)'),
    # Finanzas
    ('view_presupuesto', 'Ver los presupuestos asignados'),
    ('manage_presupuesto', 'Crear, editar y eliminar presupuestos'),
    # Configuración Activos
    ('view_ubicacion', 'Ver la lista de ubicaciones'),
    ('manage_ubicacion', 'Crear, editar y eliminar ubicaciones'),
    ('view_proveedor', 'Ver la lista de proveedores'),
    ('manage_proveedor', 'Crear, editar y eliminar proveedores'),
    ('view_categoriaactivo', 'Ver las categorías de activos'),
    ('manage_categoriaactivo', 'Crear, editar y eliminar categorías de activos'),
    ('view_estadoactivo', 'Ver los estados de activos'),
    ('manage_estadoactivo', 'Crear, editar y eliminar estados de activos'),
    # Reportes
    ('view_reporte', 'Acceder a la sección de reportes y generar vistas previas'),
    ('export_reporte', 'Exportar reportes a PDF/Excel'),
    # Sistema
    ('view_log', 'Ver la bitácora de acciones'),
    ('manage_settings', 'Acceder a la configuración general del sistema'),
]

class Command(BaseCommand):
    help = 'Crea los permisos globales definidos en PERMISSIONS_LIST si no existen.'

    @transaction.atomic(using='default') # Asegura que se haga en la BD 'default'
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE('Verificando y creando permisos globales...'))
        
        created_count = 0
        skipped_count = 0
        
        for perm_name, perm_desc in PERMISSIONS_LIST:
            # get_or_create evita duplicados y es seguro de ejecutar múltiples veces
            permission, created = Permisos.objects.get_or_create(
                nombre=perm_name,
                defaults={'descripcion': perm_desc} # Solo usa la descripción si se crea nuevo
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'  Creado: {perm_name}'))
                created_count += 1
            else:
                # Opcional: Actualizar descripción si ya existe?
                # if permission.descripcion != perm_desc:
                #     permission.descripcion = perm_desc
                #     permission.save()
                #     self.stdout.write(self.style.WARNING(f'  Actualizado desc: {perm_name}'))
                # else:
                #     self.stdout.write(f'  Ya existe: {perm_name}')
                self.stdout.write(f'  Ya existe: {perm_name}')
                skipped_count += 1

        self.stdout.write(self.style.SUCCESS(f'\nProceso completado.'))
        self.stdout.write(f'  Permisos creados: {created_count}')
        self.stdout.write(f'  Permisos omitidos (ya existían): {skipped_count}')