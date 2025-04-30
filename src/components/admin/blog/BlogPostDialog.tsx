
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPostForm } from './BlogPostForm';
import { usePostForm } from './usePostForm';

type BlogPost = {
  id: string;
  title: string;
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
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{post ? 'Editar Postagem' : 'Nova Postagem'}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {post ? 'editar a' : 'criar uma nova'} postagem.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <BlogPostForm
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            published={published}
            setPublished={setPublished}
            imageUrl={imageUrl}
            handleImageChange={handleImageChange}
            disabled={saving || uploading}
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
            {post ? 'Atualizar' : 'Criar'} Postagem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
