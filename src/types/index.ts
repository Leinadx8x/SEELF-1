// src/types/index.ts

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  currentStock: number;
  minimumStock: number;
  createdAt: Date;
  updatedAt: Date;
  isFromAPI?: boolean; // Adicionado para compatibilidade com o form
}

export interface StockMovement {
  id: string;
  product: Product; 
  type: 'ENTRADA' | 'SAIDA' | 'DEFEITO' | 'TRANSFERENCIA';
  quantity: number;
  reason: string;
  responsibleUser: string;
  timestamp: Date;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  isActive: boolean;
  avatar?: string; // Adicionado para compatibilidade visual
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  currentStock: number;
  minimumStock: number;
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK';
  createdAt: Date;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalMovementsToday: number;
  valorTotalMercadoriasEstoque: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

// --- NOVO TIPO ---
export interface Achievement {
  id: number;
  titulo: string;
  descricao: string;
  icone: string;
  dataConquista: string; // Vem como string do JSON
}