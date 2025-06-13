
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateWhatsAppMessage = () => {
    let message = 'Olá Kolibra Solutions! Fiz o autodiagnóstico com a Kolibri e identifiquei que preciso de ajuda com: ';
    
    if (recommendedServices.length > 0) {
      message += recommendedServices.join(', ') + '. ';
    } else {
      message += 'minha presença digital. ';
    }
    
    message += 'Gostaria de saber mais sobre como vocês podem me ajudar a voar alto!';
    
    return encodeURIComponent(message);
  };

  const WhatsAppButton = () => {
    const whatsappNumber = '5511999999999'; // Substitua pelo número real
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`;
    
    return (
      <div className="text-center py-6">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20B95C] text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 animate-pulse shadow-lg"
        >
          <MessageCircle className="mr-3 h-6 w-6" />
          Fale Conosco no WhatsApp!
        </a>
      </div>
    );
  };

  return (
    <Card className={`${isWidget ? 'w-96 h-[600px]' : 'w-full max-w-4xl mx-auto h-[700px]'} flex flex-col shadow-xl`}>
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
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-kolibra-blue text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div 
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {showFinalReport && <WhatsAppButton />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {!showFinalReport && (
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-kolibra-orange hover:bg-amber-500"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KolibriChat;
