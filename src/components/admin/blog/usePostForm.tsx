
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import { BlogPost } from '@/types/blog';
import { BlogImageService } from '@/services/blogImageService';
import { BlogPostService, SAVE_TIMEOUT } from '@/services/blogPostService';

export const usePostForm = (post: BlogPost | null, onSuccess: () => void) => {
  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Operation state
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  
  // References
  const abortController = useRef<AbortController | null>(null);
  const { user } = useAuth();
  
  // Initialize form with post data if editing
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSubtitle(post.subtitle || '');
      setContent(post.content);
      setPublished(post.published);
      setImageUrl(post.image_url);
    } else {
      setTitle('');
      setSubtitle('');
      setContent('');
      setPublished(false);
      setImageUrl(null);
    }
    setImageFile(null);
    setProgress(0);
    setErrorMessage('');
  }, [post]);
  
  // Handle image selection
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };
  
  // Upload image to Supabase storage
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;
    
    setUploading(true);
    setProgress(10);
    
    try {
      const url = await BlogImageService.uploadImage(
        imageFile,
        abortController,
        setProgress
      );
      return url;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Upload aborted by timeout');
        setErrorMessage('The image upload took too long and was canceled. Try a smaller image.');
        toast.error('Time limit exceeded when uploading image. Try a smaller image.');
      } else {
        console.error('Error uploading image:', error);
        setErrorMessage(`Error uploading image: ${error.message || 'Unknown error'}`);
        toast.error('Error uploading image');
      }
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  // Save blog post (create or update)
  const handleSave = async () => {
    // Validate required fields
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Ensure user is authenticated
    if (!user) {
      toast.error('You need to be authenticated to create or edit posts');
      return;
    }
    
    // Reset state
    setErrorMessage('');
    setSaving(true);
    setProgress(0);
    
    try {
      // Upload image first if present
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage();
        if (!finalImageUrl && imageFile) {
          setSaving(false);
          return; // If upload failed and there was a file, abort saving
        }
      }
      
      setProgress(40);
      
      // Create or update post
      let success = false;
      if (post) {
        // Update existing post
        setProgress(60);
        success = await BlogPostService.updatePost(
          post.id,
          {
            title,
            subtitle: subtitle || null,
            content,
            image_url: finalImageUrl,
            published,
          },
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
          {
            title,
            subtitle: subtitle || null,
            content,
            image_url: finalImageUrl,
            published,
          },
          user.id,
          abortController
        );
        setProgress(100);
        if (success) {
          toast.success('Post created successfully');
        }
      }
      
      if (success) {
        onSuccess();
      }
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
    } finally {
      setSaving(false);
      abortController.current = null;
    }
  };
  
  // Cancel ongoing operations
  const cancelOperation = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setSaving(false);
      setUploading(false);
      toast.info('Operation canceled');
    }
  };
  
  return {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    content,
    setContent,
    published,
    setPublished,
    imageUrl,
    imageFile,
    uploading,
    saving,
    progress,
    errorMessage,
    handleImageChange,
    handleSave,
    cancelOperation
  };
};
