
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type OrderHeaderProps = {
  orderId: number;
  createdAt: string | null;
};

/**
 * Order header component showing the order ID and creation date
 */
const OrderHeader: React.FC<OrderHeaderProps> = ({ orderId, createdAt }) => {
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <DialogHeader>
      <DialogTitle>Detalhes do Pedido #{orderId}</DialogTitle>
      <DialogDescription>
        Criado em {formatDate(createdAt)}
      </DialogDescription>
    </DialogHeader>
  );
};

export default OrderHeader;
