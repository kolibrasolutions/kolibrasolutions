
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/admin/shared/ImageUpload';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';

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

type BlogPostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  onSuccess: () => void;
};

export const BlogPostDialog = ({ open, onOpenChange, post, onSuccess }: BlogPostDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
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
  }, [post, open]);
  
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
    
    setSaving(true);
    try {
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        finalImageUrl = await uploadImage();
        if (!finalImageUrl && imageFile) {
          toast.error('Erro ao fazer upload da imagem');
          setSaving(false);
          return;
        }
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Você precisa estar logado para salvar uma postagem');
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
      
      onSuccess();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Erro ao salvar postagem');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{post ? 'Editar Postagem' : 'Nova Postagem'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da postagem"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite o conteúdo da postagem"
              className="min-h-[200px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Imagem de Destaque</Label>
            <ImageUpload 
              currentImageUrl={imageUrl} 
              onFileChange={handleImageChange} 
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
            {post ? 'Atualizar' : 'Criar'} Postagem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
