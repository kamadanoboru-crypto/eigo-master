// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

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
    return { id: name, status: 'unknown', latencyMs: null, message: 'キー設定済み。軽量チェック対象外です。', lastError: null };
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const services = await Promise.all([
    check('supabase', Boolean(SB_URL && SB_ANON), async () => {
      const r = await fetch(`${SB_URL}/rest/v1/talk_posts?select=id&limit=1`, {
        headers: { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
      return { message: 'DB 接続 OK' };
    }),
    check('groq', Boolean(process.env.GROQ_API_KEY), async () => {
      const r = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
      return { message: 'モデル一覧取得 OK' };
    }),
    check('cohere', Boolean(process.env.COHERE_API_KEY)),
    check('gemini', Boolean(process.env.GEMINI_API_KEY), async () => {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
      return { message: 'モデル一覧取得 OK' };
    }),
    check('openai', Boolean(process.env.OPENAI_API_KEY), async () => {
      const r = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text().catch(() => '')}`);
      return { message: 'モデル一覧取得 OK' };
    }),
    check('youtube-transcript', true),
    check('bbc-news', true),
    check('pagesix-news', true),
  ]);

  res.status(200).json({
    ok: true,
    checkedAt: new Date().toISOString(),
    note: '接続回数は外部API側の管理値のため、このアプリからは取得できません。直近チェックの状態とエラーを表示します。',
    services,
  });
}
