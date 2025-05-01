
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type ListHeaderProps = {
  onCreateClick: () => void;
};

export const ListHeader = ({ onCreateClick }: ListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Gerenciar Postagens do Blog</h2>
      <Button onClick={onCreateClick} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        <span>Nova Postagem</span>
      </Button>
    </div>
  );
};
