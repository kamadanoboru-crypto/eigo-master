// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const AI_MODELS = {
  groq: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
  cohere: process.env.COHERE_MODEL || 'command-r-08-2024',
  gemini: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  openai: process.env.OPENAI_MODEL || 'gpt-4o-mini',
};

const maskSecrets = (value: unknown) =>
  String(value instanceof Error ? value.message : value)
    .replace(/sk-[A-Za-z0-9._-]+/g, 'sk-***')
    .replace(/gsk_[A-Za-z0-9._-]+/g, 'gsk_***')
    .replace(/AIza[A-Za-z0-9._-]+/g, 'AIza***');

async function check(name: string, configured: boolean, fn?: () => Promise<any>) {
  const started = Date.now();
  if (!configured) {
    return { id: name, status: 'disconnected', latencyMs: null, message: '環境変数が未設定です。', lastError: null };
  }
  if (!fn) {
    return { id: name, status: 'healthy', latencyMs: null, message: 'キー設定済み。生成チェックは必要時のみ実行します。', lastError: null };
  }
  try {
    const result = await fn();
    return { id: name, status: 'healthy', latencyMs: Date.now() - started, message: result?.message || '接続確認 OK', lastError: null };
  } catch (e) {
    const message = maskSecrets(e);
    const openAiInactive = name === 'openai' && /401|invalid_api_key|Incorrect API key|billing|quota/i.test(message);
    const limited = /429|quota|rate|limit|上限/i.test(message);
    return {
      id: name,
      status: openAiInactive ? 'inactive' : limited ? 'limited' : 'error',
      latencyMs: Date.now() - started,
      message: openAiInactive
        ? 'キーはありますが、課金または有効化前のため利用できません。課金後に再チェックしてください。'
        : limited
          ? '利用上限またはレート制限の可能性があります。'
          : '接続確認に失敗しました。',
      lastError: message,
    };
  }
}

async function getAiRuntimeStatus() {
  if (!SB_URL || !SB_ANON) return null;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/ai_service_status?select=*&service=eq.translation&limit=1`, {
      headers: {
        apikey: SB_ANON,
        Authorization: `Bearer ${SB_ANON}`,
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return null;
    const rows = await r.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) return null;
    const at = row.occurred_at || row.updated_at || '';
    return {
      id: 'ai-runtime',
      status: row.status || 'unknown',
      latencyMs: null,
      message: `${row.message || 'Last AI runtime issue'}${at ? ` / ${new Date(at).toLocaleString('ja-JP')}` : ''}`,
      lastError: [
        row.source ? `source: ${row.source}` : '',
        row.provider_priority ? `providers: ${row.provider_priority}` : '',
        row.detail || '',
      ].filter(Boolean).join('\n'),
    };
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const deep = req.query.deep === '1';
  const services = await Promise.all([
    check('supabase', Boolean(SB_URL && SB_ANON), async () => {
      const r = await fetch(`${SB_URL}/rest/v1/talk_posts?select=id&limit=1`, {
        headers: { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
      return { message: 'DB 接続 OK' };
    }),
    deep
      ? check('groq', Boolean(process.env.GROQ_API_KEY), async () => {
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
          body: JSON.stringify({
            model: AI_MODELS.groq,
            messages: [{ role: 'user', content: 'Reply with OK only.' }],
            max_tokens: 4,
            temperature: 0,
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
        return { message: `AI generation OK (${AI_MODELS.groq})` };
      })
      : check('groq', Boolean(process.env.GROQ_API_KEY), async () => {
        const r = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
          signal: AbortSignal.timeout(5000),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
        return { message: `Key/model list OK (${AI_MODELS.groq}); generation not checked` };
      }),
    deep
      ? check('cohere', Boolean(process.env.COHERE_API_KEY), async () => {
        const r = await fetch('https://api.cohere.com/v1/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.COHERE_API_KEY}` },
          body: JSON.stringify({
            model: AI_MODELS.cohere,
            message: 'Reply with OK only.',
            max_tokens: 4,
            temperature: 0,
          }),
          signal: AbortSignal.timeout(7000),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
        return { message: `AI generation OK (${AI_MODELS.cohere})` };
      })
      : check('cohere', Boolean(process.env.COHERE_API_KEY), undefined),
    deep
      ? check('gemini', Boolean(process.env.GEMINI_API_KEY), async () => {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODELS.gemini}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Reply with OK only.' }] }],
            generationConfig: { maxOutputTokens: 4, temperature: 0 },
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
        return { message: `AI generation OK (${AI_MODELS.gemini})` };
      })
      : check('gemini', Boolean(process.env.GEMINI_API_KEY), async () => {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`, {
          signal: AbortSignal.timeout(5000),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
        return { message: `Key/model list OK (${AI_MODELS.gemini}); generation not checked` };
      }),
    deep
      ? check('openai', Boolean(process.env.OPENAI_API_KEY), async () => {
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          body: JSON.stringify({
            model: AI_MODELS.openai,
            messages: [{ role: 'user', content: 'Reply with OK only.' }],
            max_tokens: 4,
            temperature: 0,
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
        return { message: `AI generation OK (${AI_MODELS.openai})` };
      })
      : check('openai', Boolean(process.env.OPENAI_API_KEY), async () => {
        const r = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          signal: AbortSignal.timeout(5000),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
        return { message: `Key/model list OK (${AI_MODELS.openai}); generation not checked` };
      }),
    check('youtube-transcript', true, async () => ({ message: '機能は有効です。字幕取得は動画を開いた時に確認します。' })),
    check('bbc-news', true, async () => ({ message: '機能は有効です。RSS接続はニュース取得時に確認します。' })),
    check('pagesix-news', true, async () => ({ message: '機能は有効です。RSS接続はニュース取得時に確認します。' })),
  ]);
  const aiRuntimeStatus = await getAiRuntimeStatus();
  if (aiRuntimeStatus) services.push(aiRuntimeStatus);

  res.status(200).json({
    ok: true,
    checkedAt: new Date().toISOString(),
    note: '接続回数は外部API側の管理値のため、このアプリからは取得できません。直近チェックの状態とエラーを表示します。',
    services,
  });
}
