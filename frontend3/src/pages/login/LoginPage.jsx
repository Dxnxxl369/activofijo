// src/pages/login/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Loader } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            // No necesitamos navegar, App.jsx se encargará del cambio
        } catch (err) {
            setError('Credenciales incorrectas o usuario inactivo.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div data-theme="dark" className="flex items-center justify-center min-h-screen bg-primary">
            <div className="w-full max-w-sm p-8 space-y-6 bg-secondary rounded-xl shadow-lg border border-theme">
                <h1 className="text-3xl font-bold text-center text-primary">Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" required className="input input-bordered w-full bg-tertiary" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required className="input input-bordered w-full bg-tertiary" />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="btn btn-accent w-full text-white" disabled={loading}>
                        {loading ? <Loader className="animate-spin" /> : <><LogIn size={18} /> Ingresar</>}
                    </button>
                </form>
            </div>
        </div>
    );
}