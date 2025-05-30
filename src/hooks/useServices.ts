
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types';
import { toast } from '@/components/ui/sonner';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching
        
        // Add slight delay to ensure UI shows loading state
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { data, error: fetchError } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('category');
          
        if (fetchError) throw fetchError;
        
        if (isMounted) {
          console.log('Services fetched successfully:', data);
          // Make sure component is still mounted before updating state
          // Convert API response to match our Service type (name -> title)
          const formattedServices = data?.map(service => ({
            ...service,
            title: service.name, // Map name to title for compatibility
          })) || [];
          
          setServices(formattedServices);
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set((formattedServices || []).map(service => service.category)));
          setCategories(uniqueCategories as string[]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        
        if (isMounted) {
          setError('Não foi possível carregar os serviços. Por favor, tente novamente mais tarde.');
          toast.error("Erro ao carregar serviços", {
            description: "Houve um problema ao conectar com o servidor. Tente novamente mais tarde."
          });
          // Set empty arrays to prevent undefined errors
          setServices([]);
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Group services by category
  const servicesByCategory = categories.map(category => ({
    category,
    items: services.filter(service => service.category === category)
  }));

  return {
    services,
    categories,
    servicesByCategory,
    loading,
    error
  };
};
