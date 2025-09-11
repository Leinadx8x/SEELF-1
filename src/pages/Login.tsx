// pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
  Chip,
} from '@heroui/react';
import { EyeIcon, EyeOffIcon, PackageIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Se já está logado, redireciona
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Limpar erro ao digitar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
            <PackageIcon size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">S.E.E.L.F.</h1>
          <p className="text-default-500">
            Sistema de Estoque Externo para Lojas Franqueadas
          </p>
        </div>

        {/* Card de Login */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <div className="w-full">
              <h2 className="text-xl font-semibold text-center">Fazer Login</h2>
              <p className="text-small text-default-500 text-center mt-1">
                Entre com suas credenciais para acessar o sistema
              </p>
            </div>
          </CardHeader>
          
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email"
                placeholder="Digite seu email"
                value={formData.email}
                onValueChange={(value) => handleInputChange('email', value)}
                isRequired
                autoComplete="email"
              />

              <Input
                label="Senha"
                placeholder="Digite sua senha"
                value={formData.password}
                onValueChange={(value) => handleInputChange('password', value)}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" size={20} />
                    ) : (
                      <EyeIcon className="text-2xl text-default-400 pointer-events-none" size={20} />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                autoComplete="current-password"
                isRequired
              />

              {error && (
                <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                  <AlertCircleIcon size={16} className="text-danger flex-shrink-0" />
                  <span className="text-small text-danger">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <Divider className="my-6" />

            {/* Credenciais de teste */}
            <div className="space-y-3">
              <p className="text-small text-default-500 text-center mb-3">
                Credenciais para teste:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                  <div>
                    <p className="text-small font-medium">Administrador</p>
                    <p className="text-tiny text-default-500">admin@seelf.com</p>
                  </div>
                  <Chip size="sm" color="primary" variant="flat">
                    admin123
                  </Chip>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-default-50 rounded-lg">
                  <div>
                    <p className="text-small font-medium">Funcionário</p>
                    <p className="text-tiny text-default-500">funcionario@seelf.com</p>
                  </div>
                  <Chip size="sm" color="secondary" variant="flat">
                    func123
                  </Chip>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <p className="text-center text-small text-default-400 mt-6">
          © 2025 S.E.E.L.F. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};