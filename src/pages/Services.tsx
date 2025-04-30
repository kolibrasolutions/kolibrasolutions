
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
import { toast } from '@/components/ui/sonner';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const { cartItems, addToCart, removeFromCart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Get user session
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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

        // Temporarily modify data for the new service categories
        // This is just for display until the database is updated
        const modifiedData = data.map(service => {
          // Map old categories to new ones
          let newCategory = service.category;
          if (service.category === 'Paisagismo Residencial') newCategory = 'Branding';
          if (service.category === 'Manutenção de Jardins') newCategory = 'Web';
          if (service.category === 'Sistemas de Irrigação') newCategory = 'Marketing';
          
          // Update service names based on category
          let newName = service.name;
          if (newCategory === 'Branding') {
            if (service.name.includes('Jardim')) newName = 'Naming e Identidade Verbal';
            if (service.name.includes('Plantas')) newName = 'Logo e Identidade Visual';
            if (service.name.includes('Grama')) newName = 'Guia de Marca Completo';
          }
          if (newCategory === 'Web') {
            if (service.name.includes('Corte')) newName = 'Site Básico';
            if (service.name.includes('Fertilização')) newName = 'Site Institucional';
            if (service.name.includes('Poda')) newName = 'E-commerce Completo';
          }
          if (newCategory === 'Marketing') {
            if (service.name.includes('Sistema')) newName = 'Gestão de Redes Sociais';
            if (service.name.includes('Irrigação')) newName = 'Google Ads';
            if (service.name.includes('Manutenção')) newName = 'SEO Otimização';
          }
          
          // Update service description
          let newDescription = "Descrição do serviço a ser customizada para KOLIBRA SOLUTIONS.";
          
          return {
            ...service,
            category: newCategory,
            name: newName,
            description: newDescription
          };
        });

        setServices(modifiedData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(modifiedData.map(service => service.category)));
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
    if (cartItems.length === 0) {
      toast("Carrinho vazio", {
        description: "Adicione algum serviço ao carrinho antes de finalizar o pedido."
      });
      return;
    }
    
    try {
      // Check if user is logged in
      if (!user) {
        // Save current path to redirect back after login
        navigate('/login?returnUrl=/servicos');
        return;
      }
      
      // Create order in the database
      const orderItems = cartItems.map(item => ({
        service_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price
      }));
      
      const totalPrice = getTotal();
      const initialPaymentAmount = totalPrice * 0.5; // 50% initial payment
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: totalPrice,
          initial_payment_amount: initialPaymentAmount,
          final_payment_amount: totalPrice - initialPaymentAmount,
          status: 'Pendente'
        })
        .select()
        .single();
      
      if (orderError) {
        throw new Error(orderError.message);
      }
      
      // Add order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
          orderItems.map(item => ({
            ...item,
            order_id: order.id
          }))
        );
      
      if (itemsError) {
        throw new Error(itemsError.message);
      }
      
      // Clear the cart
      clearCart();
      
      // Navigate to the payment page
      navigate(`/payment-confirmation?orderId=${order.id}`);
      
      toast("Pedido criado com sucesso!", {
        description: "Você será redirecionado para o pagamento."
      });
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast("Erro ao criar pedido", {
        description: error.message || "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente."
      });
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
        <h1 className="text-4xl font-bold text-kolibra-blue mb-6">Nossas Soluções</h1>
        
        {/* Featured Banner */}
        <div className="bg-gradient-to-r from-kolibra-blue to-blue-700 text-white p-8 rounded-lg mb-12 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">KOLIBRA FINANCE</h2>
          <p className="mb-4">Soluções financeiras SaaS para gestão completa do seu negócio.</p>
          <Button className="bg-kolibra-orange hover:bg-amber-500 text-white">
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
                    <AccordionTrigger className="text-xl font-medium text-kolibra-blue">
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
                                <span className="font-bold text-kolibra-orange">{formatCurrency(service.price)}</span>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="mt-2 border-kolibra-orange text-kolibra-orange hover:bg-kolibra-orange hover:text-white"
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
                        Pagamento inicial de 50%: {formatCurrency(getTotal() * 0.5)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Pagamento final de 50% na conclusão: {formatCurrency(getTotal() * 0.5)}
                      </p>
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                className="w-full bg-kolibra-orange hover:bg-amber-500 text-white"
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
