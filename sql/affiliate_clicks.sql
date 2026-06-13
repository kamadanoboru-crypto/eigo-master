create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id text null,
  affiliate_name text not null check (affiliate_name in ('study_sapuri', 'cambly') or affiliate_name <> ''),
  screen_name text not null default 'unknown',
  placement text not null default 'unknown',
  clicked_at timestamptz not null default now(),
  card_key text null,
  card_title text null,
  toeic_score integer null
);

create index if not exists affiliate_clicks_clicked_at_idx
  on public.affiliate_clicks (clicked_at desc);

create index if not exists affiliate_clicks_affiliate_name_idx
  on public.affiliate_clicks (affiliate_name, clicked_at desc);

create index if not exists affiliate_clicks_user_id_idx
  on public.affiliate_clicks (user_id, clicked_at desc);
