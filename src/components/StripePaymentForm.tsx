
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/integrations/stripe/stripe-client';
import { CheckoutForm } from '@/components/stripe/CheckoutForm';
import { PaymentStateManager } from '@/components/stripe/PaymentStateManager';
import { usePaymentIntent } from '@/hooks/usePaymentIntent';

interface PaymentFormProps {
  orderId: number;
  paymentType: 'initial' | 'final';
  amount?: number;
  priceId?: string;
  onSuccess?: () => void;
}

export const StripePaymentForm = ({ orderId, paymentType, amount, priceId, onSuccess }: PaymentFormProps) => {
  const {
    clientSecret,
    error,
    isLoading,
    apiResponse,
    handleRetry
  } = usePaymentIntent({ orderId, paymentType, amount, priceId });

  const options = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#10b981',
      },
    },
  } : undefined;

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">
        {paymentType === 'initial' ? 'Pagamento Inicial' : 'Pagamento Final'}
      </h2>
      
      <PaymentStateManager
        apiResponse={apiResponse}
        error={error}
        isLoading={isLoading}
        onRetry={handleRetry}
      >
        {clientSecret && options && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm onSuccess={onSuccess} />
          </Elements>
        )}
      </PaymentStateManager>
    </div>
  );
};
