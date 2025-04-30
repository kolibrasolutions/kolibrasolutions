
import React from 'react';

type OrderStatusStepProps = {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
};

const OrderStatusStep: React.FC<OrderStatusStepProps> = ({
  step,
  title,
  description,
  isCompleted,
}) => {
  return (
    <div className="relative flex items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200'
        }`}
      >
        {step}
      </div>
      <div className="ml-4">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default OrderStatusStep;
