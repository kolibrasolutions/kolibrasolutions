-- Inserir serviços de exemplo
INSERT INTO services (name, description, category, price, is_package, package_items, estimated_delivery_days, is_active) VALUES 

-- Presença Digital
('Kolibra Visível - Presença Local', 'Aumente sua visibilidade no Google, redes sociais e canais locais.', 'Presença Digital', 1500.00, true, 
 '[
   "Google Meu Negócio otimizado",
   "Perfil no Instagram e WhatsApp",
   "Link integrado de catálogo e contatos",
   "Configuração de redes sociais"
 ]'::jsonb, 
 10, true),

-- Identidade Visual
('Kolibra Rebrand - Identidade', 'Criação ou reformulação completa da identidade da marca.', 'Identidade Visual', 2500.00, true,
 '[
   "Logo e identidade visual",
   "Manual da marca e tom de voz",
   "Templates para redes sociais",
   "Manifesto e essência da marca",
   "Aplicações da marca"
 ]'::jsonb,
 15, true),

-- Sites e E-commerce
('Kolibra Express Site - Site/Loja Virtual', 'Sites institucionais ou lojas prontas com plataforma amigável.', 'Sites e E-commerce', 3000.00, true,
 '[
   "Site ou loja NuvemShop",
   "Integração redes sociais e pagamentos",
   "Layout exclusivo",
   "Domínio e treinamento",
   "Otimização SEO básica"
 ]'::jsonb,
 20, true),

-- Marketing de Conteúdo
('Kolibra Conteúdo - Estratégia', 'Conteúdo profissional e estratégico para redes sociais.', 'Marketing de Conteúdo', null, true,
 '[
   "Posts feed e stories",
   "Roteiro para reels/carrosséis",
   "Planejamento mensal de conteúdo",
   "Calendário editorial",
   "Análise de performance"
 ]'::jsonb,
 7, true),

-- Produção Audiovisual
('Kolibra Reels Studio / Foto', 'Produção audiovisual profissional (vídeo e foto).', 'Produção Audiovisual', null, true,
 '[
   "Gravação e edição de reels",
   "Sessão de fotos profissional",
   "Tratamento de imagens",
   "Roteiro criativo",
   "Entrega em alta qualidade"
 ]'::jsonb,
 5, true),

-- Vendas e Conversão
('Kolibra Social Sales - Tráfego e Vendas', 'Estratégias para vendas diretas em redes sociais.', 'Vendas e Conversão', null, true,
 '[
   "Catálogo de produtos integrado",
   "Estratégias de funil digital",
   "Otimização de rotas de compra/bio",
   "Configuração de WhatsApp Business",
   "Análise de conversão"
 ]'::jsonb,
 12, true),

-- Consultoria
('Consultoria Digital Personalizada', 'Análise completa e estratégia digital sob medida para seu negócio.', 'Consultoria', null, false,
 '[
   "Diagnóstico digital completo",
   "Plano estratégico personalizado",
   "Mentoria de implementação",
   "Relatório de oportunidades"
 ]'::jsonb,
 3, true),

-- Manutenção
('Manutenção de Site Mensal', 'Manutenção técnica e atualizações mensais do seu site.', 'Manutenção', 300.00, false,
 '[
   "Atualizações de segurança",
   "Backup mensal",
   "Monitoramento de performance",
   "Suporte técnico"
 ]'::jsonb,
 1, true);

-- Verificar se os dados foram inseridos
SELECT * FROM services ORDER BY category, name; 