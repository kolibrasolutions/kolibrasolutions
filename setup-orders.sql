-- Primeiro, vamos criar a função que todos os triggers vão usar (se já existir, não tem problema)
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Agora vamos criar a tabela de pedidos
create table if not exists public.orders (
  id serial primary key,
  user_id uuid references auth.users on delete cascade,
  status text not null default 'Solicitado',
  total_price decimal(10,2) default 0,
  budget_status text check (budget_status in ('pending', 'waiting_approval', 'approved', 'rejected')) default 'pending',
  admin_notes text,
  payment_plan jsonb,
  current_installment integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Remover o trigger se já existir (para evitar erros)
drop trigger if exists handle_updated_at_orders on public.orders;

-- Criar o trigger para orders com nome único
create trigger handle_updated_at_orders
  before update on public.orders
  for each row
  execute procedure public.handle_updated_at();

-- Criar a tabela de itens do pedido
create table if not exists public.order_items (
  id serial primary key,
  order_id integer references public.orders(id) on delete cascade,
  service_id integer references public.services(id) on delete restrict,
  quantity integer not null default 1,
  price_at_order decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Remover o trigger se já existir (para evitar erros)
drop trigger if exists handle_updated_at_order_items on public.order_items;

-- Criar o trigger para order_items com nome único
create trigger handle_updated_at_order_items
  before update on public.order_items
  for each row
  execute procedure public.handle_updated_at(); 