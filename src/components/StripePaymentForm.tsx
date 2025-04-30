
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe("pk_test_YOUR_STRIPE_PUBLISHABLE_KEY");

interface PaymentFormProps {
  orderId: number;
  paymentType: 'initial' | 'final';
  onSuccess?: () => void;
}

const CheckoutForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
      });

      if (error) {
        toast({
          title: "Erro no pagamento",
          description: error.message || "Ocorreu um erro ao processar o pagamento.",
          variant: "destructive"
        });
      } else {
        // Stripe will redirect to return_url if successful
        // We'll handle redirect in onSuccess
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro inesperado ao processar o pagamento.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
      >
        {isLoading ? "Processando..." : "Pagar Agora"}
      </Button>
    </form>
  );
};

export const StripePaymentForm = ({ orderId, paymentType, onSuccess }: PaymentFormProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { order_id: orderId, payment_type: paymentType }
        });

        if (error) {
          console.error('Error creating payment intent:', error);
          setError('Não foi possível iniciar o processo de pagamento. Por favor, tente novamente mais tarde.');
          toast({
            title: "Erro",
            description: "Não foi possível iniciar o pagamento",
            variant: "destructive"
          });
          return;
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError('A resposta do servidor não contém o client secret necessário.');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.');
        toast({
          title: "Erro",
          description: "Ocorreu um erro inesperado",
          variant: "destructive"
        });
      }
    };

    createPaymentIntent();
  }, [orderId, paymentType]);

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded text-red-700">
        <h3 className="font-semibold">Erro no processamento de pagamento</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#10b981',
      },
    },
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">
        {paymentType === 'initial' ? 'Pagamento Inicial' : 'Pagamento Final'}
      </h2>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm onSuccess={onSuccess} />
      </Elements>
    </div>
  );
};
