alter table affiliate_clicks
  add column if not exists affiliate_name text,
  add column if not exists screen_name text;

create index if not exists idx_affiliate_clicks_affiliate_name on affiliate_clicks(affiliate_name);
create index if not exists idx_affiliate_clicks_screen_name on affiliate_clicks(screen_name);
