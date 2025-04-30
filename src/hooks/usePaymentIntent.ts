
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface PaymentIntentProps {
  orderId: number;
  paymentType: 'initial' | 'final';
  amount?: number;
  priceId?: string;
}

export const usePaymentIntent = ({ orderId, paymentType, amount, priceId }: PaymentIntentProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      console.log(`Creating payment intent for order #${orderId}, type: ${paymentType}, priceId: ${priceId || 'N/A'}, amount: ${amount || 'N/A'}`);
      
      const requestData = { 
        order_id: orderId, 
        payment_type: paymentType,
        price_id: priceId,
        amount: amount
      };
      
      console.log("Sending request data:", JSON.stringify(requestData));
      
      const { data, error: invokeError } = await supabase.functions.invoke('create-payment-intent', {
        body: requestData
      });

      console.log("Payment intent response:", data, invokeError);
      setApiResponse(data);

      if (invokeError) {
        console.error('Error invoking edge function:', invokeError);
        setError(`Não foi possível iniciar o processo de pagamento: ${invokeError.message || 'Erro de conexão'}`);
        toast.error("Erro", {
          description: `Não foi possível iniciar o pagamento: ${invokeError.message || 'Erro de conexão'}`
        });
        return;
      }

      if (data.error) {
        console.error('Server error creating payment intent:', data.error);
        let errorMessage = `Erro do servidor: ${data.error}`;
        
        if (data.details) {
          console.error('Error details:', data.details);
          errorMessage += ` - ${data.details}`;
          
          // Specific error handling for common issues
          if (data.details.includes('secret key')) {
            errorMessage += " - Erro de configuração do Stripe. Por favor, contate o suporte.";
          }
        }
        
        if (data.code) {
          errorMessage += ` (Código: ${data.code})`;
        }
        
        setError(errorMessage);
        toast.error("Erro do servidor", {
          description: data.error
        });
        return;
      }

      if (data.clientSecret) {
        console.log("Client secret obtained successfully");
        setClientSecret(data.clientSecret);
      } else {
        setError('A resposta do servidor não contém o client secret necessário.');
        console.error('Missing client secret in response', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.');
      toast.error("Erro", {
        description: "Ocorreu um erro inesperado"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    createPaymentIntent();
  }, [orderId, paymentType, amount, priceId, retryCount]);

  const handleRetry = () => {
    setError(null);
    setApiResponse(null);
    setRetryCount(prev => prev + 1);
  };

  return {
    clientSecret,
    error,
    isLoading,
    apiResponse,
    handleRetry
  };
};
