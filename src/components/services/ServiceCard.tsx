
import React from 'react';
import { Service } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface ServiceCardProps {
  service: Service;
  onAddToCart: (service: Service) => void;
}

const ServiceCard = ({ service, onAddToCart }: ServiceCardProps) => {
  const initialPayment = service.price * 0.2;
  const finalPayment = service.price * 0.8;

  return (
    <div className="border border-gray-200 rounded-md p-4 transition-all duration-300 hover:shadow-lg hover:scale-102 hover:border-kolibra-orange">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold text-lg">{service.name}</h3>
          <p className="text-gray-700 mt-1">{service.description}</p>
          
          <div className="mt-2 text-sm text-gray-500">
            <p>Pagamento em duas etapas:</p>
            <p>• Inicial (20%): {formatCurrency(initialPayment)}</p>
            <p>• Final (80%): {formatCurrency(finalPayment)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold text-kolibra-orange">{formatCurrency(service.price)}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 border-kolibra-orange text-kolibra-orange hover:bg-kolibra-orange hover:text-white transition-all duration-300"
                  onClick={() => onAddToCart(service)}
                >
                  <Plus size={16} className="mr-1" /> Adicionar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adicionar ao carrinho</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
