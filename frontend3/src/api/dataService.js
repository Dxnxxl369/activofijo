// src/api/dataService.js
import apiClient from './axiosConfig';
import { logAction } from './logService';

// --- Funciones para Departamentos ---
export const getDepartamentos = async () => {
    const response = await apiClient.get('/departamentos/');
    return response.data;
};

export const createDepartamento = async (data) => {
    const response = await apiClient.post('/departamentos/', data);
    await logAction('CREATE: Departamento', { 
        id_creado: response.data.id,
        nombre: data.nombre 
    });
    return response.data;
};

export const updateDepartamento = async (id, data) => {
    const response = await apiClient.put(`/departamentos/${id}/`, data);
    await logAction('UPDATE: Departamento', { id: id, ...data });
    return response.data;
};

export const deleteDepartamento = async (id) => {
    await apiClient.delete(`/departamentos/${id}/`);
    await logAction('DELETE: Departamento', { id: id });
    // No hay return
};

// --- Funciones para Activos Fijos ---
export const getActivosFijos = async () => {
    const response = await apiClient.get('/activos-fijos/');
    return response.data;
};

export const createActivoFijo = async (data) => {
    const response = await apiClient.post('/activos-fijos/', data);
    await logAction('CREATE: ActivoFijo', { id_creado: response.data.id, nombre: data.nombre, codigo: data.codigo_interno });
    return response.data;
};

export const updateActivoFijo = async (id, data) => {
    const response = await apiClient.put(`/activos-fijos/${id}/`, data);
    await logAction('UPDATE: ActivoFijo', { id: id, ...data });
    return response.data;
};

export const deleteActivoFijo = async (id) => {
    await apiClient.delete(`/activos-fijos/${id}/`);
    await logAction('DELETE: ActivoFijo', { id: id });
    // No hay return
};

// --- Funciones para Cargos ---
export const getCargos = async () => {
    const response = await apiClient.get('/cargos/');
    return response.data;
};

export const createCargo = async (data) => {
    const response = await apiClient.post('/cargos/', data);
    await logAction('CREATE: Cargo', { id_creado: response.data.id, nombre: data.nombre });
    return response.data;
};

export const updateCargo = async (id, data) => {
    const response = await apiClient.put(`/cargos/${id}/`, data);
    await logAction('UPDATE: Cargo', { id: id, ...data });
    return response.data;
};

export const deleteCargo = async (id) => {
    await apiClient.delete(`/cargos/${id}/`);
    await logAction('DELETE: Cargo', { id: id });
    // No hay return
};

// --- Funciones para Empleados ---
export const getEmpleados = async () => {
    const response = await apiClient.get('/empleados/');
    return response.data;
};

export const createEmpleado = async (data) => {
    const response = await apiClient.post('/empleados/', data);
    await logAction('CREATE: Empleado', { 
        id_creado: response.data.id, 
        username: data.username,
        email: data.email
    });
    return response.data;
};

export const updateEmpleado = async (id, data) => {
    const response = await apiClient.patch(`/empleados/${id}/`, data); // Usamos PATCH
    await logAction('UPDATE: Empleado', { id: id, ...data });
    return response.data;
};

export const deleteEmpleado = async (id) => {
    await apiClient.delete(`/empleados/${id}/`);
    await logAction('DELETE: Empleado', { id: id });
    // No hay return
};

// --- Funciones para Roles y Permisos ---
export const getRoles = async () => {
    const response = await apiClient.get('/roles/');
    return response.data;
};

export const createRol = async (data) => {
    const response = await apiClient.post('/roles/', data);
    await logAction('CREATE: Rol', { id_creado: response.data.id, nombre: data.nombre, permisos: data.permisos });
    return response.data;
};

export const updateRol = async (id, data) => {
    const response = await apiClient.put(`/roles/${id}/`, data);
    await logAction('UPDATE: Rol', { id: id, ...data });
    return response.data;
};

export const deleteRol = async (id) => {
    await apiClient.delete(`/roles/${id}/`);
    await logAction('DELETE: Rol', { id: id });
    // No hay return
};


// --- Funciones para Presupuestos ---
export const getPresupuestos = async () => {
    const response = await apiClient.get('/presupuestos/');
    return response.data;
};

export const createPresupuesto = async (data) => {
    const response = await apiClient.post('/presupuestos/', data);
    await logAction('CREATE: Presupuesto', { id_creado: response.data.id, monto: data.monto, departamento_id: data.departamento_id });
    return response.data;
};

export const updatePresupuesto = async (id, data) => {
    const response = await apiClient.put(`/presupuestos/${id}/`, data);
    await logAction('UPDATE: Presupuesto', { id: id, ...data });
    return response.data;
};

export const deletePresupuesto = async (id) => {
    await apiClient.delete(`/presupuestos/${id}/`);
    await logAction('DELETE: Presupuesto', { id: id });
    // No hay return
};

// --- Funciones para Ubicaciones ---
export const getUbicaciones = async () => {
    const response = await apiClient.get('/ubicaciones/');
    return response.data;
};

export const createUbicacion = async (data) => {
    const response = await apiClient.post('/ubicaciones/', data);
    await logAction('CREATE: Ubicacion', { id_creado: response.data.id, nombre: data.nombre });
    return response.data;
};

export const updateUbicacion = async (id, data) => {
    const response = await apiClient.put(`/ubicaciones/${id}/`, data);
    await logAction('UPDATE: Ubicacion', { id: id, ...data });
    return response.data;
};

export const deleteUbicacion = async (id) => {
    await apiClient.delete(`/ubicaciones/${id}/`);
    await logAction('DELETE: Ubicacion', { id: id });
    // No hay return
};

// --- Funciones para Proveedores ---
export const getProveedores = async () => {
    const response = await apiClient.get('/proveedores/');
    return response.data;
};

export const createProveedor = async (data) => {
    const response = await apiClient.post('/proveedores/', data);
    await logAction('CREATE: Proveedor', { id_creado: response.data.id, nombre: data.nombre, nit: data.nit });
    return response.data;
};

export const updateProveedor = async (id, data) => {
    const response = await apiClient.put(`/proveedores/${id}/`, data);
    await logAction('UPDATE: Proveedor', { id: id, ...data });
    return response.data;
};

export const deleteProveedor = async (id) => {
    await apiClient.delete(`/proveedores/${id}/`);
    await logAction('DELETE: Proveedor', { id: id });
    // No hay return
};

// --- Funciones para Categorías de Activos ---
export const getCategoriasActivos = async () => {
    const response = await apiClient.get('/categorias-activos/');
    return response.data;
};

export const createCategoriaActivo = async (data) => {
    const response = await apiClient.post('/categorias-activos/', data);
    await logAction('CREATE: CategoriaActivo', { id_creado: response.data.id, nombre: data.nombre });
    return response.data;
};

export const updateCategoriaActivo = async (id, data) => {
    const response = await apiClient.put(`/categorias-activos/${id}/`, data);
    await logAction('UPDATE: CategoriaActivo', { id: id, ...data });
    return response.data;
};

export const deleteCategoriaActivo = async (id) => {
    await apiClient.delete(`/categorias-activos/${id}/`);
    await logAction('DELETE: CategoriaActivo', { id: id });
    // No hay return
};

// --- Funciones para Estados de Activos ---
export const getEstados = async () => {
    const response = await apiClient.get('/estados/');
    return response.data;
};

export const createEstado = async (data) => {
    const response = await apiClient.post('/estados/', data);
    await logAction('CREATE: Estado', { id_creado: response.data.id, nombre: data.nombre });
    return response.data;
};

export const updateEstado = async (id, data) => {
    const response = await apiClient.put(`/estados/${id}/`, data);
    await logAction('UPDATE: Estado', { id: id, ...data });
    return response.data;
};

export const deleteEstado = async (id) => {
    await apiClient.delete(`/estados/${id}/`);
    await logAction('DELETE: Estado', { id: id });
    // No hay return
};

//PARA REPORTES
// --- Funciones para Reportes ---

/**
 * Obtiene los datos de vista previa del reporte en JSON.
 * @param {object} params - Objeto con filtros (departamento_id, fecha_min, fecha_max)
 */
export const downloadReporteActivos = async (params) => {
    // Define the correct path relative to the baseURL
    const urlPath = 'reportes/activos-export/'; 

    console.log(`Attempting GET request to: ${apiClient.defaults.baseURL}/${urlPath}`); // Log URL before try
    console.log("With parameters:", params); // Log params before try

    try { 
        const response = await apiClient.get(urlPath, { // Use the correct path variable
            params,
            responseType: 'blob',
        });

        // --- Download Logic (No changes needed here) ---
        const contentType = response.headers['content-type'];
        let filename = "reporte.dat";
        if (params.format === 'excel') {
            filename = "reporte_activos.xlsx";
        } else { // Default to PDF
            filename = "reporte_activos.pdf";
        }       
        const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove(); 
        console.log("Download initiated successfully."); // Log success inside try
        // --- End Download Logic ---

    } catch (error) {
        // Log the detailed error from Axios
        console.error("Axios error during download:", error.toJSON ? error.toJSON() : error);
        
        // Re-throw the error so the calling component (.catch or await) knows it failed
        throw error; 
    }
};

// Keep the corrected getReporteActivosPreview function (without leading slash)
export const getReporteActivosPreview = async (params) => {
    const urlPath = 'reportes/activos-preview/'; // NO leading slash
    console.log(`Attempting GET request to: ${apiClient.defaults.baseURL}/${urlPath}`);
    console.log("With parameters:", params);
    try {
        const response = await apiClient.get(urlPath, { params }); 
        return response.data; // Return the actual data
    } catch (error) {
        console.error("Error fetching report preview:", error.response?.data || error.message);
        throw error; // Re-throw so the component knows about the error
    }
};
// --- Funciones para Permisos (CRUD Completo) ---
export const getPermisos = async () => {
    const response = await apiClient.get('/permisos/');
    return response.data;
};

export const createPermiso = async (data) => {
    const response = await apiClient.post('/permisos/', data);
    await logAction('CREATE: Permiso', { id_creado: response.data.id, nombre: data.nombre });
    return response.data;
};

export const updatePermiso = async (id, data) => {
    const response = await apiClient.put(`/permisos/${id}/`, data);
    await logAction('UPDATE: Permiso', { id: id, ...data });
    return response.data;
};

export const deletePermiso = async (id) => {
    await apiClient.delete(`/permisos/${id}/`);
    await logAction('DELETE: Permiso', { id: id });
    // No hay return
};
