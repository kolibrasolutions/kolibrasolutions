
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BlogPost } from '@/types/blog';

type PostCardProps = {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onPublishToggle: (post: BlogPost) => void;
};

export const PostCard = ({ post, onEdit, onDelete, onPublishToggle }: PostCardProps) => {
  // Helper function to strip formatting tags for preview
  const stripFormatting = (text: string) => {
    return text
      .replace(/:::\s*\w+\s*\n|:::/g, '') // Remove section markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/_(.*?)_/g, '$1') // Remove italic markers
      .replace(/__(.*?)__/g, '$1') // Remove underline markers
      .replace(/##|###/g, '') // Remove heading markers
      .replace(/\n- /g, '\n') // Remove list markers
      .replace(/\n\d+\. /g, '\n') // Remove ordered list markers
      .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Keep link text only
  };

  return (
    <Card className="overflow-hidden">
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
        
        {post.subtitle && (
          <p className="text-gray-600 text-sm italic mb-1 line-clamp-1">{post.subtitle}</p>
        )}
        
        <p className="text-sm text-gray-500 mt-1">
          Criado há {formatDistanceToNow(new Date(post.created_at), { locale: ptBR, addSuffix: false })}
        </p>
        
        <div className="mt-2 mb-4">
          <p className="text-gray-700 line-clamp-2 text-sm">
            {stripFormatting(post.content)}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant={post.published ? "outline" : "default"}
            size="sm" 
            className={post.published ? "border-red-200 text-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700 text-white"}
            onClick={() => onPublishToggle(post)}
          >
            {post.published ? 'Despublicar' : 'Publicar'}
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(post)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(post.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
