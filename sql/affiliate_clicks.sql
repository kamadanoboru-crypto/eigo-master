create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id text null,
  affiliate_name text null,
  screen_name text not null default 'unknown',
  placement text not null default 'unknown',
  clicked_at timestamptz not null default now(),
  card_key text null,
  card_title text null,
  toeic_score integer null
);

alter table public.affiliate_clicks
  add column if not exists user_id text null,
  add column if not exists affiliate_name text null,
  add column if not exists screen_name text not null default 'unknown',
  add column if not exists placement text not null default 'unknown',
  add column if not exists clicked_at timestamptz not null default now(),
  add column if not exists card_key text null,
  add column if not exists card_title text null,
  add column if not exists toeic_score integer null;

update public.affiliate_clicks
set affiliate_name = coalesce(
  affiliate_name,
  nullif(card_key, ''),
  'unknown'
)
where affiliate_name is null;

update public.affiliate_clicks
set screen_name = coalesce(nullif(screen_name, ''), nullif(card_key, ''), 'unknown')
where screen_name is null or screen_name = '';

update public.affiliate_clicks
set placement = coalesce(nullif(placement, ''), nullif(screen_name, ''), 'unknown')
where placement is null or placement = '';

alter table public.affiliate_clicks
  alter column affiliate_name set default 'unknown',
  alter column affiliate_name set not null,
  alter column screen_name set default 'unknown',
  alter column screen_name set not null,
  alter column placement set default 'unknown',
  alter column placement set not null,
  alter column clicked_at set default now(),
  alter column clicked_at set not null;

create index if not exists affiliate_clicks_clicked_at_idx
  on public.affiliate_clicks (clicked_at desc);

create index if not exists affiliate_clicks_affiliate_name_idx
  on public.affiliate_clicks (affiliate_name, clicked_at desc);

create index if not exists affiliate_clicks_user_id_idx
  on public.affiliate_clicks (user_id, clicked_at desc);
