-- Criar a tabela de usuários se não existir
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('user', 'admin', 'partner')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar a função para atualizar o timestamp de updated_at
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

-- Criar o trigger para atualizar o timestamp
create trigger handle_updated_at_users
  before update on public.users
  for each row
  execute procedure public.handle_updated_at();

-- Criar a tabela de serviços
create table if not exists public.services (
  id serial primary key,
  name text not null,
  description text,
  category text not null,
  price decimal(10,2),
  is_package boolean default false,
  package_items jsonb,
  estimated_delivery_days integer,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar o trigger para atualizar o timestamp em services
create trigger handle_updated_at_services
  before update on public.services
  for each row
  execute procedure public.handle_updated_at();

-- Criar a tabela de pedidos
create table if not exists public.orders (
  id serial primary key,
  user_id uuid references public.users(id) on delete cascade,
  status text not null default 'Solicitado',
  total_price decimal(10,2) default 0,
  budget_status text check (budget_status in ('pending', 'waiting_approval', 'approved', 'rejected')) default 'pending',
  admin_notes text,
  payment_plan jsonb,
  current_installment integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar o trigger para atualizar o timestamp em orders
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

-- Criar o trigger para atualizar o timestamp em order_items
create trigger handle_updated_at_order_items
  before update on public.order_items
  for each row
  execute procedure public.handle_updated_at(); 