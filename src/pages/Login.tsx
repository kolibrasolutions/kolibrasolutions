
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  // For now, this is just a placeholder page
  // The actual authentication logic will be implemented in future prompts
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
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
            <CardContent>
              <form className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input id="fullName" type="text" placeholder="Digite seu nome completo" />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Digite seu email" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" placeholder="Digite sua senha" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full bg-green-600 hover:bg-green-700 mb-4">
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </Button>
              
              <p className="text-sm text-center">
                {isLogin 
                  ? 'Ainda não tem uma conta?' 
                  : 'Já tem uma conta?'
                } 
                <button 
                  className="text-green-600 hover:text-green-800 font-medium ml-1"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
