
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  onCreateClick: () => void;
};

export const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground mb-4">Nenhuma postagem encontrada</p>
        <Button onClick={onCreateClick}>Criar Primeira Postagem</Button>
      </CardContent>
    </Card>
  );
};
