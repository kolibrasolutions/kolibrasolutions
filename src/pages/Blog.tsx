
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
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
    
    fetchPosts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-green-800 mb-6">Blog</h1>
        
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-green-50 p-8 rounded-lg text-center">
            <p className="text-xl text-gray-700">
              Em breve, compartilharemos dicas e novidades sobre jardinagem e paisagismo aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                <div className="h-48 bg-gray-100">
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
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Publicado há {formatDistanceToNow(new Date(post.created_at), { locale: ptBR, addSuffix: false })}
                  </p>
                  <p className="text-gray-700 line-clamp-4 flex-grow">
                    {post.content}
                  </p>
                  <div className="mt-6 pt-4 border-t">
                    <a href="#" className="text-green-700 hover:underline font-medium">
                      Ler mais
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
