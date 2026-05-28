-- ============================================================
-- Gacha balance patch
-- Daily flow: 1 free gacha + up to 6 ad gachas.
-- Expected payout: roughly 5 minutes of study per gacha.
-- Safe to run multiple times.
-- ============================================================

insert into economy_settings (key, value, note) values
  ('free_gacha_daily', '1', '1日の無料ガチャ回数'),
  ('max_extra_gacha_daily', '7', '1日のガチャ総上限。無料1回 + 広告ガチャ6回')
on conflict (key) do update set
  value = excluded.value,
  note = excluded.note;

delete from gacha_rewards;

insert into gacha_rewards (reward_type, reward_key, reward_value, weight, is_active) values
  ('coin', 'coins_8', 8, 300, true),
  ('coin', 'coins_12', 12, 260, true),
  ('coin', 'coins_16', 16, 180, true),
  ('coin', 'coins_24', 24, 70, true),
  ('coin', 'coins_40', 40, 18, true),
  ('quiz_ticket', 'quiz_ticket_1', 1, 45, true),
  ('translation_ticket', 'translation_ticket_1', 1, 35, true),
  ('video_ticket', 'video_ticket_1', 1, 18, true);
