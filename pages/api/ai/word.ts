import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';
import type { WordResponse } from '../../../types';

const FALLBACK: WordResponse = { meaning: '取得できませんでした', pos: '', example: '' };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WordResponse>,
) {
  if (req.method !== 'POST') return res.status(405).json(FALLBACK);

  const { word, sentence } = req.body as { word?: string; sentence?: string };
  if (!word) return res.status(400).json(FALLBACK);

  const prompt = `文脈: "${sentence ?? ''}"
単語「${word}」の意味を日本語で20字以内で返してください。
JSON: {"meaning":"意味","pos":"品詞","example":"英文例1つ"}
JSON以外不要。`;

  try {
    const text = await callAI(prompt, 200);
    const parsed = parseJSON<WordResponse | null>(text, null);
    return res.status(200).json(parsed?.meaning ? parsed : FALLBACK);
  } catch {
    return res.status(200).json(FALLBACK);
  }
}
