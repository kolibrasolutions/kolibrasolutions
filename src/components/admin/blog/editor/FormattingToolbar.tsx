
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Link } from 'lucide-react';

type FormattingToolbarProps = {
  onFormatClick: (format: string) => void;
  disabled?: boolean;
  activeTab: 'edit' | 'preview';
};

export const FormattingToolbar = ({
  onFormatClick,
  disabled = false,
  activeTab,
}: FormattingToolbarProps) => {
  return (
    <div className="flex items-center justify-between border-b p-1 bg-gray-50">
      <div className="flex gap-1 px-1">
        <Button type="button" size="icon" variant="ghost" onClick={() => onFormatClick('bold')} disabled={disabled || activeTab === 'preview'}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={() => onFormatClick('italic')} disabled={disabled || activeTab === 'preview'}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={() => onFormatClick('underline')} disabled={disabled || activeTab === 'preview'}>
          <Underline className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={() => onFormatClick('h2')} disabled={disabled || activeTab === 'preview'}>
          <span className="text-xs font-bold">H2</span>
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={() => onFormatClick('h3')} disabled={disabled || activeTab === 'preview'}>
          <span className="text-xs font-bold">H3</span>
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={() => onFormatClick('ul')} disabled={disabled || activeTab === 'preview'}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={() => onFormatClick('ol')} disabled={disabled || activeTab === 'preview'}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={() => onFormatClick('quote')} disabled={disabled || activeTab === 'preview'}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={() => onFormatClick('link')} disabled={disabled || activeTab === 'preview'}>
          <Link className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
