
import { useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import { BlogPost } from '@/types/blog';
import { useImageUpload } from './hooks/useImageUpload';
import { usePostSave } from './hooks/usePostSave';
import { usePostFormState } from './hooks/usePostFormState';

export const usePostForm = (post: BlogPost | null, onSuccess: () => void) => {
  // Use our smaller hooks
  const { user } = useAuth();
  const imageUpload = useImageUpload();
  const postSave = usePostSave();
  const formState = usePostFormState(post);
  
  // Initialize the image URL when the post changes
  if (post?.image_url !== undefined && imageUpload.imageUrl !== post?.image_url) {
    imageUpload.resetImageState(post?.image_url);
  }
  
  // Combined error message from both operations
  const errorMessage = imageUpload.errorMessage || postSave.errorMessage;
  
  // Combined progress from both operations
  const progress = imageUpload.uploading ? imageUpload.progress : postSave.progress;
  
  // Save blog post (create or update)
  const handleSave = async () => {
    // Validate required fields
    if (!formState.isFormValid()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Ensure user is authenticated
    if (!user) {
      toast.error('You need to be authenticated to create or edit posts');
      return;
    }
    
    // Reset errors
    imageUpload.setErrorMessage('');
    postSave.setErrorMessage('');
    
    // Upload image first if present
    let finalImageUrl = imageUpload.imageUrl;
    if (imageUpload.imageFile) {
      finalImageUrl = await imageUpload.uploadImage();
      if (!finalImageUrl && imageUpload.imageFile) {
        return; // If upload failed and there was a file, abort saving
      }
    }
    
    // Create or update post
    const success = await postSave.savePost(
      post?.id || null,
      {
        title: formState.title,
        subtitle: formState.subtitle || null,
        content: formState.content,
        image_url: finalImageUrl,
        published: formState.published,
      },
      user.id
    );
    
    if (success) {
      onSuccess();
    }
  };
  
  // Cancel ongoing operations
  const cancelOperation = () => {
    imageUpload.cancelOperation();
    postSave.cancelOperation();
  };
  
  return {
    // Form state properties
    title: formState.title,
    setTitle: formState.setTitle,
    subtitle: formState.subtitle,
    setSubtitle: formState.setSubtitle,
    content: formState.content,
    setContent: formState.setContent,
    published: formState.published,
    setPublished: formState.setPublished,
    
    // Image properties
    imageUrl: imageUpload.imageUrl,
    imageFile: imageUpload.imageFile,
    handleImageChange: imageUpload.handleImageChange,
    
    // Operation state
    uploading: imageUpload.uploading,
    saving: postSave.saving,
    progress,
    errorMessage,
    
    // Actions
    handleSave,
    cancelOperation
  };
};
