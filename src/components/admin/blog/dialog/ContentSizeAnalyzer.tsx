
import React from 'react';

type ContentSizeAnalyzerProps = {
  content: string;
};

export const ContentSizeAnalyzer = ({ content }: ContentSizeAnalyzerProps) => {
  // Calculate content size as a percentage for visual feedback
  const contentSize = content ? Math.min((content.length / 200000) * 100, 100) : 0;
  const isLargeContent = contentSize > 20;
  const isVeryLargeContent = contentSize > 50;

  // Provide appropriate warning messages based on content size
  const getContentSizeWarning = () => {
    if (isVeryLargeContent) {
      return "Conteúdo muito extenso! O salvamento pode demorar vários minutos ou falhar. Considere dividir em múltiplas postagens.";
    } else if (isLargeContent) {
      return "Conteúdo extenso. O salvamento pode demorar um pouco mais.";
    }
    return null;
  };
  
  return {
    contentSize,
    isLargeContent,
    isVeryLargeContent,
    contentWarning: getContentSizeWarning()
  };
};
