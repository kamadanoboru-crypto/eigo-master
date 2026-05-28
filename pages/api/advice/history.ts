import type { NextApiRequest, NextApiResponse } from 'next';
import { sbFrom } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const userId = String(req.query.userId || '');
  if (!userId) return res.status(400).json({ ok: false, message: 'userId is required' });

  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
  const rows = await sbFrom('advice_history').select(
    `*&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=${limit}`,
  );

  return res.status(200).json({ ok: true, history: rows || [] });
}
