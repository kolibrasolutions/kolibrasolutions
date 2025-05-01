
import React from 'react';
import { Button } from '@/components/ui/button';

type SectionButtonsProps = {
  onFormatClick: (format: string) => void;
  disabled?: boolean;
  activeTab: 'edit' | 'preview';
};

export const SectionButtons = ({
  onFormatClick,
  disabled = false,
  activeTab,
}: SectionButtonsProps) => {
  return (
    <div className="p-1 bg-gray-50 flex gap-1 border-b">
      <Button type="button" size="sm" variant="outline" onClick={() => onFormatClick('orange-section')} disabled={disabled || activeTab === 'preview'} 
        className="text-xs py-1 h-7 bg-amber-100 hover:bg-amber-200">
        Seção Laranja
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => onFormatClick('blue-section')} disabled={disabled || activeTab === 'preview'}
        className="text-xs py-1 h-7 bg-blue-100 hover:bg-blue-200">
        Seção Azul
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => onFormatClick('green-section')} disabled={disabled || activeTab === 'preview'}
        className="text-xs py-1 h-7 bg-green-100 hover:bg-green-200">
        Seção Verde
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => onFormatClick('gray-section')} disabled={disabled || activeTab === 'preview'}
        className="text-xs py-1 h-7 bg-gray-100 hover:bg-gray-200">
        Seção Cinza
      </Button>
    </div>
  );
};
