/**
 * lib/economy.ts  — サーバーサイド専用
 *
 * コイン・チケット経済ロジック
 * - ウォレット読み書き
 * - コンテンツ解放チェック
 * - デイリー上限管理
 * - インフレ対策（デイリー上限・減衰）
 */

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const READY   = Boolean(SB_URL && SB_ANON);

// ── 設定値（DB取得できない場合のデフォルト）─────────────────────
export const ECONOMY = {
  VIDEO_EXISTING_COST:    10,
  VIDEO_NEW_AI_COST:      100,
  QUIZ_COST:              5,
  GACHA_COST:             10,
  TICKET_EXPIRE_HOURS:    24,
  DAILY_COIN_LIMIT:       200,
  FREE_QUIZ_DAILY:        3,
  FREE_LISTENING_DAILY:   3,
  FREE_GACHA_DAILY:       1,
  MAX_EXTRA_GACHA_DAILY:  3,
  DECAY_MULTIPLIER:       0.8,
};

function headers() {
  return {
    apikey:         SB_ANON,
    Authorization:  `Bearer ${SB_ANON}`,
    'Content-Type': 'application/json',
  };
}

async function sbGet(table: string, filter: string): Promise<Record<string,unknown>[]> {
  if (!READY) return [];
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${table}?${filter}`, { headers: headers() });
    return r.ok ? (r.json() as Promise<Record<string,unknown>[]>) : [];
  } catch { return []; }
}

async function sbUpsert(table: string, data: Record<string,unknown>): Promise<boolean> {
  if (!READY) return false;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal,resolution=merge-duplicates' },
      body: JSON.stringify(data),
    });
    return r.ok;
  } catch { return false; }
}

async function sbInsert(table: string, data: Record<string,unknown>): Promise<boolean> {
  if (!READY) return false;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify(data),
    });
    return r.ok;
  } catch { return false; }
}

// ── ウォレット型 ──────────────────────────────────────────────
export interface Wallet {
  user_id:             string;
  coins:               number;
  video_tickets:       number;
  quiz_tickets:        number;
  translation_tickets: number;
  gacha_tickets:       number;
  daily_earned_coins:  number;
  daily_reset_date:    string;
}

const defaultWallet = (userId: string): Wallet => ({
  user_id:             userId,
  coins:               0,
  video_tickets:       0,
  quiz_tickets:        0,
  translation_tickets: 0,
  gacha_tickets:       0,
  daily_earned_coins:  0,
  daily_reset_date:    new Date().toISOString().split('T')[0],
});

// ── ウォレット取得（なければ作成）────────────────────────────
export async function getWallet(userId: string): Promise<Wallet> {
  if (!READY) return defaultWallet(userId);
  const rows = await sbGet('user_wallet', `user_id=eq.${encodeURIComponent(userId)}&limit=1`);
  if (rows.length) {
    const w = rows[0] as unknown as Wallet;
    // デイリーリセット確認
    const today = new Date().toISOString().split('T')[0];
    if (w.daily_reset_date !== today) {
      w.daily_earned_coins = 0;
      w.daily_reset_date   = today;
      await sbUpsert('user_wallet', {
        user_id: userId, daily_earned_coins: 0, daily_reset_date: today,
      });
    }
    return w;
  }
  // 新規作成
  const w = defaultWallet(userId);
  await sbUpsert('user_wallet', w);
  return w;
}

// ── コイン付与（デイリー上限・減衰を適用）────────────────────
export async function addCoins(
  userId: string,
  amount: number,
  opts: { decay?: boolean } = {},
): Promise<{ added: number; total: number; limitReached: boolean }> {
  const wallet = await getWallet(userId);
  const today  = new Date().toISOString().split('T')[0];

  // デイリーリセット
  const dailyEarned = wallet.daily_reset_date === today ? wallet.daily_earned_coins : 0;
  const remaining   = Math.max(0, ECONOMY.DAILY_COIN_LIMIT - dailyEarned);

  if (remaining <= 0) {
    return { added: 0, total: wallet.coins, limitReached: true };
  }

  // 減衰適用（opts.decay === true の場合）
  const finalAmount = Math.min(
    remaining,
    opts.decay ? Math.max(1, Math.floor(amount * ECONOMY.DECAY_MULTIPLIER)) : amount,
  );

  const newCoins       = wallet.coins + finalAmount;
  const newDailyEarned = dailyEarned + finalAmount;

  await sbUpsert('user_wallet', {
    user_id:            userId,
    coins:              newCoins,
    daily_earned_coins: newDailyEarned,
    daily_reset_date:   today,
    updated_at:         new Date().toISOString(),
  });

  console.log(`[economy] +${finalAmount} coins → ${newCoins} (daily: ${newDailyEarned}/${ECONOMY.DAILY_COIN_LIMIT})`);
  return { added: finalAmount, total: newCoins, limitReached: newDailyEarned >= ECONOMY.DAILY_COIN_LIMIT };
}

// ── コイン消費 ────────────────────────────────────────────────
export async function spendCoins(
  userId: string,
  amount: number,
): Promise<{ ok: boolean; remaining: number; message?: string }> {
  const wallet = await getWallet(userId);
  if (wallet.coins < amount) {
    return { ok: false, remaining: wallet.coins, message: `コインが不足しています（必要: ${amount}, 所持: ${wallet.coins}）` };
  }
  const newCoins = wallet.coins - amount;
  await sbUpsert('user_wallet', { user_id: userId, coins: newCoins, updated_at: new Date().toISOString() });
  console.log(`[economy] -${amount} coins → ${newCoins}`);
  return { ok: true, remaining: newCoins };
}

// ── チケット消費 ──────────────────────────────────────────────
type TicketType = 'video_tickets' | 'quiz_tickets' | 'translation_tickets' | 'gacha_tickets';

export async function spendTicket(
  userId: string,
  ticketType: TicketType,
): Promise<{ ok: boolean; remaining: number }> {
  const wallet = await getWallet(userId);
  const current = (wallet[ticketType] as number) ?? 0;
  if (current <= 0) return { ok: false, remaining: 0 };
  const newVal = current - 1;
  await sbUpsert('user_wallet', { user_id: userId, [ticketType]: newVal });
  return { ok: true, remaining: newVal };
}

// ── コンテンツ解放チェック ────────────────────────────────────
export interface UnlockRecord {
  content_type: string;
  content_id:   string;
  unlock_type:  string;
  expires_at:   string | null;
}

export async function checkUnlocked(
  userId: string,
  contentType: string,
  contentId: string,
): Promise<{ unlocked: boolean; record?: UnlockRecord }> {
  if (!READY) return { unlocked: false };
  const rows = await sbGet(
    'unlocked_content',
    `user_id=eq.${encodeURIComponent(userId)}&content_type=eq.${contentType}&content_id=eq.${encodeURIComponent(contentId)}&limit=1`,
  );
  if (!rows.length) return { unlocked: false };
  const rec = rows[0] as unknown as UnlockRecord;
  // 期限チェック
  if (rec.expires_at && new Date(rec.expires_at) < new Date()) {
    return { unlocked: false };
  }
  return { unlocked: true, record: rec };
}

// ── コンテンツを解放記録 ──────────────────────────────────────
export async function recordUnlock(opts: {
  userId:      string;
  contentType: string;
  contentId:   string;
  unlockType:  'coin' | 'ticket' | 'free';
  coinsSpent?: number;
  expireHours?: number | null;
}): Promise<boolean> {
  const { userId, contentType, contentId, unlockType, coinsSpent = 0, expireHours = null } = opts;
  const expiresAt = expireHours
    ? new Date(Date.now() + expireHours * 3600000).toISOString()
    : null;
  return sbUpsert('unlocked_content', {
    user_id:      userId,
    content_type: contentType,
    content_id:   contentId,
    unlock_type:  unlockType,
    coins_spent:  coinsSpent,
    unlocked_at:  new Date().toISOString(),
    expires_at:   expiresAt,
  });
}

// ── デイリー報酬取得 ──────────────────────────────────────────
export interface DailyReward {
  free_gacha_used:     number;
  extra_gacha_count:   number;
  quiz_free_used:      number;
  listening_free_used: number;
}

export async function getDailyReward(userId: string): Promise<DailyReward> {
  const today = new Date().toISOString().split('T')[0];
  if (!READY) return { free_gacha_used: 0, extra_gacha_count: 0, quiz_free_used: 0, listening_free_used: 0 };
  const rows = await sbGet('daily_rewards', `user_id=eq.${encodeURIComponent(userId)}&reward_date=eq.${today}&limit=1`);
  if (rows.length) return rows[0] as unknown as DailyReward;
  return { free_gacha_used: 0, extra_gacha_count: 0, quiz_free_used: 0, listening_free_used: 0 };
}

export async function updateDailyReward(
  userId: string,
  patch: Partial<DailyReward>,
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await sbUpsert('daily_rewards', { user_id: userId, reward_date: today, ...patch });
}

// ── ガチャ抽選（weight管理）──────────────────────────────────
interface GachaReward {
  reward_type:  string;
  reward_key:   string;
  reward_value: number;
  weight:       number;
}

const LOCAL_GACHA_TABLE: GachaReward[] = [
  { reward_type:'coin',               reward_key:'coins_5',              reward_value:5,   weight:200 },
  { reward_type:'coin',               reward_key:'coins_10',             reward_value:10,  weight:180 },
  { reward_type:'coin',               reward_key:'coins_20',             reward_value:20,  weight:120 },
  { reward_type:'coin',               reward_key:'coins_50',             reward_value:50,  weight:50  },
  { reward_type:'coin',               reward_key:'coins_100',            reward_value:100, weight:20  },
  { reward_type:'quiz_ticket',        reward_key:'quiz_ticket_1',        reward_value:1,   weight:150 },
  { reward_type:'quiz_ticket',        reward_key:'quiz_ticket_3',        reward_value:3,   weight:60  },
  { reward_type:'video_ticket',       reward_key:'video_ticket_1',       reward_value:1,   weight:80  },
  { reward_type:'translation_ticket', reward_key:'translation_ticket_1', reward_value:1,   weight:70  },
  { reward_type:'gacha_ticket',       reward_key:'gacha_ticket_1',       reward_value:1,   weight:60  },
  { reward_type:'gacha_ticket',       reward_key:'gacha_ticket_3',       reward_value:3,   weight:10  },
];

export async function drawGacha(opts: {
  userId:    string;
  lastRewardType?: string;  // インフレ対策: 連続高額排出防止
}): Promise<GachaReward & { emoji: string; text: string }> {
  // DB からガチャテーブルを取得（失敗時はローカル）
  let table = LOCAL_GACHA_TABLE;
  if (READY) {
    const rows = await sbGet('gacha_rewards', 'is_active=eq.true');
    if (rows.length) table = rows as unknown as GachaReward[];
  }

  // インフレ対策: coins_50 以上を連続排出しない
  let finalTable = table;
  if (opts.lastRewardType === 'coin') {
    finalTable = table.map(r =>
      r.reward_type === 'coin' && r.reward_value >= 50
        ? { ...r, weight: Math.floor(r.weight * 0.2) }
        : r
    );
  }

  // weight抽選
  const total = finalTable.reduce((s, r) => s + r.weight, 0);
  let rand    = Math.floor(Math.random() * total);
  let prize   = finalTable[finalTable.length - 1];
  for (const r of finalTable) {
    rand -= r.weight;
    if (rand <= 0) { prize = r; break; }
  }

  const EMOJI: Record<string, string> = {
    coin: prize.reward_value >= 50 ? '💎' : prize.reward_value >= 20 ? '🌟' : prize.reward_value >= 10 ? '✨' : '⭐',
    quiz_ticket:        '📝',
    video_ticket:       '🎬',
    translation_ticket: '🌐',
    gacha_ticket:       '🎰',
  };
  const TEXT: Record<string, string> = {
    coin:               `${prize.reward_value} コイン獲得！`,
    quiz_ticket:        `クイズチケット ×${prize.reward_value}`,
    video_ticket:       `動画チケット ×${prize.reward_value}`,
    translation_ticket: `翻訳チケット ×${prize.reward_value}`,
    gacha_ticket:       `ガチャチケット ×${prize.reward_value}`,
  };

  return {
    ...prize,
    emoji: EMOJI[prize.reward_type] ?? '🎁',
    text:  TEXT[prize.reward_type]  ?? `${prize.reward_value} 獲得！`,
  };
}
