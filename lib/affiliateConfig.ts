/**
 * lib/affiliateConfig.ts
 * アフィリエイトカード設定
 *
 * ── URL差し替え方法 ──────────────────────────────────────────
 * 各カードの `url` を実際のアフィリエイトURLに変更するだけでOK
 *
 * ── 出し分けロジック ─────────────────────────────────────────
 * TOEIC予想スコアで自動選択:
 *   〜499点 → basic
 *   500〜699点 → toeic
 *   700点〜 → conversation
 *
 * ── クリックログ ─────────────────────────────────────────────
 * /api/affiliate/click エンドポイントで Supabase に記録
 */

export interface AffiliateCard {
  key:     string;  // 'basic' | 'toeic' | 'conversation'
  title:   string;
  desc:    string;
  cta:     string;
  emoji:   string;
  color:   string;
  url:     string;  // ← ここを実際のアフィリエイトURLに差し替え
  minScore: number; // このカードを表示するTOEIC最低スコア
  maxScore: number; // このカードを表示するTOEIC最大スコア
}

export const AFFILIATE_CARDS: AffiliateCard[] = [
  {
    key:      'basic',
    title:    '基礎英語マスターコース',
    desc:     'TOEIC 500点台へ！発音から文法まで丁寧に学べる入門コース。まずは基礎を固めよう。',
    cta:      '無料で始める →',
    emoji:    '📚',
    color:    '#2563EB',
    url:      'https://example.com/affiliate/basic',  // ← A8.net等のURLに差し替え
    minScore: 0,
    maxScore: 499,
  },
  {
    key:      'toeic',
    title:    'TOEIC600点突破プログラム',
    desc:     'あなたのレベルに合わせたTOEIC特化教材。Part5文法・リスニング対策が充実。',
    cta:      '詳細を見る →',
    emoji:    '🎯',
    color:    '#7C3AED',
    url:      'https://example.com/affiliate/toeic',  // ← 差し替えポイント
    minScore: 500,
    maxScore: 699,
  },
  {
    key:      'conversation',
    title:    'AI英会話 スピーキング強化',
    desc:     'TOEIC高得点者が次のステップに。AIと24時間英会話練習。発音スコアも計測。',
    cta:      '7日間無料で試す →',
    emoji:    '🗣️',
    color:    '#059669',
    url:      'https://example.com/affiliate/conversation',  // ← 差し替えポイント
    minScore: 700,
    maxScore: 990,
  },
];

/** TOEICスコアに対応するアフィリエイトカードを返す */
export function getAffiliateCard(toeicScore: number): AffiliateCard {
  const card = AFFILIATE_CARDS.find(
    c => toeicScore >= c.minScore && toeicScore <= c.maxScore,
  );
  return card ?? AFFILIATE_CARDS[0];
}
