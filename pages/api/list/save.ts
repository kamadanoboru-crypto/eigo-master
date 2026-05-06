import type { NextApiRequest, NextApiResponse } from 'next';
import { sbFrom, getUserId } from '../../../lib/supabase';

interface SaveRequest {
  title: string;
  videoId: string;
  chunks: { en: string; ja: string }[];
  originalText: string;
  thumbnail?: string;
  channelTitle?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean } | { error: string }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, videoId, chunks, originalText, thumbnail, channelTitle } = req.body as SaveRequest;

  if (!title || !videoId || !Array.isArray(chunks) || originalText === undefined) {
    return res.status(400).json({ error: 'title, videoId, chunks, originalText required' });
  }

  const userId = getUserId();

  try {
    const sb = sbFrom('my_playlist');
    const payload: Record<string, unknown> = {
      user_id: userId,
      video_id: videoId,
      title,
      chunks,
      original_text: originalText,
    };
    if (thumbnail && thumbnail.trim()) payload.thumbnail = thumbnail.trim();
    if (channelTitle && channelTitle.trim()) payload.channel_title = channelTitle.trim();
    await sb.upsert(payload);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[save]', error);
    res.status(500).json({ error: 'Failed to save' });
  }
}