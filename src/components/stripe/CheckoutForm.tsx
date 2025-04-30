
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';

interface CheckoutFormProps {
  onSuccess?: () => void;
}

export const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
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
