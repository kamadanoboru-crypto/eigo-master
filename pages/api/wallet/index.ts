/**
 * GET  /api/wallet?userId=xxx  → ウォレット取得
 * POST /api/wallet              → コイン加算 / チケット付与
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { ECONOMY, getDailyReward, getWallet, addCoins, spendCoins, spendTicket, refundCoins } from '../../../lib/economy';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const wallet = await getWallet(userId);
    const daily = await getDailyReward(userId);
    const maxAdGacha = ECONOMY.MAX_EXTRA_GACHA_DAILY - ECONOMY.FREE_GACHA_DAILY;
    const gachaDaily = {
      freeLeft: Math.max(0, ECONOMY.FREE_GACHA_DAILY - daily.free_gacha_used),
      adLeft: Math.max(0, maxAdGacha - daily.extra_gacha_count),
      dailyLeft: Math.max(0, ECONOMY.MAX_EXTRA_GACHA_DAILY - daily.free_gacha_used - daily.extra_gacha_count),
    };
    console.log('[GACHA_API_WALLET_GET]', {
      userId,
      walletUserId: wallet.user_id,
      freeLeft: gachaDaily.freeLeft,
      adLeft: gachaDaily.adLeft,
      dailyLeft: gachaDaily.dailyLeft,
      hasUsedToday: gachaDaily.freeLeft <= 0,
      daily,
      buildSha: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'local',
      vercelEnv: process.env.VERCEL_ENV ?? 'local',
      builtAt: process.env.NEXT_PUBLIC_BUILD_TIME ?? 'unknown',
    });
    return res.status(200).json({
      ...wallet,
      gacha_daily: gachaDaily,
    });
  }

  if (req.method === 'POST') {
    const { userId, action, amount, ticketType, decay } = req.body as {
      userId:     string;
      action:     'add' | 'spend' | 'spendTicket' | 'refund';
      amount?:    number;
      ticketType?: string;
      decay?:     boolean;
    };
    if (!userId || !action) return res.status(400).json({ error: 'userId, action required' });

    if (action === 'add') {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'coin add is disabled in production' });
      }
      const result = await addCoins(userId, amount ?? 0, { decay });
      return res.status(200).json(result);
    }
    if (action === 'spend') {
      const result = await spendCoins(userId, amount ?? 0);
      return res.status(200).json(result);
    }
    if (action === 'refund') {
      const result = await refundCoins(userId, amount ?? 0);
      return res.status(200).json(result);
    }
    if (action === 'spendTicket') {
      const result = await spendTicket(userId, ticketType as any);
      return res.status(200).json(result);
    }
    return res.status(400).json({ error: 'unknown action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
