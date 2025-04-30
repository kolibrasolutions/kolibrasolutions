
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { OrderType } from '@/types/admin';

type OrderItemsTableProps = {
  orderItems: OrderType['order_items'];
  totalPrice: number;
};

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ orderItems, totalPrice }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serviço</TableHead>
            <TableHead>Qtd</TableHead>
            <TableHead>Preço Unit.</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.service?.name || 'N/A'}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{formatCurrency(item.price_at_order)}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.price_at_order * item.quantity)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
            <TableCell className="text-right font-semibold">{formatCurrency(totalPrice)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
