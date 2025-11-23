// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import {
    Card, CardBody, CardHeader, Button, Input, Divider, Chip, Avatar, Progress, Listbox, ListboxItem, Spinner
} from '@heroui/react';
import {
    UserIcon, MailIcon, ShieldCheckIcon, TrophyIcon, HistoryIcon,
    TrendingUpIcon, CameraIcon, BoxIcon, CheckCircleIcon, StarIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserAchievements } from '../services/api';
import { Achievement } from '../types';

export const Profile: React.FC = () => {
    const { user } = useAuth(); // Pega o usuário logado (Admin ID 1)
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            if (user?.id) {
                try {
                    // Busca conquistas reais do Backend
                    const data = await getUserAchievements(user.id);
                    setAchievements(data);
                } catch (error) {
                    console.error("Erro ao buscar conquistas", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchAchievements();
    }, [user]);

    // Mapeia o nome do ícone vindo do banco para um componente Lucide
    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'box': return <BoxIcon size={24} className="text-white" />;
            case 'check-circle': return <CheckCircleIcon size={24} className="text-white" />;
            default: return <StarIcon size={24} className="text-white" />;
        }
    };

    const formatDate = (date: string | Date) => {
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date));
    };

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
                <p className="text-default-500 mt-1">Visualize sua jornada e conquistas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna de Perfil */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardBody className="items-center text-center p-6">
                            <div className="relative">
                                <Avatar name={user.name} className="w-24 h-24 text-large" color="primary" />
                                <Button isIconOnly color="default" variant="flat" size="sm" className="absolute bottom-0 right-0">
                                    <CameraIcon size={16} />
                                </Button>
                            </div>
                            <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
                            <p className="text-default-500">{user.email}</p>
                            <Chip 
                                color={user.role === 'ADMIN' ? 'primary' : 'secondary'} 
                                variant="flat" 
                                size="sm" 
                                className="mt-2"
                                startContent={<ShieldCheckIcon size={14} />}
                            >
                                {user.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}
                            </Chip>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader><h3 className="text-lg font-semibold">Dados da Conta</h3></CardHeader>
                        <Divider />
                        <CardBody className="space-y-4">
                            <Input label="Nome" value={user.name} isReadOnly startContent={<UserIcon size={16} />} />
                            <Input label="Email" value={user.email} isReadOnly startContent={<MailIcon size={16} />} />
                        </CardBody>
                    </Card>
                </div>

                {/* Coluna de Gamificação */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <TrophyIcon /> Nível {Math.floor(achievements.length / 2) + 1}
                                    </h3>
                                    <p className="opacity-80">Continue completando tarefas para subir de nível!</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold">{achievements.length}</p>
                                    <p className="text-sm opacity-80">Conquistas</p>
                                </div>
                            </div>
                            <Progress 
                                value={achievements.length * 20} 
                                className="max-w-md" 
                                color="warning"
                                size="sm"
                                label="Progresso para o próximo nível"
                            />
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <TrophyIcon size={20} className="text-warning" />
                                <h3 className="text-lg font-semibold">Minhas Conquistas</h3>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            {loading ? (
                                <div className="flex justify-center p-4"><Spinner /></div>
                            ) : achievements.length === 0 ? (
                                <div className="text-center p-8 text-default-500">
                                    <TrophyIcon size={48} className="mx-auto mb-2 opacity-20" />
                                    <p>Você ainda não possui conquistas.</p>
                                    <p className="text-sm">Complete tarefas ou cadastre produtos para ganhar!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {achievements.map((ach) => (
                                        <div key={ach.id} className="flex items-center gap-4 p-4 bg-default-50 rounded-xl border border-default-100">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                                {getIconComponent(ach.icone)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-default-900">{ach.titulo}</h4>
                                                <p className="text-xs text-default-500">{ach.descricao}</p>
                                                <p className="text-[10px] text-default-400 mt-1 uppercase tracking-wider">
                                                    Desbloqueado em: {formatDate(ach.dataConquista)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};