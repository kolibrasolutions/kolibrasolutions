
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

  // Delete an order
  const deleteOrder = async (orderId: number) => {
    try {
      // First delete related order_items to prevent foreign key constraint issues
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);
      
      if (itemsError) throw itemsError;
      
      // Then delete the order itself
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (orderError) throw orderError;
      
      // Update local state
      setOrders(orders.filter(order => order.id !== orderId));
      
      toast("Pedido excluído", { 
        description: `Pedido #${orderId} foi excluído com sucesso` 
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast("Erro", { description: "Não foi possível excluir o pedido" });
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

  // Record manual payment
  const recordManualPayment = async (orderId: number, paymentType: 'initial' | 'final', paymentMethod: string) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      
      if (!orderToUpdate) {
        throw new Error("Pedido não encontrado");
      }
      
      // Calculate payment amount
      const amount = paymentType === 'initial' 
        ? orderToUpdate.total_price * 0.2  // 20% for initial payment
        : orderToUpdate.total_price * 0.8; // 80% for final payment
      
      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          amount,
          payment_type: paymentType,
          status: 'succeeded',
          stripe_payment_intent_id: `manual_${Date.now()}`,
          currency: 'brl'
        });
        
      if (paymentError) throw paymentError;
      
      // Update order with payment info
      const updateData = paymentType === 'initial'
        ? { 
            initial_payment_amount: amount,
            status: 'Pagamento Inicial Realizado',
            updated_at: new Date().toISOString()
          }
        : { 
            final_payment_amount: amount,
            updated_at: new Date().toISOString()
          };
        
      const { error: orderError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
        
      if (orderError) throw orderError;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, ...updateData } 
          : order
      ));
      
      // If it's an initial payment, update the status too
      if (paymentType === 'initial') {
        // After initial payment, order can move to "Em Andamento"
        await updateOrderStatus(orderId, 'Em Andamento');
      }
      
      toast("Pagamento registrado", { 
        description: `${paymentType === 'initial' ? 'Pagamento inicial' : 'Pagamento final'} registrado como "${paymentMethod}"` 
      });
      
      // Refresh orders to get the latest state
      await fetchOrders();
      
      // Close the dialog if it's open
      setViewOrderDetails(null);
    } catch (error) {
      console.error('Error recording manual payment:', error);
      toast("Erro", { description: "Não foi possível registrar o pagamento manual" });
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
    updateOrderStatus,
    recordManualPayment,
    deleteOrder
  };
}
