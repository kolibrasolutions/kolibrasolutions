
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BlogPostDialog } from './BlogPostDialog';

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

export const BlogPostsList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [creatingPost, setCreatingPost] = useState(false);
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Erro ao carregar postagens do blog');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta postagem?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Postagem excluída com sucesso');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Erro ao excluir postagem');
    }
  };
  
  const handlePublishToggle = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !post.published })
        .eq('id', post.id);
      
      if (error) throw error;
      
      toast.success(`Postagem ${post.published ? 'despublicada' : 'publicada'} com sucesso`);
      fetchPosts();
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Erro ao atualizar estado de publicação');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Postagens do Blog</h2>
        <Button onClick={() => setCreatingPost(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nova Postagem</span>
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">Nenhuma postagem encontrada</p>
            <Button onClick={() => setCreatingPost(true)}>Criar Primeira Postagem</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
            <Card key={post.id} className="overflow-hidden">
              <div className="h-40 bg-gray-100 relative">
                {post.image_url ? (
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem imagem
                  </div>
                )}
                <Badge 
                  className={`absolute top-2 right-2 ${post.published ? 'bg-green-500' : 'bg-gray-500'}`}
                >
                  {post.published ? 'Publicado' : 'Rascunho'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Criado há {formatDistanceToNow(new Date(post.created_at), { locale: ptBR, addSuffix: false })}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Button 
                    variant={post.published ? "outline" : "default"}
                    size="sm" 
                    className={post.published ? "border-red-200 text-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700 text-white"}
                    onClick={() => handlePublishToggle(post)}
                  >
                    {post.published ? 'Despublicar' : 'Publicar'}
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEditingPost(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <BlogPostDialog
        open={creatingPost || !!editingPost}
        onOpenChange={(open) => {
          if (!open) {
            setCreatingPost(false);
            setEditingPost(null);
          }
        }}
        post={editingPost}
        onSuccess={() => {
          setCreatingPost(false);
          setEditingPost(null);
          fetchPosts();
        }}
      />
    </div>
  );
};
