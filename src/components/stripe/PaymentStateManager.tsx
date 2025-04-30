
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ApiResponse {
  clientSecret?: string;
  error?: string;
  details?: string;
  code?: string;
}

interface PaymentStateManagerProps {
  apiResponse: ApiResponse | null;
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}

export const PaymentStateManager = ({ 
  apiResponse, 
  error, 
  isLoading, 
  onRetry, 
  children 
}: PaymentStateManagerProps) => {
  
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
        <p className="text-sm mb-2">{error}</p>
        <div className="flex flex-col space-y-2">
          {/* Debug information section */}
          {apiResponse && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
              <p className="font-semibold">Resposta da API (para depuração):</p>
              <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
          
          <Button 
            onClick={onRetry}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!apiResponse?.clientSecret) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded text-yellow-700">
        <h3 className="font-semibold">Aguardando configuração de pagamento</h3>
        <p>Não foi possível obter as informações de pagamento necessárias.</p>
        
        {/* Debug information section */}
        {apiResponse && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <p className="font-semibold">Resposta da API (para depuração):</p>
            <pre className="whitespace-pre-wrap overflow-auto max-h-40">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
        
        <Button 
          onClick={onRetry}
          className="mt-4 bg-yellow-600 hover:bg-yellow-700"
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
