
import React from 'react';
import { Progress } from '@/components/ui/progress';

type ProgressIndicatorProps = {
  progress: number;
  uploading: boolean;
  saving: boolean;
  isLargeContent: boolean;
  isVeryLargeContent: boolean;
};

export const ProgressIndicator = ({ 
  progress, 
  uploading, 
  saving, 
  isLargeContent, 
  isVeryLargeContent 
}: ProgressIndicatorProps) => {
  // Determine the best description for the progress
  const getProgressDescription = () => {
    if (uploading) {
      if (progress < 30) return "Otimizando imagem...";
      if (progress < 80) return "Enviando imagem...";
      return "Finalizando upload...";
    }
    
    if (saving) {
      if (progress < 40) return "Iniciando salvamento...";
      if (progress < 60) return "Processando dados...";
      if (progress < 90) return "Salvando no banco de dados...";
      return "Finalizando...";
    }
    
    return "";
  };

  return (
    <div className="py-2">
      <Progress value={progress} className="h-2 mb-2" />
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {getProgressDescription()}
        </p>
        <p className="text-sm font-medium">
          {progress}%
        </p>
      </div>
      <p className="text-xs text-center text-muted-foreground mt-1">
        {isVeryLargeContent ? 'Conteúdos muito grandes podem levar até 10 minutos' : 
         isLargeContent ? 'Conteúdos grandes podem levar até 2 minutos' : 
         'Isso pode levar alguns instantes'}
      </p>
    </div>
  );
};
