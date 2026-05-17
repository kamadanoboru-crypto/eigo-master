/**
 * GET /api/transcript?videoId=XXXXXXXXXXX
 * v2.3 - 本番運用レビュー対応版
 *
 * CRITICAL修正:
 *  [1] Vercelタイムアウト超過 → 全体 maxDuration=25s, 各fetch 5s以内に縮小
 *  [2] HTML解析の脆弱性 → JSON.parse優先 + 順序依存regex排除
 *  [3] 外部プロキシ依存 → サーバー側から完全排除
 * 追加:
 *  - インメモリキャッシュ (TTL 5分, 50件上限)
 *  - 並列リクエスト重複排除 (Deduplication)
 *  - 詳細ログ (どの戦略で止まったか可視化)
 *  - UAローテーション (簡易ボット回避)
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// Vercel: Hobby=10s, Pro=60s。25sを明示指定（Pro前提）
// Hobby tierの場合はvercel.jsonで functions."api/transcript/index.maxDuration"=10 に下げること
export const config = { maxDuration: 25 };

// ── タイムアウト設計 ──────────────────────────────────────────
// 戦略A: ページ取得(5s) + XML取得(4s) = 最大 9s
// 戦略B: timedtext 4言語 × 3s = 最大 12s
// 全体: 9+12 = 21s → maxDuration=25s以内に収まる
const T_PAGE = 5000;
const T_XML  = 4000;
const T_TAPI = 3000;

// ── UAローテーション ─────────────────────────────────────────
const UAS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/123.0.0.0 Safari/537.36',
];
let uaIdx = 0;
const getUA = () => { uaIdx = (uaIdx + 1) % UAS.length; return UAS[uaIdx]; };

// ── インメモリキャッシュ (TTL 5分) ───────────────────────────
interface CacheEntry { segs: Segment[]; ts: number; }
const memCache = new Map<string, CacheEntry>();
const MEM_TTL  = 5 * 60 * 1000;

function memGet(id: string): Segment[] | null {
  const e = memCache.get(id);
  if (!e) return null;
  if (Date.now() - e.ts > MEM_TTL) { memCache.delete(id); return null; }
  return e.segs;
}
function memSet(id: string, segs: Segment[]): void {
  if (memCache.size > 50) {
    const cut = Date.now() - MEM_TTL;
    for (const [k,v] of memCache) if (v.ts < cut) memCache.delete(k);
  }
  memCache.set(id, { segs, ts: Date.now() });
}

// ── 並列リクエスト重複排除 ───────────────────────────────────
const inflight = new Map<string, Promise<Segment[] | null>>();

// ── 型 ───────────────────────────────────────────────────────
export interface Segment { start: number; duration: number; text: string; }

// ── ロガー ────────────────────────────────────────────────────
const L = (tag: string, msg: string, d?: unknown) =>
  console.debug(`[transcript/${tag}]`, msg, ...(d !== undefined ? [d] : []));
const LE = (tag: string, msg: string, e?: unknown) =>
  console.error(`[transcript/${tag}] ERROR:`, msg, e instanceof Error ? e.message : e ?? '');

// ── HTMLエンティティ ─────────────────────────────────────────
function dec(s: string): string {
  return s.replace(/&amp;/g,'&').replace(/&#39;/g,"'")
          .replace(/&quot;/g,'"').replace(/&lt;/g,'<')
          .replace(/&gt;/g,'>').replace(/\n/g,' ').trim();
}

// ── XMLパース ────────────────────────────────────────────────
function parseXml(xml: string): Segment[] {
  const segs: Segment[] = [];
  const re = /<text\s+start="([\d.]+)"\s+dur="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const text = dec(m[3].replace(/<[^>]+>/g,''));
    if (text) segs.push({ start: parseFloat(m[1]), duration: parseFloat(m[2]), text });
  }
  return segs;
}

// ── セグメント→文グループ化 ──────────────────────────────────
export function groupToSentences(segs: Segment[]): string[] {
  const out: string[] = [];
  let buf = '', wc = 0;
  for (const seg of segs) {
    const w = seg.text.replace(/\n/g,' ').trim();
    if (!w) continue;
    buf += (buf ? ' ' : '') + w;
    wc  += w.split(/\s+/).length;
    if (wc >= 12 || /[.!?]$/.test(w)) {
      if (buf.split(/\s+/).length >= 4) out.push(buf.trim());
      buf = ''; wc = 0;
    }
  }
  if (buf.split(/\s+/).length >= 4) out.push(buf.trim());
  return out.slice(0, 20);
}

// ── XML URL取得 ───────────────────────────────────────────────
async function fetchXml(url: string, tag: string): Promise<Segment[] | null> {
  L(tag, `xml fetch: ${url.slice(0,70)}...`);
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': getUA() },
      signal: AbortSignal.timeout(T_XML),
    });
    if (!r.ok) { L(tag, `xml HTTP ${r.status}`); return null; }
    const xml = await r.text();
    if (!xml.includes('<text')) { L(tag, 'xml: no <text> nodes'); return null; }
    const segs = parseXml(xml);
    L(tag, `xml parsed: ${segs.length} segments`);
    return segs.length > 0 ? segs : null;
  } catch(e) { LE(tag, 'xml fetch', e); return null; }
}

// ── 戦略A: ページパース (CRITICAL#2修正済み) ──────────────────
// 修正前: baseUrl と languageCode の順序依存regex → 突然壊れる構造
// 修正後: JSON.parse優先 → regex fallback、言語は別途照合
async function strategyA(videoId: string): Promise<Segment[] | null> {
  L('A', `start videoId=${videoId}`);
  try {
    const r = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 'User-Agent': getUA(), 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(T_PAGE),
    });
    if (!r.ok) { L('A', `page HTTP ${r.status}`); return null; }
    const html = await r.text();
    L('A', `page: ${(html.length/1024).toFixed(0)}KB`);

    // captionTracksブロックを抽出
    const blockM = html.match(/"captionTracks":\s*(\[[\s\S]{0,10000}?\])/);
    if (!blockM) { L('A', 'captionTracks not found'); return null; }

    // 【修正】JSON.parseを優先（最も正確で順序依存なし）
    type Track = { baseUrl?: string; languageCode?: string };
    let tracks: Track[] = [];
    try {
      tracks = JSON.parse(blockM[1]);
      L('A', `JSON.parse ok: ${tracks.length} tracks`);
    } catch {
      // JSON失敗時だけregex（\\u0026 → & の変換を忘れずに）
      L('A', 'JSON.parse failed → regex fallback');
      const urlMs  = [...blockM[1].matchAll(/"baseUrl":"([^"]+)"/g)];
      const langMs = [...blockM[1].matchAll(/"languageCode":"([^"]+)"/g)];
      tracks = urlMs.map((u,i) => ({
        baseUrl:      u[1].replace(/\\u0026/g,'&'),
        languageCode: langMs[i]?.[1] ?? '',
      }));
    }

    if (!tracks.length) { L('A', 'no tracks'); return null; }
    L('A', 'tracks', tracks.map(t => t.languageCode));

    // 英語優先で選択
    const PRIO = ['en','a.en','en-US','en-GB','en-CA','en-AU'];
    let url: string | null = null;
    for (const lang of PRIO) {
      const t = tracks.find(t => t.languageCode === lang || t.languageCode?.startsWith('en'));
      if (t?.baseUrl) {
        url = t.baseUrl.replace(/\\u0026/g,'&');
        L('A', `selected: ${lang} → ${url.slice(0,60)}...`);
        break;
      }
    }
    if (!url && tracks[0]?.baseUrl) {
      url = (tracks[0].baseUrl as string).replace(/\\u0026/g,'&');
      L('A', `fallback first track: ${tracks[0].languageCode}`);
    }
    if (!url) { L('A', 'no url'); return null; }

    return await fetchXml(url, 'A');
  } catch(e) { LE('A', 'error', e); return null; }
}

// ── 戦略B: timedtext API直接 ─────────────────────────────────
async function strategyB(videoId: string): Promise<Segment[] | null> {
  const langs = ['en','a.en','en-US','en-GB'];
  L('B', `start: ${langs.join(',')}`);
  for (const lang of langs) {
    try {
      L('B', `trying lang=${lang}`);
      const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=xml`;
      const r = await fetch(url, {
        headers: { 'User-Agent': getUA(), 'Accept-Language': 'en-US,en;q=0.9' },
        signal: AbortSignal.timeout(T_TAPI),
      });
      if (!r.ok) { L('B', `lang=${lang} HTTP ${r.status}`); continue; }
      const xml = await r.text();
      if (!xml.includes('<text')) { L('B', `lang=${lang}: no <text>`); continue; }
      const segs = parseXml(xml);
      if (segs.length > 0) { L('B', `success lang=${lang}: ${segs.length} segs`); return segs; }
    } catch(e) { L('B', `lang=${lang} error: ${e instanceof Error ? e.message : 'unknown'}`); }
  }
  L('B', 'all langs failed');
  return null;
}

// ── 取得本体 ─────────────────────────────────────────────────
async function doFetch(videoId: string): Promise<Segment[] | null> {
  const cached = memGet(videoId);
  if (cached) { L('cache', `hit: ${cached.length} segs`); return cached; }

  let segs = await strategyA(videoId);
  if (segs?.length) { memSet(videoId, segs); return segs; }

  L('main', 'A failed → B');
  segs = await strategyB(videoId);
  if (segs?.length) { memSet(videoId, segs); return segs; }

  return null;
}

// ── ハンドラ ─────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok:false, reason:'Method not allowed' });

  const videoId = req.query.videoId as string;
  if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId))
    return res.status(400).json({ ok:false, reason:'Invalid videoId' });

  const t0 = Date.now();
  L('req', `start ${videoId}`);

  try {
    // 並列リクエスト重複排除
    let p = inflight.get(videoId);
    if (!p) {
      p = doFetch(videoId).finally(() => inflight.delete(videoId));
      inflight.set(videoId, p);
    } else {
      L('dedup', `reusing inflight: ${videoId}`);
    }

    const segs = await p;
    const ms   = Date.now() - t0;

    if (!segs?.length) {
      L('req', `failed ${ms}ms`);
      return res.status(200).json({
        ok: false,
        reason: '字幕が見つかりませんでした。英語字幕がないか非公開の動画です。',
        elapsed: ms,
      });
    }

    const sentences = groupToSentences(segs);
    L('req', `success ${ms}ms: ${segs.length}segs → ${sentences.length}sents`);

    res.setHeader('Cache-Control','s-maxage=300,stale-while-revalidate=60');
    return res.status(200).json({
      ok:        true,
      sentences,
      segments:  segs.slice(0,100),
      count:     segs.length,
      elapsed:   ms,
    });

  } catch(e) {
    const ms = Date.now() - t0;
    LE('req', `unexpected ${ms}ms`, e);
    return res.status(500).json({
      ok: false,
      reason: 'サーバーエラーが発生しました。しばらくして再試行してください。',
      elapsed: ms,
    });
  }
}
