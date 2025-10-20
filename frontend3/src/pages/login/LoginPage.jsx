// src/pages/login/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Credenciales incorrectas.');
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <div className="w-full max-w-sm p-8 space-y-6 bg-secondary rounded-xl shadow-lg border border-theme">
                <h1 className="text-3xl font-bold text-center text-primary">Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" required className="input input-bordered w-full bg-tertiary" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required className="input input-bordered w-full bg-tertiary" />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="btn btn-accent w-full text-white">
                        <LogIn size={18} /> Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}