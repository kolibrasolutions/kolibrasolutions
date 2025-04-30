
import React from 'react';
import OrderRatingSection from '@/components/profile/OrderRatingSection';
import { Order } from '@/types/orders';

type OrderRatingWrapperProps = {
  order: Order;
};

/**
 * Component that conditionally renders the OrderRatingSection 
 * only when the order status is "Finalizado"
 */
const OrderRatingWrapper: React.FC<OrderRatingWrapperProps> = ({ order }) => {
  // Only show the rating section for completed orders
  if (order.status !== 'Finalizado') {
    return null;
  }

  return <OrderRatingSection order={order} />;
};

export default OrderRatingWrapper;
