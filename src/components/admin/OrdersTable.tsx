
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { OrderType } from '@/types/admin';

type OrdersTableProps = {
  orders: OrderType[];
  loading: boolean;
  onViewDetails: (order: OrderType) => void;
  updateOrderStatus: (orderId: number, newStatus: string) => void;
};

export const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  loading, 
  onViewDetails,
  updateOrderStatus
}) => {
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
      <Table>
        <TableCaption>Lista de pedidos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">
              Nenhum pedido encontrado
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Lista de pedidos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
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
              <TableCell>
                <div className="font-medium">{order.user?.full_name || 'N/A'}</div>
                <div className="text-sm text-gray-500">{order.user?.email}</div>
                {order.user?.phone && (
                  <div className="text-sm text-gray-500">Tel: {order.user.phone}</div>
                )}
              </TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>{formatCurrency(order.total_price)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Aceito' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Em Andamento' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status}
                </span>
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
                  
                  {order.status === 'Pendente' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'Aceito')}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                    >
                      Aceitar
                    </Button>
                  )}
                  
                  {order.status === 'Aceito' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'Em Andamento')}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-600"
                    >
                      Iniciar
                    </Button>
                  )}
                  
                  {order.status === 'Em Andamento' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'Finalizado')}
                      className="bg-green-50 hover:bg-green-100 text-green-600"
                    >
                      Finalizar
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
