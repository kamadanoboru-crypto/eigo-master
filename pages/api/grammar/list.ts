// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  applyQuestionQuality,
  fallbackRows,
  isUsableGrammarRow,
  rowToQuestion,
  sbGet,
  seedFallbackQuestions,
} from '../../../lib/grammarPart5';

function latestByQuestion(attempts: any[]) {
  const map = new Map<string, any>();
  attempts.forEach(a => {
    const prev = map.get(a.question_id);
    if (!prev || new Date(a.created_at).getTime() > new Date(prev.created_at).getTime()) {
      map.set(a.question_id, a);
    }
  });
  return map;
}

function asArray(value: any) {
  return Array.isArray(value) ? value : [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = String(req.query.userId ?? '');
    let rows = await sbGet('grammar_questions?select=*&order=question_no.asc&limit=200');
    if (!rows.length) rows = await seedFallbackQuestions(userId);
    if (!rows.length) rows = fallbackRows();
    rows = rows.filter(isUsableGrammarRow);
    if (!rows.length) rows = fallbackRows().filter(isUsableGrammarRow);

    const ids = rows.map((r: any) => r.id).filter(Boolean);
    const dbIds = ids.filter((id: string) => !String(id).startsWith('fallback-'));
    const attempts = userId && dbIds.length
      ? asArray(await sbGet(`grammar_attempts?select=*&user_id=eq.${encodeURIComponent(userId)}&question_id=in.(${dbIds.join(',')})&order=created_at.desc&limit=1000`))
      : [];
    const latest = latestByQuestion(attempts);

    const explanations = dbIds.length
      ? asArray(await sbGet(`grammar_explanations?select=*&question_id=in.(${dbIds.join(',')})&order=score.desc,created_at.asc&limit=1000`))
      : [];
    const explanationIds = explanations.map((e: any) => e.id).filter(Boolean);
    const explanationVotes = explanationIds.length
      ? asArray(await sbGet(`grammar_explanation_votes?select=*&explanation_id=in.(${explanationIds.join(',')})&limit=5000`))
      : [];
    const authorIds = [...new Set(explanations.map((e: any) => e.author_user_id).filter(Boolean))];
    const profiles = authorIds.length
      ? asArray(await sbGet(`user_profiles?select=user_id,nickname,avatar_emoji&user_id=in.(${authorIds.map(encodeURIComponent).join(',')})&limit=1000`))
      : [];
    const profileMap = new Map(profiles.map((p: any) => [String(p.user_id), p]));
    const voteSummary = new Map<string, any>();
    explanationVotes.forEach((v: any) => {
      const id = String(v.explanation_id);
      const cur = voteSummary.get(id) ?? { likes: 0, dislikes: 0, myVote: 0 };
      const val = Number(v.value) >= 0 ? 1 : -1;
      if (val > 0) cur.likes += 1;
      else cur.dislikes += 1;
      if (userId && String(v.user_id) === userId) cur.myVote = val;
      voteSummary.set(id, cur);
    });
    const enrichExplanation = (e: any) => {
      if (!e) return null;
      const prof = profileMap.get(String(e.author_user_id));
      const summary = voteSummary.get(String(e.id)) ?? { likes: Math.max(0, Number(e.score ?? 0)), dislikes: 0, myVote: 0 };
      return {
        ...e,
        authorNickname: prof?.nickname || '匿名',
        authorAvatar: prof?.avatar_emoji || '🙂',
        likes: summary.likes,
        dislikes: summary.dislikes,
        myVote: summary.myVote,
      };
    };
    const votes = dbIds.length
      ? asArray(await sbGet(`grammar_question_votes?select=*&question_id=in.(${dbIds.join(',')})&limit=5000`))
      : [];
    const rowsWithQuality = applyQuestionQuality(rows, votes, userId);
    const top = new Map<string, any>();
    const mine = new Map<string, any>();
    explanations.forEach((e: any) => {
      const enriched = enrichExplanation(e);
      if (!top.has(e.question_id)) top.set(e.question_id, enriched);
      if (userId && e.author_user_id === userId && !mine.has(e.question_id)) mine.set(e.question_id, enriched);
    });

    const questions = rowsWithQuality.map((row: any) => {
      const last = latest.get(row.id);
      return rowToQuestion({
        ...row,
        userStats: last ? { lastCorrect: Boolean(last.is_correct), lastSelected: last.selected, lastAt: last.created_at } : null,
        topExplanation: top.get(row.id) ?? null,
        myExplanation: mine.get(row.id) ?? null,
      });
    });

    const source = rows.some((row: any) => String(row.id).startsWith('fallback-')) ? 'fallback' : 'supabase';
    return res.status(200).json({ questions, source });
  } catch (err) {
    console.error('[grammar/list]', err);
    const questions = fallbackRows().filter(isUsableGrammarRow).map(rowToQuestion);
    return res.status(200).json({
      questions,
      source: 'fallback',
      warning: 'Supabaseから問題を取得できなかったため、予備問題を表示しています。',
    });
  }
}
