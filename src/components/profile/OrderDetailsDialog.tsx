
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Order } from '@/types/orders';
import OrderDetailsContent from './order-details/OrderDetailsContent';
import OrderActionButtons from './order-details/OrderActionButtons';
import OrderRatingWrapper from './order-details/OrderRatingWrapper';

type OrderDetailsDialogProps = {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayFinalAmount: (order: Order) => void;
  onPayInitialAmount: (order: Order) => void;
};

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  open,
  onOpenChange,
  onPayFinalAmount,
  onPayInitialAmount,
}) => {
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
          <DialogDescription>
            Criado em {formatDate(order.created_at || null)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main content with order details, items and status progress */}
          <OrderDetailsContent order={order} />
          
          {/* Rating section for completed orders */}
          <OrderRatingWrapper order={order} />
          
          {/* Action buttons based on order status */}
          <OrderActionButtons 
            order={order}
            onPayInitialAmount={onPayInitialAmount}
            onPayFinalAmount={onPayFinalAmount}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
