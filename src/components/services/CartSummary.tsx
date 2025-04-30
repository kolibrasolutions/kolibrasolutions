
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';
import { CartItem } from '@/types';

interface CartSummaryProps {
  cartItems: CartItem[];
  getTotal: () => number;
  removeFromCart: (id: number) => void;
  onCheckout: () => void;
}

const CartSummary = ({ cartItems, getTotal, removeFromCart, onCheckout }: CartSummaryProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-kolibra-blue flex items-center">
          <ShoppingCart size={24} className="mr-2" />
          Serviços Adicionados
        </h2>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Seu carrinho está vazio
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 w-8 h-8"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-kolibra-blue">{formatCurrency(getTotal())}</span>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Pagamento inicial de 20%: {formatCurrency(getTotal() * 0.2)}
              </p>
              <p className="text-sm text-gray-500">
                Pagamento final de 80% na conclusão: {formatCurrency(getTotal() * 0.8)}
              </p>
            </div>
          </div>
        </>
      )}
      
      <Button 
        className="w-full bg-kolibra-orange hover:bg-amber-500 text-white"
        disabled={cartItems.length === 0}
        onClick={onCheckout}
      >
        Finalizar Pedido
      </Button>
    </div>
  );
};

export default CartSummary;
