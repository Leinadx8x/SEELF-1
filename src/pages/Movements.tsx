    import React, { useState, useEffect, useCallback } from 'react';
    import {
        Card, CardBody, CardHeader, Button, Input, Table, TableHeader, TableColumn,
        TableBody, TableRow, TableCell, Chip, Modal, ModalContent, ModalHeader,
        ModalBody, ModalFooter, Divider, Spinner
    } from '@heroui/react';
    import { SearchIcon, PlusIcon, EyeIcon, RefreshCwIcon } from 'lucide-react';
    import { StockMovementForm } from '../components/StockMovementForm';
    import { StockMovement, Product } from '../types';
    import { getMovements, createMovement, getProducts } from '../services/api';

    const initialFormState = {
        productId: '',
        type: 'IN' as 'IN' | 'OUT' | 'DEFEITO',
        quantity: '',
        reason: '',
        customReason: '',
        notes: '',
    };

    export const Movements: React.FC = () => {
        const [movements, setMovements] = useState<StockMovement[]>([]);
        const [products, setProducts] = useState<Product[]>([]);
        const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
        const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
        const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        const [searchTerm, setSearchTerm] = useState('');
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
            setIsLoading(true);
            try {
                const [movementsData, productsData] = await Promise.all([getMovements(), getProducts()]);
                setMovements(movementsData);
                setProducts(productsData);
            } catch (error) {
                console.error("Falha ao buscar dados:", error);
            } finally {
                setIsLoading(false);
            }
        }, []);

        useEffect(() => {
            fetchData();
        }, [fetchData]);

        const openMovementForm = useCallback(() => setIsMovementFormOpen(true), []);
        const closeMovementForm = useCallback(() => {
            setIsMovementFormOpen(false);
            setFormData(initialFormState);
        }, []);

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

        const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));
        const handleViewDetails = (movement: StockMovement) => {
            setSelectedMovement(movement);
            setIsDetailsModalOpen(true);
        };
        const filteredMovements = movements.filter(m =>
            m.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Movimentações</h1>
                        <p className="text-default-500 mt-1">Histórico de entradas e saídas do estoque</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onPress={fetchData} variant="flat" isIconOnly isLoading={isLoading}><RefreshCwIcon size={16} /></Button>
                        <Button color="primary" startContent={<PlusIcon size={16} />} onPress={openMovementForm}>
                            Nova Movimentação
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <Input isClearable placeholder="Buscar por nome ou SKU do produto..." startContent={<SearchIcon size={16} />} value={searchTerm} onValueChange={setSearchTerm} />
                    </CardHeader>
                    <CardBody className="p-0">
                        <Table aria-label="Tabela de movimentações" removeWrapper>
                            <TableHeader>
                                <TableColumn>PRODUTO</TableColumn>
                                <TableColumn>TIPO</TableColumn>
                                <TableColumn>QTD</TableColumn>
                                <TableColumn>MOTIVO</TableColumn>
                                <TableColumn>DATA</TableColumn>
                                <TableColumn>AÇÕES</TableColumn>
                            </TableHeader>
                            <TableBody items={filteredMovements} isLoading={isLoading} emptyContent="Nenhuma movimentação encontrada.">
                                {(movement) => {
                                    const isEntry = movement.type === 'ENTRADA';
                                    let chipColor: "success" | "warning" | "danger" = "danger";
                                    if (isEntry) chipColor = "success";
                                    else if (movement.type === 'DEFEITO') chipColor = "warning";

                                    return (
                                        <TableRow key={movement.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{movement.product.name}</p>
                                                    <p className="text-xs text-default-500">SKU: {movement.product.sku}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip color={chipColor} size="sm" variant="flat">
                                                    {movement.type.charAt(0) + movement.type.slice(1).toLowerCase()}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <span className={isEntry ? 'text-success' : 'text-danger'}>
                                                    {isEntry ? '+' : '-'} {movement.quantity}
                                                </span>
                                            </TableCell>
                                            <TableCell>{movement.reason}</TableCell>
                                            <TableCell>{formatDate(movement.timestamp)}</TableCell>
                                            <TableCell>
                                                <Button isIconOnly size="sm" variant="light" onPress={() => handleViewDetails(movement)}>
                                                    <EyeIcon size={16} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
                    <ModalContent>
                        <ModalHeader>Detalhes da Movimentação</ModalHeader>
                        { }
                    </ModalContent>
                </Modal>

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
            </div>
        );
    };