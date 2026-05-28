create extension if not exists pgcrypto;

create table if not exists advice_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  created_at timestamptz not null default now(),
  coins_used integer not null default 0,
  toeic_estimate integer,
  study_summary jsonb not null default '{}'::jsonb,
  ai_advice jsonb not null default '{}'::jsonb,
  recommended_sites jsonb not null default '[]'::jsonb,
  referenced_history_ids jsonb not null default '[]'::jsonb,
  ai_provider text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists advice_history_user_created_idx
  on advice_history (user_id, created_at desc);

alter table advice_history enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'advice_history'
      and policyname = 'own'
  ) then
    create policy "own" on advice_history for all using (true) with check (true);
  end if;
end $$;
