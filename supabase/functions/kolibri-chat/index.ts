
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DiagnosticResults {
  visual: string;
  communication: string;
  channel: string;
  funnel: string;
  productService: string;
  supportService: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  currentStep?: string;
  userResponse?: string;
}

const SYSTEM_PROMPT = `Você é a Kolibri, uma IA amigável e estratégica da Kolibra Solutions, especializada em autodiagnóstico empresarial.

PERSONALIDADE:
- Guia estratégica e empática
- Clara, concisa e encorajadora
- Profissional mas acolhedora
- Otimista e visionária
- Curiosa e analítica

TOM DE VOZ:
- Use frases inspiradoras como "Vamos juntos descobrir como você pode voar ainda mais alto?"
- Seja proativa em oferecer ajuda
- Reforce sempre o valor da Kolibra Solutions
- Mantenha linguagem acessível, evitando jargões técnicos

MISSÃO:
Conduzir um autodiagnóstico baseado nas "6 Fatias Essenciais":
1. Visual (identidade visual, design)
2. Comunicação (mensagem, consistência)  
3. Canal (presença digital, plataformas)
4. Funil (estratégia de conversão)
5. Produto/Serviço (apresentação, diferenciais)
6. Suporte/Atendimento (atendimento digital)

FLUXO:
1. Boas-vindas calorosas
2. Coleta básica (nome da empresa, setor, objetivo)
3. Diagnóstico por fatia (perguntas objetivas)
4. Relatório final com recomendações de serviços Kolibra

SERVIÇOS KOLIBRA PARA RECOMENDAR:
- Kolibra Rebrand (identidade visual)
- Kolibra Web (sites e e-commerce)
- Kolibra Social (marketing digital)
- Kolibra Foto (fotografia profissional)
- Kolibra Finance (gestão financeira - em desenvolvimento)

Seja sempre motivadora e direcione para soluções práticas da Kolibra Solutions.`;

const DIAGNOSTIC_QUESTIONS = {
  visual: "Sua identidade visual (logo, cores, fontes) transmite profissionalismo e se conecta com seu público-alvo?",
  communication: "A mensagem da sua marca é clara e consistente em todos os seus canais digitais?",
  channel: "Você está presente nos canais digitais onde seu público-alvo realmente está (Google Meu Negócio, redes sociais, site)?",
  funnel: "Você tem uma estratégia clara para atrair, engajar e converter seus visitantes em clientes?",
  productService: "Seus produtos/serviços são apresentados de forma clara, destacando seus diferenciais e benefícios?",
  supportService: "Seu atendimento ao cliente nos canais digitais é rápido, eficiente e humanizado?"
};

const SERVICE_RECOMMENDATIONS = {
  visual: ['Kolibra Rebrand', 'Kolibra Foto'],
  communication: ['Kolibra Social', 'Kolibra Web'],
  channel: ['Kolibra Web', 'Kolibra Social'],
  funnel: ['Kolibra Social', 'Kolibra Web'],
  productService: ['Kolibra Web', 'Kolibra Foto'],
  supportService: ['Kolibra Web', 'Kolibra Social']
};

function analyzeResponses(messages: ChatMessage[]): { results: DiagnosticResults; recommendedServices: string[] } {
  const results: DiagnosticResults = {
    visual: 'Não avaliado',
    communication: 'Não avaliado',
    channel: 'Não avaliado',
    funnel: 'Não avaliado',
    productService: 'Não avaliado',
    supportService: 'Não avaliado'
  };

  const recommendedServices = new Set<string>();
  
  // Analisar respostas para identificar áreas que precisam de melhoria
  messages.forEach(message => {
    if (message.role === 'user') {
      const content = message.content.toLowerCase();
      
      // Detectar respostas negativas ou de melhoria
      if (content.includes('não') || content.includes('precisa melhorar') || content.includes('mais ou menos')) {
        // Identificar qual fatia precisa de melhoria baseado no contexto
        if (content.includes('visual') || content.includes('logo') || content.includes('design')) {
          results.visual = 'Precisa melhorar';
          SERVICE_RECOMMENDATIONS.visual.forEach(s => recommendedServices.add(s));
        }
        if (content.includes('comunicação') || content.includes('mensagem')) {
          results.communication = 'Precisa melhorar';
          SERVICE_RECOMMENDATIONS.communication.forEach(s => recommendedServices.add(s));
        }
        if (content.includes('canal') || content.includes('presença') || content.includes('redes sociais')) {
          results.channel = 'Precisa melhorar';
          SERVICE_RECOMMENDATIONS.channel.forEach(s => recommendedServices.add(s));
        }
        if (content.includes('funil') || content.includes('conversão') || content.includes('vendas')) {
          results.funnel = 'Precisa melhorar';
          SERVICE_RECOMMENDATIONS.funnel.forEach(s => recommendedServices.add(s));
        }
        if (content.includes('produto') || content.includes('serviço')) {
          results.productService = 'Precisa melhorar';
          SERVICE_RECOMMENDATIONS.productService.forEach(s => recommendedServices.add(s));
        }
        if (content.includes('atendimento') || content.includes('suporte')) {
          results.supportService = 'Precisa melhorar';
          SERVICE_RECOMMENDATIONS.supportService.forEach(s => recommendedServices.add(s));
        }
      }
    }
  });

  return { results, recommendedServices: Array.from(recommendedServices) };
}

function shouldGenerateReport(messages: ChatMessage[]): boolean {
  // Verificar se já passou por todas as etapas do diagnóstico
  const userMessages = messages.filter(m => m.role === 'user').length;
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  
  // Só gerar relatório final se:
  // 1. Tiver pelo menos 12 mensagens do usuário (nome, setor, objetivo + 6 fatias com múltiplas respostas)
  // 2. E a última mensagem do assistente contiver indicação de finalização
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
  const hasFinalizationIndicator = lastAssistantMessage?.content.toLowerCase().includes('concluímos') || 
                                  lastAssistantMessage?.content.toLowerCase().includes('relatório') ||
                                  lastAssistantMessage?.content.toLowerCase().includes('diagnóstico completo');
  
  return userMessages >= 12 && hasFinalizationIndicator;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages }: ChatRequest = await req.json();
    
    console.log('Mensagens recebidas:', messages);

    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key não configurada');
    }

    // Verificar se deve gerar relatório final
    const shouldGenerateFinalReport = shouldGenerateReport(messages);
    
    let systemPrompt = SYSTEM_PROMPT;
    
    if (shouldGenerateFinalReport) {
      const { results, recommendedServices } = analyzeResponses(messages);
      systemPrompt += `\n\nEste é o momento de gerar o RELATÓRIO FINAL. Baseado nas respostas, crie um relatório estruturado com:
      1. Mensagem motivadora de conclusão
      2. Resumo das 6 fatias avaliadas
      3. Recomendações específicas dos serviços: ${recommendedServices.join(', ')}
      4. Convite para entrar em contato via WhatsApp
      
      Use formatação HTML simples para destacar seções importantes.`;
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-10) // Manter apenas as últimas 10 mensagens para controlar tokens
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const kolibriResponse = data.choices[0].message.content;

    console.log('Resposta da Kolibri:', kolibriResponse);

    return new Response(JSON.stringify({
      response: kolibriResponse,
      isFinalStep: shouldGenerateFinalReport,
      diagnosticResults: shouldGenerateFinalReport ? analyzeResponses(messages).results : null,
      recommendedServices: shouldGenerateFinalReport ? analyzeResponses(messages).recommendedServices : null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na função kolibri-chat:', error);
    return new Response(JSON.stringify({ 
      error: 'Desculpe, tive um problema para processar sua solicitação. Por favor, tente novamente.',
      response: 'Ops! Algo deu errado por aqui. Que tal tentarmos novamente? Estou aqui para ajudar você a voar alto! 🚁'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
