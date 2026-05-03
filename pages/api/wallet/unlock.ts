/**
 * GET  /api/wallet/unlock?userId=xxx&type=video&id=xxx → 解放確認
 * POST /api/wallet/unlock → コイン/チケットで解放
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkUnlocked, recordUnlock, spendCoins, spendTicket, getWallet, ECONOMY } from '../../../lib/economy';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId, type, id } = req.query as { userId?: string; type?: string; id?: string };
    if (!userId || !type || !id) return res.status(400).json({ error: 'userId, type, id required' });
    const result = await checkUnlocked(userId, type, id);
    return res.status(200).json(result);
  }

  if (req.method === 'POST') {
    const { userId, contentType, contentId, payWith, isNewAI } = req.body as {
      userId:      string;
      contentType: string;
      contentId:   string;
      payWith:     'coin' | 'ticket' | 'free';
      isNewAI?:    boolean;  // 動画: 新規AI翻訳かどうか
    };
    if (!userId || !contentType || !contentId || !payWith) {
      return res.status(400).json({ error: 'missing required fields' });
    }

    // 既に解放済み？
    const { unlocked } = await checkUnlocked(userId, contentType, contentId);
    if (unlocked) return res.status(200).json({ ok: true, message: '解放済み' });

    if (payWith === 'free') {
      await recordUnlock({ userId, contentType, contentId, unlockType: 'free' });
      return res.status(200).json({ ok: true });
    }

    if (payWith === 'coin') {
      const cost = contentType === 'video'
        ? (isNewAI ? ECONOMY.VIDEO_NEW_AI_COST : ECONOMY.VIDEO_EXISTING_COST)
        : contentType === 'quiz' ? ECONOMY.QUIZ_COST
        : 10;

      const { ok, remaining, message } = await spendCoins(userId, cost);
      if (!ok) return res.status(400).json({ ok: false, message, remaining });
      await recordUnlock({ userId, contentType, contentId, unlockType: 'coin', coinsSpent: cost });
      return res.status(200).json({ ok: true, coinsSpent: cost, remaining });
    }

    if (payWith === 'ticket') {
      const ticketType = contentType === 'video'    ? 'video_tickets'
                       : contentType === 'quiz'     ? 'quiz_tickets'
                       : contentType === 'translation' ? 'translation_tickets'
                       : 'quiz_tickets';
      const { ok, remaining } = await spendTicket(userId, ticketType as any);
      if (!ok) {
        return res.status(400).json({ ok: false, message: 'チケットが不足しています', remaining: 0 });
      }
      await recordUnlock({
        userId, contentType, contentId, unlockType: 'ticket',
        expireHours: ECONOMY.TICKET_EXPIRE_HOURS,
      });
      return res.status(200).json({ ok: true, remaining });
    }

    return res.status(400).json({ error: 'unknown payWith' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
