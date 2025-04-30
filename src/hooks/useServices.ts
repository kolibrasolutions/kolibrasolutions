
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
        
        const { data, error: fetchError } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('category');
          
        if (fetchError) throw fetchError;
        
        if (isMounted) {
          // Make sure component is still mounted before updating state
          setServices(data || []);
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set((data || []).map(service => service.category)));
          setCategories(uniqueCategories);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        
        if (isMounted) {
          setError('Não foi possível carregar os serviços. Por favor, tente novamente mais tarde.');
          toast("Erro ao carregar serviços", {
            description: "Houve um problema ao conectar com o servidor. Tente novamente mais tarde.",
            variant: "destructive"
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
