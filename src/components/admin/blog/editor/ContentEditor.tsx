
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

type ContentEditorProps = {
  content: string;
  setContent: (content: string) => void;
  disabled?: boolean;
};

export const ContentEditor = ({
  content,
  setContent,
  disabled = false
}: ContentEditorProps) => {
  return (
    <Textarea
      id="content"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Digite o conteúdo da postagem. Use formatação para melhorar a aparência."
      className="min-h-[300px] border-none rounded-none resize-y p-4 font-mono"
      disabled={disabled}
    />
  );
};
