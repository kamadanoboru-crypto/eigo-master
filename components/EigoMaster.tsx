// @ts-nocheck
import React, { useState, useRef, useCallback, useEffect, Component } from "react";
import type { ReactNode } from "react";
import type { QuizQuestion } from "../types";

const DEFAULT_THUMBNAIL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180"%3E%3Crect width="100%25" height="100%25" fill="%23E5E7EB"/%3E%3C/svg%3E';

// ── Supabase Auth ヘルパー（Google OAuth）──────────────────────
// supabase-js ライブラリ不要版
const SB_URL_AUTH = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) || "";
const SB_ANON_AUTH = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || "";

const supabaseAuth = {
  // Googleログインページへリダイレクト
  signInWithGoogle: () => {
    if (!SB_URL_AUTH) { console.warn('[Auth] Supabase未設定'); return; }
    const redirectTo = window.location.origin + '/';
    const url = `${SB_URL_AUTH}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    window.location.href = url;
  },
  // ログアウト
  signOut: async () => {
    try {
      const token = localStorage.getItem('sb_access_token');
      if (token && SB_URL_AUTH) {
        await fetch(`${SB_URL_AUTH}/auth/v1/logout`, {
          method: 'POST',
          headers: { apikey: SB_ANON_AUTH, Authorization: `Bearer ${token}` },
        });
      }
    } catch {}
    localStorage.removeItem('sb_access_token');
    localStorage.removeItem('sb_user');
  },
  // URLのハッシュフラグメントからセッション取得（OAuth コールバック）
  getSessionFromHash: () => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    if (!hash) return null;
    const params = new URLSearchParams(hash.slice(1));
    const token = params.get('access_token');
    const user_id = params.get('user_id') || params.get('sub');
    if (token) {
      localStorage.setItem('sb_access_token', token);
      // ユーザー情報取得
      return { token, user_id };
    }
    return null;
  },
  // 保存済みセッション取得
  getStoredSession: () => {
    try {
      const token = localStorage.getItem('sb_access_token');
      const userStr = localStorage.getItem('sb_user');
      if (!token) return null;
      return { token, user: userStr ? JSON.parse(userStr) : null };
    } catch { return null; }
  },
  // トークンからユーザー情報取得
  getUser: async (token) => {
    if (!SB_URL_AUTH || !token) return null;
    try {
      const r = await fetch(`${SB_URL_AUTH}/auth/v1/user`, {
        headers: { apikey: SB_ANON_AUTH, Authorization: `Bearer ${token}` },
      });
      if (!r.ok) return null;
      return r.json();
    } catch { return null; }
  },
};

// ─── エラーバウンダリ（白画面防止）─────────────────────────────
interface EBState { hasError: boolean; error: Error | null; }
interface EBProps { children: ReactNode; }

class ErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{maxWidth:430,margin:"0 auto",padding:40,fontFamily:"sans-serif",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>⚠️</div>
          <div style={{fontSize:18,fontWeight:700,marginBottom:8,color:"#0F172A"}}>問題が発生しました</div>
          <div style={{fontSize:13,color:"#64748B",marginBottom:24,fontFamily:"'Noto Sans JP',sans-serif"}}>
            アプリを再読み込みしてください
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{background:"#2563EB",color:"#fff",border:"none",borderRadius:8,padding:"10px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}}
          >
            再読み込み
          </button>
          {process.env.NODE_ENV === "development" && (
            <details style={{marginTop:20,textAlign:"left",fontSize:11,color:"#64748B"}}>
              <summary>エラー詳細（開発モードのみ）</summary>
              <pre style={{overflow:"auto",padding:8,background:"#F1F5F9",borderRadius:4,marginTop:8}}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════════
// SUPABASE CONFIG（環境変数から読み込み）
// .env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定
// anon key はクライアント公開前提（RLSで保護）
// ═══════════════════════════════════════════════════════════════
const SB_URL = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) || "";
const SB_KEY = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || "";
const SB_READY = SB_URL !== "" && SB_KEY !== "";

// ── Supabase fetch クライアント ───────────────────────────────
// 将来: import { createClient } from '@supabase/supabase-js' に差し替え可能
const sbFrom = (table) => {
  if (!SB_READY) {
    const noop = async () => [];
    return { select: noop, insert: noop, delete: noop, upsert: noop };
  }
  const base = `${SB_URL}/rest/v1/${table}`;
  const headers = {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    "Content-Type": "application/json",
  };
  return {
    select: async (filter = "") => {
      try {
        const r = await fetch(`${base}?${filter}`, { headers });
        if (!r.ok) throw new Error(`Supabase ${r.status}`);
        return r.json();
      } catch (e) { console.error("[supabase]", e.message); return []; }
    },
    insert: async (data) => {
      try {
        const r = await fetch(base, {
          method: "POST",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error(`Supabase ${r.status}`);
        return r.json();
      } catch (e) { console.error("[supabase]", e.message); return null; }
    },
    delete: async (filter) => {
      try { await fetch(`${base}?${filter}`, { method: "DELETE", headers }); }
      catch (e) { console.error("[supabase]", e.message); }
    },
    upsert: async (data) => {
      try {
        const r = await fetch(base, {
          method: "POST",
          headers: { ...headers, Prefer: "return=representation,resolution=merge-duplicates" },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error(`Supabase ${r.status}`);
        return r.json();
      } catch (e) { console.error("[supabase]", e.message); return null; }
    },
  };
};

// ── ユーザーID（将来 Supabase Auth に差し替えポイント）────────
// 将来: const { data: { user } } = await supabase.auth.getUser(); に変更
const getUserId = () => {
  try {
    let uid = localStorage.getItem("em_user_id");
    if (!uid) {
      uid = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
      localStorage.setItem("em_user_id", uid);
    }
    return uid;
  } catch {
    if (typeof window !== "undefined") {
      if (!window._emUserId) window._emUserId = Math.random().toString(36).slice(2);
      return window._emUserId;
    }
    return "anon";
  }
};


// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const GLOBAL_VIDEOS = [
  { videoId:"PlFx2XlbTK4", title:"How to Build Good Habits", channelTitle:"Motivation Daily", thumbnail:"https://img.youtube.com/vi/PlFx2XlbTK4/mqdefault.jpg" },
  { videoId:"LNHBMFCzznE", title:"The Power of Consistency",  channelTitle:"Growth Mindset",  thumbnail:"https://img.youtube.com/vi/LNHBMFCzznE/mqdefault.jpg" },
  { videoId:"V-_O7nl0Ii0", title:"Morning Routine for Success",channelTitle:"Life Hacks",      thumbnail:"https://img.youtube.com/vi/V-_O7nl0Ii0/mqdefault.jpg"  },
];
const DUMMY_CAPTIONS = {
  PlFx2XlbTK4:[
    {id:"c1",english:"I have been working on this project since Monday.",        chunks:["I","have been","working on","this project","since Monday"],       meaning:["私","ずっと〜している","取り組んでいる","このプロジェクト","月曜から"]},
    {id:"c2",english:"Good habits are the foundation of a successful life.",     chunks:["Good habits","are","the foundation","of a successful life"],       meaning:["良い習慣","〜である","土台・基盤","成功した人生の"]},
    {id:"c3",english:"You need to start small and build momentum over time.",    chunks:["You need to","start small","and","build momentum","over time"],    meaning:["〜する必要がある","小さく始める","そして","勢いをつける","時間をかけて"]},
    {id:"c4",english:"Every action you take is a vote for who you want to become.",chunks:["Every action","you take","is a vote","for who","you want to become"],meaning:["すべての行動は","あなたがとる","一票である","〜のための","なりたい自分"]},
    {id:"c5",english:"The hardest part is getting started, but it gets easier.", chunks:["The hardest part","is","getting started","but","it gets easier"],  meaning:["最も難しい部分は","〜だ","始めること","しかし","だんだん楽になる"]},
  ],
  LNHBMFCzznE:[
    {id:"d1",english:"Consistency is more important than intensity.",                   chunks:["Consistency","is","more important","than intensity"],              meaning:["継続性","〜である","より重要だ","強度より"]},
    {id:"d2",english:"Small daily improvements lead to stunning results over time.",    chunks:["Small daily improvements","lead to","stunning results","over time"],meaning:["毎日の小さな改善が","〜につながる","驚くべき結果に","時間をかけて"]},
    {id:"d3",english:"Focus on the process, not just the outcome.",                    chunks:["Focus on","the process","not just","the outcome"],                 meaning:["〜に集中する","プロセス","〜だけでなく","結果"]},
  ],
};
// ── アフィリエイトカード設定（lib/affiliateConfig.ts で管理）────
// URLの差し替えは lib/affiliateConfig.ts の url フィールドを変更するだけ
const AFF_CARDS = [
  {key:"basic",        title:"英語の基礎を固めよう",   desc:"スコア500未満向け：基礎英語学習",      cta:"無料で始める →",  color:"#3B82F6",emoji:"📚", url:"https://example.com/affiliate/basic",        minScore:0,   maxScore:499},
  {key:"toeic",        title:"次のステップ：TOEIC対策", desc:"スコア500〜700向け：TOEIC専門教材",    cta:"無料体験する →",  color:"#8B5CF6",emoji:"🎯", url:"https://example.com/affiliate/toeic",        minScore:500, maxScore:699},
  {key:"conversation", title:"英会話でアウトプット！",  desc:"スコア700以上向け：AI英会話サービス",  cta:"無料レッスン →",  color:"#10B981",emoji:"🗣️",url:"https://example.com/affiliate/conversation", minScore:700, maxScore:990},
];
// URLだけ差し替えるための設定（後からA8.net等のURLに変更可能）
const getAffCard = (toeic: number) =>
  AFF_CARDS.find(c => toeic >= c.minScore && toeic <= c.maxScore) ?? AFF_CARDS[0];
// 旧コードとの互換性のため AFF も維持
const AFF = {
  low: AFF_CARDS[0],
  mid: AFF_CARDS[1],
  high: AFF_CARDS[2],
};

// ── WORD BANK (TOEIC頻出 30語) ── AI差し替えポイント ──────────
const WORDS = [
  {id:"w01",word:"allocate",    meaning:"割り当てる",  pos:"動詞"},  {id:"w02",word:"acquire",     meaning:"取得する",    pos:"動詞"},
  {id:"w03",word:"implement",   meaning:"実施する",    pos:"動詞"},  {id:"w04",word:"facilitate",  meaning:"促進する",    pos:"動詞"},
  {id:"w05",word:"negotiate",   meaning:"交渉する",    pos:"動詞"},  {id:"w06",word:"comprehensive",meaning:"包括的な",   pos:"形容詞"},
  {id:"w07",word:"efficient",   meaning:"効率的な",    pos:"形容詞"},{id:"w08",word:"substantial", meaning:"相当な",      pos:"形容詞"},
  {id:"w09",word:"mandatory",   meaning:"義務的な",    pos:"形容詞"},{id:"w10",word:"provisional", meaning:"暫定的な",    pos:"形容詞"},
  {id:"w11",word:"reimburse",   meaning:"払い戻す",    pos:"動詞"},  {id:"w12",word:"comply",      meaning:"従う",        pos:"動詞"},
  {id:"w13",word:"authorize",   meaning:"承認する",    pos:"動詞"},  {id:"w14",word:"anticipate",  meaning:"予期する",    pos:"動詞"},
  {id:"w15",word:"scrutinize",  meaning:"精査する",    pos:"動詞"},  {id:"w16",word:"deteriorate", meaning:"悪化する",    pos:"動詞"},
  {id:"w17",word:"collaborate", meaning:"協力する",    pos:"動詞"},  {id:"w18",word:"amendment",   meaning:"修正",        pos:"名詞"},
  {id:"w19",word:"inventory",   meaning:"在庫",        pos:"名詞"},  {id:"w20",word:"revenue",     meaning:"収益",        pos:"名詞"},
  {id:"w21",word:"expenditure", meaning:"支出",        pos:"名詞"},  {id:"w22",word:"momentum",    meaning:"勢い",        pos:"名詞"},
  {id:"w23",word:"initiative",  meaning:"主導権",      pos:"名詞"},  {id:"w24",word:"tentative",   meaning:"暫定的な",    pos:"形容詞"},
  {id:"w25",word:"proficient",  meaning:"熟練した",    pos:"形容詞"},{id:"w26",word:"streamline",  meaning:"合理化する",  pos:"動詞"},
  {id:"w27",word:"outsource",   meaning:"外部委託する",pos:"動詞"},  {id:"w28",word:"adjacent",    meaning:"隣接した",    pos:"形容詞"},
  {id:"w29",word:"consecutive", meaning:"連続した",    pos:"形容詞"},{id:"w30",word:"flagship",    meaning:"主力の",      pos:"形容詞"},
];

// ── GRAMMAR BANK (Part5 15問) ── AI差し替えポイント ──────────
const GRAMMAR = [
  {id:"g01",s:"The meeting has been _____ until next Friday.",                         opts:["postponed","postponing","postpone","postponement"],    ans:"postponed",   exp:"受動態の完了形：has been + 過去分詞。「延期された」状態。",          cat:"受動態"},
  {id:"g02",s:"_____ the budget cuts, the project continued as planned.",              opts:["Despite","Although","However","Because"],              ans:"Despite",     exp:"Despite（前置詞）は名詞句を伴う。Althoughは接続詞で節を伴う。",     cat:"前置詞・接続詞"},
  {id:"g03",s:"The report must be submitted _____ Friday.",                            opts:["by","until","since","for"],                            ans:"by",          exp:"by = 期限（〜までに）。until = 継続（〜までずっと）。",              cat:"前置詞"},
  {id:"g04",s:"Employees are required to _____ their time sheets weekly.",             opts:["submit","submitting","submitted","submission"],         ans:"submit",      exp:"to不定詞の後には動詞の原形が来る。",                                 cat:"動詞の形"},
  {id:"g05",s:"The new policy will take _____ on April 1st.",                          opts:["effect","affect","effort","efficiency"],               ans:"effect",      exp:"take effect（発効する）は重要熟語。affectは動詞。",                  cat:"語彙・熟語"},
  {id:"g06",s:"_____ she finished early, she was able to leave on time.",              opts:["Because","Despite","Unless","Although"],               ans:"Because",     exp:"becauseは理由の接続詞。因果関係を表す。",                           cat:"接続詞"},
  {id:"g07",s:"Please contact us _____ you have any questions.",                       opts:["if","unless","despite","while"],                       ans:"if",          exp:"if（もし〜なら）が条件節を導く。",                                   cat:"条件節"},
  {id:"g08",s:"The manager is responsible _____ overseeing the team.",                 opts:["for","of","to","at"],                                  ans:"for",         exp:"be responsible for（〜に責任がある）は重要表現。",                   cat:"前置詞"},
  {id:"g09",s:"_____ completed the training, all new staff must pass a final test.",   opts:["Having","After having","To have","Have"],              ans:"Having",      exp:"分詞構文：Having + 過去分詞で「〜し終えてから」。",                  cat:"分詞構文"},
  {id:"g10",s:"Sales figures _____ significantly compared to last quarter.",           opts:["have risen","are risen","risen","rising"],             ans:"have risen",  exp:"現在完了形：have + 過去分詞。riseの過去分詞はrisen。",               cat:"時制"},
  {id:"g11",s:"_____ staff members attended the seminar voluntarily.",                 opts:["Most","Almost","Mostly","The most"],                   ans:"Most",        exp:"Mostは形容詞として名詞を直接修飾できる。Almostは副詞。",             cat:"形容詞・副詞"},
  {id:"g12",s:"The CEO announced that the company would _____ 200 new employees.",    opts:["hire","hiring","hired","hires"],                       ans:"hire",        exp:"間接話法：wouldの後に動詞の原形が来る。",                            cat:"時制・間接話法"},
  {id:"g13",s:"The room is available _____ you reserve it in advance.",                opts:["provided that","in spite of","due to","regardless of"],ans:"provided that",exp:"provided that（〜という条件で）。as long asと言い換え可能。",      cat:"接続詞"},
  {id:"g14",s:"The proposal was _____ accepted by all board members.",                 opts:["unanimously","ambiguously","tentatively","separately"],ans:"unanimously", exp:"unanimously（全員一致で）が文脈に合う副詞。",                        cat:"語彙・副詞"},
  {id:"g15",s:"We need to _____ our marketing strategy to reach younger audiences.",   opts:["revise","revising","revised","revision"],              ans:"revise",      exp:"need to の後には動詞の原形が来る。",                                  cat:"動詞の形"},
];

// ── LISTENING BANK (10文) ── AI差し替えポイント ───────────────
const LISTENING = [
  {id:"l01",en:"Please submit your report by the end of the week.",             jp:"週末までにレポートを提出してください。",          d:["週の初めにレポートを確認してください。","会議の前にレポートを印刷してください。","レポートの内容を修正してください。"]},
  {id:"l02",en:"The meeting has been postponed until next Tuesday.",             jp:"会議は来週火曜日まで延期されました。",            d:["会議は来週火曜日に予定されています。","会議は今週火曜日にキャンセルされました。","来週月曜日に会議の場所が変更になりました。"]},
  {id:"l03",en:"We need to reduce our expenditures this quarter.",               jp:"今四半期は支出を削減する必要があります。",        d:["今四半期は収益を増やす必要があります。","今四半期は人員を削減する必要があります。","今四半期は在庫を確認する必要があります。"]},
  {id:"l04",en:"All staff are required to attend the training session.",          jp:"全スタッフはトレーニングに参加が必要です。",      d:["スタッフはトレーニングに任意参加できます。","管理職のみ参加が必要です。","トレーニングは来月に延期されました。"]},
  {id:"l05",en:"The company has acquired a new business partner in Asia.",        jp:"アジアで新しいビジネスパートナーを獲得しました。",d:["アジアで新しい支社を開設しました。","アジアのパートナーとの契約を終了しました。","アジア市場から撤退することを決めました。"]},
  {id:"l06",en:"You can get a full refund if you are not satisfied.",             jp:"ご満足いただけない場合は全額返金いたします。",    d:["ご満足いただいた場合は割引をご提供します。","返金はご購入から30日以内に限ります。","ご満足いただけない場合は交換をいたします。"]},
  {id:"l07",en:"Please contact the help desk if you have any issues.",            jp:"問題がある場合はヘルプデスクにご連絡ください。",  d:["問題がある場合は上司に報告してください。","すべての問題はメールでご報告ください。","ヘルプデスクは平日のみ対応しています。"]},
  {id:"l08",en:"The project deadline has been moved up to next Monday.",          jp:"締め切りが来週月曜日に前倒しになりました。",      d:["締め切りが来週月曜日まで延長されました。","プロジェクトは来週月曜日に開始されます。","来週月曜日にプロジェクトレビューがあります。"]},
  {id:"l09",en:"We are looking for motivated individuals to join our team.",      jp:"意欲的な人材を募集しています。",                  d:["チームの人員削減を検討しています。","新しいチームを外部から雇用する予定です。","経験豊富なマネージャーを探しています。"]},
  {id:"l10",en:"The annual sales report will be released next month.",            jp:"年次売上レポートは来月公開される予定です。",      d:["年次売上レポートは先月公開されました。","売上レポートは毎週更新されます。","年次レポートの提出期限は来月です。"]},
];

const GACHA_PRIZES = [
  {emoji:"⭐",text:"スター！",            pts:0,  skill:null},
  {emoji:"✨",text:"かがやきスター！",     pts:0,  skill:null},
  {emoji:"🎯",text:"継続ボーナス！",       pts:5,  skill:null},
  {emoji:"🌟",text:"ラッキー！+10pt",      pts:10, skill:null},
  {emoji:"💎",text:"ダイヤ！+20pt",        pts:20, skill:null},
  {emoji:"🔥",text:"フレーム獲得！",       pts:5,  skill:null},
  {emoji:"🛡️",text:"シールドチケット！",  pts:0,  skill:"shield"},
  {emoji:"🐢",text:"スロータブレット！",  pts:0,  skill:"slow"},
  {emoji:"💡",text:"ヒントカード！",       pts:0,  skill:"hint"},
  {emoji:"💚",text:"HP回復ポーション！",   pts:0,  skill:"heal"},
];

// ══ UTILS ════════════════════════════════════════════════════════
const shuffle = a => [...a].sort(() => Math.random() - 0.5);

// AI差し替えポイント: savedLinesがある場合はAPI Route /api/ai/quiz でAI生成
// savedLinesが少ない場合はローカルダミーデータにフォールバック
// ── 問題生成（AI生成＋DBキャッシュ方式）────────────────────────
// /api/quiz/generate がキャッシュ確認→AI生成→DB保存を一括処理する

// source_type / level をクライアントで決定
function getSourceType(savedLines: {english?: string}[]): string {
  return savedLines.length >= 5 ? 'custom' : 'toeic';
}

async function fetchQuiz(
  quizType: string,
  savedLines: {english?: string}[],
  n: number,
  userId: string,
): Promise<QuizQuestion[]> {
  const sourceType = getSourceType(savedLines);
  console.log(`[quiz] generate: ${quizType} / ${sourceType} / userId=${userId.slice(0,8)}`);

  try {
    const res = await fetch('/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizType,
        sourceType,
        level:      'level_600',
        count:      n,
        savedLines: savedLines.slice(0, 20),
        userId,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d = await res.json() as { questions: QuizQuestion[]; fromCache: boolean; cacheKey: string };
    console.log("[quiz] " + (d.fromCache ? 'CACHE HIT' : 'AI生成') + ": " + d.cacheKey + " (" + d.questions.length + "問)");
    return d.questions;
  } catch (err) {
    console.error('[quiz] fetch error:', err);
    return [];
  }
}

const genWord = async (savedLines: {english?: string}[] = [], n = 10, userId = '') => {
  const qs = await fetchQuiz('word', savedLines, n, userId);
  if (qs.length > 0) return qs;
  // フォールバック: ダミー
  return shuffle(WORDS as QuizQuestion[]).slice(0, n).map(w => {
    const others = shuffle((WORDS as QuizQuestion[]).filter(x => x.id !== w.id)).slice(0, 3);
    return { ...w, options: shuffle([w.meaning ?? '', ...others.map(o => o.meaning ?? '')]), correct: w.meaning ?? '' };
  });
};

const genGrammar = async (savedLines: {english?: string}[] = [], n = 10, userId = '') => {
  const qs = await fetchQuiz('grammar', savedLines, n, userId);
  if (qs.length > 0) return qs;
  return shuffle(GRAMMAR as QuizQuestion[]).slice(0, n).map(q => ({ ...q, options: q.opts ?? [], correct: q.ans ?? '' }));
};

const genListening = async (savedLines: {english?: string}[] = [], n = 10, userId = '') => {
  const qs = await fetchQuiz('listening', savedLines, n, userId);
  if (qs.length > 0) return qs;
  return shuffle(LISTENING as QuizQuestion[]).slice(0, n).map(item => ({
    ...item,
    options: shuffle([item.jp ?? '', ...(item.d ?? [])]),
    correct: item.jp ?? '',
  }));
};


const calcToeic = r => {
  const last = a => a.length > 0 ? a[a.length-1] : null;
  const acc  = x => x ? x.correct/x.total : 0;
  const shAvg = r.shadowing.length > 0 ? r.shadowing.reduce((s,x)=>s+x.score,0)/r.shadowing.length : 0;
  return Math.min(990, Math.round(300 + acc(last(r.word))*150 + acc(last(r.grammar))*150 + acc(last(r.listening))*200 + (shAvg/100)*100));
};
const spLevel = t => {
  if(t<300) return {label:"入門",  en:"Starter",           color:"#94A3B8",grade:"A1"};
  if(t<400) return {label:"初級",  en:"Elementary",        color:"#60A5FA",grade:"A2"};
  if(t<500) return {label:"初中級",en:"Pre-Intermediate",  color:"#34D399",grade:"B1"};
  if(t<600) return {label:"中級",  en:"Intermediate",      color:"#FBBF24",grade:"B1+"};
  if(t<700) return {label:"中上級",en:"Upper-Intermediate",color:"#F97316",grade:"B2"};
  if(t<800) return {label:"上級",  en:"Advanced",          color:"#A78BFA",grade:"C1"};
  return          {label:"最上級", en:"Proficient",        color:"#EF4444",grade:"C2"};
};
const affLevel = s => s<500?"low":s<700?"mid":"high";
const stars = (n,t) => Array.from({length:5},(_,i)=>i<Math.round((n/t)*5));

// ══ ICONS ════════════════════════════════════════════════════════
const I = ({n,s=20,c="currentColor"}) => ({
  home:   <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  learn:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  bkmk:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  bkmkF:  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  gift:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  cog:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  star:   <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  play:   <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  mic:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  close:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chL:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>,
  chR:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  ok:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  ng:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  vol:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  chart:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  yt:     <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>,
  trophy: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  trash:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  ad:     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 14l4-8 4 8"/><line x1="9.5" y1="11" x2="14.5" y2="11"/></svg>,
  pie:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  vid:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  book:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  info:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  ear:    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  news:   <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
  globe:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  extlnk: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  xmark:  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
})[n] || null;



// ═══════════════════════════════════════════════════════════════
// AI & YOUTUBE UTILS  （AI差し替えポイント）
// ═══════════════════════════════════════════════════════════════

// ① YouTube動画情報取得（oEmbed - 認証不要）
const fetchVideoInfo = async (videoId) => {
  try {
    const r = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!r.ok) return null;
    const d = await r.json();
    return {
      title: d.title,
      channelTitle: d.author_name,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    };
  } catch { return null; }
};

// ② YouTube字幕取得（CORS proxy経由）
const fetchTranscript = async (videoId) => {
  const langs = ['en', 'en-US', 'en-GB', 'a.en'];
  for (const lang of langs) {
    try {
      const ytUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}`;
      const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(ytUrl)}`);
      if (!r.ok) continue;
      const data = await r.json();
      if (!data.contents || !data.contents.includes('<text')) continue;
      const doc = new DOMParser().parseFromString(data.contents, 'text/xml');
      const nodes = Array.from(doc.querySelectorAll('text'));
      if (!nodes.length) continue;
      // 単語グループ化 → 文に変換
      const sentences = [];
      let buf = '', wc = 0;
      nodes.forEach(n => {
        const w = n.textContent
          .replace(/&amp;/g, '&').replace(/&#39;/g, "'")
          .replace(/\n/g, ' ').trim();

        if (!w) return;
        buf += (buf ? ' ' : '') + w;
        wc += w.split(' ').length;
        if (wc >= 12 || /[.!?]$/.test(w)) {
          const s = buf.trim();
          if (s.split(' ').length >= 4) sentences.push(s);
          buf = ''; wc = 0;
        }
      });
      if (buf.trim().split(' ').length >= 4) sentences.push(buf.trim());
      if (sentences.length >= 3) {
        return { ok: true, sentences: sentences.slice(0, 15) };
      }
    } catch {}
  }
  return { ok: false };
};

// ③ Anthropic API: チャンク生成（AI差し替えポイント - モデル・プロンプト変更可）
const aiGenerateChunks = async (sentences, onProgress) => {
  // API Route /api/ai/chunk 経由（APIキーはサーバー側）
  const results = [];
  const batchSize = 4;
  for (let i = 0; i < sentences.length; i += batchSize) {
    const batch = sentences.slice(i, i + batchSize);
    try {
      const r = await fetch('/api/ai/chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentences: batch }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      if (Array.isArray(d.captions)) results.push(...d.captions);
    } catch (err) {
      console.error('[aiGenerateChunks]', err.message);
      batch.forEach(s => results.push({
        english: s, chunks: s.split(' ').slice(0,5), meaning: ['(生成失敗)'],
      }));
    }
    onProgress(Math.round(((i + batchSize) / sentences.length) * 85));
    await new Promise(r => setTimeout(r, 200));
  }
  return results;
};

// ════════════════════════════════════════════════════════════════
// NEWS UTILS
// ════════════════════════════════════════════════════════════════

// ① BBC RSS フィード取得（CORS proxy経由）
const fetchBBCNews = async (feed = 'world') => {
  // API Route /api/news/bbc 経由（サーバー側でCORSを解決）
  // allorigins.win は本番不安定なためサーバープロキシに変更
  try {
    const r = await fetch(`/api/news/bbc?feed=${encodeURIComponent(feed)}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error(`BBC API error: ${r.status}`);
    const d = await r.json();
    return Array.isArray(d.articles) ? d.articles : [];
  } catch (err) {
    console.error('[fetchBBCNews]', err.message);
    return [];
  }
};

// ② 英文を文単位に分割
const splitSentences = (text) => {
  const re = new RegExp('[^.!?]+[.!?]+[\\s]*', 'g');
  return text.match(re)?.map(s => s.trim()).filter(s => s.split(' ').length >= 3) || [text];
};

// ③ AI: 単語の意味を返す
const aiWordMeaning = async (word, sentence) => {
  // API Route /api/ai/word 経由
  try {
    const r = await fetch('/api/ai/word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, sentence }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  } catch (err) {
    console.error('[aiWordMeaning]', err.message);
    return { meaning: '取得できませんでした', pos: '', example: '' };
  }
};

// ④ AI: 1文を翻訳する
const aiTranslateSentence = async (sentence) => {
  // API Route /api/ai/translate 経由
  try {
    const r = await fetch('/api/ai/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: sentence, mode: 'sentence' }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    return d.translation || '翻訳できませんでした';
  } catch (err) {
    console.error('[aiTranslateSentence]', err.message);
    return '翻訳に失敗しました。もう一度お試しください。';
  }
};

// ⑤ AI: 全文翻訳
const aiTranslateAll = async (text) => {
  // API Route /api/ai/translate 経由（mode: full）
  try {
    const r = await fetch('/api/ai/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode: 'full' }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    return d.translation || '翻訳できませんでした';
  } catch (err) {
    console.error('[aiTranslateAll]', err.message);
    return '翻訳に失敗しました。もう一度お試しください。';
  }
};

// ④ 字幕取得失敗時: ビデオタイトルからサンプル文を生成
const aiGenerateSampleSentences = async (title) => {
  // 字幕取得失敗時のサンプル文生成 → API Route /api/ai/quiz 経由
  try {
    const r = await fetch('/api/ai/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'sample', title, count: 10 }),
    });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d.sentences) ? d.sentences : [];
  } catch { return []; }
};

// ④.5 Supabase: 動画リストを保存・読み込み
const dbSaveVideo = async (userId, video) => {
  if (!SB_READY) return;
  try {
    await sbFrom('user_videos').upsert({
      user_id: userId,
      video_id: video.videoId,
      title: video.title,
      channel_title: video.channelTitle,
      thumbnail: video.thumbnail,
      added_at: new Date().toISOString(),
    });
  } catch {}
};

const dbLoadVideos = async (userId) => {
  if (!SB_READY) return [];
  try {
    const rows = await sbFrom('user_videos').select(`user_id=eq.${userId}&order=added_at.asc`);
    if (!Array.isArray(rows)) return [];
    return rows.map(r => ({
      videoId: r.video_id,
      title: r.title,
      channelTitle: r.channel_title,
      thumbnail: r.thumbnail,
      aiReady: false,
    }));
  } catch { return []; }
};

// ⑤ Supabase: 字幕を保存
const dbSaveCaptions = async (videoId, captions) => {
  if (!SB_READY) return;
  try {
    const rows = captions.map((c, i) => ({
      video_id: videoId,
      caption_index: i,
      english: c.english,
      chunks: c.chunks,
      meaning: c.meaning,
    }));
    await sbFrom('video_captions').insert(rows);
  } catch {}
};

// ⑥ Supabase: 字幕を取得
const dbLoadCaptions = async (videoId) => {
  if (!SB_READY) return null;
  try {
    const rows = await sbFrom('video_captions').select(`video_id=eq.${videoId}&order=caption_index.asc`);
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows.map((r, i) => ({
      id: `${videoId}_${i}`,
      english: r.english,
      chunks: r.chunks || [],
      meaning: r.meaning || [],
    }));
  } catch { return null; }
};

// ══ CSS ══════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --p:#2563EB;--pl:#EFF6FF;--pd:#1D4ED8;--a:#F59E0B;--al:#FEF3C7;
  --ok:#10B981;--ng:#EF4444;--pu:#8B5CF6;
  --bg:#F8FAFC;--sur:#FFFFFF;--bd:#E2E8F0;
  --t:#0F172A;--t2:#475569;--t3:#94A3B8;
  --cb:#F0F9FF;--cbb:#BAE6FD;
  --sh:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.06);
  --r:12px;--rs:8px;
}
body{font-family:'DM Sans','Noto Sans JP',sans-serif;background:var(--bg);color:var(--t)}
.app{max-width:430px;margin:0 auto;min-height:100vh;height:100vh;display:flex;flex-direction:column;background:var(--bg);overflow:hidden}
.jp{font-family:'Noto Sans JP',sans-serif}
/* ─ header ─ */
.hdr{background:var(--sur);border-bottom:1px solid var(--bd);padding:0 16px;position:sticky;top:0;z-index:100;box-shadow:var(--sh)}
.hdr-in{display:flex;align-items:center;justify-content:space-between;height:52px}
.hdr-t{font-size:17px;font-weight:700;display:flex;align-items:center;gap:6px}
.back-btn{display:flex;align-items:center;gap:4px;color:var(--p);font-size:14px;font-weight:600;cursor:pointer;border:none;background:none;padding:4px 0}
/* ─ bottom nav ─ */
.bnav{background:var(--sur);border-top:1px solid var(--bd);display:flex;position:sticky;bottom:0;z-index:100;padding-bottom:env(safe-area-inset-bottom,0)}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;padding:7px 2px 9px;cursor:pointer;border:none;background:none;color:var(--t3);font-size:9.5px;font-weight:500;gap:3px;transition:color .15s;font-family:'Noto Sans JP',sans-serif}
.ni.on{color:var(--p)}
/* ─ scroll ─ */
.sa{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}
.sa::-webkit-scrollbar{display:none}
/* ─ buttons ─ */
.bp{background:var(--p);color:#fff;border:none;border-radius:var(--rs);padding:11px 18px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
.bp:active{transform:scale(.96);background:var(--pd)}
.bp:disabled{background:var(--bd);color:var(--t3);cursor:not-allowed;transform:none}
.bg{background:none;border:1.5px solid var(--bd);border-radius:var(--rs);padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--t2);transition:all .15s}
/* ─ url input ─ */
.url-sec{padding:14px 16px;background:var(--sur);border-bottom:1px solid var(--bd)}
.url-row{display:flex;gap:8px}
.url-inp{flex:1;padding:10px 14px;border:1.5px solid var(--bd);border-radius:var(--rs);font-size:14px;outline:none;font-family:inherit;transition:border-color .2s;background:var(--bg)}
.url-inp:focus{border-color:var(--p);background:var(--sur)}
.spin{width:16px;height:16px;border:2px solid var(--p);border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
/* ─ tabs ─ */
.tabs{display:flex;padding:10px 16px 0;background:var(--sur);border-bottom:1px solid var(--bd)}
.tab{flex:1;padding:8px 4px 10px;text-align:center;font-size:12.5px;font-weight:600;color:var(--t3);cursor:pointer;border-bottom:2.5px solid transparent;transition:all .15s;font-family:'Noto Sans JP',sans-serif}
.tab.on{color:var(--p);border-bottom-color:var(--p)}
/* ─ video cards ─ */
.vlist{padding:12px 16px;display:flex;flex-direction:column;gap:10px}
.vcard{display:flex;gap:12px;background:var(--sur);border-radius:var(--r);padding:12px;box-shadow:var(--sh);cursor:pointer;border:none;width:100%;text-align:left;transition:all .15s}
.vcard:active{transform:scale(.98)}
.vth{width:96px;height:58px;border-radius:8px;flex-shrink:0;position:relative;overflow:hidden;background:var(--bd)}
.vth img{width:100%;height:100%;object-fit:cover}
.vtho{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.2)}
/* ─ banner ad ─ */
.bad-w{margin:8px 16px}
.bad-lbl{font-size:9px;color:var(--t3);background:var(--bd);padding:1px 4px;border-radius:3px;display:inline-block;margin-bottom:3px}
.bad{padding:10px 14px;background:linear-gradient(135deg,#FEF3C7,#FDE68A);border-radius:var(--rs);display:flex;align-items:center;justify-content:space-between;border:1px solid #FCD34D}
/* ─ youtube ─ */
.ytc{background:#000;aspect-ratio:16/9;width:100%;position:relative}
.ytc iframe{width:100%;height:100%;border:none}
/* ─ caption ─ */
.cap-nav{display:flex;align-items:center;gap:6px;padding:9px 14px;background:var(--sur);border-bottom:1px solid var(--bd)}
.cap-cnt{font-size:12px;color:var(--t3);font-weight:500;margin:0 auto}
.cap-panel{background:var(--sur);padding:15px}
.cap-en{font-size:15px;font-weight:600;color:var(--t);line-height:1.6;margin-bottom:12px;padding:12px;background:#F8FAFC;border-radius:var(--rs);border-left:3px solid var(--p)}
.slbl{font-size:10.5px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.chnk{padding:4px 10px;background:var(--cb);border:1px solid var(--cbb);border-radius:20px;font-size:12.5px;font-weight:500;color:#0369A1}
.mng{padding:4px 10px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:20px;font-size:11.5px;font-weight:500;color:#C2410C;font-family:'Noto Sans JP',sans-serif}
.csep{color:var(--t3);font-size:11px}
.ctrlbar{display:flex;align-items:center;gap:7px;padding:11px 14px;background:var(--sur);border-top:1px solid var(--bd);flex-wrap:wrap}
.cbtn{display:flex;align-items:center;gap:4px;padding:8px 11px;border-radius:var(--rs);font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:'Noto Sans JP',sans-serif;transition:all .15s}
.cbtn:active{transform:scale(.93)}
.cbtn-g{background:var(--bg);color:var(--t2);border:1px solid var(--bd)}
.cbtn-s{background:var(--al);color:#B45309;border:1px solid #FCD34D}
.cbtn-s.on{background:var(--a);color:#fff;border-color:var(--a)}
.cbtn-sh{background:var(--pl);color:var(--p);border:1px solid #BFDBFE}
/* ─ learn hub ─ */
.lhub{padding:16px;display:flex;flex-direction:column;gap:10px}
.lcard{display:flex;align-items:center;gap:14px;background:var(--sur);border-radius:var(--r);padding:16px;box-shadow:var(--sh);cursor:pointer;border:none;width:100%;text-align:left;transition:all .15s;position:relative}
.lcard:active{transform:scale(.97)}
.lcard-ico{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lcard-t{font-size:15px;font-weight:700;margin-bottom:2px;font-family:'Noto Sans JP',sans-serif}
.lcard-d{font-size:12px;color:var(--t3);font-family:'Noto Sans JP',sans-serif}
.lbdg{position:absolute;right:14px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:10px}
.lbn{background:#FEE2E2;color:var(--ng)}.lbd{background:#D1FAE5;color:#059669}.lbs{background:var(--al);color:#D97706}
.lsec{font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;padding:0 2px}
/* ─ test ─ */
.tscr{padding:16px;display:flex;flex-direction:column}
.tpb-w{height:4px;background:var(--bd);border-radius:2px;margin-bottom:18px;overflow:hidden}
.tpb{height:100%;background:var(--p);border-radius:2px;transition:width .3s ease}
.tqn{font-size:11px;font-weight:700;color:var(--t3);margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.tcbdg{font-size:10px;padding:2px 8px;border-radius:10px;background:var(--pl);color:var(--p);font-weight:600}
.tword{font-size:32px;font-weight:700;color:var(--p);text-align:center;padding:18px 0 6px;letter-spacing:1px}
.tpos{font-size:12px;color:var(--t3);text-align:center;margin-bottom:18px;font-style:italic}
.tq{font-size:17px;font-weight:700;color:var(--t);line-height:1.5;margin-bottom:18px;min-height:60px}
.opts{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
.opt{padding:14px 16px;border-radius:var(--rs);border:1.5px solid var(--bd);background:var(--sur);font-size:14px;font-weight:500;cursor:pointer;text-align:left;font-family:'Noto Sans JP',sans-serif;transition:all .15s;width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--t)}
.opt:disabled{cursor:not-allowed}
.opt.ok{border-color:var(--ok);background:#F0FDF4;color:#065F46}
.opt.ng{border-color:var(--ng);background:#FEF2F2;color:#991B1B}
.opt:not(:disabled):not(.ok):not(.ng):active{border-color:var(--p);background:var(--pl)}
.exbox{background:#FFFBEB;border:1px solid #FDE68A;border-radius:var(--rs);padding:13px;margin-bottom:14px}
.extxt{font-size:13px;color:#78350F;line-height:1.6;font-family:'Noto Sans JP',sans-serif}
/* ─ listening ─ */
.lplay{display:flex;flex-direction:column;align-items:center;padding:20px 0 18px;gap:12px}
.pbl{width:80px;height:80px;border-radius:50%;background:var(--p);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(37,99,235,.4);transition:all .2s}
.pbl:active{transform:scale(.93)}
.pbl.on{background:var(--ok);animation:pp 1.2s ease-in-out infinite}
@keyframes pp{0%,100%{box-shadow:0 4px 14px rgba(16,185,129,.4)}50%{box-shadow:0 4px 28px rgba(16,185,129,.7)}}
.lrev{background:var(--cb);border:1px solid var(--cbb);border-radius:var(--rs);padding:12px;margin-bottom:12px}
/* ─ result ─ */
.rscr{padding:20px;display:flex;flex-direction:column;align-items:center}
.rring{width:140px;height:140px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 18px;border:6px solid var(--p);background:var(--sur);box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}
.rnum{font-size:40px;font-weight:700;color:var(--p);line-height:1}
.rden{font-size:14px;color:var(--t3)}
.rstars{display:flex;gap:4px;margin-bottom:14px}
.rw{background:var(--sur);border-radius:var(--rs);padding:12px;box-shadow:var(--sh);border-left:3px solid var(--ng);margin-bottom:8px}
/* ─ analysis ─ */
.ascr{padding:16px;display:flex;flex-direction:column;gap:14px}
.tcard{background:linear-gradient(135deg,#1D4ED8,#2563EB,#3B82F6);border-radius:var(--r);padding:20px;color:#fff;position:relative;overflow:hidden}
.tcard::before{content:'';position:absolute;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.06);top:-30px;right:-30px}
.sc{background:var(--sur);border-radius:var(--r);padding:16px;box-shadow:var(--sh)}
.sc-t{font-size:13px;font-weight:700;color:var(--t2);margin-bottom:12px;display:flex;align-items:center;gap:6px;font-family:'Noto Sans JP',sans-serif}
.str{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.str-l{font-size:12px;color:var(--t2);width:72px;flex-shrink:0;font-family:'Noto Sans JP',sans-serif}
.str-bw{flex:1;height:8px;background:var(--bg);border-radius:4px;overflow:hidden}
.str-b{height:100%;border-radius:4px;transition:width .6s ease}
.str-p{font-size:12px;font-weight:700;width:40px;text-align:right;flex-shrink:0}
.lvgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:10px}
.lvi{display:flex;flex-direction:column;align-items:center;padding:8px 4px;border-radius:8px;border:1.5px solid var(--bd);background:var(--bg);gap:3px}
.lvi.on{border-width:2px}
/* ─ saved ─ */
.slist{padding:12px 16px;display:flex;flex-direction:column;gap:8px}
.scard{background:var(--sur);border-radius:var(--r);padding:13px;box-shadow:var(--sh);display:flex;gap:10px;align-items:flex-start}
/* ─ gacha ─ */
.gcon{padding:20px;text-align:center}
.gbc{width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,#E0F2FE,#BAE6FD);border:3px solid #7DD3FC;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 4px 8px rgba(0,0,0,.1),0 4px 12px rgba(0,0,0,.15)}
.gbi{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:14px}
.gb{width:22px;height:22px;border-radius:50%;box-shadow:inset -2px -2px 4px rgba(0,0,0,.2)}
.gbase{width:100px;height:28px;background:linear-gradient(180deg,#EF4444,#DC2626);border-radius:8px;margin:0 auto 18px;display:flex;align-items:center;justify-content:center}
.ghole{width:18px;height:18px;border-radius:50%;background:#991B1B}
.gpts{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:var(--al);border-radius:20px;margin-bottom:18px;font-weight:700;color:#92400E;font-size:15px}
.gres{padding:18px;background:linear-gradient(135deg,#FEF3C7,#FDE68A);border-radius:var(--r);margin-bottom:18px;animation:pop .4s ease}
@keyframes pop{0%{transform:scale(.8);opacity:0}80%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
/* ─ settings ─ */
.stlist{padding:14px;display:flex;flex-direction:column;gap:10px}
.stst{font-size:10.5px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;padding:0 4px 2px}
.sti{background:var(--sur);border-radius:var(--r);padding:13px 15px;display:flex;align-items:center;justify-content:space-between;box-shadow:var(--sh)}
.tog{width:44px;height:26px;border-radius:13px;border:none;cursor:pointer;position:relative;transition:background .2s}
.tog.on{background:var(--p)}.tog.off{background:var(--bd)}
.tog::after{content:'';position:absolute;width:20px;height:20px;border-radius:50%;background:#fff;top:3px;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.tog.on::after{left:21px}.tog.off::after{left:3px}
/* ─ modals ─ */
.mov{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;display:flex;flex-direction:column;justify-content:flex-end}
.msh{background:var(--sur);border-radius:20px 20px 0 0;padding:22px 20px 40px;animation:su .3s ease;max-height:90vh;overflow-y:auto}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
.mhnd{width:40px;height:4px;background:var(--bd);border-radius:2px;margin:0 auto 18px}
.micbtn{width:70px;height:70px;border-radius:50%;background:var(--p);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;transition:all .2s}
.micbtn.rec{background:var(--ng);animation:mp 1s infinite}
@keyframes mp{0%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}70%{box-shadow:0 0 0 20px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}
.sdbox{text-align:center;padding:18px;background:var(--bg);border-radius:var(--r);margin-bottom:14px}
.rdbox{background:linear-gradient(135deg,#1e293b,#334155);border-radius:var(--r);padding:18px;margin-bottom:14px;text-align:center}
.rpb{height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden;margin:10px 0}
.rpbb{height:100%;background:var(--a);border-radius:2px;transition:width .1s linear}
/* ─ affiliate ─ */
.afcard{border-radius:var(--r);padding:14px;margin:0 16px 12px;border:1.5px solid}
.afbdg{font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;display:inline-block;margin-bottom:6px}
.afcta{display:block;text-align:center;padding:9px;border-radius:var(--rs);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:'Noto Sans JP',sans-serif;border:none;width:100%}
/* ─ misc ─ */
.empty{text-align:center;padding:56px 20px;color:var(--t3)}
.divhr{height:8px;background:var(--bg)}
.toast{position:fixed;top:66px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,.9);color:#fff;padding:9px 18px;border-radius:20px;font-size:13px;font-weight:600;z-index:300;animation:fio 2.5s ease forwards;white-space:nowrap;font-family:'Noto Sans JP',sans-serif}
@keyframes fio{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}75%{opacity:1}100%{opacity:0}}

/* ─ news hub ─ */
.nhub{padding:16px;display:flex;flex-direction:column;gap:14px}
.nsvc{background:var(--sur);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh)}
.nsvc-hd{padding:16px;display:flex;align-items:center;gap:12px}
.nsvc-ico{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:22px}
.nsvc-t{font-size:15px;font-weight:700;font-family:'Noto Sans JP',sans-serif;margin-bottom:2px}
.nsvc-d{font-size:12px;color:var(--t3);font-family:'Noto Sans JP',sans-serif}
.next{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid var(--bd);cursor:pointer;border:none;background:none;width:100%;font-family:'Noto Sans JP',sans-serif;font-size:13px;font-weight:600;color:var(--p);transition:background .15s}
.next:hover{background:var(--pl)}
.ncat-tabs{display:flex;gap:6px;padding:10px 16px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid var(--bd);background:var(--sur);flex-shrink:0}
.ncat-tabs::-webkit-scrollbar{display:none}
.ncat{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:none;white-space:nowrap;font-family:'Noto Sans JP',sans-serif;transition:all .15s}
.ncat.on{background:var(--p);color:#fff}
.ncat.off{background:var(--bd);color:var(--t2)}
.nacard{background:var(--sur);border-radius:var(--r);padding:14px;box-shadow:var(--sh);cursor:pointer;border:none;width:100%;text-align:left;transition:all .15s}
.nacard:active{transform:scale(.98)}
.nacard-t{font-size:14px;font-weight:700;color:var(--t);line-height:1.4;margin-bottom:6px}
.nacard-d{font-size:12px;color:var(--t2);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.nacard-m{font-size:11px;color:var(--t3);margin-top:6px;display:flex;align-items:center;gap:8px}
/* ─ BBC reader ─ */
.rd-wrap{display:flex;flex-direction:column;overflow:hidden;flex:1;min-height:0}
.rd-art{flex:1;overflow-y:auto;padding:16px;background:var(--sur)}
.rd-art::-webkit-scrollbar{display:none}
.rd-title{font-size:18px;font-weight:700;color:var(--t);line-height:1.4;margin-bottom:8px;border-bottom:2px solid var(--bd);padding-bottom:10px}
.rd-meta{font-size:11px;color:var(--t3);margin-bottom:14px;display:flex;align-items:center;gap:6px}
.rd-para{font-size:15px;color:var(--t);line-height:1.9;margin-bottom:14px;word-break:break-word}
.rd-sent{cursor:pointer;border-radius:3px;padding:1px 0;transition:background .12s;display:inline}
.rd-sent:hover{background:rgba(37,99,235,.07)}
.rd-sent.hi{background:#DBEAFE}
.rd-word{cursor:pointer;border-radius:2px;padding:0 1px;transition:background .08s;display:inline}
.rd-word:hover{background:rgba(245,158,11,.15)}
.rd-word.hi{background:#FEF3C7;font-weight:600}
/* ─ translation panel ─ */
.tp{background:var(--sur);border-top:2px solid var(--bd);flex-shrink:0;min-height:110px;max-height:44vh;overflow-y:auto}
.tp::-webkit-scrollbar{display:none}
.tp-bar{display:flex;align-items:center;gap:7px;padding:8px 12px;border-bottom:1px solid var(--bd);background:var(--bg);overflow-x:auto;scrollbar-width:none}
.tp-bar::-webkit-scrollbar{display:none}
.tpbtn{display:flex;align-items:center;gap:4px;padding:6px 11px;border-radius:var(--rs);font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:'Noto Sans JP',sans-serif;transition:all .15s;white-space:nowrap;flex-shrink:0}
.tpbtn-p{background:var(--p);color:#fff}
.tpbtn-g{background:none;border:1.5px solid var(--bd);color:var(--t2)}
.tpbtn-g.on{border-color:var(--ok);color:var(--ok);background:#F0FDF4}
.tp-body{padding:13px 15px}
.tp-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;color:var(--t3);font-family:'Noto Sans JP',sans-serif;gap:5px;text-align:center}
.wm-box{background:#FFFBEB;border:1px solid #FDE68A;border-radius:var(--rs);padding:13px}
.wm-word{font-size:20px;font-weight:700;color:var(--t);margin-bottom:1px}
.wm-pos{font-size:11px;color:var(--t3);margin-bottom:7px;font-style:italic}
.wm-def{font-size:14px;font-weight:600;color:#92400E;margin-bottom:6px;font-family:'Noto Sans JP',sans-serif}
.wm-ex{font-size:12px;color:var(--t2);font-style:italic;border-top:1px solid #FDE68A;padding-top:7px;margin-top:3px}
.st-box{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:var(--rs);padding:13px}
.st-en{font-size:13px;color:var(--t2);margin-bottom:8px;line-height:1.5;font-style:italic}
.st-jp{font-size:14px;font-weight:600;color:#065F46;line-height:1.6;font-family:'Noto Sans JP',sans-serif}
.ft-box{font-size:14px;color:var(--t);line-height:1.9;font-family:'Noto Sans JP',sans-serif;white-space:pre-wrap}
.tp-ld{display:flex;align-items:center;gap:8px;padding:16px;color:var(--t3);font-family:'Noto Sans JP',sans-serif;font-size:13px}

/* ─ parallel reader ─ */
.pr-wrap{display:flex;flex-direction:column;flex:1;overflow:hidden;min-height:0}
.pr-toolbar{display:flex;align-items:center;gap:6px;padding:8px 12px;background:var(--sur);border-bottom:1px solid var(--bd);flex-shrink:0;overflow-x:auto;scrollbar-width:none}
.pr-toolbar::-webkit-scrollbar{display:none}
.pr-half{flex:1;overflow-y:auto;min-height:0;position:relative}
.pr-half::-webkit-scrollbar{display:none}
.pr-half-en{background:#FAFBFF;border-bottom:3px solid var(--p)}
.pr-half-jp{background:#FFFDF7}
.pr-half-label{position:sticky;top:0;z-index:10;padding:5px 14px;font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;display:flex;align-items:center;justify-content:space-between}
.pr-half-label-en{background:rgba(239,246,255,.96);color:var(--p);border-bottom:1px solid var(--cbb)}
.pr-half-label-jp{background:rgba(255,253,247,.96);color:#92400E;border-bottom:1px solid #FDE68A}
.pr-text{padding:14px 16px;font-size:15px;line-height:1.95;color:var(--t);word-break:break-word;white-space:pre-wrap;font-family:'DM Sans','Noto Sans JP',sans-serif}
.pr-text-jp{font-family:'Noto Sans JP',sans-serif;color:var(--t2)}
.pr-divider{height:3px;background:linear-gradient(90deg,var(--p),var(--pu));flex-shrink:0}
.pr-word{cursor:pointer;border-radius:3px;padding:1px 2px;transition:background .1s;display:inline}
.pr-word:hover{background:rgba(245,158,11,.18)}
.pr-word.sel{background:#FEF3C7;outline:2px solid #F59E0B;border-radius:3px}
.pr-sent{cursor:pointer;border-radius:3px;transition:background .12s;display:inline}
.pr-sent:hover{background:rgba(37,99,235,.07)}
.pr-sent.sel{background:#DBEAFE}
.pr-sync-btn{display:flex;align-items:center;gap:4px;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:none;font-family:'Noto Sans JP',sans-serif;transition:all .15s;white-space:nowrap;flex-shrink:0}
.pr-sync-on{background:var(--p);color:#fff}
.pr-sync-off{background:var(--bd);color:var(--t2)}
.pr-action-btn{display:flex;align-items:center;gap:3px;padding:5px 9px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:'Noto Sans JP',sans-serif;white-space:nowrap;flex-shrink:0;transition:all .15s}
/* paste input */
.pr-input-wrap{padding:16px;display:flex;flex-direction:column;gap:12px}
.pr-input-label{font-size:12px;font-weight:700;color:var(--t2);margin-bottom:5px;display:flex;align-items:center;gap:6px;font-family:'Noto Sans JP',sans-serif}
.pr-textarea{width:100%;padding:12px 14px;border:1.5px solid var(--bd);border-radius:var(--rs);font-size:14px;line-height:1.7;outline:none;font-family:'DM Sans','Noto Sans JP',sans-serif;resize:none;background:var(--bg);transition:border-color .2s;color:var(--t)}
.pr-textarea:focus{border-color:var(--p);background:var(--sur)}
.pr-textarea.jp{font-family:'Noto Sans JP',sans-serif;color:var(--t2)}
/* save popup */
.pr-popup{position:fixed;bottom:70px;left:50%;transform:translateX(-50%);background:var(--sur);border-radius:var(--r);box-shadow:0 8px 24px rgba(0,0,0,.15);padding:14px 16px;z-index:150;width:calc(100% - 32px);max-width:398px;border:1.5px solid var(--bd);animation:slideUpPop .2s ease}
@keyframes slideUpPop{from{transform:translateX(-50%) translateY(12px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
/* word shooter game */
.ws-wrap{display:flex;flex-direction:column;height:calc(100vh - 52px);overflow:hidden;background:linear-gradient(180deg,#0F172A 0%,#1E293B 100%)}
.ws-header{padding:10px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.ws-score{font-size:18px;font-weight:700;color:#fff}
.ws-lives{display:flex;gap:4px}
.ws-field{flex:1;position:relative;overflow:hidden}
.ws-word{position:absolute;display:flex;flex-direction:column;align-items:center;gap:2px;animation:fall linear forwards}
@keyframes fall{from{top:-80px}to{top:105%}}
.ws-word-en{background:rgba(37,99,235,.85);border:1.5px solid #60A5FA;border-radius:8px;padding:6px 14px;font-size:14px;font-weight:700;color:#fff;white-space:nowrap;box-shadow:0 2px 10px rgba(37,99,235,.4)}
.ws-word-jp{font-size:10px;color:#94A3B8;font-family:'Noto Sans JP',sans-serif;white-space:nowrap}
.ws-input-area{padding:12px 16px;background:rgba(15,23,42,.8);flex-shrink:0;border-top:1px solid rgba(255,255,255,.1)}
.ws-input{width:100%;padding:12px 16px;border-radius:var(--rs);border:2px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:16px;outline:none;font-family:'DM Sans',sans-serif;text-align:center}
.ws-input::placeholder{color:rgba(255,255,255,.3)}
.ws-input:focus{border-color:var(--p);background:rgba(37,99,235,.15)}
.ws-hit{animation:hit .3s ease forwards}
@keyframes hit{0%{transform:scale(1.3);opacity:1}100%{transform:scale(0);opacity:0}}
.ws-result{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;padding:24px}

/* ─ word shooter v2 ─ */
.ws-hp-bar-wrap{padding:0 16px 8px;flex-shrink:0}
.ws-hp-track{height:10px;background:rgba(255,255,255,.12);border-radius:5px;overflow:hidden}
.ws-hp-fill{height:100%;border-radius:5px;transition:width .4s ease}
.ws-skill-bar{display:flex;gap:6px;padding:4px 16px 8px;flex-shrink:0}
.ws-skill-btn{flex:1;padding:7px 4px;border-radius:8px;border:none;cursor:pointer;font-size:10px;font-weight:700;font-family:'Noto Sans JP',sans-serif;transition:all .15s;text-align:center}
.ws-skill-btn:disabled{opacity:.35;cursor:not-allowed}
.ws-skill-btn.ready{animation:skillPulse 2s ease-in-out infinite}
@keyframes skillPulse{0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,.4)}50%{box-shadow:0 0 0 6px rgba(251,191,36,0)}}
.ws-coin-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(251,191,36,.2);border-radius:12px;padding:3px 10px;font-size:12px;font-weight:700;color:#FCD34D}
.ws-miss-flash{position:absolute;inset:0;background:rgba(239,68,68,.25);pointer-events:none;animation:missFlash .4s ease forwards}
@keyframes missFlash{0%{opacity:1}100%{opacity:0}}
.ws-wrong-popup{position:absolute;background:rgba(15,23,42,.95);border:1px solid #EF4444;border-radius:10px;padding:10px 14px;z-index:50;pointer-events:none;animation:popIn .2s ease}
@keyframes popIn{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}
.ws-hint-tag{background:rgba(99,102,241,.4);border:1px solid #818CF8;border-radius:6px;padding:3px 8px;font-size:10px;color:#C7D2FE;margin-top:3px;display:block}
/* ─ gacha skill ─ */
.skill-card{background:var(--sur);border-radius:var(--r);padding:14px 16px;box-shadow:var(--sh);display:flex;align-items:center;gap:12px;margin-bottom:8px;border-left:3px solid}

/* ─ shooter 4択 v3 ─ */
.ws-choices{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 14px 14px;flex-shrink:0}
.ws-choice{padding:11px 8px;border-radius:10px;border:2px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:'Noto Sans JP',sans-serif;text-align:center;transition:all .15s;line-height:1.3}
.ws-choice:active{transform:scale(.95)}
.ws-choice.correct{border-color:#10B981;background:rgba(16,185,129,.25);animation:correctFlash .4s ease}
.ws-choice.wrong{border-color:#EF4444;background:rgba(239,68,68,.2)}
@keyframes correctFlash{0%{transform:scale(1.1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
.ws-active-count{position:absolute;top:8px;right:8px;background:rgba(255,255,255,.1);border-radius:12px;padding:3px 8px;font-size:11px;color:#94A3B8}
/* ─ equip screen ─ */
.eq-wrap{background:linear-gradient(180deg,#0F172A,#1E293B);min-height:100%;padding:20px 16px;display:flex;flex-direction:column;gap:14px}
.eq-title{font-size:20px;font-weight:700;color:#fff;text-align:center}
.eq-sub{font-size:13px;color:#64748B;text-align:center;font-family:'Noto Sans JP',sans-serif}
.eq-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.eq-card{background:rgba(255,255,255,.05);border:2px solid rgba(255,255,255,.1);border-radius:12px;padding:14px;cursor:pointer;transition:all .2s;text-align:center}
.eq-card.equipped{border-color:#F59E0B;background:rgba(245,158,11,.12)}
.eq-card.disabled{opacity:.4;cursor:not-allowed}
.eq-icon{font-size:28px;margin-bottom:6px}
.eq-name{font-size:13px;font-weight:700;color:#fff;margin-bottom:3px;font-family:'Noto Sans JP',sans-serif}
.eq-desc{font-size:11px;color:#64748B;font-family:'Noto Sans JP',sans-serif}
.eq-count{font-size:10px;font-weight:700;background:rgba(245,158,11,.3);color:#FCD34D;border-radius:10px;padding:2px 7px;display:inline-block;margin-top:4px}

@keyframes recProgress{from{width:0}to{width:100%}}

/* ─ wallet / economy ─ */
.wallet-bar{display:flex;align-items:center;gap:8px;padding:8px 16px;background:linear-gradient(90deg,#0F172A,#1E293B);flex-shrink:0}
.wallet-item{display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.08);border-radius:12px;padding:4px 10px;font-size:12px;font-weight:700;color:#fff;white-space:nowrap}
.wallet-coin{color:#FCD34D}
.wallet-ticket{color:#60A5FA}
.unlock-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:250;display:flex;align-items:flex-end}
.unlock-modal{background:var(--sur);border-radius:20px 20px 0 0;padding:24px 20px 40px;width:100%;animation:su .25s ease}
.unlock-price{display:flex;align-items:center;justify-content:center;gap:12px;margin:14px 0}
.unlock-price-opt{flex:1;padding:12px;border-radius:10px;border:2px solid var(--bd);text-align:center;cursor:pointer;transition:all .15s}
.unlock-price-opt.selected{border-color:var(--p);background:var(--pl)}
.unlock-price-opt:disabled{opacity:.4;cursor:not-allowed}
.unlock-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700}
.unlock-badge-free{background:#D1FAE5;color:#065F46}
.unlock-badge-coin{background:#FEF3C7;color:#92400E}
.unlock-badge-ticket{background:#DBEAFE;color:#1D4ED8}
.unlock-badge-expired{background:#FEE2E2;color:#991B1B}
.daily-bar{display:flex;align-items:center;gap:6px;padding:6px 16px;background:#F0F9FF;border-bottom:1px solid var(--cbb);font-size:11px;color:var(--p);font-family:'Noto Sans JP',sans-serif}

/* ─ SNS / ranking ─ */
.rank-row{display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--sur);border-radius:var(--rs);margin-bottom:6px;box-shadow:var(--sh)}
.rank-no{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.rank-no-1{background:#F59E0B;color:#fff}
.rank-no-2{background:#94A3B8;color:#fff}
.rank-no-3{background:#B45309;color:#fff}
.rank-no-n{background:var(--bg);color:var(--t3)}
.rank-nick{font-size:14px;font-weight:700;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rank-score{font-size:13px;font-weight:700;color:var(--p)}
.nick-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px}
.nick-modal{background:var(--sur);border-radius:var(--r);padding:24px 20px;width:100%;max-width:380px}
.trans-share-btn{display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:12px;border:1px solid var(--bd);background:none;cursor:pointer;font-size:11px;color:var(--t3);font-family:'Noto Sans JP',sans-serif;transition:all .15s}
.trans-share-btn:hover{border-color:var(--p);color:var(--p)}
`;

// ══ MAIN APP ══════════════════════════════════════════════════════
// ErrorBoundaryでラップしてデフォルトエクスポート
function EigoMasterInner() {
  // ── Auth state（Phase4: Google OAuth）──────────────────────
  const [authUser,    setAuthUser]    = useState(null);  // {id, email, name, avatar_url}
  const [authLoading, setAuthLoading] = useState(true);  // 初期認証チェック中

  // ── nav & screens
  const [navTab, setNavTab] = useState("home");
  const [screen, setScreen] = useState("main"); // main|video|wordTest|grammarTest|listeningTest|analysis
  const [homeTab,setHomeTab]= useState("all");
  // video
  const [curVid, setCurVid] = useState(null);
  const [capIdx, setCapIdx] = useState(0);
  const [videos, setVideos] = useState(GLOBAL_VIDEOS);
  const [urlIn,  setUrlIn]  = useState("");
  const [urlLd,  setUrlLd]  = useState(false);
  const [myList, setMyList] = useState([]);
  const [saved,  setSaved]  = useState<{
    id:string; english:string; chunks:string[]; meaning:string[];
    videoTitle?:string|null; savedAt:number; _dbId?:string;
  }[]>(() => {
    try {
      const s = typeof window !== 'undefined' && localStorage.getItem('em_saved');
      if (s) return JSON.parse(s);
    } catch { /* ignore */ }
    return [];
  });
  const [affVis, setAffVis] = useState(true);
  const [sett,   setSett]   = useState({affOn:true,rewOn:true});
  // shadowing
  const [shwShow,setShwShow]= useState(false);
  const [shwPh,  setShwPh]  = useState("idle"); // idle|rec|score
  const [shwSc,    setShwSc]    = useState(0);
  const [shwTranscript, setShwTranscript] = useState(''); // 認識されたテキスト
  const [shwWords, setShwWords] = useState(0); // マッチした単語数
  const [shwTotal, setShwTotal] = useState(0); // 総単語数
  const [shwEngine, setShwEngine] = useState<'webSpeech'|'dummy'>('dummy'); // 使用エンジン
  // reward ad
  const [rewShow,setRewShow]= useState(false);
  const [rewPct, setRewPct] = useState(0);
  const [rewCb,  setRewCb]  = useState(null);
  // points / gacha
  const [pts,   setPts]  = useState<number>(() => {
    try {
      const s = typeof window !== 'undefined' && localStorage.getItem('em_pts');
      if (s) return Number(s) || 120;
    } catch { /* ignore */ }
    return 120;
  });
  const [gRes,  setGRes] = useState(null);
  const [gHist, setGHist]= useState([]);
  // ── Parallel Reader state ──
  const [prMode,    setPrMode]    = useState('input'); // 'input'|'read'
  const [prEnText,  setPrEnText]  = useState('');
  const [prJpText,  setPrJpText]  = useState('');
  const [prSyncScroll, setPrSyncScroll] = useState(false);
  const [prSelWord, setPrSelWord] = useState(null);   // {word, index}
  const [prSelSent, setPrSelSent] = useState(null);   // {sentence, index}
  const [prPopup,   setPrPopup]   = useState(false);
  const [prMemo,    setPrMemo]    = useState('');
  const [prSaved,   setPrSaved]   = useState([]);     // [{id,type,word,meaning,memo,date}]
  // Refs for sync scroll
  const prEnRef  = typeof window !== 'undefined' ? { current: null } : { current: null };
  const prJpRef  = typeof window !== 'undefined' ? { current: null } : { current: null };
  // ── Word Shooter state v2 ──
  const [wsActive,    setWsActive]    = useState(false);
  const [wsWords,     setWsWords]     = useState<{id:string;en:string;jp:string;x:number;duration:number;startTime:number;hint?:string}[]>([]);
  const [wsInput,     setWsInput]     = useState('');
  const [wsScore,     setWsScore]     = useState(0);
  const [wsLives,     setWsLives]     = useState(5);       // ❤️ HP（最大5）
  const [wsMaxLives,  setWsMaxLives]  = useState(5);
  const [wsHits,      setWsHits]      = useState<string[]>([]);
  const [wsPhase,     setWsPhase]     = useState<'idle'|'play'|'result'>('idle');
  const [wsCombo,     setWsCombo]     = useState(0);
  const [wsCoins,     setWsCoins]     = useState(0);       // 🪙 コイン
  const [wsWrong,     setWsWrong]     = useState<{id:string;en:string;jp:string}|null>(null); // 不正解時表示
  const [wsFlash,     setWsFlash]     = useState(false);   // ダメージフラッシュ
  const [wsSlowed,    setWsSlowed]    = useState(false);   // スロースキル
  const [wsSkills,    setWsSkills]    = useState({         // スキル残数
    slow: 1,    // スロー（落下速度↓）
    hint: 1,    // ヒント（先頭1文字表示）
    heal: 1,    // HP回復（+1）
  });
  const [wsQuizWords, setWsQuizWords] = useState<{en:string;jp:string}[]>([]);
  const [wsPhaseScreen, setWsPhaseScreen] = useState<'equip'|'play'|'result'>('equip'); // 装備→プレイ→結果
  const [wsEquipped, setWsEquipped] = useState<string[]>([]); // 装備中スキル名 (max3)
  const [wsCurrentWord, setWsCurrentWord] = useState<{id:string;en:string;jp:string;x:number}|null>(null); // 現在落下中の単語
  const [wsChoices, setWsChoices] = useState<string[]>([]); // 4択の選択肢(jp)
  const [wsChoiceResult, setWsChoiceResult] = useState<{sel:string;correct:string}|null>(null); // 選択結果
  const [wsWordQueue, setWsWordQueue] = useState<{en:string;jp:string}[]>([]); // 残り問題キュー
  const [wsStage, setWsStage] = useState(1); // ステージ番号(1:1個, 2以降:2個同時)
  // ガチャ在庫（スキルチケット）
  const [gachaSkillStock, setGachaSkillStock] = useState<Record<string,number>>({shield:0,slow:0,hint:0,heal:0});
  // ── ニュース state ──
  const [newsScreen, setNewsScreen] = useState('hub'); // hub|bbcList|bbcReader
  const [bbcFeed,    setBbcFeed]    = useState('world');
  const [bbcArticles,setBbcArticles]= useState([]);
  const [bbcLoading, setBbcLoading] = useState(false);
  const [curArticle, setCurArticle] = useState(null);
  // BBC Reader interactive state
  const [selWord,    setSelWord]    = useState(null); // {word, sentence, index}
  const [selSent,    setSelSent]    = useState(null); // {sentence, index}
  const [wordData,   setWordData]   = useState(null); // {meaning, pos, example}
  const [sentData,   setSentData]   = useState(null); // 翻訳文字列
  const [fullTrans,  setFullTrans]  = useState('');
  const [showFull,   setShowFull]   = useState(false);
  const [transLoading, setTransLoading] = useState(false);
  // ── AI処理状態 ──
  const [captionCache, setCaptionCache] = useState({}); // videoId → captions[]
  const [proc, setProc] = useState({
    active: false,      // 処理中か
    step: '',           // 'info'|'transcript'|'ai'|'manual'|'saving'|'done'
    pct: 0,             // 進捗 0-100
    videoId: null,      // 処理中のvideoId
    videoTitle: '',     // 処理中の動画タイトル（表示用）
    needManual: false,  // 手動入力が必要か
  });
  const [manualText, setManualText] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  // test results (persistent)
  const [TR, setTR] = useState<{
    word: {date:string;correct:number;total:number;score?:number}[];
    grammar: {date:string;correct:number;total:number;score?:number}[];
    listening: {date:string;correct:number;total:number;score?:number}[];
    shadowing: {date:string;score:number;correct?:number;total?:number}[];
  }>(() => {
    // localStorage から復元（Supabase未設定時のフォールバック）
    try {
      const s = typeof window !== 'undefined' && localStorage.getItem('em_tr');
      if (s) return JSON.parse(s);
    } catch { /* ignore */ }
    return {word:[],grammar:[],listening:[],shadowing:[]};
  });
  // active test session
  const [tQs,  setTQs]  = useState([]);
  const [tIdx, setTIdx] = useState(0);
  const [tAns, setTAns] = useState([]);
  const [tSel, setTSel] = useState(null);
  const [tPh,  setTPh]  = useState("quiz"); // quiz|result
  const [lisN, setLisN] = useState(0);
  const [play, setPlay] = useState(false);
  // toast
  const [toast,setToast]= useState(null);
  const tmr = useRef(null);
  const t$ = useCallback(m=>{setToast(m);if(tmr.current)clearTimeout(tmr.current);tmr.current=setTimeout(()=>setToast(null),2500);},[]);

  // ── Supabase: ユーザーID ────────────────────────────────────
  // user_id: ログイン済みは auth.uid, 未ログインはlocalStorage UUID
  const [userId] = useState(() => getUserId());

  // ── ウォレット state ─────────────────────────────────────────
  const [wallet, setWallet] = useState<{
    coins: number;
    video_tickets: number;
    quiz_tickets: number;
    translation_tickets: number;
    gacha_tickets: number;
    daily_earned_coins: number;
  }>(() => {
    try {
      const s = typeof window !== 'undefined' && localStorage.getItem('em_wallet');
      if (s) return JSON.parse(s);
    } catch { /* ignore */ }
    return { coins: 0, video_tickets: 0, quiz_tickets: 0, translation_tickets: 0, gacha_tickets: 0, daily_earned_coins: 0 };
  });
  const [unlockModal, setUnlockModal] = useState<{
    visible: boolean;
    title: string;
    coinCost: number;
    ticketType: string;
    onConfirm: (payWith: 'coin'|'ticket'|'free') => void;
  } | null>(null);
  const [dailyGachaLeft, setDailyGachaLeft] = useState(3);
  // ── SNS state ────────────────────────────────────────────────
  const [myProfile, setMyProfile]   = useState<{nickname:string;avatar_emoji:string}|null>(null);
  const [rankingTab, setRankingTab] = useState<'translation'|'learning'>('learning');
  const [rankingData, setRankingData] = useState<any[]>([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [showNickEdit, setShowNickEdit] = useState(false);
  const [nickInput, setNickInput] = useState('');
  const [transShared, setTransShared] = useState<{[key:string]: any[]}>({});
  const [lastGachaRewardType, setLastGachaRewardType] = useState<string | undefined>(undefined);
  const [dbReady, setDbReady] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);

  // ── Supabase: 初回データロード ──────────────────────────────
  // ── Auth初期化: URLハッシュまたは保存済みセッションから復元 ──
  useEffect(() => {
    const initAuth = async () => {
      // OAuthコールバック: URLハッシュにtokenがあればセッション確立
      const hashSession = supabaseAuth.getSessionFromHash();
      if (hashSession?.token) {
        const user = await supabaseAuth.getUser(hashSession.token);
        if (user) {
          localStorage.setItem('sb_user', JSON.stringify(user));
          setAuthUser({
            id:         user.id,
            email:      user.email,
            name:       user.user_metadata?.full_name || user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
          });
          console.log('[Auth] Googleログイン成功:', user.email);
        }
        // URLハッシュをクリア
        history.replaceState(null, '', window.location.pathname);
      } else {
        // 保存済みセッションを確認
        const stored = supabaseAuth.getStoredSession();
        if (stored?.token) {
          const user = await supabaseAuth.getUser(stored.token);
          if (user) {
            setAuthUser({
              id:         user.id,
              email:      user.email,
              name:       user.user_metadata?.full_name || user.email,
              avatar_url: user.user_metadata?.avatar_url || null,
            });
            console.log('[Auth] セッション復元:', user.email);
          } else {
            // トークン期限切れ
            localStorage.removeItem('sb_access_token');
          }
        }
      }
      setAuthLoading(false);
    };
    initAuth();
  }, []);

  // プロフィール初回ロード
  useEffect(() => {
    loadProfile().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!SB_READY) { setDbLoading(false); return; }
    const load = async () => {
      try {
        const uid = `user_id=eq.${userId}`;
        const [sLines, myL, tRes, uPts, uVids] = await Promise.all([
          sbFrom("saved_items").select(`*&${uid}&item_type=eq.caption&order=saved_at.desc`),
          fetch('/api/list/get').then(r => r.json()),
          sbFrom("learning_logs").select(`*&${uid}&order=created_at.asc`),
          sbFrom("user_points").select(`*&${uid}`),
          sbFrom("user_videos").select(`*&${uid}&order=added_at.asc`),
        ]);

        // saved_items から保存済み文を復元（Phase3: 永続化）
        if (Array.isArray(sLines) && sLines.length > 0) {
          setSaved(sLines.map(r => {
            const c = r.content || {};
            return {
              id: c.id || r.id,
              english: c.english || '',
              chunks: c.chunks || [],
              meaning: c.meaning || [],
              videoTitle: c.videoTitle || null,
              savedAt: r.saved_at || Date.now(),
              _dbId: r.id,
            };
          }).filter(r => r.english));
          console.log('[DB] saved_items 復元:', sLines.length, '件');
        }

        // my playlist
        if (Array.isArray(myL)) {
          setMyList(myL.map((r: any) => {
            const item = typeof r === 'object' && r ? r : {};
            const videoId = typeof item.video_id === 'string' ? item.video_id : '';
            const rawThumbnail = typeof item.thumbnail === 'string' ? item.thumbnail : '';
            const thumbnail = rawThumbnail.trim()
              ? rawThumbnail.trim()
              : videoId
                ? `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`
                : DEFAULT_THUMBNAIL;
            return {
              videoId,
              title: typeof item.title === 'string' ? item.title : '',
              channelTitle: typeof item.channel_title === 'string' ? item.channel_title : '',
              thumbnail,
              chunks: Array.isArray(item.chunks) ? item.chunks : [],
              originalText: typeof item.original_text === 'string' ? item.original_text : '',
            };
          }).filter(item => item.videoId || item.title || item.channelTitle));
        } else {
          setMyList([]);
        }

        // learning_logs から学習結果を復元（Phase3: 永続化）
        if (Array.isArray(tRes) && tRes.length > 0) {
          const grouped = { word:[], grammar:[], listening:[], shadowing:[] };
          tRes.forEach(r => {
            const key = r.type || r.test_type; // 両フィールドに対応
            if (!grouped[key]) return;
            grouped[key].push({
              date: r.created_at || r.test_date,
              correct: r.correct || 0,
              total: r.total || 0,
              score: r.score || 0,
            });
          });
          setTR(grouped);
          console.log('[DB] learning_logs 復元:', Object.entries(grouped).map(([k,v]) => `${k}:${v.length}`).join(' '));
        }

        // points
        if (Array.isArray(uPts) && uPts.length > 0) {
          setPts(uPts[0].points);
        }

        // user_videos: グローバル動画と重複しないものをマージ
        if (Array.isArray(uVids) && uVids.length > 0) {
          const userVids = uVids.map(r => ({
            videoId: r.video_id,
            title: r.title,
            channelTitle: r.channel_title,
            thumbnail: r.thumbnail,
            aiReady: false,
          }));
          setVideos(prev => {
            const existingIds = new Set(prev.map(v => v.videoId));
            const newOnes = userVids.filter(v => !existingIds.has(v.videoId));
            return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
          });
        }

        setDbReady(true);
      } catch (e) {
        console.error("DB load error:", e);
        setMyList([]);
      } finally {
        setDbLoading(false);
      }
    };
    load();
  }, [userId]);

  // ── wallet を localStorage に同期 ──────────────────────────
  useEffect(() => {
    try { localStorage.setItem('em_wallet', JSON.stringify(wallet)); } catch { /* ignore */ }
  }, [wallet]);

  // ── TR を localStorage に同期（Supabase未設定時フォールバック）─
  useEffect(() => {
    try { localStorage.setItem('em_tr', JSON.stringify(TR)); } catch { /* ignore */ }
  }, [TR]);

  // ── saved を localStorage に同期（Supabase未設定時フォールバック）─
  useEffect(() => {
    try { localStorage.setItem('em_saved', JSON.stringify(saved)); } catch { /* ignore */ }
  }, [saved]);

  // ── pts を localStorage に同期 ─────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('em_pts', String(pts)); } catch { /* ignore */ }
  }, [pts]);

  // ── Supabase: ポイント同期（500ms debounce）────────────────
  const ptsSyncTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(() => {
    if (!SB_READY || !dbReady) return;
    if (ptsSyncTimer.current) clearTimeout(ptsSyncTimer.current);
    ptsSyncTimer.current = setTimeout(() => {
      sbFrom("user_points").upsert({ user_id: userId, points: pts, updated_at: new Date().toISOString() });
    }, 500);
  }, [pts, dbReady, userId]);

  // ── DB helpers ──────────────────────────────────────────────
  const dbSaveLine = async (line) => {
    if (!SB_READY) {
      console.log('[DB] Supabase未設定 - saved_items スキップ');
      return;
    }
    try {
      await sbFrom("saved_items").insert({
        user_id: userId,
        item_type: 'caption',
        content: {
          id: line.id,
          english: line.english,
          chunks: line.chunks || [],
          meaning: line.meaning || [],
          videoTitle: line.videoTitle || null,
        },
        saved_at: line.savedAt || Date.now(),
      });
      console.log('[DB] saved_items 保存:', line.english?.slice(0, 40));
    } catch (e) {
      console.error('[DB] saved_items 保存失敗:', e.message);
    }
  };

  const dbDeleteLine = async (captionId) => {
    if (!SB_READY) return;
    try {
      // saved_items: content->>'id' でフィルタ (JSON演算子)
      await sbFrom("saved_items").delete(
        `user_id=eq.${userId}&content->>id=eq.${captionId}&item_type=eq.caption`
      );
      console.log('[DB] saved_items 削除:', captionId);
    } catch (e) {
      console.error('[DB] saved_items 削除失敗:', e.message);
    }
  };

  const dbAddPlaylist = async (video) => {
    if (!SB_READY) return;
    await fetch('/api/list/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: video.title,
        videoId: video.videoId,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        chunks: [], // 手動追加時は空
        originalText: '',
      }),
    });
  };

  const dbRemovePlaylist = async (videoId) => {
    if (!SB_READY) return;
    await fetch(`/api/list/delete?videoId=${encodeURIComponent(videoId)}`, {
      method: 'DELETE',
    });
  };

  const dbSaveTestResult = async (type, correct, total, score = 0) => {
    // learning_logs テーブルに保存（Phase3: 永続化）
    if (!SB_READY) {
      console.log('[DB] Supabase未設定 - learning_logs スキップ');
      return;
    }
    try {
      await sbFrom("learning_logs").insert({
        user_id: userId,
        type,
        correct,
        total,
        score,
      });
      console.log(`[DB] learning_logs 保存: ${type} ${correct}/${total}`);
    } catch (e) {
      console.error('[DB] learning_logs 保存失敗:', (e as Error).message);
    }
    // テスト完了報酬（正解率に応じてコイン獲得）
    if (total > 0) {
      const rate = correct / total;
      const reward = rate >= 0.8 ? 10 : rate >= 0.6 ? 6 : rate >= 0.4 ? 3 : 1;
      earnCoins(reward, true).catch(() => {}); // 減衰あり
    }
  };

  // ── AI処理: 動画のChunk生成オーケストレーション ────────────
  const processNewVideo = useCallback(async (video, manualTranscript = null) => {
    const { videoId, title } = video;
    const upd = (step, pct, extra = {}) =>
      setProc(p => ({ ...p, active: true, step, pct, videoId, videoTitle: title, ...extra }));

    try {
      // STEP 0: DBに既存データがあればスキップ（再追加対策）
      if (!manualTranscript) {
        const existing = await dbLoadCaptions(videoId);
        if (existing && existing.length > 0) {
          setCaptionCache(prev => ({ ...prev, [videoId]: existing }));
          setVideos(prev => prev.map(v => v.videoId === videoId ? { ...v, aiReady: true } : v));
          setProc({ active: false, step: 'done', pct: 100, videoId: null, videoTitle: '', needManual: false });
          t$('✅ DB済み字幕を読み込みました');
          return; // AI生成スキップ
        }
      }

      // STEP 1: 字幕取得
      upd('transcript', 10);
      let sentences = manualTranscript
        ? manualTranscript.split(/[\n。.!?]+/).map(s => s.trim()).filter(s => s.split(' ').length >= 4).slice(0, 15)
        : null;

      if (!sentences) {
        const res = await fetchTranscript(videoId);
        if (res.ok) {
          sentences = res.sentences;
        } else {
          // 自動取得失敗 → ユーザーに手動入力を求める
          setProc(p => ({ ...p, active: true, step: 'manual', pct: 0, videoId, videoTitle: title, needManual: true }));
          return; // 手動入力待ち
        }
      }

      // STEP 2: AI Chunk生成
      upd('ai', 20, { needManual: false });
      const rawCaptions = await aiGenerateChunks(sentences, pct => upd('ai', 20 + pct * 0.65));

      // IDを付与
      const captions = rawCaptions.map((c, i) => ({ ...c, id: `${videoId}_${i}` }));

      // STEP 3: Supabase保存
      upd('saving', 88);
      await dbSaveCaptions(videoId, captions);

      // STEP 4: キャッシュ更新 & 完了
      setCaptionCache(prev => ({ ...prev, [videoId]: captions }));
      setVideos(prev => prev.map(v => v.videoId === videoId ? { ...v, aiReady: true } : v));
      setProc({ active: false, step: 'done', pct: 100, videoId: null, videoTitle: '', needManual: false });
      t$('✨ AI字幕生成完了！');

    } catch (e) {
      console.error('processNewVideo error:', e);
      setProc({ active: false, step: 'error', pct: 0, videoId: null, videoTitle: '', needManual: false });
      t$('❌ 字幕生成に失敗しました');
    }
  }, [t$]);

  // 手動入力でリトライ
  const makeManualCaptions = (chunks, videoId) => {
    return chunks.map((c, i) => ({
      id: `${videoId}_manual_${i}`,
      english: c.en || '',
      chunks: c.en ? c.en.split(' ').filter(Boolean).slice(0, 6) : [],
      meaning: c.ja ? [c.ja] : ['(生成失敗)'],
    }));
  };

  const fetchManualChunks = async (text) => {
    const res = await fetch('/api/ai/chunk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok || !Array.isArray(data.chunks)) {
      throw new Error('chunk generation failed');
    }
    return data.chunks;
  };

  const submitManualTranscript = async () => {
    if (!manualText.trim() || !proc.videoId) return;
    const video = videos.find(v => v.videoId === proc.videoId);
    if (!video) return;

    setManualLoading(true);
    setProc(p => ({ ...p, active: true, step: 'ai', pct: 10, needManual: false }));

    try {
      let chunks;
      try {
        chunks = await fetchManualChunks(manualText);
      } catch (err) {
        console.error('[manualChunk]', err);
        chunks = [{ en: 'Hello everyone', ja: 'みなさんこんにちは' }];
      }

      const captions = makeManualCaptions(chunks, video.videoId);
      setCaptionCache(prev => ({ ...prev, [video.videoId]: captions }));
      setVideos(prev => prev.map(v => v.videoId === video.videoId ? { ...v, aiReady: true } : v));
      dbSaveCaptions(video.videoId, captions).catch(() => {});

      // マイリストに保存
      try {
        await fetch('/api/list/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: video.title,
            videoId: video.videoId,
            thumbnail: video.thumbnail,
            channelTitle: video.channelTitle,
            chunks,
            originalText: manualText,
          }),
        });
        console.log('[save] Saved to my list');
      } catch (saveErr) {
        console.error('[save]', saveErr);
      }

      setProc({ active: false, step: 'done', pct: 100, videoId: null, videoTitle: '', needManual: false });
      setManualText('');
      t$('✨ AIでChunk生成しました');
    } finally {
      setManualLoading(false);
    }
  };

  // ── derived ──
  // captionCache優先 → Supabase → ダミー の順でフォールバック
  const caps   = curVid
    ? (captionCache[curVid.videoId] || DUMMY_CAPTIONS[curVid.videoId] || DUMMY_CAPTIONS["PlFx2XlbTK4"])
    : [];
  const curCap = caps[capIdx]||null;
  const isSaved= id=>saved.some(s=>s.id===id);
  const toeic  = calcToeic(TR);
  const spLv   = spLevel(toeic);
  const afLv   = affLevel(toeic);
  const afCard = AFF[afLv];
  const dVids  = homeTab==="my"?myList:homeTab==="review"?videos.filter(v=>saved.some(s=>s.videoTitle===v.title)):videos;

  // ── test helpers ──
  const startTest = async (type: string) => {
    // 無料枠・コスト確認（quiz_ticket があれば優先）
    // Supabase未接続時は常に無料で動作
    const isFree = !SB_READY; // env未設定は常に無料
    if (!isFree && wallet.quiz_tickets <= 0 && wallet.coins < 5) {
      t$('クイズチケットかコイン5枚が必要です');
      return;
    }
    // チケット/コイン消費（バックグラウンドで実行・失敗しても続ける）
    if (!isFree) {
      if (wallet.quiz_tickets > 0) {
        setWallet(w => ({...w, quiz_tickets: w.quiz_tickets - 1}));
        fetch('/api/wallet', { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ userId, action:'spendTicket', ticketType:'quiz_tickets' }) }).catch(()=>{});
      } else {
        await useCoins(5);
      }
    }
    setScreen(type);
    setTQs([]); setTIdx(0); setTAns([]); setTSel(null); setTPh("quiz"); setLisN(0); setPlay(false);
    try {
      // quiz/generate: キャッシュ確認→AI生成→DB保存を一括処理
      const qs = type === "wordTest"
        ? await genWord(saved, 10, userId)
        : type === "grammarTest"
        ? await genGrammar(saved, 10, userId)
        : await genListening(saved, 10, userId);
      setTQs(qs);
    } catch (err) {
      console.error('[startTest]', err.message);
      t$('問題の生成に失敗しました。ダミー問題で起動します。');
      // フォールバック: ダミーデータ
      const qs = type==="wordTest"
        ? shuffle(WORDS).slice(0,10).map(w => ({...w, options: [w.meaning,'不正解1','不正解2','不正解3'].sort(()=>Math.random()-.5), correct:w.meaning}))
        : type==="grammarTest"
        ? shuffle(GRAMMAR).slice(0,10).map(q=>({...q,correct:q.ans}))
        : shuffle(LISTENING).slice(0,10).map(i=>({...i,options:shuffle([i.jp,...i.d]),correct:i.jp}));
      setTQs(qs);
    }
  };
  const pickOpt = opt => { if(tSel!==null)return; setTSel(opt); };
  const nextQ = () => {
    const q=tQs[tIdx];
    const ok=tSel===(q.correct??q.ans);
    const newAns=[...tAns,{qId:q.id,sel:tSel,ok,q}];
    setTAns(newAns);setTSel(null);setLisN(0);setPlay(false);
    window.speechSynthesis&&window.speechSynthesis.cancel();
    if(tIdx+1>=tQs.length){
      setTPh("result");
      const cnt=newAns.filter(a=>a.ok).length;
      const key=screen==="wordTest"?"word":screen==="grammarTest"?"grammar":"listening";
      setTR(p=>({...p,[key]:[...p[key],{date:new Date().toISOString(),correct:cnt,total:newAns.length}]}));
      setPts(p=>p+cnt*5);t$(`🎉 +${cnt*5}pt 獲得！`);
      dbSaveTestResult(key, cnt, newAns.length);
    } else { setTIdx(i=>i+1); }
  };
  // リスニング音声再生
  // 現在: window.speechSynthesis (ブラウザTTS) を使用
  // 将来の差し替えポイント:
  //   音声ファイル: new Audio('/audio/word.mp3').play()
  //   外部TTS API: /api/speech/tts?text=... のようなAPI Routeを作成
  const speak = (txt: string) => {
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = "en-US";
    u.rate = 0.85;
    u.pitch = 1.0;
    // Chrome: 英語音声を優先選択
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en') && v.localService);
    if (enVoice) u.voice = enVoice;
    u.onstart = () => setPlay(true);
    u.onend   = () => setPlay(false);
    u.onerror = () => setPlay(false);
    window.speechSynthesis.speak(u);
    setLisN(n => n + 1);
  };
  const optCls = opt => {
    if(tSel===null)return"";
    const ca=tQs[tIdx]?.correct??tQs[tIdx]?.ans;
    if(opt===ca)return"ok";
    if(opt===tSel&&opt!==ca)return"ng";
    return"";
  };

  // ── shadowing ──
  // ─────────────────────────────────────────────────────────────────
  // シャドーイング音声認識
  //
  // 現在: Web Speech API (SpeechRecognition) を優先使用
  //   - Chrome / Edge: 実音声認識 ✅
  //   - Safari / Firefox: ランダムスコア（簡易版）にフォールバック ⚠️
  //
  // 将来の差し替えポイント: scoreWithWhisper() 関数を実装して
  //   doRec の中で呼び出すだけで Whisper API に切り替え可能
  //   例: const sc = await scoreWithWhisper(referenceText, audioBlob);
  // ─────────────────────────────────────────────────────────────────

  /** 単語単位の一致率でスコアを計算（0〜100） */
  const calcShadowScore = (recognized: string, reference: string): {score: number; matched: number; total: number} => {
    const normalize = (s: string) =>
      s.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
    const recWords = normalize(recognized);
    const refWords = normalize(reference);
    if (!refWords.length) return {score: 0, matched: 0, total: 0};
    // 順序を考慮したマッチ（LCS的アプローチ）
    let matched = 0;
    const used = new Set<number>();
    recWords.forEach(word => {
      const idx = refWords.findIndex((w, i) => w === word && !used.has(i));
      if (idx >= 0) { matched++; used.add(idx); }
    });
    const score = Math.min(100, Math.round((matched / refWords.length) * 100));
    return {score, matched, total: refWords.length};
  };

  /** Web Speech API を使ったシャドーイング録音・採点 */
  const doRec = () => {
    if (shwPh !== "idle") return;

    // 参照テキスト: 現在表示中の字幕、なければダミー
    const curCaptions = captionCache[curVid?.videoId ?? ''] ?? [];
    const refText = curCaptions[capIdx]?.english ?? "The quick brown fox jumps over the lazy dog";

    // ── Web Speech API が使えるか確認 ─────────────────────────
    const SpeechRecognitionAPI =
      (typeof window !== 'undefined') &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognitionAPI) {
      // ── フォールバック: 簡易版（ランダムスコア）─────────────
      console.warn('[shadowing] SpeechRecognition未対応 → 簡易版スコア使用');
      setShwEngine('dummy');
      setShwPh("rec");
      setShwTranscript('');
      setTimeout(() => {
        const sc = Math.floor(Math.random() * 30) + 60; // 60〜90
        setShwSc(sc);
        setShwTranscript('（音声認識未対応 - 簡易スコア）');
        setShwWords(0);
        setShwTotal(refText.split(' ').length);
        setShwPh("score");
        setPts(p => p + Math.floor(sc / 10));
        setTR(p => ({...p, shadowing:[...p.shadowing, {date: new Date().toISOString(), score: sc}]}));
        dbSaveTestResult("shadowing", 0, 0, sc);
      }, 2500);
      return;
    }

    // ── Web Speech API による実音声認識 ──────────────────────
    setShwEngine('webSpeech');
    setShwPh("rec");
    setShwTranscript('');

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let recognized = '';

    recognition.onresult = (event: any) => {
      recognized = Array.from(event.results as any[])
        .map((r: any) => r[0].transcript)
        .join(' ');
      setShwTranscript(recognized);
      console.log('[shadowing] 認識テキスト:', recognized);
      console.log('[shadowing] 参照テキスト:', refText);
    };

    recognition.onend = () => {
      const {score, matched, total} = calcShadowScore(recognized, refText);
      setShwSc(score);
      setShwWords(matched);
      setShwTotal(total);
      setShwPh("score");
      setPts(p => p + Math.floor(score / 10));
      setTR(p => ({...p, shadowing:[...p.shadowing, {date: new Date().toISOString(), score}]}));
      dbSaveTestResult("shadowing", matched, total, score);
      console.log(`[shadowing] スコア: ${score} (${matched}/${total}単語)`);
    };

    recognition.onerror = (event: any) => {
      console.error('[shadowing] recognition error:', event.error);
      // エラー時は簡易スコアにフォールバック
      const sc = Math.floor(Math.random() * 25) + 55;
      setShwSc(sc);
      setShwTranscript('（認識エラー - 簡易スコア）');
      setShwPh("score");
      setPts(p => p + Math.floor(sc / 10));
      setTR(p => ({...p, shadowing:[...p.shadowing, {date: new Date().toISOString(), score: sc}]}));
      dbSaveTestResult("shadowing", 0, 0, sc);
    };

    // 5秒録音
    recognition.start();
    setTimeout(() => {
      try { recognition.stop(); } catch { /* 既に停止 */ }
    }, 5000);
  };

  /* ──────────────────────────────────────────────────────────────
   * 将来の Whisper API 差し替えポイント
   *
   * async function scoreWithWhisper(
   *   referenceText: string,
   *   audioBlob: Blob
   * ): Promise<{score: number; transcript: string}> {
   *   const formData = new FormData();
   *   formData.append('file', audioBlob, 'audio.webm');
   *   formData.append('model', 'whisper-1');
   *   const r = await fetch('/api/speech/transcribe', {  // サーバーサイドでOpenAI APIキーを使う
   *     method: 'POST', body: formData,
   *   });
   *   const { text } = await r.json();
   *   return { ...calcShadowScore(text, referenceText), transcript: text };
   * }
   * ─────────────────────────────────────────────────────────────
   */;

  // ── reward ad ──
  // アフィリエイトクリックをログ送信（バックグラウンド・失敗してもOK）
  const logAffiliateClick = (cardKey: string, cardTitle: string, toeicScore: number) => {
    fetch('/api/affiliate/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cardKey, cardTitle, toeicScore }),
    }).catch(() => {});
  };

  // ── SNS ヘルパー ──────────────────────────────────────────────
  const loadProfile = async () => {
    try {
      const r = await fetch(`/api/social/profile?userId=${encodeURIComponent(userId)}`);
      if (r.ok) { const p = await r.json(); setMyProfile(p); return p; }
    } catch { /* ignore */ }
    return null;
  };

  const saveProfile = async (nickname: string, avatarEmoji = '🎓') => {
    setMyProfile({ nickname, avatar_emoji: avatarEmoji });
    fetch('/api/social/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, nickname, avatarEmoji }),
    }).catch(() => {});
  };

  const loadRanking = async (type: 'translation'|'learning') => {
    setRankingTab(type);
    setRankingLoading(true);
    try {
      const r = await fetch(`/api/social/ranking?type=${type}&limit=30`);
      if (r.ok) { const d = await r.json(); setRankingData(d.ranking ?? []); }
    } catch { setRankingData([]); }
    setRankingLoading(false);
  };

  const postTranslation = async (videoId: string, captionIndex: number, english: string, translation: string) => {
    if (!translation.trim()) return;
    try {
      const r = await fetch('/api/social/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, videoId, captionIndex, english, translation }),
      });
      if (r.ok) {
        t$('✅ 翻訳を投稿しました！ +5コイン');
        setWallet(w => ({ ...w, coins: w.coins + 5 }));
      } else t$('投稿に失敗しました');
    } catch { t$('オフラインのため投稿できません'); }
  };

  const voteTranslation = async (translationId: string, vote: 1|-1) => {
    try {
      const r = await fetch('/api/social/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, translationId, vote }),
      });
      const d = await r.json();
      if (d.ok) t$(vote === 1 ? '👍 いいね！' : '👎 評価しました');
      else t$(d.message || '投票に失敗しました');
    } catch { t$('オフラインのため投票できません'); }
  };

  const openRew = cb => {
    if(!sett.rewOn){cb&&cb();return;}
    setRewCb(()=>cb);setRewPct(0);setRewShow(true);
    let p=0;
    const iv=setInterval(()=>{p+=3.33;setRewPct(Math.min(p,100));if(p>=100){clearInterval(iv);setTimeout(()=>{setRewShow(false);cb&&cb();},300);}},100);
  };

  // ── gacha ──
  // ═══════════════════════════════════════════════════════════
  // ECONOMY HELPERS
  // ═══════════════════════════════════════════════════════════

  /** ウォレット取得（API → localStorage フォールバック） */
  const fetchWallet = async () => {
    try {
      const r = await fetch(`/api/wallet?userId=${encodeURIComponent(userId)}`);
      if (r.ok) {
        const w = await r.json();
        setWallet(w);
        return w;
      }
    } catch { /* localStorage使用 */ }
    return wallet;
  };

  /** コイン加算（デイリー上限・減衰あり） */
  const earnCoins = async (amount: number, decay = false) => {
    try {
      const r = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'add', amount, decay }),
      });
      if (r.ok) {
        const d = await r.json();
        setWallet(w => ({ ...w, coins: d.total }));
        if (d.limitReached) t$('⚠️ 本日のコイン獲得上限に達しました');
        return d;
      }
    } catch { /* ignore */ }
    // フォールバック: ローカル加算
    setWallet(w => ({ ...w, coins: w.coins + amount }));
    return { added: amount, total: wallet.coins + amount };
  };

  /** コイン消費 */
  const useCoins = async (amount: number): Promise<boolean> => {
    if (wallet.coins < amount) {
      t$(`コインが不足しています（必要: ${amount}枚、所持: ${wallet.coins}枚）`);
      return false;
    }
    try {
      const r = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'spend', amount }),
      });
      if (r.ok) {
        const d = await r.json();
        if (!d.ok) { t$(d.message || 'コイン消費に失敗しました'); return false; }
        setWallet(w => ({ ...w, coins: d.remaining }));
        return true;
      }
    } catch { /* ignore */ }
    // フォールバック: ローカル消費
    setWallet(w => ({ ...w, coins: w.coins - amount }));
    return true;
  };

  /** コンテンツ解放ダイアログを表示 */
  const showUnlockModal = (opts: {
    title:      string;
    coinCost:   number;
    ticketType: string;
    onConfirm:  (payWith: 'coin'|'ticket'|'free') => void;
  }) => {
    setUnlockModal({ visible: true, ...opts });
  };

  /** コンテンツ解放実行 */
  const unlockContent = async (opts: {
    contentType: string;
    contentId:   string;
    payWith:     'coin' | 'ticket' | 'free';
    isNewAI?:    boolean;
  }): Promise<boolean> => {
    try {
      const r = await fetch('/api/wallet/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...opts }),
      });
      const d = await r.json();
      if (d.ok) {
        if (opts.payWith === 'coin' && d.remaining !== undefined) {
          setWallet(w => ({ ...w, coins: d.remaining }));
        }
        if (opts.payWith === 'ticket') {
          const col = opts.contentType === 'video' ? 'video_tickets'
                    : opts.contentType === 'quiz'  ? 'quiz_tickets'
                    : 'translation_tickets';
          setWallet(w => ({ ...w, [col]: Math.max(0, (w as any)[col] - 1) }));
        }
        return true;
      }
      t$(d.message || '解放に失敗しました');
      return false;
    } catch {
      // フォールバック: ローカルで消費
      return await useCoins(opts.payWith === 'coin' ? opts.isNewAI ? 100 : 10 : 0);
    }
  };

  const doGacha = async (payWith: 'free'|'coin'|'ticket' = 'free') => {
    // 残回数チェック
    if (payWith === 'free' && dailyGachaLeft <= 0) {
      t$('本日の無料ガチャは終了しました'); return;
    }
    if (payWith === 'coin' && wallet.coins < 10) {
      t$('コインが不足しています（必要: 10枚）'); return;
    }
    if (payWith === 'ticket' && wallet.gacha_tickets <= 0) {
      t$('ガチャチケットがありません'); return;
    }

    try {
      const r = await fetch('/api/wallet/gacha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, payWith, lastRewardType: lastGachaRewardType }),
      });
      const d = await r.json();
      if (!d.ok) { t$(d.message || 'ガチャに失敗しました'); return; }

      const prize = d.prize;
      setLastGachaRewardType(prize.reward_type);
      setDailyGachaLeft(d.dailyLeft ?? 0);

      // ウォレット更新
      setWallet(w => ({
        ...w,
        coins:               d.newCoins ?? w.coins,
        quiz_tickets:        prize.reward_type === 'quiz_ticket'        ? w.quiz_tickets + prize.reward_value        : w.quiz_tickets,
        video_tickets:       prize.reward_type === 'video_ticket'       ? w.video_tickets + prize.reward_value       : w.video_tickets,
        translation_tickets: prize.reward_type === 'translation_ticket' ? w.translation_tickets + prize.reward_value : w.translation_tickets,
        gacha_tickets:       prize.reward_type === 'gacha_ticket'
                               ? w.gacha_tickets + prize.reward_value - (payWith === 'ticket' ? 1 : 0)
                               : payWith === 'ticket' ? w.gacha_tickets - 1 : w.gacha_tickets,
      }));

      // 旧 pts との互換性（pts は legacy、coins に統合）
      if (prize.reward_type === 'coin') setPts(p => p + (prize.reward_value ?? 0));

      // スキル系は gachaSkillStock へ（shooter 装備と連携）
      if (['shield','slow','hint','heal'].includes(prize.reward_key ?? '')) {
        setGachaSkillStock((s: any) => ({...s, [prize.reward_key]: ((s as any)[prize.reward_key] ?? 0) + 1}));
      }

      setGRes({ ...prize, pts: prize.reward_type === 'coin' ? prize.reward_value : 0, text: prize.text, emoji: prize.emoji });
      setGHist((h: any[]) => [{...prize, time: new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'})},...h].slice(0,15));
      t$(`🎊 ${prize.text}`);

    } catch {
      // フォールバック: ローカルガチャ
      const prize = (GACHA_PRIZES as any[])[Math.floor(Math.random() * GACHA_PRIZES.length)];
      setGRes(prize);
      if (prize.pts > 0) { setPts(p => p + prize.pts); setWallet(w => ({...w, coins: w.coins + prize.pts})); }
      setGHist((h: any[]) => [{...prize, time: new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'})},...h].slice(0,15));
      t$(`🎊 ${prize.text}（オフライン）`);
    }
  };

  // ── url add（oEmbed + AI自動処理）──────────────────────────
  const addUrl = async () => {
    if (!urlIn.trim()) return;
    const m = urlIn.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (!m) { t$('❌ 有効なYouTube URLを入力してください'); return; }
    const id = m[1];
    if (videos.some(v => v.videoId === id)) { t$('✅ 既存の動画です！'); setUrlIn(''); return; }
    setUrlLd(true);

    // ① oEmbed でタイトル・チャンネル名を取得
    const info = await fetchVideoInfo(id);
    const newVideo = {
      videoId: id,
      title: info?.title || '新しい動画',
      channelTitle: info?.channelTitle || 'YouTube',
      thumbnail: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
      aiReady: false,
    };
    setVideos(p => [newVideo, ...p]);
    setUrlIn('');
    setUrlLd(false);

    // ② タイトルが取れたらSupabaseに保存（リロード後も一覧に残る）
    dbSaveVideo(userId, newVideo);

    // ③ 字幕取得 + AI Chunk生成を開始
    processNewVideo(newVideo);
  };

  const goVideo = async (v) => {
    setCurVid(v); setCapIdx(0); setShwPh("idle"); setScreen("video");
    // メモリキャッシュ済みなら終了
    if (captionCache[v.videoId]) return;
    // マイリストのchunksがあればそれを使う
    if (v.chunks && v.chunks.length > 0) {
      const captions = makeManualCaptions(v.chunks, v.videoId);
      setCaptionCache(prev => ({ ...prev, [v.videoId]: captions }));
      setVideos(prev => prev.map(vid => vid.videoId === v.videoId ? { ...vid, aiReady: true } : vid));
      return;
    }
    // Supabaseから読み込み
    const fromDb = await dbLoadCaptions(v.videoId);
    if (fromDb && fromDb.length > 0) {
      setCaptionCache(prev => ({ ...prev, [v.videoId]: fromDb }));
      // aiReadyバッジを更新
      setVideos(prev => prev.map(vid => vid.videoId === v.videoId ? { ...vid, aiReady: true } : vid));
    }
  };


  // ════════════════════════════════════════════════════════════════
  // SCREENS
  // ════════════════════════════════════════════════════════════════

  // ── HOME ────────────────────────────────────────────────────────
  const Home = () => (
    <div className="sa">
      <div className="url-sec">
        <div className="url-row">
          <input className="url-inp" placeholder="YouTube URLを入力" value={urlIn} onChange={e=>setUrlIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addUrl()}/>
          <button className="bp" onClick={addUrl}>追加</button>
        </div>
        {urlLd&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"var(--pl)",borderRadius:"var(--rs)",marginTop:8}}><div className="spin"/><span className="jp" style={{fontSize:13,color:"var(--p)",fontWeight:500}}>動画を読み込み中…字幕を生成しています</span></div>}
      </div>
      <div className="tabs">
        {[["all","全体"],["my","マイリスト"],["review","復習"]].map(([k,v])=>(
          <div key={k} className={`tab ${homeTab===k?"on":""}`} onClick={()=>setHomeTab(k)}>{v}</div>
        ))}
      </div>
      {dbLoading&&SB_READY&&(
        <div style={{padding:"20px 16px",display:"flex",flexDirection:"column",gap:10}}>
          {[1,2,3].map(i=>(
            <div key={i} style={{height:82,background:"var(--sur)",borderRadius:"var(--r)",boxShadow:"var(--sh)",animation:"pulse 1.5s ease-in-out infinite",opacity:.7}}>
              <style>{`@keyframes pulse{0%,100%{opacity:.7}50%{opacity:.4}}`}</style>
            </div>
          ))}
          <div className="jp" style={{textAlign:"center",fontSize:12,color:"var(--t3)"}}>Supabaseからデータを読み込み中...</div>
        </div>
      )}
      {!dbLoading&&dVids.length===0?(
        <div className="empty"><div style={{fontSize:44,marginBottom:10}}>📭</div><div className="jp" style={{fontSize:14,fontWeight:600,color:"var(--t2)",marginBottom:4}}>まだ動画がありません</div><div className="jp" style={{fontSize:12}}>URLを入力して動画を追加しましょう</div></div>
      ):(
        <div className="vlist">
          {dVids.map(v=>{
            const thumbSrc = typeof v.thumbnail === 'string' && v.thumbnail.trim() ? v.thumbnail : DEFAULT_THUMBNAIL;
            return (
              <button key={v.videoId} className="vcard" onClick={()=>goVideo(v)} aria-label={v.title}>
                <div className="vth">
                  <img
                    src={thumbSrc}
                    alt=""
                    onError={e => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (img.src !== DEFAULT_THUMBNAIL) img.src = DEFAULT_THUMBNAIL;
                    }}
                  />
                  <div className="vtho">{I({n:"play",s:22,c:"white"})}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,lineHeight:1.4,marginBottom:4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{v.title}</div>
                  <div style={{fontSize:11,color:"var(--t3)",marginBottom:6}}>{v.channelTitle}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {(captionCache[v.videoId]||DUMMY_CAPTIONS[v.videoId])
                      ? <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:"#D1FAE5",color:"#059669"}}>✨ AI字幕あり</span>
                      : v.aiReady===false&&proc.videoId===v.videoId
                        ? <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:"var(--al)",color:"#B45309"}}>⚙️ 生成中...</span>
                        : <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:"var(--pl)",color:"var(--p)"}}>語順学習</span>
                    }
                    {myList.some(m=>m.videoId===v.videoId)&&<span style={{fontSize:10,color:"var(--a)",fontWeight:700}}>📌 MY</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <div className="divhr"/>
      <div className="bad-w">
        <div className="bad-lbl">広告</div>
        <div className="bad"><div><div style={{fontSize:11.5,color:"#92400E",fontWeight:600,fontFamily:"'Noto Sans JP'"}}>🎓 TOEIC 900点への最短ルート</div><div style={{fontSize:10,color:"#92400E",opacity:.7}}>スキマ時間で効率学習</div></div><div style={{fontSize:10,color:"#78350F",background:"rgba(255,255,255,.6)",padding:"4px 10px",borderRadius:20,fontWeight:700}}>詳細 ▶</div></div>
      </div>
      <div style={{height:16}}/>
    </div>
  );

  // ── LEARN HUB ───────────────────────────────────────────────────
  const LearnHub = () => {
    const lw=TR.word.slice(-1)[0],lg=TR.grammar.slice(-1)[0],ll=TR.listening.slice(-1)[0];
    const pct=r=>r?`${Math.round((r.correct/r.total)*100)}%`:null;
    const items=[
      {id:"wordTest",    ico:"book",bg:"#EFF6FF",ic:"#2563EB",title:"単語テスト",    desc:"TOEIC頻出単語 10問4択",  btext:pct(lw)||"NEW",bcls:lw?(lw.correct/lw.total>=.7?"lbd":"lbs"):"lbn"},
      {id:"grammarTest", ico:"info",bg:"#F5F3FF",ic:"#7C3AED",title:"文法 Part5",   desc:"穴埋め4択・解説付き 10問",btext:pct(lg)||"NEW",bcls:lg?(lg.correct/lg.total>=.7?"lbd":"lbs"):"lbn"},
      {id:"listeningTest",ico:"ear",bg:"#FFF7ED",ic:"#C2410C",title:"リスニング",  desc:"音声再生→意味4択 10問",  btext:pct(ll)||"NEW",bcls:ll?(ll.correct/ll.total>=.7?"lbd":"lbs"):"lbn"},
      {id:"shadow",      ico:"mic", bg:"#F0FDF4",ic:"#059669",title:"シャドーイング",desc:"動画の文を音読練習",      btext:TR.shadowing.length>0?`${TR.shadowing.length}回`:"NEW",bcls:"lbs"},
      {id:"shooter",     ico:"play",bg:"#1E293B",ic:"#60A5FA",title:"🎮 単語シューティング",desc:"落ちてくる英単語を撃破！HP制+スキル",btext:"NEW",bcls:"lbn"},
      {id:"analysis",    ico:"pie", bg:"#FFF1F2",ic:"#BE185D",title:"成績分析",     desc:`TOEIC予想 ${toeic}点`,   btext:"→",bcls:"lbn"},
    ];
    return (
      <div className="sa">
        <div className="lhub">
          <div className="lsec">📺 動画</div>
          <button className="lcard" onClick={()=>setNavTab("home")}>
            <div className="lcard-ico" style={{background:"#F0F9FF"}}>{I({n:"vid",s:22,c:"#0369A1"})}</div>
            <div style={{flex:1}}><div className="lcard-t">動画学習</div><div className="lcard-d">YouTubeで語順理解トレーニング</div></div>
            {I({n:"chR",s:18,c:"var(--t3)"})}
          </button>
          <div className="lsec" style={{marginTop:4}}>📝 テスト・学習</div>
          {items.map(it=>(
            <button key={it.id} className="lcard"
              onClick={()=>it.id==="shooter"?openEquipScreen():it.id==="shadow"?(()=>{setNavTab("home");setTimeout(()=>setShwShow(true),150);})():it.id==="analysis"?setScreen("analysis"):startTest(it.id)}>
              <div className="lcard-ico" style={{background:it.bg}}>{I({n:it.ico,s:22,c:it.ic})}</div>
              <div style={{flex:1,minWidth:0,paddingRight:64}}>
                <div className="lcard-t">{it.title}</div>
                <div className="lcard-d">{it.desc}</div>
              </div>
              <span className={`lbdg ${it.bcls}`}>{it.btext}</span>
            </button>
          ))}
          <div style={{background:"var(--sur)",borderRadius:"var(--r)",padding:"14px 16px",boxShadow:"var(--sh)"}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:10,fontFamily:"'Noto Sans JP'"}}>📊 現在の実力</div>
            <div style={{display:"flex",justifyContent:"space-around"}}>
              {[{label:"TOEIC予想",val:toeic,unit:"点",c:"var(--p)"},{label:"レベル",val:spLv.grade,c:spLv.color,text:true},{label:"ポイント",val:pts,unit:"pt",c:"var(--a)"}].map(({label,val,unit="",c,text})=>(
                <div key={label} style={{textAlign:"center"}}>
                  <div style={{fontSize:text?20:22,fontWeight:700,color:c}}>{val}{!text&&unit}</div>
                  <div style={{fontSize:11,color:"var(--t3)",fontFamily:"'Noto Sans JP'"}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{height:20}}/>
      </div>
    );
  };

  // ── QUIZ ────────────────────────────────────────────────────────
  const Quiz = () => {
    // 問題生成中のローディング表示
    if(!tQs.length && tPh === 'quiz') return (
      <div className="sa" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:16,padding:40}}>
        <div className="spin" style={{width:32,height:32,borderWidth:3}}/>
        <div className="jp" style={{fontSize:14,color:"var(--t3)"}}>問題を生成中です...</div>
        <div className="jp" style={{fontSize:12,color:"var(--t3)"}}>保存済みの英文からAIが作成しています</div>
      </div>
    );
    if(!tQs.length)return null;
    if(tPh==="result")return <Result/>;
    const q=tQs[tIdx];
    const isW=screen==="wordTest",isG=screen==="grammarTest",isL=screen==="listeningTest";
    const answered=tSel!==null;
    const progress=(tIdx/tQs.length)*100;
    return (
      <div className="sa">
        <div className="tscr">
          <div className="tpb-w"><div className="tpb" style={{width:`${progress}%`}}/></div>
          <div className="tqn">
            <span className="jp">{tIdx+1} / {tQs.length} 問</span>
            {isG&&q.cat&&<span className="tcbdg">{q.cat}</span>}
            {isW&&q.pos&&<span className="tcbdg">{q.pos}</span>}
          </div>
          {isW&&<><div className="tword">{q.word}</div><div className="tpos">{q.pos}</div><div className="jp" style={{fontSize:13,color:"var(--t2)",marginBottom:16,textAlign:"center"}}>正しい意味を選んでください</div></>}
          {isG&&<div className="tq">{q.s.replace("_____","　　　　　　")}</div>}
          {isL&&(
            <>
              <div className="lplay">
                <button className={`pbl${play?" on":""}`} onClick={()=>speak(q.en)}>{I({n:"vol",s:30,c:"white"})}</button>
                <div className="jp" style={{fontSize:12,color:"var(--t3)"}}>タップして英文を再生</div>
                {lisN>0&&<div className="jp" style={{fontSize:11,color:"var(--p)",fontWeight:600,background:"var(--pl)",padding:"3px 10px",borderRadius:10}}>再生{lisN}回 · もう一度聴けます</div>}
              </div>
              {answered&&<div className="lrev"><div style={{fontSize:15,fontWeight:600,color:"var(--t)",marginBottom:4}}>{q.en}</div><div style={{fontSize:13,color:"var(--t2)",fontFamily:"'Noto Sans JP'"}}>{q.jp}</div></div>}
              {!answered&&<div className="jp" style={{fontSize:13,color:"var(--t2)",marginBottom:14,textAlign:"center"}}>意味を選んでください</div>}
            </>
          )}
          <div className="opts">
            {q.options.map((opt,i)=>{
              const cls=optCls(opt);
              return (
                <button key={i} className={`opt ${cls}`} disabled={answered} onClick={()=>pickOpt(opt)}>
                  <span className="jp">{opt}</span>
                  {cls==="ok"&&I({n:"ok",s:18,c:"var(--ok)"})}
                  {cls==="ng"&&I({n:"ng",s:18,c:"var(--ng)"})}
                </button>
              );
            })}
          </div>
          {answered&&isG&&q.exp&&(
            <div className="exbox">
              <div style={{fontSize:11,fontWeight:700,color:"#92400E",marginBottom:5,fontFamily:"'Noto Sans JP'"}}>💡 解説</div>
              <div className="extxt">{q.exp}</div>
            </div>
          )}
          {answered&&<button className="bp" style={{width:"100%"}} onClick={nextQ}>{tIdx+1<tQs.length?"次の問題 →":"結果を見る →"}</button>}
        </div>
        <div style={{height:20}}/>
      </div>
    );
  };

  // ── RESULT ──────────────────────────────────────────────────────
  const Result = () => {
    const cnt=tAns.filter(a=>a.ok).length,total=tAns.length;
    const pct=Math.round((cnt/total)*100);
    const st=stars(cnt,total);
    const wrong=tAns.filter(a=>!a.ok);
    const msg=pct>=80?"素晴らしい！🎉":pct>=60?"よくできました！👍":"もう一度チャレンジ！💪";
    const isW=screen==="wordTest",isG=screen==="grammarTest",isL=screen==="listeningTest";
    return (
      <div className="sa">
        <div className="rscr">
          <div className="rring"><div className="rnum">{cnt}</div><div className="rden">/ {total}</div></div>
          <div className="rstars">{st.map((on,i)=>I({n:"star",s:24,c:on?"#F59E0B":"#E2E8F0"}))}</div>
          <div className="jp" style={{fontSize:16,fontWeight:700,marginBottom:4}}>{msg}</div>
          <div className="jp" style={{fontSize:13,color:"var(--t2)",marginBottom:18}}>正答率 {pct}% · +{cnt*5}pt 獲得！</div>
          {wrong.length>0&&(
            <div style={{width:"100%",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--t2)",marginBottom:8,fontFamily:"'Noto Sans JP'"}}>❌ 間違えた問題 ({wrong.length}問)</div>
              {wrong.map((a,i)=>(
                <div key={i} className="rw">
                  {isW&&<><div style={{fontSize:15,fontWeight:700}}>{a.q.word}</div><div className="jp" style={{fontSize:13,color:"var(--ok)",marginTop:3}}>✓ 正解: {a.q.correct}</div><div className="jp" style={{fontSize:12,color:"var(--ng)"}}>✗ あなた: {a.sel}</div></>}
                  {isG&&<><div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{a.q.s}</div><div className="jp" style={{fontSize:13,color:"var(--ok)"}}>✓ 正解: {a.q.ans}</div>{a.q.exp&&<div style={{fontSize:12,color:"#92400E",marginTop:4,fontFamily:"'Noto Sans JP'"}}>{a.q.exp}</div>}</>}
                  {isL&&<><div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{a.q.en}</div><div className="jp" style={{fontSize:13,color:"var(--ok)"}}>✓ 正解: {a.q.jp}</div><div className="jp" style={{fontSize:12,color:"var(--ng)"}}>✗ あなた: {a.sel}</div></>}
                </div>
              ))}
            </div>
          )}
          {sett.rewOn&&wrong.length>0&&(
            <div className="rdbox" style={{width:"100%",marginBottom:14}}>
              <div style={{color:"#fff",fontSize:13,fontWeight:700,marginBottom:6,fontFamily:"'Noto Sans JP'"}}>📺 広告を見て間違い問題を復習リストへ保存</div>
              <button style={{background:"var(--a)",color:"#fff",border:"none",borderRadius:"var(--rs)",padding:"9px 20px",fontWeight:700,cursor:"pointer",fontFamily:"'Noto Sans JP'",width:"100%",fontSize:13}} onClick={()=>openRew(()=>t$("🔖 間違い問題を保存しました！"))}>広告を見て保存する →</button>
            </div>
          )}
          {sett.affOn&&(
            <div style={{width:"100%",marginBottom:14}}>
              <div className="afcard" style={{margin:0,borderColor:afCard.color+"40",background:afCard.color+"08"}}>
                <div className="afbdg" style={{background:afCard.color+"20",color:afCard.color}}>次のステップ 👇</div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:3,fontFamily:"'Noto Sans JP'"}}>{afCard.emoji} {afCard.title}</div>
                <div style={{fontSize:12,color:"var(--t2)",marginBottom:10,fontFamily:"'Noto Sans JP'"}}>{afCard.desc}</div>
                <button className="afcta" style={{background:afCard.color}} onClick={()=>{
                    logAffiliateClick(afCard.key ?? '', afCard.title, toeic);
                    if (afCard.url && afCard.url !== '#') window.open(afCard.url,'_blank','noopener');
                    else t$('🔗 外部サービスへ（URL未設定 - lib/affiliateConfig.tsで設定）');
                  }}>{afCard.cta}</button>
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:10,width:"100%"}}>
            <button className="bg" style={{flex:1}} onClick={()=>startTest(screen)}>もう一度</button>
            <button className="bp" style={{flex:1}} onClick={()=>{setScreen("main");setNavTab("learn");}}>学習メニューへ</button>
          </div>
        </div>
        <div style={{height:20}}/>
      </div>
    );
  };


  // ── ANALYSIS ────────────────────────────────────────────────────
  const Analysis = () => {
    const lw=TR.word.slice(-1)[0],lg=TR.grammar.slice(-1)[0],ll=TR.listening.slice(-1)[0];
    const shAvg=TR.shadowing.length>0?Math.round(TR.shadowing.reduce((s,r)=>s+r.score,0)/TR.shadowing.length):0;
    const pct=r=>r?Math.round((r.correct/r.total)*100):0;
    const total=TR.word.length+TR.grammar.length+TR.listening.length+TR.shadowing.length;
    const LEVELS=[
      {grade:"A1",label:"入門",color:"#94A3B8"},{grade:"A2",label:"初級",color:"#60A5FA"},
      {grade:"B1",label:"初中級",color:"#34D399"},{grade:"B1+",label:"中級",color:"#FBBF24"},
      {grade:"B2",label:"中上級",color:"#F97316"},{grade:"C1",label:"上級",color:"#A78BFA"},
      {grade:"C2",label:"最上級",color:"#EF4444"},
    ];
    return (
      <div className="sa">
        <div className="ascr">
          {/* TOEIC card */}
          <div className="tcard">
            <div style={{fontSize:11,fontWeight:700,opacity:.8,textTransform:"uppercase",letterSpacing:.5,marginBottom:6,fontFamily:"'Noto Sans JP'"}}>TOEIC 予想スコア</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
              <div style={{fontSize:52,fontWeight:700,lineHeight:1}}>{toeic}</div>
              <div style={{fontSize:16,opacity:.7,marginBottom:8}}>/990</div>
            </div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.15)",borderRadius:20,padding:"5px 12px",marginTop:10,fontSize:13,fontWeight:600}}>
              <span style={{fontSize:16}}>🏆</span><span className="jp">{spLv.grade} · {spLv.label} ({spLv.en})</span>
            </div>
            {total===0&&<div style={{fontSize:12,marginTop:8,opacity:.7,fontFamily:"'Noto Sans JP'"}}>テストを受けると精度が上がります</div>}
          </div>

          {/* Subject breakdown */}
          <div className="sc">
            <div className="sc-t">{I({n:"chart",s:15,c:"var(--p)"})}<span>科目別 正答率</span></div>
            {[
              {label:"単語",    val:pct(lw),  color:"#2563EB",r:lw},
              {label:"文法",    val:pct(lg),  color:"#7C3AED",r:lg},
              {label:"リスニング",val:pct(ll), color:"#C2410C",r:ll},
              {label:"シャドー", val:shAvg,   color:"#059669",r:TR.shadowing.length>0?{correct:shAvg,total:100}:null,isScore:true},
            ].map(({label,val,color,r,isScore})=>(
              <div key={label} className="str">
                <div className="str-l jp">{label}</div>
                <div className="str-bw"><div className="str-b" style={{width:r?`${val}%`:"0%",background:color}}/></div>
                {r
                  ?<div className="str-p" style={{color}}>{val}{isScore?"点":"%"}</div>
                  :<div style={{fontSize:11,color:"var(--t3)",width:40,textAlign:"right",fontFamily:"'Noto Sans JP'"}}>未受験</div>
                }
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="sc">
            <div className="sc-t">{I({n:"trophy",s:15,c:"#F59E0B"})}<span>詳細スタッツ</span></div>
            {[
              {label:"受験回数",val:`単語${TR.word.length}・文法${TR.grammar.length}・LS${TR.listening.length}回`},
              {label:"シャドーイング",val:`${TR.shadowing.length}回 · 平均${shAvg}点`},
              {label:"保存した文",val:`${saved.length}文`},
              {label:"総ポイント",val:`${pts}pt`},
            ].map(({label,val})=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--bd)"}}>
                <span className="jp" style={{fontSize:13,color:"var(--t2)"}}>{label}</span>
                <span className="jp" style={{fontSize:13,fontWeight:600,color:"var(--t)"}}>{val}</span>
              </div>
            ))}
          </div>

          {/* PROGOS-style speaking level */}
          <div className="sc">
            <div className="sc-t">{I({n:"mic",s:15,c:"var(--pu)"})}<span>スピーキングレベル（PROGOS風）</span></div>
            <div className="lvgrid">
              {LEVELS.map(l=>{
                const on=l.grade===spLv.grade;
                return (
                  <div key={l.grade} className={`lvi${on?" on":""}`} style={on?{borderColor:l.color,background:l.color+"18"}:{}}>
                    <div style={{fontSize:13,fontWeight:700,color:on?l.color:"var(--t3)"}}>{l.grade}</div>
                    <div style={{fontSize:9,color:on?l.color:"var(--t3)",fontFamily:"'Noto Sans JP'",textAlign:"center",lineHeight:1.2}}>{l.label}</div>
                    {on&&<div style={{fontSize:8,color:l.color,fontWeight:700}}>▲ 現在</div>}
                  </div>
                );
              })}
            </div>
            <div className="jp" style={{fontSize:11,color:"var(--t3)",marginTop:10}}>※ 単語・文法・リスニング・シャドーイングから算出</div>
          </div>

          {/* Score breakdown */}
          <div className="sc">
            <div className="sc-t">📐 スコア内訳</div>
            {[
              {label:"ベース",val:300,color:"var(--t3)"},
              {label:"単語",  val:lw?Math.round((lw.correct/lw.total)*150):0,max:150,color:"#2563EB"},
              {label:"文法",  val:lg?Math.round((lg.correct/lg.total)*150):0,max:150,color:"#7C3AED"},
              {label:"リスニング",val:ll?Math.round((ll.correct/ll.total)*200):0,max:200,color:"#C2410C"},
              {label:"シャドー",val:Math.round((shAvg/100)*100),max:100,color:"#059669"},
            ].map(({label,val,max,color})=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--bd)"}}>
                <span className="jp" style={{fontSize:12,color:"var(--t2)"}}>{label}</span>
                <span style={{fontSize:12,fontWeight:700,color}}>{val}{max?`/${max}`:""}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:"2px solid var(--bd)",marginTop:2}}>
              <span className="jp" style={{fontSize:14,fontWeight:700}}>合計（予想）</span>
              <span style={{fontSize:14,fontWeight:700,color:"var(--p)"}}>{toeic}点</span>
            </div>
          </div>

          {total<3&&(
            <div style={{background:"var(--pl)",borderRadius:"var(--r)",padding:"14px 16px",border:"1px solid var(--cbb)"}}>
              <div className="jp" style={{fontSize:13,fontWeight:700,color:"var(--pd)",marginBottom:6}}>💡 精度を上げるには</div>
              <div className="jp" style={{fontSize:12,color:"var(--p)",lineHeight:1.7}}>単語・文法・リスニングを各1回以上受けるとTOEIC予想スコアの精度が向上します。</div>
              <button className="bp" style={{marginTop:12,width:"100%",fontSize:13}} onClick={()=>{setScreen("main");setNavTab("learn");}}>テストを受ける →</button>
            </div>
          )}
        </div>
        <div style={{height:20}}/>
      </div>
    );
  };

  // ── VIDEO ───────────────────────────────────────────────────────
  const VideoScreen = () => (
    <div className="sa">
      {/* AI生成中バナー */}
      {proc.active && proc.videoId === curVid?.videoId && (
        <div style={{background:'linear-gradient(135deg,#1D4ED8,#2563EB)',padding:'10px 16px',display:'flex',alignItems:'center',gap:10}}>
          <div className="spin" style={{borderColor:'rgba(255,255,255,.4)',borderTopColor:'white'}}/>
          <div>
            <div style={{color:'white',fontSize:13,fontWeight:600,fontFamily:"'Noto Sans JP'"}}>
              {proc.step==='transcript'?'📡 字幕を取得中...':proc.step==='ai'?'🤖 AIがChunkを生成中...':'💾 保存中...'}
            </div>
            <div style={{color:'rgba(255,255,255,.7)',fontSize:11}}>{proc.pct}% 完了</div>
          </div>
        </div>
      )}
      {/* 字幕なしバナー（非AI動画） */}
      {!proc.active && !captionCache[curVid?.videoId] && !DUMMY_CAPTIONS[curVid?.videoId] && (
        <div style={{background:'var(--al)',padding:'10px 16px',display:'flex',alignItems:'center',gap:8}}>
          <span>⚠️</span>
          <div className="jp" style={{fontSize:12,color:'#92400E'}}>字幕データがありません。ホームで「AI字幕生成」を実行してください。</div>
        </div>
      )}
      <div className="ytc">
        <iframe src={`https://www.youtube.com/embed/${curVid?.videoId}?rel=0&modestbranding=1&cc_load_policy=1&cc_lang_pref=en`}
          allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen title="YouTube"/>
      </div>
      <div className="cap-nav">
        <button className="cbtn cbtn-g" style={{padding:"6px 10px"}} onClick={()=>setCapIdx(i=>Math.max(0,i-1))} disabled={capIdx===0}>{I({n:"chL",s:16})} 前</button>
        <div className="cap-cnt">{capIdx+1} / {caps.length}</div>
        <button className="cbtn cbtn-g" style={{padding:"6px 10px"}} onClick={()=>setCapIdx(i=>Math.min(caps.length-1,i+1))} disabled={capIdx===caps.length-1}>次 {I({n:"chR",s:16})}</button>
      </div>
      {curCap&&(
        <div className="cap-panel">
          <div className="slbl">English</div>
          <div className="cap-en">{curCap.english}</div>
          <div className="slbl">語順（Chunk）</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:13}}>
            {curCap.chunks.map((c,i)=>(
              <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <span className="chnk">{c}</span>
                {i<curCap.chunks.length-1&&<span className="csep">/</span>}
              </span>
            ))}
          </div>
          <div className="slbl" style={{marginTop:12}}>日本語イメージ</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {curCap.meaning.map((m,i)=>(
              <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <span className="mng">{m}</span>
                {i<curCap.meaning.length-1&&<span className="csep">/</span>}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="ctrlbar">
        <button className="cbtn cbtn-g" onClick={()=>t$("⏪ 5秒戻る")}>⏪ 5秒</button>
        <button className={`cbtn cbtn-s${curCap&&isSaved(curCap.id)?" on":""}`}
          onClick={()=>{
            if(!curCap)return;
            if(isSaved(curCap.id)){setSaved(p=>p.filter(s=>s.id!==curCap.id));dbDeleteLine(curCap.id);t$("保存解除");}
            else{
              const newLine={...curCap,videoTitle:curVid?.title,savedAt:Date.now()};
              setSaved(p=>[newLine,...p]);
              dbSaveLine(newLine);
              t$("⭐ 保存しました！");
            }
          }}>
          {I({n:curCap&&isSaved(curCap.id)?"bkmkF":"bkmk",s:14})}
          {curCap&&isSaved(curCap.id)?"保存済":"保存"}
        </button>
        <button className="cbtn cbtn-sh" onClick={()=>setShwShow(true)}>{I({n:"mic",s:14})} シャドー</button>
        <button className="cbtn cbtn-g" style={{marginLeft:"auto"}}
          onClick={()=>{if(myList.some(v=>v.videoId===curVid.videoId)){setMyList(p=>p.filter(v=>v.videoId!==curVid.videoId));dbRemovePlaylist(curVid.videoId);t$("マイリスト削除");}else{setMyList(p=>[...p,curVid]);dbAddPlaylist(curVid);t$("📌 追加！");}}}>
          {myList.some(v=>v.videoId===curVid?.videoId)?"📌 MY済":"📌 MY追加"}
        </button>
      </div>
      {affVis&&sett.affOn&&(
        <div style={{paddingTop:8}}>
          <div className="afcard" style={{borderColor:afCard.color+"40",background:afCard.color+"08"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div className="afbdg" style={{background:afCard.color+"20",color:afCard.color}}>おすすめ</div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:3,fontFamily:"'Noto Sans JP'"}}>{afCard.emoji} {afCard.title}</div>
                <div style={{fontSize:12,color:"var(--t2)",marginBottom:10,fontFamily:"'Noto Sans JP'"}}>{afCard.desc}</div>
              </div>
              <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--t3)",padding:4}} onClick={()=>setAffVis(false)}>{I({n:"close",s:16})}</button>
            </div>
            <button className="afcta" style={{background:afCard.color}} onClick={()=>{
                    logAffiliateClick(afCard.key ?? '', afCard.title, toeic);
                    if (afCard.url && afCard.url !== '#') window.open(afCard.url,'_blank','noopener');
                    else t$('🔗 外部サービスへ（URL未設定 - lib/affiliateConfig.tsで設定）');
                  }}>{afCard.cta}</button>
          </div>
        </div>
      )}
      <div style={{height:20}}/>
    </div>
  );

  // ── SAVED ───────────────────────────────────────────────────────
  const Saved = () => (
    <div className="sa">
      {saved.length===0?(
        <div className="empty"><div style={{fontSize:44,marginBottom:10}}>🔖</div><div className="jp" style={{fontSize:14,fontWeight:600,color:"var(--t2)",marginBottom:4}}>保存した文はありません</div><div className="jp" style={{fontSize:12}}>動画を見ながら気になる文を保存しましょう</div></div>
      ):(
        <>
          <div style={{padding:"12px 16px 4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div className="jp" style={{fontSize:13,color:"var(--t3)"}}>{saved.length}件保存済み</div>
            <button className="bg" style={{fontSize:12,padding:"6px 10px"}} onClick={()=>openRew(()=>t$("🔓 復習ボーナス解放！"))}>📺 広告で復習ボーナス</button>
          </div>
          <div className="slist">
            {saved.map(line=>(
              <div key={line.id+line.savedAt} className="scard">
                {I({n:"star",s:18,c:"#F59E0B"})}
                <div style={{flex:1,minWidth:0}}>
                  {line.videoTitle&&<div style={{fontSize:11,color:"var(--p)",marginBottom:2,fontWeight:500}}>{line.videoTitle}</div>}
                  <div style={{fontSize:13,fontWeight:600,color:"var(--t)",marginBottom:5,lineHeight:1.5}}>{line.english}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {line.chunks.map((c,i)=><span key={i} className="chnk" style={{fontSize:11,padding:"3px 7px"}}>{c}</span>)}
                  </div>
                </div>
                <button style={{flexShrink:0,padding:4,cursor:"pointer",border:"none",background:"none",color:"var(--t3)"}} onClick={()=>{setSaved(s=>s.filter(l=>!(l.id===line.id&&l.savedAt===line.savedAt)));dbDeleteLine(line.id);}}>{I({n:"trash",s:16})}</button>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{height:20}}/>
    </div>
  );

  // ── GACHA ───────────────────────────────────────────────────────
  const Gacha = () => {
    const canRead = prJpText.trim().length > 0;
    if (prMode === 'input') {
      return (
        <div className="sa">
        <div className="gcon">
        <div style={{marginBottom:20}}>
          <div className="gbc">
            <div className="gbi">
              {["#EF4444","#3B82F6","#10B981","#F59E0B","#8B5CF6","#EC4899","#06B6D4","#84CC16","#F97316","#6366F1","#14B8A6","#EAB308"].map((c,i)=>(
                <div key={i} className="gb" style={{background:`radial-gradient(circle at 30% 30%,${c}dd,${c}88)`}}/>
              ))}
            </div>
          </div>
          <div className="gbase"><div className="ghole"/></div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:4}}>
              <div className="gpts">🪙<span>{wallet.coins} coins</span></div>
              {wallet.gacha_tickets > 0 && <div className="gpts" style={{background:"#DBEAFE",color:"#1D4ED8"}}>🎰<span>チケット×{wallet.gacha_tickets}</span></div>}
            </div>
            <div className="jp" style={{fontSize:11,color:"var(--t3)",marginBottom:18}}>本日残り {dailyGachaLeft} 回</div>
        {gRes&&<div className="gres"><div style={{fontSize:44,marginBottom:6}}>{gRes.emoji}</div><div style={{fontSize:15,fontWeight:700,color:"#78350F",fontFamily:"'Noto Sans JP'"}}>{gRes.text}</div>{gRes.pts>0&&<div style={{fontSize:13,color:"#92400E",marginTop:4}}>+{gRes.pts}pt ゲット！</div>}</div>}
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          <button className="bp" style={{flex:1,fontSize:13}} onClick={()=>doGacha('free')} disabled={dailyGachaLeft<=0}>
                  🎰 {dailyGachaLeft>0?"無料ガチャ":"本日終了"}
                </button>
          <button className="bp" style={{flex:1,fontSize:12,background:"#7C3AED"}} onClick={()=>doGacha('coin')} disabled={wallet.coins<10}>
                  🪙10枚でガチャ
                </button>
            </div>

            {/* 日本語訳入力 */}
            <div>
              <div className="pr-input-label">
                <span style={{fontSize:14}}>🇯🇵</span>
                <span>日本語訳（任意）</span>
                <span style={{fontSize:11,color:"var(--t3)",marginLeft:"auto"}}>Google翻訳等で取得</span>
              </div>
              <textarea
                className="pr-textarea jp"
                rows={5}
                placeholder={"Google翻訳やDeepL等で翻訳した日本語を貼り付けてください。\n空欄でも英文のみで読めます。"}
                value={prJpText}
                onChange={e => setPrJpText(e.target.value)}
              />
            </div>

            {/* ガイド */}
            <div style={{background:"var(--pl)",borderRadius:"var(--rs)",padding:"12px 14px"}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--p)",marginBottom:7}}>💡 使い方</div>
              {[
                "① 英文を貼り付け → Google翻訳等で翻訳",
                "② 翻訳文も貼り付け → 「読む」ボタンを押す",
                "③ 英文の単語をタップ → 単語を保存",
                "④ 英文の文をタップ → フレーズを保存",
                "⑤ 貯まった単語でシューティングゲーム！",
              ].map(s => <div key={s} className="jp" style={{fontSize:11,color:"var(--p)",lineHeight:1.8}}>{s}</div>)}
            </div>

            {/* 読むボタン */}
            <button
              className="bp"
              style={{width:"100%",fontSize:15,padding:"13px"}}
              disabled={!canRead}
              onClick={() => setPrMode('read')}
            >
              {canRead ? "📖 対訳表示で読む →" : "英文を貼り付けてください"}
            </button>

            {/* 保存済み単語 */}
            {prSaved.length > 0 && (
              <div style={{background:"var(--sur)",borderRadius:"var(--r)",padding:"14px 16px",boxShadow:"var(--sh)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:700,color:"var(--t2)",fontFamily:"'Noto Sans JP'"}}>
                    ⭐ 保存済み（{prSaved.length}件）
                  </div>
                  <button
                    style={{fontSize:12,fontWeight:700,color:"#fff",background:"#EF4444",border:"none",borderRadius:20,padding:"4px 10px",cursor:"pointer",fontFamily:"'Noto Sans JP'"}}
                    onClick={startWordShooter}
                  >
                    🎮 シューティング
                  </button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {prSaved.slice(0,5).map(item => (
                    <div key={item.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 10px",background:"var(--bg)",borderRadius:"var(--rs)"}}>
                      <span style={{fontSize:11,background:item.type==="word"?"var(--pl)":"#F0FDF4",color:item.type==="word"?"var(--p)":"#059669",padding:"2px 6px",borderRadius:4,fontWeight:600,flexShrink:0}}>
                        {item.type==="word"?"単語":"文"}
                      </span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:"var(--t)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.word}</div>
                        {item.memo&&<div className="jp" style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{item.memo}</div>}
                      </div>
                      <button style={{flexShrink:0,padding:2,border:"none",background:"none",cursor:"pointer",color:"var(--t3)"}}
                        onClick={()=>setPrSaved(p=>p.filter(x=>x.id!==item.id))}>
                        {I({n:"close",s:14})}
                      </button>
                    </div>
                  ))}
                  {prSaved.length > 5 && (
                    <div className="jp" style={{fontSize:11,color:"var(--t3)",textAlign:"center"}}>他 {prSaved.length-5} 件...</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div style={{height:20}}/>
        </div>
      );
    }

    // ── 読むモード ────────────────────────────────────────────────
    const sentences = prSplitSentences(prEnText);
    const hasJp = prJpText.trim().length > 0;

    return (
      <div className="pr-wrap">
        {/* ツールバー */}
        <div className="pr-toolbar">
          <button
            className={`pr-sync-btn ${prSyncScroll ? "pr-sync-on" : "pr-sync-off"}`}
            onClick={() => setPrSyncScroll(p => !p)}
          >
            {prSyncScroll ? "🔗 同期ON" : "🔗 同期OFF"}
          </button>
          <button className="pr-action-btn" style={{background:"var(--al)",color:"#92400E",border:"1px solid #FDE68A"}}
            onClick={() => { setPrMode('input'); setPrPopup(false); }}>
            ✏️ 編集
          </button>
          {prSaved.length > 0 && (
            <button className="pr-action-btn" style={{background:"#FEE2E2",color:"#991B1B",border:"1px solid #FECACA"}}
              onClick={startWordShooter}>
              🎮 {prSaved.length}語でシュート
            </button>
          )}
          <div style={{marginLeft:"auto",fontSize:11,color:"var(--t3)",fontFamily:"'Noto Sans JP'",flexShrink:0}}>
            単語/文タップで保存
          </div>
        </div>

        {/* 英文エリア */}
        <div
          className="pr-half pr-half-en"
          ref={el => { prEnRefEl.current = el; }}
          onScroll={handlePrScroll('en')}
          style={{flex: hasJp ? 1 : 2}}
        >
          <div className="pr-half-label pr-half-label-en">
            <span>🇺🇸 ENGLISH</span>
            <span style={{fontSize:10,opacity:.7}}>{sentences.length}文</span>
          </div>
          <div className="pr-text">
            {sentences.map((sent, si) => {
              const words = sent.split(/(\s+)/);
              const isSel = prSelSent?.sentence === sent;
              return (
                <span
                  key={si}
                  className={`pr-sent${isSel ? " sel" : ""}`}
                  onClick={e => {
                    const target = e.target as HTMLElement | null;
                    if (target?.classList?.contains('pr-word')) return;
                    handlePrSentTap(sent);
                  }}
                >
                  {words.map((chunk, wi) => {
                    if (/^\s+$/.test(chunk)) return <span key={wi}>{chunk}</span>;
                    const clean = chunk.replace(/[^a-zA-Z''-]/g, '');
                    const isWSel = prSelWord?.word === clean && clean.length >= 2;
                    return (
                      <span
                        key={wi}
                        className={`pr-word${isWSel ? " sel" : ""}`}
                        onClick={e => { e.stopPropagation(); handlePrWordTap(chunk); }}
                      >{chunk}</span>
                    );
                  })}
                  {" "}
                </span>
              );
            })}
          </div>
        </div>

        {/* 区切り線 */}
        {hasJp && <div className="pr-divider"/>}

        {/* 日本語エリア */}
        {hasJp && (
          <div
            className="pr-half pr-half-jp"
            ref={el => { prJpRefEl.current = el; }}
            onScroll={handlePrScroll('jp')}
          >
            <div className="pr-half-label pr-half-label-jp">
              <span>🇯🇵 日本語訳</span>
              <span style={{fontSize:10,opacity:.7}}>参考訳</span>
            </div>
            <div className="pr-text pr-text-jp">{prJpText}</div>
          </div>
        )}

        {/* 保存ポップアップ */}
        {prPopup && (prSelWord || prSelSent) && (
          <div className="pr-popup">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"var(--t3)",marginBottom:3,fontFamily:"'Noto Sans JP'"}}>
                  {prSelWord ? "📌 単語を保存" : "📌 フレーズを保存"}
                </div>
                <div style={{fontSize:15,fontWeight:700,color:"var(--t)",maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {prSelWord ? prSelWord.word : prSelSent?.sentence?.slice(0,50)+'...'}
                </div>
              </div>
              <button style={{border:"none",background:"none",cursor:"pointer",color:"var(--t3)",padding:4}}
                onClick={() => { setPrPopup(false); setPrSelWord(null); setPrSelSent(null); }}>
                {I({n:"close",s:18})}
              </button>
            </div>
            <input
              placeholder="メモ（意味・コメントなど）"
              value={prMemo}
              onChange={e => setPrMemo(e.target.value)}
              style={{width:"100%",padding:"9px 12px",border:"1.5px solid var(--bd)",borderRadius:"var(--rs)",fontSize:13,outline:"none",fontFamily:"'Noto Sans JP',sans-serif",marginBottom:10,background:"var(--bg)"}}
              onKeyDown={e => e.key==="Enter" && handlePrSave()}
            />
            <button className="bp" style={{width:"100%"}} onClick={handlePrSave}>
              ⭐ 保存する
            </button>
          </div>
        )}
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // WORD SHOOTER SCREEN
  // ════════════════════════════════════════════════════════════════
  const WordShooter = () => {
    // @ts-ignore: ws state may be referenced from outer component scope
    const hpPct = wsMaxLives > 0 ? (wsLives / wsMaxLives) * 100 : 0;
    const hpColor = hpPct > 60 ? '#10B981' : hpPct > 30 ? '#F59E0B' : '#EF4444';

    // ── 装備選択画面 ──────────────────────────────────────────
    // @ts-ignore: ws state may be referenced from outer component scope
    if (wsPhaseScreen === 'equip') {
      const SKILL_DEFS = [
        {key:'shield', emoji:'🛡️', name:'シールド', desc:'HP+1（最大6）'},
        {key:'slow',   emoji:'🐢', name:'スロー',   desc:'時間を8秒延長'},
        {key:'hint',   emoji:'💡', name:'ヒント',   desc:'単語の先頭を光らせる'},
        {key:'heal',   emoji:'💚', name:'HP回復',   desc:'ピンチ時にHP+1'},
      ];
      return (
        <div className="eq-wrap">
          <div style={{textAlign:'center',marginBottom:4}}>
            <div className="eq-title">🎮 ステージ準備</div>
            <div className="eq-sub">スキルを最大3つ装備して開始（ガチャでチケット獲得）</div>
          </div>
          <div className="eq-grid">
            {SKILL_DEFS.map(({key,emoji,name,desc}) => {
              // @ts-ignore: external state references inside WordShooter
              const stock = (gachaSkillStock as any)[key] ?? 0;
              // @ts-ignore: external state references inside WordShooter
              const equipped = wsEquipped.includes(key);
              return (
                <div key={key}
                  className={`eq-card ${equipped?'equipped':''} ${stock<=0&&!equipped?'disabled':''}`}
                  // @ts-ignore: external helper call in WordShooter
                  onClick={() => stock>0||equipped ? toggleEquip(key) : t$(`${name}のチケットがありません`)}
                >
                  <div className="eq-icon">{emoji}</div>
                  <div className="eq-name">{name}</div>
                  <div className="eq-desc">{desc}</div>
                  <div className="eq-count">在庫 {stock}</div>
                  {equipped && <div style={{fontSize:10,color:'#F59E0B',marginTop:4,fontWeight:700}}>✅ 装備中</div>}
                </div>
              );
            })}
          </div>
          <div style={{background:'rgba(255,255,255,.05)',borderRadius:10,padding:'12px 14px',fontSize:12,color:'#64748B',fontFamily:"'Noto Sans JP'",lineHeight:1.7}}>
            💡 装備はガチャ（10pt）で入手。スキルなしでも挑戦できます。
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="bg" style={{flex:1,color:'#94A3B8',borderColor:'rgba(255,255,255,.1)'}}
              onClick={()=>{setWsActive(false);setWsPhaseScreen('equip');}}>戻る</button>
            <button className="bp" style={{flex:2,fontSize:15}} onClick={startWordShooter}>
              ▶ ゲーム開始
            </button>
          </div>
          {/* ガチャへのショートカット */}
          <button style={{background:'linear-gradient(135deg,#7C3AED,#2563EB)',border:'none',borderRadius:10,padding:'10px',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'Noto Sans JP'"}}
            onClick={()=>{setWsActive(false);setNavTab('gacha');}}>
            🎰 ガチャでスキルチケットを入手する
          </button>
        </div>
      );
    }

    // ── 結果画面 ───────────────────────────────────────────────
    if (wsPhase === 'result' || wsPhaseScreen === 'result') {
      const star = wsLives >= wsMaxLives ? '🌟' : wsLives >= 3 ? '⭐' : wsLives >= 1 ? '✨' : '💀';
      const cleared = wsWordQueue.length === 0;
      if (cleared && wsScore > 0) {
        // ステージクリア報酬
        setTimeout(() => { setPts(p => p + 20); setGachaSkillStock(s => ({...s, hint: ((s as any).hint||0)+1})); }, 100);
      }
      return (
        <div className="ws-wrap">
          <div className="ws-result">
            <div style={{fontSize:52}}>{star}</div>
            <div style={{fontSize:26,fontWeight:700,color:'#fff',marginBottom:4}}>スコア {wsScore}</div>
            <div style={{display:'flex',gap:4,marginBottom:10}}>
              {Array.from({length:wsMaxLives},(_,i)=>(
                <span key={i} style={{fontSize:16,opacity:i<wsLives?1:.25}}>❤️</span>
              ))}
            </div>
            <div className="ws-coin-badge" style={{marginBottom:8}}>🪙 {wsCoins} コイン</div>
            {cleared && <div className="jp" style={{fontSize:13,color:'#34D399',fontWeight:700,marginBottom:8}}>🎉 ステージクリア！ +20pt / ヒントチケット×1</div>}
            <div className="jp" style={{fontSize:13,color:'#94A3B8',marginBottom:20,textAlign:'center',lineHeight:1.7}}>
              {wsScore >= 100 ? '🔥 パーフェクト！単語マスター！' : wsScore >= 60 ? '👍 よくできました！' : '💪 もう一度挑戦！'}
            </div>
            <div style={{display:'flex',gap:10,width:'100%'}}>
              <button className="bg" style={{flex:1,color:'#94A3B8',borderColor:'rgba(255,255,255,.1)'}}
                onClick={()=>{setWsActive(false);setWsPhaseScreen('equip');}}>戻る</button>
              <button className="bp" style={{flex:1}} onClick={openEquipScreen}>もう一度</button>
            </div>
          </div>
        </div>
      );
    }

    // ── プレイ画面（4択方式）────────────────────────────────────
    return (
      <div className="ws-wrap">
        {/* ヘッダー */}
        <div className="ws-header">
          <div>
            <div className="ws-score">🎯 {wsScore}</div>
            {wsCombo > 1 && <div style={{fontSize:11,color:'#F59E0B',fontWeight:700}}>COMBO ×{wsCombo}</div>}
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
            <div className="ws-coin-badge">🪙 {wsCoins}</div>
            <div className="ws-lives">
              {Array.from({length:wsMaxLives},(_,i)=>(
                <span key={i} style={{fontSize:i<wsLives?16:12,opacity:i<wsLives?1:.2}}>❤️</span>
              ))}
            </div>
          </div>
          <button style={{border:'none',background:'rgba(255,255,255,.08)',color:'#64748B',borderRadius:20,padding:'5px 10px',cursor:'pointer',fontSize:11}}
            onClick={()=>{setWsPhase('result');setWsPhaseScreen('result');}}>終了</button>
        </div>

        {/* HP バー */}
        <div className="ws-hp-bar-wrap">
          <div className="ws-hp-track">
            <div className="ws-hp-fill" style={{width:`${hpPct}%`,background:hpColor}}/>
          </div>
        </div>

        {/* スキルバー */}
        <div className="ws-skill-bar">
          {([
            {key:'slow' as const, label:'🐢', color:'#6366F1'},
            {key:'hint' as const, label:'💡', color:'#F59E0B'},
            {key:'heal' as const, label:'💚', color:'#10B981'},
          ]).map(({key,label,color}) => (
            <button key={key}
              className={`ws-skill-btn ${wsSkills[key]>0?'ready':''}`}
              style={{background:wsSkills[key]>0?color+'33':'rgba(255,255,255,.05)',
                      color:wsSkills[key]>0?color:'#334155',
                      border:`1px solid ${wsSkills[key]>0?color+'66':'rgba(255,255,255,.08)'}`}}
              disabled={wsSkills[key]<=0}
              onClick={()=>useWsSkill(key)}
            >
              {label} <span style={{fontSize:9}}>×{wsSkills[key]}</span>
            </button>
          ))}
          <button className="ws-skill-btn"
            style={{background:'rgba(251,191,36,.1)',color:'#FCD34D',border:'1px solid rgba(251,191,36,.2)',flexShrink:0,minWidth:52}}
            disabled={wsCoins < 5} onClick={wsGachaSkill}>
            🎰<br/><span style={{fontSize:9}}>{wsCoins}/5</span>
          </button>
        </div>

        {/* フィールド: 落下する英単語 */}
        <div className="ws-field">
          {wsFlash && <div className="ws-miss-flash"/>}

          {/* 不正解ポップアップ */}
          {wsWrong && (
            <div className="ws-wrong-popup" style={{left:8,right:8,bottom:8}}>
              <div style={{color:'#EF4444',fontSize:11,fontWeight:700,marginBottom:4}}>❌ ミス！</div>
              <div style={{color:'#fff',fontSize:15,fontWeight:700}}>{wsCurrentWord?.en || wsWrong.en}</div>
              <div style={{color:'#94A3B8',fontSize:12,fontFamily:"'Noto Sans JP'",marginTop:2}}>
                正解の意味: {wsCurrentWord?.jp}
              </div>
              {wsWrong.jp && wsWrong.jp !== wsCurrentWord?.jp && (
                <div style={{color:'#60A5FA',fontSize:11,marginTop:3,fontFamily:"'Noto Sans JP'"}}>
                  あなたが選んだ日本語の英語: {wsWrong.jp}
                </div>
              )}
            </div>
          )}

          {/* 落下する英単語 */}
          {wsCurrentWord && !wsChoiceResult?.sel && (
            <div
              className="ws-word"
              style={{
                left:`${wsCurrentWord.x}%`,
                animationDuration: wsSlowed ? '18s' : '9s',
                animationDelay: '0s',
              }}
              onAnimationEnd={() => {
                // 時間切れ → HP減少 → 次の問題
                handleWsChoice('__timeout__');
              }}
            >
              <div className="ws-word-en">
                {wsSkills.hint > 0
                  ? <><span style={{color:'#FCD34D',textDecoration:'underline'}}>{wsCurrentWord.en[0]}</span>{wsCurrentWord.en.slice(1)}</>
                  : wsCurrentWord.en
                }
              </div>
            </div>
          )}
          {/* 正解時の消滅アニメ */}
          {wsCurrentWord && wsChoiceResult?.sel === wsCurrentWord.jp && (
            <div className="ws-word ws-hit" style={{left:`${wsCurrentWord.x}%`,top:'40%'}}>
              <div className="ws-word-en" style={{background:'rgba(16,185,129,.8)'}}>{wsCurrentWord.en} ✅</div>
            </div>
          )}

          {wsWordQueue.length === 0 && !wsCurrentWord && wsPhase === 'play' && (
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{color:'#fff',fontSize:22,fontWeight:700}}>🎉 クリア！</div>
            </div>
          )}

          {/* 残り問題数 */}
          <div className="ws-active-count">残り {wsWordQueue.length + (wsCurrentWord ? 1 : 0)}</div>
        </div>

        {/* 4択エリア */}
        <div className="ws-choices">
          {wsChoices.map((jp, i) => {
            const isSelected = wsChoiceResult?.sel === jp;
            const isCorrect  = wsChoiceResult && jp === wsChoiceResult.correct;
            const isWrong    = isSelected && jp !== wsChoiceResult?.correct;
            return (
              <button
                key={i}
                className={`ws-choice ${isCorrect?'correct':''} ${isWrong?'wrong':''}`}
                disabled={!!wsChoiceResult}
                onClick={() => handleWsChoice(jp)}
              >
                {jp}
              </button>
            );
          })}
        </div>
      </div>
    );
  };;

  // ════════════════════════════════════════════════════════════════
  // NEWS SCREENS
  // ════════════════════════════════════════════════════════════════

  // ── ニュースハブ ─────────────────────────────────────────────
  const NewsHub = () => (
    <div className="sa">
      <div className="nhub">
        <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:.5,padding:"0 2px"}}>
          📰 英語ニュース学習
        </div>

        {/* ── 対訳リーダー（メイン機能）── */}
        <div style={{background:"linear-gradient(135deg,#1D4ED8,#7C3AED)",borderRadius:"var(--r)",padding:"18px 16px",color:"#fff",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.06)",top:-20,right:-20}}/>
          <div style={{fontSize:11,fontWeight:700,opacity:.8,textTransform:"uppercase",letterSpacing:.5,marginBottom:6,fontFamily:"'Noto Sans JP'"}}>⭐ おすすめ</div>
          <div style={{fontSize:18,fontWeight:700,marginBottom:4}}>📖 対訳リーダー</div>
          <div className="jp" style={{fontSize:12,opacity:.85,lineHeight:1.7,marginBottom:14}}>
            英文と翻訳を貼り付けて上下対訳表示。<br/>
            単語・フレーズをタップして単語帳に保存。<br/>
            シューティングゲームで記憶定着！
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {["🔗 同時スクロール","👆 単語タップ保存","🎮 シューティング"].map(f=>(
              <span key={f} className="jp" style={{fontSize:11,background:"rgba(255,255,255,.15)",padding:"3px 8px",borderRadius:10}}>{f}</span>
            ))}
          </div>
          <button
            style={{background:"rgba(255,255,255,.95)",color:"#1D4ED8",border:"none",borderRadius:"var(--rs)",padding:"10px 20px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Noto Sans JP'",width:"100%"}}
            onClick={() => setNewsScreen('parallelReader')}
          >
            {prSaved.length > 0 ? `📖 続きを読む（単語 ${prSaved.length}件保存済）` : "📖 対訳リーダーを開く →"}
          </button>
        </div>

        {/* ① News in Levels */}
        <div className="nsvc">
          <div className="nsvc-hd">
            <div className="nsvc-ico" style={{background:"#EFF6FF"}}>📊</div>
            <div>
              <div className="nsvc-t">News in Levels</div>
              <div className="nsvc-d">レベル別（1〜3）のニュース記事。初級〜上級まで対応</div>
            </div>
          </div>
          {[
            {lv:"Level 1",url:"https://www.newsinlevels.com/level-1/",desc:"易しい英語"},
            {lv:"Level 2",url:"https://www.newsinlevels.com/level-2/",desc:"中程度"},
            {lv:"Level 3",url:"https://www.newsinlevels.com/level-3/",desc:"本格的な英語"},
          ].map(({lv,url,desc})=>(
            <a key={lv} className="next" href={url} target="_blank" rel="noreferrer">
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:13,fontWeight:700,color:"var(--p)"}}>{lv}</div>
                <div style={{fontSize:11,color:"var(--t3)",fontFamily:"'Noto Sans JP'"}}>{desc}</div>
              </div>
              {I({n:"extlnk",s:16,c:"var(--p)"})}
            </a>
          ))}
        </div>

        {/* ② Breaking News English */}
        <div className="nsvc">
          <div className="nsvc-hd">
            <div className="nsvc-ico" style={{background:"#FFF7ED"}}>⚡</div>
            <div>
              <div className="nsvc-t">Breaking News English</div>
              <div className="nsvc-d">最新ニュース＋リスニング＋語彙問題つき</div>
            </div>
          </div>
          {[
            {name:"最新記事一覧",url:"https://breakingnewsenglish.com/",desc:"今日のニュース"},
            {name:"リスニング練習",url:"https://breakingnewsenglish.com/listening.html",desc:"音声付き記事"},
          ].map(({name,url,desc})=>(
            <a key={name} className="next" href={url} target="_blank" rel="noreferrer">
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:13,fontWeight:700,color:"#C2410C"}}>{name}</div>
                <div style={{fontSize:11,color:"var(--t3)",fontFamily:"'Noto Sans JP'"}}>{desc}</div>
              </div>
              {I({n:"extlnk",s:16,c:"#C2410C"})}
            </a>
          ))}
        </div>

        {/* ③ BBC News（アプリ内学習） */}
        <div className="nsvc" style={{border:"2px solid var(--p)"}}>
          <div className="nsvc-hd">
            <div className="nsvc-ico" style={{background:"#1D4ED8",fontSize:16,color:"#fff",fontWeight:700}}>BBC</div>
            <div style={{flex:1}}>
              <div className="nsvc-t">BBC News <span style={{fontSize:11,background:"var(--pl)",color:"var(--p)",padding:"1px 6px",borderRadius:4,fontWeight:600,marginLeft:4}}>アプリ内学習</span></div>
              <div className="nsvc-d">単語・文タップで即翻訳。全文翻訳ボタン付き</div>
            </div>
          </div>
          <div style={{padding:"0 16px 6px",display:"flex",flexWrap:"wrap",gap:6}}>
            {["英語の特徴","単語タップ → 意味","文タップ → 和訳","全文翻訳OFF→必要時だけON"].map(f=>(
              <span key={f} style={{fontSize:11,background:"var(--pl)",color:"var(--p)",padding:"3px 8px",borderRadius:10,fontWeight:500,fontFamily:"'Noto Sans JP'"}}>{f}</span>
            ))}
          </div>
          <button className="next" style={{color:"var(--p)",background:"var(--pl)",borderTop:"2px solid var(--p)"}} onClick={openBBCList}>
            <span className="jp" style={{fontSize:14,fontWeight:700}}>🗞️ BBC記事を読む（学習モード）</span>
            {I({n:"chR",s:18,c:"var(--p)"})}
          </button>
        </div>

        {/* 使い方ガイド */}
        <div style={{background:"var(--sur)",borderRadius:"var(--r)",padding:"14px 16px",boxShadow:"var(--sh)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"var(--t2)",marginBottom:10,fontFamily:"'Noto Sans JP'"}}>💡 使い方ガイド</div>
          {[
            {icon:"1️⃣",text:"BBC記事をアプリ内で読む（翻訳は出さない）"},
            {icon:"2️⃣",text:"わからない単語をタップ → 意味を確認"},
            {icon:"3️⃣",text:"わからない文をタップ → 日本語訳を確認"},
            {icon:"4️⃣",text:"全部読み終えたら全文翻訳で確認"},
          ].map(({icon,text})=>(
            <div key={icon} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
              <span style={{fontSize:16,flexShrink:0}}>{icon}</span>
              <span className="jp" style={{fontSize:12,color:"var(--t2)",lineHeight:1.6}}>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{height:20}}/>
    </div>
  );

  // ── BBC記事リスト ─────────────────────────────────────────────
  const BBCList = () => {
    const CATS = [
      {id:"world",label:"🌍 世界"},
      {id:"science",label:"🔬 科学"},
      {id:"tech",label:"💻 テクノロジー"},
      {id:"business",label:"📈 ビジネス"},
    ];
    return (
      <div className="sa">
        <div className="ncat-tabs">
          {CATS.map(({id,label})=>(
            <button key={id} className={`ncat ${bbcFeed===id?"on":"off"}`} onClick={()=>loadBBCFeed(id)}>{label}</button>
          ))}
        </div>
        {bbcLoading&&(
          <div style={{padding:"40px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
            <div className="spin" style={{width:28,height:28,borderWidth:3}}/>
            <div className="jp" style={{fontSize:13,color:"var(--t3)"}}>BBC RSSを読み込み中...</div>
          </div>
        )}
        {!bbcLoading&&bbcArticles.length===0&&(
          <div className="empty">
            <div style={{fontSize:40,marginBottom:10}}>📡</div>
            <div className="jp" style={{fontSize:14,fontWeight:600,color:"var(--t2)",marginBottom:4}}>記事を取得できませんでした</div>
            <div className="jp" style={{fontSize:12,marginBottom:16}}>接続を確認して再試行してください</div>
            <button className="bp" onClick={()=>loadBBCFeed(bbcFeed)}>再読み込み</button>
          </div>
        )}
        {!bbcLoading&&bbcArticles.length>0&&(
          <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div className="jp" style={{fontSize:12,color:"var(--t3)"}}>{bbcArticles.length}件の記事</div>
              <a href="https://www.bbc.com/news" target="_blank" rel="noreferrer" style={{fontSize:11,color:"var(--p)",display:"flex",alignItems:"center",gap:4,fontWeight:600,textDecoration:"none"}}>
                BBC.comで開く {I({n:"extlnk",s:12,c:"var(--p)"})}
              </a>
            </div>
            {bbcArticles.map(art=>(
              <button key={art.id} className="nacard" onClick={()=>openBBCArticle(art)}>
                <div className="nacard-t">{art.title}</div>
                <div className="nacard-d jp">{art.description}</div>
                <div className="nacard-m">
                  <span style={{fontSize:11,background:"var(--pl)",color:"var(--p)",padding:"2px 6px",borderRadius:4,fontWeight:600}}>BBC</span>
                  <span>{new Date(art.pubDate).toLocaleDateString("ja-JP",{month:"short",day:"numeric"})}</span>
                  <span style={{marginLeft:"auto",color:"var(--p)",fontWeight:600}}>読む →</span>
                </div>
              </button>
            ))}
          </div>
        )}
        <div style={{height:20}}/>
      </div>
    );
  };

  // ── BBC記事リーダー（学習モード）─────────────────────────────
  const BBCReader = () => {
    if (!curArticle) return null;
    const fullText = curArticle.description;
    const sentences = splitSentences(fullText);

    const TransPanel = () => {
      const hasContent = selWord || selSent || showFull;
      return (
        <div className="tp">
          {/* ツールバー */}
          <div className="tp-bar">
            <button className={`tpbtn tpbtn-g${showFull?" on":""}`} onClick={handleFullTrans}>
              {transLoading&&showFull ? <><div className="spin" style={{width:12,height:12,borderWidth:2}}/> 翻訳中...</> : showFull ? "📄 全文翻訳 ON" : "📄 全文翻訳"}
            </button>
            {hasContent&&(
              <button className="tpbtn tpbtn-g" onClick={()=>{setSelWord(null);setSelSent(null);setWordData(null);setSentData(null);setShowFull(false);}}>
                ✕ クリア
              </button>
            )}
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,fontSize:11,color:"var(--t3)",fontFamily:"'Noto Sans JP'",flexShrink:0}}>
              <span>単語タップ</span><span style={{color:"var(--bd)"}}>|</span><span>文タップ</span>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="tp-body">
            {transLoading&&(
              <div className="tp-ld">
                <div className="spin" style={{width:16,height:16,borderWidth:2}}/>
                <span>AIが翻訳中...</span>
              </div>
            )}

            {/* 単語の意味 */}
            {!transLoading&&selWord&&wordData&&(
              <div className="wm-box">
                <div className="wm-word">{selWord.word}</div>
                {wordData.pos&&<div className="wm-pos">{wordData.pos}</div>}
                <div className="wm-def">{wordData.meaning}</div>
                {wordData.example&&<div className="wm-ex">例：{wordData.example}</div>}
              </div>
            )}

            {/* 文の翻訳 */}
            {!transLoading&&selSent&&sentData&&(
              <div className="st-box">
                <div className="st-en">{selSent.sentence}</div>
                <div className="st-jp">{sentData}</div>
              </div>
            )}

            {/* 全文翻訳 */}
            {!transLoading&&showFull&&fullTrans&&(
              <div className="ft-box">{fullTrans}</div>
            )}

            {/* 空状態 */}
            {!transLoading&&!hasContent&&(
              <div className="tp-empty">
                <span style={{fontSize:28}}>👆</span>
                <span style={{fontSize:13,fontWeight:600}}>単語をタップ → 意味</span>
                <span style={{fontSize:12}}>文をタップ → 日本語訳</span>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="rd-wrap">
        {/* 記事本文エリア */}
        <div className="rd-art">
          <div className="rd-title">{curArticle.title}</div>
          <div className="rd-meta">
            <span style={{fontSize:12,background:"#1D4ED8",color:"#fff",padding:"2px 7px",borderRadius:4,fontWeight:700}}>BBC</span>
            <span>{new Date(curArticle.pubDate).toLocaleDateString("ja-JP",{year:"numeric",month:"short",day:"numeric"})}</span>
            <a href={curArticle.link} target="_blank" rel="noreferrer"
              style={{marginLeft:"auto",fontSize:11,color:"var(--p)",display:"flex",alignItems:"center",gap:3,fontWeight:600,textDecoration:"none"}}>
              原文を開く {I({n:"extlnk",s:11,c:"var(--p)"})}
            </a>
          </div>

          {/* 英文（インタラクティブ） */}
          <div className="rd-para">
            {sentences.map((sent, si) => {
              const words = sent.split(/(\s+)/);
              const isSentSel = selSent?.sentence === sent;
              return (
                <span
                  key={si}
                  className={`rd-sent${isSentSel?" hi":""}`}
                  onClick={(e) => {
                    // 単語クリックと文クリックを区別
                    if (e.target.classList.contains('rd-word')) return;
                    handleSentTap(sent);
                  }}
                >
                  {words.map((chunk, wi) => {
                    if (/^\s+$/.test(chunk)) return <span key={wi}>{chunk}</span>;
                    const clean = chunk.replace(/[^a-zA-Z'-]/g,'');
                    const isWordSel = selWord?.word === clean;
                    return (
                      <span
                        key={wi}
                        className={`rd-word${isWordSel?" hi":""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWordTap(chunk, sent);
                        }}
                      >{chunk}</span>
                    );
                  })}
                  {" "}
                </span>
              );
            })}
          </div>

          {/* 使い方ヒント */}
          <div style={{background:"var(--pl)",borderRadius:"var(--rs)",padding:"10px 12px",marginTop:4}}>
            <div className="jp" style={{fontSize:11,color:"var(--p)",lineHeight:1.7}}>
              💡 <b>単語タップ</b>で意味を表示　<b>文タップ</b>で和訳を表示<br/>
              まず英語だけで読んで、わからない部分だけ確認しよう
            </div>
          </div>
          <div style={{height:10}}/>
        </div>

        {/* 翻訳パネル（下部固定） */}
        <TransPanel/>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // PARALLEL READER HANDLERS
  // ════════════════════════════════════════════════════════════════
  const prEnRefEl = typeof window !== 'undefined' ? { current: null } : { current: null };
  const prJpRefEl = typeof window !== 'undefined' ? { current: null } : { current: null };

  // 同時スクロール
  const handlePrScroll = (src) => (e) => {
    if (!prSyncScroll) return;
    const ratio = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight || 1);
    const other = src === 'en' ? prJpRefEl.current : prEnRefEl.current;
    if (other) other.scrollTop = ratio * (other.scrollHeight - other.clientHeight);
  };

  // 英文を文単位に分割（インタラクティブ表示用）
  const prSplitSentences = (text) => {
    if (!text.trim()) return [];
    const sentRe = new RegExp('[^.!?\\n]+[.!?\\n]*', 'g');
    return text.match(sentRe)?.map(s => s.trim()).filter(Boolean) || [text];

  };

  // 単語タップ
  const handlePrWordTap = (word) => {
    const clean = word.replace(/[^a-zA-Z''-]/g, '');
    if (clean.length < 2) return;
    setPrSelWord({ word: clean });
    setPrSelSent(null);
    setPrPopup(true);
    setPrMemo('');
  };

  // 文タップ
  const handlePrSentTap = (sent) => {
    if (prSelSent?.sentence === sent) { setPrSelSent(null); return; }
    setPrSelSent({ sentence: sent });
    setPrSelWord(null);
    setPrPopup(true);
    setPrMemo('');
  };

  // 単語・文を保存
  const handlePrSave = () => {
    const item = prSelWord
      ? { id: Date.now()+'', type: 'word', word: prSelWord.word, meaning: '', memo: prMemo, date: new Date().toLocaleDateString('ja-JP') }
      : prSelSent
      ? { id: Date.now()+'', type: 'sent', word: prSelSent.sentence.slice(0, 60) + (prSelSent.sentence.length > 60 ? '...' : ''), meaning: '', memo: prMemo, date: new Date().toLocaleDateString('ja-JP') }
      : null;
    if (!item) return;
    setPrSaved(p => [item, ...p]);
    setPrPopup(false);
    setPrSelWord(null);
    setPrSelSent(null);
    t$('⭐ 保存しました！');
  };

  // シューター用に単語リストを準備
  // ── 問題プールを構築（API → 保存単語 → ダミー の順で取得）──
  const buildWordPool = (): {en:string;jp:string}[] => {
    if (wsQuizWords.length >= 4) return wsQuizWords;
    const saved2 = prSaved.filter((s:any) => s.type === 'word' && s.word && s.meaning);
    if (saved2.length >= 4) return saved2.map((s:any) => ({en:s.word, jp:s.meaning}));
    return [
      {en:'momentum', jp:'勢い'}, {en:'revenue', jp:'収益'}, {en:'mandate', jp:'指示'},
      {en:'efficient', jp:'効率的な'}, {en:'allocate', jp:'割り当てる'},
      {en:'acquire', jp:'取得する'}, {en:'negotiate', jp:'交渉する'},
      {en:'implement', jp:'実施する'}, {en:'facilitate', jp:'促進する'},
      {en:'collaborate', jp:'協力する'}, {en:'mandatory', jp:'義務的な'},
      {en:'comprehensive', jp:'包括的な'}, {en:'substantial', jp:'相当な'},
      {en:'tentative', jp:'暫定的な'}, {en:'proficient', jp:'熟練した'},
      {en:'streamline', jp:'合理化する'}, {en:'outsource', jp:'外部委託する'},
    ];
  };

  // ── 4択選択肢を生成（正解1 + ダミー3）────────────────────────
  const makeChoices = (correct: string, pool: {en:string;jp:string}[]): string[] => {
    const wrong = shuffle(pool.filter(w => w.jp !== correct)).slice(0, 3).map(w => w.jp);
    return shuffle([correct, ...wrong]);
  };

  // ── 次の問題をセット ─────────────────────────────────────────
  const nextQuestion = (queue: {en:string;jp:string}[]) => {
    if (!queue.length) {
      // クリア！
      setWsPhase('result');
      setWsActive(false);
      setWsCurrentWord(null);
      return;
    }
    const pool = buildWordPool();
    const [next, ...rest] = queue;
    setWsWordQueue(rest);
    setWsCurrentWord({ id: String(Date.now()), en: next.en, jp: next.jp, x: 15 + Math.random() * 60 });
    setWsChoices(makeChoices(next.jp, pool));
    setWsChoiceResult(null);
  };

  // ── ステージ開始 ─────────────────────────────────────────────
  const startWordShooter = async () => {
    // API から問題取得（失敗時はダミー）
    try {
      const r = await fetch('/api/quiz/generate', {
        method: 'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({quizType:'word', sourceType:'toeic', level:'level_600', count:16}),
      });
      if (r.ok) {
        const d = await r.json();
        if (Array.isArray(d.questions) && d.questions.length > 0) {
          setWsQuizWords(d.questions.map((q:any)=>({en:q.word??q.en??'', jp:q.meaning??q.jp??''})).filter((w:any)=>w.en&&w.jp));
        }
      }
    } catch { /* ダミーにフォールバック */ }

    setWsScore(0);
    setWsLives(wsEquipped.includes('shield') ? wsMaxLives + 1 : wsMaxLives);
    setWsMaxLives(wsEquipped.includes('shield') ? 6 : 5);
    setWsCoins(0);
    setWsHits([]);
    setWsWrong(null);
    setWsFlash(false);
    setWsCombo(0);
    // 装備からスキル回数を決定
    const skillCount = {
      slow:  wsEquipped.filter(e=>e==='slow').length,
      hint:  wsEquipped.filter(e=>e==='hint').length,
      heal:  wsEquipped.filter(e=>e==='heal').length,
    };
    setWsSkills({slow: skillCount.slow + 1, hint: skillCount.hint + 1, heal: skillCount.heal + 1});
    setWsSlowed(false);
    setWsPhase('play');
    setWsActive(true);
    setWsPhaseScreen('play');
    // 問題キューを作成
    const pool = buildWordPool();
    const queue = shuffle(pool).slice(0, 12);
    setWsWordQueue(queue.slice(1));
    const first = queue[0];
    setWsCurrentWord({id: String(Date.now()), en: first.en, jp: first.jp, x: 15 + Math.random()*60});
    setWsChoices(makeChoices(first.jp, pool));
    setWsChoiceResult(null);
  };

  // ── 装備画面表示 ─────────────────────────────────────────────
  const openEquipScreen = () => {
    setWsPhaseScreen('equip');
    setWsActive(true);
    setWsPhase('idle');
  };

  const toggleEquip = (skill: string) => {
    setWsEquipped(prev => {
      if (prev.includes(skill)) return prev.filter(s => s !== skill);
      if (prev.length >= 3)     { t$('装備は最大3つです'); return prev; }
      // 在庫確認
      const stock = (gachaSkillStock as any)[skill] ?? 0;
      if (stock <= 0)           { t$('スキルチケットがありません'); return prev; }
      // 消費
      setGachaSkillStock(s => ({...s, [skill]: (s as any)[skill] - 1}));
      return [...prev, skill];
    });
  };

  // ── 4択を選ぶ ────────────────────────────────────────────────
  const handleWsChoice = (jp: string) => {
    // タイムアウト（落下終了）の場合はHP減少して次へ
    if (jp === '__timeout__') {
      if (!wsCurrentWord) return;
      setWsFlash(true); setTimeout(()=>setWsFlash(false),400);
      setWsCombo(0);
      setWsLives(l => {
        const next = l - 1;
        if (next <= 0) { setTimeout(()=>{setWsPhase('result');setWsActive(false);setWsPhaseScreen('result');},800); return 0; }
        return next;
      });
      setTimeout(() => { setWsCurrentWord(null); nextQuestion(wsWordQueue); }, 600);
      return;
    }
    if (!wsCurrentWord || wsChoiceResult) return;
    const correct = wsCurrentWord.jp;
    const isOk = jp === correct;
    setWsChoiceResult({sel: jp, correct});

    if (isOk) {
      // ✅ 正解
      setWsHits(h => [...h, wsCurrentWord.id]);
      const gain = 10 + wsCombo * 2;
      setWsScore(s => s + gain);
      setWsCoins(c => c + Math.ceil(gain/10));
      setWsCombo(c => c + 1);
      setTimeout(() => {
        setWsHits(h => h.filter(id => id !== wsCurrentWord!.id));
        nextQuestion(wsWordQueue);
      }, 500);
    } else {
      // ❌ 不正解
      setWsFlash(true);
      setTimeout(()=>setWsFlash(false), 400);
      // 不正解情報: 選んだjpに対応する正しい英語も探す
      const pool = buildWordPool();
      const selectedMeaning = pool.find(w => w.jp === jp);
      setWsWrong({
        id: wsCurrentWord.id,
        en: wsCurrentWord.en,    // 正解の英語
        jp: selectedMeaning?.en ?? jp, // 選んだ日本語の本当の英語
      });
      setWsCombo(0);
      setWsLives(l => {
        const next = l - 1;
        if (next <= 0) { setTimeout(()=>{ setWsPhase('result'); setWsActive(false); setWsPhaseScreen('result'); }, 1200); return 0; }
        return next;
      });
      // 2秒後に次の問題
      setTimeout(() => {
        setWsWrong(null);
        nextQuestion(wsWordQueue);
      }, 2000);
    }
  };

  // スキル使用
  const useWsSkill = (skill: 'slow'|'hint'|'heal') => {
    if ((wsSkills[skill] ?? 0) <= 0) return;
    setWsSkills(s => ({...s, [skill]: s[skill] - 1}));
    if (skill === 'slow') {
      setWsSlowed(true);
      setTimeout(() => setWsSlowed(false), 8000);
      t$('🐢 スロー発動！8秒間ゆっくりになります');
    } else if (skill === 'hint') {
      t$('💡 ヒント: 単語の先頭が光ります');
    } else {
      setWsLives(l => Math.min(l+1, wsMaxLives));
      t$('💚 HP +1 回復！');
    }
  };

  // ガチャでスキルチケット獲得
  const wsGachaSkill = () => {
    if (wsCoins < 5) { t$('コインが足りません（5枚必要）'); return; }
    setWsCoins(c => c - 5);
    const skills = ['shield','slow','hint','heal'] as const;
    const got = skills[Math.floor(Math.random() * skills.length)];
    setGachaSkillStock(s => ({...s, [got]: ((s as any)[got] ?? 0) + 1}));
    const names: Record<string,string> = {shield:'🛡️ シールド', slow:'🐢 スロー', hint:'💡 ヒント', heal:'💚 HP回復'};
    t$(`🎰 ${names[got]} チケット獲得！`);
    setPts(p => p + 3);
  };

  // wsPhase が play 以外になったら currentWord をリセット
  useEffect(() => {
    if (wsPhase !== 'play') { setWsCurrentWord(null); setWsChoices([]); }
  }, [wsPhase]);

  const wsWordsInitRef = React.useRef(false);
  useEffect(() => {
    if (wsPhase === 'play' && !wsWordsInitRef.current) {
      wsWordsInitRef.current = true;
    }
    if (wsPhase !== 'play') { wsWordsInitRef.current = false; }
  }, [wsPhase]);

  const handleWsInput = (_val: string) => { /* 4択方式のため不使用 */ };
  const handleWsMiss  = (_id: string) => { /* 4択方式のため不使用 */ };

  // ── BBC記事リスト読み込み ────────────────────────────────── ──────────────────────────────────
  const loadBBCFeed = async (feed) => {
    setBbcFeed(feed);
    setBbcLoading(true);
    setBbcArticles([]);
    const articles = await fetchBBCNews(feed);
    setBbcArticles(articles);
    setBbcLoading(false);
  };

  const openBBCList = () => {
    setNewsScreen('bbcList');
    if (bbcArticles.length === 0) loadBBCFeed('world');
  };

  const openBBCArticle = (article) => {
    setCurArticle(article);
    setSelWord(null); setSelSent(null);
    setWordData(null); setSentData(null);
    setFullTrans(''); setShowFull(false);
    setNewsScreen('bbcReader');
  };

  // ── 単語タップ ───────────────────────────────────────────────
  const handleWordTap = async (word, sentence) => {
    const clean = word.replace(/[^a-zA-Z'-]/g, '');
    if (!clean || clean.length < 2) return;
    setSelWord({ word: clean, sentence });
    setSelSent(null);
    setSentData(null);
    setShowFull(false);
    setTransLoading(true);
    const data = await aiWordMeaning(clean, sentence);
    setWordData(data);
    setTransLoading(false);
  };

  // ── 文タップ ─────────────────────────────────────────────────
  const handleSentTap = async (sentence) => {
    if (selSent?.sentence === sentence) { setSelSent(null); setSentData(null); return; }
    setSelSent({ sentence });
    setSelWord(null); setWordData(null);
    setShowFull(false);
    setTransLoading(true);
    const jp = await aiTranslateSentence(sentence);
    setSentData(jp);
    setTransLoading(false);
  };

  // ── 全文翻訳トグル ───────────────────────────────────────────
  const handleFullTrans = async () => {
    if (showFull) { setShowFull(false); return; }
    setSelWord(null); setSelSent(null); setWordData(null); setSentData(null);
    setShowFull(true);
    if (!fullTrans && curArticle) {
      setTransLoading(true);
      const text = curArticle.title + '\n\n' + curArticle.description;
      const jp = await aiTranslateAll(text);
      setFullTrans(jp);
      setTransLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 解放モーダル（コイン/チケット選択UI）
  // ─────────────────────────────────────────────────────────────
  const UnlockModal = () => {
    if (!unlockModal?.visible) return null;
    const { title, coinCost, ticketType, onConfirm } = unlockModal;
    const hasTicket = (wallet as any)[ticketType] > 0;
    const hasCoins  = wallet.coins >= coinCost;
    const close = () => setUnlockModal(null);

    return (
      <div className="unlock-modal-overlay" onClick={close}>
        <div className="unlock-modal" onClick={e => e.stopPropagation()}>
          <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{title}</div>
          <div className="jp" style={{fontSize:12,color:"var(--t3)",marginBottom:16}}>
            以下の方法で解放できます
          </div>

          <div className="unlock-price">
            {/* コイン解放 */}
            <button
              className={`unlock-price-opt ${hasCoins ? '' : 'disabled'}`}
              style={{opacity: hasCoins ? 1 : .45}}
              disabled={!hasCoins}
              onClick={() => { close(); onConfirm('coin'); }}
            >
              <div style={{fontSize:20,marginBottom:4}}>🪙</div>
              <div style={{fontSize:15,fontWeight:700,color:"#92400E"}}>{coinCost} コイン</div>
              <div className="jp" style={{fontSize:10,color:"var(--t3)",marginTop:2}}>永久解放</div>
              <div style={{fontSize:11,color:"var(--t2)",marginTop:4}}>所持: {wallet.coins}枚</div>
            </button>

            {/* チケット解放 */}
            <button
              className={`unlock-price-opt ${hasTicket ? '' : 'disabled'}`}
              style={{opacity: hasTicket ? 1 : .45}}
              disabled={!hasTicket}
              onClick={() => { close(); onConfirm('ticket'); }}
            >
              <div style={{fontSize:20,marginBottom:4}}>🎟️</div>
              <div style={{fontSize:15,fontWeight:700,color:"#1D4ED8"}}>チケット</div>
              <div className="jp" style={{fontSize:10,color:"var(--t3)",marginTop:2}}>24時間解放</div>
              <div className="jp" style={{fontSize:11,color:"var(--t2)",marginTop:4}}>
                所持: {(wallet as any)[ticketType] ?? 0}枚
              </div>
            </button>
          </div>

          {/* 広告でコイン獲得 */}
          {!hasCoins && !hasTicket && (
            <button
              className="bp" style={{width:"100%",marginBottom:10,background:"#F59E0B"}}
              onClick={() => { close(); openRew(() => earnCoins(coinCost)); }}
            >
              📺 広告を見てコインを獲得
            </button>
          )}

          <button className="bg" style={{width:"100%"}} onClick={close}>
            キャンセル
          </button>
        </div>
      </div>
    );
  };

  const RankingScreen = () => {
    const TABS = [
      {id:'learning' as const, label:'📚 学習'},
      {id:'translation' as const, label:'🌐 翻訳'},
    ];
    return (
      <div className="sa">
        <div style={{padding:"14px 16px 0"}}>
          <div style={{fontSize:17,fontWeight:700,marginBottom:4}}>🏆 ランキング</div>
          <div className="jp" style={{fontSize:12,color:"var(--t3)",marginBottom:14}}>全ユーザーの学習スコア・翻訳スコアで競います</div>
          {/* タブ */}
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {TABS.map(t=>(
              <button key={t.id}
                style={{flex:1,padding:"8px 0",borderRadius:"var(--rs)",border:"none",cursor:"pointer",fontFamily:"'Noto Sans JP'",fontSize:13,fontWeight:700,
                  background:rankingTab===t.id?"var(--p)":"var(--bd)",color:rankingTab===t.id?"#fff":"var(--t2)",transition:"all .15s"}}
                onClick={()=>loadRanking(t.id)}
              >{t.label}</button>
            ))}
          </div>
          {/* ロード */}
          {rankingLoading && (
            <div style={{display:"flex",justifyContent:"center",padding:40}}>
              <div className="spin" style={{width:24,height:24,borderWidth:3}}/>
            </div>
          )}
          {/* ランキングリスト */}
          {!rankingLoading && rankingData.length === 0 && (
            <div className="empty jp">
              <div style={{fontSize:32,marginBottom:8}}>🏆</div>
              まだランキングデータがありません。<br/>学習や翻訳でデータを積み上げよう！
            </div>
          )}
          {!rankingLoading && rankingData.map((row: any, i: number) => (
            <div key={row.user_id} className="rank-row">
              <div className={`rank-no rank-no-${i<3?i+1:'n'}`}>{i+1}</div>
              <span style={{fontSize:18}}>{row.avatar ?? '🎓'}</span>
              <div style={{flex:1,minWidth:0}}>
                <div className="rank-nick">{row.nickname}</div>
                <div className="jp" style={{fontSize:11,color:"var(--t3)"}}>
                  {rankingTab==='learning'
                    ? `${row.sessions}回学習 | 正答率${row.accuracy}%`
                    : `スコア合計${row.score}`}
                </div>
              </div>
              <div className="rank-score">
                {rankingTab==='learning' ? `🪙${row.coins}` : `${row.score}pt`}
              </div>
              {row.user_id === userId && (
                <div style={{fontSize:10,background:"var(--pl)",color:"var(--p)",borderRadius:4,padding:"2px 6px",fontWeight:700}}>YOU</div>
              )}
            </div>
          ))}
        </div>
        <div style={{height:20}}/>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // NICKNAME EDIT MODAL
  // ════════════════════════════════════════════════════════════════
  const [selAvatar, setSelAvatar] = useState('🎓'); // NicknameModal用（外に出す）

  const NicknameModal = () => {
    if (!showNickEdit) return null;
    const AVATARS = ['🎓','📚','🌟','🎯','🦊','🐼','🦋','🎸','🚀','💎'];
    return (
      <div className="nick-modal-overlay" onClick={()=>setShowNickEdit(false)}>
        <div className="nick-modal" onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:16,fontWeight:700,marginBottom:14,fontFamily:"'Noto Sans JP'"}}>✏️ ニックネーム設定</div>
          {/* アバター選択 */}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
            {AVATARS.map(a=>(
              <button key={a} onClick={()=>setSelAvatar(a)}
                style={{width:36,height:36,borderRadius:8,border:`2px solid ${a===selAvatar?"var(--p)":"var(--bd)"}`,
                  background:a===selAvatar?"var(--pl)":"var(--bg)",fontSize:20,cursor:"pointer"}}>
                {a}
              </button>
            ))}
          </div>
          {/* ニックネーム入力 */}
          <input
            value={nickInput}
            onChange={e=>setNickInput(e.target.value.slice(0,20))}
            placeholder={myProfile?.nickname ?? "ニックネームを入力"}
            style={{width:"100%",padding:"10px 12px",border:"1.5px solid var(--bd)",borderRadius:"var(--rs)",fontSize:14,outline:"none",marginBottom:6,fontFamily:"'Noto Sans JP'"}}
          />
          <div className="jp" style={{fontSize:11,color:"var(--t3)",marginBottom:14}}>{nickInput.length}/20文字</div>
          <div style={{display:"flex",gap:8}}>
            <button className="bg" style={{flex:1}} onClick={()=>setShowNickEdit(false)}>キャンセル</button>
            <button className="bp" style={{flex:1}} onClick={()=>{
              if (!nickInput.trim()) return t$('ニックネームを入力してください');
              saveProfile(nickInput.trim(), selAvatar);
              setShowNickEdit(false);
              t$('✅ ニックネームを保存しました');
            }}>保存</button>
          </div>
        </div>
      </div>
    );
  };

  const Settings = () => (
    <div className="sa">
      {/* ウォレット詳細 */}
      <div style={{margin:"12px 16px 0",padding:"14px 16px",background:"var(--sur)",borderRadius:"var(--r)",boxShadow:"var(--sh)"}}>
        <div className="jp" style={{fontSize:13,fontWeight:700,color:"var(--t2)",marginBottom:12}}>💰 ウォレット</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {[
            {label:"🪙 コイン",    val: wallet.coins,               col:"#F59E0B"},
            {label:"📝 クイズ券",  val: wallet.quiz_tickets,         col:"#8B5CF6"},
            {label:"🎬 動画券",    val: wallet.video_tickets,        col:"#2563EB"},
            {label:"🎰 ガチャ券",  val: wallet.gacha_tickets,        col:"#EC4899"},
          ].map(({label,val,col}) => (
            <div key={label} style={{background:"var(--bg)",borderRadius:8,padding:"10px 12px",border:`1.5px solid ${col}22`}}>
              <div style={{fontSize:11,color:"var(--t3)",marginBottom:3,fontFamily:"'Noto Sans JP'"}}>{label}</div>
              <div style={{fontSize:20,fontWeight:700,color:col}}>{val}</div>
            </div>
          ))}
        </div>
        <div className="jp" style={{fontSize:11,color:"var(--t3)"}}>
          本日獲得: {wallet.daily_earned_coins} / 200 コイン
        </div>
      </div>

      {/* ニックネーム設定 */}
      <div style={{margin:"12px 16px 0",padding:"14px 16px",background:"var(--sur)",borderRadius:"var(--r)",boxShadow:"var(--sh)"}}>
        <div className="jp" style={{fontSize:13,fontWeight:700,color:"var(--t2)",marginBottom:10}}>👤 プロフィール</div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"var(--pl)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
            {myProfile?.avatar_emoji ?? '🎓'}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:"var(--t)"}}>{myProfile?.nickname ?? "未設定"}</div>
            <div className="jp" style={{fontSize:11,color:"var(--t3)"}}>ランキングに表示されます</div>
          </div>
          <button className="bg" style={{fontSize:12,padding:"6px 12px"}}
            onClick={()=>{setNickInput(myProfile?.nickname??'');setShowNickEdit(true);}}>
            編集
          </button>
        </div>
        <button className="bp" style={{width:"100%",fontSize:13,background:"#7C3AED"}}
          onClick={()=>{loadRanking('learning');setShowRanking(true);}}>
          🏆 ランキングを見る
        </button>
      </div>

      {/* Phase4: Google認証セクション */}
      <div style={{margin:"12px 16px 0",padding:"14px 16px",background:"var(--sur)",borderRadius:"var(--r)",boxShadow:"var(--sh)"}}>
        <div className="jp" style={{fontSize:13,fontWeight:700,color:"var(--t2)",marginBottom:10}}>🔐 アカウント</div>
        {authUser ? (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              {authUser.avatar_url
                ? <img src={authUser.avatar_url} alt="" style={{width:40,height:40,borderRadius:"50%"}}/>
                : <div style={{width:40,height:40,borderRadius:"50%",background:"var(--p)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff"}}>{(authUser.name||"?")[0]}</div>
              }
              <div>
                <div style={{fontSize:14,fontWeight:600,color:"var(--t)"}}>{authUser.name || "ユーザー"}</div>
                <div style={{fontSize:12,color:"var(--t3)"}}>{authUser.email}</div>
              </div>
            </div>
            <button
              className="bg"
              style={{width:"100%",fontSize:13}}
              onClick={async () => { await supabaseAuth.signOut(); setAuthUser(null); t$("ログアウトしました"); }}
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div>
            <div className="jp" style={{fontSize:12,color:"var(--t3)",marginBottom:12,lineHeight:1.6}}>
              Googleアカウントでログインすると、データが複数の端末で同期されます。
            </div>
            <button
              className="bp"
              style={{width:"100%",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
              onClick={() => supabaseAuth.signInWithGoogle()}
            >
              <span style={{fontSize:16}}>G</span>
              Googleでログイン
            </button>
            <div className="jp" style={{fontSize:11,color:"var(--t3)",marginTop:8,textAlign:"center"}}>
              未ログインでもデータはこの端末に保存されます
            </div>
          </div>
        )}
      </div>
      {!SB_READY&&(
        <div style={{margin:"12px 16px",padding:"12px 14px",background:"#FEF3C7",borderRadius:"var(--r)",border:"1px solid #FCD34D"}}>
          <div className="jp" style={{fontSize:13,fontWeight:700,color:"#92400E",marginBottom:4}}>⚠️ Supabase未設定</div>
          <div className="jp" style={{fontSize:12,color:"#78350F",lineHeight:1.6}}>
            データはリロードすると消えます。<br/>
            ファイル先頭の <code>SB_URL</code> と <code>SB_KEY</code> にSupabaseのキーを設定してください。
          </div>
        </div>
      )}
      {SB_READY&&(
        <div style={{margin:"12px 16px",padding:"12px 14px",background:"#F0FDF4",borderRadius:"var(--r)",border:"1px solid #BBF7D0"}}>
          <div className="jp" style={{fontSize:13,fontWeight:700,color:"#065F46",marginBottom:2}}>✅ Supabase接続中</div>
          <div className="jp" style={{fontSize:11,color:"#059669"}}>データは自動的に保存されます</div>
        </div>
      )}
      <div className="stlist">
        <div className="stst">収益設定</div>
        {[{key:"affOn",label:"アフィリエイト表示",sub:"レベル別おすすめカード"},{key:"rewOn",label:"リワード広告",sub:"任意視聴でポイント獲得"}].map(({key,label,sub})=>(
          <div key={key} className="sti">
            <div><div style={{fontSize:14,fontWeight:500,fontFamily:"'Noto Sans JP'"}}>{label}</div><div className="jp" style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{sub}</div></div>
            <button className={`tog ${sett[key]?"on":"off"}`} onClick={()=>setSett(s=>({...s,[key]:!s[key]}))}/>
          </div>
        ))}
        <div className="stst" style={{marginTop:8}}>アプリ情報</div>
        {[
          {label:"バージョン",val:"MVP 2.0.0"},
          {label:"保存文数",val:`${saved.length} 件`,c:"var(--p)"},
          {label:"マイリスト",val:`${myList.length} 本`,c:"var(--p)"},
          {label:"受験回数",val:`${TR.word.length+TR.grammar.length+TR.listening.length} 回`,c:"var(--pu)"},
          {label:"TOEIC予想",val:`${toeic} 点`,c:"var(--p)"},
          {label:"ポイント",val:`⭐ ${pts} pt`,c:"#F59E0B"},
        ].map(({label,val,c})=>(
          <div key={label} className="sti">
            <div className="jp" style={{fontSize:14,fontWeight:500}}>{label}</div>
            <div style={{fontSize:13,color:c||"var(--t3)",fontWeight:c?700:400}}>{val}</div>
          </div>
        ))}
        <div style={{textAlign:"center",padding:"20px 0 8px"}}>
          <div className="jp" style={{fontSize:12,color:"var(--t3)",lineHeight:1.9}}>英語マスター MVP 2.0<br/>🎓 語順のまま英語を理解する学習アプリ<br/><span style={{fontSize:11}}>テスト・分析・動画・ごほうびで継続できる</span></div>
        </div>
      </div>
    </div>
  );


  // ════════════════════════════════════════════════════════════════
  // MODALS & RENDER
  // ════════════════════════════════════════════════════════════════
  const isTest   = ["wordTest","grammarTest","listeningTest"].includes(screen);
  const isVideo  = screen==="video";
  const isAnal   = screen==="analysis";
  const isNews   = navTab==="news";
  const hideNav  = isTest||isVideo||isAnal;
  const testName = {wordTest:"単語テスト",grammarTest:"文法 Part5",listeningTest:"リスニング"};

  const getContent = () => {
    if(isVideo)  return <VideoScreen/>;
    if(isAnal)   return <Analysis/>;
    if(isTest)   return <Quiz/>;
    if(navTab==="home")    return <Home/>;
    if(navTab==="learn") {
      if(wsActive) return <WordShooter/>;
      return <LearnHub/>;
    }
    if(navTab==="news") {
      if(wsActive && wsPhase !== 'idle') return <WordShooter/>;
      if(newsScreen==="parallelReader")         return <ParallelReader/>;
      if(newsScreen==="bbcReader")              return <BBCReader/>;
      if(newsScreen==="bbcList")                return <BBCList/>;
      return <NewsHub/>;
    }
    if(navTab==="saved")   return <Saved/>;
    if(navTab==="gacha")   return <Gacha/>;
    if(navTab==="settings")return <Settings/>;
    return <Home/>;
  };

  // ニュース画面のヘッダータイトル
  const newsTitle = () => {
    if(wsActive && wsPhase !== 'idle') return <span className="jp" style={{fontSize:15}}>🎮 シューティング</span>;
    if(newsScreen==="parallelReader")  return <span className="jp" style={{fontSize:15}}>📖 対訳リーダー</span>;
    if(newsScreen==="bbcReader"&&curArticle) return <span style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:13,fontWeight:600}}>{curArticle.title}</span>;
    if(newsScreen==="bbcList")   return <span className="jp" style={{fontSize:15}}>🗞️ BBC News</span>;
    return <span className="jp">ニュース学習</span>;
  };

  // ニュース画面の戻るボタン
  const newsBack = () => {
    if(wsActive) { setWsPhase('idle'); setWsActive(false); return; }
    if(newsScreen==="parallelReader") { setNewsScreen("hub"); return; }
    if(newsScreen==="bbcReader") { setNewsScreen("bbcList"); setCurArticle(null); return; }
    if(newsScreen==="bbcList") { setNewsScreen("hub"); }
  };

  const getHeaderTitle = () => {
    if(isVideo) return <><span style={{fontSize:16}}>{I({n:"yt",s:16,c:"#FF0000"})}</span><span style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:14}}>{curVid?.title}</span></>;
    if(isTest)  return <span className="jp" style={{fontSize:15}}>{testName[screen]}</span>;
    if(isAnal)  return <span className="jp" style={{fontSize:15}}>📊 成績分析</span>;
    if(wsActive) return <span className="jp" style={{fontSize:15}}>🎮 単語シューティング</span>;
    if(isNews&&newsScreen!=="hub") return newsTitle();
    return <><span style={{fontSize:20}}>🎓</span><span className="jp">英語マスター</span></>;
  };
  const showBack = isVideo||isTest||isAnal||wsActive||(isNews&&newsScreen!=="hub");
  const handleBack = () => {
    if(wsActive) { setWsActive(false); setWsPhase('idle'); setWsPhaseScreen('equip'); return; }
    if(isNews&&newsScreen!=="hub") { newsBack(); return; }
    setScreen("main");
    window.speechSynthesis&&window.speechSynthesis.cancel();
  };

  return (
    <div>
      <style>{CSS}</style>
      <div className="app">
        {/* ── Header ── */}
        <div className="hdr">
          <div className="hdr-in">
            {showBack?(
              <>
                <button className="back-btn" onClick={handleBack}>
                  {I({n:"chL",s:18})} 戻る
                </button>
                <div className="hdr-t">{getHeaderTitle()}</div>
                <div style={{width:60}}/>
              </>
            ):(
              <>
                <div className="hdr-t">{getHeaderTitle()}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <div className="jp" style={{fontSize:12,fontWeight:700,color:"#F59E0B",background:"#FEF3C7",padding:"4px 8px",borderRadius:16}}>
                      🪙{wallet.coins}
                    </div>
                    {(wallet.quiz_tickets + wallet.video_tickets + wallet.gacha_tickets) > 0 && (
                      <div style={{fontSize:11,fontWeight:700,color:"#60A5FA",background:"rgba(37,99,235,.12)",padding:"3px 7px",borderRadius:12}}>
                        🎟{wallet.quiz_tickets + wallet.video_tickets + wallet.gacha_tickets}
                      </div>
                    )}
                  </div>
                  {/* Phase4: 認証ボタン */}
                  {authUser ? (
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      {authUser.avatar_url
                        ? <img src={authUser.avatar_url} alt="" style={{width:24,height:24,borderRadius:"50%",border:"1.5px solid var(--bd)"}}/>
                        : <div style={{width:24,height:24,borderRadius:"50%",background:"var(--p)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>{(authUser.name||"?")[0]}</div>
                      }
                    </div>
                  ) : (
                    <button
                      onClick={() => supabaseAuth.signInWithGoogle()}
                      style={{fontSize:11,fontWeight:600,color:"var(--p)",background:"var(--pl)",border:"1px solid var(--cbb)",borderRadius:20,padding:"3px 10px",cursor:"pointer",fontFamily:"'Noto Sans JP'",whiteSpace:"nowrap"}}
                    >
                      ログイン
                    </button>
                  )}
                </div>
                  {SB_READY
                    ? <div title="Supabase接続中" style={{width:8,height:8,borderRadius:"50%",background:dbReady?"#10B981":"#F59E0B",flexShrink:0}}/>
                    : <div title="Supabase未設定（データはリセットされます）" style={{width:8,height:8,borderRadius:"50%",background:"#94A3B8",flexShrink:0}}/>
                  }
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        {getContent()}

        {/* ── Bottom Nav ── */}
        {!hideNav&&(
          <div className="bnav">
            {[
              {id:"home",    n:"home",  lbl:"ホーム"},
              {id:"learn",   n:"learn", lbl:"学習"},
              {id:"news",    n:"news",  lbl:"ニュース"},
              {id:"saved",   n:"bkmk",  lbl:`保存(${saved.length})`},
              {id:"settings",n:"cog",   lbl:"設定"},
            ].map(({id,n,lbl})=>(
              <button key={id} className={`ni${navTab===id?" on":""}`}
                onClick={()=>{
                  setNavTab(id);
                  setScreen("main");
                  if(id==="news") setNewsScreen("hub");
                }}>
                {I({n,s:20,c:navTab===id?"var(--p)":"var(--t3)"})}
                <span>{lbl}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── AI処理 進捗モーダル ── */}
        {proc.active && proc.step !== 'manual' && (
          <div className="mov">
            <div className="msh" style={{paddingBottom:32}}>
              <div className="mhnd"/>
              <div style={{textAlign:'center',marginBottom:20}}>
                <div style={{fontSize:36,marginBottom:8}}>
                  {proc.step==='transcript'?'📡':proc.step==='ai'?'🤖':proc.step==='saving'?'💾':'✨'}
                </div>
                <div className="jp" style={{fontSize:17,fontWeight:700,marginBottom:4}}>
                  {proc.step==='transcript'&&'字幕を取得中...'}
                  {proc.step==='ai'&&'AIがChunkを生成中...'}
                  {proc.step==='saving'&&'Supabaseに保存中...'}
                  {proc.step==='done'&&'完了！'}
                </div>
                <div className="jp" style={{fontSize:13,color:'var(--t3)',marginBottom:16}}>
                  {proc.videoTitle}
                </div>
              </div>
              {/* プログレスバー */}
              <div style={{height:8,background:'var(--bd)',borderRadius:4,overflow:'hidden',marginBottom:8}}>
                <div style={{height:'100%',background:'var(--p)',borderRadius:4,transition:'width .4s ease',width:`${proc.pct}%`}}/>
              </div>
              <div className="jp" style={{fontSize:12,color:'var(--t3)',textAlign:'center',marginBottom:20}}>
                {proc.pct}% 完了
              </div>
              {proc.step==='ai'&&(
                <div style={{background:'var(--pl)',borderRadius:'var(--rs)',padding:'12px',marginBottom:12}}>
                  <div className="jp" style={{fontSize:12,color:'var(--p)',lineHeight:1.7}}>
                    🤖 Claudeが英文をチャンク分解しています。<br/>
                    字幕を語順のまま理解できる形に変換中...
                  </div>
                </div>
              )}
              <div className="jp" style={{fontSize:11,color:'var(--t3)',textAlign:'center'}}>
                完了後に自動的に閉じます
              </div>
            </div>
          </div>
        )}

        {/* ── 手動入力モーダル（自動取得失敗時）── */}
        {proc.active && proc.step === 'manual' && (
          <div className="mov" onClick={e=>e.target===e.currentTarget&&setProc(p=>({...p,active:false}))}>
            <div className="msh">
              <div className="mhnd"/>
              <div style={{fontSize:17,fontWeight:700,marginBottom:4,fontFamily:"'Noto Sans JP'"}}>📋 字幕を貼り付け</div>
              <div className="jp" style={{fontSize:13,color:'var(--t3)',marginBottom:4}}>
                自動取得できませんでした。YouTubeの「字幕を表示」からコピーして貼り付けてください。
              </div>
              <div style={{background:'var(--pl)',borderRadius:'var(--rs)',padding:'10px 12px',marginBottom:16,display:'flex',gap:8,alignItems:'flex-start'}}>
                <span style={{fontSize:16}}>💡</span>
                <div className="jp" style={{fontSize:12,color:'var(--p)',lineHeight:1.6}}>
                  YouTube動画ページ → <b>「...」メニュー</b> → <b>「字幕を開く」</b><br/>
                  表示されたテキストをすべてコピーして貼り付け
                </div>
              </div>
              <textarea
                value={manualText}
                onChange={e=>setManualText(e.target.value)}
                placeholder={"英語の字幕テキストをここに貼り付けてください...\n\nHello everyone, welcome to today's video.\nToday we're going to talk about..."}



                style={{width:'100%',minHeight:160,padding:'10px 12px',border:'1.5px solid var(--bd)',borderRadius:'var(--rs)',fontFamily:'inherit',fontSize:13,outline:'none',resize:'vertical',marginBottom:12,lineHeight:1.6,background:'var(--bg)'}}
              />
              <div style={{display:'flex',gap:8}}>
                <button className="bg" style={{flex:1}} onClick={()=>setProc(p=>({...p,active:false,needManual:false}))}>
                  キャンセル
                </button>
                <button className="bp" style={{flex:2}} disabled={!manualText.trim() || manualLoading} onClick={submitManualTranscript}>
                  {manualLoading ? '生成中...' : '🤖 AIでChunk生成'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Shadowing Modal ── */}
        {shwShow&&(
          <div className="mov" onClick={e=>e.target===e.currentTarget&&(setShwShow(false),setShwPh("idle"))}>
            <div className="msh">
              <div className="mhnd"/>
              {shwPh!=="score"?(
                <>
                  <div style={{fontSize:17,fontWeight:700,marginBottom:4,fontFamily:"'Noto Sans JP'"}}>🎤 シャドーイング</div>
                  <div className="jp" style={{fontSize:13,color:"var(--t3)",marginBottom:18}}>読まれた英文を声に出しましょう</div>
                  <div style={{fontSize:17,fontWeight:600,color:"var(--t)",lineHeight:1.5,padding:14,background:"var(--bg)",borderRadius:"var(--rs)",marginBottom:18,textAlign:"center"}}>
                    {curCap?.english||"動画画面でキャプションを選択してください"}
                  </div>
                  <button className={`micbtn${shwPh==="rec"?" rec":""}`} onClick={doRec} disabled={shwPh==="rec"}>{I({n:"mic",s:30,c:"white"})}</button>
                  <div className="jp" style={{textAlign:"center",fontSize:12,color:"var(--t3)",marginBottom:8}}>
                    {shwPh==="idle"
                      ? shwEngine==='webSpeech'
                        ? "マイクボタンを押して録音（5秒間）"
                        : "マイクボタンを押す（簡易採点モード）"
                      : "🔴 録音中... 英文を声に出してください"}
                  </div>
                  {shwPh==="rec" && (
                    <div style={{width:'100%',marginBottom:16}}>
                      <div style={{height:4,background:'var(--bd)',borderRadius:2,overflow:'hidden'}}>
                        <div style={{height:'100%',background:'var(--ng)',borderRadius:2,animation:'recProgress 5s linear forwards'}}/>
                      </div>
                    </div>
                  )}
                  <button className="bg" style={{width:"100%"}} onClick={()=>{setShwShow(false);setShwPh("idle");}}>キャンセル</button>
                </>
              ):(
                <>
                  <div style={{fontSize:17,fontWeight:700,marginBottom:4,fontFamily:"'Noto Sans JP'"}}>📊 スコア結果</div>
                  <div className="jp" style={{fontSize:13,color:"var(--t3)",marginBottom:18}}>お疲れ様でした！</div>
                  <div className="sdbox">
                    {/* エンジン表示 */}
                    <div style={{fontSize:10,color:'var(--t3)',marginBottom:4,fontFamily:"'Noto Sans JP'"}}>
                      {shwEngine==='webSpeech' ? '🎤 Web Speech API（実音声認識）' : '⚠️ 簡易スコア（音声認識未対応環境）'}
                    </div>
                    <div style={{fontSize:46,fontWeight:700,color:"var(--p)",lineHeight:1}}>{shwSc}<span style={{fontSize:20}}>点</span></div>
                    <div style={{display:"flex",justifyContent:"center",gap:4,margin:"8px 0"}}>
                      {stars(shwSc,100).map((on,i)=>I({n:"star",s:22,c:on?"#F59E0B":"#E2E8F0"}))}
                    </div>
                    {/* 単語マッチ率 */}
                    {shwTotal > 0 && (
                      <div className="jp" style={{fontSize:12,color:'var(--t2)',margin:'4px 0'}}>
                        単語一致: {shwWords} / {shwTotal} 語
                      </div>
                    )}
                    <div className="jp" style={{fontSize:13,color:"var(--t3)"}}>+{Math.floor(shwSc/10)}pt 獲得！</div>
                  </div>
                  {/* 認識テキスト表示 */}
                  {shwTranscript && shwTranscript.length > 2 && (
                    <div style={{background:'var(--bg)',borderRadius:'var(--rs)',padding:'10px 12px',marginBottom:12,border:'1px solid var(--bd)'}}>
                      <div style={{fontSize:10,fontWeight:700,color:'var(--t3)',marginBottom:4,fontFamily:"'Noto Sans JP'"}}>認識されたテキスト</div>
                      <div style={{fontSize:13,color:'var(--t)',fontStyle:'italic'}}>{shwTranscript}</div>
                    </div>
                  )}
                  {sett.rewOn&&(
                    <div className="rdbox">
                      <div style={{color:"#fff",fontSize:13,fontWeight:700,marginBottom:6,fontFamily:"'Noto Sans JP'"}}>📺 広告を視聴して詳細分析を解放</div>
                      <div style={{color:"#94A3B8",fontSize:11,marginBottom:10,fontFamily:"'Noto Sans JP'"}}>発音・リズム・アクセントの詳細スコア</div>
                      <button style={{background:"var(--a)",color:"#fff",border:"none",borderRadius:"var(--rs)",padding:"9px 20px",fontWeight:700,cursor:"pointer",fontFamily:"'Noto Sans JP'",width:"100%",fontSize:13}} onClick={()=>openRew(()=>t$("🔓 詳細分析解放！"))}>広告を見て解放 →</button>
                    </div>
                  )}
                  <button className="bp" style={{width:"100%"}} onClick={()=>{setShwShow(false);setShwPh("idle");}}>閉じる</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Reward Ad Modal ── */}
        {rewShow&&(
          <div className="mov">
            <div className="msh">
              <div className="mhnd"/>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>{I({n:"ad",s:18,c:"var(--t3)"})}<div className="jp" style={{fontSize:14,fontWeight:700}}>広告を視聴中...</div></div>
              <div style={{background:"#1e293b",borderRadius:12,aspectRatio:"16/9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:16,gap:10}}>
                <div style={{fontSize:40}}>📺</div><div className="jp" style={{color:"#fff",fontSize:14}}>リワード広告（デモ）</div>
              </div>
              <div className="rpb"><div className="rpbb" style={{width:`${rewPct}%`}}/></div>
              <div className="jp" style={{textAlign:"center",fontSize:13,color:"var(--t3)",marginTop:8}}>{Math.round(rewPct)}% 視聴完了</div>
            </div>
          </div>
        )}

        {/* ── Toast ── */}
        {toast&&<div className="toast">{toast}</div>}
        <UnlockModal/>
        <NicknameModal/>
        {showRanking && (
          <div style={{position:"fixed",inset:0,background:"var(--bg)",zIndex:200,display:"flex",flexDirection:"column"}}>
            <div className="hdr">
              <div className="hdr-in">
                <button className="back-btn" onClick={()=>setShowRanking(false)}>
                  {I({n:"chL",s:18,c:"var(--p)"})} 戻る
                </button>
                <span className="jp" style={{fontSize:15,fontWeight:700}}>🏆 ランキング</span>
                <div style={{width:60}}/>
              </div>
            </div>
            <RankingScreen/>
          </div>
        )}
      </div>
    </div>
    );
  }

export default function EigoMaster() {
  return (
    <ErrorBoundary>
      <EigoMasterInner />
    </ErrorBoundary>
  );
}
