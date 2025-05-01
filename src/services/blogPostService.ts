
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';

/**
 * Constants for configuration
 */
export const MAX_CONTENT_SIZE = 10000000; // Approximate max size for saving at once
export const SAVE_TIMEOUT = 300000; // 300 seconds (5 minutes) timeout for saving

/**
 * Service for handling blog posts CRUD operations
 */
export class BlogPostService {
  /**
   * Creates a new blog post
   * @param postData - The blog post data to create
   * @param authorId - The ID of the blog post author
   * @param abortController - AbortController to handle save cancellation
   * @returns A boolean indicating if the operation was successful
   */
  static async createPost(
    postData: {
      title: string;
      subtitle: string | null;
      content: string;
      image_url: string | null;
      published: boolean;
    },
    authorId: string,
    abortController: React.MutableRefObject<AbortController | null>
  ): Promise<boolean> {
    // Set up a new AbortController
    abortController.current = new AbortController();
    const signal = abortController.current.signal;
    
    // Set up a timeout
    const timeoutId = setTimeout(() => {
      if (abortController.current) {
        abortController.current.abort();
      }
    }, SAVE_TIMEOUT);
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: postData.title,
          subtitle: postData.subtitle,
          content: postData.content,
          image_url: postData.image_url,
          published: postData.published,
          author_id: authorId,
        });
      
      clearTimeout(timeoutId);
      if (error) throw error;
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  /**
   * Updates an existing blog post
   * @param postId - The ID of the blog post to update
   * @param postData - The updated blog post data
   * @param abortController - AbortController to handle save cancellation
   * @returns A boolean indicating if the operation was successful
   */
  static async updatePost(
    postId: string,
    postData: {
      title: string;
      subtitle: string | null;
      content: string;
      image_url: string | null;
      published: boolean;
    },
    abortController: React.MutableRefObject<AbortController | null>
  ): Promise<boolean> {
    // Set up a new AbortController
    abortController.current = new AbortController();
    const signal = abortController.current.signal;
    
    // Set up a timeout
    const timeoutId = setTimeout(() => {
      if (abortController.current) {
        abortController.current.abort();
      }
    }, SAVE_TIMEOUT);
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: postData.title,
          subtitle: postData.subtitle,
          content: postData.content,
          image_url: postData.image_url,
          published: postData.published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId);
      
      clearTimeout(timeoutId);
      if (error) throw error;
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}
