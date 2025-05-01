
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Iniciando busca de estatísticas públicas...");

    // Buscar pedidos finalizados
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('status', 'Finalizado');
    
    if (ordersError) {
      console.error("Erro ao buscar pedidos:", ordersError);
      throw ordersError;
    }

    const totalProjects = orders?.length || 0;
    console.log("Total de projetos finalizados:", totalProjects);
    
    // Buscar avaliações de pedidos
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
    
    const stats = {
      totalProjects,
      satisfactionRate: hasRatings ? Math.round(satisfactionRate!) : null,
      averageRating: hasRatings ? parseFloat(averageRating!.toFixed(1)) : null,
      hasRatings
    };

    console.log("Estatísticas públicas calculadas:", stats);
    
    return new Response(
      JSON.stringify(stats),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Erro na função:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});
