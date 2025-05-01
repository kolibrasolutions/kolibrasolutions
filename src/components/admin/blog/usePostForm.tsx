import { useState, useEffect, useRef } from 'react';
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

// Valores constantes para configuração
const MAX_CONTENT_SIZE = 10000000; // Tamanho aproximado máximo para salvar de uma vez
const SAVE_TIMEOUT = 120000; // 120 segundos (2 minutos) de timeout para salvar
const IMAGE_UPLOAD_TIMEOUT = 180000; // 3 minutos de timeout para upload de imagens

export const usePostForm = (post: BlogPost | null, onSuccess: () => void) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const abortController = useRef<AbortController | null>(null);
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
    setProgress(0);
    setErrorMessage('');
  }, [post]);
  
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };
  
  // Função para comprimir imagem se necessário
  const compressImageIfNeeded = async (file: File): Promise<File> => {
    // Se o arquivo for menor que 2MB, não comprimimos
    if (file.size <= 2 * 1024 * 1024) return file;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar imagens muito grandes
          const MAX_DIMENSION = 1800;
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Qualidade ajustada baseada no tamanho original
          let quality = 0.7;
          if (file.size > 4 * 1024 * 1024) quality = 0.5;
          
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              
              const newFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              console.log(`Imagem comprimida de ${file.size / 1024}KB para ${newFile.size / 1024}KB`);
              resolve(newFile);
            },
            'image/jpeg',
            quality
          );
        };
      };
    });
  };
  
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;
    
    setUploading(true);
    setProgress(10);
    
    // Criar um novo AbortController
    abortController.current = new AbortController();
    
    // Configurar um timeout
    const timeoutId = setTimeout(() => {
      if (abortController.current) {
        abortController.current.abort();
      }
    }, IMAGE_UPLOAD_TIMEOUT);
    
    try {
      // Comprimir imagem se necessário
      const optimizedFile = await compressImageIfNeeded(imageFile);
      setProgress(20);
      
      const fileExt = optimizedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      setProgress(30);
      
      // Usando o upload sem passar o signal diretamente na opção
      // já que o tipo FileOptions não suporta essa propriedade
      const { error: uploadError, data } = await supabase.storage
        .from('blog_images')
        .upload(filePath, optimizedFile, {
          cacheControl: '3600',
        });
      
      clearTimeout(timeoutId);
      setProgress(80);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);
      
      setProgress(100);
      return urlData.publicUrl;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Upload abortado por timeout');
        setErrorMessage('O upload da imagem demorou muito tempo e foi cancelado. Tente uma imagem menor.');
        toast.error('Tempo limite excedido ao fazer upload da imagem. Tente uma imagem menor.');
      } else {
        console.error('Erro ao fazer upload da imagem:', error);
        setErrorMessage(`Erro ao fazer upload da imagem: ${error.message || 'Erro desconhecido'}`);
        toast.error('Erro ao fazer upload da imagem');
      }
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  // Função para criar ou atualizar postagem com tratamento de conteúdo grande
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (!user) {
      toast.error('Você precisa estar autenticado para criar ou editar postagens');
      return;
    }
    
    // Resetar estado
    setErrorMessage('');
    setSaving(true);
    setProgress(0);
    
    try {
      let finalImageUrl = imageUrl;
      
      // Upload da imagem primeiro, se houver
      if (imageFile) {
        finalImageUrl = await uploadImage();
        if (!finalImageUrl && imageFile) {
          setSaving(false);
          return; // Se o upload falhar e havia um arquivo, interrompe o salvamento
        }
      }
      
      setProgress(40);
      
      // Criar um novo AbortController para o salvamento
      abortController.current = new AbortController();
      const signal = abortController.current.signal;
      
      // Configurar um timeout para o salvamento
      const timeoutId = setTimeout(() => {
        if (abortController.current) {
          abortController.current.abort();
        }
      }, SAVE_TIMEOUT);
      
      if (post) {
        // Atualizar postagem existente
        setProgress(60);
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
          .eq('id', post.id)
          .abortSignal(signal);
        
        clearTimeout(timeoutId);
        
        if (error) throw error;
        
        setProgress(100);
        toast.success('Postagem atualizada com sucesso');
      } else {
        // Criar nova postagem
        setProgress(60);
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title,
            subtitle: subtitle || null,
            content,
            image_url: finalImageUrl,
            published,
            author_id: user.id,
          })
          .abortSignal(signal);
        
        clearTimeout(timeoutId);
        
        if (error) throw error;
        
        setProgress(100);
        toast.success('Postagem criada com sucesso');
      }
      
      onSuccess();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Salvamento abortado por timeout');
        setErrorMessage('O salvamento demorou muito tempo e foi cancelado. Tente um conteúdo menor ou divida em múltiplas postagens.');
        toast.error('Tempo limite excedido ao salvar postagem. Tente um conteúdo menor.');
      } else {
        console.error('Erro ao salvar blog post:', error);
        setErrorMessage(`Erro ao salvar postagem: ${error.message || 'Erro desconhecido'}`);
        toast.error('Erro ao salvar postagem');
      }
    } finally {
      setSaving(false);
      abortController.current = null;
    }
  };

  // Função para cancelar operações em andamento
  const cancelOperation = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setSaving(false);
      setUploading(false);
      toast.info('Operação cancelada');
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
