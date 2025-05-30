
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RichTextContent } from '@/components/common/RichTextContent';
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

const BlogPost = () => {
  const { id } = useParams<{ id: string; }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const {
          data,
          error
        } = await supabase.from('blog_posts').select('*').eq('id', id).eq('published', true).single();
        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast.error('Erro ao carregar a postagem do blog');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

  const handleImageError = () => {
    setImageError(true);
    console.error('Erro ao carregar a imagem do blog');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Link to="/blog">
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Blog
          </Button>
        </Link>
        
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : !post ? (
          <div className="bg-green-50 p-8 rounded-lg text-center">
            <p className="text-xl text-gray-700">
              Postagem não encontrada ou indisponível.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-kolibra-blue">{post.title}</h1>
            
            {post.subtitle && <h2 className="text-2xl text-gray-600 mb-4">{post.subtitle}</h2>}
            
            <div className="flex items-center gap-1 text-gray-500 mb-6">
              <Calendar className="h-4 w-4" />
              <span>Publicado em {format(new Date(post.created_at), 'dd MMMM yyyy', {
                locale: ptBR
              })}</span>
            </div>
            
            {post.image_url && !imageError && (
              <div className="mb-8">
                <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full rounded-lg object-cover" 
                    loading="lazy"
                    onError={handleImageError}
                  />
                </AspectRatio>
              </div>
            )}
            
            <article className="prose-img:mx-auto prose-img:rounded-lg">
              <RichTextContent content={post.content} className="prose-green" />
            </article>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogPost;
