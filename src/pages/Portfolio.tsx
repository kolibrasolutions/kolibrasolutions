
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioProject } from '@/types/orders';
import { Json } from '@/integrations/supabase/types';

const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Convert the Supabase data to match our PortfolioProject type
        const formattedProjects: PortfolioProject[] = data?.map(project => ({
          ...project,
          // Ensure images is always treated as string[]
          images: Array.isArray(project.images) ? project.images : []
        })) || [];
        
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching portfolio projects:', error);
        toast.error('Erro ao carregar projetos do portfólio');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-green-800 mb-6">Nosso Portfólio</h1>
        
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-green-50 p-8 rounded-lg text-center">
            <p className="text-xl text-gray-700">
              Em breve, mostraremos nossos melhores projetos aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const ProjectCard = ({ project }: { project: PortfolioProject }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === project.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="relative h-72 md:h-80 bg-gray-100">
        {project.images && project.images.length > 0 ? (
          <>
            <img 
              src={project.images[currentImageIndex]} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            
            {project.images.length > 1 && (
              <>
                <button 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 text-gray-800"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 text-gray-800"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {project.images.map((_, index) => (
                    <button 
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem imagens
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3">{project.title}</h2>
        <p className="text-gray-700">{project.description}</p>
      </CardContent>
    </Card>
  );
};

export default Portfolio;
