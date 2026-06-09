// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';
import { getAICache, normalizeAIInput, saveAICache } from '../../../lib/aiCache';
import { refundCoins, spendCoins } from '../../../lib/economy';
import type { WordResponse } from '../../../types';

const COST = 1;
const FALLBACK: WordResponse = { meaning: '取得できませんでした', pos: '', example: '' };

function cleanPayload(payload: any, safeWord: string, safeSentence: string) {
  const wordRe = new RegExp(`\\b${safeWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  const example = String(payload?.example || '').trim();
  const exampleJa = String(payload?.exampleJa || payload?.example_ja || '').trim();
  return {
    meaning: String(payload?.meaning || FALLBACK.meaning).trim(),
    pos: String(payload?.pos || '').trim(),
    example: example && exampleJa && wordRe.test(example) ? example : '',
    exampleJa: example && exampleJa && wordRe.test(example) ? exampleJa : '',
    sourceSentence: safeSentence,
  };
}

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
    const payload = cleanPayload(cached.payload, safeWord, safeSentence);
    return res.status(200).json({
      ...payload,
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
      error: `コインが不足しています（必要: ${COST}枚、所持: ${payment.remaining}枚）`,
      fromCache: false,
      cost: COST,
      remaining: payment.remaining,
    });
  }

  const prompt = [
    `文脈: "${safeSentence}"`,
    `単語「${safeWord}」の意味を、日本語で20字以内の自然な表現で返してください。`,
    'example は同じ意味で使った短い英語例文、exampleJa はその自然な日本語訳にしてください。',
    'JSONのみ返してください: {"meaning":"意味","pos":"品詞","example":"English example sentence.","exampleJa":"日本語訳"}',
  ].join('\n');

  try {
    const text = await callAI(prompt, 200);
    const parsed = parseJSON<WordResponse | null>(text, null);
    const payload = parsed?.meaning ? cleanPayload(parsed, safeWord, safeSentence) : cleanPayload(FALLBACK, safeWord, safeSentence);
    await saveAICache('word', 'meaning', cacheText, payload);
    return res.status(200).json({
      ...payload,
      fromCache: false,
      cost: COST,
      remaining: payment.remaining,
    });
  } catch (error) {
    const refund = await refundCoins(userId, COST);
    return res.status(200).json({
      ...FALLBACK,
      error: 'AI単語確認に失敗しました。コインは消費されませんでした。',
      fromCache: false,
      cost: 0,
      remaining: refund.total,
    });
  }
}
