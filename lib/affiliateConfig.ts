import { AFFILIATE_LINKS } from './affiliateLinks';

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

export const AFFILIATE_CARDS: AffiliateCard[] = [
  {
    key: 'basic',
    title: '英語の基礎を固める',
    desc: 'TOEIC初心者向けに、単語・文法・リスニングを基礎から学べる講座をおすすめします。',
    cta: 'おすすめを見る',
    emoji: '🎓',
    color: '#2563EB',
    url: envUrl('basic') || AFFILIATE_LINKS.STUDY_SUPPLI_TRIAL,
    minScore: 0,
    maxScore: 499,
  },
  {
    key: 'toeic',
    title: 'TOEIC対策を強化する',
    desc: 'Part5とリスニングを中心に、スコアアップへつながる講座をおすすめします。',
    cta: 'TOEIC対策を見る',
    emoji: '📘',
    color: '#7C3AED',
    url: envUrl('toeic') || AFFILIATE_LINKS.STUDY_SUPPLI_TOEIC,
    minScore: 500,
    maxScore: 699,
  },
  {
    key: 'conversation',
    title: '英語を使う練習へ進む',
    desc: 'TOEIC対策の先に、会話・発音・実践的な英語へ広げる講座をおすすめします。',
    cta: '実践講座を見る',
    emoji: '🗣️',
    color: '#059669',
    url: envUrl('conversation') || AFFILIATE_LINKS.STUDY_SUPPLI_HOME,
    minScore: 700,
    maxScore: 990,
  },
];

export function getAffiliateCard(toeicScore: number): AffiliateCard {
  return AFFILIATE_CARDS.find(
    card => toeicScore >= card.minScore && toeicScore <= card.maxScore,
  ) ?? AFFILIATE_CARDS[0];
}
