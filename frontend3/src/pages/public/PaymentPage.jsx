// src/pages/public/PaymentPage.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CreditCard, User, Building, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // <-- CAMBIADO

export default function PaymentPage() {
    const [searchParams] = useSearchParams();
    const plan = searchParams.get('plan') || 'básico';
    const navigate = useNavigate();
    const { registerAndLogin } = useAuth(); // <-- CAMBIADO
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Empresa
        empresa_nombre: '',
        empresa_nit: '',
        // Admin (User + Empleado)
        admin_first_name: '',
        admin_apellido_p: '',
        admin_apellido_m: '',
        admin_ci: '',
        admin_email: '',
        admin_username: '',
        admin_password: '',
        // Pago (Simulado)
        card_number: '',
        card_expiry: '',
        card_cvc: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Llama a la nueva función del AuthContext
            await registerAndLogin(formData);
            // Si tiene éxito, el AuthContext nos loguea y podemos redirigir
            navigate('/app'); // <-- Redirige a la app
            
        } catch (err) {
            console.error("Error de registro:", err.response?.data || err.message);
            // Captura errores de validación del backend (ej. "NIT ya existe")
            if (err.response?.data) {
                const errors = err.response.data;
                const firstErrorKey = Object.keys(errors)[0];
                setError(`${firstErrorKey}: ${errors[firstErrorKey][0]}`);
            } else {
                setError('Error al procesar el registro. Intente de nuevo.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-2xl bg-gray-800 border border-indigo-500 rounded-2xl p-8 shadow-2xl shadow-indigo-500/30">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Crear Cuenta y Pagar</h1>
                    <p className="text-gray-400 capitalize">Completando suscripción para el Plan: <span className="font-bold text-indigo-400">{plan}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* --- Datos de la Empresa --- */}
                    <fieldset className="border border-theme rounded-lg p-4">
                        <legend className="text-sm font-medium text-accent px-2 flex items-center gap-2"><Building size={16} /> Datos de la Empresa</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Nombre de la Empresa" name="empresa_nombre" value={formData.empresa_nombre} onChange={handleChange} required />
                            <FormInput label="NIT" name="empresa_nit" value={formData.empresa_nit} onChange={handleChange} required />
                        </div>
                    </fieldset>
                    
                    {/* --- Datos del Administrador --- */}
                    <fieldset className="border border-theme rounded-lg p-4">
                        <legend className="text-sm font-medium text-accent px-2 flex items-center gap-2"><User size={16} /> Datos del Administrador</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Nombre(s)" name="admin_first_name" value={formData.admin_first_name} onChange={handleChange} required />
                            <FormInput label="Apellido Paterno" name="admin_apellido_p" value={formData.admin_apellido_p} onChange={handleChange} required />
                            <FormInput label="Apellido Materno" name="admin_apellido_m" value={formData.admin_apellido_m} onChange={handleChange} />
                            <FormInput label="Cédula de Identidad" name="admin_ci" value={formData.admin_ci} onChange={handleChange} required />
                            <FormInput label="Email" name="admin_email" type="email" value={formData.admin_email} onChange={handleChange} required />
                            <FormInput label="Nombre de Usuario (para login)" name="admin_username" value={formData.admin_username} onChange={handleChange} required />
                            <FormInput label="Contraseña" name="admin_password" type="password" value={formData.admin_password} onChange={handleChange} required />
                        </div>
                    </fieldset>

                    {/* --- Datos de Pago --- */}
                    <fieldset className="border border-theme rounded-lg p-4">
                        <legend className="text-sm font-medium text-accent px-2 flex items-center gap-2"><CreditCard size={16} /> Datos de Pago</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormInput label="Número de Tarjeta" name="card_number" value={formData.card_number} onChange={handleChange} placeholder="0000 0000 0000 0000" required className="md:col-span-3" />
                            <FormInput label="Expiración (MM/AA)" name="card_expiry" value={formData.card_expiry} onChange={handleChange} placeholder="12/28" required />
                            <FormInput label="CVC" name="card_cvc" value={formData.card_cvc} onChange={handleChange} placeholder="123" required />
                        </div>
                    </fieldset>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-transform active:scale-95 disabled:opacity-50">
                        {loading ? <Loader className="animate-spin" /> : <><Lock className="inline w-4 h-4 mr-2" /> Pagar y Crear Cuenta</>}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">¿Ya tienes una cuenta?</p>
                    <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 text-sm">
                        Inicia Sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Componente de ayuda
const FormInput = ({ label, ...props }) => (
    <div className={`flex flex-col ${props.className || ''}`}>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input id={props.name} {...props} className="w-full bg-gray-700 border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
    </div>
);