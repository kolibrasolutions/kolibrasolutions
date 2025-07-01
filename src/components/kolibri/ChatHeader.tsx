
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface ChatHeaderProps {
  isWidget?: boolean;
  onClose?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isWidget = false, onClose }) => {
  return (
    <CardHeader className="bg-gradient-to-r from-kolibra-blue to-blue-700 text-white p-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-kolibra-orange rounded-full mr-3 flex items-center justify-center">
            🚁
          </div>
          Kolibri - Autodiagnóstico Empresarial
        </div>
        {isWidget && onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            ×
          </Button>
        )}
      </CardTitle>
    </CardHeader>
  );
};

export default ChatHeader;
