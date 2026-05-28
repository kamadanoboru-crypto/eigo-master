// @ts-nocheck
import { callAI, parseJSON } from './aiClient';

export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function sbHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: SB_ANON,
    Authorization: `Bearer ${SB_ANON}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

export async function sbGet(path: string) {
  if (!SB_URL) return [];
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: sbHeaders() });
  if (!r.ok) return [];
  return r.json();
}

export async function sbPost(table: string, body: unknown, prefer = 'return=representation') {
  if (!SB_URL) return null;
  const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: sbHeaders({ Prefer: prefer }),
    body: JSON.stringify(body),
  });
  if (!r.ok) return null;
  if (prefer.includes('return=minimal')) return [];
  return r.json();
}

export async function sbPatch(path: string, body: unknown) {
  if (!SB_URL) return null;
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: sbHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(body),
  });
  if (!r.ok) return null;
  return r.json();
}

export const FALLBACK_GRAMMAR = [
  { s: 'The meeting has been _____ until next Friday.', ja: '会議は来週金曜日まで延期されました。', options: ['postponed', 'postponing', 'postpone', 'postponement'], correct: 'postponed', exp: '現在完了の受け身なので has been + 過去分詞を使います。', cat: '受動態' },
  { s: 'The report must be submitted _____ Friday.', ja: '報告書は金曜日までに提出されなければなりません。', options: ['by', 'until', 'since', 'for'], correct: 'by', exp: '締切を表す「までに」は by を使います。', cat: '前置詞' },
  { s: 'Employees are required to _____ time sheets.', ja: '従業員は勤務表を提出する必要があります。', options: ['submit', 'submitting', 'submitted', 'submission'], correct: 'submit', exp: 'be required to の後は動詞の原形です。', cat: '動詞の形' },
  { s: 'The manager is responsible _____ the team.', ja: 'そのマネージャーはチームに責任があります。', options: ['for', 'of', 'to', 'at'], correct: 'for', exp: 'be responsible for は「に責任がある」という表現です。', cat: '前置詞' },
  { s: 'Sales figures _____ significantly this year.', ja: '今年、売上数値は大きく上昇しました。', options: ['have risen', 'are risen', 'risen', 'rising'], correct: 'have risen', exp: 'this year は現在完了と相性がよく、rise の過去分詞は risen です。', cat: '時制' },
  { s: '_____ the budget cuts, the project continued.', ja: '予算削減にもかかわらず、そのプロジェクトは続きました。', options: ['Despite', 'Although', 'However', 'Because'], correct: 'Despite', exp: 'Despite は前置詞で、後ろに名詞句を置けます。', cat: '接続表現' },
  { s: 'Please contact us _____ you have questions.', ja: '質問がある場合は、私たちに連絡してください。', options: ['if', 'unless', 'despite', 'while'], correct: 'if', exp: '条件を表す「もしなら」は if です。', cat: '条件' },
  { s: 'The new policy will take _____ on April 1st.', ja: '新しい方針は4月1日に発効します。', options: ['effect', 'affect', 'effort', 'efficiency'], correct: 'effect', exp: 'take effect は「発効する」という定型表現です。', cat: '語彙' },
];

export function normalizeGrammarQuestion(q: any) {
  const sentence = String(q?.s ?? q?.sentence ?? '').trim();
  const options = Array.isArray(q?.options) ? q.options.map(String).map(s => s.trim()).filter(Boolean) : [];
  const correct = String(q?.correct ?? q?.ans ?? '').trim();
  if (!sentence.includes('_____') || options.length !== 4 || !options.includes(correct)) return null;
  return {
    s: sentence,
    ja: String(q?.ja ?? q?.jp ?? '').trim(),
    options,
    correct,
    ans: correct,
    exp: String(q?.exp ?? q?.explanation ?? '').trim() || '正解の語句が文法・語法上もっとも自然です。',
    cat: String(q?.cat ?? q?.category ?? '').trim() || 'TOEIC Part 5',
  };
}

export function toQuestionRow(q: any, createdBy = '') {
  const n = normalizeGrammarQuestion(q);
  if (!n) return null;
  return {
    sentence: n.s,
    ja: n.ja,
    options: n.options,
    correct: n.correct,
    explanation: n.exp,
    category: n.cat,
    level: 'level_600',
    source: q?.source || 'toeic',
    created_by: createdBy || null,
  };
}

export function rowToQuestion(row: any) {
  return {
    id: row.id,
    no: row.question_no,
    s: row.sentence,
    ja: row.ja,
    options: shuffle(row.options ?? []),
    correct: row.correct,
    ans: row.correct,
    exp: row.explanation,
    cat: row.category,
    userStats: row.userStats,
    topExplanation: row.topExplanation,
    myExplanation: row.myExplanation,
    quality: row.quality ?? { likes: 0, dislikes: 0, score: 0, myVote: 0 },
  };
}

export function summarizeQuestionVotes(votes: any[], userId = '') {
  const map = new Map<string, { likes: number; dislikes: number; score: number; myVote: number }>();
  votes.forEach(v => {
    const questionId = String(v.question_id ?? '');
    if (!questionId) return;
    const current = map.get(questionId) ?? { likes: 0, dislikes: 0, score: 0, myVote: 0 };
    const value = Number(v.value) >= 0 ? 1 : -1;
    if (value > 0) current.likes += 1;
    else current.dislikes += 1;
    current.score += value;
    if (userId && String(v.user_id) === String(userId)) current.myVote = value;
    map.set(questionId, current);
  });
  return map;
}

export function applyQuestionQuality(rows: any[], votes: any[], userId = '') {
  const quality = summarizeQuestionVotes(votes, userId);
  return rows.map(row => ({
    ...row,
    quality: quality.get(String(row.id)) ?? { likes: 0, dislikes: 0, score: 0, myVote: 0 },
  }));
}

export function weightedShuffleByQuality(rows: any[]) {
  const pool = rows.map(row => {
    const q = row.quality ?? {};
    const likes = Number(q.likes ?? 0);
    const dislikes = Number(q.dislikes ?? 0);
    const weight = Math.max(0.25, 1 + likes * 0.35 - dislikes * 0.25);
    return { row, key: Math.random() ** (1 / weight) };
  });
  return pool.sort((a, b) => b.key - a.key).map(item => item.row);
}

export function fallbackRows() {
  return FALLBACK_GRAMMAR.map((q, index) => ({
    id: `fallback-${index + 1}`,
    question_no: index + 1,
    sentence: q.s,
    ja: q.ja,
    options: q.options,
    correct: q.correct,
    explanation: q.exp,
    category: q.cat,
    source: 'fallback',
    level: 'level_600',
  }));
}

export async function seedFallbackQuestions(userId = '') {
  const payload = FALLBACK_GRAMMAR.map(q => toQuestionRow(q, userId)).filter(Boolean);
  if (!payload.length) return fallbackRows();
  await sbPost('grammar_questions?on_conflict=sentence', payload, 'return=minimal,resolution=ignore-duplicates');
  const rows = await sbGet('grammar_questions?select=*&order=question_no.asc&limit=100');
  return rows.length ? rows : fallbackRows();
}

export async function generateGrammarQuestion(userId = '') {
  const prompt = `Create one natural TOEIC Part 5 multiple-choice question for Japanese learners.
Match intermediate TOEIC level 600. Use natural business or daily workplace English.
Include a grammar category such as tense, preposition, conjunction, passive voice, infinitive, participle, or vocabulary.
Avoid awkward English, trivia, and ambiguous answers.
Return JSON only:
{"s":"English sentence with _____","ja":"natural Japanese translation","options":["correct","wrong1","wrong2","wrong3"],"correct":"correct","exp":"Japanese explanation","cat":"grammar category","source":"ai"}`;
  try {
    const raw = await callAI(prompt, 900, 'Return valid JSON only.');
    const parsed = parseJSON<any>(raw, null);
    const row = toQuestionRow(parsed, userId);
    if (row) {
      const inserted = await sbPost('grammar_questions?on_conflict=sentence', row, 'return=representation,resolution=ignore-duplicates');
      if (Array.isArray(inserted) && inserted[0]) return inserted[0];
    }
  } catch (e) {
    console.error('[grammar] generate failed', e);
  }
  const fallback = toQuestionRow(FALLBACK_GRAMMAR[Math.floor(Math.random() * FALLBACK_GRAMMAR.length)], userId);
  const inserted = fallback
    ? await sbPost('grammar_questions?on_conflict=sentence', fallback, 'return=representation,resolution=ignore-duplicates')
    : null;
  return Array.isArray(inserted) && inserted[0] ? inserted[0] : null;
}

export function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
