
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type OrderType = {
  id: number;
  created_at: string;
  updated_at: string | null;
  status: string;
  total_price: number;
  initial_payment_amount: number | null;
  final_payment_amount: number | null;
  order_items: {
    id: number;
    service: {
      name: string;
      price: number;
      description: string | null;
    };
    quantity: number;
    price_at_order: number;
  }[];
};

type OrderDetailsDialogProps = {
  order: OrderType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayFinalAmount: (order: OrderType) => void;
};

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  open,
  onOpenChange,
  onPayFinalAmount,
}) => {
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
          <DialogDescription>
            Criado em {formatDate(order.created_at || null)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informações do Pedido</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Status:</span> {order.status}</p>
                <p><span className="font-medium">Valor Total:</span> {formatCurrency(order.total_price)}</p>
                <p><span className="font-medium">Pagamento Inicial (20%):</span> {formatCurrency(order.initial_payment_amount || 0)}</p>
                <p><span className="font-medium">Pagamento Final (80%):</span> {formatCurrency(order.final_payment_amount || 0)}</p>
                <p><span className="font-medium">Última Atualização:</span> {formatDate(order.updated_at)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Status do Pedido</h3>
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="relative flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status !== 'Pendente' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">Pedido Recebido</p>
                    <p className="text-sm text-gray-500">Aguardando confirmação</p>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['Aceito', 'Em Andamento', 'Finalizado'].includes(order.status) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">Pedido Aceito</p>
                    <p className="text-sm text-gray-500">Preparando para iniciar</p>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['Em Andamento', 'Finalizado'].includes(order.status) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">Em Andamento</p>
                    <p className="text-sm text-gray-500">Trabalhando no seu pedido</p>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'Finalizado' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    4
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">Finalizado</p>
                    <p className="text-sm text-gray-500">Pedido concluído</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.service?.name || 'N/A'}</TableCell>
                    <TableCell>{item.service?.description || 'Sem descrição'}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price_at_order * item.quantity)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(order.total_price)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end space-x-2">
            {order.status === 'Finalizado' && !order.final_payment_amount && (
              <Button 
                onClick={() => {
                  onPayFinalAmount(order);
                }}
                className="bg-green-500 hover:bg-green-600"
              >
                Realizar Pagamento Final
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
