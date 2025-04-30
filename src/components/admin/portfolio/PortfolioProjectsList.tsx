import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Eye, Trash2, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PortfolioProjectDialog } from './PortfolioProjectDialog';
import { PortfolioProject, convertPortfolioProjectImages } from '@/types/orders';
import { Json } from '@/integrations/supabase/types';

export const PortfolioProjectsList = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);
  
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
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
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Projeto excluído com sucesso');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting portfolio project:', error);
      toast.error('Erro ao excluir projeto');
    }
  };
  
  const handlePublishToggle = async (project: PortfolioProject) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ published: !project.published })
        .eq('id', project.id);
      
      if (error) throw error;
      
      toast.success(`Projeto ${project.published ? 'despublicado' : 'publicado'} com sucesso`);
      fetchProjects();
    } catch (error) {
      console.error('Error updating portfolio project:', error);
      toast.error('Erro ao atualizar estado de publicação');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Projetos do Portfólio</h2>
        <Button onClick={() => setCreatingProject(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Novo Projeto</span>
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">Nenhum projeto encontrado</p>
            <Button onClick={() => setCreatingProject(true)}>Criar Primeiro Projeto</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <Card key={project.id} className="overflow-hidden">
              <div className="h-40 bg-gray-100 relative">
                {project.images && project.images.length > 0 ? (
                  <img 
                    src={project.images[0]} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Image className="h-10 w-10 mb-2" />
                    <span>Sem imagens</span>
                  </div>
                )}
                <Badge 
                  className={`absolute top-2 right-2 ${project.published ? 'bg-green-500' : 'bg-gray-500'}`}
                >
                  {project.published ? 'Publicado' : 'Rascunho'}
                </Badge>
                {project.images && project.images.length > 1 && (
                  <Badge className="absolute top-2 left-2 bg-blue-500">
                    {project.images.length} imagens
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1">{project.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Criado há {formatDistanceToNow(new Date(project.created_at), { locale: ptBR, addSuffix: false })}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" size="sm" onClick={() => handlePublishToggle(project)}>
                    {project.published ? 'Despublicar' : 'Publicar'}
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEditingProject(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <PortfolioProjectDialog
        open={creatingProject || !!editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setCreatingProject(false);
            setEditingProject(null);
          }
        }}
        project={editingProject}
        onSuccess={() => {
          setCreatingProject(false);
          setEditingProject(null);
          fetchProjects();
        }}
      />
    </div>
  );
};
