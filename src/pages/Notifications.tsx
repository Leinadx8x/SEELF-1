// pages/Notifications.tsx
import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Divider,
    Chip,
    Tabs,
    Tab,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Badge
} from '@heroui/react';
import {
    BellIcon,
    AlertTriangleIcon,
    TrophyIcon,
    InfoIcon,
    CheckCircleIcon,
    Trash2Icon,
    MailOpenIcon,
    MoreVerticalIcon,
    XCircleIcon
} from 'lucide-react';

type NotificationType = 'stock_alert' | 'achievement' | 'system_update' | 'task_completed';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
}

// Mock Data - Substituir pela API
const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'stock_alert',
        title: 'Estoque Baixo: Camiseta Básica Preta',
        description: 'O produto CAM-001 atingiu o estoque mínimo. Apenas 5 unidades restantes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min atrás
        read: false,
    },
    {
        id: '2',
        type: 'achievement',
        title: 'Nova Conquista Desbloqueada!',
        description: 'Você ganhou a medalha "Mestre do Balanço" por sua precisão no inventário.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
        read: false,
    },
    {
        id: '3',
        type: 'system_update',
        title: 'Atualização do Sistema v1.1.0',
        description: 'Novos relatórios de performance de produtos foram adicionados. Confira a seção de relatórios.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 horas atrás
        read: true,
    },
    {
        id: '4',
        type: 'stock_alert',
        title: 'Produto Sem Estoque: Tênis Casual Branco',
        description: 'O produto TEN-003 está esgotado. Considere fazer um novo pedido.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 1 dia atrás
        read: false,
    },
    {
        id: '5',
        type: 'task_completed',
        title: 'Tarefa Concluída por Carlos',
        description: 'A tarefa "Recebimento Fornecedor ABC" foi marcada como concluída.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 dias atrás
        read: true,
    },
];

const getNotificationAppearance = (type: NotificationType) => {
    switch (type) {
        case 'stock_alert':
            return { icon: AlertTriangleIcon, color: 'warning' as const };
        case 'achievement':
            return { icon: TrophyIcon, color: 'secondary' as const };
        case 'system_update':
            return { icon: InfoIcon, color: 'primary' as const };
        case 'task_completed':
            return { icon: CheckCircleIcon, color: 'success' as const };
        default:
            return { icon: BellIcon, color: 'default' as const };
    }
};

export const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'read') return n.read;
        return true;
    });

    const handleMarkAsRead = (id: string) => {
        setNotifications(
            notifications.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(
            notifications.map(n => ({ ...n, read: true }))
        );
    };

    const handleDelete = (id: string) => {
        setNotifications(
            notifications.filter(n => n.id !== id)
        );
    };

    const handleClearAll = () => {
        setNotifications([]);
    };
    
    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes} min atrás`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h atrás`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d atrás`;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Notificações</h1>
                    <p className="text-default-500 mt-1">
                        Alertas, atualizações e conquistas do sistema.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="flat" onClick={handleMarkAllAsRead} disabled={unreadCount === 0} startContent={<CheckCircleIcon size={16}/>}>
                        Marcar todas como lidas
                    </Button>
                     <Button color="danger" variant="flat" onClick={handleClearAll} disabled={notifications.length === 0} startContent={<Trash2Icon size={16}/>}>
                        Limpar tudo
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <Tabs
                        aria-label="Filtro de notificações"
                        selectedKey={filter}
                        onSelectionChange={(key) => setFilter(key as any)}
                    >
                        <Tab key="all" title="Todas" />
                        <Tab
                            key="unread"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>Não Lidas</span>
                                    {unreadCount > 0 && (
                                        <Badge content={unreadCount} color="danger" size="sm">
                                            <div />
                                        </Badge>
                                    )}
                                </div>
                            }
                        />
                        <Tab key="read" title="Lidas" />
                    </Tabs>
                </CardHeader>
                <Divider/>
                <CardBody className="p-0">
                    {filteredNotifications.length > 0 ? (
                        <ul className="divide-y divide-divider">
                            {filteredNotifications.map(notification => {
                                const { icon: Icon, color } = getNotificationAppearance(notification.type);
                                return (
                                    <li key={notification.id} className={`flex items-start gap-4 p-4 ${!notification.read ? 'bg-primary-50/50' : ''}`}>
                                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${color}/10`}>
                                            <Icon size={18} className={`text-${color}`} />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold">{notification.title}</p>
                                            <p className="text-sm text-default-600">{notification.description}</p>
                                            <p className="text-xs text-default-500 mt-1">{formatRelativeTime(notification.timestamp)}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button isIconOnly variant="light" size="sm">
                                                        <MoreVerticalIcon size={16} />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Ações da notificação">
                                                    <DropdownItem
                                                        key="read"
                                                        startContent={<MailOpenIcon size={16} />}
                                                        onPress={() => handleMarkAsRead(notification.id)}
                                                        isDisabled={notification.read}
                                                    >
                                                        Marcar como lida
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        color="danger"
                                                        startContent={<Trash2Icon size={16} />}
                                                        onPress={() => handleDelete(notification.id)}
                                                    >
                                                        Excluir
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                             <div className="inline-flex items-center justify-center w-16 h-16 bg-default-100 rounded-full mb-4">
                                <XCircleIcon size={32} className="text-default-500" />
                            </div>
                            <p className="font-semibold">Nenhuma notificação encontrada</p>
                            <p className="text-sm text-default-500">
                                Não há notificações para este filtro.
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

