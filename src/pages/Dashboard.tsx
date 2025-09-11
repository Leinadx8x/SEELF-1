// pages/Dashboard.tsx
import React, { useState } from 'react';
import { Dashboard as DashboardComponent } from '../components/Dashboard';
import { ProductForm } from '../components/ProductForm';
import { StockMovementForm } from '../components/StockMovementForm';
import { DashboardStats, StockAlert, StockMovement, Product } from '../types';

// Mock data - substitua pelos dados reais da sua API
const mockStats: DashboardStats = {
  totalProducts: 156,
  lowStockProducts: 8,
  outOfStockProducts: 3,
  totalMovementsToday: 24,
  totalMovementsThisMonth: 387,
};

const mockAlerts: StockAlert[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Camiseta Básica Preta',
    productSku: 'CAM-001',
    currentStock: 2,
    minimumStock: 10,
    alertType: 'LOW_STOCK',
    createdAt: new Date(),
  },
  {
    id: '2',
    productId: '2',
    productName: 'Calça Jeans Skinny',
    productSku: 'CAL-002',
    currentStock: 0,
    minimumStock: 5,
    alertType: 'OUT_OF_STOCK',
    createdAt: new Date(),
  },
  {
    id: '3',
    productId: '3',
    productName: 'Tênis Casual Branco',
    productSku: 'TEN-003',
    currentStock: 3,
    minimumStock: 8,
    alertType: 'LOW_STOCK',
    createdAt: new Date(),
  },
];

const mockRecentMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Camiseta Básica Preta',
    productSku: 'CAM-001',
    type: 'OUT',
    quantity: 3,
    reason: 'Venda',
    responsibleUser: 'João Silva',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
  },
  {
    id: '2',
    productId: '2',
    productName: 'Calça Jeans Skinny',
    productSku: 'CAL-002',
    type: 'IN',
    quantity: 15,
    reason: 'Compra de mercadoria',
    responsibleUser: 'Maria Santos',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
  },
  {
    id: '3',
    productId: '3',
    productName: 'Tênis Casual Branco',
    productSku: 'TEN-003',
    type: 'OUT',
    quantity: 1,
    reason: 'Amostra grátis',
    responsibleUser: 'Pedro Costa',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 horas atrás
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'CAM-001',
    name: 'Camiseta Básica Preta',
    price: 29.90,
    currentStock: 2,
    minimumStock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    sku: 'CAL-002',
    name: 'Calça Jeans Skinny',
    price: 89.90,
    currentStock: 15,
    minimumStock: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    sku: 'TEN-003',
    name: 'Tênis Casual Branco',
    price: 159.90,
    currentStock: 3,
    minimumStock: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const Dashboard: React.FC = () => {
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);

  const handleAddProduct = () => {
    setIsProductFormOpen(true);
  };

  const handleRecordMovement = () => {
    setIsMovementFormOpen(true);
  };

  const handleViewProduct = (productId: string) => {
    console.log('Visualizar produto:', productId);
    // Implementar navegação para página de detalhes do produto
    // ou abrir modal de detalhes
  };

  const handleProductSubmit = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Novo produto:', productData);
    // Implementar criação do produto via API
    // Atualizar estado/cache após criação
  };

  const handleMovementSubmit = (movementData: Omit<StockMovement, 'id' | 'timestamp'>) => {
    console.log('Nova movimentação:', movementData);
    // Implementar registro de movimentação via API
    // Atualizar estado/cache após registro
  };

  return (
    <>
      <DashboardComponent
        stats={mockStats}
        alerts={mockAlerts}
        recentMovements={mockRecentMovements}
        onAddProduct={handleAddProduct}
        onViewProduct={handleViewProduct}
        onRecordMovement={handleRecordMovement}
      />

      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSubmit={handleProductSubmit}
      />

      <StockMovementForm
        isOpen={isMovementFormOpen}
        onClose={() => setIsMovementFormOpen(false)}
        onSubmit={handleMovementSubmit}
        products={mockProducts}
        currentUser="Usuário Atual" // Pegar do contexto de auth
      />
    </>
  );
};