// src/api/dataService.js
import apiClient from './axiosConfig';

export const getDepartamentos = async () => {
    const response = await apiClient.get('/departamentos/');
    return response.data
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

// --- ACTIVOS FIJOS ---
export const getActivos = async () => {
    const response = await apiClient.get('/activos-fijos/');
    return response.data;
};

export const createActivo = async (data) => {
    const response = await apiClient.post('/activos-fijos/', data);
    return response.data;
};

export const updateActivo = async (id, data) => {
    const response = await apiClient.put(`/activos-fijos/${id}/`, data);
    return response.data;
};

export const deleteActivo = async (id) => {
    await apiClient.delete(`/activos-fijos/${id}/`);
};

// --- FUNCIONES PARA OBTENER OPCIONES DE FORMULARIO ---
export const getCategoriasActivos = async () => {
    const response = await apiClient.get('/categorias-activos/');
    return response.data.results || [];
};
export const getEstados = async () => {
    const response = await apiClient.get('/estados/');
    return response.data.results || [];
};
export const getUbicaciones = async () => {
    const response = await apiClient.get('/ubicaciones/');
    return response.data.results || [];
};
export const getProveedores = async () => {
    const response = await apiClient.get('/proveedores/');
    return response.data.results || [];
};