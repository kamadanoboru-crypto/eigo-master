// ================================================================
// 英語マスター 共通型定義
// ================================================================

// ── 動画 ──────────────────────────────────────────────────────
export interface Video {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  aiReady?: boolean;
}

// ── 字幕・チャンク ────────────────────────────────────────────
export interface Caption {
  id: string;
  english: string;
  chunks: string[];
  meaning: string[];
  videoTitle?: string;
  savedAt?: number;
}

// ── テスト問題 ────────────────────────────────────────────────
export interface QuizQuestion {
  id?: string;
  word?: string;
  meaning?: string;
  pos?: string;
  s?: string;          // 文法問題の文
  en?: string;         // リスニング英文
  jp?: string;         // リスニング日本語訳
  d?: string[];        // リスニングの選択肢候補
  ans?: string;
  correct?: string;
  opts?: string[];
  options?: string[];
  exp?: string;        // 文法解説
  cat?: string;        // カテゴリ
}

// ── 学習ログ ──────────────────────────────────────────────────
export interface LearningLog {
  date: string;
  correct: number;
  total: number;
  score?: number;
}

export interface TestResults {
  word: LearningLog[];
  grammar: LearningLog[];
  listening: LearningLog[];
  shadowing: LearningLog[];
}

// ── ニュース ──────────────────────────────────────────────────
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category: string;
}

// ── AI API レスポンス ─────────────────────────────────────────
export interface ChunkResponse {
  captions: Caption[];
}

export interface TranslateResponse {
  translation: string;
  error?: string;
}

export interface WordResponse {
  meaning: string;
  pos: string;
  example: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  error?: string;
}

// ── Supabase ──────────────────────────────────────────────────
export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}

// ── ガチャ ────────────────────────────────────────────────────
export interface GachaPrize {
  emoji: string;
  text: string;
  pts: number;
}

// ── 設定 ──────────────────────────────────────────────────────
export interface AppSettings {
  affOn: boolean;
  rewOn: boolean;
}

// ── アフィリエイト ────────────────────────────────────────────
export interface AffiliateCard {
  title: string;
  desc: string;
  cta: string;
  color: string;
  emoji: string;
  url: string;
}
