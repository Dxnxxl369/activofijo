// src/components/Header.jsx
import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // <-- 1. Importamos el hook

// Función para obtener iniciales
const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
        return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
    }
    return (parts[0].substring(0, 2)).toUpperCase();
};

export default function Header({ onMenuClick, sidebarOpen }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth(); // <-- 2. Obtenemos 'user' y 'logout'

    return (
        <header className="bg-secondary border-b border-theme h-16 flex items-center justify-between px-4 md:px-8">
            {/* ... (Botón de Menú) ... */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 hover:bg-tertiary rounded-lg transition-colors text-primary"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex-1" />

            {/* --- MENÚ DE USUARIO DINÁMICO --- */}
            <div className="relative">
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 hover:bg-tertiary rounded-lg transition-colors"
                >
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(user?.nombre_completo)}
                    </div>
                    <span className="text-primary font-medium hidden sm:block">
                        {user?.nombre_completo || 'Cargando...'}
                    </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                    <div 
                        className="absolute right-0 mt-2 w-56 bg-secondary border border-theme rounded-lg shadow-lg z-50"
                        onMouseLeave={() => setShowUserMenu(false)} // Opcional: cerrar al sacar el mouse
                    >
                        <div className="p-4 border-b border-theme">
                            <p className="text-primary font-medium">{user?.nombre_completo}</p>
                            <p className="text-secondary text-sm">{user?.email}</p>
                            <p className="text-xs text-accent font-semibold mt-1">{user?.empresa_nombre}</p>
                        </div>
                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-secondary hover:text-primary hover:bg-tertiary transition-colors text-left"
                        >
                            <LogOut size={18} />
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
            {/* --- FIN DEL MENÚ --- */}
        </header>
    );
}