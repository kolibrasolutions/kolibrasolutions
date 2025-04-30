
import React from 'react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/orders';

type OrderActionButtonsProps = {
  order: Order;
  onPayInitialAmount: (order: Order) => void;
  onPayFinalAmount: (order: Order) => void;
};

const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({ 
  order, 
  onPayInitialAmount,
  onPayFinalAmount 
}) => {
  return (
    <div className="flex justify-end space-x-2">
      {order.status === 'Aceito' && (
        <Button 
          onClick={() => onPayInitialAmount(order)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Realizar Pagamento Inicial (20%)
        </Button>
      )}
      
      {order.status === 'Finalizado' && !order.final_payment_amount && (
        <Button 
          onClick={() => onPayFinalAmount(order)}
          className="bg-green-500 hover:bg-green-600"
        >
          Realizar Pagamento Final (80%)
        </Button>
      )}
    </div>
  );
};

export default OrderActionButtons;
