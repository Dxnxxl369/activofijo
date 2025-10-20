// src/components/Layout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import Settings from './Settings';
import DepartamentosList from '../pages/departamentos/DepartamentosList'; // <-- Importamos nuestro primer módulo

export default function Layout() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Función para renderizar el componente de la página actual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'departamentos':
        return <DepartamentosList />; // <-- Lo renderizamos aquí
      case 'settings':
        return <Settings />;
      // case 'empleados':
      //   return <EmpleadosList />; // (Ejemplo para el futuro)
      default:
        return <Dashboard />; // Página por defecto
    }
  };

  return (
    <div className="flex h-screen bg-primary">
      {/* Sidebar (Usa tu versión avanzada) */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderCurrentPage()} {/* <-- Aquí se muestra la página correcta */}
        </main>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}