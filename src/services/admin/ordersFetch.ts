
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
