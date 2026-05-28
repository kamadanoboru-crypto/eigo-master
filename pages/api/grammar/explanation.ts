// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { sbGet, sbPatch, sbPost } from '../../../lib/grammarPart5';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const questionId = String(req.query.questionId ?? '');
    if (!questionId) return res.status(400).json({ error: 'questionId required' });
    const rows = await sbGet(`grammar_explanations?select=*&question_id=eq.${encodeURIComponent(questionId)}&order=score.desc,created_at.desc&limit=20`);
    return res.status(200).json({ explanations: rows });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { action = 'add', userId, questionId, body, explanationId, value = 1 } = req.body ?? {};

  if (action === 'vote') {
    if (!userId || !explanationId) return res.status(400).json({ error: 'userId and explanationId required' });
    const voteValue = Number(value) >= 0 ? 1 : -1;
    const before = await sbGet(`grammar_explanation_votes?select=*&user_id=eq.${encodeURIComponent(String(userId))}&explanation_id=eq.${encodeURIComponent(String(explanationId))}&limit=1`);
    const prevValue = before[0] ? (Number(before[0].value) >= 0 ? 1 : -1) : 0;
    const vote = await sbPost('grammar_explanation_votes?on_conflict=user_id,explanation_id', {
      user_id: String(userId),
      explanation_id: String(explanationId),
      value: voteValue,
    }, 'return=representation,resolution=merge-duplicates');
    const rows = await sbGet(`grammar_explanations?select=*&id=eq.${encodeURIComponent(String(explanationId))}&limit=1`);
    const current = rows[0];
    if (current) {
      await sbPatch(`grammar_explanations?id=eq.${encodeURIComponent(String(explanationId))}`, {
        score: Number(current.score ?? 0) - prevValue + voteValue,
      });
    }
    return res.status(200).json({ ok: Boolean(vote) });
  }

  if (!userId || !questionId || !String(body ?? '').trim()) {
    return res.status(400).json({ error: 'userId, questionId, body required' });
  }
  const existing = await sbGet(`grammar_explanations?select=*&question_id=eq.${encodeURIComponent(String(questionId))}&author_user_id=eq.${encodeURIComponent(String(userId))}&source=eq.user&limit=1`);
  const payload = {
    body: String(body).trim(),
    source: 'user',
  };
  if (existing[0]?.id) {
    const updated = await sbPatch(`grammar_explanations?id=eq.${encodeURIComponent(String(existing[0].id))}`, payload);
    return res.status(200).json({ ok: Boolean(updated), explanation: Array.isArray(updated) ? updated[0] : null, mode: 'update' });
  }
  const inserted = await sbPost('grammar_explanations', {
    question_id: String(questionId),
    author_user_id: String(userId),
    ...payload,
    score: 0,
  }, 'return=representation');
  return res.status(200).json({ ok: Boolean(inserted), explanation: Array.isArray(inserted) ? inserted[0] : null, mode: 'insert' });
}
