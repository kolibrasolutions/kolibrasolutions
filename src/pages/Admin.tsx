
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderDetailsDialog } from '@/components/admin/OrderDetailsDialog';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { useAdminOrders } from '@/hooks/useAdminOrders';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
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
    updateOrderStatus
  } = useAdminOrders();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast("Acesso restrito", { description: "Faça login para acessar esta página" });
          navigate('/login?returnUrl=/admin');
          return;
        }
        
        // Check user role
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error || !userData || userData.role !== 'admin') {
          toast("Acesso negado", { description: "Você não tem permissão para acessar esta página" });
          navigate('/');
          return;
        }
        
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
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo - Pedidos</h1>
        
        {/* Search and Filter */}
        <OrderFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onRefresh={fetchOrders}
        />
        
        {/* Orders Table */}
        <OrdersTable 
          orders={filteredOrders}
          loading={loading}
          onViewDetails={setViewOrderDetails}
          updateOrderStatus={updateOrderStatus}
        />
        
        {/* Order Details Dialog */}
        <OrderDetailsDialog 
          order={viewOrderDetails}
          open={!!viewOrderDetails}
          onOpenChange={(open) => {
            if (!open) setViewOrderDetails(null);
          }}
          updateOrderStatus={updateOrderStatus}
        />
      </div>
    </Layout>
  );
};

export default Admin;
