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
  isFromAPI?: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: 'IN' | 'OUT';
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

export interface APIIntegration {
  id: string;
  name: string;
  endpoint: string;
  isActive: boolean;
  lastSync?: Date;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalMovementsToday: number;
  totalMovementsThisMonth: number;
}