import type { NextApiRequest, NextApiResponse } from 'next';
import { sbFrom, getUserId } from '../../../lib/supabase';

interface PlaylistItem {
  id: string;
  user_id: string;
  video_id: string;
  title: string;
  channel_title?: string;
  thumbnail?: string;
  chunks: { en: string; ja: string }[];
  original_text: string;
  created_at: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlaylistItem[] | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = getUserId();

  try {
    const sb = sbFrom('my_playlist');
    const data = await sb.select(`user_id=eq.${userId}&order=created_at.desc`);

    const items: PlaylistItem[] = data.map(item => {
      const videoId = item.video_id as string;
      const rawThumbnail = item.thumbnail as string;
      const thumbnail = typeof rawThumbnail === 'string' && rawThumbnail.trim()
        ? rawThumbnail.trim()
        : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      return {
        id: item.id as string,
        user_id: item.user_id as string,
        video_id: videoId,
        title: item.title as string,
        channel_title: item.channel_title as string,
        thumbnail,
        chunks: item.chunks as { en: string; ja: string }[],
        original_text: item.original_text as string,
        created_at: item.created_at as string,
      };
    });

    res.status(200).json(items);
  } catch (error) {
    console.error('[get]', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
}