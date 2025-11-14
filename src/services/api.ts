// src/services/api.ts
import { Product, StockMovement, Task } from '../types';

const API_URL = 'http://localhost:8080/api';

// --- FUNÇÕES DE PRODUTO (JÁ EXISTIAM) ---
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Erro ao buscar produtos do servidor.');
  }
  const data = await response.json();
  return data.map((product: any) => ({
    ...product,
    createdAt: new Date(product.createdAt || product.registrationDate),
    updatedAt: new Date(product.updatedAt || product.ultimaAtualizacao),
    price: parseFloat(product.price || product.precoVenda || 0),
    currentStock: parseInt(product.currentStock || product.quantity || 0),
    minimumStock: parseInt(product.minimumStock || 5),
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

// --- FUNÇÕES DE MOVIMENTAÇÃO (JÁ EXISTIAM) ---
export const getMovements = async (): Promise<StockMovement[]> => {
  const response = await fetch(`${API_URL}/movements`);
  if (!response.ok) {
    throw new Error('Erro ao buscar movimentações do servidor.');
  }
   const data = await response.json();
   return data.map((movement: any) => ({
     ...movement,
     timestamp: new Date(movement.timestamp || movement.date || movement.dataHora),
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


// --- NOVAS FUNÇÕES DE TAREFAS ---

// Helper para converter datas e tipos de Task
const parseTaskDates = (task: any): Task => ({
  ...task,
  id: task.id.toString(),
  createdAt: new Date(task.createdAt),
  completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  // --- CORREÇÃO AQUI ---
  // Precisamos dizer ao TypeScript que esses campos são dos tipos exatos
  status: task.status as 'pending' | 'completed',
  priority: task.priority as 'low' | 'medium' | 'high',
});

// GET /api/tasks
export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) {
    throw new Error('Erro ao buscar tarefas do servidor.');
  }
  const data = await response.json();
  return data.map(parseTaskDates);
};

// POST /api/tasks
export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao criar tarefa:", errorText);
    throw new Error('Erro ao criar tarefa no servidor.');
  }
  const data = await response.json();
  return parseTaskDates(data);
};

// PUT /api/tasks/{id}
export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao atualizar tarefa:", errorText);
    throw new Error('Erro ao atualizar tarefa no servidor.');
  }
  const data = await response.json();
  return parseTaskDates(data);
};

// DELETE /api/tasks/{id}
export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao deletar tarefa:", errorText);
    throw new Error('Erro ao deletar tarefa no servidor.');
  }
};