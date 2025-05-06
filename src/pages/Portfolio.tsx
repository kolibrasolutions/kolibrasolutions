import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioProject, convertPortfolioProjectImages } from '@/types/orders';
import { RichTextContent } from '@/components/common/RichTextContent';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('portfolio_projects').select('*').eq('published', true).order('created_at', {
          ascending: false
        });
        if (error) throw error;

        // Convert the Supabase data to match our PortfolioProject type
        const formattedProjects = data?.map(project => ({
          ...project,
          // Use the helper function to ensure images is always a string array
          images: convertPortfolioProjectImages(project.images)
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
  
  return <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-kolibra-blue">Nosso Portfólio</h1>
        
        {loading ? <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div> : projects.length === 0 ? <div className="p-8 rounded-lg text-center bg-kolibra-blue">
            <p className="text-xl text-white">
              Em breve, mostraremos nossos melhores projetos aqui.
            </p>
          </div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {projects.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>}
      </div>
    </Layout>;
};

const ProjectCard = ({
  project
}: {
  project: PortfolioProject;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const nextImage = () => {
    setCurrentImageIndex(prevIndex => prevIndex === project.images.length - 1 ? 0 : prevIndex + 1);
  };
  
  const prevImage = () => {
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? project.images.length - 1 : prevIndex - 1);
  };
  
  return <Card className="overflow-hidden">
      <div className="relative bg-gray-100">
        <AspectRatio ratio={16/9}>
          {project.images && project.images.length > 0 ? (
            <img 
              src={project.images[currentImageIndex]} 
              alt={project.title} 
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem imagens
            </div>
          )}
        </AspectRatio>
        
        {project.images && project.images.length > 1 && (
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
                  className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`} 
                  onClick={() => setCurrentImageIndex(index)} 
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3">{project.title}</h2>
        
        <div className={showFullDescription ? '' : 'max-h-32 overflow-hidden relative'}>
          <RichTextContent content={project.description} />
          
          {!showFullDescription && project.description.length > 200 && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>
        
        {project.description.length > 200 && (
          <button 
            onClick={() => setShowFullDescription(!showFullDescription)} 
            className="text-blue-600 text-sm mt-2 hover:underline"
          >
            {showFullDescription ? 'Mostrar menos' : 'Mostrar mais'}
          </button>
        )}
      </CardContent>
    </Card>;
};

export default Portfolio;
