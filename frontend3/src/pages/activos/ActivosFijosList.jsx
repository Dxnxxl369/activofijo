// src/pages/activos/ActivosFijosList.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Plus, Edit, Trash2, Loader } from 'lucide-react';
import { getActivos, createActivo, updateActivo, deleteActivo, getCategoriasActivos, getEstados, getUbicaciones, getProveedores } from '../../api/dataService';
import Modal from '../../components/Modal';


// Formulario para Crear/Editar
const ActivoForm = ({ activo, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: activo?.nombre || '',
        codigo_interno: activo?.codigo_interno || '',
        fecha_adquisicion: activo?.fecha_adquisicion || new Date().toISOString().split('T')[0],
        valor_actual: activo?.valor_actual || '',
        vida_util: activo?.vida_util || '',
        categoria: activo?.categoria?.id || '',
        estado: activo?.estado?.id || '',
        ubicacion: activo?.ubicacion?.id || '',
        proveedor: activo?.proveedor?.id || '',
    });
    const [options, setOptions] = useState({ categorias: [], estados: [], ubicaciones: [], proveedores: [] });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [cat, est, ubi, prov] = await Promise.all([ getCategoriasActivos(), getEstados(), getUbicaciones(), getProveedores() ]);
                setOptions({ categorias: cat, estados: est, ubicaciones: ubi, proveedores: prov });
                if (!activo) { // Si es un nuevo activo, asigna valores por defecto
                    setFormData(prev => ({ ...prev, categoria: cat[0]?.id || '', estado: est[0]?.id || '', ubicacion: ubi[0]?.id || '' }));
                }
            } catch (error) { console.error("Error al cargar opciones:", error); }
        };
        fetchOptions();
    }, [activo]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del Activo" required className="input input-bordered w-full bg-tertiary" />
            <input name="codigo_interno" value={formData.codigo_interno} onChange={handleChange} placeholder="Código Interno" required className="input input-bordered w-full bg-tertiary" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="valor_actual" type="number" step="0.01" value={formData.valor_actual} onChange={handleChange} placeholder="Valor Actual" required className="input input-bordered w-full bg-tertiary" />
                <input name="vida_util" type="number" value={formData.vida_util} onChange={handleChange} placeholder="Vida Útil (años)" required className="input input-bordered w-full bg-tertiary" />
            </div>
            <input name="fecha_adquisicion" type="date" value={formData.fecha_adquisicion} onChange={handleChange} required className="input input-bordered w-full bg-tertiary" />
            <select name="categoria" value={formData.categoria} onChange={handleChange} required className="select select-bordered w-full bg-tertiary"><option value="">-- Categoría --</option>{options.categorias.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select>
            <select name="estado" value={formData.estado} onChange={handleChange} required className="select select-bordered w-full bg-tertiary"><option value="">-- Estado --</option>{options.estados.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select>
            <select name="ubicacion" value={formData.ubicacion} onChange={handleChange} required className="select select-bordered w-full bg-tertiary"><option value="">-- Ubicación --</option>{options.ubicaciones.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select>
            <select name="proveedor" value={formData.proveedor || ''} onChange={handleChange} className="select select-bordered w-full bg-tertiary"><option value="">-- Proveedor (Opcional) --</option>{options.proveedores.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select>
            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="btn btn-ghost">Cancelar</button>
                <button type="submit" className="btn btn-accent text-white">Guardar</button>
            </div>
        </form>
    );
};

export default function ActivosFijosList() {
    const [activos, setActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivo, setEditingActivo] = useState(null);

    const fetchActivos = async () => { 
        try{
            setLoading(true);
            const data = await getActivos();
            setActivos(data.results || data || []);            
        }catch(error){
            console.log("Error al obtener activos fijos", error);
            showNotification("Error al cargar los datos",'error');
        }
        finally{setLoading(false);}
    };
    
    
    useEffect(() => { fetchActivos(); }, []);    
    
    const handleSave = async (data) => {
        try {
            if (editingActivo) {
                await updateActivo(editingActivo.id , data);
                showNotification('Activo Fijo actualizado con éxito');
            } else {                
                await createActivo(data);
                showNotification('Activo fijo creado con éxito');
            }
            fetchActivos();
            setIsModalOpen(false);
        } catch (error) { 
            console.error("Error al guardar:", error); 
            showNotification('Error al guardar el activos fijos', 'error');
        }    
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este activo fijo?')) {
            try {
                await deleteActivo(id);
                showNotification('Activo fijo eliminado con éxito');
                fetchActivos();
            } catch (error) { 
                console.error("Error al eliminar:", error); 
                showNotification('Error al eliminar el activo fijo','error');
            }
        }
    };
    

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-primary mb-2">Activos Fijos</h1>
                        <p className="text-secondary">Administra el inventario de activos de tu empresa.</p>
                    </div>
                    <button onClick={() => { setEditingActivo(null); setIsModalOpen(true); }} className="btn btn-accent text-white gap-2">
                        <Plus size={20} /> Nuevo Activo
                    </button>
                </div>
                <div className="bg-secondary border border-theme rounded-xl p-4">
                    {loading ? <div className="h-48 flex justify-center items-center"><Loader className="animate-spin text-accent" /></div> :
                    activos.length === 0 ? <p className="text-center text-tertiary py-12">No hay activos para mostrar.</p> :
                    activos.map((activo, index) => (
                        <motion.div key={activo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center p-3 border-b border-theme last:border-b-0 hover:bg-tertiary rounded-lg">
                            <div className="p-3 bg-accent bg-opacity-10 rounded-lg mr-4"><Box className="text-accent" /></div>
                            <div className="flex-1 grid grid-cols-3 gap-4">
                                <div><p className="font-semibold text-primary">{activo.nombre}</p><p className="text-sm text-secondary">{activo.codigo_interno}</p></div>
                                <div><p className="font-semibold text-primary">${parseFloat(activo.valor_actual).toFixed(2)}</p><p className="text-sm text-secondary">Valor Actual</p></div>
                                <div><p className="font-semibold text-primary">{activo.categoria.nombre}</p><p className="text-sm text-secondary">Categoría</p></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingActivo(activo); setIsModalOpen(true); }} className="btn btn-ghost btn-sm btn-square text-primary hover:text-accent"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(activo.id)} className="btn btn-ghost btn-sm btn-square text-primary hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingActivo ? "Editar Activo Fijo" : "Nuevo Activo Fijo"}>
                <ActivoForm activo={editingActivo} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </>
    );
}    
