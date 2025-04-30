
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
      // Fetch total number of completed projects (status = 'Finalizado')
      const { count: projectsCount, error: projectsError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Finalizado');

      if (projectsError) throw projectsError;

      // Fetch all ratings data for satisfaction rate and average calculation
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
        
        // Calculate average rating
        const sum = ratingsData.reduce((acc, item) => acc + item.rating, 0);
        averageRating = parseFloat((sum / ratingsData.length).toFixed(1));
        
        // Calculate satisfaction rate (% of ratings that are 4 or 5 stars)
        const highRatings = ratingsData.filter(item => item.rating >= 4).length;
        satisfactionRate = Math.round((highRatings / ratingsData.length) * 100);
      }

      console.log("Stats loaded:", { totalProjects, satisfactionRate, averageRating });
      
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
