
import React from 'react';

interface RichTextContentProps {
  content: string;
  className?: string;
}

export const RichTextContent: React.FC<RichTextContentProps> = ({ content, className = '' }) => {
  // Process the Markdown-like content to HTML
  const renderContent = () => {
    let html = content;
    
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
    
    // Wrap lists in ul/ol tags
    let inList = false;
    let listType = '';
    html = html.split('\n').map(line => {
      if (line.includes('<li class="list-disc')) {
        if (!inList || listType !== 'ul') {
          // Close previous list if needed
          const prefix = inList ? '</'+listType+'>\n<ul>' : '<ul>';
          inList = true;
          listType = 'ul';
          return prefix + line;
        }
        return line;
      } else if (line.includes('<li class="list-decimal')) {
        if (!inList || listType !== 'ol') {
          // Close previous list if needed
          const prefix = inList ? '</'+listType+'>\n<ol>' : '<ol>';
          inList = true;
          listType = 'ol';
          return prefix + line;
        }
        return line;
      } else if (inList && (line.trim() === '' || line.includes('<h') || line.includes('<blockquote'))) {
        inList = false;
        return '</'+listType+'>\n' + line;
      }
      return line;
    }).join('\n');
    
    // Close any open list at the end
    if (inList) {
      html += '\n</'+listType+'>';
    }
    
    // Convert line breaks to paragraphs for remaining content
    html = html.split('\n').map(line => {
      if (line && 
          !line.includes('<h2') && 
          !line.includes('<h3') && 
          !line.includes('<li') && 
          !line.includes('<blockquote') && 
          !line.includes('<div class="bg-') &&
          !line.includes('<ul') &&
          !line.includes('<ol') &&
          !line.includes('</ul') &&
          !line.includes('</ol')) {
        return `<p class="my-2">${line}</p>`;
      }
      return line;
    }).join('');
    
    return { __html: html };
  };

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={renderContent()} 
    />
  );
};
