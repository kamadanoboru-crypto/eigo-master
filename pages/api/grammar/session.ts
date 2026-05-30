// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { applyQuestionQuality, fallbackRows, generateGrammarQuestion, isUsableGrammarRow, rowToQuestion, sbGet, seedFallbackQuestions, shuffle, weightedShuffleByQuality } from '../../../lib/grammarPart5';

async function getRows(userId: string) {
  let rows = await sbGet('grammar_questions?select=*&order=question_no.asc&limit=300');
  if (!rows.length) rows = await seedFallbackQuestions(userId);
  const usable = rows.filter(isUsableGrammarRow);
  if (usable.length) return usable;
  const seeded = await seedFallbackQuestions(userId);
  const usableSeeded = seeded.filter(isUsableGrammarRow);
  return usableSeeded.length ? usableSeeded : fallbackRows();
}

function uniqueById(rows: any[]) {
  const seen = new Set<string>();
  return rows.filter(row => {
    if (!row?.id || seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}

function uniqueBySentence(rows: any[]) {
  const seen = new Set<string>();
  return rows.filter(row => {
    const key = String(row?.sentence || row?.s || '').trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { userId = '', count = 5, mode = 'test', questionId = '' } = req.body ?? {};
  const safeCount = Math.min(Math.max(Number(count) || 5, 1), 20);
  let rows = await getRows(String(userId));
  const dbIds = rows.map((r: any) => r.id).filter((id: string) => id && !String(id).startsWith('fallback-'));
  const votes = dbIds.length
    ? await sbGet(`grammar_question_votes?select=*&question_id=in.(${dbIds.join(',')})&limit=5000`)
    : [];
  rows = applyQuestionQuality(rows, votes, String(userId));

  if (mode === 'practice' && questionId) {
    const row = rows.find((r: any) => r.id === questionId) ?? rows[0];
    const fill = weightedShuffleByQuality(rows.filter((r: any) => r.id !== row?.id)).slice(0, Math.max(0, safeCount - 1));
    return res.status(200).json({ questions: row ? [row, ...fill].slice(0, safeCount).map(rowToQuestion) : [] });
  }

  const attempts = userId
    ? await sbGet(`grammar_attempts?select=*&user_id=eq.${encodeURIComponent(String(userId))}&order=created_at.desc&limit=2000`)
    : [];
  const latest = new Map<string, any>();
  const correctCounts = new Map<string, number>();
  attempts.forEach((a: any) => {
    if (!latest.has(a.question_id)) latest.set(a.question_id, a);
    if (a.is_correct === true) {
      correctCounts.set(a.question_id, (correctCounts.get(a.question_id) ?? 0) + 1);
    }
  });

  const generatedTarget = safeCount > 0 ? 1 : 0;
  const existingTarget = Math.max(0, safeCount - generatedTarget);
  const baseRows = rows;
  const wrongRows = baseRows.filter((r: any) => latest.get(r.id)?.is_correct === false);
  const untouchedRows = baseRows.filter((r: any) => !latest.has(r.id));
  const aiCost = 0;
  const remaining: number | undefined = undefined;

  const dbRows = uniqueById([
    ...weightedShuffleByQuality(untouchedRows),
    ...weightedShuffleByQuality(wrongRows),
    ...weightedShuffleByQuality(baseRows),
  ]).slice(0, existingTarget);

  const generatedRows: any[] = [];
  const generatedSeen = new Set(rows.map((r: any) => String(r.sentence || '').trim().toLowerCase()));
  for (let i = 0; generatedRows.length < generatedTarget && i < Math.max(4, generatedTarget * 5); i += 1) {
    const generated = await generateGrammarQuestion(String(userId));
    const key = String(generated?.sentence || generated?.s || '').trim().toLowerCase();
    if (generated && key && !generatedSeen.has(key)) {
      generatedSeen.add(key);
      generatedRows.push(generated);
    }
  }

  if (generatedRows.length < generatedTarget) {
    const fallbackFill = fallbackRows().filter((row: any) => !generatedSeen.has(String(row.sentence || '').trim().toLowerCase()));
    const fallbackFinalRows = uniqueBySentence([...dbRows, ...generatedRows, ...fallbackFill]).slice(0, safeCount);
    return res.status(200).json({
      ok: false,
      error: 'AI新規問題を生成できませんでした。既存問題で開始します。コインは消費されません。',
      questions: fallbackFinalRows.map(rowToQuestion),
      fallbackQuestions: dbRows.map(rowToQuestion),
      plan: {
        existingTarget,
        generatedTarget: generatedRows.length,
        requestedGeneratedTarget: generatedTarget,
        aiCost,
        remaining,
      },
    });
  }

  const finalRows = uniqueBySentence([...dbRows, ...generatedRows]).slice(0, safeCount);

  return res.status(200).json({
    ok: true,
    questions: weightedShuffleByQuality(finalRows).map(rowToQuestion),
    plan: {
      existingTarget: dbRows.length,
      generatedTarget: generatedRows.length,
      requestedGeneratedTarget: generatedTarget,
      aiCost,
      remaining,
    },
  });
}

