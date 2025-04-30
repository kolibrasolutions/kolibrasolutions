
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
import { Alert, AlertDescription } from '@/components/ui/alert';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51OvlGMDJBU0mQ1ud1Clz6qb7F5JgjOVPEx3c7OIkb7W519pngt6ZCC5IiFoTfWGsaKUwXXsLtvqwpnPSvAsioXTY00LhXpvVPR");

interface PaymentFormProps {
  orderId: number;
  paymentType: 'initial' | 'final';
  amount?: number; // Add the optional amount prop
  priceId?: string; // Add an optional priceId prop for Stripe Checkout
  onSuccess?: () => void;
}

const CheckoutForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) {
      setErrorMessage("Sistema de pagamento não está pronto. Por favor, tente novamente.");
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
        console.error("Payment error:", error);
        setErrorMessage(error.message || "Ocorreu um erro ao processar o pagamento.");
        toast.error("Erro no pagamento", {
          description: error.message || "Ocorreu um erro ao processar o pagamento."
        });
      } else {
        // Stripe will redirect to return_url if successful
        // We'll handle redirect in onSuccess
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      setErrorMessage(error instanceof Error ? error.message : "Ocorreu um erro inesperado ao processar o pagamento.");
      toast.error("Erro no pagamento", {
        description: "Ocorreu um erro inesperado ao processar o pagamento."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
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

export const StripePaymentForm = ({ orderId, paymentType, amount, priceId, onSuccess }: PaymentFormProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        console.log(`Creating payment intent for order #${orderId}, type: ${paymentType}, priceId: ${priceId || 'N/A'}`);
        
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { 
            order_id: orderId, 
            payment_type: paymentType,
            amount: amount, // Pass the amount if provided
            price_id: priceId // Pass the price ID if provided
          }
        });

        console.log("Payment intent response:", data, error);

        if (error) {
          console.error('Error creating payment intent:', error);
          setError(`Não foi possível iniciar o processo de pagamento: ${error.message || 'Erro desconhecido'}`);
          toast.error("Erro", {
            description: `Não foi possível iniciar o pagamento: ${error.message || 'Erro desconhecido'}`
          });
          return;
        }

        if (data.error) {
          console.error('Server error creating payment intent:', data.error);
          setError(`Erro do servidor: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
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

    createPaymentIntent();
  }, [orderId, paymentType, amount, priceId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded text-red-700">
        <h3 className="font-semibold">Erro no processamento de pagamento</h3>
        <p>{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded text-yellow-700">
        <h3 className="font-semibold">Aguardando configuração de pagamento</h3>
        <p>Não foi possível obter as informações de pagamento necessárias.</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-yellow-600 hover:bg-yellow-700"
        >
          Tentar Novamente
        </Button>
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
  } as any; // Type assertion to resolve the TS error

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
