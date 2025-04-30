
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

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
