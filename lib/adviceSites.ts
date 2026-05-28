export type AdviceSite = {
  key: string;
  title: string;
  description: string;
  url: string;
  affiliate_url: string;
  tags: string[];
  level_range: [number, number];
  category: string;
};

export type AdviceSummary = {
  toeic_estimate?: number;
  listening_ratio?: number;
  conversation_ratio?: number;
  vocabulary_count?: number;
  streak_days?: number;
  study_frequency?: number;
};

const envUrl = (key: string) => process.env[`NEXT_PUBLIC_AFFILIATE_${key.toUpperCase()}_URL`] ?? '';
const RAKUTEN_TOEIC_OFFICIAL_12_URL =
  'https://rpx.a8.net/svt/ejp?a8mat=4B3YVA+A36FSI+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00utzy4.2bo11901.g00utzy4.2bo12546%2Fa26052517603_4B3YVA_A36FSI_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Fnamions%252Fnm-4sjvqa17by9qlr6r%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Fnamions%252Fi%252F10064058%252F%26rafcid%3Dwsc_i_is_a9f492a7-8ef9-40e2-ab89-4bc43a1ee283';

export const ADVICE_SITE_CATALOG: AdviceSite[] = [
  {
    key: 'bbc-learning-english',
    title: 'BBC Learning English',
    description: '短いニュースや会話で、自然な英語の聞き取りを増やせます。',
    url: 'https://www.bbc.co.uk/learningenglish',
    affiliate_url: envUrl('bbc') || '',
    tags: ['リスニング', '初心者', 'ニュース'],
    level_range: [350, 750],
    category: 'リスニング',
  },
  {
    key: 'abceed-toeic',
    title: 'abceed TOEIC',
    description: 'TOEIC形式の演習量を増やしたい時に使いやすい学習アプリです。',
    url: 'https://www.abceed.com/',
    affiliate_url: envUrl('abceed') || envUrl('toeic') || '',
    tags: ['TOEIC', '文法', '単語'],
    level_range: [450, 900],
    category: 'TOEIC',
  },
  {
    key: 'rakuten-toeic-official-12',
    title: 'TOEIC公式問題集 12',
    description: 'アプリ練習の仕上げに、本番形式の模試で時間配分を確認できます。',
    url: 'https://books.rakuten.co.jp/',
    affiliate_url: envUrl('rakuten_toeic') || RAKUTEN_TOEIC_OFFICIAL_12_URL,
    tags: ['TOEIC', '公式問題集', '模試'],
    level_range: [450, 990],
    category: 'TOEIC',
  },
  {
    key: 'dmm-daily-news',
    title: 'DMM英会話 Daily News',
    description: '読んだ英語をそのまま会話に使う練習へつなげやすい教材です。',
    url: 'https://eikaiwa.dmm.com/app/daily-news',
    affiliate_url: envUrl('dmm') || envUrl('conversation') || '',
    tags: ['英会話', 'ニュース', 'アウトプット'],
    level_range: [500, 990],
    category: '英会話',
  },
  {
    key: 'duolingo',
    title: 'Duolingo',
    description: '学習が途切れがちな時に、短時間で習慣を戻しやすいサービスです。',
    url: 'https://www.duolingo.com/',
    affiliate_url: envUrl('duolingo') || '',
    tags: ['初心者', '習慣化', '単語'],
    level_range: [0, 550],
    category: '初心者',
  },
  {
    key: 'risdom',
    title: 'Risdom（リズダム）',
    description: 'ゲーム感覚で続けやすい英語学習アプリ。継続が苦手な人や、楽しく学びたい人向けです。',
    url: 'https://play.google.com/store/apps/details?id=jp.co.benesse.risdomapp',
    affiliate_url: envUrl('risdom') || '',
    tags: ['ゲーム学習', '継続向け', 'リズム学習'],
    level_range: [0, 700],
    category: 'ゲーム学習',
  },
  {
    key: 'elsa-speak',
    title: 'ELSA Speak',
    description: '発音や音のつながりを確認しながら、聞き取りの土台を整えます。',
    url: 'https://elsaspeak.com/',
    affiliate_url: envUrl('elsa') || '',
    tags: ['発音', 'AI英語', 'スピーキング'],
    level_range: [400, 850],
    category: '発音',
  },
  {
    key: 'shadowing-practice',
    title: 'シャドーイング練習',
    description: '動画で聞いた英文を声に出し、理解速度と発音を同時に伸ばします。',
    url: 'https://www.youtube.com/results?search_query=english+shadowing+practice',
    affiliate_url: envUrl('shadowing') || '',
    tags: ['シャドーイング', 'リスニング', '発音'],
    level_range: [450, 990],
    category: 'シャドーイング',
  },
];

export function selectRecommendedSites(summary: AdviceSummary = {}): AdviceSite[] {
  const toeic = Number(summary.toeic_estimate ?? 500);
  const listening = Number(summary.listening_ratio ?? 0);
  const conversation = Number(summary.conversation_ratio ?? 0);
  const streak = Number(summary.streak_days ?? 0);
  const frequency = Number(summary.study_frequency ?? 0);

  const scores = ADVICE_SITE_CATALOG.map((site) => {
    let score = 10;
    if (toeic >= site.level_range[0] && toeic <= site.level_range[1]) score += 8;
    if (toeic < 500 && site.tags.includes('初心者')) score += 10;
    if (toeic >= 500 && site.tags.includes('TOEIC')) score += 7;
    if (toeic >= 600 && site.tags.includes('公式問題集')) score += 4;
    if (listening >= 0.45 && site.tags.includes('リスニング')) score += 7;
    if (conversation < 0.18 && site.tags.includes('英会話')) score += 8;
    if (streak < 3 || frequency < 3) {
      if (site.tags.includes('初心者')) score += 9;
      if (site.tags.includes('継続向け')) score += 10;
      if (site.tags.includes('ゲーム学習')) score += 8;
    }
    if (site.tags.includes('発音') && listening >= 0.3) score += 4;
    return { site, score };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ site }) => site);
}
