/**
 * GET /api/quiz/get
 * キャッシュから問題を取得する（AI呼ばない）
 *
 * Query params:
 *   cacheKey  string  -- 完全な cache_key
 *   OR
 *   quizType  string  -- 'word' | 'grammar' | 'listening'
 *   sourceType string -- 'toeic' | 'video' | 'article' | 'custom'
 *   sourceId  string? -- video_id 等
 *   level     string? -- 'level_600' 等
 *   setNum    number? -- セット番号
 *
 * Response:
 *   { hit: true,  cacheKey, questions, hitCount } -- キャッシュヒット
 *   { hit: false, cacheKey }                      -- キャッシュミス
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getCachedQuiz, buildCacheKey } from '../../../lib/quizCache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    cacheKey: rawKey,
    quizType,
    sourceType,
    sourceId = '',
    level = 'level_600',
    setNum = '1',
  } = req.query as Record<string, string>;

  // cache_key を決定
  let cacheKey = rawKey;
  if (!cacheKey) {
    if (!quizType || !sourceType) {
      return res.status(400).json({ error: 'cacheKey or (quizType + sourceType) required' });
    }
    cacheKey = buildCacheKey({
      quizType,
      sourceType,
      sourceId,
      level,
      setNum: parseInt(setNum) || 1,
    });
  }

  console.log(`[quiz/get] checking cache: ${cacheKey}`);

  const cached = await getCachedQuiz(cacheKey);

  if (cached) {
    return res.status(200).json({
      hit:       true,
      cacheKey,
      questions: cached.data,
      hitCount:  cached.hit_count,
      createdAt: cached.created_at,
    });
  }

  return res.status(200).json({ hit: false, cacheKey });
}
