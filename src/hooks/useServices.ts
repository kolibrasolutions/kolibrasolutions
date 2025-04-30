
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('category');
          
        if (error) throw error;

        setServices(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map(service => service.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Não foi possível carregar os serviços. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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
