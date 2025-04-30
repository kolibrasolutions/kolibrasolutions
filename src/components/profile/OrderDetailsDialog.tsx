
import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Order } from '@/types/orders';
import OrderDetailsContent from './order-details/OrderDetailsContent';
import OrderActionButtons from './order-details/OrderActionButtons';
import OrderRatingWrapper from './order-details/OrderRatingWrapper';
import OrderHeader from './order-details/OrderHeader';

type OrderDetailsDialogProps = {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayFinalAmount: (order: Order) => void;
  onPayInitialAmount: (order: Order) => void;
  onRefreshOrders?: () => void;
};

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  open,
  onOpenChange,
  onPayFinalAmount,
  onPayInitialAmount,
  onRefreshOrders
}) => {
  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Extracted header component */}
        <OrderHeader 
          orderId={order.id} 
          createdAt={order.created_at || null} 
        />

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
            onRefreshOrders={onRefreshOrders}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
