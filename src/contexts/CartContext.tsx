
import React, { createContext, useState, useContext } from 'react';
import { Service, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: number) => void;
  getTotal: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  const addToCart = (service: Service) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(item => item.id === service.id);
      
      if (existingItem) {
        // If item exists, increase the quantity
        toast({
          title: "Quantidade atualizada",
          description: `${service.name} quantidade atualizada no carrinho.`
        });
        
        return prevItems.map(item => 
          item.id === service.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        toast({
          title: "Serviço adicionado",
          description: `${service.name} adicionado ao carrinho.`
        });
        
        // Create a new cart item with proper structure
        const newItem: CartItem = { 
          id: service.id, 
          service: service, 
          quantity: 1,
          price: service.price,
          name: service.name,
          title: service.title,
          description: service.description
        };
        
        return [...prevItems, newItem];
      }
    });
  };
  
  const removeFromCart = (serviceId: number) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === serviceId);
      
      if (itemToRemove) {
        toast({
          title: "Serviço removido",
          description: `${itemToRemove.name || itemToRemove.service.name} removido do carrinho.`
        });
      }
      
      return prevItems.filter(item => item.id !== serviceId);
    });
  };
  
  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || (item.service ? item.service.price : 0);
      return total + (price * item.quantity);
    }, 0);
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho."
    });
  };
  
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      getTotal, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};
