// @ts-nocheck
/**
 * GET /api/social/ranking?type=translation|learning&limit=50
 * ランキング取得
 */
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function headers() {
  return { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, 'Content-Type': 'application/json' };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { type = 'translation', limit = '50', period = 'total', userId = '' } = req.query as { type?: string; limit?: string; period?: string; userId?: string };
  if (!SB_URL) return res.status(200).json({ ranking: [] });

  const since = (() => {
    const now = new Date();
    if (period === 'daily') {
      now.setHours(0, 0, 0, 0);
      return now.toISOString();
    }
    if (period === 'weekly') {
      now.setDate(now.getDate() - 7);
      return now.toISOString();
    }
    if (period === 'monthly') {
      now.setDate(now.getDate() - 30);
      return now.toISOString();
    }
    return '';
  })();
  const periodFilter = since ? `&created_at=gte.${encodeURIComponent(since)}` : '';
  const ownId = String(userId || '');
  const withOwnLearning = (ranking: any[]) => {
    if (!ownId || ranking.some(row => row.user_id === ownId)) return ranking;
    return [...ranking, {
      user_id: ownId,
      nickname: `Guest${ownId.slice(-4)}`,
      avatar: '',
      sessions: 0,
      accuracy: 0,
      coins: 0,
      rank_score: 0,
      score: 0,
    }];
  };
  const withOwnTranslation = (ranking: any[]) => {
    if (!ownId || ranking.some(row => row.user_id === ownId)) return ranking;
    return [...ranking, {
      user_id: ownId,
      nickname: `Guest${ownId.slice(-4)}`,
      avatar: '',
      score: 0,
    }];
  };

  try {
    if (type === 'translation') {
      // 翻訳スコア合計ランキング
      const r = await fetch(
        `${SB_URL}/rest/v1/user_translations?select=user_id,score,created_at${periodFilter}&order=score.desc&limit=1000`,
        { headers: headers() },
      );
      const rows = r.ok ? await r.json() : [];

      // user_id ごとにスコア合計
      const scoreMap: Record<string, number> = {};
      rows.forEach((row: any) => {
        scoreMap[row.user_id] = (scoreMap[row.user_id] ?? 0) + (row.score ?? 0);
      });

      // プロフィール取得（ニックネーム）
      const userIds = Object.keys(scoreMap).slice(0, 20);
      let profiles: any[] = [];
      if (userIds.length) {
        const pr = await fetch(
          `${SB_URL}/rest/v1/profiles?user_id=in.(${userIds.map(encodeURIComponent).join(',')})`,
          { headers: headers() },
        );
        profiles = pr.ok ? await pr.json() : [];
      }

      const ranking = userIds
        .map(uid => ({
          user_id:  uid,
          nickname: profiles.find((p: any) => p.user_id === uid)?.nickname ?? `Guest${uid.slice(-4)}`,
          avatar:   profiles.find((p: any) => p.user_id === uid)?.avatar_emoji ?? '🎓',
          score:    scoreMap[uid],
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, Number(limit));

      return res.status(200).json({ ranking: withOwnTranslation(ranking), type: 'translation', period });
    }

    if (type === 'learning') {
      // 学習ログ集計
      const r = await fetch(
        `${SB_URL}/rest/v1/learning_logs?select=user_id,type,correct,total,created_at${periodFilter}&limit=1000`,
        { headers: headers() },
      );
      const rows = r.ok ? await r.json() : [];

      const map: Record<string, { sessions: number; correct: number; total: number; posts: number; likes: number }> = {};
      rows.forEach((row: any) => {
        if (!map[row.user_id]) map[row.user_id] = { sessions: 0, correct: 0, total: 0, posts: 0, likes: 0 };
        map[row.user_id].sessions++;
        map[row.user_id].correct += row.correct ?? 0;
        map[row.user_id].total   += row.total   ?? 0;
      });
      const talkRows = await fetch(
        `${SB_URL}/rest/v1/talk_posts?select=user_id,like_count,created_at${periodFilter}&limit=1000`,
        { headers: headers() },
      ).then(r => r.ok ? r.json() : []);
      talkRows.forEach((row: any) => {
        if (!map[row.user_id]) map[row.user_id] = { sessions: 0, correct: 0, total: 0, posts: 0, likes: 0 };
        map[row.user_id].posts++;
        map[row.user_id].likes += Number(row.like_count || 0);
      });

      // コイン残高
      const walletRows = await fetch(
        `${SB_URL}/rest/v1/user_wallet?select=user_id,coins&order=coins.desc&limit=100`,
        { headers: headers() },
      ).then(r => r.ok ? r.json() : []);

      const userIds = Object.keys(map);
      let profiles: any[] = [];
      if (userIds.length) {
        const pr = await fetch(
          `${SB_URL}/rest/v1/profiles?user_id=in.(${userIds.slice(0,20).map(encodeURIComponent).join(',')})`,
          { headers: headers() },
        );
        profiles = pr.ok ? await pr.json() : [];
      }

      const ranking = userIds
        .map(uid => {
          const m = map[uid];
          const accuracy = m.total > 0 ? Math.round((m.correct / m.total) * 100) : 0;
          const coins = walletRows.find((w: any) => w.user_id === uid)?.coins ?? 0;
          return {
            user_id:  uid,
            nickname: profiles.find((p: any) => p.user_id === uid)?.nickname ?? `Guest${uid.slice(-4)}`,
            avatar:   profiles.find((p: any) => p.user_id === uid)?.avatar_emoji ?? '🎓',
            sessions: m.sessions,
            accuracy,
            coins,
            posts: m.posts,
            likes: m.likes,
            rank_score: m.sessions * 10 + accuracy + m.posts * 5 + m.likes * 2,
          };
        })
        .sort((a, b) => b.rank_score - a.rank_score)
        .slice(0, Number(limit));

      return res.status(200).json({ ranking: withOwnLearning(ranking), type: 'learning', period });
    }

    return res.status(400).json({ error: 'unknown type' });
  } catch (err) {
    console.error('[ranking]', err);
    return res.status(500).json({ ranking: [] });
  }
}
