
import React from 'react';
import { Service } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ServiceCard from './ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface ServicesListProps {
  servicesByCategory: { category: string; items: Service[] }[];
  loading: boolean;
  error: string | null;
  onAddToCart: (service: Service) => void;
}

const ServicesList = ({ servicesByCategory, loading, error, onAddToCart }: ServicesListProps) => {
  console.log("ServicesList rendering:", { loading, error, servicesByCategory });
  
  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border border-red-200 rounded-lg bg-red-50">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
        <div className="text-red-600 mb-2 text-lg font-semibold">Erro ao carregar serviços</div>
        <p className="text-gray-600">{error}</p>
        <p className="mt-4 text-sm text-gray-500">Por favor, tente novamente mais tarde ou entre em contato com o suporte.</p>
      </div>
    );
  }

  if (!servicesByCategory || servicesByCategory.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-gray-600 mb-2 text-lg">Nenhum serviço disponível</div>
        <p className="text-gray-500">No momento não há serviços cadastrados.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="category-0">
      {servicesByCategory.map((categoryGroup, index) => (
        <AccordionItem key={index} value={`category-${index}`}>
          <AccordionTrigger className="text-xl font-medium text-kolibra-blue">
            {categoryGroup.category}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {categoryGroup.items.length > 0 ? (
                categoryGroup.items.map(service => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onAddToCart={onAddToCart} 
                  />
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhum serviço disponível nesta categoria.
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ServicesList;
