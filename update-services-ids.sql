-- Primeiro, vamos limpar a sequência para garantir que podemos definir IDs específicos
ALTER SEQUENCE services_id_seq RESTART WITH 1;

-- Agora vamos atualizar os serviços existentes para ter os mesmos IDs do frontend
UPDATE services SET id = 1 WHERE name LIKE '%Visível%';
UPDATE services SET id = 2 WHERE name LIKE '%Rebrand%';
UPDATE services SET id = 3 WHERE name LIKE '%Express Site%';
UPDATE services SET id = 4 WHERE name LIKE '%Conteúdo%';
UPDATE services SET id = 5 WHERE name LIKE '%Reels%';
UPDATE services SET id = 6 WHERE name LIKE '%Social Sales%';

-- Ajustar a sequência para o próximo ID disponível
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services)); 