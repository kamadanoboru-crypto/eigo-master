// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { sbGet, sbPost } from '../../../lib/grammarPart5';

function summarize(votes: any[], userId = '') {
  let likes = 0;
  let dislikes = 0;
  let myVote = 0;
  votes.forEach(v => {
    const value = Number(v.value) >= 0 ? 1 : -1;
    if (value > 0) likes += 1;
    else dislikes += 1;
    if (userId && String(v.user_id) === String(userId)) myVote = value;
  });
  return { likes, dislikes, score: likes - dislikes, myVote };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { userId, questionId, value } = req.body ?? {};
  if (!userId || !questionId || String(questionId).startsWith('fallback-')) {
    return res.status(400).json({ error: 'userId and DB questionId required' });
  }

  const voteValue = Number(value) >= 0 ? 1 : -1;
  const saved = await sbPost('grammar_question_votes?on_conflict=user_id,question_id', {
    user_id: String(userId),
    question_id: String(questionId),
    value: voteValue,
  }, 'return=representation,resolution=merge-duplicates');

  const votes = await sbGet(`grammar_question_votes?select=*&question_id=eq.${encodeURIComponent(String(questionId))}&limit=5000`);
  return res.status(200).json({ ok: Boolean(saved), quality: summarize(votes, String(userId)) });
}
