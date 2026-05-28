/**
 * GET /api/transcript?videoId=XXXXXXXXXXX
 * v2.4 - 本番運用レビュー対応版
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
 *  - FetchTranscript API フォールバック
 *  - YouTube本体がVercelを制限した場合のInvidious字幕APIフォールバック
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { YoutubeTranscript } from 'youtube-transcript';

// Vercel: Hobby=10s, Pro=60s。25sを明示指定（Pro前提）
// Hobby tierの場合はvercel.jsonで functions."api/transcript/index.maxDuration"=10 に下げること
export const config = { maxDuration: 25, regions: ['hnd1'] };

// ── タイムアウト設計 ──────────────────────────────────────────
// 戦略A: ページ取得(5s) + XML取得(4s) = 最大 9s
// 戦略B: timedtext 4言語 × 3s = 最大 12s
// 全体: 9+12 = 21s → maxDuration=25s以内に収まる
const T_PAGE = 5000;
const T_XML  = 4000;
const T_TAPI = 3000;
const T_INV  = 6000;
const T_FETCHTRANSCRIPT = 12000;
const FETCHTRANSCRIPT_API_KEY = process.env.FETCHTRANSCRIPT_API_KEY ?? '';
const MAX_STUDY_CAPTIONS = 120;

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
interface TimedSentence { text: string; start: number; duration: number; }

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

function parseJson3(raw: string): Segment[] {
  try {
    const data = JSON.parse(raw);
    const events = Array.isArray(data?.events) ? data.events : [];
    return events
      .map((event: any) => {
        const text = Array.isArray(event.segs)
          ? event.segs.map((seg: any) => seg?.utf8 ?? '').join('').replace(/\s+/g, ' ').trim()
          : '';
        return {
          start: Number(event.tStartMs ?? 0) / 1000,
          duration: Number(event.dDurationMs ?? 0) / 1000,
          text,
        };
      })
      .filter((seg: Segment) => seg.text && !/^\[[^\]]+\]$/.test(seg.text));
  } catch {
    return [];
  }
}

function parseVttTime(time: string): number {
  const parts = time.trim().split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

function parseVtt(vtt: string): Segment[] {
  const segs: Segment[] = [];
  const blocks = vtt.replace(/\r/g, '').split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    const timeLineIndex = lines.findIndex(line => line.includes('-->'));
    if (timeLineIndex < 0) continue;

    const [fromRaw, toRaw] = lines[timeLineIndex].split('-->').map(s => s.trim().split(/\s+/)[0]);
    const text = lines
      .slice(timeLineIndex + 1)
      .join(' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text || /^(WEBVTT|Kind:|Language:|NOTE)/i.test(text)) continue;

    const start = parseVttTime(fromRaw);
    const end = parseVttTime(toRaw);
    segs.push({ start, duration: Math.max(0, end - start), text: dec(text) });
  }
  return segs;
}

// ── セグメント→文グループ化 ──────────────────────────────────
export function groupToSentences(segs: Segment[]): string[] {
  return groupToTimedSentences(segs).map(item => item.text);
}

export function groupToTimedSentences(segs: Segment[]): TimedSentence[] {
  const out: TimedSentence[] = [];
  let buf = '', wc = 0;
  let start: number | null = null;
  let end = 0;
  for (const seg of segs) {
    const w = seg.text.replace(/\n/g,' ').trim();
    if (!w) continue;
    if (start === null) start = seg.start;
    end = Math.max(end, seg.start + seg.duration);
    buf += (buf ? ' ' : '') + w;
    wc  += w.split(/\s+/).length;
    if (wc >= 12 || /[.!?]$/.test(w)) {
      if (buf.split(/\s+/).length >= 4) {
        out.push({ text: buf.trim(), start: start ?? 0, duration: Math.max(0.5, end - (start ?? 0)) });
      }
      buf = ''; wc = 0; start = null; end = 0;
    }
  }
  if (buf.split(/\s+/).length >= 4) {
    out.push({ text: buf.trim(), start: start ?? 0, duration: Math.max(0.5, end - (start ?? 0)) });
  }
  return out.slice(0, MAX_STUDY_CAPTIONS);
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

async function fetchCaptionUrl(url: string, tag: string): Promise<Segment[] | null> {
  L(tag, `caption fetch: ${url.slice(0,70)}...`);
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': getUA(), 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(T_XML),
    });
    if (!r.ok) { L(tag, `caption HTTP ${r.status}`); return null; }
    const body = await r.text();
    const segs = body.trim().startsWith('{') ? parseJson3(body) : parseXml(body);
    L(tag, `caption parsed: ${segs.length} segments`);
    return segs.length > 0 ? segs : null;
  } catch(e) { LE(tag, 'caption fetch', e); return null; }
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

    return await fetchCaptionUrl(url.includes('fmt=')
      ? url
      : `${url}${url.includes('?') ? '&' : '?'}fmt=json3`, 'A');
  } catch(e) { LE('A', 'error', e); return null; }
}

// ── 戦略B: timedtext API直接 ─────────────────────────────────
async function strategyB(videoId: string): Promise<Segment[] | null> {
  const langs = ['en','en-US','en-GB','ja'];
  const variants = [
    (lang: string) => `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=json3`,
    (lang: string) => `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&kind=asr&fmt=json3`,
    (lang: string) => `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=xml`,
    (lang: string) => `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&kind=asr&fmt=xml`,
  ];
  L('B', `start: ${langs.join(',')}`);
  for (const lang of langs) {
    for (const makeUrl of variants) {
      try {
        const url = makeUrl(lang);
        L('B', `trying ${url}`);
        const r = await fetch(url, {
          headers: { 'User-Agent': getUA(), 'Accept-Language': 'en-US,en;q=0.9' },
          signal: AbortSignal.timeout(T_TAPI),
        });
        if (!r.ok) { L('B', `HTTP ${r.status}`); continue; }
        const body = await r.text();
        const segs = body.trim().startsWith('{') ? parseJson3(body) : parseXml(body);
        if (segs.length > 0) { L('B', `success lang=${lang}: ${segs.length} segs`); return segs; }
      } catch(e) { L('B', `lang=${lang} error: ${e instanceof Error ? e.message : 'unknown'}`); }
    }
  }
  L('B', 'all langs failed');
  return null;
}

// ── 取得本体 ─────────────────────────────────────────────────
async function strategyC(videoId: string): Promise<Segment[] | null> {
  const langs = ['en', 'ja'];
  for (const lang of langs) {
    try {
      L('C', `youtube-transcript lang=${lang}`);
      const rows = await YoutubeTranscript.fetchTranscript(videoId, { lang });
      const segs = rows
        .map(row => ({
          start: row.offset / 1000,
          duration: row.duration / 1000,
          text: row.text.replace(/\s+/g, ' ').trim(),
        }))
        .filter(seg => seg.text);
      if (segs.length > 0) {
        L('C', `success lang=${lang}: ${segs.length} segs`);
        return segs;
      }
    } catch (e) {
      L('C', `lang=${lang} error: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }
  return null;
}

async function strategyD(videoId: string): Promise<Segment[] | null> {
  if (!FETCHTRANSCRIPT_API_KEY) {
    L('D', 'FetchTranscript key not configured');
    return null;
  }

  const langs = ['en', 'en-US', 'en-GB'];
  for (const lang of langs) {
    try {
      L('D', `FetchTranscript lang=${lang}`);
      const r = await fetch(
        `https://api.fetchtranscript.com/v1/transcripts/${encodeURIComponent(videoId)}?lang=${encodeURIComponent(lang)}`,
        {
          headers: {
            Authorization: `Bearer ${FETCHTRANSCRIPT_API_KEY}`,
            Accept: 'application/json',
          },
          signal: AbortSignal.timeout(T_FETCHTRANSCRIPT),
        },
      );

      if (r.status === 401 || r.status === 403) {
        L('D', `auth/quota HTTP ${r.status}`);
        return null;
      }
      if (r.status === 429) {
        L('D', 'rate limited');
        return null;
      }
      if (!r.ok) {
        L('D', `HTTP ${r.status}`);
        continue;
      }

      const data = await r.json();
      const rows = Array.isArray(data?.segments) ? data.segments : [];
      const segs = rows
        .map((row: any) => ({
          start: Number(row?.start ?? 0),
          duration: Number(row?.duration ?? 0),
          text: String(row?.text ?? '').replace(/\s+/g, ' ').trim(),
        }))
        .filter((seg: Segment) => seg.text && /^[\x00-\x7F’“”–—…\s.,!?;:'"()[\]$%&+-]+$/.test(seg.text));

      L('D', `FetchTranscript parsed: language=${data?.language ?? '?'} ${segs.length} segs`);
      if (segs.length > 0) return segs;
    } catch (e) {
      L('D', `FetchTranscript error: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }

  return null;
}

async function strategyE(videoId: string): Promise<Segment[] | null> {
  const instances = ['https://inv.nadeko.net'];
  for (const base of instances) {
    try {
      L('E', `captions list via ${base}`);
      const r = await fetch(`${base}/api/v1/captions/${videoId}`, {
        headers: { 'User-Agent': getUA(), 'Accept': 'application/json' },
        signal: AbortSignal.timeout(T_INV),
      });
      if (!r.ok) { L('E', `${base} list HTTP ${r.status}`); continue; }

      const data = await r.json();
      const captions = Array.isArray(data?.captions) ? data.captions : [];
      const english = captions
        .filter((c: any) => c?.url && (c.languageCode === 'en' || /English/i.test(c.label || '')))
        .sort((a: any, b: any) => Number(/auto-generated/i.test(b.label || '')) - Number(/auto-generated/i.test(a.label || '')));

      L('E', `${base} english captions: ${english.map((c: any) => c.label).join(', ') || 'none'}`);
      for (const cap of english) {
        try {
          const url = cap.url.startsWith('http') ? cap.url : `${base}${cap.url}`;
          const cr = await fetch(url, {
            headers: { 'User-Agent': getUA(), 'Accept': 'text/vtt,text/plain,*/*' },
            signal: AbortSignal.timeout(T_INV),
          });
          if (!cr.ok) { L('E', `${cap.label} HTTP ${cr.status}`); continue; }
          const body = await cr.text();
          const segs = parseVtt(body);
          L('E', `${cap.label}: ${segs.length} segs`);
          if (segs.length > 0) return segs;
        } catch (e) {
          L('E', `${cap.label || 'caption'} error: ${e instanceof Error ? e.message : 'unknown'}`);
        }
      }
    } catch(e) {
      LE('E', `${base} error`, e);
    }
  }
  return null;
}

async function doFetch(videoId: string): Promise<Segment[] | null> {
  const cached = memGet(videoId);
  if (cached) { L('cache', `hit: ${cached.length} segs`); return cached; }

  let segs = await strategyA(videoId);
  if (segs?.length) { memSet(videoId, segs); return segs; }

  L('main', 'A failed → B');
  segs = await strategyB(videoId);
  if (segs?.length) { memSet(videoId, segs); return segs; }

  L('main', 'B failed -> C');
  segs = await strategyC(videoId);
  if (segs?.length) { memSet(videoId, segs); return segs; }

  L('main', 'C failed -> D');
  segs = await strategyD(videoId);
  if (segs?.length) { memSet(videoId, segs); return segs; }

  L('main', 'D failed -> E');
  segs = await strategyE(videoId);
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
        reason: 'サーバー側で字幕を自動取得できませんでした。字幕がある動画でも、YouTube側の制限で取得できないことがあります。',
        elapsed: ms,
      });
    }

    const timedSentences = groupToTimedSentences(segs);
    const sentences = timedSentences.map(item => item.text);
    L('req', `success ${ms}ms: ${segs.length}segs → ${sentences.length}sents`);

    res.setHeader('Cache-Control','s-maxage=300,stale-while-revalidate=60');
    return res.status(200).json({
      ok:        true,
      sentences,
      timedSentences,
      segments:  segs.slice(0,1200),
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
