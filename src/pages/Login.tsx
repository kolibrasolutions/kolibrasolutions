
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
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("Login page rendering");
  
  // Check if the user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking user session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setSessionChecked(true);
          return;
        }
        
        console.log("Session data:", data);
        
        if (data.session) {
          const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/';
          console.log("User is logged in, redirecting to:", returnUrl);
          navigate(returnUrl);
        } else {
          console.log("No active session found");
        }
        
        setSessionChecked(true);
      } catch (err) {
        console.error("Session check exception:", err);
        setSessionChecked(true);
      }
    };
    
    checkSession();
  }, [navigate, location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login logic
        console.log("Attempting login with:", { email });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error("Login error:", error);
          throw error;
        }
        
        console.log("Login successful:", data);
        toast.success("Login realizado com sucesso!", {
          description: "Bem-vindo de volta."
        });
        
        // Redirect to the returnUrl if available, otherwise go to home
        const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/';
        navigate(returnUrl);
        
      } else {
        // Registration logic
        console.log("Attempting signup with:", { email, fullName, phone });
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            },
          }
        });
        
        if (signUpError) {
          console.error("Signup error:", signUpError);
          throw signUpError;
        }
        
        console.log("Signup successful:", data);
        
        // After signup, insert user profile with full name and phone
        toast.success("Cadastro realizado com sucesso!", {
          description: "Por favor, verifique seu email para confirmar a conta."
        });
        
        // Switch back to login view
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error("Erro", {
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
