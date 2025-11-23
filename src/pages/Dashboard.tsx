// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from "@heroui/react";
import { Dashboard as DashboardComponent } from '../components/Dashboard';
import { ProductForm } from '../components/ProductForm';
import { StockMovementForm } from '../components/StockMovementForm';
import { DashboardStats, StockAlert, StockMovement, Product } from '../types';
import { getProducts, getMovements, createProduct, createMovement } from '../services/api';

const initialFormState = {
  productId: '',
  type: 'IN' as 'IN' | 'OUT' | 'DEFEITO',
  quantity: '',
  reason: '',
  customReason: '',
  notes: '',
};

export const Dashboard: React.FC = () => {
  // Inicializa com valores zerados para evitar erro de "null" na renderização
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalMovementsToday: 0,
    valorTotalMercadoriasEstoque: 0
  });
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [recentMovements, setRecentMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => {
        const newState = { ...prev, [field]: value };
        if (field === 'type') {
            newState.reason = '';
            newState.customReason = '';
        }
        return newState;
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      // Busca dados em paralelo
      const [productsData, movementsData] = await Promise.all([ getProducts(), getMovements() ]);

      // 1. Cria um Mapa de Produtos para busca rápida (ID -> Produto)
      // Isso garante que a gente consiga achar o nome do produto mesmo se a movimentação trouxer só o ID
      const productMap = new Map<string, Product>();
      productsData.forEach((p: Product) => {
        if (p && p.id) productMap.set(String(p.id), p);
      });

      // 2. Enriquece as Movimentações com os dados do Produto (Nome e SKU)
      // Isso resolve o problema de "Nome sumindo"
      const movementsEnriched = movementsData.map((m: any) => {
        // Tenta achar o ID do produto de várias formas possíveis que a API pode mandar
        const pid = m?.product?.id ?? m?.productId ?? m?.product_id;
        const productFromMap = pid != null ? productMap.get(String(pid)) : undefined;

        // Prioriza o objeto produto completo, senão usa o do mapa
        const finalProduct = m.product && m.product.name ? m.product : productFromMap;

        return {
          ...m,
          // Garante que o objeto 'product' exista dentro da movimentação para o componente filho ler
          product: finalProduct || { name: 'Produto não encontrado', sku: '---' },
          // Campos de fallback
          productName: finalProduct?.name || 'Desconhecido',
          productSku: finalProduct?.sku || '',
          // Normaliza o tipo para garantir que DEFEITO seja processado
          type: m.type || 'SAIDA' 
        };
      });

      // Ordena por data (mais recente primeiro)
      const sortedMovements = movementsEnriched.sort(
        (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Atualiza estados
      setProducts(productsData);
      setRecentMovements(sortedMovements.slice(0, 5)); // Pega apenas as 5 últimas

      // 3. Cálculos de Estatísticas (Cards Coloridos)
      const totalProducts = productsData.length;
      const lowStockProducts = productsData.filter(p => p.currentStock > 0 && p.currentStock <= p.minimumStock).length;
      const outOfStockProducts = productsData.filter(p => p.currentStock <= 0).length;
      
      // Conta movimentações de hoje
      const todayStr = new Date().toDateString();
      const totalMovementsToday = movementsEnriched.filter(
        (m: any) => {
            try { return new Date(m.timestamp).toDateString() === todayStr; } 
            catch { return false; }
        }
      ).length;

      const valorTotalMercadoriasEstoque = productsData.reduce((total, p) => total + (p.price * p.currentStock), 0);

      setStats({ totalProducts, lowStockProducts, outOfStockProducts, totalMovementsToday, valorTotalMercadoriasEstoque });

      // 4. Gera Alertas de Estoque
      const stockAlerts = productsData
        .filter(p => p.currentStock <= 0 || p.currentStock <= p.minimumStock)
        .map((p): StockAlert => ({
          id: String(p.id),
          productId: String(p.id),
          productName: p.name,
          productSku: p.sku,
          currentStock: p.currentStock,
          minimumStock: p.minimumStock,
          alertType: p.currentStock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
          createdAt: new Date()
        }));

      setAlerts(stockAlerts);

    } catch (error) {
      console.error("Erro CRÍTICO ao carregar dados do dashboard:", error);
      // Em caso de erro, mantemos os stats zerados ou com o último estado válido
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openProductForm = useCallback(() => setIsProductFormOpen(true), []);
  const closeProductForm = useCallback(() => setIsProductFormOpen(false), []);
  const openMovementForm = useCallback(() => setIsMovementFormOpen(true), []);
  const closeMovementForm = useCallback(() => {
    setIsMovementFormOpen(false);
    setFormData(initialFormState);
  }, []);

  const handleProductSubmit = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      await createProduct(productData);
      await fetchData();
      return true;
    } catch(error) {
      console.error("Falha ao criar produto:", error);
      return false;
    }
  }, [fetchData]);

  const handleMovementSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
        const product = products.find(p => String(p.id) === String(formData.productId));
        if (!product) throw new Error("Produto não encontrado");

        // Lógica correta para enviar o tipo DEFEITO
        const getBackendType = () => {
            if (formData.type === 'IN') return 'ENTRADA';
            if (formData.type === 'OUT') return 'SAIDA';
            return 'DEFEITO'; // Garante que DEFEITO seja enviado corretamente
        };

        const qty = parseInt(formData.quantity);
        const payload = {
            product: { id: product.id },
            type: getBackendType(),
            quantity: qty,
            reason: formData.reason === 'Outros' ? formData.customReason : formData.reason,
            responsibleUser: "Carlos Daniel",
            notes: formData.notes,
        };

        await createMovement(payload);

        // Atualização Otimista (para a tela atualizar rápido)
        const adjustedProducts = products.map(p => {
          if (String(p.id) !== String(product.id)) return p;
          
          // Entrada soma, Saída e Defeito subtraem
          const isEntry = formData.type === 'IN';
          const delta = qty;
          const newStock = isEntry ? p.currentStock + delta : Math.max(0, p.currentStock - delta);
          
          return { ...p, currentStock: newStock };
        });
        
        setProducts(adjustedProducts);
        
        // Recalcula stats rápidos baseados na atualização otimista
        // (O fetchData final vai garantir a consistência real depois)
        const outOfStock = adjustedProducts.filter(p => p.currentStock <= 0).length;
        const lowStock = adjustedProducts.filter(p => p.currentStock > 0 && p.currentStock <= p.minimumStock).length;
        
        setStats(prev => ({
            ...prev,
            outOfStockProducts: outOfStock,
            lowStockProducts: lowStock,
            totalMovementsToday: prev.totalMovementsToday + 1 // Incrementa contador
        }));

        // Atualiza tudo do servidor para garantir
        await fetchData();
        closeMovementForm();
    } catch (error) {
        console.error("Falha ao registrar movimentação:", error);
    } finally {
        setIsSubmitting(false);
    }
  }, [formData, products, fetchData, closeMovementForm]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
          <Spinner label="Carregando Dashboard..." color="primary" labelColor="primary" />
      </div>
    );
  }

  return (
    <>
      <DashboardComponent
        stats={stats}
        alerts={alerts}
        recentMovements={recentMovements}
        onAddProduct={openProductForm}
        onViewProduct={(id) => console.log('View product', id)}
        onRecordMovement={openMovementForm}
      />
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={closeProductForm}
        onSubmit={handleProductSubmit}
        isEditing={false}
      />
      <StockMovementForm
        isOpen={isMovementFormOpen}
        onClose={closeMovementForm}
        onSubmit={handleMovementSubmit}
        products={products}
        formData={formData}
        handleInputChange={handleInputChange}
        isSubmitting={isSubmitting}
        currentUser="Carlos Daniel"
      />
    </>
  );
};