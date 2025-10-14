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
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
      const [productsData, movementsData] = await Promise.all([ getProducts(), getMovements() ]);
      const sortedMovements = movementsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setProducts(productsData);
      setRecentMovements(sortedMovements.slice(0, 5));
      const totalProducts = productsData.length;
      const lowStockProducts = productsData.filter(p => p.currentStock > 0 && p.currentStock <= p.minimumStock).length;
      const outOfStockProducts = productsData.filter(p => p.currentStock === 0).length;
      const totalMovementsToday = movementsData.filter(m => new Date(m.timestamp).toDateString() === new Date().toDateString()).length;
      const valorTotalMercadoriasEstoque = productsData.reduce((total, p) => total + (p.price * p.currentStock), 0);
      setStats({ totalProducts, lowStockProducts, outOfStockProducts, totalMovementsToday, valorTotalMercadoriasEstoque });
      const stockAlerts = productsData.filter(p => p.currentStock === 0 || p.currentStock <= p.minimumStock).map((p): StockAlert => ({ id: p.id, productId: p.id, productName: p.name, productSku: p.sku, currentStock: p.currentStock, minimumStock: p.minimumStock, alertType: p.currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK', createdAt: new Date() }));
      setAlerts(stockAlerts);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
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
        const product = products.find(p => p.id.toString() === formData.productId);
        if (!product) throw new Error("Produto não encontrado");
        const getBackendType = () => {
            if (formData.type === 'IN') return 'ENTRADA';
            if (formData.type === 'OUT') return 'SAIDA';
            return 'DEFEITO';
        };
        const payload = {
            product: { id: product.id },
            type: getBackendType(),
            quantity: parseInt(formData.quantity),
            reason: formData.reason === 'Outros' ? formData.customReason : formData.reason,
            responsibleUser: "Carlos Daniel",
            notes: formData.notes,
        };
        await createMovement(payload);
        await fetchData();
        closeMovementForm();
    } catch (error) {
        console.error("Falha ao registrar movimentação:", error);
    } finally {
        setIsSubmitting(false);
    }
  }, [formData, products, fetchData, closeMovementForm]);
  
  if (isLoading || !stats) {
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