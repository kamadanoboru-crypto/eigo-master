-- Wordbook storage + pagination/search support.
-- 保存先: saved_items(item_type='word', content->>'word')

create table if not exists saved_items (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  item_type text,
  content jsonb not null default '{}'::jsonb,
  saved_at bigint,
  created_at timestamptz default now()
);

alter table saved_items
  add column if not exists item_type text,
  add column if not exists content jsonb not null default '{}'::jsonb,
  add column if not exists saved_at bigint,
  add column if not exists created_at timestamptz default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'saved_items'
      and column_name = 'type'
  ) then
    execute 'update saved_items set item_type = coalesce(item_type, type) where item_type is null';
  end if;
end $$;

update saved_items
set item_type = coalesce(item_type, 'caption')
where item_type is null;

alter table saved_items
  alter column item_type set not null;

alter table saved_items enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'saved_items'
      and policyname = 'saved_items_allow_all'
  ) then
    create policy "saved_items_allow_all"
      on saved_items
      for all
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'saved_items'
      and policyname = 'allow_all'
  ) then
    create policy "allow_all"
      on saved_items
      for all
      using (true)
      with check (true);
  end if;
end $$;

create index if not exists idx_saved_items_wordbook_user_saved
  on saved_items (user_id, saved_at desc)
  where item_type = 'word';

create index if not exists idx_saved_items_wordbook_user_initial
  on saved_items (user_id, upper(left(content->>'word', 1)), saved_at desc)
  where item_type = 'word';

create index if not exists idx_saved_items_wordbook_word_lower
  on saved_items (user_id, lower(content->>'word'))
  where item_type = 'word';
