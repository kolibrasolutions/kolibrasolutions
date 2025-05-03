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
import { BecomePartnerButton } from '@/components/partners/BecomePartnerButton';
import { PartnerDashboardButton } from '@/components/partners/PartnerDashboardButton';
import { useUserRole } from '@/hooks/useUserRole';

interface ExtendedUser extends User {
  role?: string;
}

const Profile = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { userRole, isLoading: roleLoading } = useUserRole(user?.id);

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
        toast.error("Erro ao carregar dados do usuário");
      } else {
        console.log("Dados completos do usuário:", userData);
        // Combinar os dados da sessão com os dados do banco
        setUser({ ...session.user, ...userData });
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Use our custom hook to fetch orders
  const { orders, loading, refreshOrders } = useOrders(user?.id);

  if (!user || roleLoading) {
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
              <PartnerDashboardButton />
            ) : !isAdmin && userRole !== 'partner' ? (
              <BecomePartnerButton />
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
