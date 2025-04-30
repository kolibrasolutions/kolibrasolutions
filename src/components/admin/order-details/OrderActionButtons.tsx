
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

type OrderActionButtonsProps = {
  orderId: number;
  orderStatus: string;
  hasInitialPayment: boolean;
  hasFinalPayment: boolean;
  onDelete: () => void;
  onStatusUpdate: (status: string) => void;
  onManualPayment: (paymentType: 'initial' | 'final') => void;
  canDelete: boolean;
};

export const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  orderStatus,
  hasInitialPayment,
  hasFinalPayment,
  onDelete,
  onStatusUpdate,
  onManualPayment,
  canDelete,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-between">
      {/* Left side: Delete button */}
      {canDelete && (
        <Button 
          variant="destructive"
          onClick={onDelete}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Excluir Pedido
        </Button>
      )}
      
      {/* Right side: Status update buttons */}
      <div className="flex flex-wrap gap-2">
        {orderStatus === 'Pendente' && (
          <Button 
            onClick={() => onStatusUpdate('Aceito')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Aceitar Pedido
          </Button>
        )}
        
        {orderStatus === 'Aceito' && !hasInitialPayment && (
          <Button
            onClick={() => onManualPayment('initial')}
            className="bg-green-500 hover:bg-green-600"
          >
            Registrar Pagamento Inicial Manual
          </Button>
        )}
        
        {orderStatus === 'Aceito' && (
          <Button 
            onClick={() => onStatusUpdate('Em Andamento')}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Iniciar Trabalho
          </Button>
        )}
        
        {orderStatus === 'Em Andamento' && (
          <Button 
            onClick={() => onStatusUpdate('Finalizado')}
            className="bg-green-500 hover:bg-green-600"
          >
            Finalizar Pedido
          </Button>
        )}
        
        {orderStatus === 'Finalizado' && !hasFinalPayment && (
          <Button
            onClick={() => onManualPayment('final')}
            className="bg-green-500 hover:bg-green-600"
          >
            Registrar Pagamento Final Manual
          </Button>
        )}
      </div>
    </div>
  );
};
