
import React from 'react';

export const FormattingHelp = () => {
  return (
    <div className="text-xs text-gray-500 mt-1">
      <p><strong>Dicas de formatação:</strong></p>
      <p>- Use <code>**texto**</code> para <strong>negrito</strong></p>
      <p>- Use <code>_texto_</code> para <em>itálico</em></p>
      <p>- Use <code>__texto__</code> para <u>sublinhado</u></p>
      <p>- Use <code>## Título</code> para subtítulos</p>
      <p>- Use <code>### Título menor</code> para subtítulos menores</p>
      <p>- Use <code>- Item</code> para lista com marcadores</p>
      <p>- Use <code>1. Item</code> para lista numerada</p>
      <p>- Use <code>[texto](url)</code> para links</p>
      <p>- Use <code>::: cor</code> e <code>:::</code> para seções coloridas</p>
    </div>
  );
};
