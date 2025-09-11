// pages/Movements.tsx
import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Input,
    Select,
    SelectItem,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Pagination,
    DatePicker,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Badge,
} from '@heroui/react';
import {
    TrendingUpIcon,
    TrendingDownIcon,
    SearchIcon,
    FilterIcon,
    DownloadIcon,
    PlusIcon,
    EyeIcon,
    CalendarIcon,
    RefreshCwIcon,
    PackageIcon,
    UserIcon,
    FileTextIcon,
    MoreVerticalIcon,
} from 'lucide-react';
import { StockMovementForm } from '../components/StockMovementForm';
import { StockMovement, Product } from '../types';

// Mock data - substituir pelos dados reais da API
const mockMovements: StockMovement[] = [
    {
        id: '1',
        productId: '1',
        productName: 'Camiseta Básica Preta',
        productSku: 'CAM-001',
        type: 'OUT',
        quantity: 3,
        reason: 'Venda',
        responsibleUser: 'João Silva',
        notes: 'Venda online - Pedido #12345',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
    },
    {
        id: '2',
        productId: '2',
        productName: 'Calça Jeans Skinny',
        productSku: 'CAL-002',
        type: 'IN',
        quantity: 15,
        reason: 'Compra de mercadoria',
        responsibleUser: 'Maria Santos',
        notes: 'Compra do fornecedor ABC - NF #4567',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    },
    {
        id: '3',
        productId: '3',
        productName: 'Tênis Casual Branco',
        productSku: 'TEN-003',
        type: 'OUT',
        quantity: 1,
        reason: 'Amostra grátis',
        responsibleUser: 'Pedro Costa',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 horas atrás
    },
    {
        id: '4',
        productId: '1',
        productName: 'Camiseta Básica Preta',
        productSku: 'CAM-001',
        type: 'IN',
        quantity: 25,
        reason: 'Compra de mercadoria',
        responsibleUser: 'Ana Oliveira',
        notes: 'Reposição de estoque - Fornecedor XYZ',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    },
    {
        id: '5',
        productId: '4',
        productName: 'Blusa Moletom Cinza',
        productSku: 'BLU-004',
        type: 'OUT',
        quantity: 2,
        reason: 'Produto danificado',
        responsibleUser: 'Carlos Lima',
        notes: 'Produtos com defeito de fabricação',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 dias atrás
    },
];

const mockProducts: Product[] = [
    {
        id: '1',
        sku: 'CAM-001',
        name: 'Camiseta Básica Preta',
        price: 29.90,
        currentStock: 22,
        minimumStock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        sku: 'CAL-002',
        name: 'Calça Jeans Skinny',
        price: 89.90,
        currentStock: 15,
        minimumStock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export const Movements: React.FC = () => {
    const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
    const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
    const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Filtros e busca
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
    const [userFilter, setUserFilter] = useState('');
    const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');

    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Usuários únicos para filtro
    const uniqueUsers = Array.from(new Set(movements.map(m => m.responsibleUser)));

    // Estados para loading
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Filtrar movimentações
    const filteredMovements = movements.filter(movement => {
        const matchesSearch = movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.reason.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'ALL' || movement.type === typeFilter;

        const matchesUser = userFilter === '' || movement.responsibleUser === userFilter;

        const now = new Date();
        let matchesDate = true;

        if (dateFilter === 'TODAY') {
            matchesDate = movement.timestamp.toDateString() === now.toDateString();
        } else if (dateFilter === 'WEEK') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = movement.timestamp >= weekAgo;
        } else if (dateFilter === 'MONTH') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = movement.timestamp >= monthAgo;
        }

        return matchesSearch && matchesType && matchesUser && matchesDate;
    });

    // Paginação
    const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
    // cria a lista de usuários formatada
    const userOptions = [{ key: "", label: "Todos" }, ...uniqueUsers.map(user => ({ key: user, label: user }))];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMovements = filteredMovements.slice(startIndex, startIndex + itemsPerPage);



    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const formatRelativeDate = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
            return `${diffInMinutes}min atrás`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h atrás`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d atrás`;
        }
    };

    const handleViewDetails = (movement: StockMovement) => {
        setSelectedMovement(movement);
        setIsDetailsModalOpen(true);
    };

    const handleMovementSubmit = (movementData: Omit<StockMovement, 'id' | 'timestamp'>) => {
        const newMovement: StockMovement = {
            ...movementData,
            id: Date.now().toString(),
            timestamp: new Date(),
        };

        setMovements(prev => [newMovement, ...prev]);
    };

    const handleExport = async () => {
        setIsExporting(true);
        // Simular exportação
        setTimeout(() => {
            console.log('Exportando relatório de movimentações...');
            setIsExporting(false);
        }, 2000);
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        // Simular reload dos dados
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setTypeFilter('ALL');
        setUserFilter('');
        setDateFilter('ALL');
        setCurrentPage(1);
    };

    const getMovementTypeColor = (type: 'IN' | 'OUT') => {
        return type === 'IN' ? 'success' : 'danger';
    };

    const getMovementTypeLabel = (type: 'IN' | 'OUT') => {
        return type === 'IN' ? 'Entrada' : 'Saída';
    };

    const getMovementIcon = (type: 'IN' | 'OUT') => {
        return type === 'IN' ? TrendingUpIcon : TrendingDownIcon;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Movimentações</h1>
                    <p className="text-default-500 mt-1">
                        Histórico de entradas e saídas do estoque externo
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        color="secondary"
                        variant="flat"
                        startContent={<RefreshCwIcon size={16} />}
                        onPress={handleRefresh}
                        isLoading={isLoading}
                    >
                        Atualizar
                    </Button>

                    <Button
                        color="default"
                        variant="flat"
                        startContent={<DownloadIcon size={16} />}
                        onPress={handleExport}
                        isLoading={isExporting}
                    >
                        Exportar
                    </Button>

                    <Button
                        color="primary"
                        startContent={<PlusIcon size={16} />}
                        onPress={() => setIsMovementFormOpen(true)}
                    >
                        Nova Movimentação
                    </Button>
                </div>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none bg-gradient-to-br from-green-400 to-blue-500">
                    <CardBody className="text-white p-4">
                        <div className="flex items-center gap-3">
                            <TrendingUpIcon size={24} />
                            <div>
                                <p className="text-sm opacity-80">Entradas Hoje</p>
                                <p className="text-2xl font-bold">
                                    {movements.filter(m => m.type === 'IN' &&
                                        m.timestamp.toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="border-none bg-gradient-to-br from-red-400 to-pink-500">
                    <CardBody className="text-white p-4">
                        <div className="flex items-center gap-3">
                            <TrendingDownIcon size={24} />
                            <div>
                                <p className="text-sm opacity-80">Saídas Hoje</p>
                                <p className="text-2xl font-bold">
                                    {movements.filter(m => m.type === 'OUT' &&
                                        m.timestamp.toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="border-none bg-gradient-to-br from-purple-500 to-indigo-500">
                    <CardBody className="text-white p-4">
                        <div className="flex items-center gap-3">
                            <PackageIcon size={24} />
                            <div>
                                <p className="text-sm opacity-80">Total Movimentações</p>
                                <p className="text-2xl font-bold">{movements.length}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="border-none bg-gradient-to-br from-orange-400 to-yellow-500">
                    <CardBody className="text-white p-4">
                        <div className="flex items-center gap-3">
                            <UserIcon size={24} />
                            <div>
                                <p className="text-sm opacity-80">Usuários Ativos</p>
                                <p className="text-2xl font-bold">{uniqueUsers.length}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <FilterIcon size={20} />
                        <h3 className="text-lg font-semibold">Filtros</h3>
                        <Badge content={
                            [searchTerm, typeFilter !== 'ALL', userFilter, dateFilter !== 'ALL']
                                .filter(Boolean).length
                        } color="primary" size="sm">
                            <div />
                        </Badge>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <Input
                            placeholder="Buscar por produto, SKU ou motivo..."
                            startContent={<SearchIcon size={16} />}
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            isClearable
                            onClear={() => setSearchTerm('')}
                        />

                        <Select
                            label="Tipo de Movimentação"
                            selectedKeys={[typeFilter]}
                            onSelectionChange={(keys) => setTypeFilter(Array.from(keys)[0] as any)}
                        >
                            <SelectItem key="ALL">Todos</SelectItem>
                            <SelectItem key="IN">Entradas</SelectItem>
                            <SelectItem key="OUT">Saídas</SelectItem>
                        </Select>

                        <Select
                            label="Usuário Responsável"
                            selectedKeys={userFilter ? [userFilter] : []}
                            onSelectionChange={(keys) => setUserFilter(Array.from(keys)[0] as string || '')}
                            items={userOptions}
                        >
                            {(user) => (
                                <SelectItem key={user.key}>
                                    {user.label}
                                </SelectItem>
                            )}
                        </Select>



                        <Select
                            label="Período"
                            selectedKeys={[dateFilter]}
                            onSelectionChange={(keys) => setDateFilter(Array.from(keys)[0] as any)}
                        >
                            <SelectItem key="ALL">Todo período</SelectItem>
                            <SelectItem key="TODAY">Hoje</SelectItem>
                            <SelectItem key="WEEK">Última semana</SelectItem>
                            <SelectItem key="MONTH">Último mês</SelectItem>
                        </Select>

                        <Button
                            color="danger"
                            variant="flat"
                            onPress={clearFilters}
                            className="h-14"
                        >
                            Limpar Filtros
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Tabela de Movimentações */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center w-full">
                        <h3 className="text-lg font-semibold">
                            Movimentações ({filteredMovements.length})
                        </h3>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="p-0">
                    <Table aria-label="Tabela de movimentações" removeWrapper>
                        <TableHeader>
                            <TableColumn>PRODUTO</TableColumn>
                            <TableColumn>TIPO</TableColumn>
                            <TableColumn>QUANTIDADE</TableColumn>
                            <TableColumn>MOTIVO</TableColumn>
                            <TableColumn>RESPONSÁVEL</TableColumn>
                            <TableColumn>DATA</TableColumn>
                            <TableColumn width={50}>AÇÕES</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="Nenhuma movimentação encontrada">
                            {paginatedMovements.map((movement) => {
                                const Icon = getMovementIcon(movement.type);
                                return (
                                    <TableRow key={movement.id}>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium">{movement.productName}</p>
                                                <p className="text-xs text-default-500">{movement.productSku}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color={getMovementTypeColor(movement.type)}
                                                size="sm"
                                                variant="flat"
                                                startContent={<Icon size={14} />}
                                            >
                                                {getMovementTypeLabel(movement.type)}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <span className={movement.type === 'IN' ? 'text-success' : 'text-danger'}>
                                                    {movement.type === 'IN' ? '+' : '-'}
                                                </span>
                                                <span className="font-medium">{movement.quantity}</span>
                                                <span className="text-xs text-default-500">un.</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{movement.reason}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <UserIcon size={12} className="text-primary" />
                                                </div>
                                                <span className="text-sm">{movement.responsibleUser}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-xs font-medium">{formatDate(movement.timestamp)}</p>
                                                <p className="text-xs text-default-500">{formatRelativeDate(movement.timestamp)}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button isIconOnly size="sm" variant="light">
                                                        <MoreVerticalIcon size={16} />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu>
                                                    <DropdownItem
                                                        key="view"
                                                        startContent={<EyeIcon size={16} />}
                                                        onPress={() => handleViewDetails(movement)}
                                                    >
                                                        Ver Detalhes
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                        showControls
                        showShadow
                    />
                </div>
            )}

            {/* Modal de Detalhes */}
            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                size="lg"
            >
                <ModalContent>
                    <ModalHeader>
                        <div className="flex items-center gap-2">
                            <FileTextIcon size={20} />
                            <span>Detalhes da Movimentação</span>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {selectedMovement && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-default-500">Produto</p>
                                        <p className="font-medium">{selectedMovement.productName}</p>
                                        <p className="text-xs text-default-500">SKU: {selectedMovement.productSku}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Tipo de Movimentação</p>
                                        <Chip
                                            color={getMovementTypeColor(selectedMovement.type)}
                                            variant="flat"
                                        >
                                            {getMovementTypeLabel(selectedMovement.type)}
                                        </Chip>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Quantidade</p>
                                        <p className="font-medium text-lg">
                                            {selectedMovement.type === 'IN' ? '+' : '-'}{selectedMovement.quantity} un.
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Motivo</p>
                                        <p className="font-medium">{selectedMovement.reason}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Responsável</p>
                                        <p className="font-medium">{selectedMovement.responsibleUser}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Data e Hora</p>
                                        <p className="font-medium">{formatDate(selectedMovement.timestamp)}</p>
                                    </div>
                                </div>

                                {selectedMovement.notes && (
                                    <div>
                                        <p className="text-sm text-default-500">Observações</p>
                                        <Card className="bg-default-50">
                                            <CardBody className="p-3">
                                                <p className="text-sm">{selectedMovement.notes}</p>
                                            </CardBody>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            variant="light"
                            onPress={() => setIsDetailsModalOpen(false)}
                        >
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Formulário de Nova Movimentação */}
            <StockMovementForm
                isOpen={isMovementFormOpen}
                onClose={() => setIsMovementFormOpen(false)}
                onSubmit={handleMovementSubmit}
                products={mockProducts}
                currentUser="Usuário Atual"
            />
        </div>
    );
};