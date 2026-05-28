// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';
import { getAICache, normalizeAIInput, saveAICache } from '../../../lib/aiCache';
import { spendCoins } from '../../../lib/economy';
import type { WordResponse } from '../../../types';

const COST = 5;
const FALLBACK: WordResponse = { meaning: '取得できませんでした', pos: '', example: '' };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ...FALLBACK, error: 'Method not allowed' });
  }

  const { word, sentence = '', userId } = req.body as {
    word?: string;
    sentence?: string;
    userId?: string;
  };

  if (!word?.trim()) {
    return res.status(400).json({ ...FALLBACK, error: 'word required' });
  }

  const safeWord = normalizeAIInput(word).slice(0, 80);
  const safeSentence = normalizeAIInput(sentence);
  const cacheText = `${safeWord}\n${safeSentence}`;

  const cached = await getAICache('word', 'meaning', cacheText);
  if (cached?.payload?.meaning) {
    return res.status(200).json({
      ...cached.payload,
      fromCache: true,
      cost: 0,
    });
  }

  if (!userId) {
    return res.status(402).json({
      ...FALLBACK,
      error: 'AI単語確認にはユーザー情報が必要です。',
      fromCache: false,
      cost: COST,
    });
  }

  const payment = await spendCoins(userId, COST);
  if (!payment.ok) {
    return res.status(402).json({
      ...FALLBACK,
      error: `コインが不足しています（必要: ${COST}枚）`,
      fromCache: false,
      cost: COST,
      remaining: payment.remaining,
    });
  }

  const prompt = [
    `文脈: "${safeSentence}"`,
    `単語「${safeWord}」の意味を日本語で20字以内で返してください。`,
    'JSONのみ返してください: {"meaning":"意味","pos":"品詞","example":"英語例文ひとつ"}',
  ].join('\n');

  try {
    const text = await callAI(prompt, 200);
    const parsed = parseJSON<WordResponse | null>(text, null);
    const payload = parsed?.meaning ? parsed : FALLBACK;
    await saveAICache('word', 'meaning', cacheText, payload);
    return res.status(200).json({
      ...payload,
      fromCache: false,
      cost: COST,
      remaining: payment.remaining,
    });
  } catch {
    return res.status(200).json({
      ...FALLBACK,
      fromCache: false,
      cost: COST,
      remaining: payment.remaining,
    });
  }
}
