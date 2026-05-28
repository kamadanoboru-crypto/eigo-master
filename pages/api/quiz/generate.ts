import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';
import { buildCacheKey, getCachedQuiz, saveCachedQuiz } from '../../../lib/quizCache';
import type { QuizQuestion } from '../../../types';

const WORDS: QuizQuestion[] = [
  { word: 'allocate', meaning: '割り当てる', pos: '動詞' },
  { word: 'acquire', meaning: '獲得する', pos: '動詞' },
  { word: 'implement', meaning: '実施する', pos: '動詞' },
  { word: 'facilitate', meaning: '促進する', pos: '動詞' },
  { word: 'negotiate', meaning: '交渉する', pos: '動詞' },
  { word: 'comprehensive', meaning: '包括的な', pos: '形容詞' },
  { word: 'efficient', meaning: '効率的な', pos: '形容詞' },
  { word: 'mandatory', meaning: '必須の', pos: '形容詞' },
  { word: 'revenue', meaning: '収益', pos: '名詞' },
  { word: 'inventory', meaning: '在庫', pos: '名詞' },
  { word: 'momentum', meaning: '勢い', pos: '名詞' },
  { word: 'consecutive', meaning: '連続した', pos: '形容詞' },
];

const GRAMMAR: QuizQuestion[] = [
  { s: 'The meeting has been _____ until next Friday.', options: ['postponed', 'postponing', 'postpone', 'postponement'], ans: 'postponed', correct: 'postponed', exp: '受け身の現在完了なので has been + 過去分詞を使います。', cat: '受動態' },
  { s: 'The report must be submitted _____ Friday.', options: ['by', 'until', 'since', 'for'], ans: 'by', correct: 'by', exp: '締切を表す「〜までに」は by を使います。', cat: '前置詞' },
  { s: 'Employees are required to _____ time sheets.', options: ['submit', 'submitting', 'submitted', 'submission'], ans: 'submit', correct: 'submit', exp: 'be required to の後は動詞の原形です。', cat: '動詞の形' },
  { s: 'The manager is responsible _____ the team.', options: ['for', 'of', 'to', 'at'], ans: 'for', correct: 'for', exp: 'be responsible for は「〜に責任がある」という表現です。', cat: '前置詞' },
  { s: 'Sales figures _____ significantly this year.', options: ['have risen', 'are risen', 'risen', 'rising'], ans: 'have risen', correct: 'have risen', exp: 'this year は現在完了と相性がよく、rise の過去分詞は risen です。', cat: '時制' },
  { s: '_____ the budget cuts, the project continued.', options: ['Despite', 'Although', 'However', 'Because'], ans: 'Despite', correct: 'Despite', exp: 'Despite は前置詞で、後ろに名詞句を置けます。', cat: '接続表現' },
  { s: 'Please contact us _____ you have questions.', options: ['if', 'unless', 'despite', 'while'], ans: 'if', correct: 'if', exp: '条件を表す「もし〜なら」は if です。', cat: '条件' },
  { s: 'The new policy will take _____ on April 1st.', options: ['effect', 'affect', 'effort', 'efficiency'], ans: 'effect', correct: 'effect', exp: 'take effect は「発効する」という定型表現です。', cat: '語彙' },
];

const shuffle = <T>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);
const shuffleQuestionOptions = (q: QuizQuestion): QuizQuestion => {
  const options = Array.isArray(q.options)
    ? q.options
    : Array.isArray((q as any).opts)
      ? (q as any).opts
      : null;
  if (!options?.length) return q;
  const shuffled: string[] = shuffle<string>(options.map(String));
  return {
    ...(q as any),
    options: shuffled,
    ...(Array.isArray((q as any).opts) ? { opts: shuffled } : {}),
  } as QuizQuestion;
};

function wordQuestions(count: number): QuizQuestion[] {
  return shuffle(WORDS).slice(0, count).map(w => {
    const distractors = shuffle(WORDS.filter(x => x.meaning !== w.meaning)).slice(0, 3).map(x => x.meaning!);
    return {
      ...w,
      options: shuffle([w.meaning!, ...distractors]),
      correct: w.meaning,
    };
  });
}

function grammarQuestions(count: number): QuizQuestion[] {
  return shuffle(GRAMMAR).slice(0, count);
}

function grammarJapanese(sentence: string, correct: string): string {
  const filled = sentence.replace('_____', correct);
  const known: Record<string, string> = {
    'The meeting has been postponed until next Friday.': '会議は来週金曜日まで延期されました。',
    'The report must be submitted by Friday.': '報告書は金曜日までに提出されなければなりません。',
    'Employees are required to submit time sheets.': '従業員は勤務表を提出する必要があります。',
    'The manager is responsible for the team.': 'そのマネージャーはチームに責任があります。',
    'Sales figures have risen significantly this year.': '今年、売上数値は大きく上昇しました。',
    'Despite the budget cuts, the project continued.': '予算削減にもかかわらず、そのプロジェクトは継続しました。',
    'Please contact us if you have questions.': '質問がある場合は、私たちに連絡してください。',
    'The new policy will take effect on April 1st.': '新しい方針は4月1日に発効します。',
  };
  return known[filled] ?? `「${filled}」という意味です。`;
}

function normalizeGrammarQuestion(q: QuizQuestion): QuizQuestion | null {
  const sentence = String(q.s ?? '').trim();
  const options = Array.isArray(q.options)
    ? q.options.map(String).map(s => s.trim()).filter(Boolean)
    : Array.isArray((q as any).opts)
      ? (q as any).opts.map(String).map((s: string) => s.trim()).filter(Boolean)
      : [];
  const correct = String(q.correct ?? q.ans ?? '').trim();

  if (!sentence.includes('_____')) return null;
  if (options.length !== 4) return null;
  if (!correct || !options.includes(correct)) return null;

  const ja = String((q as any).ja ?? (q as any).jp ?? '').trim() || grammarJapanese(sentence, correct);

  return {
    ...q,
    s: sentence,
    ja,
    options,
    ans: correct,
    correct,
    exp: q.exp || '正解の語句が文法・語法上もっとも自然です。',
    cat: q.cat || 'TOEIC Part 5',
  } as QuizQuestion;
}

function normalizeGrammarSet(items: QuizQuestion[], count: number): QuizQuestion[] {
  const seen = new Set<string>();
  const valid: QuizQuestion[] = [];
  for (const item of items) {
    const q = normalizeGrammarQuestion(item);
    if (!q || seen.has(q.s ?? '')) continue;
    seen.add(q.s ?? '');
    valid.push(q);
    if (valid.length >= count) break;
  }
  return valid;
}

function listeningQuestions(count: number): QuizQuestion[] {
  return wordQuestions(count).map(w => {
    const correct = `「${w.word}」は「${w.meaning}」という意味です。`;
    return {
      en: `The word "${w.word}" means "${w.meaning}" in Japanese.`,
      jp: correct,
      options: shuffle([correct, '会議は来週に延期されました。', '報告書を金曜日までに提出してください。', '売上は今年大きく伸びました。']),
      correct,
    };
  });
}

function fallbackQuestions(quizType: string, count: number): QuizQuestion[] {
  if (quizType === 'grammar') return normalizeGrammarSet(grammarQuestions(count), count);
  if (quizType === 'listening') return listeningQuestions(count);
  return wordQuestions(count);
}

function buildPrompt(
  quizType: string,
  level: string,
  count: number,
  savedLines: { english?: string }[],
): string {
  const levelLabel: Record<string, string> = {
    level_300: 'TOEIC 300点程度の初級',
    level_600: 'TOEIC 600点程度の中級',
    level_800: 'TOEIC 800点程度の上級',
  };
  const sourceText = savedLines
    .slice(0, 15)
    .map(line => line.english)
    .filter((text): text is string => typeof text === 'string' && text.trim().length > 4)
    .join('\n');
  const sourceBlock = sourceText ? `\n参考英文:\n${sourceText}\n` : '';
  const levelText = levelLabel[level] ?? levelLabel.level_600;

  if (quizType === 'grammar') {
    return `${levelText}の英語学習者向けに、TOEIC Part 5形式の空所補充問題を${count}問作ってください。${sourceBlock}
JSON配列だけを返してください。
形式:
[{"s":"English sentence with _____","ja":"問題文全体の自然な日本語訳","options":["correct","wrong1","wrong2","wrong3"],"ans":"correct","correct":"correct","exp":"日本語の解説","cat":"カテゴリ"}]`;
  }

  if (quizType === 'listening') {
    return `${levelText}の英語学習者向けに、短い英文を聞いて意味を選ぶリスニング問題を${count}問作ってください。${sourceBlock}
JSON配列だけを返してください。
形式:
[{"en":"English sentence","jp":"正しい日本語訳","distractors":["誤訳1","誤訳2","誤訳3"]}]`;
  }

  return `${levelText}の英語学習者向けに、英単語の意味を選ぶ4択問題を${count}問作ってください。${sourceBlock}
JSON配列だけを返してください。
形式:
[{"word":"English word","meaning":"日本語の意味","pos":"品詞","options":["正解","誤答1","誤答2","誤答3"],"correct":"正解"}]`;
}

function toListening(raw: { en?: string; jp?: string; distractors?: string[] }[]): QuizQuestion[] {
  return raw
    .filter(item => item.en && item.jp)
    .map(item => ({
      en: item.en ?? '',
      jp: item.jp ?? '',
      options: shuffle([item.jp ?? '', ...(item.distractors ?? []).slice(0, 3)]),
      correct: item.jp ?? '',
    }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    quizType = 'word',
    sourceType = 'toeic',
    sourceId = '',
    level = 'level_600',
    setNum = 1,
    count = 10,
    savedLines = [],
    userId,
    forceRegen = false,
  } = (req.body ?? {}) as {
    quizType?: string;
    sourceType?: string;
    sourceId?: string;
    level?: string;
    setNum?: number;
    count?: number;
    savedLines?: { english?: string }[];
    userId?: string;
    forceRegen?: boolean;
  };

  const safeCount = Math.min(Math.max(Number(count) || 10, 1), 20);
  const cacheKey = buildCacheKey({ quizType, sourceType, sourceId, level, setNum });

  if (!forceRegen) {
    const cached = await getCachedQuiz(cacheKey);
    if (cached?.data?.length) {
      const cachedQuestions = quizType === 'grammar'
        ? normalizeGrammarSet(cached.data as QuizQuestion[], safeCount)
        : cached.data as QuizQuestion[];
      if (quizType === 'grammar' && cachedQuestions.length < safeCount) {
        console.warn(`[quiz/generate] invalid grammar cache ignored: ${cacheKey}`);
      } else {
      return res.status(200).json({
        questions: shuffle(cachedQuestions).slice(0, safeCount).map(shuffleQuestionOptions),
        cacheKey,
        fromCache: true,
      });
      }
    }
  }

  let questions: QuizQuestion[] = [];
  try {
    const prompt = buildPrompt(quizType, level, safeCount, savedLines);
    const system = 'You are an English quiz generator for Japanese learners. Return valid JSON only.';
    const raw = await callAI(prompt, 1800, system);

    if (quizType === 'listening') {
      questions = toListening(parseJSON<{ en?: string; jp?: string; distractors?: string[] }[]>(raw, []));
    } else {
      questions = parseJSON<QuizQuestion[]>(raw, []);
    }

    questions = questions
      .filter(q => q && (q.word || q.s || q.en))
      .map(q => ({ ...q, correct: q.correct ?? q.ans ?? q.meaning ?? '' }));
    if (quizType === 'grammar') {
      questions = normalizeGrammarSet(questions, safeCount);
    }
  } catch (err) {
    console.error('[quiz/generate] AI failed:', err instanceof Error ? err.message : err);
  }

  if (!questions.length) {
    questions = fallbackQuestions(quizType, safeCount);
  } else if (quizType === 'grammar' && questions.length < safeCount) {
    questions = [
      ...questions,
      ...normalizeGrammarSet(grammarQuestions(safeCount), safeCount)
        .filter(q => !questions.some(existing => existing.s === q.s)),
    ].slice(0, safeCount);
  }

  saveCachedQuiz({ cacheKey, quizType, sourceType, sourceId, level, data: questions, createdBy: userId })
    .catch(e => console.error('[quiz/generate] cache save failed', e));

  return res.status(200).json({
    questions: questions.slice(0, safeCount).map(shuffleQuestionOptions),
    cacheKey,
    fromCache: false,
  });
}
