
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { BlogPost } from '@/types/blog';
import { BlogPostDialog } from './BlogPostDialog';
import { ListHeader } from './post-list/ListHeader';
import { LoadingState } from './post-list/LoadingState';
import { EmptyState } from './post-list/EmptyState';
import { PostGrid } from './post-list/PostGrid';

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

  const handleCreateClick = () => setCreatingPost(true);
  const handleEditPost = (post: BlogPost) => setEditingPost(post);

  return (
    <div className="space-y-6">
      <ListHeader onCreateClick={handleCreateClick} />
      
      {loading ? (
        <LoadingState />
      ) : posts.length === 0 ? (
        <EmptyState onCreateClick={handleCreateClick} />
      ) : (
        <PostGrid 
          posts={posts}
          onEdit={handleEditPost}
          onDelete={handleDelete}
          onPublishToggle={handlePublishToggle}
        />
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
