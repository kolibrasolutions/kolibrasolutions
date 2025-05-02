
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session error:", error);
          return;
        }
        
        if (!isMounted) return;
        
        setUser(data.session?.user || null);
        
        // Check if the user is an admin
        if (data.session?.user) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role, full_name, phone')
              .eq('id', data.session.user.id)
              .single();
              
            if (userError) {
              console.error("User role error:", userError);
              return;
            }
            
            if (!isMounted) return;
            
            // Update the user object with profile data
            if (userData) {
              setUser(prev => ({
                ...prev,
                full_name: userData.full_name,
                phone: userData.phone,
                role: userData.role
              }));
              setIsAdmin(userData.role === 'admin' || false);
            }
          } catch (err) {
            console.error("Error checking admin status:", err);
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      setUser(session?.user || null);
      
      // Check admin status and get profile data on auth state change
      if (session?.user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, full_name, phone')
            .eq('id', session.user.id)
            .single();
            
          if (!isMounted) return;
          
          if (!userError && userData) {
            // Update the user object with profile data
            setUser(prev => ({
              ...prev,
              full_name: userData.full_name,
              phone: userData.phone,
              role: userData.role
            }));
            setIsAdmin(userData.role === 'admin');
          }
        } catch (err) {
          console.error("Error checking admin status on auth change:", err);
        }
      } else {
        setIsAdmin(false);
      }
    });
    
    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error("Erro ao sair", {
          description: "Houve um problema ao desconectar sua conta."
        });
        return;
      }
      
      toast.success("Logout realizado com sucesso", {
        description: "Você foi desconectado da sua conta."
      });
      navigate('/');
    } catch (err) {
      console.error("Logout exception:", err);
      toast.error("Erro ao sair", {
        description: "Houve um problema ao desconectar sua conta."
      });
    }
  };
  
  return { user, isAdmin, isLoading, handleLogout };
};
