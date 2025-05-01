
import React from 'react';
import { DialogDescription } from '@/components/ui/dialog';

type DialogContentHeaderProps = {
  isEditing: boolean;
  contentWarning: string | null;
};

export const DialogContentHeader = ({ 
  isEditing,
  contentWarning 
}: DialogContentHeaderProps) => {
  return (
    <DialogDescription>
      Preencha os campos abaixo para {isEditing ? 'editar a' : 'criar uma nova'} postagem.
      {contentWarning && (
        <span className={`block mt-1 ${contentWarning.includes('muito') ? 'text-amber-600 font-semibold' : 'text-amber-500'}`}>
          ⚠️ {contentWarning}
        </span>
      )}
    </DialogDescription>
  );
};
