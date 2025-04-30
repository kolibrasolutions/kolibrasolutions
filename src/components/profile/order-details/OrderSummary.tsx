
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { formatOrderDate } from '@/components/admin/order-details/orderDetailsUtils';
import { Order } from '@/types/orders';

type OrderSummaryProps = {
  order: Order;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Informações do Pedido</h3>
      <div className="space-y-1">
        <p><span className="font-medium">Status:</span> {order.status}</p>
        <p><span className="font-medium">Valor Total:</span> {formatCurrency(order.total_price)}</p>
        <p><span className="font-medium">Pagamento Inicial (20%):</span> {formatCurrency(order.initial_payment_amount || 0)}</p>
        <p><span className="font-medium">Pagamento Final (80%):</span> {formatCurrency(order.final_payment_amount || 0)}</p>
        <p><span className="font-medium">Última Atualização:</span> {formatOrderDate(order.updated_at)}</p>
      </div>
    </div>
  );
};

export default OrderSummary;
