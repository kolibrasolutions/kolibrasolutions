import React from 'react';
import { ServicePackage } from '@/types/orders';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Package } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface ServiceCardProps {
  service: ServicePackage;
  onRequestQuote: (service: ServicePackage) => void;
  isLoggedIn: boolean;
}

const ServiceCard = ({ service, onRequestQuote, isLoggedIn }: ServiceCardProps) => {
  return (
    <div className="border border-gray-200 rounded-md p-4 transition-all duration-300 hover:shadow-lg hover:scale-102 hover:border-kolibra-orange">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg">{service.name}</h3>
            {service.is_package && (
              <Badge variant="secondary" className="text-xs">
                <Package className="w-3 h-3 mr-1" />
                Pacote
              </Badge>
            )}
          </div>
          
          <p className="text-gray-700 mt-1 mb-3">{service.description}</p>
          
          {/* Itens do Pacote */}
          {service.package_items && service.package_items.length > 0 && (
            <div className="mt-2 mb-3">
              <p className="text-sm font-medium text-gray-600 mb-1">Inclui:</p>
              <ul className="text-sm text-gray-500 space-y-1">
                {service.package_items.slice(0, 3).map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1 h-1 bg-kolibra-orange rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
                {service.package_items.length > 3 && (
                  <li className="text-xs text-gray-400">
                    +{service.package_items.length - 3} outros itens...
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* Prazo Estimado */}
          {service.estimated_delivery_days && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock className="w-4 h-4 mr-1" />
              Prazo estimado: {service.estimated_delivery_days} dias
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end justify-between">
          {/* Preço ou Orçamento */}
          <div className="text-right mb-3">
            {service.price ? (
              <div>
                <span className="text-sm text-gray-500">A partir de</span>
                <div className="font-bold text-kolibra-orange text-lg">
                  {formatCurrency(service.price)}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-sm text-gray-500">Orçamento</span>
                <div className="font-bold text-kolibra-blue">
                  Sob consulta
                </div>
              </div>
            )}
          </div>
          
          {/* Botão de Ação */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-kolibra-orange text-kolibra-orange hover:bg-kolibra-orange hover:text-white transition-all duration-300"
                  onClick={() => onRequestQuote(service)}
                  disabled={!isLoggedIn}
                >
                  <MessageSquare size={16} className="mr-1" />
                  {isLoggedIn ? 'Solicitar' : 'Faça Login'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isLoggedIn 
                    ? 'Solicitar orçamento personalizado' 
                    : 'Faça login para solicitar orçamento'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
