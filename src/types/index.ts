

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
  title: string; // O texto da tarefa
  description?: string; // Observações
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}