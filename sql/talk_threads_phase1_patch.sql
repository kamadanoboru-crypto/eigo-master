-- Talk Board Phase 1: thread/reply-ready schema.
-- Existing single timeline UI can keep using talk_posts.body.

alter table talk_posts add column if not exists thread_id uuid;
alter table talk_posts add column if not exists parent_id uuid;
alter table talk_posts add column if not exists category text default 'general';
alter table talk_posts add column if not exists tags text[] default '{}';
alter table talk_posts add column if not exists reply_count int default 0;
alter table talk_posts add column if not exists last_activity_at timestamptz default now();
alter table talk_posts add column if not exists like_count int default 0;
alter table talk_posts add column if not exists dislike_count int default 0;
alter table talk_posts add column if not exists score int default 0;

create index if not exists idx_talk_posts_thread on talk_posts(thread_id, created_at asc);
create index if not exists idx_talk_posts_parent on talk_posts(parent_id);
create index if not exists idx_talk_posts_category_activity on talk_posts(category, last_activity_at desc);
create index if not exists idx_talk_posts_score on talk_posts(score desc, last_activity_at desc);

-- Future anti-spam / anti-duplication ideas:
-- 1. Limit new root threads per user per day.
-- 2. Suggest similar threads before insert by normalized title/body search.
-- 3. Let AI suggest category/tags: TOEIC, pronunciation, speaking, vocabulary, grammar.
-- 4. Rank threads by recent activity + likes + reply_count.
