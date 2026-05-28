// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  addCoins,
  drawGacha,
  ECONOMY,
  getDailyReward,
  getWallet,
  updateDailyReward,
} from '../../../lib/economy';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, payWith = 'free', lastRewardType } = req.body as {
    userId: string;
    payWith: 'free' | 'ad' | 'coin' | 'ticket';
    lastRewardType?: string;
  };
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const daily = await getDailyReward(userId);
  const wallet = await getWallet(userId);
  const totalGachaToday = daily.free_gacha_used + daily.extra_gacha_count;
  const maxAdGacha = ECONOMY.MAX_EXTRA_GACHA_DAILY - ECONOMY.FREE_GACHA_DAILY;

  if (totalGachaToday >= ECONOMY.MAX_EXTRA_GACHA_DAILY) {
    return res.status(400).json({
      ok: false,
      message: `本日のガチャ上限（${ECONOMY.MAX_EXTRA_GACHA_DAILY}回）に達しました`,
      daily,
      freeLeft: Math.max(0, ECONOMY.FREE_GACHA_DAILY - daily.free_gacha_used),
      adLeft: Math.max(0, maxAdGacha - daily.extra_gacha_count),
    });
  }

  if (payWith === 'free') {
    if (daily.free_gacha_used >= ECONOMY.FREE_GACHA_DAILY) {
      return res.status(400).json({
        ok: false,
        message: '本日の無料ガチャは使用済みです。追加は広告視聴で引けます',
        daily,
        freeLeft: 0,
        adLeft: Math.max(0, maxAdGacha - daily.extra_gacha_count),
      });
    }
    await updateDailyReward(userId, { free_gacha_used: daily.free_gacha_used + 1 });
  } else if (payWith === 'ad') {
    if (daily.extra_gacha_count >= maxAdGacha) {
      return res.status(400).json({
        ok: false,
        message: '本日の広告ガチャ上限に達しました',
        daily,
        freeLeft: Math.max(0, ECONOMY.FREE_GACHA_DAILY - daily.free_gacha_used),
        adLeft: 0,
      });
    }
    await updateDailyReward(userId, { extra_gacha_count: daily.extra_gacha_count + 1 });
  } else {
    return res.status(400).json({
      ok: false,
      message: '追加ガチャは広告視聴で引けます',
      daily,
    });
  }

  const prize = await drawGacha({ userId, lastRewardType });

  let newCoins = wallet.coins;
  const result = await addCoins(userId, prize.reward_value);
  newCoins = result.total;

  const freeUsed = daily.free_gacha_used + (payWith === 'free' ? 1 : 0);
  const extraUsed = daily.extra_gacha_count + (payWith === 'ad' ? 1 : 0);

  console.log(`[gacha] ${userId.slice(0, 8)} -> ${prize.reward_key}`);
  return res.status(200).json({
    ok: true,
    prize,
    newCoins,
    dailyLeft: Math.max(0, ECONOMY.MAX_EXTRA_GACHA_DAILY - freeUsed - extraUsed),
    freeLeft: Math.max(0, ECONOMY.FREE_GACHA_DAILY - freeUsed),
    adLeft: Math.max(0, maxAdGacha - extraUsed),
  });
}
