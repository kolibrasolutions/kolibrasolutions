
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { BlogPost } from '@/types/blog';

type DialogFooterActionsProps = {
  post: BlogPost | null;
  saving: boolean;
  uploading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onCancelOperation: () => void;
};

export const DialogFooterActions = ({
  post,
  saving,
  uploading,
  onSave,
  onCancel,
  onCancelOperation
}: DialogFooterActionsProps) => {
  const isProcessing = saving || uploading;
  
  return (
    <div className="flex-col sm:flex-row sm:justify-between gap-2">
      <div className="flex gap-2">
        {isProcessing && (
          <Button 
            variant="destructive" 
            onClick={onCancelOperation}
            className="w-full sm:w-auto"
          >
            Cancelar Operação
          </Button>
        )}
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 sm:flex-none"
        >
          Cancelar
        </Button>
        <Button 
          onClick={onSave}
          disabled={isProcessing}
          className="flex-1 sm:flex-none"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {post ? 'Atualizar' : 'Criar'} Postagem
        </Button>
      </div>
    </div>
  );
};
