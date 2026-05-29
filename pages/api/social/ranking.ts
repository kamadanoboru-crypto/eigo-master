// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function headers() {
  return { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, 'Content-Type': 'application/json' };
}

function periodSince(period: string) {
  const now = new Date();
  if (period === 'daily') {
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
  }
  if (period === 'weekly') {
    now.setDate(now.getDate() - 7);
    return now.toISOString();
  }
  return '';
}

async function sb(path: string) {
  if (!SB_URL || !SB_ANON) return [];
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: headers() });
  return r.ok ? r.json().catch(() => []) : [];
}

function profileFallback(userId: string) {
  return { user_id: userId, nickname: userId ? `Guest${userId.slice(-4)}` : 'Guest', avatar: 'EB' };
}

async function attachProfiles(rows: any[], ownId: string) {
  const ids = Array.from(new Set([...rows.map(r => r.user_id).filter(Boolean), ownId].filter(Boolean)));
  const profiles = ids.length
    ? await sb(`profiles?user_id=in.(${ids.map(encodeURIComponent).join(',')})`)
    : [];
  return rows.map(row => {
    const p = profiles.find((item: any) => item.user_id === row.user_id) ?? profileFallback(row.user_id);
    return {
      ...row,
      nickname: p.nickname ?? profileFallback(row.user_id).nickname,
      avatar: p.avatar_emoji ?? p.avatar ?? 'EB',
    };
  });
}

function ensureOwn(rows: any[], ownId: string, type: string) {
  if (!ownId || rows.some(row => row.user_id === ownId)) return rows;
  return [...rows, {
    user_id: ownId,
    nickname: `Guest${ownId.slice(-4)}`,
    avatar: 'EB',
    points: 0,
    coins_spent: 0,
    score: 0,
    isSelfFallback: true,
    rank: rows.length + 1,
    type,
  }];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { type = 'points', limit = '50', period = 'all', userId = '' } = req.query as { type?: string; limit?: string; period?: string; userId?: string };
  if (!SB_URL || !SB_ANON) return res.status(200).json({ ranking: ensureOwn([], String(userId || ''), String(type)), type, period });

  const safeType = type === 'coins' || type === 'coin_spend' ? 'coins' : 'points';
  const safePeriod = period === 'daily' || period === 'weekly' || period === 'all' ? period : 'all';
  const since = periodSince(safePeriod);
  const filter = since ? `&created_at=gte.${encodeURIComponent(since)}` : '';
  const ownId = String(userId || '');
  const max = Math.min(Math.max(Number(limit) || 50, 1), 100);

  try {
    if (safeType === 'coins') {
      const unlockRows = await sb(`content_unlocks?select=user_id,coins_spent,created_at${filter}&limit=5000`);
      const adviceRows = await sb(`advice_history?select=user_id,coins_used,created_at${filter}&limit=5000`);
      const map: Record<string, number> = {};
      unlockRows.forEach((row: any) => {
        map[row.user_id] = (map[row.user_id] ?? 0) + Number(row.coins_spent || 0);
      });
      adviceRows.forEach((row: any) => {
        map[row.user_id] = (map[row.user_id] ?? 0) + Number(row.coins_used || 0);
      });
      let ranking = Object.entries(map).map(([uid, value]) => ({ user_id: uid, coins_spent: value, score: value }));
      ranking = await attachProfiles(ranking, ownId);
      ranking = ranking.sort((a, b) => b.coins_spent - a.coins_spent).slice(0, max).map((row, i) => ({ ...row, rank: i + 1, type: 'coins' }));
      return res.status(200).json({ ranking: ensureOwn(ranking, ownId, 'coins'), type: 'coins', period: safePeriod });
    }

    const rows = await sb(`learning_logs?select=user_id,type,correct,total,score,created_at${filter}&limit=5000`);
    const map: Record<string, { points: number; sessions: number }> = {};
    rows.forEach((row: any) => {
      const total = Math.max(0, Number(row.total || 0));
      const correct = Math.max(0, Number(row.correct || 0));
      const rate = total > 0 ? correct / total : 0;
      const points = Number(row.score || 0) || (rate >= 0.8 ? 10 : rate >= 0.6 ? 6 : rate >= 0.4 ? 3 : 1);
      if (!map[row.user_id]) map[row.user_id] = { points: 0, sessions: 0 };
      map[row.user_id].points += points;
      map[row.user_id].sessions += 1;
    });

    if (safePeriod === 'all') {
      const pointRows = await sb('user_points?select=user_id,points&limit=5000');
      pointRows.forEach((row: any) => {
        if (!map[row.user_id]) map[row.user_id] = { points: 0, sessions: 0 };
        map[row.user_id].points = Math.max(map[row.user_id].points, Number(row.points || 0));
      });
    }

    let ranking = Object.entries(map).map(([uid, value]) => ({ user_id: uid, points: value.points, sessions: value.sessions, score: value.points }));
    ranking = await attachProfiles(ranking, ownId);
    ranking = ranking.sort((a, b) => b.points - a.points).slice(0, max).map((row, i) => ({ ...row, rank: i + 1, type: 'points' }));
    return res.status(200).json({ ranking: ensureOwn(ranking, ownId, 'points'), type: 'points', period: safePeriod });
  } catch (err) {
    console.error('[ranking]', err);
    return res.status(200).json({ ranking: ensureOwn([], ownId, safeType), type: safeType, period: safePeriod });
  }
}
