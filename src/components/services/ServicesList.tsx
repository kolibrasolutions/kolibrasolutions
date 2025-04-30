
import React from 'react';
import { Service } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ServiceCard from './ServiceCard';

interface ServicesListProps {
  servicesByCategory: { category: string; items: Service[] }[];
  loading: boolean;
  error: string | null;
  onAddToCart: (service: Service) => void;
}

const ServicesList = ({ servicesByCategory, loading, error, onAddToCart }: ServicesListProps) => {
  if (loading) {
    return <div className="text-center py-12">Carregando serviços...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {servicesByCategory.map((categoryGroup, index) => (
        <AccordionItem key={index} value={`category-${index}`}>
          <AccordionTrigger className="text-xl font-medium text-kolibra-blue">
            {categoryGroup.category}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {categoryGroup.items.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onAddToCart={onAddToCart} 
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ServicesList;
