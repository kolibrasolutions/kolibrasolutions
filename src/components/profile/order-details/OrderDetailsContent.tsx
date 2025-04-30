
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { formatOrderDate } from '@/components/admin/order-details/orderDetailsUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Order } from '@/types/orders';
import OrderStatusProgress from './OrderStatusProgress';
import OrderSummary from './OrderSummary';

type OrderDetailsContentProps = {
  order: Order;
};

const OrderDetailsContent: React.FC<OrderDetailsContentProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderSummary order={order} />
        <OrderStatusProgress status={order.status} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.order_items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.service?.name || 'N/A'}</TableCell>
                <TableCell>{item.service?.description || 'Sem descrição'}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.price_at_order * item.quantity)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(order.total_price)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderDetailsContent;
