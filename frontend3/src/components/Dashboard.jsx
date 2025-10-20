// src/components/Dashboard.jsx
import React from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      icon: DollarSign,
      label: 'Ingresos',
      value: '$45,231',
      change: '+12%',
      positive: true,
    },
    {
      icon: Users,
      label: 'Usuarios',
      value: '1,284',
      change: '+8%',
      positive: true,
    },
    {
      icon: Activity,
      label: 'Actividad',
      value: '642',
      change: '-3%',
      positive: false,
    },
    {
      icon: TrendingUp,
      label: 'Crecimiento',
      value: '28.5%',
      change: '+4%',
      positive: true,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-secondary">Bienvenido a tu panel de control.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-secondary border border-theme rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-accent bg-opacity-10 rounded-lg">
                  <Icon size={24} className="text-accent" />
                </div>
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-secondary text-sm mb-1">{stat.label}</p>
              <p className="text-primary text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Content Card */}
      <div className="bg-secondary border border-theme rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Información</h2>
        <p className="text-secondary mb-4">
          Este es un dashboard de ejemplo. Puedes cambiar el tema desde la sección de Configuración.
        </p>
        <div className="space-y-2">
          <p className="text-tertiary text-sm">✓ Tema Claro / Oscuro / Personalizado</p>
          <p className="text-tertiary text-sm">✓ Menú responsive para dispositivos móviles</p>
          <p className="text-tertiary text-sm">✓ Persistencia de preferencias con localStorage</p>
          <p className="text-tertiary text-sm">✓ Transiciones suaves entre temas</p>
        </div>
      </div>
    </div>
  );
}