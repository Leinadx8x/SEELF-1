// pages/Profile.tsx
import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Input,
    Divider,
    Chip,
    Avatar,
    Progress,
    Listbox,
    ListboxItem
} from '@heroui/react';
import {
    UserIcon,
    MailIcon,
    ShieldCheckIcon,
    TrophyIcon,
    HistoryIcon,
    Edit3Icon,
    TrendingUpIcon,
    TrendingDownIcon,
    SaveIcon,
    CameraIcon,
} from 'lucide-react';

// Mock Data - Substituir pelo hook useAuth() ou dados da API
const currentUser = {
    name: 'Diogo Maggio',
    email: 'diogo.maggio@seelf.com',
    role: 'ADMIN',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    memberSince: new Date('2024-01-15T09:00:00Z'),
};

const userStats = {
    xp: 1250,
    xpNextLevel: 2000,
    level: 5,
    achievements: 8,
    rank: 2,
};

const recentActivity = [
    { id: 1, action: 'Registrou entrada de 15x CAL-002', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), icon: TrendingUpIcon, color: 'success' },
    { id: 2, action: 'Atualizou o produto "Tênis Casual Branco"', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), icon: Edit3Icon, color: 'warning' },
    { id: 3, action: 'Registrou saída de 3x CAM-001', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), icon: TrendingDownIcon, color: 'danger' },
    { id: 4, action: 'Completou a tarefa "Contagem Semanal"', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), icon: TrophyIcon, color: 'secondary' },
];

export const Profile: React.FC = () => {

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
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
            <div>
                <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
                <p className="text-default-500 mt-1">
                    Visualize e gerencie suas informações pessoais e performance.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna de Perfil e Informações */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardBody className="items-center text-center p-6">
                            <div className="relative">
                                <Avatar src={currentUser.avatar} className="w-24 h-24 text-large" />
                                <Button isIconOnly color="default" variant="flat" size="sm" className="absolute bottom-0 right-0">
                                    <CameraIcon size={16} />
                                </Button>
                            </div>
                            <h2 className="text-xl font-semibold mt-4">{currentUser.name}</h2>
                            <p className="text-default-500">{currentUser.email}</p>
                            <Chip 
                                color={currentUser.role === 'ADMIN' ? 'primary' : 'secondary'} 
                                variant="flat" 
                                size="sm" 
                                className="mt-2"
                                startContent={<ShieldCheckIcon size={14} />}
                            >
                                {currentUser.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}
                            </Chip>
                            <Divider className="my-4" />
                            <div className="text-sm text-default-500">
                                Membro desde {formatDate(currentUser.memberSince)}
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Informações Pessoais</h3>
                        </CardHeader>
                        <Divider />
                        <CardBody className="space-y-4">
                            <Input 
                                label="Nome Completo"
                                defaultValue={currentUser.name}
                                startContent={<UserIcon size={16} />}
                            />
                            <Input
                                isReadOnly
                                label="Email"
                                defaultValue={currentUser.email}
                                startContent={<MailIcon size={16} />}
                                description="O email não pode ser alterado."
                            />
                            <Button color="primary" className="w-full" startContent={<SaveIcon size={16} />}>
                                Salvar Alterações
                            </Button>
                        </CardBody>
                    </Card>
                </div>

                {/* Coluna de Performance e Atividade */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                             <div className="flex items-center gap-2">
                                <TrophyIcon size={20} className="text-warning" />
                                <h3 className="text-lg font-semibold">Minha Performance</h3>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-default-50 rounded-lg">
                                    <p className="text-sm text-default-500">Nível</p>
                                    <p className="text-3xl font-bold text-primary">{userStats.level}</p>
                                </div>
                                <div className="p-4 bg-default-50 rounded-lg">
                                    <p className="text-sm text-default-500">Conquistas</p>
                                    <p className="text-3xl font-bold">{userStats.achievements}</p>
                                </div>
                                 <div className="p-4 bg-default-50 rounded-lg">
                                    <p className="text-sm text-default-500">Ranking Geral</p>
                                    <p className="text-3xl font-bold">#{userStats.rank}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">Pontos de Experiência (XP)</span>
                                    <span className="text-sm text-default-500">{userStats.xp} / {userStats.xpNextLevel}</span>
                                </div>
                                <Progress 
                                    aria-label="Progresso de XP" 
                                    value={userStats.xp} 
                                    maxValue={userStats.xpNextLevel} 
                                    color="primary"
                                    size="md"
                                />
                            </div>
                        </CardBody>
                    </Card>

                     <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <HistoryIcon size={20} />
                                <h3 className="text-lg font-semibold">Atividade Recente</h3>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <Listbox aria-label="Atividades recentes">
                                {recentActivity.map(activity => {
                                    const Icon = activity.icon;
                                    return (
                                        <ListboxItem key={activity.id} textValue={activity.action}>
                                            <div className="flex justify-between w-full items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${activity.color}/10`}>
                                                        <Icon size={16} className={`text-${activity.color}`} />
                                                    </div>
                                                    <span className="text-sm">{activity.action}</span>
                                                </div>
                                                <span className="text-xs text-default-500">{formatRelativeTime(activity.timestamp)}</span>
                                            </div>
                                        </ListboxItem>
                                    );
                                })}
                            </Listbox>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};
