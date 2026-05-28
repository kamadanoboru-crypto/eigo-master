// @ts-nocheck
/**
 * lib/aiClient.ts  — サーバーサイド専用
 *
 * フォールバック順: Groq → Cohere → Gemini → OpenAI
 * 環境変数: AI_PROVIDER_PRIORITY=groq,cohere,gemini,openai
 *
 * ・JSON parse 失敗もフォールバック対象
 * ・全失敗時は呼び出し元が学習用フォールバックを返す
 */

type Provider = 'groq' | 'cohere' | 'gemini' | 'openai';

function getPriority(): Provider[] {
  const raw = process.env.AI_PROVIDER_PRIORITY ?? 'groq,cohere,gemini,openai';
  const allowed = new Set<Provider>(['groq', 'cohere', 'gemini', 'openai']);
  return raw.split(',').map(s => s.trim() as Provider).filter(p => allowed.has(p));
}

const MODELS: Partial<Record<Provider, string>> = {
  groq:   'llama-3.1-8b-instant',
  cohere: 'command-r-plus',
  gemini: 'gemini-2.0-flash',
  openai: 'gpt-4o-mini',
};

// ── 共通エントリーポイント ────────────────────────────────────
export async function callAI(
  prompt: string,
  maxTokens = 1000,
  system?: string,
): Promise<string> {
  const providers = getPriority();
  const log: string[] = [];

  for (const p of providers) {
    try {
      console.log(`[ai] trying ${p}...`);
      const text = await dispatch(p, prompt, maxTokens, system);
      if (!text || text.trim().length === 0) {
        log.push(`${p}:empty`);
        console.warn(`[ai] ${p} returned empty`);
        continue;
      }
      console.log(`[ai] success ${p} (${text.length} chars)`);
      return text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.push(`${p}:${msg.slice(0, 60)}`);
      console.warn(`[ai] ${p} failed: ${msg}`);
    }
  }

  // 全プロバイダー失敗
  const summary = log.join(' | ');
  console.error(`[ai] ALL providers failed: ${summary}`);
  throw new Error(`AI_ALL_FAILED: ${summary}`);
}

async function dispatch(p: Provider, prompt: string, max: number, sys?: string): Promise<string> {
  switch (p) {
    case 'groq':   return groq(prompt, max, sys);
    case 'cohere': return cohere(prompt, max, sys);
    case 'gemini': return gemini(prompt, max, sys);
    case 'openai': return openai(prompt, max, sys);
    default:       throw new Error(`unknown provider: ${p}`);
  }
}

// ── Groq ─────────────────────────────────────────────────────
async function groq(prompt: string, max: number, sys?: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not set');

  const msgs = sys
    ? [{ role: 'system', content: sys }, { role: 'user', content: prompt }]
    : [{ role: 'user', content: prompt }];

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODELS.groq, messages: msgs, max_tokens: max, temperature: 0.3 }),
    signal: AbortSignal.timeout(12000),
  });
  if (r.status === 429) throw new Error('rate_limit');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  return d?.choices?.[0]?.message?.content ?? '';
}

// ── Cohere ────────────────────────────────────────────────────
async function cohere(prompt: string, max: number, sys?: string): Promise<string> {
  const key = process.env.COHERE_API_KEY;
  if (!key) throw new Error('COHERE_API_KEY not set');

  const r = await fetch('https://api.cohere.com/v1/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODELS.cohere,
      message: prompt,
      preamble: sys ?? 'You are a helpful English learning assistant.',
      max_tokens: max,
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(18000),
  });
  if (r.status === 429) throw new Error('rate_limit');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  return d?.text ?? '';
}

// ── Gemini ────────────────────────────────────────────────────
async function gemini(prompt: string, max: number, sys?: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');

  const parts = sys
    ? [{ text: `${sys}\n\n` }, { text: prompt }]
    : [{ text: prompt }];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent?key=${key}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: { maxOutputTokens: max, temperature: 0.3 },
    }),
    signal: AbortSignal.timeout(18000),
  });
  if (r.status === 429) throw new Error('rate_limit');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  return d?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ── OpenAI ────────────────────────────────────────────────────
async function openai(prompt: string, max: number, sys?: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');

  const msgs = sys
    ? [{ role: 'system', content: sys }, { role: 'user', content: prompt }]
    : [{ role: 'user', content: prompt }];

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODELS.openai, messages: msgs, max_tokens: max, temperature: 0.3 }),
    signal: AbortSignal.timeout(20000),
  });
  if (r.status === 429) throw new Error('rate_limit');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  return d?.choices?.[0]?.message?.content ?? '';
}

// ── JSON パース（安全版）─────────────────────────────────────
// JSON parse 失敗もフォールバック対象
export function parseJSON<T>(text: string, fallback: T): T {
  // ① コードブロック除去
  let clean = text
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  // ② 直接パース
  try { return JSON.parse(clean) as T; } catch { /* next */ }

  // ③ 配列/オブジェクト部分を抽出して再試行
  const arrM = clean.match(/\[[\s\S]+\]/);
  const objM = clean.match(/\{[\s\S]+\}/);
  const candidate = arrM?.[0] ?? objM?.[0];
  if (candidate) {
    try { return JSON.parse(candidate) as T; } catch { /* next */ }
  }

  console.warn('[parseJSON] parse failed, using fallback. text=', text.slice(0, 100));
  return fallback;
}
