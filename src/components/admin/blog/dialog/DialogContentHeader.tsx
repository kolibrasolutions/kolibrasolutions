
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
        <span className={`block mt-1 ${contentWarning.includes('muito extenso') ? 'text-amber-600 font-semibold' : contentWarning.includes('extenso') ? 'text-amber-500' : 'text-green-600'}`}>
          {contentWarning.includes('muito extenso') ? '⚠️ ' : contentWarning.includes('extenso') ? '⚠️ ' : '✓ '}
          {contentWarning}
        </span>
      )}
      <span className="block mt-1 text-gray-500 text-xs">
        Tempo de salvamento aumentado para 5 minutos para acomodar postagens maiores.
      </span>
    </DialogDescription>
  );
};
