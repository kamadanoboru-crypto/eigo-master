/**
 * POST /api/social/vote
 * 翻訳への 👍/👎 投票（1ユーザー1票）
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { addCoins } from '../../../lib/economy';

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function headers(prefer?: string) {
  return {
    apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, translationId, vote } = req.body as {
    userId?: string; translationId?: string; vote?: 1 | -1;
  };
  if (!userId || !translationId || ![1, -1].includes(vote!)) {
    return res.status(400).json({ error: 'userId, translationId, vote(1/-1) required' });
  }
  if (!SB_URL) return res.status(200).json({ ok: true });

  // 既存投票を確認
  const existing = await fetch(
    `${SB_URL}/rest/v1/translation_votes?translation_id=eq.${translationId}&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    { headers: headers() },
  );
  const rows = existing.ok ? await existing.json() : [];
  if (rows.length) return res.status(400).json({ ok: false, message: '既に投票済みです' });

  // 投票を記録
  await fetch(`${SB_URL}/rest/v1/translation_votes`, {
    method: 'POST',
    headers: headers('return=minimal'),
    body: JSON.stringify({ translation_id: translationId, user_id: userId, vote }),
  });

  // like_count / dislike_count / score を更新（RPC使えないので直接PATCH）
  const countField = vote === 1 ? 'like_count' : 'dislike_count';
  const transRow = await fetch(
    `${SB_URL}/rest/v1/user_translations?id=eq.${translationId}&limit=1`,
    { headers: headers() },
  );
  if (transRow.ok) {
    const [t] = await transRow.json();
    if (t) {
      const newLike    = (t.like_count    ?? 0) + (vote === 1 ? 1 : 0);
      const newDislike = (t.dislike_count ?? 0) + (vote === -1 ? 1 : 0);
      await fetch(`${SB_URL}/rest/v1/user_translations?id=eq.${translationId}`, {
        method: 'PATCH',
        headers: headers('return=minimal'),
        body: JSON.stringify({ like_count: newLike, dislike_count: newDislike, score: newLike - newDislike }),
      });

      // 👍なら翻訳者にコイン +10
      if (vote === 1 && t.user_id && t.user_id !== userId) {
        addCoins(t.user_id, 10).catch(() => {});
      }
    }
  }

  console.log(`[social] vote: ${vote > 0 ? '👍' : '👎'} on ${translationId} by ${userId.slice(0,8)}`);
  return res.status(200).json({ ok: true });
}
