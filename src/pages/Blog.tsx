
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type BlogPost = {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('blog_posts').select('*').eq('published', true).order('created_at', {
          ascending: false
        });
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

  const handleImageError = (postId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  // Função para limpar o conteúdo de markdown para exibição de preview
  const cleanContentForPreview = (content: string) => {
    return content
      .replace(/:::\s*\w+\s*\n|:::/g, '') // Remove section markers
      .replace(/\*\*|\*|__|_|##|###|>|\[.*?\]\(.*?\)/g, '') // Remove markdown syntax
      .replace(/\n/g, ' ') // Replace line breaks with spaces
      .trim();
  };
  
  return <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-kolibra-blue">Blog</h1>
        
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
            {posts.map(post => (
              <Card key={post.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="bg-gray-100">
                  <AspectRatio ratio={16/9}>
                    {post.image_url && !imageErrors[post.id] ? (
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                        onError={() => handleImageError(post.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sem imagem
                      </div>
                    )}
                  </AspectRatio>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold mb-1 line-clamp-2">{post.title}</h2>
                  
                  {post.subtitle && <p className="text-gray-600 mb-2 italic line-clamp-2">{post.subtitle}</p>}
                  
                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(post.created_at), {
                        locale: ptBR,
                        addSuffix: true
                      })}
                    </span>
                  </p>
                  
                  <div className="text-gray-700 mb-4">
                    <p className="line-clamp-3">{cleanContentForPreview(post.content)}</p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t">
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" className="hover:bg-green-50 font-medium flex items-center gap-1 px-0 text-kolibra-blue">
                        Ler mais <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>;
};

export default Blog;
