
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

  // Get estimated time based on content size
  const getEstimatedTime = () => {
    if (isVeryLargeContent) return "Conteúdos muito grandes podem levar até 5 minutos";
    if (isLargeContent) return "Conteúdos grandes podem levar até 2 minutos";
    return "Isso pode levar alguns instantes";
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
        {getEstimatedTime()}
        {saving && (
          <span className="block mt-1">
            Por favor, aguarde. Não feche a janela durante o salvamento.
          </span>
        )}
      </p>
    </div>
  );
};
