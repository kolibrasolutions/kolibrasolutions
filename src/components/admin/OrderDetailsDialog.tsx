
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderType } from '@/types/admin';
import { ClientInfoCard } from './order-details/ClientInfoCard';
import { OrderInfoCard } from './order-details/OrderInfoCard';
import { OrderItemsTable } from './order-details/OrderItemsTable';
import { OrderActionButtons } from './order-details/OrderActionButtons';
import { ManualPaymentDialog } from './order-details/ManualPaymentDialog';
import { DeleteOrderDialog } from './order-details/DeleteOrderDialog';
import { formatOrderDate } from './order-details/orderDetailsUtils';

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
              Criado em {formatOrderDate(order.created_at)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClientInfoCard 
                fullName={order.user?.full_name} 
                email={order.user?.email} 
                phone={order.user?.phone}
              />
              
              <OrderInfoCard 
                status={order.status}
                totalPrice={order.total_price}
                initialPaymentAmount={order.initial_payment_amount}
                finalPaymentAmount={order.final_payment_amount}
                updatedAt={order.updated_at}
                formatDate={formatOrderDate}
              />
            </div>
            
            <OrderItemsTable 
              orderItems={order.order_items}
              totalPrice={order.total_price}
            />
            
            <OrderActionButtons 
              orderId={order.id}
              orderStatus={order.status}
              hasInitialPayment={!!order.initial_payment_amount}
              hasFinalPayment={!!order.final_payment_amount}
              canDelete={!!deleteOrder}
              onDelete={handleDeleteOrder}
              onStatusUpdate={(status) => {
                updateOrderStatus(order.id, status);
                onOpenChange(false);
              }}
              onManualPayment={handleManualPayment}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <ManualPaymentDialog 
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        orderId={order?.id || 0}
        paymentType={manualPaymentType}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        onConfirm={confirmManualPayment}
      />
      
      <DeleteOrderDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        orderId={order?.id || 0}
        onConfirm={confirmDeleteOrder}
      />
    </>
  );
};
