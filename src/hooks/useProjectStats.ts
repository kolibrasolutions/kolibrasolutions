
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ProjectStats = {
  totalProjects: number;
  satisfactionRate: number;
  averageRating: number;
};

export const useProjectStats = () => {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    satisfactionRate: 0,
    averageRating: 0
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
      let averageRating = 5.0; // Valor padrão se não houver avaliações
      let satisfactionRate = 100; // Valor padrão se não houver avaliações

      if (ratingsData && ratingsData.length > 0) {
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
        averageRating
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
