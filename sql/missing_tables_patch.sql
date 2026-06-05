-- ============================================================
-- Eigo Base missing tables patch
-- Safe to run multiple times. Existing tables/data are preserved.
-- ============================================================

create table if not exists user_videos (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  video_id text not null,
  title text,
  channel_title text,
  thumbnail text,
  added_at timestamptz default now(),
  unique(user_id, video_id)
);

create table if not exists video_captions (
  id uuid default gen_random_uuid() primary key,
  video_id text not null,
  caption_index int not null,
  english text not null,
  chunks jsonb,
  meaning jsonb,
  start numeric default 0,
  duration numeric default 0,
  created_at timestamptz default now(),
  unique(video_id, caption_index)
);

create table if not exists user_wallet (
  user_id text primary key,
  coins int default 0,
  video_tickets int default 0,
  quiz_tickets int default 0,
  translation_tickets int default 0,
  gacha_tickets int default 0,
  total_earned_coins int default 0,
  daily_earned_coins int default 0,
  daily_reset_date date default current_date,
  updated_at timestamptz default now()
);

create table if not exists unlocked_content (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  content_type text not null,
  content_id text not null,
  unlock_type text not null,
  coins_spent int default 0,
  unlocked_at timestamptz default now(),
  expires_at timestamptz default null,
  unique(user_id, content_type, content_id)
);

create table if not exists daily_rewards (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  reward_date date not null,
  free_gacha_used int default 0,
  extra_gacha_count int default 0,
  quiz_free_used int default 0,
  listening_free_used int default 0,
  unique(user_id, reward_date)
);

create table if not exists gacha_rewards (
  id uuid default gen_random_uuid() primary key,
  reward_type text not null,
  reward_key text not null,
  reward_value int not null,
  weight int not null,
  is_active boolean default true
);

create table if not exists economy_settings (
  key text primary key,
  value text not null,
  note text
);

create table if not exists profiles (
  user_id text primary key,
  nickname text not null default '',
  avatar_emoji text default '🎓',
  bio text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists translation_votes (
  id uuid default gen_random_uuid() primary key,
  translation_id uuid not null references user_translations(id) on delete cascade,
  user_id text not null,
  vote int not null check (vote in (1, -1)),
  created_at timestamptz default now(),
  unique(translation_id, user_id)
);

create table if not exists talk_posts (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  nickname text not null default '匿名',
  avatar_emoji text default '🎓',
  body text not null,
  created_at timestamptz default now()
);

create table if not exists transcript_cache (
  video_id text primary key,
  segments jsonb not null,
  sentences jsonb not null,
  timed_sentences jsonb not null default '[]'::jsonb,
  seg_count int not null default 0,
  fetched_at timestamptz default now()
);

alter table transcript_cache
  add column if not exists timed_sentences jsonb not null default '[]'::jsonb;

create table if not exists ai_cache (
  cache_key text primary key,
  kind text not null,
  mode text not null,
  input_hash text not null,
  payload jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_user_videos_user on user_videos(user_id);
create index if not exists idx_video_captions_vid on video_captions(video_id);
create index if not exists idx_unlocked_content_user on unlocked_content(user_id, content_type);
create index if not exists idx_unlocked_content_key on unlocked_content(user_id, content_type, content_id);
create index if not exists idx_daily_rewards_user_date on daily_rewards(user_id, reward_date);
create index if not exists idx_profiles_user on profiles(user_id);
create index if not exists idx_translation_votes_trans on translation_votes(translation_id);
create index if not exists idx_talk_posts_created on talk_posts(created_at desc);
create index if not exists idx_transcript_cache_fetched on transcript_cache(fetched_at);
create index if not exists idx_ai_cache_kind_mode on ai_cache(kind, mode);
create index if not exists idx_ai_cache_updated on ai_cache(updated_at desc);

alter table user_videos enable row level security;
alter table video_captions enable row level security;
alter table user_wallet enable row level security;
alter table unlocked_content enable row level security;
alter table daily_rewards enable row level security;
alter table gacha_rewards enable row level security;
alter table economy_settings enable row level security;
alter table profiles enable row level security;
alter table translation_votes enable row level security;
alter table talk_posts enable row level security;
alter table transcript_cache enable row level security;
alter table ai_cache enable row level security;

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
create index if not exists advice_history_user_created_idx on advice_history (user_id, created_at desc);
alter table advice_history enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_videos' and policyname = 'allow_all') then
    create policy "allow_all" on user_videos for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'video_captions' and policyname = 'allow_r') then
    create policy "allow_r" on video_captions for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'video_captions' and policyname = 'allow_w') then
    create policy "allow_w" on video_captions for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'video_captions' and policyname = 'allow_u') then
    create policy "allow_u" on video_captions for update using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_wallet' and policyname = 'own') then
    create policy "own" on user_wallet for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'unlocked_content' and policyname = 'own') then
    create policy "own" on unlocked_content for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'daily_rewards' and policyname = 'own') then
    create policy "own" on daily_rewards for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'gacha_rewards' and policyname = 'pub_r') then
    create policy "pub_r" on gacha_rewards for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'economy_settings' and policyname = 'pub_r') then
    create policy "pub_r" on economy_settings for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'own') then
    create policy "own" on profiles for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'translation_votes' and policyname = 'own') then
    create policy "own" on translation_votes for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'talk_posts' and policyname = 'pub_r') then
    create policy "pub_r" on talk_posts for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'talk_posts' and policyname = 'own_w') then
    create policy "own_w" on talk_posts for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transcript_cache' and policyname = 'tc_pub_r') then
    create policy "tc_pub_r" on transcript_cache for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transcript_cache' and policyname = 'tc_pub_w') then
    create policy "tc_pub_w" on transcript_cache for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'transcript_cache' and policyname = 'tc_pub_u') then
    create policy "tc_pub_u" on transcript_cache for update using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'ai_cache' and policyname = 'ai_cache_read') then
    create policy "ai_cache_read" on ai_cache for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'ai_cache' and policyname = 'ai_cache_insert') then
    create policy "ai_cache_insert" on ai_cache for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'ai_cache' and policyname = 'ai_cache_update') then
    create policy "ai_cache_update" on ai_cache for update using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'advice_history' and policyname = 'own') then
    create policy "own" on advice_history for all using (true) with check (true);
  end if;
end $$;

insert into gacha_rewards (reward_type, reward_key, reward_value, weight) values
  ('coin', 'coins_5', 5, 200),
  ('coin', 'coins_10', 10, 180),
  ('coin', 'coins_20', 20, 120),
  ('coin', 'coins_50', 50, 50),
  ('coin', 'coins_100', 100, 20),
  ('quiz_ticket', 'quiz_ticket_1', 1, 150),
  ('quiz_ticket', 'quiz_ticket_3', 3, 60),
  ('video_ticket', 'video_ticket_1', 1, 80),
  ('translation_ticket', 'translation_ticket_1', 1, 70),
  ('gacha_ticket', 'gacha_ticket_1', 1, 60),
  ('gacha_ticket', 'gacha_ticket_3', 3, 10)
on conflict do nothing;

insert into economy_settings (key, value, note) values
  ('video_existing_cost', '10', '既存翻訳動画のコイン解放コスト'),
  ('video_new_ai_cost', '100', '新規AI翻訳のコイン解放コスト'),
  ('quiz_cost', '5', 'クイズ1回のコイン'),
  ('gacha_cost', '10', 'ガチャ1回のコイン'),
  ('ticket_expire_hours', '24', 'チケット解放の有効時間'),
  ('daily_coin_limit', '200', '1日のコイン獲得上限'),
  ('free_quiz_daily', '3', '1日の無料クイズ回数'),
  ('free_listening_daily', '3', '1日の無料リスニング回数'),
  ('free_gacha_daily', '1', '1日の無料ガチャ回数'),
  ('max_extra_gacha_daily', '3', '1日の最大ガチャ回数'),
  ('decay_multiplier', '0.8', 'コイン獲得減衰率')
on conflict do nothing;
