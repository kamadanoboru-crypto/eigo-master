alter table if exists video_captions
  add column if not exists start numeric default 0;

alter table if exists video_captions
  add column if not exists duration numeric default 0;

create index if not exists idx_video_captions_timing
  on video_captions(video_id, caption_index, start, duration);

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'video_captions'
      and policyname = 'allow_u'
  ) then
    create policy "allow_u" on video_captions
      for update using (true) with check (true);
  end if;
end $$;
