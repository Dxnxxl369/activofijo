// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin } from '../api/authService';
import { setAuthToken } from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token); // Aplica el token si ya existe uno guardado
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await apiLogin({ username, password });
        const { access } = response.data;
        localStorage.setItem('token', access);
        
        // --- ¡CORRECCIÓN CLAVE AQUÍ! ---
        // Aplicamos el token a axios INMEDIATAMENTE después del login.
        setAuthToken(access); 
        
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);