
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { v4 as uuidv4 } from 'uuid';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
};

export const usePostForm = (post: BlogPost | null, onSuccess: () => void) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
      setImageUrl(post.image_url);
    } else {
      setTitle('');
      setContent('');
      setPublished(false);
      setImageUrl(null);
    }
    setImageFile(null);
  }, [post]);
  
  // Cleanup function to clear timeout
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);
  
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };
  
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;
    
    // Check file size (4MB limit)
    if (imageFile.size > 4 * 1024 * 1024) {
      toast.error('Erro: O arquivo é muito grande', {
        description: 'O tamanho máximo permitido é de 4MB'
      });
      return null;
    }
    
    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      toast.info('Fazendo upload da imagem...', {
        description: 'Por favor, aguarde enquanto enviamos sua imagem.'
      });
      
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
    if (!title.trim()) {
      toast.error('Por favor, preencha o título');
      return;
    }
    
    // Content size check - increased to 2MB (approx 2 million characters)
    if (content && content.length > 2000000) {
      toast.error('Conteúdo muito grande', {
        description: 'O conteúdo do post é muito grande. Por favor, reduza o tamanho.'
      });
      return;
    }
    
    // Content validation but not blocking
    if (!content.trim()) {
      toast.warning('O conteúdo está vazio');
    }
    
    setSaving(true);
    
    try {
      // Set a timeout to prevent infinite loading - increased to 120 seconds
      const timeout = setTimeout(() => {
        setSaving(false);
        toast.error('Tempo limite excedido. Por favor, tente novamente.');
      }, 120000); // 120 second timeout
      
      setSaveTimeout(timeout);
      
      toast.info('Salvando postagem...', {
        description: 'Estamos processando seu conteúdo. Isso pode levar até 2 minutos para artigos grandes.'
      });
      
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        finalImageUrl = await uploadImage();
        if (!finalImageUrl && imageFile) {
          toast.error('Erro ao fazer upload da imagem');
          setSaving(false);
          clearTimeout(timeout);
          setSaveTimeout(null);
          return;
        }
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar logado para salvar uma postagem');
        setSaving(false);
        clearTimeout(timeout);
        setSaveTimeout(null);
        return;
      }
      
      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title,
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
            content,
            image_url: finalImageUrl,
            published,
            author_id: session.user.id,
          });
        
        if (error) throw error;
        
        toast.success('Postagem criada com sucesso');
      }
      
      clearTimeout(timeout);
      setSaveTimeout(null);
      onSuccess();
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast.error(`Erro ao salvar postagem: ${error.message || 'Tente novamente'}`);
    } finally {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        setSaveTimeout(null);
      }
      setSaving(false);
    }
  };

  return {
    title,
    setTitle,
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
