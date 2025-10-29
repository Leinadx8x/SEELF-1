// components/Navbar.tsx
import React from 'react';
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from '@heroui/react';
import { 
  HomeIcon, 
  PackageIcon, 
  TrendingUpIcon, 
  BarChart3Icon, 
  SettingsIcon,
  BellIcon,
  LogOutIcon,
  UserIcon,
  DatabaseIcon,
  ListCheckIcon,
} from 'lucide-react';

interface NavbarProps {
  currentUser: {
    name: string;
    email: string;
    avatar?: string;
    role: 'ADMIN' | 'EMPLOYEE';
  };
  alertsCount?: number;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    route: '/',
  },
  {
    key: 'products',
    label: 'Produtos',
    icon: PackageIcon,
    route: '/produtos',
  },
  {
    key: 'movements',
    label: 'Movimentações',
    icon: TrendingUpIcon,
    route: '/movimentacoes',
  },
  {
    key: 'reports',
    label: 'Relatórios',
    icon: BarChart3Icon,
    route: '/relatorios',
  },
  {
    key: 'integrations',
    label: 'Integrações',
    icon: DatabaseIcon,
    route: '/integracoes',
    adminOnly: true,
  },
  {
    key: 'settings',
    label: 'Configurações',
    icon: SettingsIcon,
    route: '/configuracoes',
    adminOnly: true,
  },
  {
    key: 'tasks',
    label: 'Tarefas',
    icon: ListCheckIcon, // Usar o ícone importado
    route: '/tarefas',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  alertsCount = 0,
  onNavigate,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('dashboard');

  const handleNavigation = (route: string, key: string) => {
    setActiveItem(key);
    onNavigate(route);
    setIsMenuOpen(false);
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || currentUser.role === 'ADMIN'
  );

  return (
    <HeroNavbar 
      onMenuOpenChange={setIsMenuOpen}
      className="bg-background/70 backdrop-blur-md border-b border-divider"
      maxWidth="full"
      position="sticky"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <PackageIcon size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-inherit">S.E.E.L.F.</p>
              <p className="text-xs text-default-500 hidden sm:block">
                Sistema de Estoque Externo
              </p>
            </div>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavbarItem key={item.key} isActive={activeItem === item.key}>
              <Link
                color={activeItem === item.key ? 'primary' : 'foreground'}
                onClick={() => handleNavigation(item.route, item.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeItem === item.key 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-default-100'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end">
        {/* Notifications */}
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            className="text-default-500"
            onClick={() => onNavigate('/notificacoes')}
          >
            <Badge 
              content={alertsCount > 0 ? alertsCount : undefined} 
              color="danger" 
              size="sm"
              isInvisible={alertsCount === 0}
            >
              <BellIcon size={20} />
            </Badge>
          </Button>
        </NavbarItem>

        {/* User Menu */}
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={currentUser.name}
                size="sm"
                src={currentUser.avatar}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <div className="flex flex-col">
                  <p className="font-semibold">{currentUser.name}</p>
                  <p className="text-xs text-default-500">{currentUser.email}</p>
                  <p className="text-xs text-primary">
                    {currentUser.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}
                  </p>
                </div>
              </DropdownItem>
              <DropdownItem 
                key="my-profile" 
                startContent={<UserIcon size={16} />}
                onClick={() => onNavigate('/perfil')}
              >
                Meu Perfil
              </DropdownItem>
              <DropdownItem 
                key="settings" 
                startContent={<SettingsIcon size={16} />}
                onClick={() => onNavigate('/configuracoes')}
              >
                Configurações
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger"
                startContent={<LogOutIcon size={16} />}
                onClick={onLogout}
              >
                Sair
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavbarMenuItem key={`${item.key}-mobile`}>
              <Link
                color={activeItem === item.key ? 'primary' : 'foreground'}
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  activeItem === item.key 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : ''
                }`}
                size="lg"
                onClick={() => handleNavigation(item.route, item.key)}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
        
        {/* Mobile User Info */}
        <NavbarMenuItem>
          <div className="flex flex-col gap-2 mt-4 p-3 bg-default-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar
                name={currentUser.name}
                src={currentUser.avatar}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-default-500">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                variant="flat"
                startContent={<UserIcon size={14} />}
                onClick={() => onNavigate('/perfil')}
              >
                Perfil
              </Button>
              <Button 
                size="sm" 
                color="danger" 
                variant="flat"
                startContent={<LogOutIcon size={14} />}
                onClick={onLogout}
              >
                Sair
              </Button>
            </div>
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroNavbar>
  );
};