
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPostForm } from './BlogPostForm';
import { usePostForm } from './usePostForm';
import { Progress } from '@/components/ui/progress';

type BlogPost = {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
};

type BlogPostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  onSuccess: () => void;
};

export const BlogPostDialog = ({ open, onOpenChange, post, onSuccess }: BlogPostDialogProps) => {
  const {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    content,
    setContent,
    published,
    setPublished,
    imageUrl,
    saving,
    uploading,
    handleImageChange,
    handleSave
  } = usePostForm(post, () => {
    // Wrap onSuccess in a setTimeout to let React update the UI before closing
    setTimeout(() => {
      onSuccess();
      onOpenChange(false);
    }, 100);
  });
  
  // Handle dialog close when saving/uploading to prevent closing during operations
  const handleOpenChange = (newOpen: boolean) => {
    if (saving || uploading) {
      return; // Prevent closing while operations are in progress
    }
    onOpenChange(newOpen);
  };
  
  // Calcular tamanho do conteúdo aproximadamente
  const contentSize = content ? Math.min((content.length / 2000000) * 100, 100) : 0;
  const isLargeContent = contentSize > 50;
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{post ? 'Editar Postagem' : 'Nova Postagem'}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {post ? 'editar a' : 'criar uma nova'} postagem.
            {isLargeContent && (
              <span className="block text-amber-600 mt-1">
                Atenção: Seu texto é extenso. Postagens grandes podem levar mais tempo para serem salvas.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <BlogPostForm
            title={title}
            setTitle={setTitle}
            subtitle={subtitle || ''}
            setSubtitle={setSubtitle}
            content={content}
            setContent={setContent}
            published={published}
            setPublished={setPublished}
            imageUrl={imageUrl}
            handleImageChange={handleImageChange}
            disabled={saving || uploading}
          />
        </ScrollArea>
        
        {(saving || uploading) && (
          <div className="py-2">
            <Progress value={saving ? 75 : 30} className="h-2 mb-2" />
            <p className="text-sm text-center text-muted-foreground">
              {uploading ? 'Enviando imagem...' : 'Salvando postagem...'}
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Isso pode levar até 2 minutos para conteúdos grandes
            </p>
          </div>
        )}
        
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
            {post ? 'Atualizar' : 'Criar'} Postagem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
