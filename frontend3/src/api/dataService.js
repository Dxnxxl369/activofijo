// src/api/dataService.js
import apiClient from './axiosConfig';

// --- DEPARTAMENTOS ---
export const getDepartamentos = async () => {
    const response = await apiClient.get('/departamentos/');
    return response.data.results || []; // Accedemos a 'results' por la paginación de Django
};

export const createDepartamento = async (data) => {
    const response = await apiClient.post('/departamentos/', data);
    return response.data;
};

export const updateDepartamento = async (id, data) => {
    const response = await apiClient.put(`/departamentos/${id}/`, data);
    return response.data;
};

export const deleteDepartamento = async (id) => {
    await apiClient.delete(`/departamentos/${id}/`);
};