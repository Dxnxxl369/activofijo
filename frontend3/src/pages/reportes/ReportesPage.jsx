// src/pages/reportes/ReportesPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, FileDown, Loader, Filter } from 'lucide-react';
import { getUbicaciones, getReporteActivosPreview, downloadReporteActivos } from '../../api/dataService';
import { useNotification } from '../../context/NotificacionContext';

// --- Componentes de ayuda del Formulario ---
const FormInput = ({ label, ...props }) => (
    <div className="flex flex-col flex-1">
        <label className="text-sm font-medium text-secondary mb-1.5">{label}</label>
        <input {...props} className="w-full p-3 bg-tertiary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);
const FormSelect = ({ label, children, ...props }) => (
    <div className="flex flex-col flex-1">
        <label className="text-sm font-medium text-secondary mb-1.5">{label}</label>
        <select {...props} className="w-full p-3 bg-tertiary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent appearance-none">
            {children}
        </select>
    </div>
);
// --- Fin de Componentes de ayuda ---

export default function ReportesPage() {
    const [loading, setLoading] = useState(false);
    const [loadingExport, setLoadingExport] = useState(false);
    
    // Filtros
    const [ubicaciones, setUbicaciones] = useState([]);
    const [selectedUbicacion, setSelectedUbicacion] = useState('');
    const [fechaMin, setFechaMin] = useState('');
    const [fechaMax, setFechaMax] = useState('');
    
    // Resultados
    const [resultados, setResultados] = useState(null);
    
    const { showNotification } = useNotification();

    // Cargar departamentos para el filtro
    useEffect(() => {
        const loadDeptos = async () => {
            try {
                const data = await getUbicaciones(); // <-- CAMBIADO
                setUbicaciones(data.results || data || []); // <-- CAMBIADO
            } catch (error) {
                showNotification('Error al cargar ubicaciones', 'error'); // <-- CAMBIADO
            }
        };
        loadUbicaciones();
    }, [showNotification]);

    const buildParams = () => {
        const params = {};
        if (selectedUbicacion) params.ubicacion_id = selectedUbicacion; // <-- CAMBIADO
        if (fechaMin) params.fecha_min = fechaMin;
        if (fechaMax) params.fecha_max = fechaMax;
        return params;
    };

    const handleGenerarReporte = async () => {
        setLoading(true);
        setResultados(null);
        try {
            const params = buildParams();
            const data = await getReporteActivosPreview(params);
            setResultados(data);
            if (data.length === 0) {
                showNotification('No se encontraron resultados con esos filtros');
            }
        } catch (error) {
            console.error("Error al generar reporte:", error);
            showNotification('Error al generar el reporte', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleExportar = async (format) => {
        setLoadingExport(true);
        try {
            const params = { ...buildParams(), format };
            await downloadReporteActivos(params);
            showNotification(`Reporte en ${format.toUpperCase()} descargado con éxito`);
        } catch (error) {
            console.error("Error al exportar:", error);
            showNotification('Error al exportar el reporte', 'error');
        } finally {
            setLoadingExport(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* --- Encabezado --- */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">Reportes</h1>
                <p className="text-secondary">Genera reportes filtrados de los activos fijos.</p>
            </div>
            
            {/* --- Panel de Filtros --- */}
            <div className="bg-secondary border border-theme rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2"><Filter size={20} /> Opciones de Reporte</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <FormSelect label="Ubicación" value={selectedUbicacion} onChange={(e) => setSelectedUbicacion(e.target.value)}>
                        <option value="">-- Todas --</option>
                        {ubicaciones.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                    </FormSelect>
                    <FormInput label="Fecha Adquisición (Desde)" type="date" value={fechaMin} onChange={(e) => setFechaMin(e.target.value)} />
                    <FormInput label="Fecha Adquisición (Hasta)" type="date" value={fechaMax} onChange={(e) => setFechaMax(e.target.value)} />
                </div>
                <button 
                    onClick={handleGenerarReporte} 
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full md:w-auto bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader className="animate-spin" /> : <FileText size={20} />}
                    Generar Vista Previa
                </button>
            </div>

            {/* --- Panel de Resultados --- */}
            {resultados && (
                <div className="bg-secondary border border-theme rounded-xl p-6 animate-in fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-primary">Resultados ({resultados.length})</h2>
                        <div className="flex gap-3">
                            <button onClick={() => handleExportar('pdf')} disabled={loadingExport} className="flex items-center gap-2 text-sm bg-tertiary text-primary px-4 py-2 rounded-lg hover:bg-opacity-80 disabled:opacity-50">
                                <FileDown size={16} /> PDF
                            </button>
                            <button onClick={() => handleExportar('excel')} disabled={loadingExport} className="flex items-center gap-2 text-sm bg-tertiary text-primary px-4 py-2 rounded-lg hover:bg-opacity-80 disabled:opacity-50">
                                <FileDown size={16} /> Excel
                            </button>
                        </div>
                    </div>
                    
                    {/* --- Tabla de Vista Previa --- */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-theme">
                                <tr className="text-secondary text-sm">
                                    <th className="py-2 pr-4">Nombre</th>
                                    <th className="py-2 px-4">Departamento</th>
                                    <th className="py-2 px-4">Fecha Adq.</th>
                                    <th className="py-2 pl-4 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map(activo => (
                                    <tr key={activo.id} className="border-b border-theme last:border-b-0">
                                        <td className="py-3 pr-4 text-primary font-medium">{activo.nombre}</td>
                                        <td className="py-3 px-4 text-secondary">{activo.ubicacion__nombre || 'N/A'}</td>
                                        <td className="py-3 px-4 text-secondary">{activo.fecha_adquisicion}</td>
                                        <td className="py-3 pl-4 text-primary text-right font-mono">Bs. {parseFloat(activo.valor_actual).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </motion.div>
    );
}