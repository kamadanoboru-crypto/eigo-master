// @ts-nocheck
/**
 * GET  /api/social/talk?limit=30&offset=0  → 投稿一覧（created_at降順）
 * POST /api/social/talk                    → 投稿作成
 *
 * Supabase未設定の場合は 503 を返す（クライアントは localStorage フォールバック）
 */
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const SB_READY = Boolean(SB_URL && SB_ANON);

function hdrs() {
  return {
    apikey:        SB_ANON,
    Authorization: `Bearer ${SB_ANON}`,
    'Content-Type': 'application/json',
    Prefer:        'return=representation',
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SB_READY) return res.status(503).json({ ok: false, reason: 'no-supabase' });

  // ── GET: 投稿一覧 ────────────────────────────────────────────
  if (req.method === 'GET') {
    const limit  = Math.min(Number(req.query.limit)  || 30, 50);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    try {
      const r = await fetch(
        `${SB_URL}/rest/v1/talk_posts?select=id,user_id,nickname,avatar_emoji,body,created_at&order=created_at.desc&limit=${limit}&offset=${offset}`,
        { headers: hdrs(), signal: AbortSignal.timeout(5000) }
      );
      if (!r.ok) return res.status(200).json({ ok: false, posts: [] });
      const rows = await r.json();
      return res.status(200).json({ ok: true, posts: Array.isArray(rows) ? rows : [] });
    } catch (e) {
      console.error('[talk/GET]', e.message);
      return res.status(200).json({ ok: false, posts: [] });
    }
  }

  // ── POST: 投稿作成 ───────────────────────────────────────────
  if (req.method === 'POST') {
    const { userId, body, nickname, avatarEmoji } = req.body ?? {};
    if (!userId || !body?.trim()) return res.status(400).json({ ok: false, reason: 'missing fields' });
    if (body.length > 300) return res.status(400).json({ ok: false, reason: 'too long' });

    try {
      const r = await fetch(`${SB_URL}/rest/v1/talk_posts`, {
        method:  'POST',
        headers: hdrs(),
        body: JSON.stringify({
          user_id:      userId,
          nickname:     (nickname ?? '匿名').slice(0, 20),
          avatar_emoji: avatarEmoji ?? '🎓',
          body:         body.trim(),
          created_at:   new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) {
        const err = await r.text();
        console.error('[talk/POST] Supabase error:', r.status, err);
        return res.status(200).json({ ok: false, reason: `db error ${r.status}` });
      }
      const rows = await r.json();
      const post = Array.isArray(rows) ? rows[0] : rows;
      return res.status(200).json({ ok: true, post });
    } catch (e) {
      console.error('[talk/POST]', e.message);
      return res.status(200).json({ ok: false, reason: e.message });
    }
  }

  return res.status(405).json({ ok: false, reason: 'Method not allowed' });
}
