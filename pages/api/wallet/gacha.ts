// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  addCoins,
  drawGacha,
  ECONOMY,
  getDailyReward,
  updateDailyReward,
} from '../../../lib/economy';

function getGachaLeft(daily: {
  free_gacha_used: number;
  extra_gacha_count: number;
}) {
  const maxAdGacha = ECONOMY.MAX_EXTRA_GACHA_DAILY - ECONOMY.FREE_GACHA_DAILY;
  return {
    freeLeft: Math.max(0, ECONOMY.FREE_GACHA_DAILY - daily.free_gacha_used),
    adLeft: Math.max(0, maxAdGacha - daily.extra_gacha_count),
    dailyLeft: Math.max(
      0,
      ECONOMY.MAX_EXTRA_GACHA_DAILY - daily.free_gacha_used - daily.extra_gacha_count,
    ),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, payWith = 'free', lastRewardType } = req.body as {
    userId: string;
    payWith: 'free' | 'ad' | 'coin' | 'ticket';
    lastRewardType?: string;
  };
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const daily = await getDailyReward(userId);
  const left = getGachaLeft(daily);

  if (left.dailyLeft <= 0) {
    return res.status(400).json({
      ok: false,
      message: `本日のガチャ上限（${ECONOMY.MAX_EXTRA_GACHA_DAILY}回）に達しました`,
      daily,
      ...left,
    });
  }

  if (payWith === 'free' && left.freeLeft <= 0) {
    return res.status(400).json({
      ok: false,
      message: '本日の無料ガチャは使用済みです。追加は広告視聴で引けます',
      daily,
      ...left,
    });
  }

  if (payWith === 'ad' && left.adLeft <= 0) {
    return res.status(400).json({
      ok: false,
      message: '本日の広告ガチャ上限に達しました',
      daily,
      ...left,
    });
  }

  if (payWith !== 'free' && payWith !== 'ad') {
    return res.status(400).json({
      ok: false,
      message: '追加ガチャは広告視聴で引けます',
      daily,
      ...left,
    });
  }

  const nextDaily = {
    ...daily,
    free_gacha_used: daily.free_gacha_used + (payWith === 'free' ? 1 : 0),
    extra_gacha_count: daily.extra_gacha_count + (payWith === 'ad' ? 1 : 0),
  };
  const dailyUpdated = await updateDailyReward(userId, nextDaily);
  if (!dailyUpdated) {
    return res.status(500).json({
      ok: false,
      message: 'ガチャ回数の更新に失敗しました。時間をおいて再度お試しください',
      daily,
      ...left,
    });
  }

  const prize = await drawGacha({ userId, lastRewardType });
  const result = await addCoins(userId, prize.reward_value);

  console.log(`[gacha] ${userId.slice(0, 8)} -> ${prize.reward_key}`);
  return res.status(200).json({
    ok: true,
    prize,
    newCoins: result.total,
    daily: nextDaily,
    ...getGachaLeft(nextDaily),
  });
}
