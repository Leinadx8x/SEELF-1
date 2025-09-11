// pages/Integrations.tsx
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Switch,
  Divider,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Code,
  Tabs,
  Tab,
  Badge,
  Accordion,
  AccordionItem,
} from '@heroui/react';
import {
  DatabaseIcon,
  PlugIcon,
  SettingsIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  EyeOffIcon,
  CopyIcon,
  ExternalLinkIcon,
  ShoppingCartIcon,
  GlobeIcon,
  KeyIcon,
  ClockIcon,
  TrendingUpIcon,
  BookOpenIcon,
  HelpCircleIcon,
  ZapIcon,
} from 'lucide-react';

// Tipos para integrações
interface Integration {
  id: string;
  name: string;
  platform: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  logo: string;
  description: string;
  lastSync?: Date;
  productsImported: number;
  syncFrequency: string;
  apiEndpoint?: string;
  webhookUrl?: string;
}

interface SyncLog {
  id: string;
  integrationName: string;
  timestamp: Date;
  action: 'import' | 'export' | 'sync';
  status: 'success' | 'error' | 'warning';
  itemsProcessed: number;
  errors?: string[];
  details?: string;
}

// Mock data
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Loja Principal - Shopify',
    platform: 'Shopify',
    status: 'connected',
    logo: '🛍️',
    description: 'Sincronização automática com loja principal no Shopify',
    lastSync: new Date(Date.now() - 1000 * 60 * 30),
    productsImported: 156,
    syncFrequency: 'A cada 30 minutos',
    apiEndpoint: 'https://sua-loja.myshopify.com/admin/api/2023-07/products.json',
    webhookUrl: 'https://api.seelf.com/webhook/shopify/1',
  },
  {
    id: '2',
    name: 'Marketplace - Mercado Livre',
    platform: 'MercadoLivre',
    status: 'syncing',
    logo: '🛒',
    description: 'Integração com anúncios do Mercado Livre',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2),
    productsImported: 89,
    syncFrequency: 'A cada 1 hora',
    apiEndpoint: 'https://api.mercadolibre.com/sites/MLB/search',
  },
  {
    id: '3',
    name: 'WooCommerce Store',
    platform: 'WooCommerce',
    status: 'error',
    logo: '🌐',
    description: 'Loja secundária em WordPress/WooCommerce',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    productsImported: 67,
    syncFrequency: 'A cada 2 horas',
  },
];

const mockSyncLogs: SyncLog[] = [
  {
    id: '1',
    integrationName: 'Loja Principal - Shopify',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    action: 'sync',
    status: 'success',
    itemsProcessed: 15,
    details: 'Sincronização automática executada com sucesso',
  },
  {
    id: '2',
    integrationName: 'Marketplace - Mercado Livre',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    action: 'import',
    status: 'warning',
    itemsProcessed: 8,
    errors: ['Produto ML123456 sem imagem', '2 produtos com preço zerado'],
    details: 'Importação concluída com avisos',
  },
  {
    id: '3',
    integrationName: 'WooCommerce Store',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    action: 'sync',
    status: 'error',
    itemsProcessed: 0,
    errors: ['Falha na autenticação', 'Endpoint não encontrado'],
    details: 'Erro de conexão - verificar credenciais',
  },
];

const availablePlatforms = [
  { key: 'shopify', name: 'Shopify', logo: '🛍️', description: 'Plataforma de e-commerce completa' },
  { key: 'woocommerce', name: 'WooCommerce', logo: '🌐', description: 'Plugin WordPress para e-commerce' },
  { key: 'mercadolivre', name: 'Mercado Livre', logo: '🛒', description: 'Marketplace brasileiro' },
  { key: 'americanas', name: 'Americanas', logo: '🏪', description: 'Marketplace Americanas' },
  { key: 'magento', name: 'Magento', logo: '📦', description: 'Plataforma de e-commerce empresarial' },
  { key: 'vtex', name: 'VTEX', logo: '⚡', description: 'Plataforma de comércio digital' },
];

export const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(mockSyncLogs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  const [newIntegrationData, setNewIntegrationData] = useState({
    name: '',
    platform: '',
    apiKey: '',
    apiSecret: '',
    storeUrl: '',
    syncFrequency: '30',
  });

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'success';
      case 'syncing': return 'primary';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'syncing': return 'Sincronizando';
      case 'error': return 'Erro';
      default: return 'Desconectado';
    }
  };

  const getLogStatusColor = (status: SyncLog['status']) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    }
  };

  const handleAddIntegration = async () => {
    setIsTestingConnection(true);
    
    // Simular teste de conexão
    setTimeout(() => {
      const newIntegration: Integration = {
        id: Date.now().toString(),
        name: newIntegrationData.name,
        platform: newIntegrationData.platform,
        status: 'connected',
        logo: availablePlatforms.find(p => p.key === newIntegrationData.platform)?.logo || '📦',
        description: `Integração com ${newIntegrationData.platform}`,
        lastSync: new Date(),
        productsImported: 0,
        syncFrequency: `A cada ${newIntegrationData.syncFrequency} minutos`,
        apiEndpoint: newIntegrationData.storeUrl,
      };
      
      setIntegrations(prev => [...prev, newIntegration]);
      setIsAddModalOpen(false);
      setNewIntegrationData({
        name: '',
        platform: '',
        apiKey: '',
        apiSecret: '',
        storeUrl: '',
        syncFrequency: '30',
      });
      setIsTestingConnection(false);
    }, 3000);
  };

  const handleSync = async (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId 
          ? { ...int, status: 'syncing' as const }
          : int
      )
    );

    // Simular sincronização
    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integrationId 
            ? { ...int, status: 'connected' as const, lastSync: new Date() }
            : int
        )
      );
      
      // Adicionar log
      const integration = integrations.find(int => int.id === integrationId);
      if (integration) {
        const newLog: SyncLog = {
          id: Date.now().toString(),
          integrationName: integration.name,
          timestamp: new Date(),
          action: 'sync',
          status: 'success',
          itemsProcessed: Math.floor(Math.random() * 20) + 1,
          details: 'Sincronização manual executada',
        };
        setSyncLogs(prev => [newLog, ...prev]);
      }
    }, 3000);
  };

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId 
          ? { 
              ...int, 
              status: int.status === 'connected' ? 'disconnected' as const : 'connected' as const 
            }
          : int
      )
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
          <p className="text-default-500 mt-1">
            Conecte seu estoque com plataformas de e-commerce e marketplaces
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            color="secondary"
            variant="flat"
            startContent={<BookOpenIcon size={16} />}
            onPress={() => window.open('https://docs.seelf.com/integrations', '_blank')}
          >
            Documentação
          </Button>
          
          <Button
            color="primary"
            startContent={<PlugIcon size={16} />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Nova Integração
          </Button>
        </div>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none bg-gradient-to-br from-green-500 to-emerald-600">
          <CardBody className="text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Integrações Ativas</p>
                <p className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
              <CheckCircleIcon size={32} className="opacity-80" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-none bg-gradient-to-br from-blue-500 to-cyan-600">
          <CardBody className="text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Produtos Importados</p>
                <p className="text-2xl font-bold">
                  {integrations.reduce((sum, i) => sum + i.productsImported, 0)}
                </p>
              </div>
              <TrendingUpIcon size={32} className="opacity-80" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-none bg-gradient-to-br from-purple-500 to-violet-600">
          <CardBody className="text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Sincronizações Hoje</p>
                <p className="text-2xl font-bold">
                  {syncLogs.filter(log => 
                    log.timestamp.toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <RefreshCwIcon size={32} className="opacity-80" />
            </div>
          </CardBody>
        </Card>

        <Card className="border-none bg-gradient-to-br from-orange-500 to-red-600">
          <CardBody className="text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Com Erro</p>
                <p className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
              <AlertTriangleIcon size={32} className="opacity-80" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Conteúdo com Abas */}
      <Tabs aria-label="Seções de integrações" color="primary" variant="underlined">
        {/* Aba de Integrações Ativas */}
        <Tab key="active" title={
          <div className="flex items-center gap-2">
            <PlugIcon size={16} />
            <span>Integrações Ativas</span>
            <Badge size="sm" color="primary">3</Badge>
          </div>
        }>
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{integration.logo}</div>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-sm text-default-500">{integration.platform}</p>
                        </div>
                      </div>
                      <Chip 
                        color={getStatusColor(integration.status)}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusLabel(integration.status)}
                      </Chip>
                    </div>
                  </CardHeader>
                  
                  <Divider />
                  
                  <CardBody>
                    <p className="text-sm text-default-600 mb-4">{integration.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-default-500">Produtos Importados:</span>
                        <span className="font-medium">{integration.productsImported}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-default-500">Frequência:</span>
                        <span className="font-medium">{integration.syncFrequency}</span>
                      </div>
                      
                      {integration.lastSync && (
                        <div className="flex justify-between text-sm">
                          <span className="text-default-500">Última Sinc:</span>
                          <span className="font-medium">{formatRelativeTime(integration.lastSync)}</span>
                        </div>
                      )}
                      
                      {integration.status === 'syncing' && (
                        <Progress 
                          size="sm" 
                          isIndeterminate 
                          color="primary" 
                          className="mt-2"
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="flat"
                        color={integration.status === 'syncing' ? 'default' : 'primary'}
                        startContent={integration.status === 'syncing' ? 
                          <RefreshCwIcon size={14} className="animate-spin" /> : 
                          <RefreshCwIcon size={14} />
                        }
                        onPress={() => handleSync(integration.id)}
                        isDisabled={integration.status === 'syncing'}
                      >
                        {integration.status === 'syncing' ? 'Sincronizando...' : 'Sincronizar'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<SettingsIcon size={14} />}
                        onPress={() => {
                          setSelectedIntegration(integration);
                          setIsConfigModalOpen(true);
                        }}
                      >
                        Configurar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="flat"
                        color={integration.status === 'connected' ? 'danger' : 'success'}
                        startContent={integration.status === 'connected' ? 
                          <PauseIcon size={14} /> : <PlayIcon size={14} />
                        }
                        onPress={() => handleToggleIntegration(integration.id)}
                      >
                        {integration.status === 'connected' ? 'Pausar' : 'Ativar'}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </Tab>

        {/* Aba de Logs */}
        <Tab key="logs" title={
          <div className="flex items-center gap-2">
            <ClockIcon size={16} />
            <span>Logs de Sincronização</span>
          </div>
        }>
          <div className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Histórico de Sincronizações</h3>
              </CardHeader>
              <Divider />
              <CardBody className="p-0">
                <Table aria-label="Logs de sincronização" removeWrapper>
                  <TableHeader>
                    <TableColumn>INTEGRAÇÃO</TableColumn>
                    <TableColumn>AÇÃO</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ITENS</TableColumn>
                    <TableColumn>DATA/HORA</TableColumn>
                    <TableColumn>DETALHES</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {syncLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <span className="text-sm font-medium">{log.integrationName}</span>
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" variant="flat" color="default">
                            {log.action.toUpperCase()}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="sm" 
                            variant="flat"
                            color={getLogStatusColor(log.status)}
                          >
                            {log.status === 'success' ? 'Sucesso' : 
                             log.status === 'warning' ? 'Aviso' : 'Erro'}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{log.itemsProcessed}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs font-medium">{formatDate(log.timestamp)}</p>
                            <p className="text-xs text-default-500">{formatRelativeTime(log.timestamp)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs">{log.details}</p>
                            {log.errors && log.errors.length > 0 && (
                              <div className="mt-1">
                                {log.errors.map((error, index) => (
                                  <p key={index} className="text-xs text-danger">{error}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* Aba de Configurações */}
        <Tab key="settings" title={
          <div className="flex items-center gap-2">
            <SettingsIcon size={16} />
            <span>Configurações</span>
          </div>
        }>
          <div className="space-y-6 mt-6">
            {/* Configurações Globais */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Configurações Globais</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sincronização Automática</p>
                      <p className="text-sm text-default-500">
                        Permitir que integrações sincronizem automaticamente
                      </p>
                    </div>
                    <Switch defaultSelected />
                  </div>
                  
                  <Divider />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações de Erro</p>
                      <p className="text-sm text-default-500">
                        Receber alertas quando houver falhas nas sincronizações
                      </p>
                    </div>
                    <Switch defaultSelected />
                  </div>
                  
                  <Divider />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Log Detalhado</p>
                      <p className="text-sm text-default-500">
                        Registrar informações detalhadas de debug
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* API Keys */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Chaves de API</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-default-500 mb-2">Chave de API do S.E.E.L.F.</p>
                    <div className="flex gap-2">
                      <Code className="flex-1">
                        {isApiKeyVisible ? 'seelf_api_key_1234567890abcdef' : '••••••••••••••••••••••••••••••••'}
                      </Code>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => setIsApiKeyVisible(!isApiKeyVisible)}
                      >
                        {isApiKeyVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => copyToClipboard('seelf_api_key_1234567890abcdef')}
                      >
                        <CopyIcon size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-default-500 mb-2">Webhook URL</p>
                    <div className="flex gap-2">
                      <Code className="flex-1">
                        https://api.seelf.com/webhook/{'{integration_id}'}
                      </Code>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => copyToClipboard('https://api.seelf.com/webhook/{integration_id}')}
                      >
                        <CopyIcon size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Documentação */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Recursos de Ajuda</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="flat"
                    startContent={<BookOpenIcon size={16} />}
                    endContent={<ExternalLinkIcon size={16} />}
                    className="h-16 justify-between"
                  >
                    <div className="text-left">
                      <p className="font-medium">Documentação da API</p>
                      <p className="text-xs text-default-500">Guias técnicos e referência</p>
                    </div>
                  </Button>
                  
                  <Button
                    variant="flat"
                    startContent={<HelpCircleIcon size={16} />}
                    endContent={<ExternalLinkIcon size={16} />}
                    className="h-16 justify-between"
                  >
                    <div className="text-left">
                      <p className="font-medium">Suporte Técnico</p>
                      <p className="text-xs text-default-500">Central de ajuda</p>
                    </div>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>

      {/* Modal para Nova Integração */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        size="lg"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <PlugIcon size={20} />
              <span>Nova Integração</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Plataforma"
                placeholder="Selecione a plataforma"
                selectedKeys={newIntegrationData.platform ? [newIntegrationData.platform] : []}
                onSelectionChange={(keys) => 
                  setNewIntegrationData(prev => ({ ...prev, platform: Array.from(keys)[0] as string }))
                }
              >
                {availablePlatforms.map((platform) => (
                  <SelectItem 
                    key={platform.key}
                    startContent={<span className="text-lg">{platform.logo}</span>}
                  >
                    <div>
                      <p className="font-medium">{platform.name}</p>
                      <p className="text-xs text-default-500">{platform.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </Select>
              
              <Input
                label="Nome da Integração"
                placeholder="Ex: Loja Principal - Shopify"
                value={newIntegrationData.name}
                onValueChange={(value) => 
                  setNewIntegrationData(prev => ({ ...prev, name: value }))
                }
              />
              
              <Input
                label="URL da Loja/API"
                placeholder="https://sua-loja.com"
                value={newIntegrationData.storeUrl}
                onValueChange={(value) => 
                  setNewIntegrationData(prev => ({ ...prev, storeUrl: value }))
                }
              />
              
              <Input
                label="Chave da API"
                placeholder="Sua chave de API"
                type="password"
                value={newIntegrationData.apiKey}
                onValueChange={(value) => 
                  setNewIntegrationData(prev => ({ ...prev, apiKey: value }))
                }
              />
              
              <Input
                label="API Secret (opcional)"
                placeholder="Chave secreta da API"
                type="password"
                value={newIntegrationData.apiSecret}
                onValueChange={(value) => 
                  setNewIntegrationData(prev => ({ ...prev, apiSecret: value }))
                }
              />
              
              <Select
                label="Frequência de Sincronização"
                selectedKeys={[newIntegrationData.syncFrequency]}
                onSelectionChange={(keys) => 
                  setNewIntegrationData(prev => ({ ...prev, syncFrequency: Array.from(keys)[0] as string }))
                }
              >
                <SelectItem key="15">A cada 15 minutos</SelectItem>
                <SelectItem key="30">A cada 30 minutos</SelectItem>
                <SelectItem key="60">A cada 1 hora</SelectItem>
                <SelectItem key="120">A cada 2 horas</SelectItem>
                <SelectItem key="360">A cada 6 horas</SelectItem>
                <SelectItem key="1440">A cada 24 horas</SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="danger" 
              variant="light" 
              onPress={() => setIsAddModalOpen(false)}
              isDisabled={isTestingConnection}
            >
              Cancelar
            </Button>
            <Button 
              color="primary" 
              onPress={handleAddIntegration}
              isLoading={isTestingConnection}
              isDisabled={!newIntegrationData.name || !newIntegrationData.platform || !newIntegrationData.apiKey}
            >
              {isTestingConnection ? 'Testando Conexão...' : 'Adicionar Integração'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Configuração */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon size={20} />
              <span>Configurar Integração</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedIntegration && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Informações Básicas</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-default-50 rounded-lg">
                      <span className="text-2xl">{selectedIntegration.logo}</span>
                      <div>
                        <p className="font-medium">{selectedIntegration.name}</p>
                        <p className="text-sm text-default-500">{selectedIntegration.platform}</p>
                      </div>
                      <Chip 
                        color={getStatusColor(selectedIntegration.status)}
                        variant="flat"
                      >
                        {getStatusLabel(selectedIntegration.status)}
                      </Chip>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Configurações de Sincronização */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Configurações de Sincronização</h4>
                  <div className="space-y-4">
                    <Select
                      label="Frequência de Sincronização"
                      defaultSelectedKeys={["30"]}
                      className="max-w-xs"
                    >
                      <SelectItem key="15">A cada 15 minutos</SelectItem>
                      <SelectItem key="30">A cada 30 minutos</SelectItem>
                      <SelectItem key="60">A cada 1 hora</SelectItem>
                      <SelectItem key="120">A cada 2 horas</SelectItem>
                      <SelectItem key="360">A cada 6 horas</SelectItem>
                      <SelectItem key="1440">A cada 24 horas</SelectItem>
                    </Select>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sincronização de Preços</p>
                        <p className="text-sm text-default-500">
                          Atualizar preços automaticamente da plataforma
                        </p>
                      </div>
                      <Switch defaultSelected />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sincronização de Imagens</p>
                        <p className="text-sm text-default-500">
                          Importar URLs das imagens dos produtos
                        </p>
                      </div>
                      <Switch defaultSelected />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Webhooks</p>
                        <p className="text-sm text-default-500">
                          Receber atualizações em tempo real
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Divider />

                {/* URLs e Endpoints */}
                <div>
                  <h4 className="text-lg font-medium mb-3">URLs e Endpoints</h4>
                  <div className="space-y-3">
                    {selectedIntegration.apiEndpoint && (
                      <div>
                        <p className="text-sm text-default-500 mb-1">Endpoint da API</p>
                        <div className="flex gap-2">
                          <Code className="flex-1 text-xs">
                            {selectedIntegration.apiEndpoint}
                          </Code>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onPress={() => copyToClipboard(selectedIntegration.apiEndpoint!)}
                          >
                            <CopyIcon size={14} />
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedIntegration.webhookUrl && (
                      <div>
                        <p className="text-sm text-default-500 mb-1">Webhook URL</p>
                        <div className="flex gap-2">
                          <Code className="flex-1 text-xs">
                            {selectedIntegration.webhookUrl}
                          </Code>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onPress={() => copyToClipboard(selectedIntegration.webhookUrl!)}
                          >
                            <CopyIcon size={14} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Divider />

                {/* Filtros de Produtos */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Filtros de Produtos</h4>
                  <div className="space-y-4">
                    <Input
                      label="Filtrar por Tag"
                      placeholder="Ex: estoque-externo"
                      description="Importar apenas produtos com esta tag"
                    />

                    <Input
                      label="SKU Prefixo"
                      placeholder="Ex: EXT-"
                      description="Adicionar prefixo aos SKUs importados"
                    />

                    <Select
                      label="Categoria Padrão"
                      placeholder="Selecione uma categoria"
                      description="Categoria para produtos sem classificação"
                    >
                      <SelectItem key="roupas">Roupas</SelectItem>
                      <SelectItem key="calcados">Calçados</SelectItem>
                      <SelectItem key="acessorios">Acessórios</SelectItem>
                      <SelectItem key="outros">Outros</SelectItem>
                    </Select>
                  </div>
                </div>

                <Divider />

                {/* Mapeamento de Campos */}
                <Accordion>
                  <AccordionItem
                    key="field-mapping"
                    aria-label="Mapeamento de Campos"
                    title="Mapeamento de Campos"
                    startContent={<DatabaseIcon size={16} />}
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-default-700">Campo S.E.E.L.F.</p>
                        </div>
                        <div>
                          <p className="font-medium text-default-700">Campo {selectedIntegration.platform}</p>
                        </div>
                      </div>
                      
                      <Divider />
                      
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <span>Nome do Produto</span>
                          <Code size="sm">title</Code>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <span>SKU</span>
                          <Code size="sm">sku</Code>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <span>Preço</span>
                          <Code size="sm">price</Code>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <span>Descrição</span>
                          <Code size="sm">body_html</Code>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <span>Quantidade</span>
                          <Code size="sm">inventory_quantity</Code>
                        </div>
                      </div>
                    </div>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button 
              color="danger" 
              variant="light" 
              onPress={() => setIsConfigModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              color="primary" 
              onPress={() => {
                console.log('Salvando configurações...');
                setIsConfigModalOpen(false);
              }}
            >
              Salvar Configurações
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};