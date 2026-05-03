/**
 * POST /api/affiliate/click
 * アフィリエイトクリックログを保存
 */
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, cardKey, cardTitle, toeicScore } = req.body as {
    userId?: string; cardKey?: string; cardTitle?: string; toeicScore?: number;
  };

  if (SB_URL && userId && cardKey) {
    try {
      await fetch(`${SB_URL}/rest/v1/affiliate_clicks`, {
        method: 'POST',
        headers: {
          apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`,
          'Content-Type': 'application/json', Prefer: 'return=minimal',
        },
        body: JSON.stringify({ user_id: userId, card_key: cardKey, card_title: cardTitle, toeic_score: toeicScore }),
      });
    } catch { /* ignore */ }
  }

  console.log(`[affiliate] click: ${cardKey} userId=${userId?.slice(0,8)} toeic=${toeicScore}`);
  return res.status(200).json({ ok: true });
}
