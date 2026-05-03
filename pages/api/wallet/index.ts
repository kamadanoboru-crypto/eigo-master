/**
 * GET  /api/wallet?userId=xxx  → ウォレット取得
 * POST /api/wallet              → コイン加算 / チケット付与
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getWallet, addCoins, spendCoins, spendTicket } from '../../../lib/economy';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const wallet = await getWallet(userId);
    return res.status(200).json(wallet);
  }

  if (req.method === 'POST') {
    const { userId, action, amount, ticketType, decay } = req.body as {
      userId:     string;
      action:     'add' | 'spend' | 'spendTicket';
      amount?:    number;
      ticketType?: string;
      decay?:     boolean;
    };
    if (!userId || !action) return res.status(400).json({ error: 'userId, action required' });

    if (action === 'add') {
      const result = await addCoins(userId, amount ?? 0, { decay });
      return res.status(200).json(result);
    }
    if (action === 'spend') {
      const result = await spendCoins(userId, amount ?? 0);
      return res.status(200).json(result);
    }
    if (action === 'spendTicket') {
      const result = await spendTicket(userId, ticketType as any);
      return res.status(200).json(result);
    }
    return res.status(400).json({ error: 'unknown action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
