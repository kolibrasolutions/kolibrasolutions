import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Delete an order with sequential operations for better error handling
export const deleteOrderFromDB = async (orderId: number) => {
  try {
    console.log("Starting admin order deletion for order ID:", orderId);
    
    // Verificar se o pedido existe antes de tentar excluir
    const { data: orderExists, error: checkError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .single();
    
    if (checkError || !orderExists) {
      console.error("Order not found or error checking order:", checkError);
      toast.error('Pedido não encontrado ou já foi excluído');
      return false;
    }
    
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
    
    // Verificar se o pedido foi realmente excluído
    const { data: checkDeleted, error: checkDeletedError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .single();
    
    if (checkDeletedError?.code === 'PGRST116') {
      // Este erro específico indica que nenhum registro foi encontrado, o que é o que queremos
      console.log("Verified: Order was successfully deleted");
      toast.success('Pedido excluído com sucesso');
      return true;
    } else if (checkDeleted) {
      console.error("Order still exists after deletion attempt");
      toast.error('Erro ao excluir pedido: O pedido ainda existe no banco de dados');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteOrderFromDB:', error);
    toast.error('Erro ao excluir pedido');
    return false;
  }
};
