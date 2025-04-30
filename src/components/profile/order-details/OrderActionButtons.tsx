
import React from 'react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/orders';

type OrderActionButtonsProps = {
  order: Order;
  onPayInitialAmount: (order: Order) => void;
  onPayFinalAmount: (order: Order) => void;
};

/**
 * Component that renders action buttons based on the order status
 */
const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({ 
  order, 
  onPayInitialAmount,
  onPayFinalAmount 
}) => {
  // Render initial payment button when order is accepted
  const renderInitialPaymentButton = () => {
    if (order.status !== 'Aceito') return null;
    
    return (
      <Button 
        onClick={() => onPayInitialAmount(order)}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Realizar Pagamento Inicial (20%)
      </Button>
    );
  };

  // Render final payment button when order is completed but final payment is missing
  const renderFinalPaymentButton = () => {
    if (order.status !== 'Finalizado' || order.final_payment_amount) return null;
    
    return (
      <Button 
        onClick={() => onPayFinalAmount(order)}
        className="bg-green-500 hover:bg-green-600"
      >
        Realizar Pagamento Final (80%)
      </Button>
    );
  };

  return (
    <div className="flex justify-end space-x-2">
      {renderInitialPaymentButton()}
      {renderFinalPaymentButton()}
    </div>
  );
};

export default OrderActionButtons;
