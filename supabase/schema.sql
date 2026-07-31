-- Ejecutar una vez en Supabase > SQL Editor.
create table if not exists public.m3_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.m3_progress enable row level security;

drop policy if exists "m3_maria_select" on public.m3_progress;
create policy "m3_maria_select" on public.m3_progress
  for select to authenticated
  using (auth.uid() = user_id and (auth.jwt() ->> 'email') = 'mariahernandezvega@gmail.com');

drop policy if exists "m3_maria_insert" on public.m3_progress;
create policy "m3_maria_insert" on public.m3_progress
  for insert to authenticated
  with check (auth.uid() = user_id and (auth.jwt() ->> 'email') = 'mariahernandezvega@gmail.com');

drop policy if exists "m3_maria_update" on public.m3_progress;
create policy "m3_maria_update" on public.m3_progress
  for update to authenticated
  using (auth.uid() = user_id and (auth.jwt() ->> 'email') = 'mariahernandezvega@gmail.com')
  with check (auth.uid() = user_id and (auth.jwt() ->> 'email') = 'mariahernandezvega@gmail.com');
