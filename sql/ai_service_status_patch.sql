create table if not exists ai_service_status (
  service text primary key,
  status text not null default 'unknown',
  source text,
  message text,
  detail text,
  provider_priority text,
  occurred_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table ai_service_status enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_service_status'
      and policyname = 'ai_service_status_read'
  ) then
    create policy "ai_service_status_read"
      on ai_service_status for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_service_status'
      and policyname = 'ai_service_status_write'
  ) then
    create policy "ai_service_status_write"
      on ai_service_status for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'ai_service_status'
      and policyname = 'ai_service_status_update'
  ) then
    create policy "ai_service_status_update"
      on ai_service_status for update using (true) with check (true);
  end if;
end $$;
