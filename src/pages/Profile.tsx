
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { LayoutDashboard } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
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
      
      setUser(session.user);
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
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/admin')}
              variant="outline"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200"
            >
              <LayoutDashboard size={18} />
              Acessar Painel Admin
            </Button>
          )}
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
