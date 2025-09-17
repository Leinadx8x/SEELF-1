// pages/Products.tsx
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
    Divider,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Progress,
    Avatar,
    Image,
    Badge,
} from '@heroui/react';
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    UploadIcon,
    MoreVerticalIcon,
    EditIcon,
    Trash2Icon,
    PackageIcon,
} from 'lucide-react';
import { ProductForm } from '../components/ProductForm';
import { Product } from '../types';

// Mock data - substituir pelos dados reais da API
const mockProducts: Product[] = [
    {
        id: '1',
        sku: 'CAM-001',
        name: 'Camiseta Básica Preta',
        description: 'Camiseta de algodão com corte clássico.',
        price: 49.90,
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300',
        category: 'Roupas',
        currentStock: 22,
        minimumStock: 10,
        createdAt: new Date('2025-08-01T10:00:00Z'),
        updatedAt: new Date('2025-09-10T15:30:00Z'),
    },
    {
        id: '2',
        sku: 'CAL-002',
        name: 'Calça Jeans Skinny',
        description: 'Calça jeans com elastano para maior conforto.',
        price: 129.90,
        imageUrl: 'https://images.unsplash.com/photo-1602293589922-2542a04e3b39?q=80&w=300',
        category: 'Roupas',
        currentStock: 15,
        minimumStock: 5,
        createdAt: new Date('2025-08-02T11:00:00Z'),
        updatedAt: new Date('2025-09-12T11:00:00Z'),
    },
    {
        id: '3',
        sku: 'TEN-003',
        name: 'Tênis Casual Branco',
        description: 'Tênis de couro sintético, ideal para o dia a dia.',
        price: 199.90,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300',
        category: 'Calçados',
        currentStock: 3,
        minimumStock: 8,
        createdAt: new Date('2025-08-05T14:20:00Z'),
        updatedAt: new Date('2025-09-15T09:00:00Z'),
    },
    {
        id: '4',
        sku: 'BLU-004',
        name: 'Blusa Moletom Cinza',
        description: 'Blusa de moletom com capuz e bolso canguru.',
        price: 159.90,
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6d5f9650d?q=80&w=300',
        category: 'Roupas',
        currentStock: 0,
        minimumStock: 6,
        createdAt: new Date('2025-08-10T09:00:00Z'),
        updatedAt: new Date('2025-09-14T18:00:00Z'),
    },
    {
        id: '5',
        sku: 'BOL-005',
        name: 'Bolsa de Couro Preta',
        description: 'Bolsa de ombro com alça ajustável.',
        price: 249.90,
        imageUrl: 'https://images.unsplash.com/photo-1590874102422-9599585b318c?q=80&w=300',
        category: 'Acessórios',
        currentStock: 12,
        minimumStock: 5,
        createdAt: new Date('2025-08-15T16:00:00Z'),
        updatedAt: new Date('2025-09-11T12:00:00Z'),
    },
];

export const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    const handleAddProduct = () => {
        setEditingProduct(undefined);
        setIsProductFormOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductFormOpen(true);
    };
    
    const handleProductSubmit = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
        if(editingProduct){
             // Lógica de Edição
            setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...productData } : p));
        } else {
             // Lógica de Adição
            const newProduct: Product = {
                ...productData,
                id: (products.length + 1).toString(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setProducts([newProduct, ...products]);
        }
    };
    
    const getStockStatus = (product: Product) => {
        if (product.currentStock <= 0) return { label: 'Esgotado', color: 'danger' as const, value: 0 };
        if (product.currentStock <= product.minimumStock) return { label: 'Estoque Baixo', color: 'warning' as const, value: (product.currentStock / (product.minimumStock * 2)) * 100 };
        return { label: 'Em Estoque', color: 'success' as const, value: (product.currentStock / (product.minimumStock * 2)) * 100 };
    };
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
                    <p className="text-default-500 mt-1">
                        Gerencie o catálogo de produtos do seu estoque externo.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button color="default" variant="flat" startContent={<UploadIcon size={16} />}>
                        Importar CSV
                    </Button>
                    <Button color="primary" startContent={<PlusIcon size={16} />} onPress={handleAddProduct}>
                        Adicionar Produto
                    </Button>
                </div>
            </div>
            {/* Filtros */}
            <Card>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            placeholder="Buscar por nome ou SKU..."
                            startContent={<SearchIcon size={16} />}
                            isClearable
                        />
                        <Select label="Filtrar por Status">
                            <SelectItem key="all">Todos</SelectItem>
                            <SelectItem key="in_stock">Em Estoque</SelectItem>
                            <SelectItem key="low_stock">Estoque Baixo</SelectItem>
                            <SelectItem key="out_of_stock">Esgotado</SelectItem>
                        </Select>
                        <Select label="Filtrar por Categoria">
                            <SelectItem key="all">Todas</SelectItem>
                            <SelectItem key="roupas">Roupas</SelectItem>
                            <SelectItem key="calcados">Calçados</SelectItem>
                            <SelectItem key="acessorios">Acessórios</SelectItem>
                        </Select>
                    </div>
                </CardBody>
            </Card>

            {/* Tabela de Produtos */}
            <Card>
                <CardBody className="p-0">
                    <Table aria-label="Tabela de produtos">
                        <TableHeader>
                            <TableColumn>PRODUTO</TableColumn>
                            <TableColumn>CATEGORIA</TableColumn>
                            <TableColumn>PREÇO</TableColumn>
                            <TableColumn>ESTOQUE</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn width={50}>AÇÕES</TableColumn>
                        </TableHeader>
                        <TableBody items={products}>
                            {(item) => {
                                const status = getStockStatus(item);
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                             <div className="flex items-center gap-3">
                                                <Image src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                                <div>
                                                    <p className="font-semibold text-sm">{item.name}</p>
                                                    <p className="text-xs text-default-500">SKU: {item.sku}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip variant="flat" size="sm">{item.category}</Chip>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col w-32">
                                                <span className="text-sm font-semibold">{item.currentStock} <span className="text-xs text-default-500">un.</span></span>
                                                <Progress value={status.value} color={status.color} size="sm" className="mt-1" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip color={status.color} variant="dot" size="sm">{status.label}</Chip>
                                        </TableCell>
                                        <TableCell>
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button isIconOnly size="sm" variant="light">
                                                        <MoreVerticalIcon size={16} />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu>
                                                    <DropdownItem key="edit" startContent={<EditIcon size={16} />} onPress={() => handleEditProduct(item)}>
                                                        Editar
                                                    </DropdownItem>
                                                    <DropdownItem key="delete" color="danger" startContent={<Trash2Icon size={16} />}>
                                                        Excluir
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </TableCell>
                                    </TableRow>
                                );
                            }}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            {/* Paginação */}
            <div className="flex justify-center">
                <Pagination total={1} page={1} />
            </div>

            {/* Modal de Formulário */}
            <ProductForm
                isOpen={isProductFormOpen}
                onClose={() => setIsProductFormOpen(false)}
                onSubmit={handleProductSubmit}
                product={editingProduct}
                isEditing={!!editingProduct}
            />
        </div>
    );
};
