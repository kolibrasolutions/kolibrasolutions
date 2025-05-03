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
create trigger handle_updated_at
  before update on public.users
  for each row
  execute procedure public.handle_updated_at(); 