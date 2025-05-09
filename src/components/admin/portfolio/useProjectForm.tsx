
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { v4 as uuidv4 } from 'uuid';

type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  images: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export const useProjectForm = (project: PortfolioProject | null, onSuccess: () => void) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setPublished(project.published);
      setCurrentImages(project.images || []);
    } else {
      setTitle('');
      setDescription('');
      setPublished(false);
      setCurrentImages([]);
    }
    setImageFiles([]);
  }, [project]);
  
  const handleImagesChange = (files: File[]) => {
    setImageFiles(files);
  };
  
  const uploadImages = async (): Promise<string[]> => {
    if (!imageFiles.length) return currentImages;
    
    setUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio_images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('portfolio_images')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(data.publicUrl);
      }
      
      return [...currentImages, ...uploadedUrls];
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Erro ao fazer upload das imagens');
      return currentImages;
    } finally {
      setUploading(false);
    }
  };
  
  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setSaving(true);
    try {
      let finalImages = currentImages;
      
      if (imageFiles.length) {
        finalImages = await uploadImages();
      }
      
      if (project) {
        // Update existing project
        const { error } = await supabase
          .from('portfolio_projects')
          .update({
            title,
            description,
            images: finalImages,
            published,
            updated_at: new Date().toISOString(),
          })
          .eq('id', project.id);
        
        if (error) throw error;
        
        toast.success('Projeto atualizado com sucesso');
      } else {
        // Create new project
        const { error } = await supabase
          .from('portfolio_projects')
          .insert({
            title,
            description,
            images: finalImages,
            published,
          });
        
        if (error) throw error;
        
        toast.success('Projeto criado com sucesso');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving portfolio project:', error);
      toast.error('Erro ao salvar projeto');
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setCurrentImages(currentImages.filter((_, index) => index !== indexToRemove));
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    published,
    setPublished,
    currentImages,
    imageFiles,
    uploading,
    saving,
    handleImagesChange,
    removeImage,
    handleSave
  };
};
