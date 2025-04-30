
import React from 'react';
import { Service } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onAddToCart: (service: Service) => void;
}

const ServiceCard = ({ service, onAddToCart }: ServiceCardProps) => {
  return (
    <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold text-lg">{service.name}</h3>
          <p className="text-gray-700 mt-1">{service.description}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold text-kolibra-orange">{formatCurrency(service.price)}</span>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2 border-kolibra-orange text-kolibra-orange hover:bg-kolibra-orange hover:text-white"
            onClick={() => onAddToCart(service)}
          >
            <Plus size={16} className="mr-1" /> Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
