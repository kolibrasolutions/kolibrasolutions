
import React from 'react';

type ContentSizeAnalyzerProps = {
  content: string;
};

export const ContentSizeAnalyzer = ({ content }: ContentSizeAnalyzerProps) => {
  // Calculate content size in characters and in percentage for visual feedback
  const contentLength = content ? content.length : 0;
  const contentSize = Math.min((contentLength / 200000) * 100, 100);
  
  // Define thresholds with character counts
  const mediumThreshold = 5000; // 5K characters
  const largeThreshold = 15000;  // 15K characters
  const veryLargeThreshold = 50000; // 50K characters
  
  const isMediumContent = contentLength > mediumThreshold;
  const isLargeContent = contentLength > largeThreshold;
  const isVeryLargeContent = contentLength > veryLargeThreshold;

  // Provide appropriate warning messages based on content size
  const getContentSizeWarning = () => {
    if (isVeryLargeContent) {
      return `Conteúdo muito extenso (${contentLength.toLocaleString()} caracteres)! O salvamento pode demorar vários minutos ou falhar. Considere dividir em múltiplas postagens.`;
    } else if (isLargeContent) {
      return `Conteúdo extenso (${contentLength.toLocaleString()} caracteres). O salvamento pode demorar um pouco mais.`;
    } else if (isMediumContent) {
      return `Conteúdo de tamanho médio (${contentLength.toLocaleString()} caracteres). O salvamento deve ser rápido.`;
    }
    return null;
  };
  
  return {
    contentLength,
    contentSize,
    isMediumContent,
    isLargeContent,
    isVeryLargeContent,
    contentWarning: getContentSizeWarning()
  };
};
