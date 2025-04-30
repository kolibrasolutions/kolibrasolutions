
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { StripePaymentForm } from '@/components/StripePaymentForm';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types/orders';

type PaymentDialogProps = {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  order,
  open,
  onOpenChange,
  onSuccess,
}) => {
  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pagamento Final - Pedido #{order?.id}</DialogTitle>
          <DialogDescription>
            Complete o pagamento para finalizar seu pedido
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
              <div>
                <p className="text-sm text-gray-500">Pagamento Inicial (20%)</p>
                <p className="font-medium">{formatCurrency(order.initial_payment_amount || 0)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Pagamento Final (80%)</p>
                <p className="font-bold text-xl text-green-600">
                  {formatCurrency(order.final_payment_amount || (order.total_price * 0.8))}
                </p>
              </div>
            </div>
          </div>
          
          <StripePaymentForm 
            orderId={order.id} 
            paymentType="final"
            amount={order.final_payment_amount || (order.total_price * 0.8)}
            onSuccess={onSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
