
import React from 'react';

interface RichTextContentProps {
  content: string;
  className?: string;
}

export const RichTextContent: React.FC<RichTextContentProps> = ({ content, className = '' }) => {
  const renderRichText = () => {
    let html = content || '';
    
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
    
    // Handle lists
    let inList = false;
    const lines = html.split('\n');
    
    html = lines.map((line, index) => {
      if (line.match(/^\- /)) {
        if (!inList) {
          inList = true;
          return `<ul class="list-disc ml-6 my-4">\n<li>${line.substring(2)}</li>`;
        }
        return `<li>${line.substring(2)}</li>`;
      } else if (line.match(/^[0-9]+\. /)) {
        if (!inList) {
          inList = true;
          return `<ol class="list-decimal ml-6 my-4">\n<li>${line.replace(/^[0-9]+\. /, '')}</li>`;
        }
        return `<li>${line.replace(/^[0-9]+\. /, '')}</li>`;
      } else if (inList) {
        inList = false;
        if (index > 0 && (lines[index - 1].match(/^\- /) || lines[index - 1].match(/^[0-9]+\. /))) {
          return `</ul>\n${line}`;
        }
      }
      return line;
    }).join('\n');
    
    if (inList) {
      html += '\n</ul>';
    }
    
    // Handle links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 underline">$1</a>');
    
    // Convert line breaks to paragraphs
    html = html.split('\n').map(line => {
      if (line && 
          !line.includes('<h2') && 
          !line.includes('<h3') && 
          !line.includes('<li') && 
          !line.includes('<ul') && 
          !line.includes('</ul') && 
          !line.includes('<ol') && 
          !line.includes('</ol') && 
          !line.includes('<blockquote') && 
          !line.includes('<div class="bg-')) {
        return `<p class="my-2">${line}</p>`;
      }
      return line;
    }).join('');
    
    return { __html: html };
  };

  return (
    <div 
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={renderRichText()} 
    />
  );
};
