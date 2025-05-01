
import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';

export const usePostFormState = (post: BlogPost | null) => {
  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  
  // Initialize form with post data if editing
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSubtitle(post.subtitle || '');
      setContent(post.content);
      setPublished(post.published);
    } else {
      setTitle('');
      setSubtitle('');
      setContent('');
      setPublished(false);
    }
  }, [post]);

  // Form validation
  const isFormValid = () => {
    return title.trim() !== '' && content.trim() !== '';
  };

  // Reset form state
  const resetFormState = () => {
    setTitle('');
    setSubtitle('');
    setContent('');
    setPublished(false);
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
    isFormValid,
    resetFormState
  };
};
