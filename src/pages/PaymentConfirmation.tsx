
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2, FileDown, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { StripePaymentForm } from '@/components/StripePaymentForm';

interface OrderItem {
  id: number;
  service_id: number;
  service_name?: string;
  quantity: number;
  price_at_order: number;
}

interface DeliveryFile {
  url: string;
  name: string;
  expires_at: string;
}

interface OrderData {
  id: number;
  status: string;
  total_price: number;
  initial_payment_amount: number | null;
  final_payment_amount: number | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
  order_items?: OrderItem[];
  delivery_files?: DeliveryFile[];
}

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'success' | 'failed' | 'processing'>('processing');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        if (!orderId) {
          // If no order ID, we just process the redirect_status from Stripe
          if (redirectStatus === 'succeeded') {
            setStatus('success');
          } else if (redirectStatus === 'failed') {
            setStatus('failed');
          } else {
            setStatus('processing');
          }
          setLoading(false);
          return;
        }

        // If we have an order ID, fetch the order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', Number(orderId))
          .single();

        if (orderError) {
          console.error('Error fetching order:', orderError);
          setStatus('failed');
          setLoading(false);
          return;
        }

        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            services (name)
          `)
          .eq('order_id', Number(orderId));

        if (!itemsError && itemsData) {
          const items = itemsData.map(item => ({
            id: item.id,
            service_id: item.service_id,
            service_name: item.services?.name,
            quantity: item.quantity,
            price_at_order: item.price_at_order
          }));
          
          // Add order_items to the order data object
          const orderWithItems: OrderData = {
            ...orderData,
            order_items: items
          };
          
          // Check if there are any delivery files for this order (for finalized orders)
          if (orderData.status === 'Finalizado') {
            const { data: filesData } = await supabase
              .functions
              .invoke('get-delivery-files', { 
                body: { order_id: Number(orderId) }
              });
            
            if (filesData && filesData.files) {
              orderWithItems.delivery_files = filesData.files;
            }
          }

          setOrder(orderWithItems);
        } else {
          // Even without items, we still set the order data
          setOrder(orderData as OrderData);
        }
        
        // Set status based on order status or redirect_status
        if (redirectStatus === 'succeeded') {
          setStatus('success');
        } else if (redirectStatus === 'failed') {
          setStatus('failed');
        } else {
          setStatus('processing');
        }
      } catch (err) {
        console.error('Error in payment confirmation:', err);
        setStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, redirectStatus]);

  // Render based on whether we have order data
  const renderContent = () => {
    if (!order) {
      // Generic payment result without order context
      if (status === 'processing') {
        return (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 size={64} className="text-green-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Processando Pagamento</h1>
            <p className="text-gray-600 mb-6">
              Estamos processando seu pagamento. Por favor, aguarde um momento...
            </p>
          </div>
        );
      } else if (status === 'success') {
        return (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={64} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Pagamento Confirmado!</h1>
            <p className="text-gray-600 mb-6">
              Seu pagamento foi processado com sucesso. Obrigado pela sua compra!
            </p>
          </div>
        );
      } else {
        return (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle size={64} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Falha no Pagamento</h1>
            <p className="text-gray-600 mb-6">
              Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente ou entre em contato com o suporte.
            </p>
          </div>
        );
      }
    }

    // Order-specific content
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold mb-2">Pedido #{order!.id}</h1>
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span 
              className={`px-2 py-0.5 rounded-full text-sm ${
                order!.status === 'Finalizado' 
                  ? 'bg-green-100 text-green-800' 
                  : order!.status === 'Pagamento Inicial Realizado' 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {order!.status}
            </span>
          </div>
        </div>

        {/* Order items */}
        {order!.order_items && order!.order_items.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Serviços</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {order!.order_items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.service_name}</p>
                    <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.price_at_order)}</p>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 flex justify-between">
                <p className="font-semibold">Total</p>
                <p className="font-semibold text-green-700">{formatCurrency(order!.total_price)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment section based on status */}
        {order!.status === 'Pendente' && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Pagamento Inicial</h2>
            <StripePaymentForm 
              orderId={order!.id} 
              paymentType="initial" 
            />
          </div>
        )}

        {order!.status === 'Pagamento Inicial Realizado' && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Pagamento Final</h2>
            <StripePaymentForm 
              orderId={order!.id} 
              paymentType="final" 
            />
          </div>
        )}

        {/* Delivery files section for completed orders */}
        {order!.status === 'Finalizado' && order!.delivery_files && order!.delivery_files.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Arquivos Entregues</h2>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="mb-4 text-green-700">
                Seu projeto foi concluído! Você pode baixar os arquivos abaixo:
              </p>
              <div className="space-y-3">
                {order!.delivery_files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                    <span>{file.name}</span>
                    <a 
                      href={file.url} 
                      download 
                      className="flex items-center text-green-600 hover:text-green-800"
                    >
                      <FileDown size={18} className="mr-1" />
                      Baixar
                    </a>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Estes links expiram em 7 dias. Por favor, baixe seus arquivos antes disso.
              </p>
            </div>
          </div>
        )}

        {/* Delivery message for completed orders without files */}
        {order!.status === 'Finalizado' && (!order!.delivery_files || order!.delivery_files.length === 0) && (
          <div className="mt-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Projeto Concluído</h2>
              <p className="text-green-700">
                Seu projeto foi concluído! Entraremos em contato em breve para agendar a entrega ou para fornecer mais informações.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={48} className="text-green-600 animate-spin" />
            </div>
          ) : (
            <>
              {renderContent()}
              
              <div className="mt-8 flex flex-col gap-3">
                <Button 
                  onClick={() => navigate('/')} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Voltar para a Página Inicial
                </Button>
                {status === 'failed' && (
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/servicos')}
                  >
                    Tentar Novamente
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentConfirmation;
