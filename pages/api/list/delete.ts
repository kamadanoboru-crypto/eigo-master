import type { NextApiRequest, NextApiResponse } from 'next';
import { sbFrom } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean } | { error: string }>,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoId, userId } = req.query;

  if (!videoId || typeof videoId !== 'string') {
    return res.status(400).json({ error: 'videoId required' });
  }
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId required' });
  }

  try {
    const sb = sbFrom('my_playlist');
    await sb.delete(`user_id=eq.${userId}&video_id=eq.${videoId}`);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[delete]', error);
    res.status(500).json({ error: 'Failed to delete' });
  }
}
