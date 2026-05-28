// @ts-nocheck
/**
 * lib/supabase.ts
 * Supabase設定 + fetch ベースクライアント
 *
 * 将来: @supabase/supabase-js に差し替えポイント
 *   import { createClient } from '@supabase/supabase-js'
 *   export const supabase = createClient(SB_URL, SB_ANON_KEY)
 */

export const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
export const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const SB_READY = Boolean(SB_URL && SB_ANON);

// ── ユーザーID（将来 supabase.auth.getUser() に差し替え）────
export function getUserId(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    let uid = localStorage.getItem('em_uid');
    if (!uid) {
      uid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('em_uid', uid);
    }
    return uid;
  } catch {
    if (!window._emUid) window._emUid = Math.random().toString(36).slice(2);
    return window._emUid;
  }
}

// ── fetch クライアント ────────────────────────────────────────
type FilterString = string;

interface SbClient {
  select: (filter?: FilterString) => Promise<Record<string, unknown>[]>;
  insert: (data: unknown)         => Promise<Record<string, unknown>[] | null>;
  delete: (filter: FilterString)  => Promise<void>;
  upsert: (data: unknown, onConflict?: string) => Promise<Record<string, unknown>[] | null>;
}

const NOOP: SbClient = {
  select: async () => [],
  insert: async () => null,
  delete: async () => {},
  upsert: async () => null,
};

export function sbFrom(table: string): SbClient {
  if (!SB_READY) return NOOP;

  const base = `${SB_URL}/rest/v1/${table}`;
  const headers = {
    apikey: SB_ANON,
    Authorization: `Bearer ${SB_ANON}`,
    'Content-Type': 'application/json',
  };

  return {
    select: async (filter = '') => {
      try {
        const query = filter.startsWith('select=')
          ? filter
          : filter.startsWith('*&')
            ? `select=${filter}`
            : filter
              ? `select=*&${filter}`
              : 'select=*';
        const r = await fetch(`${base}?${query}`, {
          headers: { ...headers, Prefer: 'return=representation' },
        });
        if (!r.ok) { console.error(`[sb] SELECT ${table} ${r.status}`); return []; }
        return r.json() as Promise<Record<string, unknown>[]>;
      } catch (e) {
        console.error(`[sb] SELECT ${table}`, e);
        return [];
      }
    },

    insert: async (data) => {
      try {
        const r = await fetch(base, {
          method: 'POST',
          headers: { ...headers, Prefer: 'return=representation' },
          body: JSON.stringify(data),
        });
        if (!r.ok) { console.error(`[sb] INSERT ${table} ${r.status}`); return null; }
        return r.json() as Promise<Record<string, unknown>[]>;
      } catch (e) {
        console.error(`[sb] INSERT ${table}`, e);
        return null;
      }
    },

    delete: async (filter) => {
      try {
        const r = await fetch(`${base}?${filter}`, { method: 'DELETE', headers });
        if (!r.ok) console.error(`[sb] DELETE ${table} ${r.status}`);
      } catch (e) {
        console.error(`[sb] DELETE ${table}`, e);
      }
    },

    upsert: async (data, onConflict) => {
      try {
        const url = onConflict ? `${base}?on_conflict=${encodeURIComponent(onConflict)}` : base;
        const r = await fetch(url, {
          method: 'POST',
          headers: { ...headers, Prefer: 'return=representation,resolution=merge-duplicates' },
          body: JSON.stringify(data),
        });
        if (!r.ok) { console.error(`[sb] UPSERT ${table} ${r.status}`); return null; }
        return r.json() as Promise<Record<string, unknown>[]>;
      } catch (e) {
        console.error(`[sb] UPSERT ${table}`, e);
        return null;
      }
    },
  };
}

// Window型拡張
declare global {
  interface Window { _emUid?: string; }
}
