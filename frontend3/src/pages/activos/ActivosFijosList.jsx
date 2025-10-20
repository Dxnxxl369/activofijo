// src/pages/activos/ActivosFijosList.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Plus, Edit, Trash2, Loader, DollarSign, Tag, MapPin, CheckSquare, Truck } from 'lucide-react';
import { 
    getActivosFijos, createActivoFijo, updateActivoFijo, deleteActivoFijo,
    getCategoriasActivos, getEstados, getUbicaciones, getProveedores
} from '../../api/dataService';
import Modal from '../../components/Modal';
import { useNotification } from '../../context/NotificacionContext';

// --- Formulario de Activo Fijo ---
const ActivoFijoForm = ({ activo, onSave, onCancel }) => {
    
    // Estado para los campos del formulario
    const [formData, setFormData] = useState({
        nombre: activo?.nombre || '',
        codigo_interno: activo?.codigo_interno || '',
        fecha_adquisicion: (activo?.fecha_adquisicion || '').split('T')[0],
        valor_actual: activo?.valor_actual || '',
        vida_util: activo?.vida_util || '',
        // Usamos el ID para los campos <select>
        categoria: activo?.categoria?.id || activo?.categoria || '',
        estado: activo?.estado?.id || activo?.estado || '',
        ubicacion: activo?.ubicacion?.id || activo?.ubicacion || '',
        proveedor: activo?.proveedor?.id || activo?.proveedor || '',
    });
    
    // Estado para cargar los datos de los <select>
    const [formDeps, setFormDeps] = useState({ categorias: [], estados: [], ubicaciones: [], proveedores: [] });
    const [loadingDeps, setLoadingDeps] = useState(true);
    const { showNotification } = useNotification();
    
    useEffect(() => {
        const loadDependencies = async () => {
            try {
                setLoadingDeps(true);
                // Cargamos todas las dependencias en paralelo
                const [catRes, estRes, ubiRes, provRes] = await Promise.all([
                    getCategoriasActivos(),
                    getEstados(),
                    getUbicaciones(),
                    getProveedores()
                ]);
                
                // Asumimos que la API devuelve { results: [...] } o [...]
                setFormDeps({
                    categorias: catRes.results || catRes || [],
                    estados: estRes.results || estRes || [],
                    ubicaciones: ubiRes.results || ubiRes || [],
                    proveedores: provRes.results || provRes || [],
                });
            } catch (error) {
                console.error("Error cargando dependencias del formulario", error);
                showNotification('Error al cargar opciones del formulario', 'error');
            } finally {
                setLoadingDeps(false);
            }
        };
        loadDependencies();
    }, [showNotification]); // Agregamos showNotification como dependencia

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Preparamos los datos para guardar
        const dataToSave = { ...formData };
        
        // Si el proveedor está vacío (string vacío), lo enviamos como 'null'
        // ya que el backend lo permite (blank=True, null=True)
        if (!dataToSave.proveedor) {
            dataToSave.proveedor = null;
        }
        
        onSave(dataToSave);
    };

    if (loadingDeps) {
        return <div className="flex justify-center items-center h-48"><Loader className="animate-spin text-accent" /></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormInput name="nombre" label="Nombre del Activo" value={formData.nombre} onChange={handleChange} required />
            <FormInput name="codigo_interno" label="Código Interno" value={formData.codigo_interno} onChange={handleChange} required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput name="fecha_adquisicion" label="Fecha de Adquisición" type="date" value={formData.fecha_adquisicion} onChange={handleChange} required />
                <FormInput name="valor_actual" label="Valor Actual" type="number" step="0.01" min="0" value={formData.valor_actual} onChange={handleChange} required />
                <FormInput name="vida_util" label="Vida Útil (años)" type="number" step="1" min="1" value={formData.vida_util} onChange={handleChange} required />
                
                <FormSelect name="categoria" label="Categoría" value={formData.categoria} onChange={handleChange} required>
                    {formDeps.categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </FormSelect>
                
                <FormSelect name="estado" label="Estado" value={formData.estado} onChange={handleChange} required>
                    {formDeps.estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </FormSelect>
                
                <FormSelect name="ubicacion" label="Ubicación" value={formData.ubicacion} onChange={handleChange} required>
                    {formDeps.ubicaciones.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                </FormSelect>
                
                <FormSelect name="proveedor" label="Proveedor (Opcional)" value={formData.proveedor} onChange={handleChange}>
                    <option value="">-- Ninguno --</option>
                    {formDeps.proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </FormSelect>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-theme">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-primary hover:bg-tertiary">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-opacity-90">Guardar</button>
            </div>
        </form>
    );
};

// --- Componentes de ayuda para el formulario ---
const FormInput = ({ label, ...props }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-secondary mb-1.5">{label}</label>
        <input {...props} className="w-full p-3 bg-tertiary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormSelect = ({ label, children, ...props }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-secondary mb-1.5">{label}</label>
        <select {...props} className="w-full p-3 bg-tertiary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent appearance-none">
            <option value="" disabled>-- Seleccione --</option>
            {children}
        </select>
    </div>
);

// --- Componente Principal de la Lista ---
export default function ActivosFijosList() {
    const [activos, setActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivo, setEditingActivo] = useState(null);
    const { showNotification } = useNotification();

    const fetchActivosFijos = async () => {
        try {
            setLoading(true);
            const data = await getActivosFijos();
            // Procesamos los datos para mostrar los nombres anidados
            const processedData = (data.results || data || []).map(activo => ({
                ...activo,
                categoria_nombre: activo.categoria?.nombre || 'N/A',
                estado_nombre: activo.estado?.nombre || 'N/A',
                ubicacion_nombre: activo.ubicacion?.nombre || 'N/A',
            }));
            setActivos(processedData);
        } catch (error) { 
            console.error("Error al obtener activos:", error); 
            showNotification('Error al cargar los activos','error');
        } finally { 
            setLoading(false); 
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => { 
        fetchActivosFijos(); 
    }, []);    

    const handleSave = async (data) => {
        try {
            if (editingActivo) {
                await updateActivoFijo(editingActivo.id, data);
                showNotification('Activo actualizado con éxito');
            } else {                
                await createActivoFijo(data);
                showNotification('Activo creado con éxito');
            }
            fetchActivosFijos(); // Recargamos la lista
            setIsModalOpen(false); // Cerramos el modal
            setEditingActivo(null); // Limpiamos el estado de edición
        } catch (error) { 
            console.error("Error al guardar activo:", error.response?.data || error.message); 
            // Manejo de errores de validación del backend
            let errorMsg = 'Error al guardar el activo';
            if (error.response?.data) {
                // Capturamos el primer error que envíe el backend
                const errors = error.response.data;
                const firstErrorKey = Object.keys(errors)[0];
                errorMsg = `${firstErrorKey}: ${errors[firstErrorKey][0]}`;
            }
            showNotification(errorMsg, 'error');
        }    
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este activo fijo?')) {
            try {
                await deleteActivoFijo(id);
                showNotification('Activo eliminado con éxito');
                fetchActivosFijos(); // Recargamos la lista
            } catch (error) { 
                console.error("Error al eliminar:", error); 
                showNotification('Error al eliminar el activo','error');
            }
        }
    };

    // Funciones para abrir el modal
    const openCreateModal = () => {
        setEditingActivo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (activo) => {
        setEditingActivo(activo);
        setIsModalOpen(true);
    };
    
    return (
        <>            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* --- Encabezado de la página --- */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-primary mb-2">Activos Fijos</h1>
                        <p className="text-secondary">Gestiona los bienes y propiedades de tu empresa.</p>
                    </div>
                    <button onClick={openEditModal} className="flex items-center gap-2 bg-accent text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-transform active:scale-95">
                        <Plus size={20} /> Nuevo Activo
                    </button>
                </div>
                
                {/* --- Contenedor de la lista --- */}
                <div className="bg-secondary border border-theme rounded-xl p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-48"><Loader className="animate-spin text-accent" /></div>
                    ) : activos.length === 0 ? (
                        <p className="text-center text-tertiary py-12">No hay activos fijos para mostrar.</p>
                    ) : (
                        activos.map((activo, index) => (
                            <motion.div
                                key={activo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex flex-col md:flex-row items-start md:items-center p-3 border-b border-theme last:border-b-0 hover:bg-tertiary rounded-lg"
                            >
                                <div className="p-3 bg-accent bg-opacity-10 rounded-lg mr-4 mb-2 md:mb-0">
                                    <Box className="text-accent" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
                                    {/* Columna 1: Nombre y Código */}
                                    <div>
                                        <p className="font-semibold text-primary">{activo.nombre}</p>
                                        <p className="text-sm text-secondary flex items-center gap-1.5"><Tag size={14} /> {activo.codigo_interno}</p>
                                    </div>
                                    {/* Columna 2: Estado y Ubicación */}
                                    <div>
                                        <p className="text-primary flex items-center gap-1.5"><CheckSquare size={14} /> {activo.estado_nombre}</p>
                                        <p className="text-secondary text-sm flex items-center gap-1.5"><MapPin size={14} /> {activo.ubicacion_nombre}</p>
                                    </div>
                                    {/* Columna 3: Valor y Categoría */}
                                    <div>
                                        <p className="text-primary font-medium flex items-center gap-1.5"><DollarSign size={14} /> {parseFloat(activo.valor_actual).toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}</p>
                                        <p className="text-secondary text-sm flex items-center gap-1.5"><Tag size={14} /> {activo.categoria_nombre}</p>
                                    </div>
                                    {/* Columna 4: Fecha Adquisición */}
                                    <div>
                                        <p className="text-primary text-sm font-medium">Adquirido:</p>
                                        <p className="text-secondary text-sm">{new Date(activo.fecha_adquisicion + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                {/* Botones de Acción */}
                                <div className="flex gap-2 ml-auto mt-2 md:mt-0 md:ml-4">
                                    <button onClick={() => openEditModal(activo)} className="p-2 text-primary hover:text-accent"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(activo.id)} className="p-2 text-primary hover:text-red-500"><Trash2 size={18} /></button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>

            {/* --- Modal de Creación/Edición --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingActivo ? "Editar Activo Fijo" : "Nuevo Activo Fijo"}>
                <ActivoFijoForm 
                    activo={editingActivo} 
                    onSave={handleSave} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>
        </>
    );
}