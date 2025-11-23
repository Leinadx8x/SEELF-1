// src/services/api.ts
import { Product, StockMovement, Task, Achievement } from '../types';

const API_URL = 'http://localhost:8080/api';

// --- PRODUTOS ---
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error('Erro ao buscar produtos.');
  const data = await response.json();
  return data.map((product: any) => ({
    ...product,
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt),
    price: parseFloat(product.price),
    currentStock: parseInt(product.currentStock),
    minimumStock: parseInt(product.minimumStock),
  }));
};

export const createProduct = async (productData: any): Promise<Product> => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Erro ao criar produto.');
  return response.json();
};

// --- MOVIMENTAÇÕES ---
export const getMovements = async (): Promise<StockMovement[]> => {
  const response = await fetch(`${API_URL}/movements`);
  if (!response.ok) throw new Error('Erro ao buscar movimentações.');
   const data = await response.json();
   return data.map((movement: any) => ({
     ...movement,
     timestamp: new Date(movement.timestamp),
   }));
};

export const createMovement = async (movementData: any): Promise<StockMovement> => {
  const response = await fetch(`${API_URL}/movements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movementData),
  });
  if (!response.ok) throw new Error('Erro ao criar movimentação.');
  return response.json();
};

// --- TAREFAS ---
const parseTaskDates = (task: any): Task => ({
  ...task,
  id: task.id.toString(),
  createdAt: new Date(task.createdAt),
  completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  status: task.status,
  priority: task.priority,
});

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error('Erro ao buscar tarefas.');
  const data = await response.json();
  return data.map(parseTaskDates);
};

export const createTask = async (taskData: any): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Erro ao criar tarefa.');
  const data = await response.json();
  return parseTaskDates(data);
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Erro ao atualizar tarefa.');
  const data = await response.json();
  return parseTaskDates(data);
};

export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erro ao deletar tarefa.');
};

// --- CONQUISTAS (GAMIFICAÇÃO) ---
export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  // No protótipo, o usuário Admin tem ID 1 no banco
  const targetId = userId === '1' ? '1' : userId; 
  const response = await fetch(`${API_URL}/conquistas/user/${targetId}`);
  if (!response.ok) return []; // Retorna vazio se der erro ou não tiver conquistas
  return response.json();
};