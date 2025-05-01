
/**
 * Type definitions for blog-related features
 */

/**
 * Represents a blog post in the database
 */
export type BlogPost = {
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

/**
 * Progress states for blog post operations
 */
export type BlogOperationState = {
  uploading: boolean;
  saving: boolean;
  progress: number;
  errorMessage: string;
};
