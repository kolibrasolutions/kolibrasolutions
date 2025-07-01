
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExpandableChatHeader, ExpandableChatBody, ExpandableChatFooter } from '@/components/ui/expandable-chat';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { MessageLoading } from '@/components/ui/message-loading';
import WhatsAppButton from './WhatsAppButton';

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

// Para manter a imagem do Kolibri IA:
const KOLIBRI_AVATAR = "/lovable-uploads/a99a7ff6-4e2f-4da7-b458-9f64d60dcc9e.png";
const USER_AVATAR = undefined; // pode usar a imagem default do avatar

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Adaptação para auto scroll
  const bottomDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomDivRef.current) {
      bottomDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

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

  // Renderização dos bubbles
  const renderMessages = () => (
    <>
      {messages.map((message, idx) => {
        const isUser = message.role === 'user';
        return (
          <ChatBubble
            key={idx}
            variant={isUser ? "sent" : "received"}
          >
            <ChatBubbleAvatar
              src={isUser ? USER_AVATAR : KOLIBRI_AVATAR}
              fallback={isUser ? "US" : "AI"}
            />
            <ChatBubbleMessage variant={isUser ? "sent" : "received"}>
              <span dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, "<br />") }} />
              <div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</div>
            </ChatBubbleMessage>
          </ChatBubble>
        );
      })}
      {isLoading && (
        <ChatBubble variant="received">
          <ChatBubbleAvatar src={KOLIBRI_AVATAR} fallback="AI" />
          <ChatBubbleMessage isLoading />
        </ChatBubble>
      )}
      <div ref={bottomDivRef} />
    </>
  );

  return (
    <>
      <ExpandableChatHeader className="bg-gradient-to-r from-kolibra-blue to-blue-700 text-white flex-col items-start text-left min-h-20">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-kolibra-orange rounded-full mr-3 flex items-center justify-center text-xl">
            🚁
          </div>
          <div className="font-bold">Kolibri - Autodiagnóstico Empresarial</div>
        </div>
        {isWidget && onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-white rounded-full px-3 py-1 hover:bg-white/20"
          >
            ×
          </button>
        )}
        <div className="text-xs mt-1 font-normal">Diagnóstico rápido do seu negócio digital!</div>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList>
          {renderMessages()}
        </ChatMessageList>
        {showFinalReport && (
          <WhatsAppButton recommendedServices={recommendedServices} />
        )}
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <form
          className="flex gap-2"
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <ChatInput
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            ref={inputRef as any}
            className="flex-1"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-kolibra-orange hover:bg-amber-500 rounded-lg px-4 py-2 font-semibold text-white transition"
          >
            Enviar
          </button>
        </form>
      </ExpandableChatFooter>
    </>
  );
};

export default KolibriChat;
