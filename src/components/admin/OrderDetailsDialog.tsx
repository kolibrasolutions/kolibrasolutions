
import React, { useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from '@/lib/utils';
import { OrderType } from '@/types/admin';
import { Trash2 } from 'lucide-react';

type OrderDetailsDialogProps = {
  order: OrderType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateOrderStatus: (orderId: number, newStatus: string) => void;
  recordManualPayment?: (orderId: number, paymentType: 'initial' | 'final', paymentMethod: string) => void;
  deleteOrder?: (orderId: number) => void;
};

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  open,
  onOpenChange,
  updateOrderStatus,
  recordManualPayment,
  deleteOrder,
}) => {
  const [manualPaymentType, setManualPaymentType] = useState<'initial' | 'final' | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Dinheiro");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Payment methods options
  const paymentMethods = ["Dinheiro", "PIX", "Transferência bancária", "Outro"];

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleManualPayment = (paymentType: 'initial' | 'final') => {
    setManualPaymentType(paymentType);
    setConfirmDialogOpen(true);
  };

  const confirmManualPayment = () => {
    if (order && manualPaymentType && recordManualPayment) {
      recordManualPayment(order.id, manualPaymentType, selectedPaymentMethod);
      setConfirmDialogOpen(false);
    }
  };
  
  const handleDeleteOrder = () => {
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteOrder = () => {
    if (order && deleteOrder) {
      deleteOrder(order.id);
      setDeleteDialogOpen(false);
      onOpenChange(false);
    }
  };

  if (!order) {
    return null;
  }

  return (
    <>
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
                  <p>
                    <span className="font-medium">Pagamento Inicial:</span> 
                    {order.initial_payment_amount 
                      ? formatCurrency(order.initial_payment_amount) 
                      : 'Não realizado'}
                  </p>
                  <p>
                    <span className="font-medium">Pagamento Final:</span> 
                    {order.final_payment_amount 
                      ? formatCurrency(order.final_payment_amount) 
                      : 'Não realizado'}
                  </p>
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
            
            <div className="flex flex-wrap gap-2 justify-between">
              {/* Left side: Delete button */}
              {deleteOrder && order.status === 'Pendente' && (
                <Button 
                  variant="destructive"
                  onClick={handleDeleteOrder}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir Pedido
                </Button>
              )}
              
              {/* Right side: Status update buttons */}
              <div className="flex flex-wrap gap-2">
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
                
                {order.status === 'Aceito' && recordManualPayment && !order.initial_payment_amount && (
                  <Button
                    onClick={() => handleManualPayment('initial')}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Registrar Pagamento Inicial Manual
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
                
                {order.status === 'Finalizado' && recordManualPayment && !order.final_payment_amount && (
                  <Button
                    onClick={() => handleManualPayment('final')}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Registrar Pagamento Final Manual
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Manual Payment Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Pagamento Manual</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a registrar um {manualPaymentType === 'initial' ? 'pagamento inicial (20%)' : 'pagamento final (80%)'} 
              manual para o pedido #{order.id}.
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Método de pagamento:
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmManualPayment}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Order Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir o pedido #{order.id}. Esta ação não pode ser desfeita.
              
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                <p>Atenção: A exclusão do pedido removerá permanentemente todos os dados associados a este pedido.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOrder} className="bg-red-500 hover:bg-red-600">
              Excluir Pedido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
