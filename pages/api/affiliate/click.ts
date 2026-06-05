// @ts-nocheck
/**
 * POST /api/affiliate/click
 * アフィリエイトクリックログを保存
 */
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, cardKey, cardTitle, toeicScore, affiliateName, screenName } = req.body as {
    userId?: string; cardKey?: string; cardTitle?: string; toeicScore?: number; affiliateName?: string; screenName?: string;
  };
  const safeAffiliateName = affiliateName || (cardKey === 'study_sapuri' ? 'study_sapuri' : undefined);
  const safeScreenName = screenName || cardKey || 'unknown';

  if (SB_URL && userId && (cardKey || safeAffiliateName)) {
    try {
      const insertClick = (body: Record<string, unknown>) => fetch(`${SB_URL}/rest/v1/affiliate_clicks`, {
        method: 'POST',
        headers: {
          apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`,
          'Content-Type': 'application/json', Prefer: 'return=minimal',
        },
        body: JSON.stringify(body),
      });
      const full = await insertClick({
        user_id: userId,
        card_key: cardKey || safeAffiliateName,
        card_title: cardTitle || safeAffiliateName,
        toeic_score: toeicScore,
        affiliate_name: safeAffiliateName || cardKey,
        screen_name: safeScreenName,
      });
      if (!full.ok) {
        const modern = await insertClick({
          user_id: userId,
          affiliate_name: safeAffiliateName || cardKey,
          screen_name: safeScreenName,
        });
        if (!modern.ok && cardKey) {
          await insertClick({ user_id: userId, card_key: cardKey, card_title: cardTitle, toeic_score: toeicScore });
        }
      }
    } catch { /* ignore */ }
  }

  console.log(`[affiliate] click: ${safeAffiliateName || cardKey} screen=${safeScreenName} userId=${userId?.slice(0,8)} toeic=${toeicScore}`);
  return res.status(200).json({ ok: true });
}
