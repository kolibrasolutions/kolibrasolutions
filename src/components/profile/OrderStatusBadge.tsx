
import React from 'react';

type OrderStatusBadgeProps = {
  status: string;
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aceito':
        return 'bg-blue-100 text-blue-800';
      case 'Em Andamento':
        return 'bg-purple-100 text-purple-800';
      case 'Finalizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(status)}`}>
      {status}
    </span>
  );
};
