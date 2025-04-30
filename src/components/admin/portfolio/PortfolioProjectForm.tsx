
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MultipleImageUpload } from '@/components/admin/shared/MultipleImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Image, Quote } from 'lucide-react';

type PortfolioProjectFormProps = {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  published: boolean;
  setPublished: (published: boolean) => void;
  currentImages: string[];
  handleImagesChange: (files: File[]) => void;
  removeImage: (indexToRemove: number) => void;
  disabled?: boolean;
};

export const PortfolioProjectForm = ({
  title,
  setTitle,
  description,
  setDescription,
  published,
  setPublished,
  currentImages,
  handleImagesChange,
  removeImage,
  disabled = false,
}: PortfolioProjectFormProps) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  // Insert formatting at cursor position
  const insertFormatting = (format: string, wrap = true) => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);
    let newDescription = '';
    
    switch (format) {
      case 'bold':
        newDescription = description.substring(0, start) + `**${selectedText || 'texto em negrito'}**` + description.substring(end);
        break;
      case 'italic':
        newDescription = description.substring(0, start) + `_${selectedText || 'texto em itálico'}_` + description.substring(end);
        break;
      case 'underline':
        newDescription = description.substring(0, start) + `__${selectedText || 'texto sublinhado'}__` + description.substring(end);
        break;
      case 'h2':
        newDescription = description.substring(0, start) + `\n## ${selectedText || 'Subtítulo'}\n` + description.substring(end);
        break;
      case 'h3':
        newDescription = description.substring(0, start) + `\n### ${selectedText || 'Subtítulo menor'}\n` + description.substring(end);
        break;
      case 'quote':
        newDescription = description.substring(0, start) + `\n> ${selectedText || 'Citação'}\n` + description.substring(end);
        break;
      case 'ul':
        newDescription = description.substring(0, start) + `\n- ${selectedText || 'Item da lista'}\n` + description.substring(end);
        break;
      case 'ol':
        newDescription = description.substring(0, start) + `\n1. ${selectedText || 'Item numerado'}\n` + description.substring(end);
        break;
      case 'link':
        newDescription = description.substring(0, start) + `[${selectedText || 'texto do link'}](https://exemplo.com)` + description.substring(end);
        break;
      case 'orange-section':
        newDescription = description.substring(0, start) + `\n::: orange\n${selectedText || 'Texto com fundo laranja'}\n:::\n` + description.substring(end);
        break;
      case 'blue-section':
        newDescription = description.substring(0, start) + `\n::: blue\n${selectedText || 'Texto com fundo azul'}\n:::\n` + description.substring(end);
        break;
      case 'green-section':
        newDescription = description.substring(0, start) + `\n::: green\n${selectedText || 'Texto com fundo verde'}\n:::\n` + description.substring(end);
        break;
      case 'gray-section':
        newDescription = description.substring(0, start) + `\n::: gray\n${selectedText || 'Texto com fundo cinza'}\n:::\n` + description.substring(end);
        break;
      default:
        return;
    }
    
    setDescription(newDescription);
    
    // Set focus back and update cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + (format === 'bold' || format === 'italic' || format === 'underline' ? 2 : 4);
      textarea.setSelectionRange(newPosition, newPosition + (selectedText.length || format.includes('section') ? 0 : format.length));
    }, 0);
  };
  
  const renderPreview = () => {
    let html = description;
    
    // Escape HTML but preserve formatting tags
    html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Process colored sections
    html = html.replace(/:::\s*orange\s*\n([\s\S]*?)\n:::/g, '<div class="bg-amber-100 p-4 my-4 rounded-lg">$1</div>');
    html = html.replace(/:::\s*blue\s*\n([\s\S]*?)\n:::/g, '<div class="bg-blue-100 p-4 my-4 rounded-lg">$1</div>');
    html = html.replace(/:::\s*green\s*\n([\s\S]*?)\n:::/g, '<div class="bg-green-100 p-4 my-4 rounded-lg">$1</div>');
    html = html.replace(/:::\s*gray\s*\n([\s\S]*?)\n:::/g, '<div class="bg-gray-100 p-4 my-4 rounded-lg">$1</div>');
    
    // Process markdown-style formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    html = html.replace(/__(.*?)__/g, '<u>$1</u>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold my-4">$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold my-3">$1</h3>');
    html = html.replace(/^\> (.*?)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>');
    html = html.replace(/^\- (.*?)$/gm, '<li class="list-disc ml-6">$1</li>');
    html = html.replace(/^[0-9]+\. (.*?)$/gm, '<li class="list-decimal ml-6">$1</li>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 underline">$1</a>');
    
    // Convert line breaks to paragraphs
    html = html.split('\n').map(line => {
      if (line && !line.includes('<h2') && !line.includes('<h3') && !line.includes('<li') && !line.includes('<blockquote') && !line.includes('<div class="bg-')) {
        return `<p class="my-2">${line}</p>`;
      }
      return line;
    }).join('');
    
    return { __html: html };
  };

  return (
    <div className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título do projeto"
          disabled={disabled}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        
        <div className="border rounded-md">
          <Tabs defaultValue="edit" value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}>
            <div className="flex items-center justify-between border-b p-1 bg-gray-50">
              <TabsList>
                <TabsTrigger value="edit">Editar</TabsTrigger>
                <TabsTrigger value="preview">Visualizar</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-1 px-1">
                <Button type="button" size="icon" variant="ghost" onClick={() => insertFormatting('bold')} disabled={disabled || activeTab === 'preview'}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => insertFormatting('italic')} disabled={disabled || activeTab === 'preview'}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => insertFormatting('underline')} disabled={disabled || activeTab === 'preview'}>
                  <Underline className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => insertFormatting('h2')} disabled={disabled || activeTab === 'preview'}>
                  <span className="text-xs font-bold">H2</span>
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => insertFormatting('h3')} disabled={disabled || activeTab === 'preview'}>
                  <span className="text-xs font-bold">H3</span>
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => insertFormatting('ul')} disabled={disabled || activeTab === 'preview'}>
                  <List className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => insertFormatting('ol')} disabled={disabled || activeTab === 'preview'}>
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => insertFormatting('quote')} disabled={disabled || activeTab === 'preview'}>
                  <Quote className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => insertFormatting('link')} disabled={disabled || activeTab === 'preview'}>
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-1 bg-gray-50 flex gap-1 border-b">
              <Button type="button" size="sm" variant="outline" onClick={() => insertFormatting('orange-section')} disabled={disabled || activeTab === 'preview'} 
                className="text-xs py-1 h-7 bg-amber-100 hover:bg-amber-200">
                Seção Laranja
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => insertFormatting('blue-section')} disabled={disabled || activeTab === 'preview'}
                className="text-xs py-1 h-7 bg-blue-100 hover:bg-blue-200">
                Seção Azul
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => insertFormatting('green-section')} disabled={disabled || activeTab === 'preview'}
                className="text-xs py-1 h-7 bg-green-100 hover:bg-green-200">
                Seção Verde
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => insertFormatting('gray-section')} disabled={disabled || activeTab === 'preview'}
                className="text-xs py-1 h-7 bg-gray-100 hover:bg-gray-200">
                Seção Cinza
              </Button>
            </div>
            
            <TabsContent value="edit" className="p-0 border-none">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição do projeto. Use formatação para melhorar a aparência."
                className="min-h-[200px] border-none rounded-none resize-y p-4 font-mono"
                disabled={disabled}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="p-4 border-none bg-white">
              <div 
                className="prose prose-sm max-w-none min-h-[200px]"
                dangerouslySetInnerHTML={renderPreview()} 
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="text-xs text-gray-500 mt-1">
          <p><strong>Dicas de formatação:</strong></p>
          <p>- Use <code>**texto**</code> para <strong>negrito</strong></p>
          <p>- Use <code>_texto_</code> para <em>itálico</em></p>
          <p>- Use <code>__texto__</code> para <u>sublinhado</u></p>
          <p>- Use seções coloridas para destacar informações importantes</p>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label>Imagens do Projeto</Label>
        <MultipleImageUpload 
          currentImages={currentImages}
          onFilesChange={handleImagesChange}
          onRemoveImage={removeImage}
          disabled={disabled}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={published}
          onCheckedChange={setPublished}
          disabled={disabled}
        />
        <Label htmlFor="published">Publicar imediatamente</Label>
      </div>
    </div>
  );
};
