
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MultipleImageUpload } from '@/components/admin/shared/MultipleImageUpload';
import { v4 as uuidv4 } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  images: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

type PortfolioProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: PortfolioProject | null;
  onSuccess: () => void;
};

export const PortfolioProjectDialog = ({ open, onOpenChange, project, onSuccess }: PortfolioProjectDialogProps) => {
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
  }, [project, open]);
  
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{project ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do projeto"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição do projeto"
              className="min-h-[150px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Imagens do Projeto</Label>
            <MultipleImageUpload 
              currentImages={currentImages}
              onFilesChange={handleImagesChange}
              onRemoveImage={removeImage}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Publicar imediatamente</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={saving || uploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving || uploading}
          >
            {(saving || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? 'Atualizar' : 'Criar'} Projeto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
