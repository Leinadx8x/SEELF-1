// App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { Tasks } from './pages/Tasks';

function App() {
  return (
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
                <Route path="/tarefas" element={<Tasks />} />
                
                {/* Rota padrão - redireciona para dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
