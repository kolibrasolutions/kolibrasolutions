
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/hooks/useAuth';

type BlogPost = {
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

export const usePostForm = (post: BlogPost | null, onSuccess: () => void) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  
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
  }, [post]);
  
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };
  
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;
    
    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (!user) {
      toast.error('Você precisa estar autenticado para criar ou editar postagens');
      return;
    }
    
    setSaving(true);
    try {
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        finalImageUrl = await uploadImage();
      }
      
      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title,
            subtitle: subtitle || null,
            content,
            image_url: finalImageUrl,
            published,
            updated_at: new Date().toISOString(),
          })
          .eq('id', post.id);
        
        if (error) throw error;
        
        toast.success('Postagem atualizada com sucesso');
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title,
            subtitle: subtitle || null,
            content,
            image_url: finalImageUrl,
            published,
            author_id: user.id,
          });
        
        if (error) throw error;
        
        toast.success('Postagem criada com sucesso');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Erro ao salvar postagem');
    } finally {
      setSaving(false);
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
    handleImageChange,
    handleSave
  };
};
