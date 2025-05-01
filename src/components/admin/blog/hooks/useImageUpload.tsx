
import { useState, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { BlogImageService, IMAGE_UPLOAD_TIMEOUT } from '@/services/blogImageService';

export const useImageUpload = () => {
  // State
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Reference for abort controller
  const abortController = useRef<AbortController | null>(null);

  // Reset state for a new form
  const resetImageState = (initialImageUrl: string | null = null) => {
    setImageUrl(initialImageUrl);
    setImageFile(null);
    setProgress(0);
    setErrorMessage('');
  };
  
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

  // Cancel ongoing upload operation
  const cancelOperation = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setUploading(false);
      toast.info('Upload operation canceled');
    }
  };

  return {
    imageUrl,
    setImageUrl,
    imageFile,
    uploading,
    progress,
    errorMessage,
    setErrorMessage,
    handleImageChange,
    uploadImage,
    cancelOperation,
    resetImageState,
    abortController
  };
};
