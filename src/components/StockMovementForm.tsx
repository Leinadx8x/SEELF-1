// components/StockMovementForm.tsx
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  Chip,
  Card,
  CardBody,
  Divider,
} from '@heroui/react';
import { PackageIcon, TrendingUpIcon, TrendingDownIcon, UserIcon } from 'lucide-react';
import { Product, StockMovement } from '../types';

interface StockMovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  products: Product[];
  currentUser: string;
}

const movementReasons = {
  IN: [
    'Compra de mercadoria',
    'Devolução de cliente',
    'Transferência entre lojas',
    'Ajuste de inventário',
    'Produto danificado reparado',
    'Outros'
  ],
  OUT: [
    'Venda',
    'Produto danificado',
    'Transferência entre lojas',
    'Devolução para fornecedor',
    'Ajuste de inventário',
    'Amostra grátis',
    'Outros'
  ]
};

export const StockMovementForm: React.FC<StockMovementFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  products,
  currentUser,
}) => {
  const [formData, setFormData] = useState({
    productId: '',
    type: 'IN' as 'IN' | 'OUT',
    quantity: '',
    reason: '',
    customReason: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = 'Selecione um produto';
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = 'Quantidade deve ser maior que zero';
    }

    // Validar se há estoque suficiente para saída
    if (formData.type === 'OUT' && selectedProduct) {
      if (quantity > selectedProduct.currentStock) {
        newErrors.quantity = `Estoque insuficiente. Disponível: ${selectedProduct.currentStock}`;
      }
    }

    if (!formData.reason) {
      newErrors.reason = 'Selecione um motivo';
    }

    if (formData.reason === 'Outros' && !formData.customReason.trim()) {
      newErrors.customReason = 'Especifique o motivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && selectedProduct) {
      const finalReason = formData.reason === 'Outros' ? formData.customReason : formData.reason;
      
      onSubmit({
        productId: formData.productId,
        productName: selectedProduct.name,
        productSku: selectedProduct.sku,
        type: formData.type,
        quantity: parseInt(formData.quantity),
        reason: finalReason,
        responsibleUser: currentUser,
        notes: formData.notes || undefined,
      });
      
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      type: 'IN',
      quantity: '',
      reason: '',
      customReason: '',
      notes: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getNewStockValue = () => {
    if (!selectedProduct || !formData.quantity) return null;
    
    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity)) return null;
    
    const newStock = formData.type === 'IN' 
      ? selectedProduct.currentStock + quantity
      : selectedProduct.currentStock - quantity;
      
    return newStock;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Registrar Movimentação de Estoque</h2>
          <p className="text-sm text-default-500">
            Registre entradas e saídas de produtos do estoque externo
          </p>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-6">
            {/* Seleção do Produto */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <PackageIcon size={20} />
                Produto
              </h3>
              
              <Autocomplete
                label="Buscar produto"
                placeholder="Digite o nome ou SKU do produto"
                selectedKey={formData.productId}
                onSelectionChange={(key) => handleInputChange('productId', key as string)}
                isInvalid={!!errors.productId}
                errorMessage={errors.productId}
                isRequired
              >
                {products.map((product) => (
                  <AutocompleteItem 
                    key={product.id}
                    textValue={`${product.name} - ${product.sku}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{product.name}</span>
                      <span className="text-xs text-default-500">
                        SKU: {product.sku} | Estoque: {product.currentStock} un.
                      </span>
                    </div>
                  </AutocompleteItem>
                ))}
              </Autocomplete>

              {/* Informações do Produto Selecionado */}
              {selectedProduct && (
                <Card className="mt-3">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedProduct.name}</p>
                        <p className="text-sm text-default-500">SKU: {selectedProduct.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-default-500">Estoque Atual</p>
                        <p className="text-lg font-bold">{selectedProduct.currentStock} un.</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>

            <Divider />

            {/* Tipo e Quantidade */}
            <div>
              <h3 className="text-lg font-medium mb-3">Movimentação</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button
                  color={formData.type === 'IN' ? 'success' : 'default'}
                  variant={formData.type === 'IN' ? 'solid' : 'bordered'}
                  onPress={() => handleInputChange('type', 'IN')}
                  startContent={<TrendingUpIcon size={16} />}
                  className="h-12"
                >
                  Entrada
                </Button>
                
                <Button
                  color={formData.type === 'OUT' ? 'danger' : 'default'}
                  variant={formData.type === 'OUT' ? 'solid' : 'bordered'}
                  onPress={() => handleInputChange('type', 'OUT')}
                  startContent={<TrendingDownIcon size={16} />}
                  className="h-12"
                >
                  Saída
                </Button>
              </div>
              
              <Input
                label="Quantidade"
                placeholder="0"
                type="number"
                min="1"
                value={formData.quantity}
                onValueChange={(value) => handleInputChange('quantity', value)}
                isInvalid={!!errors.quantity}
                errorMessage={errors.quantity}
                isRequired
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">un.</span>
                  </div>
                }
              />

              {/* Preview do Novo Estoque */}
              {selectedProduct && formData.quantity && !errors.quantity && (
                <Card className="mt-3">
                  <CardBody className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-default-600">Novo estoque após movimentação:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{selectedProduct.currentStock}</span>
                        <span className="text-sm text-default-500">
                          {formData.type === 'IN' ? '+' : '-'}{formData.quantity}
                        </span>
                        <span className="text-sm">=</span>
                        <Chip
                          color={
                            getNewStockValue()! <= selectedProduct.minimumStock
                              ? 'warning'
                              : getNewStockValue()! <= 0
                              ? 'danger'
                              : 'success'
                          }
                          size="sm"
                          variant="flat"
                        >
                          {getNewStockValue()} un.
                        </Chip>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>

            <Divider />

            {/* Motivo */}
            <div>
              <h3 className="text-lg font-medium mb-3">Motivo da Movimentação</h3>
              
              <Select
                label="Selecione o motivo"
                placeholder="Escolha um motivo"
                selectedKeys={formData.reason ? [formData.reason] : []}
                onSelectionChange={(keys) => {
                  const reason = Array.from(keys)[0] as string;
                  handleInputChange('reason', reason);
                  // Limpar motivo customizado se não for "Outros"
                  if (reason !== 'Outros') {
                    handleInputChange('customReason', '');
                  }
                }}
                isInvalid={!!errors.reason}
                errorMessage={errors.reason}
                isRequired
              >
                {movementReasons[formData.type].map((reason) => (
                  <SelectItem key={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </Select>

              {/* Campo de motivo customizado */}
              {formData.reason === 'Outros' && (
                <Input
                  label="Especifique o motivo"
                  placeholder="Descreva o motivo da movimentação"
                  value={formData.customReason}
                  onValueChange={(value) => handleInputChange('customReason', value)}
                  isInvalid={!!errors.customReason}
                  errorMessage={errors.customReason}
                  className="mt-3"
                  isRequired
                />
              )}
            </div>

            <Divider />

            {/* Observações */}
            <div>
              <h3 className="text-lg font-medium mb-3">Observações Adicionais</h3>
              
              <Textarea
                label="Observações (opcional)"
                placeholder="Adicione informações extras sobre esta movimentação..."
                value={formData.notes}
                onValueChange={(value) => handleInputChange('notes', value)}
                maxRows={3}
              />
            </div>

            {/* Informações do Responsável */}
            <Card className="bg-default-50">
              <CardBody className="p-4">
                <div className="flex items-center gap-2">
                  <UserIcon size={16} className="text-default-500" />
                  <span className="text-sm text-default-600">Responsável:</span>
                  <Chip color="primary" size="sm" variant="flat">
                    {currentUser}
                  </Chip>
                </div>
                <p className="text-xs text-default-500 mt-1">
                  Esta movimentação será registrada em seu nome para fins de auditoria
                </p>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isDisabled={!selectedProduct}
          >
            Registrar Movimentação
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};