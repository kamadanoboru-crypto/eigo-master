-- Shared video quality votes.
-- Safe to run multiple times. Existing user_videos rows are preserved.

alter table user_videos add column if not exists like_count int default 0;
alter table user_videos add column if not exists dislike_count int default 0;

create table if not exists video_votes (
  video_id text not null,
  user_id text not null,
  vote_type int not null check (vote_type in (1, -1)),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (video_id, user_id)
);

create index if not exists idx_user_videos_quality
  on user_videos(like_count desc, dislike_count asc, added_at desc);

create index if not exists idx_video_votes_video
  on video_votes(video_id, vote_type);
