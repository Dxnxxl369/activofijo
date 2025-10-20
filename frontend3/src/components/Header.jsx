// src/components/Header.jsx
import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';

export default function Header({ onMenuClick, sidebarOpen }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-secondary border-b border-theme h-16 flex items-center justify-between px-4 md:px-8">
      {/* Menu Button (Mobile) */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 hover:bg-tertiary rounded-lg transition-colors text-primary"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 p-2 hover:bg-tertiary rounded-lg transition-colors"
        >
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
            JG
          </div>
          <span className="text-primary font-medium hidden sm:block">Juan García</span>
        </button>

        {/* User Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-secondary border border-theme rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-theme">
              <p className="text-primary font-medium">Juan García</p>
              <p className="text-secondary text-sm">juan@example.com</p>
            </div>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-secondary hover:text-primary hover:bg-tertiary transition-colors text-left">
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}