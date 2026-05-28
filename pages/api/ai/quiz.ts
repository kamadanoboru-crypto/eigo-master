import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';
import type { Caption, QuizQuestion, QuizResponse } from '../../../types';

const WORDS: QuizQuestion[] = [
  { word: 'allocate', meaning: '割り当てる', pos: '動詞' },
  { word: 'implement', meaning: '実施する', pos: '動詞' },
  { word: 'facilitate', meaning: '促進する', pos: '動詞' },
  { word: 'comprehensive', meaning: '包括的な', pos: '形容詞' },
  { word: 'substantial', meaning: 'かなりの', pos: '形容詞' },
  { word: 'mandatory', meaning: '必須の', pos: '形容詞' },
  { word: 'revenue', meaning: '収益', pos: '名詞' },
  { word: 'momentum', meaning: '勢い', pos: '名詞' },
  { word: 'tentative', meaning: '暫定的な', pos: '形容詞' },
  { word: 'collaborate', meaning: '協力する', pos: '動詞' },
];

const GRAMMAR: QuizQuestion[] = [
  { s: 'The meeting has been _____ until next Friday.', options: ['postponed', 'postponing', 'postpone', 'postponement'], ans: 'postponed', correct: 'postponed', exp: '受け身の現在完了なので has been + 過去分詞を使います。', cat: '受動態' },
  { s: 'The report must be submitted _____ Friday.', options: ['by', 'until', 'since', 'for'], ans: 'by', correct: 'by', exp: '締切を表す「〜までに」は by を使います。', cat: '前置詞' },
  { s: 'Employees are required to _____ time sheets.', options: ['submit', 'submitting', 'submitted', 'submission'], ans: 'submit', correct: 'submit', exp: 'be required to の後は動詞の原形です。', cat: '動詞の形' },
  { s: 'The manager is responsible _____ the team.', options: ['for', 'of', 'to', 'at'], ans: 'for', correct: 'for', exp: 'be responsible for は「〜に責任がある」という表現です。', cat: '前置詞' },
  { s: 'Sales figures _____ significantly this year.', options: ['have risen', 'are risen', 'risen', 'rising'], ans: 'have risen', correct: 'have risen', exp: '現在完了の文脈なので have + 過去分詞を使います。', cat: '時制' },
];

const shuffle = <T>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);

function buildWordFallback(count: number): QuizQuestion[] {
  return shuffle(WORDS).slice(0, count).map(word => {
    const others = shuffle(WORDS.filter(item => item.word !== word.word)).slice(0, 3);
    return {
      ...word,
      options: shuffle([word.meaning!, ...others.map(item => item.meaning!)]),
      correct: word.meaning,
    };
  });
}

function buildGrammarFallback(count: number): QuizQuestion[] {
  return shuffle(GRAMMAR).slice(0, count);
}

async function generateFromSaved(
  type: string,
  saved: Partial<Caption>[],
  count: number,
): Promise<QuizQuestion[] | null> {
  const sentences = saved
    .slice(0, 20)
    .map(line => line.english)
    .filter((text): text is string => typeof text === 'string' && text.trim().length > 4);
  if (sentences.length < 3) return null;

  const source = sentences.join('\n');
  const system = 'You are an English quiz generator for Japanese learners. Return valid JSON only.';
  const prompt = type === 'grammar'
    ? `次の英文を参考に、TOEIC Part 5形式の空所補充問題を${count}問作ってください。

参考英文:
${source}

JSON配列だけを返してください:
[{"s":"English sentence with _____","options":["correct","wrong1","wrong2","wrong3"],"ans":"correct","correct":"correct","exp":"日本語の解説","cat":"カテゴリ"}]`
    : type === 'listening'
      ? `次の英文から、英文を聞いて正しい日本語訳を選ぶ問題を${count}問作ってください。

参考英文:
${source}

JSON配列だけを返してください:
[{"en":"English sentence","jp":"正しい日本語訳","distractors":["誤訳1","誤訳2","誤訳3"]}]`
      : `次の英文から重要な英単語を${count}個選び、意味を選ぶ4択問題を作ってください。

参考英文:
${source}

JSON配列だけを返してください:
[{"word":"English word","meaning":"日本語の意味","pos":"品詞","options":["正解","誤答1","誤答2","誤答3"],"correct":"正解"}]`;

  const text = await callAI(prompt, 1400, system);
  if (type === 'listening') {
    const rows = parseJSON<{ en?: string; jp?: string; distractors?: string[] }[]>(text, []);
    return rows
      .filter(row => row.en && row.jp)
      .map(row => ({
        en: row.en,
        jp: row.jp,
        options: shuffle([row.jp!, ...(row.distractors ?? []).slice(0, 3)]),
        correct: row.jp,
      }));
  }
  return parseJSON<QuizQuestion[]>(text, []).map(q => ({
    ...q,
    correct: q.correct ?? q.ans ?? q.meaning ?? '',
  }));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuizResponse>,
) {
  if (req.method !== 'POST') return res.status(405).json({ questions: [], error: 'Method not allowed' });

  const { type, savedLines = [], count = 10 } = req.body as {
    type?: string;
    savedLines?: Partial<Caption>[];
    count?: number;
  };
  if (!type) return res.status(400).json({ questions: [], error: 'type required' });

  const safeCount = Math.min(Math.max(Number(count) || 10, 1), 20);

  try {
    let questions = await generateFromSaved(type, savedLines, safeCount);
    if (!questions?.length) {
      questions = type === 'grammar'
        ? buildGrammarFallback(safeCount)
        : type === 'word'
          ? buildWordFallback(safeCount)
          : [];
    }
    return res.status(200).json({ questions });
  } catch (err) {
    console.error('[ai/quiz]', err instanceof Error ? err.message : err);
    const questions = type === 'grammar'
      ? buildGrammarFallback(safeCount)
      : type === 'word'
        ? buildWordFallback(safeCount)
        : [];
    return res.status(200).json({ questions, error: 'AI quiz generation failed; fallback questions returned.' });
  }
}
