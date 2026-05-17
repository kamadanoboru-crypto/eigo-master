// @ts-nocheck
/**
 * /api/transcript/cache
 *
 * GET  ?videoId=xxx  → キャッシュ取得 (ヒットしたら { ok:true, hit:true, ... })
 * POST body: { videoId, segments, sentences } → キャッシュ保存
 *
 * キャッシュTTL: 7日間
 * Supabaseが未設定の場合はスキップ（{ ok:false, reason:'no-supabase' }）
 */

import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const SB_READY = Boolean(SB_URL && SB_ANON);
const TTL_DAYS = 7;

async function sbRpc(method: string, path: string, body?: unknown) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey':        SB_ANON,
      'Authorization': `Bearer ${SB_ANON}`,
      'Content-Type':  'application/json',
      'Prefer':        method === 'POST' ? 'resolution=merge-duplicates' : '',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(5000),
  });
  return r;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SB_READY) return res.status(200).json({ ok: false, reason: 'no-supabase' });

  // ── GET: キャッシュ読み取り ────────────────────────────────
  if (req.method === 'GET') {
    const videoId = req.query.videoId as string;
    if (!videoId) return res.status(400).json({ ok: false, reason: 'missing videoId' });

    try {
      const r = await sbRpc('GET', `transcript_cache?video_id=eq.${videoId}&select=segments,sentences,fetched_at`);
      if (!r.ok) return res.status(200).json({ ok: false, reason: `db error ${r.status}` });
      const rows = await r.json();
      if (!rows?.length) return res.status(200).json({ ok: false, hit: false });

      const row = rows[0];
      // TTLチェック（7日以内か）
      const age = Date.now() - new Date(row.fetched_at).getTime();
      if (age > TTL_DAYS * 86400 * 1000) {
        return res.status(200).json({ ok: false, hit: false, reason: 'expired' });
      }

      console.debug(`[transcript/cache] GET hit: ${videoId} age=${Math.round(age/3600000)}h`);
      return res.status(200).json({
        ok:        true,
        hit:       true,
        sentences: row.sentences,
        segments:  row.segments,
      });
    } catch (e) {
      console.error('[transcript/cache] GET error', e);
      return res.status(200).json({ ok: false, reason: 'error' });
    }
  }

  // ── POST: キャッシュ書き込み ──────────────────────────────
  if (req.method === 'POST') {
    const { videoId, segments, sentences } = req.body ?? {};
    if (!videoId || !segments || !sentences)
      return res.status(400).json({ ok: false, reason: 'missing fields' });

    try {
      const r = await sbRpc('POST', 'transcript_cache', {
        video_id:   videoId,
        segments,
        sentences,
        seg_count:  segments.length,
        fetched_at: new Date().toISOString(),
      });
      const ok = r.status >= 200 && r.status < 300;
      console.debug(`[transcript/cache] POST ${videoId}: ${r.status}`);
      return res.status(200).json({ ok });
    } catch (e) {
      console.error('[transcript/cache] POST error', e);
      return res.status(200).json({ ok: false, reason: 'error' });
    }
  }

  return res.status(405).json({ ok: false, reason: 'Method not allowed' });
}
