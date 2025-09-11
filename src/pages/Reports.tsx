// pages/Reports.tsx
import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Select,
    SelectItem,
    DatePicker,
    Divider,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Progress,
    Chip,
    Tabs,
    Tab,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@heroui/react';
import {
    BarChart3Icon,
    TrendingUpIcon,
    TrendingDownIcon,
    DownloadIcon,
    CalendarIcon,
    PackageIcon,
    AlertTriangleIcon,
    FileTextIcon,
    PieChartIcon,
    ActivityIcon,
    DollarSignIcon,
    RefreshCwIcon,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock data para os gráficos e relatórios
const stockMovementData = [
    { name: 'Jan', entradas: 65, saidas: 28 },
    { name: 'Fev', entradas: 59, saidas: 48 },
    { name: 'Mar', entradas: 80, saidas: 40 },
    { name: 'Abr', entradas: 81, saidas: 19 },
    { name: 'Mai', entradas: 56, saidas: 86 },
    { name: 'Jun', entradas: 55, saidas: 27 },
    { name: 'Jul', entradas: 40, saidas: 90 },
];

const categoryData = [
    { name: 'Roupas', value: 45, color: '#0070F3' },
    { name: 'Calçados', value: 25, color: '#7C3AED' },
    { name: 'Acessórios', value: 20, color: '#F59E0B' },
    { name: 'Outros', value: 10, color: '#EF4444' },
];

const topProductsData = [
    { sku: 'CAM-001', name: 'Camiseta Básica Preta', vendas: 156, receita: 4656.40, categoria: 'Roupas' },
    { sku: 'CAL-002', name: 'Calça Jeans Skinny', vendas: 98, receita: 8812.20, categoria: 'Roupas' },
    { sku: 'TEN-003', name: 'Tênis Casual Branco', vendas: 67, receita: 10713.30, categoria: 'Calçados' },
    { sku: 'BLU-004', name: 'Blusa Moletom Cinza', vendas: 54, receita: 3186.00, categoria: 'Roupas' },
    { sku: 'BOL-005', name: 'Bolsa Feminina Preta', vendas: 43, receita: 5160.00, categoria: 'Acessórios' },
];

const lowStockData = [
    { sku: 'CAM-001', name: 'Camiseta Básica Preta', atual: 2, minimo: 10, percentual: 20 },
    { sku: 'TEN-003', name: 'Tênis Casual Branco', atual: 3, minimo: 8, percentual: 37.5 },
    { sku: 'CAL-002', name: 'Calça Jeans Skinny', atual: 4, minimo: 5, percentual: 80 },
    { sku: 'BLU-004', name: 'Blusa Moletom Cinza', atual: 1, minimo: 6, percentual: 16.7 },
];

export const Reports: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [isExporting, setIsExporting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleExport = async (reportType: string) => {
        setIsExporting(true);
        // Simular exportação
        setTimeout(() => {
            console.log(`Exportando relatório: ${reportType}`);
            setIsExporting(false);
        }, 2000);
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const openReportModal = (reportType: string) => {
        setSelectedReport(reportType);
        setIsReportModalOpen(true);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStockStatusColor = (percentual: number) => {
        if (percentual < 30) return 'danger';
        if (percentual < 60) return 'warning';
        return 'success';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
                    <p className="text-default-500 mt-1">
                        Análises e insights do seu estoque externo
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
                        color="primary"
                        variant="flat"
                        startContent={<DownloadIcon size={16} />}
                        onPress={() => handleExport('geral')}
                        isLoading={isExporting}
                    >
                        Exportar Relatório Geral
                    </Button>
                </div>
            </div>

            {/* Filtros Globais */}
            <Card>
                <CardBody>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Select
                            label="Período"
                            selectedKeys={[selectedPeriod]}
                            onSelectionChange={(keys) => setSelectedPeriod(Array.from(keys)[0] as string)}
                            className="w-48"
                        >
                            <SelectItem key="7">Últimos 7 dias</SelectItem>
                            <SelectItem key="30">Últimos 30 dias</SelectItem>
                            <SelectItem key="90">Últimos 90 dias</SelectItem>
                            <SelectItem key="365">Último ano</SelectItem>
                        </Select>

                        <Select
                            label="Categoria"
                            selectedKeys={[selectedCategory]}
                            onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
                            className="w-48"
                        >
                            <SelectItem key="ALL">Todas as categorias</SelectItem>
                            <SelectItem key="ROUPAS">Roupas</SelectItem>
                            <SelectItem key="CALCADOS">Calçados</SelectItem>
                            <SelectItem key="ACESSORIOS">Acessórios</SelectItem>
                        </Select>
                    </div>
                </CardBody>
            </Card>

            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none bg-gradient-to-br from-blue-500 to-purple-600">
                    <CardBody className="text-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Receita Total</p>
                                <p className="text-2xl font-bold">R$ 125.760</p>
                                <p className="text-xs opacity-70">+12% vs mês anterior</p>
                            </div>
                            <DollarSignIcon size={32} className="opacity-80" />
                        </div>
                    </CardBody>
                </Card>

                <Card className="border-none bg-gradient-to-br from-green-500 to-teal-600">
                    <CardBody className="text-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Total de Vendas</p>
                                <p className="text-2xl font-bold">1.247</p>
                                <p className="text-xs opacity-70">+8% vs mês anterior</p>
                            </div>
                            <TrendingUpIcon size={32} className="opacity-80" />
                        </div>
                    </CardBody>
                </Card>

                <Card className="border-none bg-gradient-to-br from-orange-500 to-red-600">
                    <CardBody className="text-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Produtos em Falta</p>
                                <p className="text-2xl font-bold">12</p>
                                <p className="text-xs opacity-70">-3 vs semana anterior</p>
                            </div>
                            <AlertTriangleIcon size={32} className="opacity-80" />
                        </div>
                    </CardBody>
                </Card>

                <Card className="border-none bg-gradient-to-br from-purple-500 to-pink-600">
                    <CardBody className="text-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Giro de Estoque</p>
                                <p className="text-2xl font-bold">2.3x</p>
                                <p className="text-xs opacity-70">Mensal</p>
                            </div>
                            <ActivityIcon size={32} className="opacity-80" />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Conteúdo com Abas */}
            <Tabs aria-label="Relatórios" color="primary" variant="underlined">
                {/* Aba de Movimentações */}
                <Tab key="movements" title={
                    <div className="flex items-center gap-2">
                        <BarChart3Icon size={16} />
                        <span>Movimentações</span>
                    </div>
                }>
                    <div className="space-y-6 mt-6">
                        {/* Gráfico de Movimentações */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center w-full">
                                    <h3 className="text-lg font-semibold">Movimentações de Estoque</h3>
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        startContent={<DownloadIcon size={14} />}
                                        onPress={() => handleExport('movimentacoes')}
                                    >
                                        Exportar
                                    </Button>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stockMovementData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="entradas" stroke="#10B981" strokeWidth={2} />
                                            <Line type="monotone" dataKey="saidas" stroke="#EF4444" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Tab>

                {/* Aba de Produtos */}
                <Tab key="products" title={
                    <div className="flex items-center gap-2">
                        <PackageIcon size={16} />
                        <span>Produtos</span>
                    </div>
                }>
                    <div className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Distribuição por Categoria */}
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">Distribuição por Categoria</h3>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent = 0 }: { name: string; percent?: number }) =>
                                                        `${name} ${(percent * 100).toFixed(0)}%`
                                                    } outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Top 5 Produtos */}
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center w-full">
                                        <h3 className="text-lg font-semibold">Top 5 Produtos</h3>
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            onPress={() => openReportModal('top-produtos')}
                                        >
                                            Ver Completo
                                        </Button>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody className="p-0">
                                    <Table aria-label="Top produtos" removeWrapper>
                                        <TableHeader>
                                            <TableColumn>PRODUTO</TableColumn>
                                            <TableColumn>VENDAS</TableColumn>
                                            <TableColumn>RECEITA</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {topProductsData.map((product, index) => (
                                                <TableRow key={product.sku}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                                                <span className="text-xs font-bold text-primary">{index + 1}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">{product.name}</p>
                                                                <p className="text-xs text-default-500">{product.sku}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium">{product.vendas}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-success">
                                                            {formatCurrency(product.receita)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </Tab>

                {/* Aba de Alertas */}
                <Tab key="alerts" title={
                    <div className="flex items-center gap-2">
                        <AlertTriangleIcon size={16} />
                        <span>Alertas</span>
                    </div>
                }>
                    <div className="space-y-6 mt-6">
                        {/* Produtos com Estoque Baixo */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center w-full">
                                    <h3 className="text-lg font-semibold">Produtos com Estoque Baixo</h3>
                                    <Button
                                        color="warning"
                                        size="sm"
                                        variant="flat"
                                        startContent={<DownloadIcon size={14} />}
                                        onPress={() => handleExport('estoque-baixo')}
                                    >
                                        Exportar Lista
                                    </Button>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="space-y-4">
                                    {lowStockData.map((item) => (
                                        <div key={item.sku} className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-medium text-sm">{item.name}</p>
                                                        <p className="text-xs text-default-500">SKU: {item.sku}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <div className="flex items-center gap-2 text-xs text-default-500">
                                                        <span>Atual: {item.atual}</span>
                                                        <span>•</span>
                                                        <span>Mínimo: {item.minimo}</span>
                                                    </div>
                                                    <Progress
                                                        size="sm"
                                                        value={item.percentual}
                                                        color={getStockStatusColor(item.percentual)}
                                                        className="mt-1"
                                                        classNames={{
                                                            track: "drop-shadow-md border border-default",
                                                            indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <Chip
                                                    color={getStockStatusColor(item.percentual)}
                                                    size="sm"
                                                    variant="flat"
                                                >
                                                    {item.percentual.toFixed(1)}%
                                                </Chip>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Tab>

                {/* Aba de Análises */}
                <Tab key="analytics" title={
                    <div className="flex items-center gap-2">
                        <PieChartIcon size={16} />
                        <span>Análises</span>
                    </div>
                }>
                    <div className="space-y-6 mt-6">
                        {/* Análise de Vendas por Categoria */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Vendas por Categoria (Últimos 30 dias)</h3>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { categoria: 'Roupas', vendas: 450, receita: 13500 },
                                            { categoria: 'Calçados', vendas: 280, receita: 22400 },
                                            { categoria: 'Acessórios', vendas: 120, receita: 7200 },
                                            { categoria: 'Outros', vendas: 80, receita: 2400 },
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="categoria" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="vendas" fill="#0070F3" name="Quantidade Vendida" />
                                            <Bar dataKey="receita" fill="#7C3AED" name="Receita (R$)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Insights e Recomendações */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold text-blue-900">Insights</h3>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-blue-900">Calçados têm a maior receita por unidade vendida</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-blue-900">Crescimento de 12% nas vendas este mês</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-blue-900">5 produtos precisam de reposição urgente</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold text-green-900">Recomendações</h3>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-green-900">Reabastecer estoque de camisetas básicas</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-green-900">Considere expandir linha de calçados</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-green-900">Revisar preços dos acessórios</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </Tab>
            </Tabs>

            {/* Modal de Relatório Detalhado */}
            <Modal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                size="2xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader>
                        <div className="flex items-center gap-2">
                            <FileTextIcon size={20} />
                            <span>Relatório Detalhado</span>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {selectedReport === 'top-produtos' && (
                            <div className="space-y-4">
                                <Table aria-label="Relatório completo de produtos">
                                    <TableHeader>
                                        <TableColumn>POSIÇÃO</TableColumn>
                                        <TableColumn>PRODUTO</TableColumn>
                                        <TableColumn>CATEGORIA</TableColumn>
                                        <TableColumn>VENDAS</TableColumn>
                                        <TableColumn>RECEITA</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {topProductsData.map((product, index) => (
                                            <TableRow key={product.sku}>
                                                <TableCell>
                                                    <Chip color="primary" size="sm" variant="flat">
                                                        #{index + 1}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-sm text-default-500">{product.sku}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{product.categoria}</TableCell>
                                                <TableCell>{product.vendas}</TableCell>
                                                <TableCell>
                                                    <span className="font-medium text-success">
                                                        {formatCurrency(product.receita)}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            variant="flat"
                            startContent={<DownloadIcon size={16} />}
                            onPress={() => handleExport(selectedReport || 'detalhado')}
                        >
                            Exportar
                        </Button>
                        <Button
                            color="primary"
                            onPress={() => setIsReportModalOpen(false)}
                        >
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};