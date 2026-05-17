// @ts-nocheck
/**
 * POST /api/wallet/gacha
 * ガチャを引く（デイリー上限・インフレ対策付き）
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getWallet, spendCoins, addCoins, getDailyReward, updateDailyReward, drawGacha, ECONOMY,
} from '../../../lib/economy';

// ウォレットへのチケット付与
const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

async function addTicket(userId: string, type: string, amount: number) {
  if (!SB_URL) return;
  const colMap: Record<string,string> = {
    quiz_ticket:        'quiz_tickets',
    video_ticket:       'video_tickets',
    translation_ticket: 'translation_tickets',
    gacha_ticket:       'gacha_tickets',
  };
  const col = colMap[type];
  if (!col) return;

  // 現在値を取得して加算
  const wallet = await getWallet(userId);
  const current = (wallet as any)[col] ?? 0;
  await fetch(`${SB_URL}/rest/v1/user_wallet?user_id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: {
      apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal',
    },
    body: JSON.stringify({ [col]: current + amount }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, payWith, lastRewardType } = req.body as {
    userId:         string;
    payWith:        'free' | 'coin' | 'ticket';
    lastRewardType?: string;
  };
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const daily  = await getDailyReward(userId);
  const wallet = await getWallet(userId);

  // ── デイリー上限チェック ───────────────────────────────────
  const totalGachaToday = daily.free_gacha_used + daily.extra_gacha_count;
  if (totalGachaToday >= ECONOMY.MAX_EXTRA_GACHA_DAILY) {
    return res.status(400).json({
      ok: false,
      message: `本日のガチャ上限（${ECONOMY.MAX_EXTRA_GACHA_DAILY}回）に達しました`,
      daily,
    });
  }

  // ── 支払い処理 ────────────────────────────────────────────
  if (payWith === 'free') {
    if (daily.free_gacha_used >= ECONOMY.FREE_GACHA_DAILY) {
      return res.status(400).json({ ok: false, message: '本日の無料ガチャは使用済みです', daily });
    }
    await updateDailyReward(userId, { free_gacha_used: daily.free_gacha_used + 1 });

  } else if (payWith === 'coin') {
    const { ok, message, remaining } = await spendCoins(userId, ECONOMY.GACHA_COST);
    if (!ok) return res.status(400).json({ ok: false, message, remaining });
    await updateDailyReward(userId, { extra_gacha_count: daily.extra_gacha_count + 1 });

  } else if (payWith === 'ticket') {
    if ((wallet.gacha_tickets ?? 0) <= 0) {
      return res.status(400).json({ ok: false, message: 'ガチャチケットがありません' });
    }
    // チケット消費
    await addTicket(userId, 'gacha_ticket', -1);
    await updateDailyReward(userId, { extra_gacha_count: daily.extra_gacha_count + 1 });
  }

  // ── 抽選 ─────────────────────────────────────────────────
  const prize = await drawGacha({ userId, lastRewardType });

  // ── 報酬付与 ─────────────────────────────────────────────
  let newCoins = wallet.coins;
  if (prize.reward_type === 'coin') {
    const result = await addCoins(userId, prize.reward_value);
    newCoins = result.total;
  } else {
    await addTicket(userId, prize.reward_type, prize.reward_value);
  }

  console.log(`[gacha] ${userId.slice(0,8)} → ${prize.reward_key}`);
  return res.status(200).json({
    ok:         true,
    prize,
    newCoins,
    dailyLeft:  ECONOMY.MAX_EXTRA_GACHA_DAILY - totalGachaToday - 1,
  });
}
