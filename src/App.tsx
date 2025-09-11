// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Movements } from './pages/Movements';
import { Reports } from './pages/Reports';
import { Integrations } from './pages/Integrations';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <HeroUIProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rota pública de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/produtos" element={<Products />} />
                      <Route path="/movimentacoes" element={<Movements />} />
                      <Route path="/relatorios" element={<Reports />} />
                      <Route path="/integracoes" element={<Integrations />} />
                      <Route path="/configuracoes" element={<Settings />} />
                      <Route path="/perfil" element={<Profile />} />
                      <Route path="/notificacoes" element={<Notifications />} />
                      
                      {/* Rota padrão - redireciona para dashboard */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </HeroUIProvider>
  );
}

export default App;