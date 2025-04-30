
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { finalizeOrderProcess } from "./ordersProcess";

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
