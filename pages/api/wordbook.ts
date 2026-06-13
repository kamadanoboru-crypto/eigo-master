// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const headers = (prefer = 'return=representation') => ({
  apikey: SB_ANON,
  Authorization: `Bearer ${SB_ANON}`,
  'Content-Type': 'application/json',
  Prefer: prefer,
});

const normalizeInitial = (value: unknown) => {
  const raw = String(value || 'all').trim().toUpperCase();
  if (raw === 'ALL') return 'all';
  if (/^[A-Z]$/.test(raw)) return raw;
  return '#';
};

function rowToWord(row: any) {
  const c = row?.content || {};
  return {
    id: c.id || row.id,
    word: String(c.word || '').trim(),
    meaning: c.meaning || '',
    pos: c.pos || '',
    example: c.example || '',
    exampleJa: c.exampleJa || '',
    sentence: c.sentence || '',
    savedAt: row.saved_at || Date.now(),
    _dbId: row.id,
  };
}

async function deleteExisting(userId: string, word: string) {
  const safeWord = word.trim();
  if (!userId || !safeWord) return;
  const params = new URLSearchParams({
    user_id: `eq.${userId}`,
    item_type: 'eq.word',
  });
  params.set('content->>word', `ilike.${safeWord}`);
  await fetch(`${SB_URL}/rest/v1/saved_items?${params.toString()}`, {
    method: 'DELETE',
    headers: headers('return=minimal'),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!SB_URL || !SB_ANON) return res.status(200).json({ ok: true, items: [], hasMore: false, storage: 'local' });

  if (req.method === 'GET') {
    const userId = String(req.query.userId || '').trim();
    if (!userId) return res.status(400).json({ ok: false, error: 'userId required' });

    const initial = normalizeInitial(req.query.initial);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10) || 10));
    const offset = Math.max(0, Number(req.query.offset || 0) || 0);
    const params = new URLSearchParams({
      select: '*',
      user_id: `eq.${userId}`,
      item_type: 'eq.word',
      order: 'saved_at.desc',
      limit: String(limit),
      offset: String(offset),
    });

    if (initial !== 'all') {
      if (initial === '#') {
        params.set('not.content->>word', 'ilike.A*');
      } else {
        params.set('content->>word', `ilike.${initial}*`);
      }
    }

    const r = await fetch(`${SB_URL}/rest/v1/saved_items?${params.toString()}`, { headers: headers() });
    if (!r.ok) return res.status(500).json({ ok: false, error: await r.text().catch(() => 'Failed to fetch') });
    const rows = await r.json();
    const items = (Array.isArray(rows) ? rows : []).map(rowToWord).filter(item => item.word);
    return res.status(200).json({ ok: true, items, hasMore: items.length === limit, initial, limit, offset, storage: 'supabase' });
  }

  if (req.method === 'POST') {
    const { userId, item } = req.body as { userId?: string; item?: any };
    const safeUserId = String(userId || '').trim();
    const word = String(item?.word || '').trim();
    if (!safeUserId || !word) return res.status(400).json({ ok: false, error: 'userId and item.word required' });

    await deleteExisting(safeUserId, word);
    const payload = {
      user_id: safeUserId,
      item_type: 'word',
      content: {
        id: item.id || `word-${word.toLowerCase()}`,
        word,
        meaning: item.meaning || '',
        pos: item.pos || '',
        example: item.example || '',
        exampleJa: item.exampleJa || '',
        sentence: item.sentence || '',
      },
      saved_at: item.savedAt || Date.now(),
    };
    const r = await fetch(`${SB_URL}/rest/v1/saved_items`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    if (!r.ok) return res.status(500).json({ ok: false, error: await r.text().catch(() => 'Failed to save') });
    const rows = await r.json();
    return res.status(200).json({ ok: true, item: rowToWord(rows?.[0] || payload), storage: 'supabase' });
  }

  if (req.method === 'DELETE') {
    const userId = String(req.query.userId || '').trim();
    const word = String(req.query.word || '').trim();
    if (!userId || !word) return res.status(400).json({ ok: false, error: 'userId and word required' });
    await deleteExisting(userId, word);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
