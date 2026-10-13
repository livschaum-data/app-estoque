-- Execute no SQL Editor do mesmo projeto Supabase usado pelo Aplicativo_cardapio.
-- Segue o padrão user_id + id com chave composta usado em cardapio_dados.
create table if not exists public.home_inventory (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null default 'principal',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- Migra as versões iniciais desta tabela, se já tiverem sido criadas.
do $$
declare
  pk_name text;
begin
  -- A primeira versão usava id uuid para guardar o usuário.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'home_inventory'
      and column_name = 'id' and data_type = 'uuid'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'home_inventory'
      and column_name = 'user_id'
  ) then
    alter table public.home_inventory rename column id to user_id;
  end if;

  -- Adiciona o identificador de registro da despensa usado pelo app_cardapio.
  alter table public.home_inventory
    add column if not exists id text not null default 'principal';

  -- Mantém uma chave composta user_id,id, compatível com o upsert do aplicativo.
  select constraint_name into pk_name
  from information_schema.table_constraints
  where table_schema = 'public' and table_name = 'home_inventory'
    and constraint_type = 'PRIMARY KEY'
  limit 1;

  if pk_name is not null then
    execute format('alter table public.home_inventory drop constraint %I', pk_name);
  end if;

  alter table public.home_inventory
    add constraint home_inventory_pkey primary key (user_id, id);
end $$;

alter table public.home_inventory enable row level security;

-- Visitantes não acessam a tabela; a conta autenticada acessa só a própria linha.
revoke all on table public.home_inventory from anon, authenticated;

drop policy if exists "Each user reads own home inventory" on public.home_inventory;
create policy "Each user reads own home inventory"
  on public.home_inventory for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Each user creates own home inventory" on public.home_inventory;
create policy "Each user creates own home inventory"
  on public.home_inventory for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Each user updates own home inventory" on public.home_inventory;
create policy "Each user updates own home inventory"
  on public.home_inventory for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.home_inventory to authenticated;

-- Bucket privado para fotos. Os objetos ficam organizados em uma pasta por usuário.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('home-inventory-photos', 'home-inventory-photos', false, 5242880, array['image/jpeg'])
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg'];

drop policy if exists "Users read own home inventory photos" on storage.objects;
create policy "Users read own home inventory photos"
  on storage.objects for select to authenticated
  using (bucket_id = 'home-inventory-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users upload own home inventory photos" on storage.objects;
create policy "Users upload own home inventory photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'home-inventory-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users delete own home inventory photos" on storage.objects;
create policy "Users delete own home inventory photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'home-inventory-photos' and (storage.foldername(name))[1] = auth.uid()::text);
