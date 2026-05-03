/**
 * lib/quizCache.ts  — サーバーサイド専用
 *
 * quiz_cache テーブルの CRUD
 * 全ユーザー共有: cache_key が同じなら同じ問題セットを返す
 */

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const TABLE   = 'quiz_cache';

function headers() {
  return {
    apikey:         SB_ANON,
    Authorization:  `Bearer ${SB_ANON}`,
    'Content-Type': 'application/json',
  };
}

export function buildCacheKey(p: {
  quizType:    string;
  sourceType:  string;
  sourceId?:   string;
  level?:      string;
  setNum?:     number;
}): string {
  const { quizType, sourceType, sourceId = '', level = 'level_600', setNum = 1 } = p;
  const n = String(setNum).padStart(3, '0');
  return sourceId
    ? `${quizType}:${sourceType}:${sourceId}:${level}:set_${n}`
    : `${quizType}:${sourceType}:${level}:set_${n}`;
}

export interface CachedQuiz {
  id:          string;
  cache_key:   string;
  quiz_type:   string;
  source_type: string;
  source_id:   string;
  level:       string;
  data:        unknown[];
  created_at:  string;
  expires_at:  string | null;
}

// ── 取得 ─────────────────────────────────────────────────────
export async function getCachedQuiz(key: string): Promise<CachedQuiz | null> {
  if (!SB_URL) {
    console.log('[quizCache] Supabase未接続 → スキップ');
    return null;
  }
  try {
    const url = `${SB_URL}/rest/v1/${TABLE}?cache_key=eq.${encodeURIComponent(key)}&limit=1`;
    const r   = await fetch(url, { headers: headers() });
    if (!r.ok) { console.warn(`[quizCache] GET ${r.status}`); return null; }
    const rows = (await r.json()) as CachedQuiz[];
    if (!rows.length) return null;

    const row = rows[0];
    // 有効期限チェック
    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      console.log(`[quizCache] EXPIRED: ${key}`);
      deleteCachedQuiz(key).catch(() => {});
      return null;
    }
    console.log(`[quizCache] HIT: ${key}`);
    return row;
  } catch (e) {
    console.error('[quizCache] GET error:', e);
    return null;
  }
}

// ── UPSERT ───────────────────────────────────────────────────
export async function saveCachedQuiz(p: {
  cacheKey:    string;
  quizType:    string;
  sourceType:  string;
  sourceId?:   string;
  level?:      string;
  data:        unknown[];
  createdBy?:  string;
  expiresAt?:  Date | null;
}): Promise<boolean> {
  if (!SB_URL) {
    console.log('[quizCache] Supabase未接続 → 保存スキップ');
    return false;
  }
  const { cacheKey, quizType, sourceType, sourceId = '', level = 'level_600',
          data, createdBy, expiresAt = null } = p;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${TABLE}`, {
      method:  'POST',
      headers: { ...headers(), Prefer: 'return=minimal,resolution=merge-duplicates' },
      body:    JSON.stringify({
        cache_key:   cacheKey,
        quiz_type:   quizType,
        source_type: sourceType,
        source_id:   sourceId,
        level,
        data,
        created_by:  createdBy ?? null,
        expires_at:  expiresAt ? expiresAt.toISOString() : null,
      }),
    });
    if (!r.ok) {
      const txt = await r.text();
      console.error(`[quizCache] SAVE ${r.status}:`, txt.slice(0, 120));
      return false;
    }
    console.log(`[quizCache] SAVED: ${cacheKey} (${data.length}問)`);
    return true;
  } catch (e) {
    console.error('[quizCache] SAVE error:', e);
    return false;
  }
}

// ── 削除（有効期限切れ用）────────────────────────────────────
async function deleteCachedQuiz(key: string): Promise<void> {
  if (!SB_URL) return;
  await fetch(`${SB_URL}/rest/v1/${TABLE}?cache_key=eq.${encodeURIComponent(key)}`, {
    method: 'DELETE', headers: headers(),
  }).catch(() => {});
}
