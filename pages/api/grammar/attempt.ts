// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { sbPost } from '../../../lib/grammarPart5';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { userId, questionId, selected, correct, mode = 'test' } = req.body ?? {};
  if (!userId || !questionId || !selected) return res.status(400).json({ error: 'userId, questionId, selected required' });
  const isCorrect = String(selected) === String(correct);
  const row = await sbPost('grammar_attempts', {
    user_id: String(userId),
    question_id: String(questionId),
    selected: String(selected),
    is_correct: isCorrect,
    mode: String(mode),
  }, 'return=representation');
  return res.status(200).json({ ok: Boolean(row), isCorrect });
}
