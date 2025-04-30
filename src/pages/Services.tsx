
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useServices } from '@/hooks/useServices';
import FeaturedBanner from '@/components/services/FeaturedBanner';
import ServicesList from '@/components/services/ServicesList';
import CartSummary from '@/components/services/CartSummary';
import { Skeleton } from "@/components/ui/skeleton";

const Services = () => {
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const { cartItems, addToCart, removeFromCart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { servicesByCategory, loading, error } = useServices();

  // Get user session
  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        setUserLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session error:", error);
          return;
        }
        
        if (!isMounted) return;
        setUser(data.session?.user || null);
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (isMounted) {
          setUserLoading(false);
        }
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      setUser(session?.user || null);
    });
    
    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast("Carrinho vazio", {
        description: "Adicione algum serviço ao carrinho antes de finalizar o pedido."
      });
      return;
    }
    
    try {
      // Check if user is logged in
      if (!user) {
        // Save current path to redirect back after login
        navigate('/login?returnUrl=/servicos');
        return;
      }
      
      // Create order in the database
      const orderItems = cartItems.map(item => ({
        service_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price
      }));
      
      const totalPrice = getTotal();
      const initialPaymentAmount = totalPrice * 0.2; // 20% initial payment
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: totalPrice,
          initial_payment_amount: initialPaymentAmount,
          final_payment_amount: totalPrice - initialPaymentAmount,
          status: 'Pendente'
        })
        .select()
        .single();
      
      if (orderError) {
        throw new Error(orderError.message);
      }
      
      // Add order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
          orderItems.map(item => ({
            ...item,
            order_id: order.id
          }))
        );
      
      if (itemsError) {
        throw new Error(itemsError.message);
      }
      
      // Clear the cart
      clearCart();
      
      // Navigate to the payment page
      navigate(`/payment-confirmation?orderId=${order.id}`);
      
      toast("Pedido criado com sucesso!", {
        description: "Você será redirecionado para o pagamento."
      });
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast("Erro ao criar pedido", {
        description: error.message || "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente."
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-kolibra-blue mb-6">Nossas Soluções</h1>
        
        <FeaturedBanner />

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Services Accordion */}
            <div className="lg:w-2/3">
              <ServicesList 
                servicesByCategory={servicesByCategory} 
                loading={false} 
                error={error} 
                onAddToCart={addToCart} 
              />
            </div>
            
            {/* Cart Summary */}
            <div className="lg:w-1/3">
              <CartSummary 
                cartItems={cartItems} 
                getTotal={getTotal} 
                removeFromCart={removeFromCart} 
                onCheckout={handleCheckout} 
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Services;
