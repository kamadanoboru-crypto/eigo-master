-- ============================================================
-- 英語マスター Supabase スキーマ v5
-- Supabase > SQL Editor に貼り付けて Run
-- ============================================================

-- ① ユーザーが追加した動画
create table if not exists user_videos (
  id            uuid default gen_random_uuid() primary key,
  user_id       text not null,
  video_id      text not null,
  title         text,
  channel_title text,
  thumbnail     text,
  added_at      timestamptz default now(),
  unique(user_id, video_id)
);

-- ② AI生成済み字幕（全ユーザー共有）
create table if not exists video_captions (
  id            uuid default gen_random_uuid() primary key,
  video_id      text not null,
  caption_index int  not null,
  english       text not null,
  chunks        jsonb,
  meaning       jsonb,
  created_at    timestamptz default now(),
  unique(video_id, caption_index)
);

-- ③ 学習ログ（ユーザー別）
create table if not exists learning_logs (
  id         uuid default gen_random_uuid() primary key,
  user_id    text not null,
  type       text not null,
  correct    int  default 0,
  total      int  default 0,
  score      int  default 0,
  meta       jsonb,
  created_at timestamptz default now()
);

-- ④ 保存アイテム（ユーザー別）
create table if not exists saved_items (
  id         uuid default gen_random_uuid() primary key,
  user_id    text not null,
  item_type  text not null,
  content    jsonb not null,
  saved_at   bigint,
  created_at timestamptz default now()
);

-- ⑤ マイリスト（ユーザー別）
create table if not exists my_playlist (
  id            uuid default gen_random_uuid() primary key,
  user_id       text not null,
  video_id      text not null,
  title         text,
  channel_title text,
  thumbnail     text,
  created_at    timestamptz default now(),
  unique(user_id, video_id)
);

-- ⑥ ポイント（ユーザー別）
create table if not exists user_points (
  user_id    text primary key,
  points     int  default 120,
  updated_at timestamptz default now()
);

-- ⑦ クイズキャッシュ（全ユーザー共有）
-- 問題データはここに保存、全ユーザーで再利用する
-- user_id には依存しない
drop table if exists quiz_cache;
create table quiz_cache (
  id          uuid      default gen_random_uuid() primary key,
  cache_key   text      unique,
  quiz_type   text,
  source_type text,
  source_id   text,
  level       text,
  data        jsonb,
  created_by  uuid,
  created_at  timestamp default now(),
  expires_at  timestamp
);

-- インデックス
create index if not exists idx_user_videos_user    on user_videos(user_id);
create index if not exists idx_video_captions_vid  on video_captions(video_id);
create index if not exists idx_learning_logs_user  on learning_logs(user_id, type);
create index if not exists idx_saved_items_user    on saved_items(user_id);
create index if not exists idx_quiz_cache_key      on quiz_cache(cache_key);
create index if not exists idx_quiz_cache_type     on quiz_cache(quiz_type, source_type);

-- RLS 有効化
alter table user_videos    enable row level security;
alter table video_captions enable row level security;
alter table learning_logs  enable row level security;
alter table saved_items    enable row level security;
alter table my_playlist    enable row level security;
alter table user_points    enable row level security;
alter table quiz_cache     enable row level security;

-- RLS ポリシー（開発用: 全員OK）
-- 本番は auth.uid() ベースに変更すること
create policy "allow_all" on user_videos    for all using (true) with check (true);
create policy "allow_r"   on video_captions for select using (true);
create policy "allow_w"   on video_captions for insert using (true) with check (true);
create policy "allow_all" on learning_logs  for all using (true) with check (true);
create policy "allow_all" on saved_items    for all using (true) with check (true);
create policy "allow_all" on my_playlist    for all using (true) with check (true);
create policy "allow_all" on user_points    for all using (true) with check (true);
create policy "allow_r"   on quiz_cache     for select using (true);
create policy "allow_i"   on quiz_cache     for insert using (true) with check (true);
create policy "allow_u"   on quiz_cache     for update using (true) with check (true);

-- ================================================================
-- 経済システム追加テーブル（v5）
-- ================================================================

-- ⑧ ユーザーウォレット
create table if not exists user_wallet (
  user_id             text primary key,
  coins               int  default 0,
  video_tickets       int  default 0,
  quiz_tickets        int  default 0,
  translation_tickets int  default 0,
  gacha_tickets       int  default 0,
  total_earned_coins  int  default 0,   -- 累計獲得（インフレ監視用）
  daily_earned_coins  int  default 0,   -- 本日獲得（上限管理）
  daily_reset_date    date default current_date,
  updated_at          timestamptz default now()
);

-- ⑨ 解放済みコンテンツ
create table if not exists unlocked_content (
  id           uuid default gen_random_uuid() primary key,
  user_id      text not null,
  content_type text not null,   -- 'video' | 'quiz' | 'translation'
  content_id   text not null,   -- video_id, quiz cache_key 等
  unlock_type  text not null,   -- 'coin' | 'ticket' | 'free'
  coins_spent  int  default 0,
  unlocked_at  timestamptz default now(),
  expires_at   timestamptz default null,  -- null = 永久
  unique(user_id, content_type, content_id)
);

-- ⑩ デイリー報酬管理
create table if not exists daily_rewards (
  id                 uuid default gen_random_uuid() primary key,
  user_id            text not null,
  reward_date        date not null,
  free_gacha_used    int  default 0,   -- 当日無料ガチャ使用回数
  extra_gacha_count  int  default 0,   -- 動画視聴等で得た追加ガチャ
  quiz_free_used     int  default 0,   -- 無料クイズ使用回数
  listening_free_used int default 0,   -- 無料リスニング使用回数
  unique(user_id, reward_date)
);

-- ⑪ ガチャ報酬テーブル（weight管理）
create table if not exists gacha_rewards (
  id           uuid default gen_random_uuid() primary key,
  reward_type  text not null,   -- 'coin' | 'quiz_ticket' | 'video_ticket' | 'translation_ticket' | 'gacha_ticket'
  reward_key   text not null,   -- 'coins_10' | 'quiz_ticket_1' 等
  reward_value int  not null,   -- 数量
  weight       int  not null,   -- 抽選重み（合計1000想定）
  is_active    boolean default true
);

-- ⑫ 経済設定（管理用）
create table if not exists economy_settings (
  key   text primary key,
  value text not null,
  note  text
);

-- RLS
alter table user_wallet        enable row level security;
alter table unlocked_content   enable row level security;
alter table daily_rewards      enable row level security;
alter table gacha_rewards      enable row level security;
alter table economy_settings   enable row level security;

create policy "own" on user_wallet        for all using (true) with check (true);
create policy "own" on unlocked_content   for all using (true) with check (true);
create policy "own" on daily_rewards      for all using (true) with check (true);
create policy "pub_r" on gacha_rewards    for select using (true);
create policy "pub_r" on economy_settings for select using (true);

-- インデックス
create index if not exists idx_unlocked_content_user   on unlocked_content(user_id, content_type);
create index if not exists idx_unlocked_content_key    on unlocked_content(user_id, content_type, content_id);
create index if not exists idx_daily_rewards_user_date on daily_rewards(user_id, reward_date);

-- ================================================================
-- 初期データ: ガチャ報酬テーブル（weight合計=1000）
-- ================================================================
insert into gacha_rewards (reward_type, reward_key, reward_value, weight) values
  ('coin',               'coins_5',              5,   200),
  ('coin',               'coins_10',            10,   180),
  ('coin',               'coins_20',            20,   120),
  ('coin',               'coins_50',            50,    50),
  ('coin',               'coins_100',          100,    20),
  ('quiz_ticket',        'quiz_ticket_1',        1,   150),
  ('quiz_ticket',        'quiz_ticket_3',        3,    60),
  ('video_ticket',       'video_ticket_1',       1,    80),
  ('translation_ticket', 'translation_ticket_1', 1,    70),
  ('gacha_ticket',       'gacha_ticket_1',       1,    60),
  ('gacha_ticket',       'gacha_ticket_3',       3,    10)
on conflict do nothing;

-- ================================================================
-- 初期データ: 経済設定
-- ================================================================
insert into economy_settings (key, value, note) values
  ('video_existing_cost',    '10',   '既存翻訳動画のコイン解放コスト'),
  ('video_new_ai_cost',      '100',  '新規AI翻訳のコイン解放コスト'),
  ('quiz_cost',              '5',    'クイズ1回のコイン'),
  ('gacha_cost',             '10',   'ガチャ1回のコイン'),
  ('ticket_expire_hours',    '24',   'チケット解放の有効時間（時間）'),
  ('daily_coin_limit',       '200',  '1日のコイン獲得上限'),
  ('free_quiz_daily',        '3',    '1日の無料クイズ回数'),
  ('free_listening_daily',   '3',    '1日の無料リスニング・シャドーイング回数'),
  ('free_gacha_daily',       '1',    '1日の無料ガチャ回数'),
  ('max_extra_gacha_daily',  '3',    '1日の最大ガチャ回数（無料+追加）'),
  ('decay_multiplier',       '0.8',  'コイン獲得減衰率（同じ行動の2回目以降）')
on conflict do nothing;

-- ================================================================
-- SNS・ランキング追加テーブル（v6）
-- ================================================================

-- ⑬ ユーザープロフィール（ニックネーム等）
create table if not exists profiles (
  user_id      text primary key,
  nickname     text not null default '',
  avatar_emoji text default '🎓',
  bio          text default '',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ⑭ ユーザー翻訳投稿
create table if not exists user_translations (
  id           uuid default gen_random_uuid() primary key,
  user_id      text not null,
  video_id     text not null,
  caption_index int  not null,
  english      text not null,    -- 元の英文
  translation  text not null,    -- ユーザーの翻訳
  is_verified  boolean default false,
  like_count   int  default 0,
  dislike_count int default 0,
  score        int  default 0,   -- like_count - dislike_count
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ⑮ 翻訳への投票（1ユーザー1票）
create table if not exists translation_votes (
  id             uuid default gen_random_uuid() primary key,
  translation_id uuid not null references user_translations(id) on delete cascade,
  user_id        text not null,
  vote           int  not null check (vote in (1, -1)),  -- 1=👍 -1=👎
  created_at     timestamptz default now(),
  unique(translation_id, user_id)
);

-- ⑯ 広告クリックログ（アフィリエイト）
create table if not exists affiliate_clicks (
  id           uuid default gen_random_uuid() primary key,
  user_id      text not null,
  card_key     text not null,    -- 'basic' | 'toeic' | 'conversation'
  card_title   text,
  toeic_score  int,              -- クリック時のTOEIC予想スコア
  clicked_at   timestamptz default now()
);

-- インデックス
create index if not exists idx_profiles_user           on profiles(user_id);
create index if not exists idx_user_translations_video on user_translations(video_id, caption_index);
create index if not exists idx_user_translations_score on user_translations(score desc);
create index if not exists idx_translation_votes_trans on translation_votes(translation_id);
create index if not exists idx_affiliate_clicks_user   on affiliate_clicks(user_id);

-- RLS
alter table profiles             enable row level security;
alter table user_translations    enable row level security;
alter table translation_votes    enable row level security;
alter table affiliate_clicks     enable row level security;

create policy "own"   on profiles          for all using (true) with check (true);
create policy "pub_r" on user_translations for select using (true);
create policy "own_w" on user_translations for insert using (true) with check (true);
create policy "own_u" on user_translations for update using (true) with check (true);
create policy "own"   on translation_votes for all using (true) with check (true);
create policy "own_w" on affiliate_clicks  for insert using (true) with check (true);
