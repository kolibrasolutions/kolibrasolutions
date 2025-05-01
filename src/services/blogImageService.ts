
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { compressImageIfNeeded } from '@/utils/imageUtils';

/**
 * Constants for configuration
 */
export const IMAGE_UPLOAD_TIMEOUT = 180000; // 3 minutes timeout

/**
 * Service for handling blog image uploads
 */
export class BlogImageService {
  /**
   * Uploads an image to Supabase storage
   * @param imageFile - The image file to upload
   * @param abortController - AbortController to handle upload cancellation
   * @param onProgress - Callback for upload progress updates
   * @returns The URL of the uploaded image or null if upload failed
   */
  static async uploadImage(
    imageFile: File,
    abortController: React.MutableRefObject<AbortController | null>,
    onProgress: (progress: number) => void
  ): Promise<string | null> {
    // Set up a new AbortController
    abortController.current = new AbortController();
    
    // Set up a timeout
    const timeoutId = setTimeout(() => {
      if (abortController.current) {
        abortController.current.abort();
      }
    }, IMAGE_UPLOAD_TIMEOUT);
    
    try {
      // Compress image if needed
      onProgress(10);
      const optimizedFile = await compressImageIfNeeded(imageFile);
      onProgress(20);
      
      const fileExt = optimizedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = fileName;
      
      onProgress(30);
      
      // Upload the image to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('blog_images')
        .upload(filePath, optimizedFile, {
          cacheControl: '3600',
        });
      
      clearTimeout(timeoutId);
      onProgress(80);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);
      
      onProgress(100);
      return urlData.publicUrl;
    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}
