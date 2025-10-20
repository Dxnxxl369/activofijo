// src/api/logService.js
import apiClient from './axiosConfig';

/**
 * Envía un registro de auditoría al backend.
 * Falla silenciosamente para no interrumpir al usuario.
 * @param {string} accion - Descripción de la acción. Ej: "CREATE: Departamento"
 * @param {object} payload - Datos relevantes de la acción (opcional).
 */
export const logAction = async (accion, payload = {}) => {
    try {
        // Tu backend espera 'accion' y 'payload' según LogSerializer
        await apiClient.post('logs/', {
            accion: accion,
            payload: payload
        });
    } catch (error) {
        // Fallamos silenciosamente.
        // El log no es tan crítico como para detener la acción principal del usuario.
        console.warn('Fallo al registrar la acción en la bitácora:', error);
    }
};