-- Part5 product tables: shared question bank, per-user attempts, community explanations.
-- Run this once in Supabase SQL Editor.

create table if not exists grammar_questions (
  id          uuid default gen_random_uuid() primary key,
  question_no bigserial unique,
  source      text default 'toeic',
  level       text default 'level_600',
  sentence    text not null unique,
  ja          text,
  options     jsonb not null,
  correct     text not null,
  explanation text,
  category    text,
  created_by  text,
  created_at  timestamptz default now()
);

create table if not exists grammar_attempts (
  id          uuid default gen_random_uuid() primary key,
  user_id     text not null,
  question_id uuid not null references grammar_questions(id) on delete cascade,
  selected    text not null,
  is_correct  boolean not null,
  mode        text default 'test',
  created_at  timestamptz default now()
);

create table if not exists grammar_explanations (
  id             uuid default gen_random_uuid() primary key,
  question_id    uuid not null references grammar_questions(id) on delete cascade,
  author_user_id text,
  source         text default 'user',
  body           text not null,
  score          int default 0,
  created_at     timestamptz default now()
);

create table if not exists grammar_explanation_votes (
  id             uuid default gen_random_uuid() primary key,
  user_id        text not null,
  explanation_id uuid not null references grammar_explanations(id) on delete cascade,
  value          int default 1,
  created_at     timestamptz default now(),
  unique(user_id, explanation_id)
);

create table if not exists grammar_question_votes (
  id          uuid default gen_random_uuid() primary key,
  user_id     text not null,
  question_id uuid not null references grammar_questions(id) on delete cascade,
  value       int default 1,
  created_at  timestamptz default now(),
  unique(user_id, question_id)
);

create index if not exists idx_grammar_questions_no on grammar_questions(question_no);
create index if not exists idx_grammar_attempts_user_q on grammar_attempts(user_id, question_id, created_at desc);
create index if not exists idx_grammar_attempts_q on grammar_attempts(question_id);
create index if not exists idx_grammar_explanations_q on grammar_explanations(question_id, score desc);
create index if not exists idx_grammar_question_votes_q on grammar_question_votes(question_id);
create unique index if not exists idx_grammar_explanations_user_question
  on grammar_explanations(question_id, author_user_id)
  where source = 'user' and author_user_id is not null;

alter table grammar_questions enable row level security;
alter table grammar_attempts enable row level security;
alter table grammar_explanations enable row level security;
alter table grammar_explanation_votes enable row level security;
alter table grammar_question_votes enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'grammar_questions' and policyname = 'grammar_questions_rw') then
    create policy "grammar_questions_rw" on grammar_questions for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'grammar_attempts' and policyname = 'grammar_attempts_rw') then
    create policy "grammar_attempts_rw" on grammar_attempts for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'grammar_explanations' and policyname = 'grammar_explanations_rw') then
    create policy "grammar_explanations_rw" on grammar_explanations for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'grammar_explanation_votes' and policyname = 'grammar_explanation_votes_rw') then
    create policy "grammar_explanation_votes_rw" on grammar_explanation_votes for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'grammar_question_votes' and policyname = 'grammar_question_votes_rw') then
    create policy "grammar_question_votes_rw" on grammar_question_votes for all using (true) with check (true);
  end if;
end $$;
