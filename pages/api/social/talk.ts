// @ts-nocheck
/**
 * GET  /api/social/talk?limit=30&offset=0  → スレッド一覧
 * GET  /api/social/talk?threadId=xxx       → 返信一覧
 * POST /api/social/talk                    → スレッド/返信/投票
 *
 * Supabase未設定の場合は 503 を返す（クライアントは localStorage フォールバック）
 */
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const SB_READY = Boolean(SB_URL && SB_ANON);

function hdrs(prefer = 'return=representation') {
  return {
    apikey:        SB_ANON,
    Authorization: `Bearer ${SB_ANON}`,
    'Content-Type': 'application/json',
    Prefer:        prefer,
  };
}

async function applyProfiles(posts: any[], userId = '') {
  if (!Array.isArray(posts) || posts.length === 0) return [];
  const ids = Array.from(new Set(posts.map(post => String(post.user_id || '')).filter(Boolean)));
  let profiles: any[] = [];
  if (ids.length) {
    const r = await fetch(
      `${SB_URL}/rest/v1/profiles?select=user_id,nickname,avatar_emoji&user_id=in.(${ids.map(encodeURIComponent).join(',')})`,
      { headers: hdrs(), signal: AbortSignal.timeout(5000) }
    );
    profiles = r.ok ? await r.json().catch(() => []) : [];
  }
  const byId = new Map((Array.isArray(profiles) ? profiles : []).map((p: any) => [String(p.user_id), p]));
  const postIds = posts.map(post => String(post.id || '')).filter(Boolean);
  const voteRows = postIds.length
    ? await fetch(
      `${SB_URL}/rest/v1/talk_votes?select=post_id,vote,user_id&post_id=in.(${postIds.map(encodeURIComponent).join(',')})&limit=10000`,
      { headers: hdrs(), signal: AbortSignal.timeout(5000) }
    ).then(r => r.ok ? r.json() : []).catch(() => [])
    : [];
  const voteSummary = new Map<string, any>();
  (Array.isArray(voteRows) ? voteRows : []).forEach((v: any) => {
    const id = String(v.post_id || '');
    const cur = voteSummary.get(id) || { like_count: 0, dislike_count: 0, my_vote: 0 };
    if (Number(v.vote) === 1) cur.like_count += 1;
    if (Number(v.vote) === -1) cur.dislike_count += 1;
    if (userId && String(v.user_id) === String(userId)) cur.my_vote = Number(v.vote);
    voteSummary.set(id, cur);
  });
  return posts.map(post => {
    const profile = byId.get(String(post.user_id));
    const votes = voteSummary.get(String(post.id));
    return {
      ...post,
      ...(profile ? { nickname: profile.nickname || post.nickname, avatar_emoji: profile.avatar_emoji || post.avatar_emoji } : {}),
      ...(votes ? votes : { my_vote: 0 }),
    };
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SB_READY) return res.status(503).json({ ok: false, reason: 'no-supabase' });

  // ── GET: 投稿一覧 ────────────────────────────────────────────
  if (req.method === 'GET') {
    const limit  = Math.min(Number(req.query.limit)  || 30, 50);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const threadId = String(req.query.threadId || '');
    const userId = String(req.query.userId || '');
    const category = String(req.query.category || '');
    const sort = String(req.query.sort || 'popular');
    try {
      if (threadId) {
        const r = await fetch(
          `${SB_URL}/rest/v1/talk_posts?select=id,user_id,nickname,avatar_emoji,body,category,parent_id,thread_id,like_count,dislike_count,reply_count,created_at&thread_id=eq.${encodeURIComponent(threadId)}&parent_id=not.is.null&order=created_at.asc&limit=${limit}&offset=${offset}`,
          { headers: hdrs(), signal: AbortSignal.timeout(5000) }
        );
        if (r.ok) return res.status(200).json({ ok: true, posts: await applyProfiles(await r.json(), userId) });
      }

      const legacyStudyCategories = ['study', 'general', 'grammar', 'vocabulary', 'listening', 'translation'];
      const catFilter = category && category !== 'all'
        ? category === 'study'
          ? `&category=in.(${legacyStudyCategories.map(encodeURIComponent).join(',')})`
          : `&category=eq.${encodeURIComponent(category)}`
        : '';
      const order = sort === 'new'
        ? 'order=created_at.desc'
        : 'order=score.desc,reply_count.desc,last_activity_at.desc';
      const r = await fetch(
        `${SB_URL}/rest/v1/talk_posts?select=id,user_id,nickname,avatar_emoji,body,category,parent_id,thread_id,like_count,dislike_count,reply_count,last_activity_at,created_at&parent_id=is.null${catFilter}&${order}&limit=${limit}&offset=${offset}`,
        { headers: hdrs(), signal: AbortSignal.timeout(5000) }
      );
      if (!r.ok) {
        const fallback = await fetch(
          `${SB_URL}/rest/v1/talk_posts?select=id,user_id,nickname,avatar_emoji,body,created_at&order=created_at.desc&limit=${limit}&offset=${offset}`,
          { headers: hdrs(), signal: AbortSignal.timeout(5000) }
        );
        if (!fallback.ok) return res.status(200).json({ ok: false, posts: [] });
        const fallbackRows = await fallback.json();
        return res.status(200).json({ ok: true, posts: await applyProfiles(Array.isArray(fallbackRows) ? fallbackRows : [], userId) });
      }
      const rows = await r.json();
      return res.status(200).json({ ok: true, posts: await applyProfiles(Array.isArray(rows) ? rows : [], userId) });
    } catch (e) {
      console.error('[talk/GET]', e.message);
      return res.status(200).json({ ok: false, posts: [] });
    }
  }

  // ── POST: 投稿作成 ───────────────────────────────────────────
  if (req.method === 'POST') {
    const { userId, body, nickname, avatarEmoji, title = '', category = 'general', parentId = '', action = 'post', vote = 1 } = req.body ?? {};
    if (!userId) return res.status(400).json({ ok: false, reason: 'missing user' });

    if (action === 'vote') {
      const targetId = String(req.body?.postId || '');
      if (!targetId || ![1, -1].includes(Number(vote))) return res.status(400).json({ ok: false, reason: 'bad vote' });
      const previous = await fetch(`${SB_URL}/rest/v1/talk_votes?select=vote&post_id=eq.${encodeURIComponent(targetId)}&user_id=eq.${encodeURIComponent(String(userId))}&limit=1`, { headers: hdrs() });
      const [prev] = previous.ok ? await previous.json().catch(() => []) : [];
      const previousVote = Number(prev?.vote || 0);
      const nextVote = previousVote === Number(vote) ? 0 : Number(vote);
      if (nextVote === 0) {
        const del = await fetch(`${SB_URL}/rest/v1/talk_votes?post_id=eq.${encodeURIComponent(targetId)}&user_id=eq.${encodeURIComponent(String(userId))}`, {
          method: 'DELETE',
          headers: hdrs('return=minimal'),
        });
        if (!del.ok) return res.status(200).json({ ok: false, reason: 'talk_votes table or policy is missing. Run sql/talk_threads_phase1_patch.sql.' });
      } else {
        const upsertVote = await fetch(`${SB_URL}/rest/v1/talk_votes?on_conflict=post_id,user_id`, {
          method: 'POST',
          headers: hdrs('resolution=merge-duplicates,return=minimal'),
          body: JSON.stringify({ post_id: targetId, user_id: String(userId), vote: nextVote, updated_at: new Date().toISOString() }),
        });
        if (!upsertVote.ok) return res.status(200).json({ ok: false, reason: 'talk_votes table or policy is missing. Run sql/talk_threads_phase1_patch.sql.' });
      }
      const votes = await fetch(`${SB_URL}/rest/v1/talk_votes?select=vote&post_id=eq.${encodeURIComponent(targetId)}&limit=10000`, { headers: hdrs() });
      const rows = votes.ok ? await votes.json().catch(() => []) : [];
      const like_count = Array.isArray(rows) ? rows.filter((r: any) => Number(r.vote) === 1).length : 0;
      const dislike_count = Array.isArray(rows) ? rows.filter((r: any) => Number(r.vote) === -1).length : 0;
      const vr = await fetch(`${SB_URL}/rest/v1/talk_posts?id=eq.${encodeURIComponent(targetId)}`, {
        method: 'PATCH',
        headers: hdrs('return=minimal'),
        body: JSON.stringify({ like_count, dislike_count, score: like_count - dislike_count, last_activity_at: new Date().toISOString() }),
      });
      return res.status(200).json({ ok: vr.ok, like_count, dislike_count, my_vote: nextVote });
    }

    if (action === 'edit') {
      const targetId = String(req.body?.postId || '');
      if (!targetId) return res.status(400).json({ ok: false, reason: 'missing post' });
      if (!body?.trim()) return res.status(400).json({ ok: false, reason: 'missing fields' });
      if (body.length > 500) return res.status(400).json({ ok: false, reason: 'too long' });

      const cur = await fetch(
        `${SB_URL}/rest/v1/talk_posts?select=id,user_id,parent_id&id=eq.${encodeURIComponent(targetId)}&limit=1`,
        { headers: hdrs(), signal: AbortSignal.timeout(5000) }
      );
      const [row] = cur.ok ? await cur.json() : [];
      if (!row) return res.status(404).json({ ok: false, reason: 'not found' });
      if (row.user_id !== userId) return res.status(403).json({ ok: false, reason: 'forbidden' });

      const isThread = !row.parent_id;
      const nextBody = isThread && title
        ? `# ${String(title).trim().slice(0,80)}\n${body.trim()}`
        : body.trim();
      const patch: any = {
        body: nextBody,
        last_activity_at: new Date().toISOString(),
      };
      if (isThread) patch.category = category || 'chat';

      const pr = await fetch(`${SB_URL}/rest/v1/talk_posts?id=eq.${encodeURIComponent(targetId)}`, {
        method: 'PATCH',
        headers: hdrs(),
        body: JSON.stringify(patch),
        signal: AbortSignal.timeout(5000),
      });
      if (!pr.ok) return res.status(200).json({ ok: false, reason: `db error ${pr.status}` });
      const rows = await pr.json();
      return res.status(200).json({ ok: true, post: Array.isArray(rows) ? rows[0] : rows });
    }

    if (!body?.trim()) return res.status(400).json({ ok: false, reason: 'missing fields' });
    if (body.length > 500) return res.status(400).json({ ok: false, reason: 'too long' });

    try {
      let threadId = parentId;
      if (parentId) {
        const parent = await fetch(`${SB_URL}/rest/v1/talk_posts?select=id,thread_id,reply_count&id=eq.${encodeURIComponent(parentId)}&limit=1`, { headers: hdrs() });
        const [p] = parent.ok ? await parent.json() : [];
        threadId = p?.thread_id || p?.id || parentId;
      }
      const r = await fetch(`${SB_URL}/rest/v1/talk_posts`, {
        method:  'POST',
        headers: hdrs(),
        body: JSON.stringify({
          user_id:      userId,
          nickname:     (nickname ?? '匿名').slice(0, 20),
          avatar_emoji: avatarEmoji ?? '🎓',
          body:         title ? `# ${String(title).trim().slice(0,80)}\n${body.trim()}` : body.trim(),
          category,
          parent_id:    parentId || null,
          thread_id:    threadId || null,
          last_activity_at: new Date().toISOString(),
          created_at:   new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) {
        const err = await r.text();
        console.error('[talk/POST] Supabase error:', r.status, err);
        const fallback = await fetch(`${SB_URL}/rest/v1/talk_posts`, {
          method: 'POST',
          headers: hdrs(),
          body: JSON.stringify({
            user_id: userId,
            nickname: (nickname ?? '匿名').slice(0, 20),
            avatar_emoji: avatarEmoji ?? '🎓',
            body: title ? `# ${String(title).trim().slice(0,80)}\n${body.trim()}` : body.trim(),
            created_at: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!fallback.ok) return res.status(200).json({ ok: false, reason: `db error ${fallback.status}` });
        const fallbackRows = await fallback.json();
        const fallbackPost = Array.isArray(fallbackRows) ? fallbackRows[0] : fallbackRows;
        return res.status(200).json({ ok: true, post: fallbackPost });
      }
      const rows = await r.json();
      const post = Array.isArray(rows) ? rows[0] : rows;
      if (!parentId && post?.id) {
        fetch(`${SB_URL}/rest/v1/talk_posts?id=eq.${post.id}`, {
          method: 'PATCH',
          headers: hdrs('return=minimal'),
          body: JSON.stringify({ thread_id: post.id }),
        }).catch(() => {});
      }
      if (parentId) {
        const parent = await fetch(`${SB_URL}/rest/v1/talk_posts?select=reply_count&id=eq.${encodeURIComponent(parentId)}&limit=1`, { headers: hdrs() });
        const [p] = parent.ok ? await parent.json() : [];
        fetch(`${SB_URL}/rest/v1/talk_posts?id=eq.${encodeURIComponent(parentId)}`, {
          method: 'PATCH',
          headers: hdrs('return=minimal'),
          body: JSON.stringify({ reply_count: Number(p?.reply_count || 0) + 1, last_activity_at: new Date().toISOString() }),
        }).catch(() => {});
      }
      return res.status(200).json({ ok: true, post });
    } catch (e) {
      console.error('[talk/POST]', e.message);
      return res.status(200).json({ ok: false, reason: e.message });
    }
  }

  return res.status(405).json({ ok: false, reason: 'Method not allowed' });
}
