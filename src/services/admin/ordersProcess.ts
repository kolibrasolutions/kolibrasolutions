
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

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
