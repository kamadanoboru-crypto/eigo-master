-- Economy rate update for English Base.
-- Run this in Supabase SQL Editor if you want DB-side reference values to match the app.

insert into economy_settings (key, value, note) values
  ('video_existing_cost', '100', '動画生成コスト'),
  ('video_new_ai_cost', '100', '新規動画生成コスト'),
  ('practice_cost', '5', '練習1回のコイン'),
  ('quiz_cost', '10', 'テスト1回のコイン'),
  ('ai_call_cost', '5', '各種AI呼び出しコスト'),
  ('gacha_cost', '0', '追加ガチャは広告視聴のみ'),
  ('free_gacha_daily', '1', '1日の無料ガチャ回数'),
  ('max_extra_gacha_daily', '7', '1日の無料+広告ガチャ最大回数')
on conflict (key) do update set
  value = excluded.value,
  note = excluded.note;

delete from gacha_rewards;

insert into gacha_rewards (reward_type, reward_key, reward_value, weight) values
  ('coin', 'coins_50', 50, 3),
  ('coin', 'coins_30', 30, 10),
  ('coin', 'coins_20', 20, 20),
  ('coin', 'coins_10', 10, 30),
  ('coin', 'coins_5',  5,  37);
