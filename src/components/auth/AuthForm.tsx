
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  isLoading: boolean;
  toggleAuthMode: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  phone,
  setPhone,
  rememberMe,
  setRememberMe,
  isLoading,
  toggleAuthMode,
  handleSubmit
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Cadastro'}</CardTitle>
        <CardDescription>
          {isLogin 
            ? 'Entre com sua conta para continuar' 
            : 'Crie uma conta para acessar nossos serviços'
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="Digite seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Digite seu telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {isLogin && (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="rememberMe" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Lembrar de mim
                </Label>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 mb-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {isLogin ? 'Entrando...' : 'Cadastrando...'}
              </span>
            ) : (
              isLogin ? 'Entrar' : 'Cadastrar'
            )}
          </Button>
          
          <p className="text-sm text-center">
            {isLogin 
              ? 'Ainda não tem uma conta?' 
              : 'Já tem uma conta?'
            } 
            <button 
              type="button"
              className="text-green-600 hover:text-green-800 font-medium ml-1"
              onClick={toggleAuthMode}
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
