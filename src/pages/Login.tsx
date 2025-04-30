
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if the user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/';
        navigate(returnUrl);
      }
      setSessionChecked(true);
    };
    
    checkSession();
  }, [navigate, location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast("Login realizado com sucesso!", {
          description: "Bem-vindo de volta."
        });
        
        // Redirect to the returnUrl if available, otherwise go to home
        const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/';
        navigate(returnUrl);
        
      } else {
        // Registration logic
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          }
        });
        
        if (signUpError) throw signUpError;
        
        // After signup, insert user profile with full name
        toast("Cadastro realizado com sucesso!", {
          description: "Por favor, verifique seu email para confirmar a conta."
        });
        
        // Switch back to login view
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast("Erro", {
        description: error.message || "Ocorreu um erro ao processar sua solicitação."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!sessionChecked) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </Layout>
    );
  }
  
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
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="space-y-4">
                  {!isLogin && (
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
                    />
                  </div>
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
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Cadastre-se' : 'Faça login'}
                  </button>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
