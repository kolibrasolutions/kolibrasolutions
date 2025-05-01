
import { useState, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { BlogPostService } from '@/services/blogPostService';

export const usePostSave = () => {
  // State
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Reference for abort controller
  const abortController = useRef<AbortController | null>(null);

  // Save blog post (create or update)
  const savePost = async (
    postId: string | null,
    postData: {
      title: string;
      subtitle: string | null;
      content: string;
      image_url: string | null;
      published: boolean;
    },
    authorId: string
  ): Promise<boolean> => {
    // Reset state
    setErrorMessage('');
    setSaving(true);
    setProgress(40);
    
    // Set up a new AbortController
    abortController.current = new AbortController();
    
    try {
      let success = false;
      
      if (postId) {
        // Update existing post
        setProgress(60);
        success = await BlogPostService.updatePost(
          postId,
          postData,
          abortController
        );
        setProgress(100);
        if (success) {
          toast.success('Post updated successfully');
        }
      } else {
        // Create new post
        setProgress(60);
        success = await BlogPostService.createPost(
          postData,
          authorId,
          abortController
        );
        setProgress(100);
        if (success) {
          toast.success('Post created successfully');
        }
      }
      
      return success;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Save aborted by timeout');
        setErrorMessage('The save took too long and was canceled. Try shorter content or split into multiple posts.');
        toast.error('Time limit exceeded when saving post. Try shorter content.');
      } else {
        console.error('Error saving blog post:', error);
        setErrorMessage(`Error saving post: ${error.message || 'Unknown error'}`);
        toast.error('Error saving post');
      }
      return false;
    } finally {
      setSaving(false);
      abortController.current = null;
    }
  };

  // Cancel ongoing save operation
  const cancelOperation = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setSaving(false);
      toast.info('Save operation canceled');
    }
  };

  const resetSaveState = () => {
    setProgress(0);
    setErrorMessage('');
    setSaving(false);
  };

  return {
    saving,
    progress,
    errorMessage,
    setErrorMessage,
    savePost,
    cancelOperation,
    resetSaveState,
    abortController
  };
};
