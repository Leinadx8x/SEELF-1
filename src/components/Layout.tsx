// components/Layout.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock de contagem de alertas - depois pode vir do contexto ou API
  const alertsCount = 3;

  if (!user) {
    return null; // ou loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentUser={user}
        alertsCount={alertsCount}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </main>
      
      {/* Footer opcional */}
      <footer className="bg-default-50 border-t border-divider mt-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-default-500">
              © 2025 S.E.E.L.F. - Sistema de Estoque Externo para Lojas Franqueadas
            </div>
            <div className="flex items-center gap-4 text-sm text-default-500">
              <span>Versão 1.0.0</span>
              <span>•</span>
              <span>Rota atual: {location.pathname}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};