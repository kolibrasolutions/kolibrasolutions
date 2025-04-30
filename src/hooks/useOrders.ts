
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Order } from '@/types/orders';

export const useOrders = (userId: string | undefined) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (userId: string) => {
    setLoading(true);
    try {
      console.log("Fetching orders for user:", userId);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(
            id,
            quantity,
            price_at_order,
            service:services(name, price, description)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log("Orders fetched:", data);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast("Erro", { description: "Não foi possível carregar seus pedidos" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders(userId);
    }
  }, [userId]);

  return { 
    orders, 
    loading, 
    refreshOrders: () => {
      console.log("Refreshing orders for user:", userId);
      if (userId) {
        fetchOrders(userId);
      }
    } 
  };
};
