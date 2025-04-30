
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { OrderType } from '@/types/admin';

export function useAdminOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewOrderDetails, setViewOrderDetails] = useState<OrderType | null>(null);

  // Fetch orders with related data
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          user:users(email, full_name, phone),
          order_items:order_items(
            id,
            quantity,
            price_at_order,
            service:services(name, price)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast("Erro", { description: "Não foi possível carregar os pedidos" });
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() } 
          : order
      ));
      
      // If status is "Finalizado", call the finalize order function
      if (newStatus === 'Finalizado') {
        await finalizeOrder(orderId);
      }
      
      toast("Status atualizado", { 
        description: `Pedido #${orderId} foi marcado como ${newStatus}` 
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast("Erro", { description: "Não foi possível atualizar o status do pedido" });
    }
  };

  // Handle finalization of an order
  const finalizeOrder = async (orderId: number) => {
    try {
      const { error } = await supabase.functions.invoke('handle-order-finalized', {
        body: { order_id: orderId }
      });
      
      if (error) throw error;
      
      toast("Pedido finalizado", { 
        description: "O cliente foi notificado sobre a finalização do pedido" 
      });
    } catch (error) {
      console.error('Error finalizing order:', error);
      toast("Erro", { 
        description: "O pedido foi marcado como finalizado, mas ocorreu um erro ao enviar a notificação" 
      });
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const searchString = searchTerm.toLowerCase();
    const userEmail = order.user?.email?.toLowerCase() || '';
    const userName = order.user?.full_name?.toLowerCase() || '';
    const orderId = order.id.toString();
    
    return userEmail.includes(searchString) || 
           userName.includes(searchString) || 
           orderId.includes(searchString);
  });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return {
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
  };
}
