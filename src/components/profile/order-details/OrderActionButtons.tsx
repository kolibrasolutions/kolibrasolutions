
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/orders';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; 
import { AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/sonner';

type OrderActionButtonsProps = {
  order: Order;
  onPayInitialAmount: (order: Order) => void;
  onPayFinalAmount: (order: Order) => void;
  onRefreshOrders?: () => void;
};

/**
 * Component that renders action buttons based on the order status
 */
const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({ 
  order, 
  onPayInitialAmount,
  onPayFinalAmount,
  onRefreshOrders
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle order deletion
  const handleDeleteOrder = async () => {
    if (!order) return;
    
    setIsDeleting(true);
    try {
      // Delete order items first due to foreign key constraints
      await supabase
        .from('order_items')
        .delete()
        .eq('order_id', order.id);
      
      // Delete any ratings related to this order
      await supabase
        .from('project_ratings')
        .delete()
        .eq('order_id', order.id);
        
      // Delete any payments related to this order
      await supabase
        .from('payments')
        .delete()
        .eq('order_id', order.id);
      
      // Finally delete the order
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);
      
      if (error) throw error;
      
      toast.success("Pedido excluído com sucesso!");
      
      // Close dialog and refresh orders if callback is provided
      setDeleteDialogOpen(false);
      if (onRefreshOrders) {
        onRefreshOrders();
      }
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      toast.error("Erro ao excluir pedido. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

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
    <>
      <div className="flex flex-wrap justify-between gap-2">
        {/* Left side: Delete button */}
        <Button 
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Excluir Pedido
        </Button>
        
        {/* Right side: Payment buttons */}
        <div className="flex space-x-2">
          {renderInitialPaymentButton()}
          {renderFinalPaymentButton()}
        </div>
      </div>

      {/* Delete confirmation dialog */}
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
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteOrder} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir Pedido"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderActionButtons;
