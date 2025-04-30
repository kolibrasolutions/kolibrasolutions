
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PortfolioProjectForm } from './PortfolioProjectForm';
import { useProjectForm } from './useProjectForm';

type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  images: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

type PortfolioProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: PortfolioProject | null;
  onSuccess: () => void;
};

export const PortfolioProjectDialog = ({ open, onOpenChange, project, onSuccess }: PortfolioProjectDialogProps) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    published,
    setPublished,
    currentImages,
    saving,
    uploading,
    handleImagesChange,
    removeImage,
    handleSave
  } = useProjectForm(project, onSuccess);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{project ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <PortfolioProjectForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            published={published}
            setPublished={setPublished}
            currentImages={currentImages}
            handleImagesChange={handleImagesChange}
            removeImage={removeImage}
          />
        </ScrollArea>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={saving || uploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving || uploading}
          >
            {(saving || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? 'Atualizar' : 'Criar'} Projeto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
