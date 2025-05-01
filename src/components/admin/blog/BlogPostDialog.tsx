import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPostForm } from './BlogPostForm';
import { usePostForm } from './usePostForm';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BlogPost } from '@/types/blog';

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
    progress,
    errorMessage,
    handleImageChange,
    handleSave,
    cancelOperation
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
  
  // Calcular tamanho do conteúdo aproximadamente para dar feedbacks visuais apropriados
  const contentSize = content ? Math.min((content.length / 200000) * 100, 100) : 0;
  const isLargeContent = contentSize > 20;
  const isVeryLargeContent = contentSize > 50;

  // Fornecer mensagens de aviso adequadas ao tamanho do conteúdo
  const getContentSizeWarning = () => {
    if (isVeryLargeContent) {
      return "Conteúdo muito extenso! O salvamento pode demorar vários minutos ou falhar. Considere dividir em múltiplas postagens.";
    } else if (isLargeContent) {
      return "Conteúdo extenso. O salvamento pode demorar um pouco mais.";
    }
    return null;
  };
  
  const contentWarning = getContentSizeWarning();
  
  // Determinar a melhor descrição para o progresso
  const getProgressDescription = () => {
    if (uploading) {
      if (progress < 30) return "Otimizando imagem...";
      if (progress < 80) return "Enviando imagem...";
      return "Finalizando upload...";
    }
    
    if (saving) {
      if (progress < 40) return "Iniciando salvamento...";
      if (progress < 60) return "Processando dados...";
      if (progress < 90) return "Salvando no banco de dados...";
      return "Finalizando...";
    }
    
    return "";
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{post ? 'Editar Postagem' : 'Nova Postagem'}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {post ? 'editar a' : 'criar uma nova'} postagem.
            {contentWarning && (
              <span className={`block mt-1 ${isVeryLargeContent ? 'text-amber-600 font-semibold' : 'text-amber-500'}`}>
                ⚠️ {contentWarning}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
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
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {getProgressDescription()}
              </p>
              <p className="text-sm font-medium">
                {progress}%
              </p>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-1">
              {isVeryLargeContent ? 'Conteúdos muito grandes podem levar até 10 minutos' : 
               isLargeContent ? 'Conteúdos grandes podem levar até 2 minutos' : 
               'Isso pode levar alguns instantes'}
            </p>
          </div>
        )}
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex gap-2">
            {(saving || uploading) && (
              <Button 
                variant="destructive" 
                onClick={cancelOperation}
                className="w-full sm:w-auto"
              >
                Cancelar Operação
              </Button>
            )}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={saving || uploading}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving || uploading}
              className="flex-1 sm:flex-none"
            >
              {(saving || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {post ? 'Atualizar' : 'Criar'} Postagem
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
