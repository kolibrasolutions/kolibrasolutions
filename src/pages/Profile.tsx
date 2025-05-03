import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { LayoutDashboard, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkUserRole } from '@/services/partners/partnerService';
import { User } from '@supabase/supabase-js';

interface ExtendedUser extends User {
  role?: string;
}

const Profile = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast("Acesso restrito", { description: "Faça login para acessar esta página" });
        navigate('/login?returnUrl=/profile');
        return;
      }

      // Buscar dados adicionais do usuário incluindo a role
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } else {
        console.log("Dados completos do usuário:", userData);
        // Combinar os dados da sessão com os dados do banco
        setUser({ ...session.user, ...userData });
        
        // Verificar a role do usuário
        const role = await checkUserRole(session.user.id);
        setUserRole(role);
        console.log("Role do usuário verificada:", role);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Use our custom hook to fetch orders
  const { orders, loading, refreshOrders } = useOrders(user?.id);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Minha Conta</h1>
          
          <div className="flex gap-3">
            {userRole === 'partner' ? (
              <Button 
                asChild
                variant="outline"
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <Link to="/parceiro/dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Painel de Parceiro
                </Link>
              </Button>
            ) : userRole !== null && userRole !== 'admin' ? (
              <Button 
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link to="/parceiros">
                  <Users className="h-4 w-4" />
                  Seja um Parceiro
                </Link>
              </Button>
            ) : null}
            
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200"
              >
                <LayoutDashboard size={18} />
                Painel Admin
              </Button>
            )}
          </div>
        </div>
        
        <ProfileContent 
          user={user} 
          orders={orders} 
          loading={loading} 
          onRefreshOrders={refreshOrders} 
        />
      </div>
    </Layout>
  );
};

export default Profile;
