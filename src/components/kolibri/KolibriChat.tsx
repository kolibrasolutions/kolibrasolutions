
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DiagnosticResults {
  visual: string;
  communication: string;
  channel: string;
  funnel: string;
  productService: string;
  supportService: string;
}

interface KolibriChatProps {
  isWidget?: boolean;
  onClose?: () => void;
}

const KolibriChat: React.FC<KolibriChatProps> = ({ isWidget = false, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá! Eu sou a Kolibri, sua guia para o crescimento digital. 🚁✨\n\nQue tal fazermos um autodiagnóstico rápido para descobrir como sua empresa pode voar ainda mais alto?\n\nVamos começar: qual é o nome da sua empresa?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResults | null>(null);
  const [recommendedServices, setRecommendedServices] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('kolibri-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.isFinalStep) {
        setShowFinalReport(true);
        setDiagnosticResults(data.diagnosticResults);
        setRecommendedServices(data.recommendedServices || []);
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Desculpe, tive um problema para processar sua mensagem. Por favor, tente novamente! 😊',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`${isWidget ? 'w-96 h-[600px]' : 'w-full max-w-4xl mx-auto h-[700px]'} flex flex-col shadow-xl`}>
      <ChatHeader isWidget={isWidget} onClose={onClose} />
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          showFinalReport={showFinalReport}
          recommendedServices={recommendedServices}
          messagesEndRef={messagesEndRef}
        />
        
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </CardContent>
    </Card>
  );
};

export default KolibriChat;
