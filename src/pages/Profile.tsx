
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { OrdersList } from '@/components/profile/OrdersList';
import { OrderDetailsDialog } from '@/components/profile/OrderDetailsDialog';
import { PaymentDialog } from '@/components/profile/PaymentDialog';
import { InitialPaymentDialog } from '@/components/profile/InitialPaymentDialog';

type OrderType = {
  id: number;
  created_at: string;
  updated_at: string | null;
  status: string;
  total_price: number;
  initial_payment_amount: number | null;
  final_payment_amount: number | null;
  order_items: {
    id: number;
    service: {
      name: string;
      price: number;
      description: string | null;
    };
    quantity: number;
    price_at_order: number;
  }[];
};

const Profile = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewOrderDetails, setViewOrderDetails] = useState<OrderType | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<OrderType | null>(null);
  const [initialPaymentOrder, setInitialPaymentOrder] = useState<OrderType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast("Acesso restrito", { description: "Faça login para acessar esta página" });
        navigate('/login?returnUrl=/profile');
        return;
      }
      
      setUser(session.user);
      fetchOrders(session.user.id);
    };
    
    checkAuth();
  }, [navigate]);

  const fetchOrders = async (userId: string) => {
    setLoading(true);
    try {
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
  
  // Handle payment for accepted orders (initial 20%)
  const handlePayInitialAmount = (order: OrderType) => {
    if (order.status !== 'Aceito') {
      toast("Informação", { 
        description: "O pagamento inicial só pode ser realizado quando o pedido estiver aceito pelo administrador" 
      });
      return;
    }
    
    setInitialPaymentOrder(order);
  };
  
  // Handle payment for finalized orders (final 80%)
  const handlePayFinalAmount = (order: OrderType) => {
    if (order.status !== 'Finalizado') {
      toast("Informação", { 
        description: "O pagamento final só pode ser realizado quando o pedido estiver finalizado" 
      });
      return;
    }
    
    setPaymentOrder(order);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <ProfileHeader user={user} orders={orders} />
        
        <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
        
        <OrdersList 
          orders={orders}
          loading={loading}
          onViewDetails={(order) => setViewOrderDetails(order)}
          onPayFinal={handlePayFinalAmount}
          onPayInitial={handlePayInitialAmount}
        />
        
        {/* Order Details Dialog */}
        <OrderDetailsDialog
          order={viewOrderDetails}
          open={!!viewOrderDetails}
          onOpenChange={(open) => {
            if (!open) setViewOrderDetails(null);
          }}
          onPayFinalAmount={(order) => {
            handlePayFinalAmount(order);
            setViewOrderDetails(null);
          }}
          onPayInitialAmount={(order) => {
            handlePayInitialAmount(order);
            setViewOrderDetails(null);
          }}
        />
        
        {/* Final Payment Dialog */}
        <PaymentDialog
          order={paymentOrder}
          open={!!paymentOrder}
          onOpenChange={(open) => {
            if (!open) setPaymentOrder(null);
          }}
          onSuccess={() => {
            setPaymentOrder(null);
            if (user) {
              fetchOrders(user.id);
            }
          }}
        />
        
        {/* Initial Payment Dialog */}
        <InitialPaymentDialog
          order={initialPaymentOrder}
          open={!!initialPaymentOrder}
          onOpenChange={(open) => {
            if (!open) setInitialPaymentOrder(null);
          }}
          onSuccess={() => {
            setInitialPaymentOrder(null);
            if (user) {
              fetchOrders(user.id);
            }
          }}
        />
      </div>
    </Layout>
  );
};

export default Profile;
