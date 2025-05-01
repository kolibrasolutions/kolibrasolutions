
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
        
        // Primeiro, obtemos as avaliações que têm comentários
        const { data: projectRatings, error } = await supabase
          .functions.invoke('get-public-stats', {
            body: { action: 'get-testimonials' }
          });

        if (error) {
          console.error("Erro ao buscar depoimentos:", error);
          throw error;
        }

        if (projectRatings && projectRatings.testimonials) {
          console.log("Depoimentos carregados:", projectRatings.testimonials);
          setTestimonials(projectRatings.testimonials);
        } else {
          console.log("Nenhum depoimento encontrado");
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Erro ao buscar depoimentos:", error);
        setTestimonials([]);
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
                <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-kolibra-orange">
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
                    <p className="font-semibold text-kolibra-blue">- {testimonial.user_name || "Cliente"}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative static transition-all hover:scale-110" />
          <CarouselNext className="relative static transition-all hover:scale-110" />
        </div>
      </Carousel>
    </div>
  );
};

export default TestimonialsSlider;
