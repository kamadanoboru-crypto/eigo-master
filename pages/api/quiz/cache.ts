/**
 * GET  /api/quiz/cache?cacheKey=xxx   → キャッシュ情報取得
 * POST /api/quiz/cache                → キャッシュ直接保存
 * DEL  /api/quiz/cache?cacheKey=xxx  → キャッシュ削除（管理用）
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCachedQuiz, saveCachedQuiz, buildCacheKey } from '../../../lib/quizCache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ── GET: キャッシュ情報取得 ───────────────────────────────
  if (req.method === 'GET') {
    const { cacheKey, quizType, sourceType, sourceId = '', level = 'level_600' }
      = req.query as Record<string, string>;

    const key = cacheKey ?? (quizType && sourceType
      ? buildCacheKey({ quizType, sourceType, sourceId, level })
      : null);

    if (!key) return res.status(400).json({ error: 'cacheKey required' });

    const cached = await getCachedQuiz(key);
    if (cached) {
      return res.status(200).json({
        hit:       true,
        cacheKey:  key,
        questions: cached.data,
        hitCount:  cached.hit_count,
        createdAt: cached.created_at,
        expiresAt: cached.expires_at,
      });
    }
    return res.status(200).json({ hit: false, cacheKey: key });
  }

  // ── POST: キャッシュ保存 ──────────────────────────────────
  if (req.method === 'POST') {
    const { cacheKey, quizType, sourceType, sourceId = '', level = 'level_600',
            data, userId } = req.body as {
      cacheKey?:   string;
      quizType:    string;
      sourceType:  string;
      sourceId?:   string;
      level?:      string;
      data:        unknown[];
      userId?:     string;
    };

    if (!quizType || !sourceType || !Array.isArray(data)) {
      return res.status(400).json({ error: 'quizType, sourceType, data required' });
    }

    const key = cacheKey ?? buildCacheKey({ quizType, sourceType, sourceId, level });
    const ok = await saveCachedQuiz({
      cacheKey: key, quizType, sourceType, sourceId, level,
      data, createdBy: userId,
    });

    return res.status(200).json({ ok, cacheKey: key });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
