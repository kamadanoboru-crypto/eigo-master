-- ============================================================
-- AI shared cache patch
-- Generated AI results are reused across users to reduce API cost.
-- Safe to run multiple times.
-- ============================================================

create table if not exists ai_cache (
  cache_key text primary key,
  kind text not null,
  mode text not null,
  input_hash text not null,
  payload jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_ai_cache_kind_mode on ai_cache(kind, mode);
create index if not exists idx_ai_cache_updated on ai_cache(updated_at desc);

alter table ai_cache enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ai_cache' and policyname = 'ai_cache_read'
  ) then
    create policy "ai_cache_read" on ai_cache for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ai_cache' and policyname = 'ai_cache_insert'
  ) then
    create policy "ai_cache_insert" on ai_cache for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ai_cache' and policyname = 'ai_cache_update'
  ) then
    create policy "ai_cache_update" on ai_cache for update using (true) with check (true);
  end if;
end $$;
