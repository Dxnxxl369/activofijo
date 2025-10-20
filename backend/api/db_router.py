# api/db_router.py

class LogRouter:
    """
    Un router robusto que asegura que el modelo Log vaya a la BD 'logs'
    y todo lo demás (incluyendo 'auth', 'admin', etc.) vaya a 'default'.
    """

    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'api' and model._meta.model_name == 'log':
            return 'logs'
        # Para todo lo demás, permite leer desde 'default'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'api' and model._meta.model_name == 'log':
            return 'logs'
        # Para todo lo demás, permite escribir en 'default'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Permite relaciones si ambos objetos están en la BD 'default' O
        si la relación es entre 'default' (ej: User) y 'logs' (ej: Log).
        """
        if (
            obj1._state.db in ("default", "logs")
            and obj2._state.db in ("default", "logs")
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Controla qué modelo va a qué base de datos en las migraciones.
        """
        
        # --- Lógica para la BD 'logs' ---
        if db == 'logs':
            if app_label == 'api' and model_name == 'log':
                # Si es la BD 'logs', solo permite el modelo Log
                return True
            else:
                # Bloquea todo lo demás ('auth', 'admin', otros modelos de 'api')
                return False

        # --- Lógica para la BD 'default' ---
        if db == 'default':
            if app_label == 'api' and model_name == 'log':
                # Bloquea el modelo Log de la BD 'default'
                return False
            else:
                # Permite todo lo demás ('auth', 'admin', otros modelos de 'api')
                return True
                
        return None