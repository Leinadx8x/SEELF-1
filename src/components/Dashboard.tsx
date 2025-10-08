// src/components/Dashboard.tsx
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  AlertTriangleIcon, 
  PackageIcon,
  PlusIcon,
  DollarSignIcon // Novo ícone
} from 'lucide-react';
import { DashboardStats, StockAlert, StockMovement } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  alerts: StockAlert[];
  recentMovements: StockMovement[];
  onAddProduct: () => void;
  onViewProduct: (productId: string) => void;
  onRecordMovement: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  alerts,
  recentMovements,
  onAddProduct,
  onViewProduct,
  onRecordMovement,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            S.E.E.L.F. - Dashboard
          </h1>
          <p className="text-default-500 mt-1">
            Sistema de Estoque Externo para Lojas Franqueadas
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            color="secondary" 
            variant="flat"
            onPress={onRecordMovement}
            startContent={<TrendingUpIcon size={16} />}
          >
            Registrar Movimento
          </Button>
          <Button 
            color="primary"
            onPress={onAddProduct}
            startContent={<PlusIcon size={16} />}
          >
            Adicionar Produto
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas Atualizados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none bg-gradient-to-br from-violet-500 to-purple-500">
          <CardBody className="text-white p-4">
            <div className="flex items-center gap-3">
              <PackageIcon size={24} />
              <div>
                <p className="text-sm opacity-80">Total de Produtos</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none bg-gradient-to-br from-orange-400 to-red-400">
          <CardBody className="text-white p-4">
            <div className="flex items-center gap-3">
              <AlertTriangleIcon size={24} />
              <div>
                <p className="text-sm opacity-80">Estoque Baixo</p>
                <p className="text-2xl font-bold">{stats.lowStockProducts}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none bg-gradient-to-br from-red-500 to-pink-500">
          <CardBody className="text-white p-4">
            <div className="flex items-center gap-3">
              <TrendingDownIcon size={24} />
              <div>
                <p className="text-sm opacity-80">Sem Estoque</p>
                <p className="text-2xl font-bold">{stats.outOfStockProducts}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="border-none bg-gradient-to-br from-blue-500 to-cyan-500">
          <CardBody className="text-white p-4">
            <div className="flex items-center gap-3">
              <DollarSignIcon size={24} />
              <div>
                <p className="text-sm opacity-80">Valor em Estoque</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.valorTotalMercadoriasEstoque || 0)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Estoque */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon size={20} className="text-warning" />
              <h3 className="text-lg font-semibold">Alertas de Estoque</h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-default-500">
                Nenhum alerta no momento
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {alerts.slice(0, 5).map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-default-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.productName}</p>
                      <p className="text-xs text-default-500">
                        SKU: {alert.productSku}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip
                        color={alert.alertType === 'OUT_OF_STOCK' ? 'danger' : 'warning'}
                        size="sm"
                        variant="flat"
                      >
                        {alert.currentStock} un.
                      </Chip>
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => onViewProduct(alert.productId)}
                      >
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Movimentações Recentes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUpIcon size={20} className="text-primary" />
              <h3 className="text-lg font-semibold">Movimentações Recentes</h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            {recentMovements.length === 0 ? (
              <div className="p-6 text-center text-default-500">
                Nenhuma movimentação recente
              </div>
            ) : (
              <Table 
                aria-label="Movimentações recentes"
                removeWrapper
                className="min-h-[200px]"
              >
                <TableHeader>
                  <TableColumn>PRODUTO</TableColumn>
                  <TableColumn>TIPO</TableColumn>
                  <TableColumn>QTD</TableColumn>
                  <TableColumn>DATA</TableColumn>
                </TableHeader>
                <TableBody items={recentMovements}>
                  {(movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{movement.productName}</p>
                          <p className="text-xs text-default-500">{movement.productSku}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={movement.type === 'IN' || movement.type === 'ENTRADA' ? 'success' : 'danger'}
                          size="sm"
                          variant="flat"
                        >
                          {movement.type === 'IN' || movement.type === 'ENTRADA' ? 'Entrada' : 'Saída'}
                        </Chip>
                      </TableCell>
                      <TableCell className="font-medium">
                        {movement.type === 'IN' || movement.type === 'ENTRADA' ? '+' : '-'}{movement.quantity}
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDate(movement.timestamp)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};