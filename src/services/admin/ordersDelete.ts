
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Delete an order with sequential operations for better error handling
export const deleteOrderFromDB = async (orderId: number) => {
  try {
    console.log("Starting admin order deletion for order ID:", orderId);
    
    // Check if the order exists before attempting to delete
    const { data: orderExists, error: checkError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .single();
    
    if (checkError || !orderExists) {
      console.error("Order not found or error checking order:", checkError);
      toast.error('Pedido não encontrado ou já foi excluído');
      return false;
    }

    // Call the delete_order RPC function with detailed error tracing
    console.log("Calling delete_order function for order ID:", orderId);
    const { error: deleteError } = await supabase.rpc('delete_order', {
      order_id_param: orderId
    });

    if (deleteError) {
      console.error("Error in delete_order function:", deleteError);
      toast.error('Erro ao excluir pedido. Por favor, tente novamente.');
      return false;
    }

    // Verify the order was actually deleted
    console.log("Verifying deletion for order ID:", orderId);
    const { data: checkDeleted, error: checkDeletedError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .maybeSingle();
    
    if (checkDeletedError) {
      console.error("Error checking if order was deleted:", checkDeletedError);
      return false;
    }

    if (checkDeleted) {
      console.error("Order still exists after deletion attempt");
      toast.error('Erro ao excluir pedido: O pedido ainda existe no banco de dados');
      return false;
    }

    console.log("Order successfully deleted");
    toast.success('Pedido excluído com sucesso');
    return true;

  } catch (error) {
    console.error('Error in deleteOrderFromDB:', error);
    toast.error('Erro ao excluir pedido');
    return false;
  }
};
