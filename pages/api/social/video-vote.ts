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
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const { userId, videoId, vote } = req.body ?? {};
  const voteType = Number(vote);
  if (!userId || !videoId || ![1, -1].includes(voteType)) {
    return res.status(400).json({ ok: false, error: 'userId, videoId, vote(1/-1) required' });
  }
  if (!SB_URL || !SB_ANON) return res.status(200).json({ ok: true, vote: voteType });

  const previousRes = await fetch(
    `${SB_URL}/rest/v1/video_votes?select=vote_type&video_id=eq.${encodeURIComponent(String(videoId))}&user_id=eq.${encodeURIComponent(String(userId))}&limit=1`,
    { headers: headers() },
  );
  const previousRows = previousRes.ok ? await previousRes.json().catch(() => []) : [];
  const previousVote = Number(previousRows?.[0]?.vote_type || 0);
  const videoRes = await fetch(
    `${SB_URL}/rest/v1/user_videos?select=like_count,dislike_count&video_id=eq.${encodeURIComponent(String(videoId))}&limit=1`,
    { headers: headers() },
  );
  const videoRows = videoRes.ok ? await videoRes.json().catch(() => []) : [];
  const currentLikes = Number(videoRows?.[0]?.like_count || 0);
  const currentDislikes = Number(videoRows?.[0]?.dislike_count || 0);

  const voteRes = await fetch(`${SB_URL}/rest/v1/video_votes?on_conflict=video_id,user_id`, {
    method: 'POST',
    headers: headers('resolution=merge-duplicates,return=minimal'),
    body: JSON.stringify({
      video_id: String(videoId),
      user_id: String(userId),
      vote_type: voteType,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!voteRes.ok) {
    const detail = await voteRes.text().catch(() => '');
    console.error('[video-vote] upsert failed', voteRes.status, detail.slice(0, 300));
    return res.status(500).json({ ok: false, error: 'vote save failed' });
  }

  const rowsRes = await fetch(
    `${SB_URL}/rest/v1/video_votes?select=vote_type&video_id=eq.${encodeURIComponent(String(videoId))}&limit=10000`,
    { headers: headers() },
  );
  const rows = rowsRes.ok ? await rowsRes.json().catch(() => []) : null;
  const likes = Array.isArray(rows)
    ? rows.filter((row: any) => Number(row.vote_type) === 1).length
    : Math.max(0, currentLikes - (previousVote === 1 ? 1 : 0) + (voteType === 1 ? 1 : 0));
  const dislikes = Array.isArray(rows)
    ? rows.filter((row: any) => Number(row.vote_type) === -1).length
    : Math.max(0, currentDislikes - (previousVote === -1 ? 1 : 0) + (voteType === -1 ? 1 : 0));

  const patchRes = await fetch(`${SB_URL}/rest/v1/user_videos?video_id=eq.${encodeURIComponent(String(videoId))}`, {
    method: 'PATCH',
    headers: headers('return=minimal'),
    body: JSON.stringify({ like_count: likes, dislike_count: dislikes }),
  });
  if (!patchRes.ok) {
    console.warn('[video-vote] user_videos count patch failed', patchRes.status);
  }

  return res.status(200).json({ ok: true, vote: voteType, likes, dislikes });
}
