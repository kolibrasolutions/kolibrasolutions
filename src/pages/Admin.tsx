
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileBox, Inbox, PenTool } from 'lucide-react';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderDetailsDialog } from '@/components/admin/OrderDetailsDialog';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { BlogPostsList } from '@/components/admin/blog/BlogPostsList';
import { PortfolioProjectsList } from '@/components/admin/portfolio/PortfolioProjectsList';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();
  
  const {
    orders: filteredOrders,
    loading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    viewOrderDetails,
    setViewOrderDetails,
    fetchOrders,
    updateOrderStatus,
    recordManualPayment,
    deleteOrder
  } = useAdminOrders();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log("Verificando sessão e permissões de admin...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Nenhuma sessão encontrada, redirecionando para login");
          toast("Acesso restrito", { description: "Faça login para acessar esta página" });
          navigate('/login?returnUrl=/admin');
          return;
        }
        
        console.log("Sessão encontrada para o usuário:", session.user.email);
        
        // Check user role
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Erro ao buscar papel do usuário:", error);
          toast("Erro de verificação", { description: "Não foi possível verificar suas permissões" });
          navigate('/');
          return;
        }
        
        console.log("Papel do usuário:", userData?.role);
        
        if (!userData || userData.role !== 'admin') {
          console.log("Usuário não é admin, redirecionando");
          toast("Acesso negado", { description: "Você não tem permissão para acessar esta página" });
          navigate('/');
          return;
        }
        
        console.log("Verificação de admin concluída com sucesso");
        setIsAdmin(true);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAdmin();
  }, [navigate]);

  if (!authChecked) {
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

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Acesso Negado</h1>
            <p className="mt-4">Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
        
        <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              <span>Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              <span>Blog</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <FileBox className="h-4 w-4" />
              <span>Portfólio</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="mt-0">
            {/* Orders Tab Content */}
            <OrderFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onRefresh={fetchOrders}
            />
            
            <OrdersTable 
              orders={filteredOrders}
              loading={loading}
              onViewDetails={setViewOrderDetails}
              updateOrderStatus={updateOrderStatus}
            />
            
            <OrderDetailsDialog 
              order={viewOrderDetails}
              open={!!viewOrderDetails}
              onOpenChange={(open) => {
                if (!open) setViewOrderDetails(null);
              }}
              updateOrderStatus={updateOrderStatus}
              recordManualPayment={recordManualPayment}
              deleteOrder={deleteOrder}
            />
          </TabsContent>
          
          <TabsContent value="blog" className="mt-0">
            <BlogPostsList />
          </TabsContent>
          
          <TabsContent value="portfolio" className="mt-0">
            <PortfolioProjectsList />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
