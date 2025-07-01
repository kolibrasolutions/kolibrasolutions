import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { ServiceRequestDialog, ServiceRequestData } from '@/components/services/ServiceRequestDialog';
import { submitServiceRequest } from '@/services/serviceRequestService';
import { ServicePackage } from '@/types/orders';
import { useServices } from '@/hooks/useServices';
import ServiceCard from '@/components/services/ServiceCard';
import FeaturedBanner from '@/components/services/FeaturedBanner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from 'lucide-react';

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { servicesByCategory, loading, error } = useServices();
  const [selectedService, setSelectedService] = useState<ServicePackage | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  const handleServiceRequest = (service: ServicePackage) => {
    if (!user) {
      navigate('/login?returnUrl=/servicos');
      return;
    }
    
    setSelectedService(service);
    setRequestDialogOpen(true);
  };

  const handleSubmitRequest = async (requestData: ServiceRequestData) => {
    if (!user) return;
    
    const success = await submitServiceRequest(requestData, user.id);
    if (success) {
      setRequestDialogOpen(false);
      setSelectedService(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-kolibra-blue mb-6">Nossos Serviços</h1>
        
        <FeaturedBanner />

        {loading ? (
          <div className="space-y-6">
            <div className="py-4 px-3 bg-gray-100 rounded-lg mb-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="py-4 px-3 bg-gray-100 rounded-lg mb-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 border border-red-200 rounded-lg bg-red-50">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
            <div className="text-red-600 mb-2 text-lg font-semibold">Erro ao carregar serviços</div>
            <p className="text-gray-600">{error}</p>
            <p className="mt-4 text-sm text-gray-500">Por favor, tente novamente mais tarde ou entre em contato com o suporte.</p>
          </div>
        ) : !servicesByCategory || servicesByCategory.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-gray-600 mb-2 text-lg">Nenhum serviço disponível</div>
            <p className="text-gray-500">No momento não há serviços cadastrados.</p>
          </div>
        ) : (
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
                          onRequestQuote={handleServiceRequest}
                          isLoggedIn={!!user}
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
        )}

        {/* Service Request Dialog */}
        <ServiceRequestDialog
          service={selectedService}
          open={requestDialogOpen}
          onOpenChange={setRequestDialogOpen}
          onSubmit={handleSubmitRequest}
        />
      </div>
    </Layout>
  );
};

export default Services;
