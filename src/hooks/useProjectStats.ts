
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ProjectStats = {
  totalProjects: number;
  satisfactionRate: number | null;
  averageRating: number | null;
  hasRatings: boolean;
};

export const useProjectStats = () => {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    satisfactionRate: null,
    averageRating: null,
    hasRatings: false
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Buscar total de projetos finalizados
      const { count: projectsCount, error: projectsError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Finalizado');

      if (projectsError) throw projectsError;

      // Buscar média de avaliações
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('project_ratings')
        .select('rating');

      if (ratingsError) throw ratingsError;
      
      const totalProjects = projectsCount || 0;
      let averageRating = null; 
      let satisfactionRate = null;
      let hasRatings = false;

      if (ratingsData && ratingsData.length > 0) {
        hasRatings = true;
        
        // Calcular média de avaliações
        const sum = ratingsData.reduce((acc, item) => acc + item.rating, 0);
        averageRating = parseFloat((sum / ratingsData.length).toFixed(1));
        
        // Calcular taxa de satisfação (% de avaliações 4 ou 5 estrelas)
        const highRatings = ratingsData.filter(item => item.rating >= 4).length;
        satisfactionRate = Math.round((highRatings / ratingsData.length) * 100);
      }

      setStats({
        totalProjects,
        satisfactionRate,
        averageRating,
        hasRatings
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refreshStats: fetchStats };
};
