import React, { useState, useEffect } from 'react'; 
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
    Image,
} from '@heroui/react';
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    UploadIcon,
    MoreVerticalIcon,
    EditIcon,
    Trash2Icon,
} from 'lucide-react';
import { ProductForm } from '../components/ProductForm';
import { Product } from '../types';
import { getProducts, createProduct } from '../services/api'; 

export const Products: React.FC = () => {
    
    const [products, setProducts] = useState<Product[]>([]);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Falha ao buscar produtos:", error);
            
            }
        };

        fetchProducts();
    }, []); 

    const handleAddProduct = () => {
        setEditingProduct(undefined);
        setIsProductFormOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductFormOpen(true);
    };
    
    const handleProductSubmit = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
        if(editingProduct){
             
            console.log("Editando produto...", productData);
        } else {
             
             try {
                const newProduct = await createProduct(productData);
                setProducts(prevProducts => [newProduct, ...prevProducts]);
             } catch(error) {
                console.error("Falha ao criar produto:", error);
             }
        }
    };
    
    const getStockStatus = (product: Product) => {
        if (product.currentStock <= 0) return { label: 'Esgotado', color: 'danger' as const, value: 0 };
        if (product.currentStock <= product.minimumStock) return { label: 'Estoque Baixo', color: 'warning' as const, value: (product.currentStock / (product.minimumStock * 2)) * 100 };
        return { label: 'Em Estoque', color: 'success' as const, value: (product.currentStock / (product.minimumStock * 2)) * 100 };
    };
    
    return (
        <div className="space-y-6">
            {}
            {}
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
            {}
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

            {}
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
                        <TableBody items={products} emptyContent={"Nenhum produto encontrado."}>
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

            {}
            <div className="flex justify-center">
                <Pagination total={1} page={1} />
            </div>

            {}
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