// @ts-nocheck
/**
 * GET  /api/social/translations?videoId=xxx&captionIndex=0  → 翻訳一覧
 * POST /api/social/translations                              → 翻訳投稿
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
  if (req.method === 'GET') {
    const { videoId, captionIndex } = req.query as { videoId?: string; captionIndex?: string };
    if (!videoId) return res.status(400).json({ translations: [] });
    if (!SB_URL)  return res.status(200).json({ translations: [] });

    const filter = `video_id=eq.${encodeURIComponent(videoId)}`
      + (captionIndex !== undefined ? `&caption_index=eq.${captionIndex}` : '')
      + `&order=is_verified.desc,score.desc,created_at.desc&limit=20`;

    const r = await fetch(`${SB_URL}/rest/v1/user_translations?${filter}`, { headers: headers() });
    const rows = r.ok ? await r.json() : [];
    return res.status(200).json({ translations: rows });
  }

  if (req.method === 'POST') {
    const { userId, videoId, captionIndex, english, translation } = req.body as {
      userId?: string; videoId?: string; captionIndex?: number;
      english?: string; translation?: string;
    };
    if (!userId || !videoId || captionIndex === undefined || !english || !translation) {
      return res.status(400).json({ error: 'missing required fields' });
    }
    if (translation.length > 300) return res.status(400).json({ error: 'translation too long' });
    if (!SB_URL) return res.status(200).json({ ok: true, message: 'offline mode' });

    await fetch(`${SB_URL}/rest/v1/user_translations`, {
      method: 'POST',
      headers: headers('return=minimal'),
      body: JSON.stringify({ user_id: userId, video_id: videoId, caption_index: captionIndex, english, translation }),
    });

    // 翻訳投稿コイン報酬 +5
    try { await addCoins(userId, 5); } catch { /* ignore */ }

    console.log(`[social] translation posted: ${videoId}[${captionIndex}] by ${userId.slice(0,8)}`);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
