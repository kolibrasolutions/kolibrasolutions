import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { OrderType } from "@/types/admin";

// Fetch orders with related data
export const fetchOrdersFromDB = async (statusFilter: string | null) => {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        order_items:order_items(
          *,
          service:services(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erro ao carregar pedidos');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchOrdersFromDB:', error);
    toast.error('Erro ao carregar pedidos');
    return [];
  }
};

// Update order status
export const updateOrderStatusInDB = async (orderId: number, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order status:', error);
      toast.error('Erro ao atualizar status do pedido');
      return false;
    }
    
    toast.success(`Status atualizado para "${newStatus}"`);
    return true;
  } catch (error) {
    console.error('Error in updateOrderStatusInDB:', error);
    toast.error('Erro ao atualizar status do pedido');
    return false;
  }
};

// Finalize order processing
export const finalizeOrderProcess = async (orderId: number) => {
  try {
    // Call Supabase Edge Function to handle order finalization
    const { error } = await supabase.functions.invoke('handle-order-finalized', {
      body: { orderId }
    });
    
    if (error) {
      console.error('Error finalizing order:', error);
      toast.error('Erro ao finalizar o pedido');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in finalizeOrderProcess:', error);
    toast.error('Erro ao finalizar o pedido');
    return false;
  }
};

// Delete an order - completely refactored for better error handling and sequential operations
export const deleteOrderFromDB = async (orderId: number) => {
  try {
    console.log("Starting admin order deletion for order ID:", orderId);
    
    // Step 1: Begin by deleting order items
    console.log("Deleting order items...");
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);
    
    if (itemsError) {
      console.error("Error deleting order items:", itemsError);
      toast.error('Erro ao excluir itens do pedido');
      return false;
    }
    console.log("Order items deleted successfully");
    
    // Step 2: Delete any ratings related to this order
    console.log("Deleting ratings...");
    const { error: ratingsError } = await supabase
      .from('project_ratings')
      .delete()
      .eq('order_id', orderId);
    
    if (ratingsError) {
      console.error("Error deleting ratings:", ratingsError);
      toast.error('Erro ao excluir avaliações do pedido');
      return false;
    }
    console.log("Ratings deleted successfully");
      
    // Step 3: Delete any payments related to this order
    console.log("Deleting payments...");
    const { error: paymentsError } = await supabase
      .from('payments')
      .delete()
      .eq('order_id', orderId);
    
    if (paymentsError) {
      console.error("Error deleting payments:", paymentsError);
      toast.error('Erro ao excluir pagamentos do pedido');
      return false;
    }
    console.log("Payments deleted successfully");
    
    // Step 4: Finally delete the order itself
    console.log("Deleting order...");
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    
    if (error) {
      console.error("Error deleting order:", error);
      toast.error('Erro ao excluir pedido');
      return false;
    }
    console.log("Order deleted successfully");
    
    toast.success('Pedido excluído com sucesso');
    return true;
  } catch (error) {
    console.error('Error in deleteOrderFromDB:', error);
    toast.error('Erro ao excluir pedido');
    return false;
  }
};

// Record manual payment
export const recordManualPaymentInDB = async (
  orderId: number, 
  paymentType: 'initial' | 'final',
  paymentMethod: string,
  orderTotalPrice: number
) => {
  try {
    const amount = paymentType === 'initial' 
      ? orderTotalPrice * 0.2 
      : orderTotalPrice * 0.8;
    
    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        amount,
        payment_type: paymentType,
        status: 'completed',
        stripe_payment_intent_id: `manual_${paymentMethod.toLowerCase()}_${Date.now()}`,
        currency: 'brl'
      });
    
    if (paymentError) {
      throw paymentError;
    }
    
    // Update order with payment amount
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
    
    if (orderError) {
      throw orderError;
    }
    
    toast.success(`Pagamento ${paymentType === 'initial' ? 'inicial' : 'final'} registrado com sucesso`);
    return true;
  } catch (error) {
    console.error('Error recording manual payment:', error);
    toast.error(`Erro ao registrar pagamento ${paymentType === 'initial' ? 'inicial' : 'final'}`);
    return false;
  }
};
