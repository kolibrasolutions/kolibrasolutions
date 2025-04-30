
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Service } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, ShoppingCart, X } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const { cartItems, addToCart, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('category');
          
        if (error) throw error;

        setServices(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map(service => service.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Não foi possível carregar os serviços. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleCheckout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // User is not logged in, redirect to login
        navigate('/login');
        return;
      }
      
      // If user is logged in
      console.log('Usuário logado, pronto para criar pedido no backend', session);
      // Additional checkout logic will be implemented in future prompts
    } catch (error) {
      console.error('Error checking session:', error);
      // Redirect to login on error
      navigate('/login');
    }
  };

  // Group services by category
  const servicesByCategory = categories.map(category => ({
    category,
    items: services.filter(service => service.category === category)
  }));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-green-800 mb-6">Nossos Serviços</h1>
        
        {/* Featured Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-lg mb-12 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Planos de Assinatura JardimPró</h2>
          <p className="mb-4">Cuidados regulares para seu jardim com nossos planos mensais personalizados.</p>
          <Button className="bg-white text-green-700 hover:bg-gray-100">
            Conhecer Planos
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Services Accordion */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="text-center py-12">Carregando serviços...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {servicesByCategory.map((categoryGroup, index) => (
                  <AccordionItem key={index} value={`category-${index}`}>
                    <AccordionTrigger className="text-xl font-medium text-green-800">
                      {categoryGroup.category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {categoryGroup.items.map(service => (
                          <div key={service.id} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-bold text-lg">{service.name}</h3>
                                <p className="text-gray-700 mt-1">{service.description}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-bold text-green-700">{formatCurrency(service.price)}</span>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="mt-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                  onClick={() => addToCart(service)}
                                >
                                  <Plus size={16} className="mr-1" /> Adicionar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
          
          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-green-50 rounded-lg p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-800 flex items-center">
                  <ShoppingCart size={24} className="mr-2" />
                  Serviços Adicionados
                </h2>
              </div>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Sua cesta está vazia
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
                      <span className="text-green-700">{formatCurrency(getTotal())}</span>
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                Finalizar Pedido
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
