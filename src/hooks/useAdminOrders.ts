import { useState, useEffect } from 'react';
import { OrderType } from '@/types/admin';
import { 
  fetchOrdersFromDB, 
  updateOrderStatusInDB, 
  deleteOrderFromDB, 
  recordManualPaymentInDB 
} from '@/services/admin';
import { filterOrders } from '@/utils/adminOrderFilters';

export function useAdminOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewOrderDetails, setViewOrderDetails] = useState<OrderType | null>(null);

  // Fetch orders with related data
  const fetchOrders = async () => {
    setLoading(true);
    const data = await fetchOrdersFromDB(statusFilter);
    setOrders(data);
    setLoading(false);
  };

  // Update order status
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const success = await updateOrderStatusInDB(orderId, newStatus);
    
    if (success) {
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() } 
          : order
      ));
    }
  };

  // Delete an order
  const deleteOrder = async (orderId: number) => {
    const success = await deleteOrderFromDB(orderId);
    
    if (success) {
      // Update local state
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  // Record manual payment
  const recordManualPayment = async (orderId: number, paymentType: 'initial' | 'final', paymentMethod: string) => {
    const orderToUpdate = orders.find(order => order.id === orderId);
    
    if (!orderToUpdate) {
      return;
    }
    
    const success = await recordManualPaymentInDB(orderId, paymentType, paymentMethod, orderToUpdate.total_price);
    
    if (success) {
      // Calculate payment amount
      const amount = paymentType === 'initial' 
        ? orderToUpdate.total_price * 0.2
        : orderToUpdate.total_price * 0.8;
      
      // Update local state
      const updateData = paymentType === 'initial'
        ? { 
            initial_payment_amount: amount,
            status: 'Pagamento Inicial Realizado',
            updated_at: new Date().toISOString()
          }
        : { 
            final_payment_amount: amount,
            updated_at: new Date().toISOString()
          };
      
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, ...updateData } 
          : order
      ));
      
      // If it's an initial payment, update the status too
      if (paymentType === 'initial') {
        // After initial payment, order can move to "Em Andamento"
        await updateOrderStatus(orderId, 'Em Andamento');
      }
      
      // Refresh orders to get the latest state
      await fetchOrders();
      
      // Close the dialog if it's open
      setViewOrderDetails(null);
    }
  };

  // Filter orders based on search term
  const filteredOrders = filterOrders(orders, searchTerm);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return {
    orders: filteredOrders,
    loading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    viewOrderDetails,
    setViewOrderDetails,
    fetchOrders,
    updateOrderStatus,
    recordManualPayment,
    deleteOrder
  };
}
