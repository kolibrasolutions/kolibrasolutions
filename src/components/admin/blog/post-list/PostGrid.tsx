
import React from 'react';
import { BlogPost } from '@/types/blog';
import { PostCard } from '../post-card/PostCard';

type PostGridProps = {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onPublishToggle: (post: BlogPost) => void;
};

export const PostGrid = ({ posts, onEdit, onDelete, onPublishToggle }: PostGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublishToggle={onPublishToggle}
        />
      ))}
    </div>
  );
};
