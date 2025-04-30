
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useLoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleAuthMode = () => setIsLogin(!isLogin);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login logic
        console.log("Attempting login with:", { email, rememberMe });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: {
            // Set session persistence based on remember me checkbox
            persistSession: rememberMe
          }
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
            // Always persist session on signup
            persistSession: true
          }
        });
        
        if (signUpError) {
          console.error("Signup error:", signUpError);
          throw signUpError;
        }
        
        console.log("Signup successful:", data);
        
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

  return {
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
  };
};
