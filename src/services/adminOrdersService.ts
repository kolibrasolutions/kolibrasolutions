
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { OrderType } from '@/types/admin';

/**
 * Fetches orders with related data from the database
 */
export const fetchOrdersFromDB = async (statusFilter: string | null) => {
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
    
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    toast("Erro", { description: "Não foi possível carregar os pedidos" });
    return [];
  }
};

/**
 * Updates the status of an order
 */
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
      throw error;
    }
    
    toast("Status atualizado", { 
      description: `Pedido #${orderId} foi marcado como ${newStatus}` 
    });
    
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    toast("Erro", { description: "Não foi possível atualizar o status do pedido" });
    return false;
  }
};

/**
 * Handles finalization of an order by invoking edge function
 */
export const finalizeOrderProcess = async (orderId: number) => {
  try {
    const { error } = await supabase.functions.invoke('handle-order-finalized', {
      body: { order_id: orderId }
    });
    
    if (error) throw error;
    
    toast("Pedido finalizado", { 
      description: "O cliente foi notificado sobre a finalização do pedido" 
    });
    
    return true;
  } catch (error) {
    console.error('Error finalizing order:', error);
    toast("Erro", { 
      description: "O pedido foi marcado como finalizado, mas ocorreu um erro ao enviar a notificação" 
    });
    return false;
  }
};

/**
 * Deletes an order and its related items
 */
export const deleteOrderFromDB = async (orderId: number) => {
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
    
    toast("Pedido excluído", { 
      description: `Pedido #${orderId} foi excluído com sucesso` 
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    toast("Erro", { description: "Não foi possível excluir o pedido" });
    return false;
  }
};

/**
 * Records a manual payment for an order
 */
export const recordManualPaymentInDB = async (
  orderId: number, 
  paymentType: 'initial' | 'final', 
  paymentMethod: string,
  orderTotal: number
) => {
  try {
    // Calculate payment amount
    const amount = paymentType === 'initial' 
      ? orderTotal * 0.2  // 20% for initial payment
      : orderTotal * 0.8; // 80% for final payment
    
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
    
    toast("Pagamento registrado", { 
      description: `${paymentType === 'initial' ? 'Pagamento inicial' : 'Pagamento final'} registrado como "${paymentMethod}"` 
    });
    
    return true;
  } catch (error) {
    console.error('Error recording manual payment:', error);
    toast("Erro", { description: "Não foi possível registrar o pagamento manual" });
    return false;
  }
};
