// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI } from '../../../lib/aiClient';
import { getAICache, normalizeAIInput, saveAICache } from '../../../lib/aiCache';
import { getWallet, spendCoins } from '../../../lib/economy';

const COST_BY_MODE: Record<string, number> = {
  sentence: 5,
  full: 5,
};
const AI_LIMIT_MESSAGE = 'システム側のAI利用上限に達したため、現在翻訳を利用できません。数日後に再度お試しください。';
const isAiLimitError = (err: unknown) => /rate_limit|quota|429|RESOURCE_EXHAUSTED|insufficient_quota/i.test(
  err instanceof Error ? err.message : String(err),
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ translation: '', error: 'Method not allowed' });
  }

  const {
    text,
    mode = 'sentence',
    userId,
  } = req.body as { text?: string; mode?: string; userId?: string };

  if (!text?.trim()) {
    return res.status(400).json({ translation: '', error: 'text required' });
  }

  const safeMode = mode === 'full' ? 'full' : 'sentence';
  const safeText = normalizeAIInput(text);
  const cost = COST_BY_MODE[safeMode] ?? COST_BY_MODE.sentence;

  const cached = await getAICache('translate', safeMode, safeText);
  if (cached?.payload?.translation) {
    return res.status(200).json({
      translation: cached.payload.translation,
      fromCache: true,
      cost: 0,
    });
  }

  if (!userId) {
    return res.status(402).json({
      translation: '',
      error: 'AI翻訳にはユーザー情報が必要です。',
      fromCache: false,
      cost,
    });
  }

  const wallet = await getWallet(userId);
  if (wallet.coins < cost) {
    return res.status(402).json({
      translation: '',
      error: `コインが不足しています（必要: ${cost}枚、所持: ${wallet.coins}枚）`,
      fromCache: false,
      cost,
      remaining: wallet.coins,
    });
  }

  const system = [
    'You are an English-Japanese learning assistant.',
    'Translate naturally into Japanese for language learners.',
    'Return only the translation. Do not add explanations unless the user text requires them.',
  ].join(' ');

  const prompt = safeMode === 'full'
    ? `次の英語を、段落構造を保ったまま自然な日本語に翻訳してください。\n\n${safeText}`
    : `次の英語を自然な日本語に翻訳してください。\n\n${safeText}`;

  try {
    const translation = await callAI(prompt, safeMode === 'full' ? 1000 : 300, system);
    const clean = translation.trim();
    const payment = await spendCoins(userId, cost);
    if (!payment.ok) {
      return res.status(402).json({
        translation: '',
        error: payment.message || `コインが不足しています（必要: ${cost}枚）`,
        fromCache: false,
        cost,
        remaining: payment.remaining,
      });
    }
    await saveAICache('translate', safeMode, safeText, { translation: clean });
    return res.status(200).json({
      translation: clean,
      fromCache: false,
      cost,
      remaining: payment.remaining,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[translate]', msg);
    const limited = isAiLimitError(err);
    return res.status(limited ? 429 : 500).json({
      translation: '',
      error: limited ? AI_LIMIT_MESSAGE : 'AI翻訳に失敗しました。コインは消費されませんでした。',
      fromCache: false,
      cost,
      remaining: wallet.coins,
    });
  }
}
