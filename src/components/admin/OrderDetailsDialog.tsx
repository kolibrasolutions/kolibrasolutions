
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { OrderType } from '@/types/admin';

type OrderDetailsDialogProps = {
  order: OrderType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateOrderStatus: (orderId: number, newStatus: string) => void;
};

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  open,
  onOpenChange,
  updateOrderStatus,
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
              <h3 className="text-lg font-semibold mb-2">Informações do Cliente</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Nome:</span> {order.user?.full_name || 'N/A'}</p>
                <p><span className="font-medium">Email:</span> {order.user?.email}</p>
                <p><span className="font-medium">Telefone:</span> {order.user?.phone || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Informações do Pedido</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Status:</span> {order.status}</p>
                <p><span className="font-medium">Valor Total:</span> {formatCurrency(order.total_price)}</p>
                <p><span className="font-medium">Pagamento Inicial:</span> {formatCurrency(order.initial_payment_amount || 0)}</p>
                <p><span className="font-medium">Pagamento Final:</span> {formatCurrency(order.final_payment_amount || 0)}</p>
                <p><span className="font-medium">Última Atualização:</span> {formatDate(order.updated_at)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.service?.name || 'N/A'}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.price_at_order)}</TableCell>
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
            {order.status === 'Pendente' && (
              <Button 
                onClick={() => {
                  updateOrderStatus(order.id, 'Aceito');
                  onOpenChange(false);
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Aceitar Pedido
              </Button>
            )}
            
            {order.status === 'Aceito' && (
              <Button 
                onClick={() => {
                  updateOrderStatus(order.id, 'Em Andamento');
                  onOpenChange(false);
                }}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Iniciar Trabalho
              </Button>
            )}
            
            {order.status === 'Em Andamento' && (
              <Button 
                onClick={() => {
                  updateOrderStatus(order.id, 'Finalizado');
                  onOpenChange(false);
                }}
                className="bg-green-500 hover:bg-green-600"
              >
                Finalizar Pedido
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
