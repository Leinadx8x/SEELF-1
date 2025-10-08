

import { Product, StockMovement } from '../types';


const API_URL = 'http://localhost:8080/api';

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Erro ao buscar produtos do servidor.');
  }
  // O backend retorna datas como strings, precisamos convertê-las
  const data = await response.json();
  return data.map((product: any) => ({
    ...product,
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt),
  }));
};

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao criar produto:", errorText);
    throw new Error('Erro ao criar produto no servidor.');
  }
  return response.json();
};

export const getMovements = async (): Promise<StockMovement[]> => {
  const response = await fetch(`${API_URL}/movements`);
  if (!response.ok) {
    throw new Error('Erro ao buscar movimentações do servidor.');
  }
 
   const data = await response.json();
   return data.map((movement: any) => ({
     ...movement,
     timestamp: new Date(movement.timestamp),
   }));
};

export const createMovement = async (movementData: any): Promise<StockMovement> => {
  const response = await fetch(`${API_URL}/movements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movementData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao criar movimentação:", errorText);
    throw new Error('Erro ao criar movimentação no servidor.');
  }
  return response.json();
};