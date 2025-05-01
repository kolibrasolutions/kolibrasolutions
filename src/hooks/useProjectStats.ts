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
        console.log("Iniciando busca de estatísticas...");
        setLoading(true);
        
        // Buscar pedidos finalizados e não deletados
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id')
          .eq('status', 'Finalizado')
          .is('deleted_at', null);
        
        if (ordersError) {
          console.error("Erro ao buscar pedidos:", ordersError);
          throw ordersError;
        }

        const totalProjects = orders?.length || 0;
        console.log("Total de projetos finalizados:", totalProjects);
        
        // Buscar avaliações de pedidos não deletados
        const { data: ratings, error: ratingsError } = await supabase
          .from('project_ratings')
          .select('rating, comment, order_id')
          .not('order_id', 'is', null);
        
        if (ratingsError) {
          console.error("Erro ao buscar avaliações:", ratingsError);
          throw ratingsError;
        }

        // Filtrar avaliações apenas de pedidos ativos
        const activeRatings = ratings?.filter(rating => {
          const orderExists = orders?.some(order => order.id === rating.order_id);
          return orderExists;
        }) || [];
        
        console.log("Avaliações de pedidos ativos:", activeRatings);
        
        // Calculate stats if there are ratings
        let satisfactionRate = null;
        let averageRating = null;
        let hasRatings = false;
        
        if (activeRatings.length > 0) {
          hasRatings = true;
          
          // Calculate average rating
          const totalRating = activeRatings.reduce((sum, item) => sum + item.rating, 0);
          averageRating = totalRating / activeRatings.length;
          
          // Calculate satisfaction rate (ratings >= 4 are considered satisfied)
          const satisfiedCount = activeRatings.filter(item => item.rating >= 4).length;
          satisfactionRate = (satisfiedCount / activeRatings.length) * 100;
        }
        
        const newStats = {
          totalProjects,
          satisfactionRate: hasRatings ? Math.round(satisfactionRate!) : null,
          averageRating: hasRatings ? parseFloat(averageRating!.toFixed(1)) : null,
          hasRatings
        };
        
        console.log("Estatísticas calculadas:", newStats);
        setStats(newStats);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return { stats, loading };
};
