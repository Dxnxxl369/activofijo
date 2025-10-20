# api/db_router.py

class LogRouter:
    """
    Un router para controlar todas las operaciones de la base de datos
    en el modelo Log de la aplicación 'api'.
    """

    def db_for_read(self, model, **hints):
        """
        Lecturas del modelo Log van a la base de datos 'logs'.
        """
        if model._meta.app_label == 'api' and model._meta.model_name == 'log':
            return 'logs'
        return None

    def db_for_write(self, model, **hints):
        """
        Escrituras del modelo Log van a la base de datos 'logs'.
        """
        if model._meta.app_label == 'api' and model._meta.model_name == 'log':
            return 'logs'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Permite relaciones entre la BD 'default' y la BD 'logs'.
        Esto es crucial para que tu modelo Log pueda tener una
        ForeignKey al modelo User (que vive en 'default').
        """
        db_list = ('default', 'logs')
        if obj1._state.db in db_list and obj2._state.db in db_list:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Controla qué modelo va a qué base de datos en las migraciones.
        """
        if app_label == 'api':
            if model_name == 'log':
                # El modelo Log SÓLO debe migrarse a la BD 'logs'
                return db == 'logs'
            else:
                # Los otros modelos de 'api' (ActivoFijo, Empleado, etc.)
                # SÓLO deben migrarse a la BD 'default'
                return db == 'default'
        
        # Para otras apps (como 'auth', 'admin', 'contenttypes')
        # solo permítelas en 'default'. No las queremos en la BD 'logs'.
        if db == 'logs':
            return False # No migrar 'auth', etc. a la BD de logs
        
        # Permitir que 'auth', 'admin', etc. se migren a 'default'
        return True