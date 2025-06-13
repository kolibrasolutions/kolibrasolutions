
import React from 'react';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import WhatsAppButton from './WhatsAppButton';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  showFinalReport: boolean;
  recommendedServices: string[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  showFinalReport,
  recommendedServices,
  messagesEndRef
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          role={message.role}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
      
      {isLoading && <LoadingIndicator />}
      
      {showFinalReport && <WhatsAppButton recommendedServices={recommendedServices} />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
