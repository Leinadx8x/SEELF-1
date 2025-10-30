// src/components/StockMovementForm.tsx
import React, { useRef } from 'react'; // Removi useState, não era usado diretamente aqui
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input,
  Textarea, Autocomplete, AutocompleteItem, Divider
} from '@heroui/react';
import { TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon } from 'lucide-react';
import { Product } from '../types';
import { CustomSelect } from './CustomSelect'; // <--- VERIFIQUE O IMPORT

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

  // Pega a lista de motivos baseada no tipo selecionado
  const reasonsList = movementReasons[formData.type as keyof typeof movementReasons] || [];

  // Transforma a lista para o formato do CustomSelect
  const reasonOptions = reasonsList.map(reason => ({
    value: reason,
    label: reason,
  }));

  const handleTypeChange = (newType: 'IN' | 'OUT' | 'DEFEITO') => {
    // Resetar o motivo se o tipo mudar
    if (formData.type !== newType) {
       handleInputChange('reason', null); // Usar null para CustomSelect
       handleInputChange('customReason', '');
    }
    handleInputChange('type', newType);
  };

  const isSubmitDisabled =
    !selectedProduct ||
    !formData.quantity ||
    !formData.reason || // Verifica se formData.reason tem um valor
    (formData.reason === 'Outros' && !formData.customReason);

  return (
    <Modal isOpen={isOpen} isDismissable={false} onClose={onClose} size="lg" scrollBehavior="inside"> {/* Pode voltar para inside se quiser */}
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Registrar Nova Movimentação</ModalHeader>
          <ModalBody className="space-y-4">
            <div className="space-y-4">
              {/* Autocomplete (Mantido como estava) */}
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

              {/* Botões de Tipo (Mantidos como estavam) */}
              <div>
                <h3 className="text-sm font-medium mb-2">Tipo de Movimentação</h3>
                <div className="grid grid-cols-3 gap-2">
                   <Button fullWidth color={formData.type === 'IN' ? 'success' : 'default'} onPress={() => handleTypeChange('IN')} startContent={<TrendingUpIcon size={16} />}>Entrada</Button>
                   <Button fullWidth color={formData.type === 'OUT' ? 'danger' : 'default'} onPress={() => handleTypeChange('OUT')} startContent={<TrendingDownIcon size={16} />}>Saída</Button>
                   <Button fullWidth color={formData.type === 'DEFEITO' ? 'warning' : 'default'} onPress={() => handleTypeChange('DEFEITO')} startContent={<AlertTriangleIcon size={16} />}>Defeito</Button>
                </div>
              </div>

              {/* Input Quantidade (Mantido como estava) */}
              <Input
                label="Quantidade"
                type="number"
                min="1"
                value={formData.quantity}
                onValueChange={(value) => handleInputChange('quantity', value)}
                isRequired
              />

              {/* CustomSelect para o Motivo */}
              <CustomSelect
                label="Motivo"
                options={reasonOptions} // Usa as opções transformadas
                value={formData.reason} // Usa o valor do formData
                onChange={(value) => handleInputChange('reason', value)} // Chama handleInputChange
                placeholder="Escolha um motivo"
              />

              {/* Input para "Outros" (Mantido como estava) */}
              {formData.reason === 'Outros' && (
                <Input
                  label="Especifique o motivo"
                  value={formData.customReason}
                  onValueChange={(value) => handleInputChange('customReason', value)}
                  isRequired
                />
              )}

              {/* Textarea Observações (Mantida como estava) */}
              <Textarea
                label="Observações (opcional)"
                value={formData.notes}
                onValueChange={(value) => handleInputChange('notes', value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
            <Button color="primary" type='submit' isLoading={isSubmitting} isDisabled={isSubmitDisabled}>
              Registrar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};