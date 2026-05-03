/**
 * POST /api/quiz/generate
 *
 * フロー:
 *  1. cache_key 生成
 *  2. quiz_cache を確認（HIT → 即返す）
 *  3. MISS → AI生成（Groq→Cohere→Gemini→OpenAI→Dummy）
 *  4. DB に UPSERT 保存
 *  5. 返却
 *
 * Body: { quizType, sourceType, sourceId?, level?, setNum?, count?, savedLines?, userId?, forceRegen? }
 * Response: { questions, cacheKey, fromCache }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { callAI, parseJSON }          from '../../../lib/aiClient';
import { buildCacheKey, getCachedQuiz, saveCachedQuiz } from '../../../lib/quizCache';
import type { QuizQuestion }          from '../../../types';

// ── ダミーデータ（全AI失敗時・env未設定時のフォールバック）──
const DUMMY_WORDS: QuizQuestion[] = [
  {word:'allocate',     meaning:'割り当てる', pos:'動詞',   options:['割り当てる','取得する','実施する','促進する'],   correct:'割り当てる'},
  {word:'acquire',      meaning:'取得する',   pos:'動詞',   options:['取得する','割り当てる','交渉する','承認する'],   correct:'取得する'},
  {word:'implement',    meaning:'実施する',   pos:'動詞',   options:['実施する','促進する','従う','精査する'],         correct:'実施する'},
  {word:'facilitate',   meaning:'促進する',   pos:'動詞',   options:['促進する','実施する','協力する','取得する'],     correct:'促進する'},
  {word:'negotiate',    meaning:'交渉する',   pos:'動詞',   options:['交渉する','承認する','悪化する','払い戻す'],     correct:'交渉する'},
  {word:'comprehensive',meaning:'包括的な',   pos:'形容詞', options:['包括的な','効率的な','相当な','義務的な'],      correct:'包括的な'},
  {word:'mandatory',    meaning:'義務的な',   pos:'形容詞', options:['義務的な','相当な','連続した','熟練した'],      correct:'義務的な'},
  {word:'revenue',      meaning:'収益',       pos:'名詞',   options:['収益','支出','在庫','修正'],                    correct:'収益'},
  {word:'momentum',     meaning:'勢い',       pos:'名詞',   options:['勢い','主導権','収益','支出'],                  correct:'勢い'},
  {word:'efficient',    meaning:'効率的な',   pos:'形容詞', options:['効率的な','包括的な','暫定的な','隣接した'],    correct:'効率的な'},
];
const DUMMY_GRAMMAR: QuizQuestion[] = [
  {s:'The meeting has been _____ until next Friday.', options:['postponed','postponing','postpone','postponement'], ans:'postponed', correct:'postponed', exp:'受動態の完了形：has been + 過去分詞。', cat:'受動態'},
  {s:'The report must be submitted _____ Friday.',    options:['by','until','since','for'],                        ans:'by',        correct:'by',        exp:'by = 期限（〜までに）。',              cat:'前置詞'},
  {s:'Employees are required to _____ time sheets.', options:['submit','submitting','submitted','submission'],    ans:'submit',    correct:'submit',    exp:'to不定詞の後は動詞の原形。',           cat:'動詞の形'},
  {s:'The manager is responsible _____ the team.',   options:['for','of','to','at'],                              ans:'for',       correct:'for',       exp:'be responsible for が重要表現。',     cat:'前置詞'},
  {s:'Sales figures _____ significantly this year.', options:['have risen','are risen','risen','rising'],         ans:'have risen',correct:'have risen', exp:'現在完了形：have + 過去分詞。',        cat:'時制'},
  {s:'_____ the budget cuts, the project continued.',options:['Despite','Although','However','Because'],          ans:'Despite',   correct:'Despite',   exp:'Despite（前置詞）は名詞句を伴う。',    cat:'前置詞・接続詞'},
  {s:'Please contact us _____ you have questions.',  options:['if','unless','despite','while'],                   ans:'if',        correct:'if',        exp:'if が条件節を導く。',                  cat:'条件節'},
  {s:'The new policy will take _____ on April 1st.', options:['effect','affect','effort','efficiency'],           ans:'effect',    correct:'effect',    exp:'take effect（発効する）は重要熟語。',  cat:'語彙・熟語'},
  {s:'_____ staff attended the seminar voluntarily.',options:['Most','Almost','Mostly','The most'],               ans:'Most',      correct:'Most',      exp:'Most は形容詞として名詞を直接修飾。', cat:'形容詞・副詞'},
  {s:'The CEO announced the company would _____ staff.',options:['hire','hiring','hired','hires'],                ans:'hire',      correct:'hire',      exp:'would の後は動詞の原形。',            cat:'時制・話法'},
];

const shuffle = <T>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);

function dummyWord(n: number):      QuizQuestion[] { return shuffle(DUMMY_WORDS).slice(0, n); }
function dummyGrammar(n: number):   QuizQuestion[] { return shuffle(DUMMY_GRAMMAR).slice(0, n); }
function dummyListening(n: number): QuizQuestion[] {
  return dummyWord(n).map(w => ({
    en: `The word "${w.word}" means ${w.meaning}.`,
    jp: `「${w.word}」は${w.meaning}という意味です。`,
    options: shuffle([`「${w.word}」は${w.meaning}という意味です。`, '別の意味1', '別の意味2', '別の意味3']),
    correct: `「${w.word}」は${w.meaning}という意味です。`,
  }));
}

// ── AI プロンプト生成 ─────────────────────────────────────────
function buildPrompt(
  quizType: string,
  level: string,
  count: number,
  savedLines: { english?: string }[],
): string {
  const lvMap: Record<string, string> = {
    level_300: 'TOEIC 300点（初級）',
    level_600: 'TOEIC 600点（中級）',
    level_800: 'TOEIC 800点（上級）',
  };
  const lvLabel = lvMap[level] ?? 'TOEIC 600点（中級）';
  const sents = savedLines.slice(0, 15).map(l => l.english).filter(Boolean).join('\n');

  if (quizType === 'word') {
    return `${sents ? `以下の英文から重要単語を${count}個選び` : `${lvLabel}のTOEIC頻出単語を${count}個選び`}4択の単語問題を生成してください。${sents ? `\n英文:\n${sents}` : ''}
JSON配列のみ返してください（他の文字は一切不要）:
[{"word":"単語","meaning":"日本語の意味","pos":"品詞","options":["正解","誤答1","誤答2","誤答3"],"correct":"正解と同じ文字列"}]
optionsは必ずランダム順にすること。`;
  }
  if (quizType === 'grammar') {
    return `${sents ? `以下の英文を参考に${lvLabel}のPart5穴埋め問題を${count}問` : `${lvLabel}のTOEIC Part5穴埋め問題を${count}問`}生成してください。${sents ? `\n参考:\n${sents}` : ''}
JSON配列のみ返してください:
[{"s":"_____を使った穴埋め文","options":["正解","誤1","誤2","誤3"],"ans":"正解","exp":"解説（日本語）","cat":"カテゴリ","correct":"ansと同じ"}]`;
  }
  if (quizType === 'listening') {
    const lines = sents.split('\n').filter(Boolean).slice(0, count);
    return `${lines.length >= 3 ? `以下の英文について正しい日本語訳と誤答3つを生成してください。\n英文:\n${lines.join('\n')}` : `${lvLabel}の英語ビジネス表現を${count}文作り、それぞれの正しい日本語訳と誤答3つを生成してください`}
JSON配列のみ返してください:
[{"en":"英文","jp":"正しい日本語訳","distractors":["誤1","誤2","誤3"]}]`;
  }
  return `${lvLabel}の英語問題を${count}問生成してください。JSONのみ返してください。`;
}

// ── リスニング後処理 ─────────────────────────────────────────
function toListening(raw: { en?: string; jp?: string; distractors?: string[] }[]): QuizQuestion[] {
  return raw.map(item => ({
    en:      item.en ?? '',
    jp:      item.jp ?? '',
    options: shuffle([item.jp ?? '', ...(item.distractors ?? ['誤1','誤2','誤3'])]),
    correct: item.jp ?? '',
  }));
}

// ── Handler ───────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    quizType   = 'word',
    sourceType = 'toeic',
    sourceId   = '',
    level      = 'level_600',
    setNum     = 1,
    count      = 10,
    savedLines = [],
    userId,
    forceRegen = false,
  } = (req.body ?? {}) as {
    quizType?:   string;
    sourceType?: string;
    sourceId?:   string;
    level?:      string;
    setNum?:     number;
    count?:      number;
    savedLines?: { english?: string }[];
    userId?:     string;
    forceRegen?: boolean;
  };

  const cacheKey = buildCacheKey({ quizType, sourceType, sourceId, level, setNum });
  console.log(`[quiz/generate] ${cacheKey}`);

  // ── STEP 1: キャッシュ確認 ────────────────────────────────
  if (!forceRegen) {
    const cached = await getCachedQuiz(cacheKey);
    if (cached?.data?.length) {
      const qs = shuffle(cached.data as QuizQuestion[]).slice(0, count);
      console.log(`[quiz/generate] CACHE HIT (${qs.length}問)`);
      return res.status(200).json({ questions: qs, cacheKey, fromCache: true });
    }
  }
  console.log(`[quiz/generate] CACHE MISS → AI生成`);

  // ── STEP 2: AI生成 ────────────────────────────────────────
  let questions: QuizQuestion[] = [];

  try {
    const prompt = buildPrompt(quizType, level, count, savedLines);
    const raw    = await callAI(prompt, 1500);

    if (quizType === 'listening') {
      const arr = parseJSON<{ en?: string; jp?: string; distractors?: string[] }[]>(raw, []);
      questions = arr.length ? toListening(arr) : dummyListening(count);
    } else {
      const arr = parseJSON<QuizQuestion[]>(raw, []);
      questions = arr.length ? arr : (quizType === 'word' ? dummyWord(count) : dummyGrammar(count));
    }

    // correct フィールドの正規化
    questions = questions.map(q => ({ ...q, correct: q.correct ?? q.ans ?? '' }));

  } catch (err) {
    console.error('[quiz/generate] AI失敗 → ダミー使用:', err instanceof Error ? err.message : err);
    questions = quizType === 'word'
      ? dummyWord(count)
      : quizType === 'grammar'
      ? dummyGrammar(count)
      : dummyListening(count);
  }

  // ── STEP 3: DB UPSERT 保存（失敗しても返却は続ける）────────
  if (questions.length > 0) {
    saveCachedQuiz({ cacheKey, quizType, sourceType, sourceId, level, data: questions, createdBy: userId })
      .catch(e => console.error('[quiz/generate] DB保存失敗:', e));
  }

  return res.status(200).json({ questions: questions.slice(0, count), cacheKey, fromCache: false });
}
