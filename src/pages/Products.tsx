// pages/Products.tsx
import React from 'react';
import { Card, CardBody } from '@heroui/react';

export const Products: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Produtos</h1>
        <p className="text-default-500 mt-1">Gerencie seu catálogo de produtos</p>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <p className="text-center text-default-500">
            Página de produtos em desenvolvimento...
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

// pages/Movements.tsx
export const Movements: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Movimentações</h1>
        <p className="text-default-500 mt-1">Histórico de entradas e saídas do estoque</p>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <p className="text-center text-default-500">
            Página de movimentações em desenvolvimento...
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

// pages/Reports.tsx
export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-default-500 mt-1">Análises e relatórios do estoque</p>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <p className="text-center text-default-500">
            Página de relatórios em desenvolvimento...
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

// pages/Integrations.tsx
export const Integrations: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrações</h1>
        <p className="text-default-500 mt-1">Configure integrações com e-commerce</p>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <p className="text-center text-default-500">
            Página de integrações em desenvolvimento...
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

// pages/Settings.tsx
export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-default-500 mt-1">Configure o sistema</p>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <p className="text-center text-default-500">
            Página de configurações em desenvolvimento...
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

// pages/Profile.tsx
export const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-default-500 mt-1">Gerencie suas informações pessoais</p>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <p className="text-center text-default-500">
            Página de perfil em desenvolvimento...
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

// pages/Notifications.tsx
export const Notifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notificações</h1>
        <p className="text-default-500 mt-1">Alertas e notificações do sistema</p>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <p className="text-center text-default-500">
            Página de notificações em desenvolvimento...
          </p>
        </CardBody>
      </Card>
    </div>
  );
};