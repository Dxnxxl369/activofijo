// src/components/Layout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import Settings from './Settings';
import DepartamentosList from '../pages/departamentos/DepartamentosList'; // <-- NUEVA IMPORTACIÓN
import ActivosFijosList from '../pages/activos/ActivosFijosList';

export default function Layout() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-primary">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'departamentos' && <DepartamentosList />} {/* <-- LÍNEA AÑADIDA */}
          {currentPage === 'activos_fijos' && <ActivosFijosList/>}
          {currentPage === 'settings' && <Settings />}
          {/* Aquí añadiremos los demás componentes de página */}
        </main>
      </div>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}