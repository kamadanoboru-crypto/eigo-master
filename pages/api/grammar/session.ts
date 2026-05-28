// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next';
import { applyQuestionQuality, generateGrammarQuestion, rowToQuestion, sbGet, seedFallbackQuestions, shuffle, weightedShuffleByQuality } from '../../../lib/grammarPart5';

async function getRows(userId: string) {
  let rows = await sbGet('grammar_questions?select=*&order=question_no.asc&limit=300');
  if (!rows.length) rows = await seedFallbackQuestions(userId);
  return rows;
}

function uniqueById(rows: any[]) {
  const seen = new Set<string>();
  return rows.filter(row => {
    if (!row?.id || seen.has(row.id)) return false;
    seen.add(row.id);
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

  if (mode === 'practice') {
    const attempts = userId
      ? await sbGet(`grammar_attempts?select=*&user_id=eq.${encodeURIComponent(String(userId))}&order=created_at.desc&limit=2000`)
      : [];
    const latest = new Map<string, any>();
    attempts.forEach((a: any) => {
      if (!latest.has(a.question_id)) latest.set(a.question_id, a);
    });
    const untouchedRows = rows.filter((r: any) => !latest.has(r.id));
    const wrongRows = rows.filter((r: any) => latest.get(r.id)?.is_correct === false);
    const selected = uniqueById([
      ...weightedShuffleByQuality(untouchedRows),
      ...weightedShuffleByQuality(wrongRows),
      ...weightedShuffleByQuality(rows),
    ]).slice(0, safeCount);
    return res.status(200).json({ questions: selected.map(rowToQuestion) });
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

  const masteredRows = rows.filter((r: any) => (correctCounts.get(r.id) ?? 0) >= 2);
  const activeRows = rows.filter((r: any) => (correctCounts.get(r.id) ?? 0) < 2);
  const baseRows = activeRows.length >= safeCount ? activeRows : rows;
  const correctRows = baseRows.filter((r: any) => latest.get(r.id)?.is_correct === true);
  const wrongRows = baseRows.filter((r: any) => latest.get(r.id)?.is_correct === false);
  const untouchedRows = baseRows.filter((r: any) => !latest.has(r.id));
  const generatedTarget = safeCount >= 10 ? 3 : Math.max(1, Math.floor(safeCount / 3));
  const allowedGeneratedTarget = generatedTarget;
  const aiCost = 0;
  const remaining: number | undefined = undefined;
  const dbTarget = Math.max(0, safeCount - allowedGeneratedTarget);
  const correctTarget = Math.floor(dbTarget * 0.4);
  const wrongTarget = Math.floor(dbTarget * 0.4);

  const selected: any[] = [
    ...weightedShuffleByQuality(correctRows).slice(0, correctTarget),
    ...weightedShuffleByQuality(wrongRows).slice(0, wrongTarget),
  ];

  const generatedRows: any[] = [];
  const generatedSeen = new Set(rows.map((r: any) => String(r.id || r.sentence || '')));
  for (let i = 0; generatedRows.length < allowedGeneratedTarget && i < allowedGeneratedTarget * 4; i += 1) {
    const generated = await generateGrammarQuestion(String(userId));
    const key = String(generated?.id || generated?.sentence || '');
    if (generated && key && !generatedSeen.has(key)) {
      generatedSeen.add(key);
      generatedRows.push(generated);
    }
  }

  const dbSeed = uniqueById([
    ...selected,
    ...weightedShuffleByQuality(untouchedRows),
    ...weightedShuffleByQuality(baseRows),
  ]).filter((r: any) => !generatedRows.some(g => g.id === r.id)).slice(0, dbTarget);
  const dbFill = weightedShuffleByQuality(rows)
    .filter((r: any) => !dbSeed.some(s => s.id === r.id) && !generatedRows.some(g => g.id === r.id))
    .slice(0, Math.max(0, dbTarget - dbSeed.length));
  const finalRows = uniqueById([...dbSeed, ...dbFill, ...generatedRows]).slice(0, safeCount);

  return res.status(200).json({
    questions: weightedShuffleByQuality(finalRows).map(rowToQuestion),
    plan: {
      correctTarget,
      wrongTarget,
      generatedTarget: generatedRows.length,
      requestedGeneratedTarget: generatedTarget,
      aiCost,
      remaining,
      masteredExcluded: activeRows.length >= safeCount ? masteredRows.length : 0,
    },
  });
}
