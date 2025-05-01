
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormattingToolbar } from './FormattingToolbar';
import { SectionButtons } from './SectionButtons';
import { ContentEditor } from './ContentEditor';
import { ContentPreview } from './ContentPreview';
import { FormattingHelp } from './FormattingHelp';

type ContentEditorWrapperProps = {
  content: string;
  setContent: (content: string) => void;
  disabled?: boolean;
};

export const ContentEditorWrapper = ({
  content,
  setContent,
  disabled = false
}: ContentEditorWrapperProps) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Insert formatting at cursor position
  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newContent = '';
    
    switch (format) {
      case 'bold':
        newContent = content.substring(0, start) + `**${selectedText || 'texto em negrito'}**` + content.substring(end);
        break;
      case 'italic':
        newContent = content.substring(0, start) + `_${selectedText || 'texto em itálico'}_` + content.substring(end);
        break;
      case 'underline':
        newContent = content.substring(0, start) + `__${selectedText || 'texto sublinhado'}__` + content.substring(end);
        break;
      case 'h2':
        newContent = content.substring(0, start) + `\n## ${selectedText || 'Subtítulo'}\n` + content.substring(end);
        break;
      case 'h3':
        newContent = content.substring(0, start) + `\n### ${selectedText || 'Subtítulo menor'}\n` + content.substring(end);
        break;
      case 'quote':
        newContent = content.substring(0, start) + `\n> ${selectedText || 'Citação'}\n` + content.substring(end);
        break;
      case 'ul':
        newContent = content.substring(0, start) + `\n- ${selectedText || 'Item da lista'}\n` + content.substring(end);
        break;
      case 'ol':
        newContent = content.substring(0, start) + `\n1. ${selectedText || 'Item numerado'}\n` + content.substring(end);
        break;
      case 'link':
        newContent = content.substring(0, start) + `[${selectedText || 'texto do link'}](https://exemplo.com)` + content.substring(end);
        break;
      case 'orange-section':
        newContent = content.substring(0, start) + `\n::: orange\n${selectedText || 'Texto com fundo laranja'}\n:::\n` + content.substring(end);
        break;
      case 'blue-section':
        newContent = content.substring(0, start) + `\n::: blue\n${selectedText || 'Texto com fundo azul'}\n:::\n` + content.substring(end);
        break;
      case 'green-section':
        newContent = content.substring(0, start) + `\n::: green\n${selectedText || 'Texto com fundo verde'}\n:::\n` + content.substring(end);
        break;
      case 'gray-section':
        newContent = content.substring(0, start) + `\n::: gray\n${selectedText || 'Texto com fundo cinza'}\n:::\n` + content.substring(end);
        break;
      default:
        return;
    }
    
    setContent(newContent);
    
    // Set focus back and update cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + (format === 'bold' || format === 'italic' || format === 'underline' ? 2 : 4);
      textarea.setSelectionRange(newPosition, newPosition + (selectedText.length || format.includes('section') ? 0 : format.length));
    }, 0);
  };

  return (
    <div className="grid gap-2">
      <div className="border rounded-md">
        <Tabs defaultValue="edit" value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}>
          <div className="flex items-center justify-between border-b p-1 bg-gray-50">
            <TabsList>
              <TabsTrigger value="edit">Editar</TabsTrigger>
              <TabsTrigger value="preview">Visualizar</TabsTrigger>
            </TabsList>
          </div>
          
          <FormattingToolbar 
            onFormatClick={insertFormatting} 
            disabled={disabled} 
            activeTab={activeTab} 
          />
          
          <SectionButtons 
            onFormatClick={insertFormatting} 
            disabled={disabled} 
            activeTab={activeTab} 
          />
          
          <TabsContent value="edit" className="p-0 border-none">
            <ContentEditor 
              content={content} 
              setContent={setContent} 
              disabled={disabled} 
            />
          </TabsContent>
          
          <TabsContent value="preview" className="p-4 border-none bg-white">
            <ContentPreview content={content} />
          </TabsContent>
        </Tabs>
      </div>
      
      <FormattingHelp />
    </div>
  );
};
