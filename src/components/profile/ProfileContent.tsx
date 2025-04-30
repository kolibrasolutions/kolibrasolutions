
import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { OrdersList } from './OrdersList';
import { OrderDetailsDialog } from './OrderDetailsDialog';
import { PaymentDialog } from './PaymentDialog';
import { InitialPaymentDialog } from './InitialPaymentDialog';
import { toast } from '@/components/ui/sonner';
import { Order } from '@/types/orders';

type ProfileContentProps = {
  user: any;
  orders: Order[];
  loading: boolean;
  onRefreshOrders: () => void;
};

export const ProfileContent: React.FC<ProfileContentProps> = ({
  user,
  orders,
  loading,
  onRefreshOrders
}) => {
  const [viewOrderDetails, setViewOrderDetails] = useState<Order | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [initialPaymentOrder, setInitialPaymentOrder] = useState<Order | null>(null);

  // Handle payment for accepted orders (initial 20%)
  const handlePayInitialAmount = (order: Order) => {
    if (order.status !== 'Aceito') {
      toast("Informação", { 
        description: "O pagamento inicial só pode ser realizado quando o pedido estiver aceito pelo administrador" 
      });
      return;
    }
    
    setInitialPaymentOrder(order);
  };
  
  // Handle payment for finalized orders (final 80%)
  const handlePayFinalAmount = (order: Order) => {
    if (order.status !== 'Finalizado') {
      toast("Informação", { 
        description: "O pagamento final só pode ser realizado quando o pedido estiver finalizado" 
      });
      return;
    }
    
    setPaymentOrder(order);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <ProfileHeader user={user} orders={orders} />
      
      <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
      
      <OrdersList 
        orders={orders}
        loading={loading}
        onViewDetails={(order) => setViewOrderDetails(order)}
        onPayFinal={handlePayFinalAmount}
        onPayInitial={handlePayInitialAmount}
        onRefreshOrders={onRefreshOrders}
      />
      
      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={viewOrderDetails}
        open={!!viewOrderDetails}
        onOpenChange={(open) => {
          if (!open) setViewOrderDetails(null);
        }}
        onPayFinalAmount={(order) => {
          handlePayFinalAmount(order);
          setViewOrderDetails(null);
        }}
        onPayInitialAmount={(order) => {
          handlePayInitialAmount(order);
          setViewOrderDetails(null);
        }}
        onRefreshOrders={() => {
          setViewOrderDetails(null);
          onRefreshOrders();
        }}
      />
      
      {/* Final Payment Dialog */}
      <PaymentDialog
        order={paymentOrder}
        open={!!paymentOrder}
        onOpenChange={(open) => {
          if (!open) setPaymentOrder(null);
        }}
        onSuccess={() => {
          setPaymentOrder(null);
          onRefreshOrders();
        }}
      />
      
      {/* Initial Payment Dialog */}
      <InitialPaymentDialog
        order={initialPaymentOrder}
        open={!!initialPaymentOrder}
        onOpenChange={(open) => {
          if (!open) setInitialPaymentOrder(null);
        }}
        onSuccess={() => {
          setInitialPaymentOrder(null);
          onRefreshOrders();
        }}
      />
    </div>
  );
};
