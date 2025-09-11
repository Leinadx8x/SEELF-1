// components/ProductForm.tsx
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
    Divider,
    Switch,
    Card,
    CardBody,
    Image,
} from '@heroui/react';
import { PlusIcon, ImageIcon } from 'lucide-react';
import { Product } from '../types';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
    product?: Product;
    isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    product,
    isEditing = false,
}) => {
    const [formData, setFormData] = useState({
        sku: product?.sku || '',
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price?.toString() || '',
        imageUrl: product?.imageUrl || '',
        category: product?.category || '',
        currentStock: product?.currentStock?.toString() || '0',
        minimumStock: product?.minimumStock?.toString() || '5',
        isFromAPI: product?.isFromAPI || false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string | boolean) => {
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

        if (!formData.sku.trim()) {
            newErrors.sku = 'SKU é obrigatório';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price < 0) {
            newErrors.price = 'Preço deve ser um valor válido';
        }

        const currentStock = parseInt(formData.currentStock);
        if (isNaN(currentStock) || currentStock < 0) {
            newErrors.currentStock = 'Estoque atual deve ser um número válido';
        }

        const minimumStock = parseInt(formData.minimumStock);
        if (isNaN(minimumStock) || minimumStock < 0) {
            newErrors.minimumStock = 'Estoque mínimo deve ser um número válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit({
                sku: formData.sku,
                name: formData.name,
                description: formData.description || undefined,
                price: parseFloat(formData.price),
                imageUrl: formData.imageUrl || undefined,
                category: formData.category || undefined,
                currentStock: parseInt(formData.currentStock),
                minimumStock: parseInt(formData.minimumStock),
                isFromAPI: formData.isFromAPI,
            });
            onClose();
        }
    };

    const resetForm = () => {
        setFormData({
            sku: '',
            name: '',
            description: '',
            price: '',
            imageUrl: '',
            category: '',
            currentStock: '0',
            minimumStock: '5',
            isFromAPI: false,
        });
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-h-[90vh]",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold">
                        {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
                    </h2>
                    <p className="text-sm text-default-500">
                        {isEditing ? 'Atualize as informações do produto' : 'Preencha os dados do produto'}
                    </p>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-6">
                        {/* Informações Básicas */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">Informações Básicas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="SKU"
                                    placeholder="Ex: PROD-001"
                                    value={formData.sku}
                                    onValueChange={(value) => handleInputChange('sku', value)}
                                    isInvalid={!!errors.sku}
                                    errorMessage={errors.sku}
                                    isRequired
                                />

                                <Input
                                    label="Nome do Produto"
                                    placeholder="Ex: Camiseta Básica Azul"
                                    value={formData.name}
                                    onValueChange={(value) => handleInputChange('name', value)}
                                    isInvalid={!!errors.name}
                                    errorMessage={errors.name}
                                    isRequired
                                />

                                <Input
                                    label="Categoria"
                                    placeholder="Ex: Roupas, Acessórios"
                                    value={formData.category}
                                    onValueChange={(value) => handleInputChange('category', value)}
                                />

                                <Input
                                    label="Preço (R$)"
                                    placeholder="0,00"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onValueChange={(value) => handleInputChange('price', value)}
                                    isInvalid={!!errors.price}
                                    errorMessage={errors.price}
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">R$</span>
                                        </div>
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <Textarea
                                    label="Descrição"
                                    placeholder="Descreva o produto..."
                                    value={formData.description}
                                    onValueChange={(value) => handleInputChange('description', value)}
                                    maxRows={3}
                                />
                            </div>
                        </div>

                        <Divider />

                        {/* Imagem */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">Imagem do Produto</h3>
                            <div className="space-y-3">
                                <Input
                                    label="URL da Imagem"
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    value={formData.imageUrl}
                                    onValueChange={(value) => handleInputChange('imageUrl', value)}
                                    startContent={<ImageIcon size={16} className="text-default-400" />}
                                />

                                {formData.imageUrl && (
                                    <Card className="max-w-xs">
                                        <CardBody className="p-2">
                                            <Image
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg"
                                                fallbackSrc="/placeholder.png"
                                            />

                                        </CardBody>
                                    </Card>
                                )}
                            </div>
                        </div>

                        <Divider />

                        {/* Controle de Estoque */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">Controle de Estoque</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Estoque Atual"
                                    placeholder="0"
                                    type="number"
                                    min="0"
                                    value={formData.currentStock}
                                    onValueChange={(value) => handleInputChange('currentStock', value)}
                                    isInvalid={!!errors.currentStock}
                                    errorMessage={errors.currentStock}
                                    endContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">un.</span>
                                        </div>
                                    }
                                />

                                <Input
                                    label="Estoque Mínimo"
                                    placeholder="5"
                                    type="number"
                                    min="0"
                                    value={formData.minimumStock}
                                    onValueChange={(value) => handleInputChange('minimumStock', value)}
                                    isInvalid={!!errors.minimumStock}
                                    errorMessage={errors.minimumStock}
                                    endContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">un.</span>
                                        </div>
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <Switch
                                    isSelected={formData.isFromAPI}
                                    onValueChange={(value) => handleInputChange('isFromAPI', value)}
                                >
                                    Produto importado via API de e-commerce
                                </Switch>
                            </div>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="danger" variant="light" onPress={handleClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onPress={handleSubmit}>
                        {isEditing ? 'Atualizar' : 'Adicionar'} Produto
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};