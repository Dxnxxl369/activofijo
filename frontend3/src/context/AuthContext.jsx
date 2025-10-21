// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // <-- 1. Importar
import { login as apiLogin, register as apiRegister } from '../api/authService';
import { setAuthToken } from '../api/axiosConfig';
//import { clearRoleCache } from '../hooks/usePermissions';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // <-- 2. Añadir estado de usuario
    const [userRoles, setUserRoles] = useState([]); // <-- NUEVO ESTADO PARA ROLES
    const [userIsAdmin, setUserIsAdmin] = useState(false);    
    const [loading, setLoading] = useState(true);

    // Función para manejar el token y los datos del usuario
    const handleToken = (access_token) => {
        try {
            const decodedToken = jwtDecode(access_token);
            
            // Guardar datos del usuario del token
            setUser({
                username: decodedToken.username,
                email: decodedToken.email,
                nombre_completo: decodedToken.nombre_completo,
                empresa_nombre: decodedToken.empresa_nombre
            });
            setUserRoles(decodedToken.roles || []);
            setUserIsAdmin(decodedToken.is_admin || false);

            localStorage.setItem('token', access_token);
            setAuthToken(access_token);
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Token inválido", error);
            logout(); // Si el token es malo, limpiamos todo
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Comprobar si el token ha expirado
                if (decodedToken.exp * 1000 > Date.now()) {
                    // Si el token es válido, configuramos el estado
                    handleToken(token);
                } else {
                    // Token expirado
                    logout();
                }
            } catch (error) {
                // Token inválido
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await apiLogin({ username, password });
        handleToken(response.data.access); // Usamos la función centralizada
    };

    const registerAndLogin = async (data) => {
        const response = await apiRegister(data);
        handleToken(response.access); // Usamos la función centralizada
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setIsAuthenticated(false);
        setUser(null); 
        setUserRoles([]);
        setUserIsAdmin(false);
        //clearRoleCache();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, user, userRoles, userIsAdmin,login, logout, registerAndLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);