import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI } from '../../../lib/aiClient';
import type { TranslateResponse } from '../../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TranslateResponse>,
) {
  if (req.method !== 'POST') return res.status(405).json({ translation: '', error: 'Method not allowed' });

  const { text, mode = 'sentence' } = req.body as { text?: string; mode?: string };
  if (!text) return res.status(400).json({ translation: '', error: 'text required' });

  const safeText = text.slice(0, 3000);
  const prompt = mode === 'full'
    ? `以下を自然な日本語に翻訳してください。段落構成を保ってください。翻訳のみ返してください。\n\n${safeText}`
    : `以下の英文を自然な日本語に翻訳してください。翻訳のみ返してください。\n\n"${safeText}"`;
  const maxTokens = mode === 'full' ? 1000 : 300;

  try {
    const translation = await callAI(prompt, maxTokens);
    return res.status(200).json({ translation: translation.trim() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[translate]', msg);
    return res.status(500).json({ translation: '翻訳に失敗しました。もう一度お試しください。', error: msg });
  }
}
