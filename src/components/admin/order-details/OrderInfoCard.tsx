
import React from 'react';
import { formatCurrency } from '@/lib/utils';

type OrderInfoProps = {
  status: string;
  totalPrice: number;
  initialPaymentAmount: number | null;
  finalPaymentAmount: number | null;
  updatedAt: string | null;
  formatDate: (dateString: string | null) => string;
};

export const OrderInfoCard: React.FC<OrderInfoProps> = ({
  status,
  totalPrice,
  initialPaymentAmount,
  finalPaymentAmount,
  updatedAt,
  formatDate,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Informações do Pedido</h3>
      <div className="space-y-1">
        <p><span className="font-medium">Status:</span> {status}</p>
        <p><span className="font-medium">Valor Total:</span> {formatCurrency(totalPrice)}</p>
        <p>
          <span className="font-medium">Pagamento Inicial:</span> 
          {initialPaymentAmount 
            ? formatCurrency(initialPaymentAmount) 
            : 'Não realizado'}
        </p>
        <p>
          <span className="font-medium">Pagamento Final:</span> 
          {finalPaymentAmount 
            ? formatCurrency(finalPaymentAmount) 
            : 'Não realizado'}
        </p>
        <p><span className="font-medium">Última Atualização:</span> {formatDate(updatedAt)}</p>
      </div>
    </div>
  );
};
