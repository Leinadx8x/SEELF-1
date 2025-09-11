// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular verificação de token ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          // Aqui você faria uma verificação real do token com sua API
          const parsedUser = JSON.parse(userData) as User;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulação de login - substitua pela sua API real
      if (email === 'admin@seelf.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          name: 'Administrador',
          email: 'admin@seelf.com',
          role: 'ADMIN',
          isActive: true,
        };
        
        // Simular token JWT
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      } else if (email === 'funcionario@seelf.com' && password === 'func123') {
        const mockUser: User = {
          id: '2',
          name: 'João Silva',
          email: 'funcionario@seelf.com',
          role: 'EMPLOYEE',
          isActive: true,
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
      
      return false; // Credenciais inválidas
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};