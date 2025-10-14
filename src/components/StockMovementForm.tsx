// src/components/StockMovementForm.tsx
import React, { useRef, useState } from 'react'; // 1. Importar o useState
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input,
  Textarea, Select, SelectItem, Autocomplete, AutocompleteItem, Divider
} from '@heroui/react';
import { TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon } from 'lucide-react';
import { Product } from '../types';

export interface StockMovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  products: Product[];
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  isSubmitting: boolean;
  currentUser: string;
}

const movementReasons = {
  IN: ['Compra de mercadoria', 'Devolução de cliente', 'Ajuste de inventário', 'Outros'],
  OUT: ['Transferência entre lojas', 'Devolução para fornecedor', 'Amostra grátis', 'Outros'],
  DEFEITO: ['Defeito de fabricação', 'Avaria no transporte', 'Avaria em loja', 'Outros']
};

export const StockMovementForm: React.FC<StockMovementFormProps> = ({
  isOpen, onClose, onSubmit, products, formData, handleInputChange, isSubmitting
}) => {
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  if (!isOpen) return null;
  const selectedProduct = products.find(p => p.id.toString() === formData.productId);

  return (
    <Modal isOpen={isOpen} isDismissable={false} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Registrar Nova Movimentação</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="space-y-4">
              <div onMouseDown={(e) => e.stopPropagation()}>
                <Autocomplete
                  label="Buscar produto"
                  placeholder="Digite o nome ou SKU"
                  selectedKey={formData.productId}
                  isRequired
                  ref={autocompleteRef}
                  onSelectionChange={(key) => {
                    handleInputChange('productId', key);
                    if (autocompleteRef.current) {
                      autocompleteRef.current.blur();
                    }
                  }}
                >
                  {products.length > 0 ? (
                    products.map((product) => (
                      <AutocompleteItem key={product.id} textValue={product.name}>
                        <div>
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-default-500"> | Estoque: {product.currentStock}</span>
                        </div>
                      </AutocompleteItem>
                    ))
                  ) : (
                    <AutocompleteItem key="not-found" isDisabled textValue="Nenhum produto encontrado">
                      Nenhum produto encontrado
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              <Divider />

              <div>
                <h3 className="text-sm font-medium mb-2">Tipo de Movimentação</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button fullWidth color={formData.type === 'IN' ? 'success' : 'default'} onPress={() => handleInputChange('type', 'IN')} startContent={<TrendingUpIcon size={16} />}>Entrada</Button>
                  <Button fullWidth color={formData.type === 'OUT' ? 'danger' : 'default'} onPress={() => handleInputChange('type', 'OUT')} startContent={<TrendingDownIcon size={16} />}>Saída</Button>
                  <Button fullWidth color={formData.type === 'DEFEITO' ? 'warning' : 'default'} onPress={() => handleInputChange('type', 'DEFEITO')} startContent={<AlertTriangleIcon size={16} />}>Defeito</Button>
                </div>
              </div>

              <Input
                label="Quantidade"
                type="number"
                min="1"
                value={formData.quantity}
                onValueChange={(value) => handleInputChange('quantity', value)}
                isRequired
              />

              <Select
                label="Motivo"
                placeholder="Escolha um motivo"
                selectedKeys={formData.reason ? [formData.reason] : []}
                onSelectionChange={(keys) => handleInputChange('reason', Array.from(keys)[0])}
              >
                {(movementReasons[formData.type as keyof typeof movementReasons] || []).map((reason) => (
                  <SelectItem key={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </Select>

              {formData.reason === 'Outros' && (
                <Input
                  label="Especifique o motivo"
                  value={formData.customReason}
                  onValueChange={(value) => handleInputChange('customReason', value)}
                />
              )}

              <Textarea
                label="Observações (opcional)"
                value={formData.notes}
                onValueChange={(value) => handleInputChange('notes', value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
            <Button color="primary" type='submit' isLoading={isSubmitting} isDisabled={!selectedProduct && !formData.quantity && !formData.reason}>Registrar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};