// src/pages/Reports.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Progress, Spinner } from '@heroui/react';
import { BarChart3Icon, AlertTriangleIcon, PackageIcon, DollarSignIcon, ActivityIcon, RefreshCwIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getProducts, getMovements } from '../services/api';
import { Product, StockMovement } from '../types';

export const Reports: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [productsData, movementsData] = await Promise.all([getProducts(), getMovements()]);
            setProducts(productsData);
            setMovements(movementsData);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stockMovementData = React.useMemo(() => {
        const monthlyData: { [key: string]: { name: string, entradas: number, saidas: number, defeitos: number } } = {};
        
        movements.forEach(mov => {
            try {
                const date = new Date(mov.timestamp);
                if (isNaN(date.getTime())) return; // Pula data inválida

                const month = date.toLocaleString('pt-BR', { month: 'short' });
                
                if (!monthlyData[month]) {
                    monthlyData[month] = { name: month, entradas: 0, saidas: 0, defeitos: 0 };
                }
                
                const type = (mov.type || '').toUpperCase();
                if (type === 'ENTRADA' || type === 'IN') {
                    monthlyData[month].entradas += mov.quantity;
                } else if (type === 'DEFEITO') {
                    monthlyData[month].defeitos += mov.quantity;
                } else { 
                    monthlyData[month].saidas += mov.quantity;
                }
            } catch (e) {
                console.warn("Erro ao processar movimentação no relatório", mov);
            }
        });
        
        return Object.values(monthlyData);
    }, [movements]);

    const lowStockData = React.useMemo(() => {
        return products
            .filter(p => p.currentStock > 0 && p.currentStock <= p.minimumStock)
            .map(p => ({
                ...p,
                percentual: p.minimumStock > 0 ? (p.currentStock / p.minimumStock) * 100 : 0
            }));
    }, [products]);
    
    const kpis = React.useMemo(() => {
        const valorTotalEstoque = products.reduce((acc, p) => acc + (p.price * p.currentStock), 0);
        const produtosEmFalta = products.filter(p => p.currentStock === 0).length;
        return { valorTotalEstoque, produtosEmFalta };
    }, [products]);

    const formatCurrency = (value: number) => {
        try {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        } catch { return 'R$ 0,00'; }
    };

    const getStockStatusColor = (percentual: number) => {
        if (percentual < 30) return 'danger';
        if (percentual < 60) return 'warning';
        return 'success';
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner label="Carregando..." color="primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Relatórios</h1>
                    <p className="text-default-500 mt-1">Análises e insights do seu estoque</p>
                </div>
                <Button color="secondary" variant="flat" startContent={<RefreshCwIcon size={16} />} onPress={fetchData}>
                    Atualizar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <CardBody>
                        <DollarSignIcon size={24} />
                        <p className="text-sm mt-2">Valor Total em Estoque</p>
                        <p className="text-2xl font-bold">{formatCurrency(kpis.valorTotalEstoque)}</p>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
                     <CardBody>
                        <PackageIcon size={24} />
                        <p className="text-sm mt-2">Total de Itens (SKUs)</p>
                        <p className="text-2xl font-bold">{products.length}</p>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                     <CardBody>
                        <AlertTriangleIcon size={24} />
                        <p className="text-sm mt-2">Produtos em Falta</p>
                        <p className="text-2xl font-bold">{kpis.produtosEmFalta}</p>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                    <CardBody>
                        <ActivityIcon size={24} />
                        <p className="text-sm mt-2">Total de Movimentações</p>
                        <p className="text-2xl font-bold">{movements.length}</p>
                    </CardBody>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><h3 className="text-lg font-semibold flex items-center gap-2"><BarChart3Icon size={20}/> Movimentações de Estoque (por Mês)</h3></CardHeader>
                    <Divider />
                    <CardBody>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stockMovementData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="entradas" name="Entradas" stroke="#10B981" strokeWidth={2} />
                                    <Line type="monotone" dataKey="saidas" name="Saídas" stroke="#EF4444" strokeWidth={2} />
                                    <Line type="monotone" dataKey="defeitos" name="Defeitos" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardBody>
                </Card>
                
                <Card>
                    <CardHeader><h3 className="text-lg font-semibold flex items-center gap-2"><AlertTriangleIcon size={20}/> Produtos com Estoque Baixo</h3></CardHeader>
                    <Divider />
                    <CardBody className="max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                            {lowStockData.length > 0 ? lowStockData.map((item) => (
                                <div key={item.id}>
                                    <div className="flex justify-between text-sm">
                                        <p className="font-medium truncate pr-4">{item.name}</p>
                                        <p>{item.currentStock} / {item.minimumStock}</p>
                                    </div>
                                    <Progress size="sm" value={item.percentual} color={getStockStatusColor(item.percentual)} className="mt-1" />
                                </div>
                            )) : <p className="text-default-500 text-center py-10">Nenhum produto com estoque baixo!</p>}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};