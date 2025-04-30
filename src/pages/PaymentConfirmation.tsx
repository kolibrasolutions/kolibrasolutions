
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'success' | 'failed' | 'processing'>('processing');
  const navigate = useNavigate();

  useEffect(() => {
    // Stripe redirects with payment_intent_client_secret and redirect_status parameters
    const redirectStatus = searchParams.get('redirect_status');
    
    if (redirectStatus === 'succeeded') {
      setStatus('success');
    } else if (redirectStatus === 'failed') {
      setStatus('failed');
    } else {
      // If no clear status or other status, we assume it's still processing
      setStatus('processing');
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 max-w-lg">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'processing' && (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 size={64} className="text-green-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Processando Pagamento</h1>
              <p className="text-gray-600 mb-6">
                Estamos processando seu pagamento. Por favor, aguarde um momento...
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle size={64} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Pagamento Confirmado!</h1>
              <p className="text-gray-600 mb-6">
                Seu pagamento foi processado com sucesso. Obrigado pela sua compra!
              </p>
            </>
          )}
          
          {status === 'failed' && (
            <>
              <div className="flex justify-center mb-4">
                <XCircle size={64} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Falha no Pagamento</h1>
              <p className="text-gray-600 mb-6">
                Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente ou entre em contato com o suporte.
              </p>
            </>
          )}
          
          <div className="flex flex-col gap-3">
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
        </div>
      </div>
    </Layout>
  );
};

export default PaymentConfirmation;
