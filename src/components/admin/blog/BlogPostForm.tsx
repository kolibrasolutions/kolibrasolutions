
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/admin/shared/ImageUpload';
import { ContentEditorWrapper } from './editor/ContentEditorWrapper';

type BlogPostFormProps = {
  title: string;
  setTitle: (title: string) => void;
  subtitle: string;
  setSubtitle: (subtitle: string) => void;
  content: string;
  setContent: (content: string) => void;
  published: boolean;
  setPublished: (published: boolean) => void;
  imageUrl: string | null;
  handleImageChange: (file: File | null) => void;
  disabled?: boolean;
};

export const BlogPostForm = ({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  content,
  setContent,
  published,
  setPublished,
  imageUrl,
  handleImageChange,
  disabled = false,
}: BlogPostFormProps) => {
  return (
    <div className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da postagem"
          disabled={disabled}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Input
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Digite o subtítulo da postagem (opcional)"
          disabled={disabled}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="content">Conteúdo</Label>
        <ContentEditorWrapper 
          content={content} 
          setContent={setContent} 
          disabled={disabled} 
        />
      </div>
      
      <div className="grid gap-2">
        <Label>Imagem de Destaque</Label>
        <ImageUpload 
          currentImageUrl={imageUrl} 
          onFileChange={handleImageChange}
          disabled={disabled}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={published}
          onCheckedChange={setPublished}
          disabled={disabled}
        />
        <Label htmlFor="published">Publicar imediatamente</Label>
      </div>
    </div>
  );
};
