// src/App.jsx
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext'; // <-- Importamos el Auth
import Layout from './components/Layout';
import { NotificationProvider } from './context/NotificacionContext';
import LoginPage from './pages/login/LoginPage'; // <-- Crearemos esta página

// Componente intermedio que decide qué mostrar: Login o el Layout principal
const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // Muestra un loader mientras se verifica si hay un token guardado
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-primary">
                <span className="loading loading-spinner text-accent"></span>
            </div>
        );
    }

    return isAuthenticated ? <Layout /> : <LoginPage />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}