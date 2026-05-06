import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';
import type { Caption } from '../../../types';

interface ChunkResponse { chunks: { en: string; ja: string }[]; }
interface ChunkRequest  { sentences?: string[]; text?: string; }

function fallbackChunk(sentence: string) {
  const words = sentence.split(' ');
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3).join(' '));
  return {
    en: sentence,
    ja: '（生成失敗）',
  };
}

const normalizeSentences = (body: ChunkRequest): string[] => {
  if (Array.isArray(body.sentences) && body.sentences.length) return body.sentences;
  if (typeof body.text === 'string' && body.text.trim()) {
    const raw = body.text.trim();
    const parts = raw
      .split(/\n+/)
      .map(line => line.trim())
      .filter(Boolean)
      .flatMap(line => line.split(/(?<=[。.!?！？])\s*/));
    const sentences = parts.map(s => s.trim()).filter(s => s.split(' ').length >= 4);
    return sentences.length ? sentences : [raw];
  }
  return [];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChunkResponse | { error: string }>,
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body as ChunkRequest;
  const sentences = normalizeSentences(body);
  const chunks: { en: string; ja: string }[] = [];
  const BATCH = 4;

  try {
    for (let i = 0; i < sentences.length; i += BATCH) {
      const batch = sentences.slice(i, i + BATCH);
      const prompt = `以下の英文を語順のまま理解するためにチャンク分解してください。
英文:
${batch.map((s, j) => `${j + 1}. ${s}`).join('\n')}

JSON配列のみ返してください:
[{"english":"英文そのまま","chunks":["chunk1","chunk2"],"meaning":["語順イメージ1","語順イメージ2"]}]
- chunksは3〜6個、meaningは語順イメージ（直訳不要）、JSON以外不要`;

      try {
        const text = await callAI(prompt, 1200);
        const parsed = parseJSON<Partial<Caption>[]>(text, []);
        if (parsed.length) {
          chunks.push(...parsed.map(c => ({
            en: c.english || '',
            ja: Array.isArray(c.meaning) && c.meaning.length ? String(c.meaning[0]) : '（生成失敗）',
          })));
        } else {
          batch.forEach(s => chunks.push(fallbackChunk(s)));
        }
      } catch {
        batch.forEach(s => chunks.push(fallbackChunk(s)));
      }

      if (i + BATCH < sentences.length) await new Promise(r => setTimeout(r, 300));
    }
  } catch {
    if (sentences.length) {
      sentences.forEach(s => chunks.push(fallbackChunk(s)));
    }
  } finally {
    return res.status(200).json({ chunks });
  }
}
