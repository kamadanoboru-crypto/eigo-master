import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON } from '../../../lib/aiClient';
import type { QuizQuestion, QuizResponse, Caption } from '../../../types';

// ── フォールバックデータ ─────────────────────────────────────
const DUMMY_WORDS: QuizQuestion[] = [
  { word:'allocate',    meaning:'割り当てる', pos:'動詞',   options:[], correct:'割り当てる' },
  { word:'implement',   meaning:'実施する',   pos:'動詞',   options:[], correct:'実施する' },
  { word:'facilitate',  meaning:'促進する',   pos:'動詞',   options:[], correct:'促進する' },
  { word:'comprehensive',meaning:'包括的な',  pos:'形容詞', options:[], correct:'包括的な' },
  { word:'substantial', meaning:'相当な',     pos:'形容詞', options:[], correct:'相当な' },
  { word:'mandatory',   meaning:'義務的な',   pos:'形容詞', options:[], correct:'義務的な' },
  { word:'revenue',     meaning:'収益',       pos:'名詞',   options:[], correct:'収益' },
  { word:'momentum',    meaning:'勢い',       pos:'名詞',   options:[], correct:'勢い' },
  { word:'tentative',   meaning:'暫定的な',   pos:'形容詞', options:[], correct:'暫定的な' },
  { word:'collaborate', meaning:'協力する',   pos:'動詞',   options:[], correct:'協力する' },
];

const DUMMY_GRAMMAR: QuizQuestion[] = [
  { s:'The meeting has been _____ until next Friday.', options:['postponed','postponing','postpone','postponement'], ans:'postponed', correct:'postponed', exp:'受動態の完了形：has been + 過去分詞。', cat:'受動態' },
  { s:'The report must be submitted _____ Friday.',    options:['by','until','since','for'],                        ans:'by',        correct:'by',        exp:'by = 期限（〜までに）。',              cat:'前置詞' },
  { s:'Employees are required to _____ time sheets.', options:['submit','submitting','submitted','submission'],    ans:'submit',    correct:'submit',    exp:'to不定詞の後には動詞の原形。',         cat:'動詞の形' },
  { s:'The manager is responsible _____ the team.',   options:['for','of','to','at'],                              ans:'for',       correct:'for',       exp:'be responsible for が重要表現。',     cat:'前置詞' },
  { s:'Sales figures _____ significantly this year.',  options:['have risen','are risen','risen','rising'],         ans:'have risen',correct:'have risen', exp:'現在完了形：have + 過去分詞。',        cat:'時制' },
];

const shuffle = <T>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);

function buildWordFallback(n: number): QuizQuestion[] {
  return shuffle(DUMMY_WORDS).slice(0, n).map(w => {
    const others = shuffle(DUMMY_WORDS.filter(x => x.word !== w.word)).slice(0, 3);
    return { ...w, options: shuffle([w.meaning!, ...others.map(o => o.meaning!)]) };
  });
}

function buildGrammarFallback(n: number): QuizQuestion[] {
  return shuffle(DUMMY_GRAMMAR).slice(0, n);
}

// ── AI 生成 ───────────────────────────────────────────────────
async function genWordFromSaved(saved: Partial<Caption>[], n: number): Promise<QuizQuestion[] | null> {
  const sentences = saved.slice(0, 20).map(l => l.english).filter(Boolean);
  if (sentences.length < 3) return null;
  const prompt = `以下の英文から重要単語を${n}個選び4択問題を生成してください。
英文: ${sentences.join(' / ')}
JSON配列のみ: [{"word":"単語","meaning":"日本語","pos":"品詞","options":["正","誤1","誤2","誤3"],"correct":"正と同じ"}]
optionsはランダム順。JSON以外不要。`;
  try {
    const text = await callAI(prompt, 1000);
    const q = parseJSON<QuizQuestion[]>(text, []);
    return q.length ? q : null;
  } catch { return null; }
}

async function genGrammarFromSaved(saved: Partial<Caption>[], n: number): Promise<QuizQuestion[] | null> {
  const sentences = saved.slice(0, 15).map(l => l.english).filter(Boolean);
  if (sentences.length < 3) return null;
  const prompt = `以下の英文を参考にPart5形式の穴埋め問題を${n}問作ってください。
参考: ${sentences.join(' / ')}
JSON配列のみ: [{"s":"穴埋め文(_____使用)","options":["正","誤1","誤2","誤3"],"ans":"正解","exp":"解説","cat":"カテゴリ","correct":"ansと同じ"}]`;
  try {
    const text = await callAI(prompt, 1200);
    const q = parseJSON<QuizQuestion[]>(text, []);
    return q.length ? q : null;
  } catch { return null; }
}

async function genListeningFromSaved(saved: Partial<Caption>[], n: number): Promise<QuizQuestion[] | null> {
  const items = shuffle(saved.filter(l => l.english)).slice(0, n);
  if (items.length < 3) return null;
  const prompt = `以下の英文の正しい日本語訳と誤答3つを生成してください。
英文: ${items.map((l, i) => `${i + 1}. ${l.english}`).join('\n')}
JSON配列のみ: [{"en":"英文","jp":"正しい訳","distractors":["誤1","誤2","誤3"]}]`;
  try {
    const text = await callAI(prompt, 1200);
    const parsed = parseJSON<{ en: string; jp: string; distractors: string[] }[]>(text, []);
    if (!parsed.length) return null;
    return parsed.map(item => ({
      en: item.en,
      jp: item.jp,
      options: shuffle([item.jp, ...item.distractors]),
      correct: item.jp,
    }));
  } catch { return null; }
}

// ── Handler ───────────────────────────────────────────────────
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuizResponse>,
) {
  if (req.method !== 'POST') return res.status(405).json({ questions: [], error: 'Method not allowed' });

  const { type, savedLines = [], count = 10 } = req.body as {
    type: string;
    savedLines: Partial<Caption>[];
    count: number;
  };

  if (!type) return res.status(400).json({ questions: [], error: 'type required' });

  try {
    let questions: QuizQuestion[] | null = null;

    if (type === 'word')      questions = await genWordFromSaved(savedLines, count);
    else if (type === 'grammar')   questions = await genGrammarFromSaved(savedLines, count);
    else if (type === 'listening') questions = await genListeningFromSaved(savedLines, count);

    // フォールバック
    if (!questions?.length) {
      questions = type === 'word'
        ? buildWordFallback(count)
        : type === 'grammar'
        ? buildGrammarFallback(count)
        : [];
    }

    return res.status(200).json({ questions });
  } catch (err) {
    console.error('[quiz]', err);
    return res.status(500).json({ questions: [], error: 'Quiz generation failed' });
  }
}
