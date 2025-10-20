// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Users, Building2, Settings, FolderTree, ActivitySquare, Briefcase, Box, FileText, ShieldCheck, PiggyBank, Truck, MapPin } from 'lucide-react';

export default function Sidebar({ isOpen, onClose, currentPage, setCurrentPage }) {
  const handleNavigation = (page) => {
    setCurrentPage(page);
    onClose();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-secondary border-r border-theme flex-col">
        <div className="h-16 flex items-center justify-center border-b border-theme">
          <h1 className="text-2xl font-bold text-primary">ActFijo App</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem
            icon={<LayoutGrid size={20} />}
            label="Dashboard"
            isActive={currentPage === 'dashboard'}
            onClick={() => handleNavigation('dashboard')}
          />
          <NavItem
          icon={<Box size={20} />}
          label="Activos Fijos"
          isActive={currentPage === 'activos_fijos'}
          onClick={() => handleNavigation('activos_fijos')}
        />
          <NavItem
            icon={<Building2 size={20} />}
            label="Departamentos"
            isActive={currentPage === 'departamentos'}
            onClick={() => handleNavigation('departamentos')}
          />
          <NavItem
            icon={<Briefcase size={20} />}
            label="Cargos"
            isActive={currentPage === 'cargos'}
            onClick={() => handleNavigation('cargos')}
          />          
          <NavItem
            icon={<Users size={20} />}
            label="Empleados"
            isActive={currentPage === 'empleados'}
            onClick={() => handleNavigation('empleados')}
          />                  
          <NavItem
            icon={<ShieldCheck size={20} />}
            label="Roles"
            isActive={currentPage === 'roles'}
            onClick={() => handleNavigation('roles')}
          />
          <NavItem
            icon={<PiggyBank size={20} />}
            label="Presupuestos"
            isActive={currentPage === 'presupuestos'}
            onClick={() => handleNavigation('presupuestos')}
          />   
          <NavItem
            icon={<MapPin size={20} />}
            label="Ubicaciones"
            isActive={currentPage === 'ubicaciones'}
            onClick={() => handleNavigation('ubicaciones')}
          />
          <NavItem
            icon={<Truck size={20} />}
            label="Proveedores"
            isActive={currentPage === 'proveedores'}
            onClick={() => handleNavigation('proveedores')}
          />       
          <NavItem
            icon={<FolderTree size={20} />}
            label="Categorías"
            isActive={currentPage === 'categorias'}
            onClick={() => handleNavigation('categorias')}
          />
          <NavItem
            icon={<ActivitySquare size={20} />}
            label="Estados"
            isActive={currentPage === 'estados'}
            onClick={() => handleNavigation('estados')}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Reportes"
            isActive={currentPage === 'reportes'}
            onClick={() => handleNavigation('reportes')}
          />
        </nav>

        <div className="px-4 py-4 border-t border-theme">
          <NavItem
            icon={<Settings size={20} />}
            label="Configuración"
            isActive={currentPage === 'settings'}
            onClick={() => handleNavigation('settings')}
          />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 w-64 h-screen bg-secondary border-r border-theme flex flex-col z-40 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-theme">
          <h1 className="text-2xl font-bold text-primary">ActFijo App</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem
            icon={<LayoutGrid size={20} />}
            label="Dashboard"
            isActive={currentPage === 'dashboard'}
            onClick={() => handleNavigation('dashboard')}
          />
          <NavItem
            icon={<Building2 size={20} />}
            label="Departamentos"
            isActive={currentPage === 'departamentos'}
            onClick={() => handleNavigation('departamentos')}
          />
          <NavItem
            icon={<Box size={20} />} // <-- NUEVO ITEM
            label="Activos Fijos"
            isActive={currentPage === 'activos_fijos'}
            onClick={() => handleNavigation('activos_fijos')}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Empleados"
            isActive={currentPage === 'empleados'}
            onClick={() => handleNavigation('empleados')}
          />
        </nav>

        <div className="px-4 py-4 border-t border-theme">
          <NavItem
            icon={<Settings size={20} />}
            label="Configuración"
            isActive={currentPage === 'settings'}
            onClick={() => handleNavigation('settings')}
          />
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-accent text-white font-medium'
          : 'text-primary hover:bg-tertiary'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
// src/components/Sidebar.jsx
/*import React from 'react';
import { NavLink } from 'react-router-dom'; // <-- Importa NavLink
import { LayoutGrid, Building2, Settings } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navContent = (
    <>
      <div className="h-16 flex items-center justify-center border-b border-theme">
        <h1 className="text-2xl font-bold text-primary">ActFijo App</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem icon={<LayoutGrid size={20} />} label="Dashboard" to="/dashboard" onClick={onClose} />
        <NavItem icon={<Building2 size={20} />} label="Departamentos" to="/departamentos" onClick={onClose} />
      </nav>
      <div className="px-4 py-4 border-t border-theme">
        <NavItem icon={<Settings size={20} />} label="Configuración" to="/settings" onClick={onClose} />
      </div>
    </>
  );
  // ... (El resto del componente con Desktop/Mobile sidebar no cambia)
}

function NavItem({ icon, label, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive ? 'bg-accent text-white font-medium' : 'text-primary hover:bg-tertiary'
      }`}
    >
      {icon} {label}
    </NavLink>
  );
}*/