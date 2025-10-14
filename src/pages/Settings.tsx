// pages/Settings.tsx
import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Input,
    Switch,
    Divider,
    Chip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Tabs,
    Tab,
    Select,
    SelectItem,
    Textarea,
    Badge,
} from '@heroui/react';
import {
    SettingsIcon,
    UsersIcon,
    ShieldCheckIcon,
    BuildingIcon,
    BellIcon,
    TrophyIcon,
    PlusIcon,
    MoreVerticalIcon,
    UserPlusIcon,
    Trash2Icon,
    EditIcon,
    PackageIcon,
    KeyRoundIcon,
    PaletteIcon,
} from 'lucide-react';
import { AnimatedThemeToggler } from '@/components/themeToggle';

// Mock Data - Substituir pela API
const mockUsers = [
    {
        id: '1',
        name: 'Carlos Daniel',
        email: 'carlos.daniel@seelf.com',
        role: 'ADMIN',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
    {
        id: '2',
        name: 'Diogo Maggio',
        email: 'diogo.maggio@seelf.com',
        role: 'ADMIN',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        lastLogin: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    },
    {
        id: '3',
        name: 'Matheus',
        email: 'matheus@seelf.com',
        role: 'EMPLOYEE',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
        id: '4',
        name: 'Ana Oliveira',
        email: 'ana.oliveira@seelf.com',
        role: 'EMPLOYEE',
        status: 'inactive',
        avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    },
];

const mockAchievements = [
    { id: '1', name: 'Mestre do Balanço', description: 'Realizar 10 contagens com 99% de acurácia.', xp: 500 },
    { id: '2', name: 'Velocista do Recebimento', description: 'Processar 50 notas de entrada no mesmo dia.', xp: 250 },
    { id: '3', name: 'Estoque no Ponto', description: 'Manter o estoque sem furos por uma semana.', xp: 1000 },
];

export const Settings: React.FC = () => {
    const [users, setUsers] = useState(mockUsers);
    const [achievements, setAchievements] = useState(mockAchievements);

    const getRoleChipColor = (role: string) => {
        if (role === 'ADMIN') return 'primary';
        return 'secondary';
    };

    const getStatusChipColor = (status: string) => {
        if (status === 'active') return 'success';
        return 'danger';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
                    <p className="text-default-500 mt-1">
                        Gerencie as configurações da empresa, usuários e sistema.
                    </p>
                </div>
            </div>

            <Tabs aria-label="Opções de Configuração" color="primary" variant="underlined">
                {/* Aba de Usuários */}
                <Tab key="users" title={
                    <div className="flex items-center gap-2">
                        <UsersIcon size={16} />
                        <span>Usuários</span>
                        <Badge content={users.length} color="primary" size="sm">
                           <div/>
                        </Badge>
                    </div>
                }>
                    <Card className="mt-4">
                        <CardHeader>
                            <div className="flex justify-between items-center w-full">
                                <h3 className="text-lg font-semibold">Gerenciamento de Usuários</h3>
                                <Button color="primary" startContent={<UserPlusIcon size={16} />}>
                                    Convidar Usuário
                                </Button>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody className="p-0">
                            <Table aria-label="Tabela de usuários" removeWrapper>
                                <TableHeader>
                                    <TableColumn>USUÁRIO</TableColumn>
                                    <TableColumn>FUNÇÃO (ROLE)</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                    <TableColumn>ÚLTIMO LOGIN</TableColumn>
                                    <TableColumn width={50}>AÇÕES</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar src={user.avatar} name={user.name} />
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-default-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip color={getRoleChipColor(user.role)} size="sm" variant="flat">
                                                    {user.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <Chip color={getStatusChipColor(user.status)} size="sm" variant="dot">
                                                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                                                </Chip>
                                            </TableCell>
                                            <TableCell className="text-sm text-default-500">
                                                {user.lastLogin.toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button isIconOnly size="sm" variant="light">
                                                            <MoreVerticalIcon size={16} />
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu>
                                                        <DropdownItem key="edit" startContent={<EditIcon size={16} />}>
                                                            Editar
                                                        </DropdownItem>
                                                        <DropdownItem key="delete" color="danger" startContent={<Trash2Icon size={16} />}>
                                                            Remover
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </Tab>

                {/* Aba de Gamificação */}
                <Tab key="gamification" title={
                    <div className="flex items-center gap-2">
                        <TrophyIcon size={16} />
                        <span>Gamificação</span>
                    </div>
                }>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Configurações de Gamificação</h3>
                            </CardHeader>
                            <Divider />
                            <CardBody className="space-y-4">
                                <Switch defaultSelected>
                                    Ativar sistema de Gamificação (XP e Conquistas)
                                </Switch>
                                <Divider />
                                <div>
                                    <h4 className="font-medium mb-2">Pontuação (XP) por Ação</h4>
                                    <div className="space-y-3">
                                        <Input type="number" label="Entrada de Estoque" defaultValue="10" endContent={<span className="text-xs">XP</span>} />
                                        <Input type="number" label="Saída de Estoque" defaultValue="5" endContent={<span className="text-xs">XP</span>} />
                                        <Input type="number" label="Contagem de Inventário" defaultValue="50" endContent={<span className="text-xs">XP</span>} />
                                        <Input type="number" label="Criação de Tarefa" defaultValue="15" endContent={<span className="text-xs">XP</span>} />
                                    </div>
                                </div>
                                <Button color="primary" className="w-full">Salvar Pontuações</Button>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center w-full">
                                    <h3 className="text-lg font-semibold">Conquistas (Badges)</h3>
                                    <Button color="primary" variant='flat' size='sm' startContent={<PlusIcon size={14} />}>
                                        Nova Conquista
                                    </Button>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="space-y-3">
                                {achievements.map((ach) => (
                                    <div key={ach.id} className="p-3 bg-default-50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{ach.name}</p>
                                                <p className="text-sm text-default-500">{ach.description}</p>
                                            </div>
                                            <Chip color="secondary" variant='flat' size='sm'>{ach.xp} XP</Chip>
                                        </div>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    </div>
                </Tab>

                {/* Aba de Perfil & Segurança */}
                <Tab key="security" title={
                    <div className="flex items-center gap-2">
                        <ShieldCheckIcon size={16} />
                        <span>Perfil & Segurança</span>
                    </div>
                }>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Alterar Senha</h3>
                            </CardHeader>
                            <Divider />
                            <CardBody className="space-y-4">
                                <Input type="password" label="Senha Atual" />
                                <Input type="password" label="Nova Senha" />
                                <Input type="password" label="Confirmar Nova Senha" />
                                <Button color="primary" className="w-full" startContent={<KeyRoundIcon size={16}/>}>
                                    Atualizar Senha
                                </Button>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Segurança da Conta</h3>
                            </CardHeader>
                            <Divider />
                            <CardBody className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Autenticação de Dois Fatores (2FA)</p>
                                        <p className="text-sm text-default-500">Aumente a segurança da sua conta.</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="p-3 bg-default-50 rounded-lg">
                                    <p className="font-medium mb-2">Sessões Ativas</p>
                                    <p className="text-sm text-default-500">Você está logado em 2 dispositivos.</p>
                                    <Button color="danger" variant="light" size="sm" className="mt-2">Desconectar de todos os outros dispositivos</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Tab>
                 {/* Aba Geral */}
                <Tab key="general" title={
                    <div className="flex items-center gap-2">
                        <BuildingIcon size={16} />
                        <span>Geral</span>
                    </div>
                }>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Informações da Empresa</h3>
                            </CardHeader>
                            <Divider />
                            <CardBody className="space-y-4">
                                <Input label="Nome da Empresa" defaultValue="Franquia S.E.E.L.F. - Uberlândia" />
                                <Textarea label="Endereço" defaultValue="Av. Rondon Pacheco, 1234 - Uberlândia, MG" />
                                <Input label="Email de Contato" type="email" defaultValue="contato.udi@seelf.com" />
                                <Button color="primary" className="w-full">Salvar Informações</Button>
                            </CardBody>
                        </Card>
                         <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Preferências do Sistema</h3>
                            </CardHeader>
                            <Divider />
                            <CardBody className="space-y-4">
                                <Select label="Idioma Padrão" defaultSelectedKeys={["pt-br"]}>
                                    <SelectItem key="pt-br">Português (Brasil)</SelectItem>
                                    <SelectItem key="en-us">Inglês</SelectItem>
                                    <SelectItem key="es-es">Espanhol</SelectItem>
                                </Select>

                                <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                                    <div>
                                        <p className="font-medium flex items-center gap-2">
                                            <PaletteIcon size={16} />
                                            <span>Modo Escuro (Dark Mode)</span>
                                        </p>
                                        <p className="text-sm text-default-500">Mudar o tema da interface.</p>
                                    </div>
                                    <AnimatedThemeToggler />
                                </div>
                                
                                <Button color="primary" className="w-full">Salvar Preferências</Button>
                            </CardBody>
                        </Card>
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

