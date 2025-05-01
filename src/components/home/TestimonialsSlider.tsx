
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  id: string;
  comment: string | null;
  rating: number;
  user_name: string | null;
};

const TestimonialsSlider = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        
        // Buscar avaliações juntamente com nomes de usuários
        const { data, error } = await supabase
          .from('project_ratings')
          .select(`
            id, 
            comment, 
            rating,
            user_id,
            orders!inner(id),
            users:user_id(full_name)
          `)
          .not('comment', 'is', null)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching testimonials:", error);
          throw error;
        }

        // Processar os dados para extrair os nomes dos usuários
        const processedData = data?.map(item => ({
          id: item.id,
          comment: item.comment,
          rating: item.rating,
          user_name: item.users?.full_name || 'Cliente'
        })) || [];

        console.log("Testimonials with user names:", processedData);
        setTestimonials(processedData);
      } catch (error) {
        console.error("Error in testimonials fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="w-8 h-8 mx-auto border-4 border-kolibra-orange border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-500">Carregando depoimentos...</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="py-10">
      <h3 className="text-2xl font-bold text-center mb-6">O que nossos clientes dizem</h3>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/1 lg:basis-1/1">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="text-center italic text-gray-700 mb-4">
                      "{testimonial.comment}"
                    </blockquote>
                    <p className="font-semibold text-kolibra-blue">- {testimonial.user_name}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative static" />
          <CarouselNext className="relative static" />
        </div>
      </Carousel>
    </div>
  );
};

export default TestimonialsSlider;
