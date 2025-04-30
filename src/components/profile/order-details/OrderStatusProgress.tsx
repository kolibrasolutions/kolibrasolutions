
import React from 'react';
import OrderStatusStep from './OrderStatusStep';

type OrderStatusProgressProps = {
  status: string;
};

const OrderStatusProgress: React.FC<OrderStatusProgressProps> = ({ status }) => {
  // Define the steps and their completion logic
  const steps = [
    {
      step: 1,
      title: 'Pedido Recebido',
      description: 'Aguardando confirmação',
      isCompleted: status !== 'Pendente',
    },
    {
      step: 2,
      title: 'Pedido Aceito',
      description: 'Aguardando pagamento inicial',
      isCompleted: ['Aceito', 'Pagamento Inicial Realizado', 'Em Andamento', 'Finalizado'].includes(status),
    },
    {
      step: 3,
      title: 'Pagamento Inicial',
      description: '20% do valor pago',
      isCompleted: ['Pagamento Inicial Realizado', 'Em Andamento', 'Finalizado'].includes(status),
    },
    {
      step: 4,
      title: 'Em Andamento',
      description: 'Trabalhando no seu pedido',
      isCompleted: ['Em Andamento', 'Finalizado'].includes(status),
    },
    {
      step: 5,
      title: 'Finalizado',
      description: 'Pedido concluído',
      isCompleted: status === 'Finalizado',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Status do Pedido</h3>
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        {steps.map((step) => (
          <OrderStatusStep
            key={step.step}
            step={step.step}
            title={step.title}
            description={step.description}
            isCompleted={step.isCompleted}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderStatusProgress;
