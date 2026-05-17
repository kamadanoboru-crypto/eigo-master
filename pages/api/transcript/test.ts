/**
 * GET /api/transcript/test
 *
 * 字幕取得の動作テスト用エンドポイント
 * （開発・デバッグ用）
 *
 * テスト用動画:
 *   PlFx2XlbTK4 - "How to Build Good Habits" (字幕あり)
 *   dQw4w9WgXcQ - Rick Astley (字幕あり・自動生成)
 */

import type { NextApiRequest, NextApiResponse } from 'next';

const TEST_VIDEOS = [
  { videoId: 'PlFx2XlbTK4', label: 'How to Build Good Habits' },
  { videoId: 'LNHBMFCzznE', label: 'The Power of Consistency' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const videoId = (req.query.videoId as string) || TEST_VIDEOS[0].videoId;
  const baseUrl = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;

  try {
    const r = await fetch(`${baseUrl}/api/transcript?videoId=${videoId}`, {
      signal: AbortSignal.timeout(20000),
    });
    const d = await r.json();

    return res.status(200).json({
      tested:    videoId,
      success:   d.ok,
      sentences: d.sentences?.length ?? 0,
      segments:  d.count ?? 0,
      sample:    d.sentences?.slice(0, 3) ?? [],
      reason:    d.reason ?? null,
    });
  } catch (e) {
    return res.status(500).json({
      tested:  videoId,
      success: false,
      error:   e instanceof Error ? e.message : String(e),
    });
  }
}
