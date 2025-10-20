// src/pages/roles/RolesList.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Plus, Edit, Trash2, Loader } from 'lucide-react';
import { getRoles, createRol, updateRol, deleteRol, getPermisos } from '../../api/dataService';
import Modal from '../../components/Modal';
import { useNotification } from '../../context/NotificacionContext';

// --- Componentes de ayuda del Formulario ---
const FormInput = ({ label, ...props }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-secondary mb-1.5">{label}</label>
        <input {...props} className="w-full p-3 bg-tertiary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

// --- Formulario de Rol ---
const RolForm = ({ rol, onSave, onCancel }) => {
    const [nombre, setNombre] = useState(rol?.nombre || '');
    // Guardamos los IDs de los permisos seleccionados
    const [permisosSeleccionados, setPermisosSeleccionados] = useState(rol?.permisos?.map(p => p.id) || rol?.permisos || []);
    
    const [permisosDisponibles, setPermisosDisponibles] = useState([]);
    const [loadingDeps, setLoadingDeps] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        const loadPermisos = async () => {
            try {
                setLoadingDeps(true);
                const data = await getPermisos();
                setPermisosDisponibles(data.results || data || []);
            } catch (error) {
                console.error("Error al cargar permisos:", error);
                showNotification('Error al cargar la lista de permisos', 'error');
            } finally {
                setLoadingDeps(false);
            }
        };
        loadPermisos();
    }, [showNotification]);

    const handleMultiSelectChange = (e) => {
        const { options } = e.target;
        const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
        setPermisosSeleccionados(selectedValues);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nombre, permisos: permisosSeleccionados });
    };

    if (loadingDeps) {
        return <div className="flex justify-center items-center h-48"><Loader className="animate-spin text-accent" /></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Nombre del Rol" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Administrador" required />
            
            <div className="flex flex-col">
                <label className="text-sm font-medium text-secondary mb-1.5">Permisos</label>
                <select 
                    multiple 
                    value={permisosSeleccionados} 
                    onChange={handleMultiSelectChange} 
                    className="w-full p-3 h-40 bg-tertiary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                >
                    {permisosDisponibles.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                </select>
                <p className="text-xs text-tertiary mt-1">Mantén Ctrl (o Cmd en Mac) para seleccionar varios.</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-primary hover:bg-tertiary">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-opacity-90">Guardar</button>
            </div>
        </form>
    );
};


// --- Componente Principal de la Lista ---
export default function RolesList() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRol, setEditingRol] = useState(null);
    const { showNotification } = useNotification();

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const data = await getRoles();
            setRoles(data.results || data || []);
        } catch (error) { 
            console.error("Error al obtener roles:", error); 
            showNotification('Error al cargar los roles','error');
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchRoles(); }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRol(null);
    };

    const handleSave = async (data) => {
        try {
            if (editingRol) {
                await updateRol(editingRol.id, data);
                showNotification('Rol actualizado con éxito');
            } else {                
                await createRol(data);
                showNotification('Rol creado con éxito');
            }
            fetchRoles();
            handleCloseModal();
        } catch (error) { 
            console.error("Error al guardar:", error.response?.data || error); 
            showNotification('Error al guardar el rol', 'error');
        }    
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este rol?')) {
            try {
                await deleteRol(id);
                showNotification('Rol eliminado con éxito');
                fetchRoles();
            } catch (error) { 
                console.error("Error al eliminar:", error); 
                showNotification('Error al eliminar el rol','error');
            }
        }
    };
    
    return (
        <>            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-primary mb-2">Roles</h1>
                        <p className="text-secondary">Gestiona los roles y permisos de los usuarios.</p>
                    </div>
                    <button onClick={() => { setEditingRol(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-accent text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-transform active:scale-95">
                        <Plus size={20} /> Nuevo Rol
                    </button>
                </div>
                
                <div className="bg-secondary border border-theme rounded-xl p-4">
                    {loading ? <div className="flex justify-center items-center h-48"><Loader className="animate-spin text-accent" /></div> :
                    roles.length === 0 ? <p className="text-center text-tertiary py-12">No hay roles para mostrar.</p> :
                    roles.map((rol, index) => (
                        <motion.div
                            key={rol.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center p-3 border-b border-theme last:border-b-0 hover:bg-tertiary rounded-lg"
                        >
                            <div className="p-3 bg-accent bg-opacity-10 rounded-lg mr-4">
                                <ShieldCheck className="text-accent" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-primary">{rol.nombre}</p>
                                <p className="text-sm text-secondary">
                                    {rol.permisos.length} {rol.permisos.length === 1 ? 'permiso' : 'permisos'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingRol(rol); setIsModalOpen(true); }} className="p-2 text-primary hover:text-accent"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(rol.id)} className="p-2 text-primary hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRol ? "Editar Rol" : "Nuevo Rol"}>
                <RolForm rol={editingRol} onSave={handleSave} onCancel={handleCloseModal} />
            </Modal>
        </>
    );
}