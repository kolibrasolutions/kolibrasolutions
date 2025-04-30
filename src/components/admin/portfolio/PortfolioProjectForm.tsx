
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MultipleImageUpload } from '@/components/admin/shared/MultipleImageUpload';

type PortfolioProjectFormProps = {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  published: boolean;
  setPublished: (published: boolean) => void;
  currentImages: string[];
  handleImagesChange: (files: File[]) => void;
  removeImage: (indexToRemove: number) => void;
};

export const PortfolioProjectForm = ({
  title,
  setTitle,
  description,
  setDescription,
  published,
  setPublished,
  currentImages,
  handleImagesChange,
  removeImage,
}: PortfolioProjectFormProps) => {
  return (
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
  );
};
