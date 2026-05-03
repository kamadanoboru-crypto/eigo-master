/**
 * GET  /api/social/profile?userId=xxx  → プロフィール取得
 * POST /api/social/profile             → プロフィール作成/更新
 */
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function headers() {
  return { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, 'Content-Type': 'application/json' };
}

function guestName(userId: string) {
  const n = parseInt(userId.replace(/\D/g, '').slice(-4) || '0');
  return `Guest${(n % 9000 + 1000)}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (!SB_URL) return res.status(200).json({ user_id: userId, nickname: guestName(userId), avatar_emoji: '🎓' });

    const r = await fetch(`${SB_URL}/rest/v1/profiles?user_id=eq.${encodeURIComponent(userId)}&limit=1`, { headers: headers() });
    const rows = r.ok ? await r.json() : [];
    if (rows.length) return res.status(200).json(rows[0]);
    // 存在しなければデフォルト
    return res.status(200).json({ user_id: userId, nickname: guestName(userId), avatar_emoji: '🎓' });
  }

  if (req.method === 'POST') {
    const { userId, nickname, avatarEmoji } = req.body as {
      userId?: string; nickname?: string; avatarEmoji?: string;
    };
    if (!userId || !nickname?.trim()) return res.status(400).json({ error: 'userId and nickname required' });
    if (nickname.length > 20) return res.status(400).json({ error: 'nickname max 20 chars' });

    if (!SB_URL) return res.status(200).json({ ok: true });

    await fetch(`${SB_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal,resolution=merge-duplicates' },
      body: JSON.stringify({ user_id: userId, nickname: nickname.trim(), avatar_emoji: avatarEmoji ?? '🎓', updated_at: new Date().toISOString() }),
    });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
