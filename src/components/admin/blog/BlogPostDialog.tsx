
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPostForm } from './BlogPostForm';
import { usePostForm } from './usePostForm';
import { BlogPost } from '@/types/blog';
import { DialogContentHeader } from './dialog/DialogContentHeader';
import { DialogErrorMessage } from './dialog/DialogErrorMessage';
import { ProgressIndicator } from './dialog/ProgressIndicator';
import { DialogFooterActions } from './dialog/DialogFooterActions';
import { ContentSizeAnalyzer } from './dialog/ContentSizeAnalyzer';

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
  
  // Analyze content size for appropriate UI feedback
  const { contentWarning, isLargeContent, isVeryLargeContent } = ContentSizeAnalyzer({ content });
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{post ? 'Editar Postagem' : 'Nova Postagem'}</DialogTitle>
          <DialogContentHeader 
            isEditing={!!post} 
            contentWarning={contentWarning} 
          />
        </DialogHeader>
        
        <DialogErrorMessage message={errorMessage} />
        
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
          <ProgressIndicator 
            progress={progress}
            uploading={uploading}
            saving={saving}
            isLargeContent={isLargeContent}
            isVeryLargeContent={isVeryLargeContent}
          />
        )}
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <DialogFooterActions
            post={post}
            saving={saving}
            uploading={uploading}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            onCancelOperation={cancelOperation}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
