-- Adicionar novas colunas à tabela services
ALTER TABLE services 
  ADD COLUMN IF NOT EXISTS is_package boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS package_items jsonb,
  ADD COLUMN IF NOT EXISTS estimated_delivery_days integer,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Atualizar colunas existentes para permitir null se necessário
ALTER TABLE services
  ALTER COLUMN price DROP NOT NULL; 