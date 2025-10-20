// src/api/dataService.js
import apiClient from './axiosConfig';
import { logAction } from './logService';

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
// --- Funciones para Activos Fijos ---
export const getActivosFijos = async () => {
    const response = await apiClient.get('activos-fijos/');
    return response.data;
};

export const createActivoFijo = async (data) => {
    const response = await apiClient.post('activos-fijos/', data);
    return response.data;
};

export const updateActivoFijo = async (id, data) => {
    const response = await apiClient.put(`activos-fijos/${id}/`, data);
    return response.data;
};

export const deleteActivoFijo = async (id) => {
    const response = await apiClient.delete(`activos-fijos/${id}/`);
    return response.data;
};

// --- Funciones para Cargos ---
export const getCargos = async () => {
    const response = await apiClient.get('cargos/');
    return response.data;
};

export const createCargo = async (data) => {
    const response = await apiClient.post('cargos/', data);
    return response.data;
};

export const updateCargo = async (id, data) => {
    const response = await apiClient.put(`cargos/${id}/`, data);
    return response.data;
};

export const deleteCargo = async (id) => {
    const response = await apiClient.delete(`cargos/${id}/`);
    return response.data;
};

// --- Funciones para Roles (necesarias para el form de Empleados) ---
export const getRoles = async () => {
    const response = await apiClient.get('roles/');
    return response.data;
};

// --- Funciones para Empleados ---
export const getEmpleados = async () => {
    const response = await apiClient.get('empleados/');
    return response.data;
};

export const createEmpleado = async (data) => {
    // Esta data debe incluir username, password, first_name, email, etc.
    const response = await apiClient.post('empleados/', data);
    return response.data;
};

export const updateEmpleado = async (id, data) => {
    // Esta data solo actualiza campos del modelo Empleado (sueldo, cargo, etc.)
    const response = await apiClient.patch(`empleados/${id}/`, data); // Usamos PATCH para actualizaciones parciales
    return response.data;
};

export const deleteEmpleado = async (id) => {
    const response = await apiClient.delete(`empleados/${id}/`);
    return response.data;
};

// --- Funciones para Permisos (los necesita el formulario de Roles) ---
export const getPermisos = async () => {
    const response = await apiClient.get('permisos/');
    return response.data;
};

// --- Funciones para Roles ---
// getRoles ya lo tenías, pero aquí van los que faltan
export const createRol = async (data) => {
    // data debe ser { nombre: "...", permisos: [id1, id2, ...] }
    const response = await apiClient.post('roles/', data);
    return response.data;
};

export const updateRol = async (id, data) => {
    const response = await apiClient.put(`roles/${id}/`, data);
    return response.data;
};

export const deleteRol = async (id) => {
    const response = await apiClient.delete(`roles/${id}/`);
    return response.data;
};

// --- Funciones para Presupuestos ---
export const getPresupuestos = async () => {
    const response = await apiClient.get('presupuestos/');
    return response.data;
};

export const createPresupuesto = async (data) => {
    // data debe ser { monto: "...", departamento_id: "..." }
    const response = await apiClient.post('presupuestos/', data);
    return response.data;
};

export const updatePresupuesto = async (id, data) => {
    const response = await apiClient.put(`presupuestos/${id}/`, data);
    return response.data;
};

export const deletePresupuesto = async (id) => {
    const response = await apiClient.delete(`presupuestos/${id}/`);
    return response.data;
};

// --- Funciones para Ubicaciones ---
export const getUbicaciones = async () => {
    const response = await apiClient.get('ubicaciones/');
    return response.data;
};

export const createUbicacion = async (data) => {
    const response = await apiClient.post('ubicaciones/', data);
    return response.data;
};

export const updateUbicacion = async (id, data) => {
    const response = await apiClient.put(`ubicaciones/${id}/`, data);
    return response.data;
};

export const deleteUbicacion = async (id) => {
    const response = await apiClient.delete(`ubicaciones/${id}/`);
    return response.data;
};

// --- Funciones para Proveedores ---
export const getProveedores = async () => {
    const response = await apiClient.get('proveedores/');
    return response.data;
};

export const createProveedor = async (data) => {
    const response = await apiClient.post('proveedores/', data);
    return response.data;
};

export const updateProveedor = async (id, data) => {
    const response = await apiClient.put(`proveedores/${id}/`, data);
    return response.data;
};

export const deleteProveedor = async (id) => {
    const response = await apiClient.delete(`proveedores/${id}/`);
    return response.data;
};

// --- Funciones para Categorías de Activos ---
export const getCategoriasActivos = async () => {
    const response = await apiClient.get('categorias-activos/');
    return response.data;
};

export const createCategoriaActivo = async (data) => {
    const response = await apiClient.post('categorias-activos/', data);
    return response.data;
};

export const updateCategoriaActivo = async (id, data) => {
    const response = await apiClient.put(`categorias-activos/${id}/`, data);
    return response.data;
};

export const deleteCategoriaActivo = async (id) => {
    const response = await apiClient.delete(`categorias-activos/${id}/`);
    return response.data;
};

// --- Funciones para Estados de Activos ---
export const getEstados = async () => {
    const response = await apiClient.get('estados/');
    return response.data;
};

export const createEstado = async (data) => {
    const response = await apiClient.post('estados/', data);
    return response.data;
};

export const updateEstado = async (id, data) => {
    const response = await apiClient.put(`estados/${id}/`, data);
    return response.data;
};

export const deleteEstado = async (id) => {
    const response = await apiClient.delete(`estados/${id}/`);
    return response.data;
};