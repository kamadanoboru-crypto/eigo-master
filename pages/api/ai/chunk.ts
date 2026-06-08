import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';

interface ChunkResponse { chunks: { en: string; ja: string }[]; }
interface ChunkRequest { sentences?: string[]; text?: string; source?: string; }
const MAX_STUDY_CAPTIONS = 120;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

type TranslationItem = {
  english?: string;
  en?: string;
  japanese?: string;
  ja?: string;
  translation?: string;
  meaning?: string | string[];
};

function fallbackSentence(sentence: string) {
  return {
    en: sentence,
    ja: '\u65e5\u672c\u8a9e\u30a4\u30e1\u30fc\u30b8\u3092\u751f\u6210\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002\u3082\u3046\u4e00\u5ea6AI\u751f\u6210\u3092\u8a66\u3057\u3066\u304f\u3060\u3055\u3044\u3002',
  };
}

const normalizeSentences = (body: ChunkRequest): string[] => {
  if (Array.isArray(body.sentences) && body.sentences.length) {
    return body.sentences.map(s => String(s).trim()).filter(Boolean).slice(0, MAX_STUDY_CAPTIONS);
  }
  if (typeof body.text === 'string' && body.text.trim()) {
    const raw = body.text.trim();
    const parts = raw
      .split(/\n+/)
      .map(line => line.trim())
      .filter(Boolean)
      .flatMap(line => line.split(/(?<=[.!?])\s+/));
    const sentences = parts.map(s => s.trim()).filter(s => s.split(/\s+/).length >= 4);
    return (sentences.length ? sentences : [raw]).slice(0, MAX_STUDY_CAPTIONS);
  }
  return [];
};

const extractJapanese = (item: TranslationItem): string => {
  if (typeof item.japanese === 'string') return item.japanese;
  if (typeof item.ja === 'string') return item.ja;
  if (typeof item.translation === 'string') return item.translation;
  if (Array.isArray(item.meaning)) return item.meaning.join(' / ');
  if (typeof item.meaning === 'string') return item.meaning;
  return '';
};

const AI_LIMIT_MESSAGE = 'システム側のAI利用上限に達したため、現在翻訳を利用できません。数日後に再度お試しください。';
const isAiLimitError = (err: unknown) => /rate_limit|quota|429|RESOURCE_EXHAUSTED|insufficient_quota/i.test(
  err instanceof Error ? err.message : String(err),
);

const maskSecrets = (value: unknown) =>
  String(value instanceof Error ? value.message : value)
    .replace(/sk-[A-Za-z0-9._-]+/g, 'sk-***')
    .replace(/gsk_[A-Za-z0-9._-]+/g, 'gsk_***')
    .replace(/AIza[A-Za-z0-9._-]+/g, 'AIza***');

async function recordAiServiceStatus(source: string, err: unknown) {
  if (!SB_URL || !SB_ANON) return;
  const detail = maskSecrets(err).slice(0, 1000);
  const status = isAiLimitError(err) ? 'limited' : 'error';
  try {
    await fetch(`${SB_URL}/rest/v1/ai_service_status?on_conflict=service`, {
      method: 'POST',
      headers: {
        apikey: SB_ANON,
        Authorization: `Bearer ${SB_ANON}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal,resolution=merge-duplicates',
      },
      body: JSON.stringify({
        service: 'translation',
        status,
        source,
        message: status === 'limited' ? 'AI provider limit reached' : 'AI provider error',
        detail,
        provider_priority: process.env.AI_PROVIDER_PRIORITY || 'groq,cohere,gemini,openai',
        occurred_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {}
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChunkResponse | { error: string; detail?: string }>,
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sentences = normalizeSentences(req.body as ChunkRequest);
  const source = String((req.body as ChunkRequest)?.source || 'ai_chunk').slice(0, 80);
  if (!sentences.length) return res.status(400).json({ error: 'sentences or text required' });

  const chunks: { en: string; ja: string }[] = [];
  const BATCH = 6;
  const system = [
    'You are an English learning assistant for Japanese speakers.',
    'Return valid JSON only.',
    'For each full English sentence, produce one natural Japanese meaning image.',
    'Do not split the sentence into chunks.',
  ].join(' ');

  for (let i = 0; i < sentences.length; i += BATCH) {
    const batch = sentences.slice(i, i + BATCH);
    const prompt = `Create one natural Japanese meaning for each English sentence below.
Return JSON only.

English sentences:
${batch.map((s, j) => `${j + 1}. ${s}`).join('\n')}

JSON shape:
[
  {
    "english": "original English sentence",
    "japanese": "natural Japanese meaning"
  }
]

Rules:
- Keep the same order and same number of items.
- Do not split sentences into chunks.
- Japanese must be natural and useful for Japanese learners.
- No markdown, no explanation, JSON only.`;

    try {
      const text = await callAI(prompt, 1400, system);
      const parsed = parseJSON<TranslationItem[]>(text, []);
      if (parsed.length) {
        parsed.forEach((item, j) => {
          const en = String(item.english || item.en || batch[j] || '').trim();
          const ja = extractJapanese(item).trim();
          chunks.push(ja ? { en, ja } : fallbackSentence(en || batch[j]));
        });
        for (let j = parsed.length; j < batch.length; j += 1) {
          chunks.push(fallbackSentence(batch[j]));
        }
      } else {
        batch.forEach(s => chunks.push(fallbackSentence(s)));
      }
    } catch (err) {
      console.error('[ai/chunk]', err instanceof Error ? err.message : err);
      if (isAiLimitError(err)) {
        await recordAiServiceStatus(source, err);
        return res.status(429).json({
          error: AI_LIMIT_MESSAGE,
          detail: err instanceof Error ? err.message : String(err),
        });
      }
      batch.forEach(s => chunks.push(fallbackSentence(s)));
    }

    if (i + BATCH < sentences.length) await new Promise(r => setTimeout(r, 250));
  }

  return res.status(200).json({ chunks });
}
