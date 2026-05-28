// @ts-nocheck
import crypto from 'crypto';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const READY = Boolean(SB_URL && SB_ANON);

function headers(extra = {}) {
  return {
    apikey: SB_ANON,
    Authorization: `Bearer ${SB_ANON}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

export function normalizeAIInput(text = '') {
  return String(text).replace(/\s+/g, ' ').trim().slice(0, 3000);
}

export function buildAIKey(kind: string, mode: string, text: string) {
  const input = normalizeAIInput(text).toLowerCase();
  return crypto.createHash('sha256').update(`${kind}:${mode}:${input}`).digest('hex');
}

export async function getAICache(kind: string, mode: string, text: string) {
  if (!READY) return null;
  const cacheKey = buildAIKey(kind, mode, text);
  try {
    const r = await fetch(`${SB_URL}/rest/v1/ai_cache?cache_key=eq.${cacheKey}&limit=1`, {
      headers: headers(),
    });
    if (!r.ok) return null;
    const rows = await r.json();
    return rows?.[0]?.payload ? { cacheKey, payload: rows[0].payload } : null;
  } catch {
    return null;
  }
}

export async function saveAICache(kind: string, mode: string, text: string, payload: unknown) {
  if (!READY) return false;
  const cacheKey = buildAIKey(kind, mode, text);
  try {
    const r = await fetch(`${SB_URL}/rest/v1/ai_cache?on_conflict=cache_key`, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal,resolution=merge-duplicates' }),
      body: JSON.stringify({
        cache_key: cacheKey,
        kind,
        mode,
        input_hash: cacheKey,
        payload,
        updated_at: new Date().toISOString(),
      }),
    });
    return r.ok;
  } catch {
    return false;
  }
}
