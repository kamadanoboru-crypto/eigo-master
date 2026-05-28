export interface AffiliateCard {
  key: string;
  title: string;
  desc: string;
  cta: string;
  emoji: string;
  color: string;
  url: string;
  minScore: number;
  maxScore: number;
}

const envUrl = (key: string) => process.env[`NEXT_PUBLIC_AFFILIATE_${key.toUpperCase()}_URL`] ?? '';
const RAKUTEN_TOEIC_OFFICIAL_12_URL =
  'https://rpx.a8.net/svt/ejp?a8mat=4B3YVA+A36FSI+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00utzy4.2bo11901.g00utzy4.2bo12546%2Fa26052517603_4B3YVA_A36FSI_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Fnamions%252Fnm-4sjvqa17by9qlr6r%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Fnamions%252Fi%252F10064058%252F%26rafcid%3Dwsc_i_is_a9f492a7-8ef9-40e2-ab89-4bc43a1ee283';

export const AFFILIATE_CARDS: AffiliateCard[] = [
  {
    key: 'basic',
    title: '英語の土台を固める',
    desc: 'TOEIC 500点未満向け。語彙、文法、発音を基礎から学び直せる教材をおすすめします。',
    cta: 'おすすめを見る',
    emoji: '📘',
    color: '#2563EB',
    url: envUrl('basic'),
    minScore: 0,
    maxScore: 499,
  },
  {
    key: 'toeic',
    title: 'TOEIC対策を強化する',
    desc: 'TOEIC 500-699点向け。Part 5 とリスニングを中心に、得点力を伸ばす教材をおすすめします。',
    cta: '対策を見る',
    emoji: '🎯',
    color: '#7C3AED',
    url: envUrl('toeic') || RAKUTEN_TOEIC_OFFICIAL_12_URL,
    minScore: 500,
    maxScore: 699,
  },
  {
    key: 'conversation',
    title: '英会話でアウトプットする',
    desc: 'TOEIC 700点以上向け。AI英会話や発音練習で、使える英語へつなげます。',
    cta: '練習を探す',
    emoji: '🗣️',
    color: '#059669',
    url: envUrl('conversation'),
    minScore: 700,
    maxScore: 990,
  },
];

export function getAffiliateCard(toeicScore: number): AffiliateCard {
  return AFFILIATE_CARDS.find(
    card => toeicScore >= card.minScore && toeicScore <= card.maxScore,
  ) ?? AFFILIATE_CARDS[0];
}
