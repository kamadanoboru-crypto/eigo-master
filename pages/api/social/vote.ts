// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function headers(prefer?: string) {
  return {
    apikey: SB_ANON,
    Authorization: `Bearer ${SB_ANON}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, translationId, vote } = req.body as {
    userId?: string;
    translationId?: string;
    vote?: 1 | -1;
  };
  if (!userId || !translationId || ![1, -1].includes(vote!)) {
    return res.status(400).json({ error: 'userId, translationId, vote(1/-1) required' });
  }
  if (!SB_URL) return res.status(200).json({ ok: true });

  const existing = await fetch(
    `${SB_URL}/rest/v1/translation_votes?select=*&translation_id=eq.${translationId}&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    { headers: headers() },
  );
  const rows = existing.ok ? await existing.json() : [];
  if (rows.length) return res.status(400).json({ ok: false, message: '既に投票済みです' });

  const voteRes = await fetch(`${SB_URL}/rest/v1/translation_votes`, {
    method: 'POST',
    headers: headers('return=minimal'),
    body: JSON.stringify({ translation_id: translationId, user_id: userId, vote }),
  });
  if (!voteRes.ok) {
    const detail = await voteRes.text().catch(() => '');
    console.error('[social] vote insert failed', voteRes.status, detail.slice(0, 300));
    return res.status(500).json({ ok: false, message: '投票を保存できませんでした' });
  }

  const transRow = await fetch(
    `${SB_URL}/rest/v1/user_translations?select=*&id=eq.${translationId}&limit=1`,
    { headers: headers() },
  );
  if (transRow.ok) {
    const [t] = await transRow.json();
    if (t) {
      const newLike = (t.like_count ?? 0) + (vote === 1 ? 1 : 0);
      const newDislike = (t.dislike_count ?? 0) + (vote === -1 ? 1 : 0);
      const patchRes = await fetch(`${SB_URL}/rest/v1/user_translations?id=eq.${translationId}`, {
        method: 'PATCH',
        headers: headers('return=minimal'),
        body: JSON.stringify({ like_count: newLike, dislike_count: newDislike, score: newLike - newDislike }),
      });
      if (!patchRes.ok) {
        console.error('[social] vote count patch failed', patchRes.status, (await patchRes.text().catch(() => '')).slice(0, 300));
      }
    }
  }

  console.log(`[social] vote: ${vote > 0 ? 'like' : 'dislike'} on ${translationId} by ${userId.slice(0, 8)}`);
  return res.status(200).json({ ok: true });
}
