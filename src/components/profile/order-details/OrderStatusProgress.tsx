
import React from 'react';

type OrderStatusProgressProps = {
  status: string;
};

const OrderStatusProgress: React.FC<OrderStatusProgressProps> = ({ status }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Status do Pedido</h3>
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="relative flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status !== 'Pendente' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <div className="ml-4">
            <p className="font-semibold">Pedido Recebido</p>
            <p className="text-sm text-gray-500">Aguardando confirmação</p>
          </div>
        </div>
        
        <div className="relative flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['Aceito', 'Pagamento Inicial Realizado', 'Em Andamento', 'Finalizado'].includes(status) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <div className="ml-4">
            <p className="font-semibold">Pedido Aceito</p>
            <p className="text-sm text-gray-500">Aguardando pagamento inicial</p>
          </div>
        </div>
        
        <div className="relative flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['Pagamento Inicial Realizado', 'Em Andamento', 'Finalizado'].includes(status) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <div className="ml-4">
            <p className="font-semibold">Pagamento Inicial</p>
            <p className="text-sm text-gray-500">20% do valor pago</p>
          </div>
        </div>
        
        <div className="relative flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['Em Andamento', 'Finalizado'].includes(status) ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
            4
          </div>
          <div className="ml-4">
            <p className="font-semibold">Em Andamento</p>
            <p className="text-sm text-gray-500">Trabalhando no seu pedido</p>
          </div>
        </div>
        
        <div className="relative flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'Finalizado' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
            5
          </div>
          <div className="ml-4">
            <p className="font-semibold">Finalizado</p>
            <p className="text-sm text-gray-500">Pedido concluído</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusProgress;
