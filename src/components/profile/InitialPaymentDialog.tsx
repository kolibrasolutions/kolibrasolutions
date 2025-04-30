
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { StripePaymentForm } from '@/components/StripePaymentForm';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types/orders';

type InitialPaymentDialogProps = {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export const InitialPaymentDialog: React.FC<InitialPaymentDialogProps> = ({
  order,
  open,
  onOpenChange,
  onSuccess,
}) => {
  if (!order) {
    return null;
  }

  // Calculate the 20% initial payment amount
  const initialAmount = order.initial_payment_amount || (order.total_price * 0.2);
  const priceId = "prod_SE3wdy3XRuRscG"; // Using the specific price ID for 20% payment
  
  console.log(`InitialPaymentDialog - Order #${order.id}, status: ${order.status}, initial amount: ${initialAmount}, priceId: ${priceId}`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pagamento Inicial - Pedido #{order?.id}</DialogTitle>
          <DialogDescription>
            Complete o pagamento inicial (20%) para iniciar seu pedido
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="font-medium">{formatCurrency(order.total_price)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Pagamento Inicial (20%)</p>
                <p className="font-bold text-xl text-green-600">
                  {formatCurrency(initialAmount)}
                </p>
              </div>
            </div>
          </div>
          
          <StripePaymentForm 
            orderId={order.id} 
            paymentType="initial"
            amount={initialAmount}
            priceId={priceId} // Explicitly passing the price ID
            onSuccess={onSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
