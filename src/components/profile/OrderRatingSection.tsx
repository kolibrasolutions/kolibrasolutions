
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/orders';
import OrderRating from './OrderRating';

type OrderRatingSectionProps = {
  order: Order;
};

const OrderRatingSection: React.FC<OrderRatingSectionProps> = ({ order }) => {
  const [hasRated, setHasRated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkExistingRating = async () => {
      try {
        const { data, error } = await supabase
          .from('project_ratings')
          .select('*')
          .eq('order_id', order.id)
          .maybeSingle();
          
        if (error) throw error;
        
        setHasRated(!!data);
      } catch (error) {
        console.error('Erro ao verificar avaliação existente:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (order.status === 'Finalizado') {
      checkExistingRating();
    } else {
      setLoading(false);
    }
  }, [order.id, order.status]);
  
  if (order.status !== 'Finalizado' || loading) {
    return null;
  }
  
  if (hasRated) {
    return (
      <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md text-center">
        Obrigado por avaliar nosso serviço!
      </div>
    );
  }
  
  return <OrderRating order={order} onRatingSubmit={() => setHasRated(true)} />;
};

export default OrderRatingSection;
