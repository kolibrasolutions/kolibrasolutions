-- Configurar políticas de acesso para orders
create policy "Usuários podem ver seus próprios pedidos"
  on orders for select
  using (auth.uid() = user_id);

create policy "Admins podem ver todos os pedidos"
  on orders for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

create policy "Usuários podem criar pedidos"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "Admins podem atualizar pedidos"
  on orders for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

-- Configurar políticas de acesso para order_items
create policy "Usuários podem ver itens dos seus pedidos"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins podem ver todos os itens"
  on order_items for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

create policy "Usuários podem criar itens de pedido"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Habilitar RLS (Row Level Security)
alter table orders enable row level security;
alter table order_items enable row level security;

-- Garantir que anon tem acesso de leitura aos serviços
create policy "Público pode ver serviços ativos"
  on services for select
  using (is_active = true);

-- Permitir que usuários autenticados vejam outros usuários (necessário para mostrar nome do cliente)
create policy "Usuários autenticados podem ver outros usuários"
  on users for select
  using (auth.role() = 'authenticated');

-- Garantir acesso público aos serviços
alter table services enable row level security; 