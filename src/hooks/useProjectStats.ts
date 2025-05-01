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
    hasRatings: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching project stats...");
        setLoading(true);
        
        // Get completed projects count - using a public query without RLS restrictions
        const { count: totalProjects, error: countError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Finalizado')
          .is('deleted_at', null);
        
        if (countError) {
          console.error("Error fetching total projects:", countError);
          throw countError;
        }
        
        // Get ratings data - also using a public query
        const { data: ratings, error: ratingsError } = await supabase
          .from('project_ratings')
          .select('rating, comment')
          .is('deleted_at', null);
        
        if (ratingsError) {
          console.error("Error fetching ratings:", ratingsError);
          throw ratingsError;
        }
        
        // Calculate stats if there are ratings
        let satisfactionRate = null;
        let averageRating = null;
        let hasRatings = false;
        
        if (ratings && ratings.length > 0) {
          hasRatings = true;
          
          // Calculate average rating
          const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);
          averageRating = totalRating / ratings.length;
          
          // Calculate satisfaction rate (ratings >= 4 are considered satisfied)
          const satisfiedCount = ratings.filter(item => item.rating >= 4).length;
          satisfactionRate = (satisfiedCount / ratings.length) * 100;
        }
        
        const newStats = {
          totalProjects: totalProjects || 0,
          satisfactionRate: hasRatings ? Math.round(satisfactionRate!) : null,
          averageRating: hasRatings ? parseFloat(averageRating!.toFixed(1)) : null,
          hasRatings
        };
        
        console.log("Stats loaded:", newStats);
        setStats(newStats);
      } catch (error) {
        console.error("Error fetching project stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return { stats, loading, ratings: [] };
};
