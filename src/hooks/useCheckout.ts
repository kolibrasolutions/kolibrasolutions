
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async (user: any) => {
    if (cartItems.length === 0) {
      toast("Carrinho vazio", {
        description: "Adicione algum serviço ao carrinho antes de finalizar o pedido."
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Check if user is logged in
      if (!user) {
        // Save current path to redirect back after login
        navigate('/login?returnUrl=/servicos');
        return;
      }
      
      // Create order items data
      const orderItems = cartItems.map(item => ({
        service_id: item.id,
        quantity: item.quantity,
        price_at_order: item.service ? item.service.price : (item.price || 0)
      }));
      
      const totalPrice = getTotal();
      const initialPaymentAmount = totalPrice * 0.2; // 20% initial payment
      
      // Create order in the database
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
      
      // Navigate to the profile page
      navigate(`/profile`);
      
      toast("Pedido criado com sucesso!", {
        description: "Seu pedido foi criado e está aguardando aprovação do administrador."
      });
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Erro ao criar pedido", {
        description: error.message || "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleCheckout,
    isProcessing
  };
}
