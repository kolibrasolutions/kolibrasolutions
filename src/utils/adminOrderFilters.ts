
import { OrderType } from '@/types/admin';

/**
 * Filters orders based on search term
 */
export const filterOrders = (orders: OrderType[], searchTerm: string): OrderType[] => {
  if (!searchTerm.trim()) {
    return orders;
  }
  
  const searchString = searchTerm.toLowerCase();
  
  return orders.filter(order => {
    const userEmail = order.user?.email?.toLowerCase() || '';
    const userName = order.user?.full_name?.toLowerCase() || '';
    const orderId = order.id.toString();
    
    return userEmail.includes(searchString) || 
           userName.includes(searchString) || 
           orderId.includes(searchString);
  });
};
