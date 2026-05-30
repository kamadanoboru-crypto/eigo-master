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

update talk_posts
set thread_id = id
where parent_id is null
  and thread_id is null;

update talk_posts
set score = coalesce(like_count, 0) - coalesce(dislike_count, 0)
where score is null
   or score <> coalesce(like_count, 0) - coalesce(dislike_count, 0);

create table if not exists talk_votes (
  post_id uuid not null references talk_posts(id) on delete cascade,
  user_id text not null,
  vote int not null check (vote in (1, -1)),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (post_id, user_id)
);

create index if not exists idx_talk_votes_post on talk_votes(post_id, vote);

alter table talk_votes enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'talk_posts' and policyname = 'talk_posts_update_all') then
    create policy "talk_posts_update_all" on talk_posts for update using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'talk_votes' and policyname = 'talk_votes_rw') then
    create policy "talk_votes_rw" on talk_votes for all using (true) with check (true);
  end if;
end $$;

-- Future anti-spam / anti-duplication ideas:
-- 1. Limit new root threads per user per day.
-- 2. Suggest similar threads before insert by normalized title/body search.
-- 3. Let AI suggest category/tags: TOEIC, pronunciation, speaking, vocabulary, grammar.
-- 4. Rank threads by recent activity + likes + reply_count.
