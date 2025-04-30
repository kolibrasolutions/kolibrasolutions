
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useServices } from '@/hooks/useServices';
import FeaturedBanner from '@/components/services/FeaturedBanner';
import ServicesList from '@/components/services/ServicesList';
import CartSummary from '@/components/services/CartSummary';
import { Skeleton } from "@/components/ui/skeleton";

interface ServicesContentProps {
  onCheckout: () => void;
}

const ServicesContent: React.FC<ServicesContentProps> = ({ onCheckout }) => {
  const { cartItems, addToCart, removeFromCart, getTotal } = useCart();
  const { servicesByCategory, loading, error } = useServices();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-kolibra-blue mb-6">Nossas Soluções</h1>
      
      <FeaturedBanner />

      {loading ? (
        <div className="space-y-6">
          <div className="py-4 px-3 bg-gray-100 rounded-lg mb-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="py-4 px-3 bg-gray-100 rounded-lg mb-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Services Accordion */}
          <div className="lg:w-2/3">
            <ServicesList 
              servicesByCategory={servicesByCategory} 
              loading={loading} 
              error={error} 
              onAddToCart={addToCart} 
            />
          </div>
          
          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <CartSummary 
              cartItems={cartItems} 
              getTotal={getTotal} 
              removeFromCart={removeFromCart} 
              onCheckout={onCheckout} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesContent;
