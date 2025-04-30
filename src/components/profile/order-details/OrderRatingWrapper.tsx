
import React from 'react';
import OrderRatingSection from '@/components/profile/OrderRatingSection';
import { Order } from '@/types/orders';

type OrderRatingWrapperProps = {
  order: Order;
};

const OrderRatingWrapper: React.FC<OrderRatingWrapperProps> = ({ order }) => {
  if (order.status !== 'Finalizado') {
    return null;
  }

  return <OrderRatingSection order={order} />;
};

export default OrderRatingWrapper;
