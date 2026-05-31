// @ts-nocheck
import { callAI, parseJSON } from './aiClient';

export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const SB_USES_BEARER = SB_ANON.startsWith('eyJ');

export function sbHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: SB_ANON,
    ...(SB_USES_BEARER ? { Authorization: `Bearer ${SB_ANON}` } : {}),
    'Content-Type': 'application/json',
    ...extra,
  };
}

export async function sbGet(path: string) {
  if (!SB_URL) return [];
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: sbHeaders() });
    if (!r.ok) {
      console.warn(`[supabase:get] ${r.status} ${path}`);
      return [];
    }
    const json = await r.json();
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.warn(`[supabase:get] failed ${path}`, err);
    return [];
  }
}

export async function sbPost(table: string, body: unknown, prefer = 'return=representation') {
  if (!SB_URL) return null;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: sbHeaders({ Prefer: prefer }),
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      console.warn(`[supabase:post] ${r.status} ${table}`);
      return null;
    }
    if (prefer.includes('return=minimal')) return [];
    return r.json();
  } catch (err) {
    console.warn(`[supabase:post] failed ${table}`, err);
    return null;
  }
}

export async function sbPatch(path: string, body: unknown) {
  if (!SB_URL) return null;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      method: 'PATCH',
      headers: sbHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      console.warn(`[supabase:patch] ${r.status} ${path}`);
      return null;
    }
    return r.json();
  } catch (err) {
    console.warn(`[supabase:patch] failed ${path}`, err);
    return null;
  }
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
  const sentence = String(q?.s ?? q?.sentence ?? '').trim().replace(/_{3,}/g, '_____');
  const blankCount = (sentence.match(/_____/g) ?? []).length;
  const options = Array.isArray(q?.options) ? q.options.map(String).map(s => s.trim()).filter(Boolean) : [];
  const correct = String(q?.correct ?? q?.ans ?? '').trim();
  const ja = String(q?.ja ?? q?.jp ?? '').trim();
  const uniqueOptions = [...new Set(options)];
  if (/\bto\s+_____/.test(sentence) && /^to\b/i.test(correct)) return null;
  if (/natural Japanese translation|自然な日本語訳/i.test(ja)) return null;
  if (blankCount !== 1 || uniqueOptions.length !== 4 || !uniqueOptions.includes(correct)) return null;
  return {
    s: sentence,
    ja,
    options: uniqueOptions,
    correct,
    ans: correct,
    exp: String(q?.exp ?? q?.explanation ?? '').trim() || '正解の語句が文法・語法上もっとも自然です。',
    cat: String(q?.cat ?? q?.category ?? '').trim() || 'TOEIC Part 5',
  };
}

export function isUsableGrammarRow(row: any) {
  return Boolean(normalizeGrammarQuestion({
    sentence: row?.sentence ?? row?.s,
    ja: row?.ja,
    options: row?.options,
    correct: row?.correct,
    exp: row?.explanation ?? row?.exp,
    cat: row?.category ?? row?.cat,
  }));
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

export function toTransientQuestionRow(q: any, createdBy = '') {
  const row = toQuestionRow(q, createdBy);
  if (!row) return null;
  return {
    ...row,
    id: `fallback-ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    question_no: null,
    source: 'ai_unsaved',
    created_at: new Date().toISOString(),
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

const LOCAL_AI_FALLBACK = [
  {
    s: 'The training session will begin _____ the new employees arrive.',
    ja: '新入社員が到着したら、研修セッションが始まります。',
    options: ['when', 'despite', 'during', 'unless'],
    correct: 'when',
    exp: '時を表す接続詞として「到着したら」は when が自然です。',
    cat: 'conjunction',
    source: 'ai_fallback',
  },
  {
    s: 'The invoice was sent _____ the accounting department yesterday.',
    ja: 'その請求書は昨日、経理部に送られました。',
    options: ['to', 'for', 'with', 'by'],
    correct: 'to',
    exp: 'send A to B で「AをBへ送る」という意味になります。',
    cat: 'preposition',
    source: 'ai_fallback',
  },
  {
    s: 'Our team needs _____ the final report before noon.',
    ja: '私たちのチームは正午までに最終報告書を確認する必要があります。',
    options: ['to review', 'reviewed', 'reviewing', 'review'],
    correct: 'to review',
    exp: 'need の後に目的を表す動詞を置く場合は to 不定詞を使います。',
    cat: 'infinitive',
    source: 'ai_fallback',
  },
  {
    s: 'The documents should be kept in a _____ location.',
    ja: 'その書類は安全な場所に保管されるべきです。',
    options: ['secure', 'secures', 'securely', 'security'],
    correct: 'secure',
    exp: 'location を修飾する形容詞が必要なので secure が正解です。',
    cat: 'vocabulary',
    source: 'ai_fallback',
  },
  {
    s: 'The software update was completed _____ than expected.',
    ja: 'ソフトウェア更新は予想より早く完了しました。',
    options: ['earlier', 'early', 'earliest', 'earliness'],
    correct: 'earlier',
    exp: 'than expected と比較しているため、比較級 earlier を使います。',
    cat: 'comparison',
    source: 'ai_fallback',
  },
  {
    s: 'Customers who register online will receive a confirmation email _____.',
    ja: 'オンラインで登録した顧客は、確認メールをすぐに受け取ります。',
    options: ['immediately', 'immediate', 'immediacy', 'more immediate'],
    correct: 'immediately',
    exp: 'receive を修飾する副詞が必要なので immediately が正解です。',
    cat: 'adverb',
    source: 'ai_fallback',
  },
];

async function saveGeneratedQuestion(q: any, userId = '') {
  const row = toQuestionRow(q, userId);
  if (!row) return null;
  const inserted = await sbPost('grammar_questions?on_conflict=sentence', row, 'return=representation,resolution=ignore-duplicates');
  if (Array.isArray(inserted) && inserted[0]) return inserted[0];
  const existing = await sbGet(`grammar_questions?select=*&sentence=eq.${encodeURIComponent(row.sentence)}&limit=1`);
  if (Array.isArray(existing) && existing[0]) return existing[0];
  return toTransientQuestionRow(q, userId);
}

async function generateLocalGrammarFallback(userId = '') {
  const q = shuffle(LOCAL_AI_FALLBACK)[0];
  return q ? saveGeneratedQuestion(q, userId) : null;
}

export async function generateGrammarQuestion(userId = '') {
  const prompt = `Create exactly ONE valid TOEIC Part 5 multiple-choice question for Japanese learners.

Hard requirements:
- Return one JSON object only. Do not wrap it in markdown.
- The "s" field MUST be one natural English sentence containing exactly one blank marker: _____
- The word or phrase in "correct" MUST NOT appear in the sentence outside the blank.
- "options" MUST contain exactly 4 real answer choices as strings.
- "correct" MUST be exactly one of the 4 strings in "options".
- Do NOT use placeholder values such as "correct", "wrong1", "wrong2", or "wrong3".
- Do NOT copy the sample JSON sentence or answer choices below.
- Do NOT generate any of these existing seed sentences:
  1. The meeting has been _____ until next Friday.
  2. The report must be submitted _____ Friday.
  3. Employees are required to _____ time sheets.
  4. The manager is responsible _____ the team.
  5. Sales figures _____ significantly this year.
  6. _____ the budget cuts, the project continued.
  7. Please contact us _____ you have questions.
  8. The new policy will take _____ on April 1st.
- Make all 3 wrong choices plausible but clearly incorrect.
- Match TOEIC 600 level business or workplace English.
- Focus on one grammar point: tense, preposition, conjunction, passive voice, infinitive, participle, or vocabulary.
- Avoid trivia, ambiguous answers, and awkward English.
- Write "ja" and "exp" in natural Japanese. Do not copy the English sentence into "ja".
- If the blank already follows "to", do not make a "to ..." phrase the correct answer.
- If the blank needs an infinitive phrase, write the sentence so the blank does not already follow "to".

Return this exact JSON shape with original real content. Keep valid JSON:
{"s":"All expense reports must be approved _____ the finance manager.","ja":"すべての経費報告書は財務マネージャーによって承認されなければなりません。","options":["by","for","with","from"],"correct":"by","exp":"受動態で行為者を表す場合は by を使います。","cat":"preposition","source":"ai"}`;
  try {
    const raw = await callAI(prompt, 700, 'You generate strict JSON for TOEIC Part 5. Output exactly one JSON object and obey every validation rule.');
    const parsed = parseJSON<any>(raw, null);
    const saved = await saveGeneratedQuestion(parsed, userId);
    if (saved) return saved;
  } catch (e) {
    console.error('[grammar] generate failed', e);
  }
  return generateLocalGrammarFallback(userId);
}

export function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
