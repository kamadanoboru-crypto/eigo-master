import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';
import type { Caption } from '../../../types';

interface ChunkResponse { captions: Partial<Caption>[]; }
interface ChunkRequest  { sentences: string[]; }

function fallback(sentence: string): Partial<Caption> {
  const words = sentence.split(' ');
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3).join(' '));
  return { english: sentence, chunks: chunks.slice(0, 6), meaning: chunks.map(() => '（生成失敗）') };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChunkResponse | { error: string }>,
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sentences } = req.body as ChunkRequest;
  if (!sentences?.length) return res.status(400).json({ error: 'sentences required' });

  const results: Partial<Caption>[] = [];
  const BATCH = 4;

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
      if (parsed.length) results.push(...parsed);
      else batch.forEach(s => results.push(fallback(s)));
    } catch {
      batch.forEach(s => results.push(fallback(s)));
    }

    if (i + BATCH < sentences.length) await new Promise(r => setTimeout(r, 300));
  }

  return res.status(200).json({ captions: results });
}
