
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types/orders';

type OrdersListProps = {
  orders: Order[];
  loading: boolean;
  onViewDetails: (order: Order) => void;
  onPayFinal: (order: Order) => void;
  onPayInitial: (order: Order) => void;
};

export const OrdersList: React.FC<OrdersListProps> = ({ 
  orders, 
  loading, 
  onViewDetails, 
  onPayFinal,
  onPayInitial
}) => {
  const navigate = useNavigate();
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-xl text-gray-600">Você ainda não possui pedidos</p>
        <Button 
          className="mt-4"
          onClick={() => navigate('/servicos')}
        >
          Explorar Serviços
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Lista de seus pedidos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>{formatCurrency(order.total_price)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewDetails(order)}
                  >
                    Detalhes
                  </Button>
                  
                  {order.status === 'Aceito' && (
                    <Button 
                      size="sm"
                      onClick={() => onPayInitial(order)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Pagar 20%
                    </Button>
                  )}
                  
                  {order.status === 'Finalizado' && !order.final_payment_amount && (
                    <Button 
                      size="sm"
                      onClick={() => onPayFinal(order)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Pagar 80%
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
