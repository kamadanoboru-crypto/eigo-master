// @ts-nocheck

import { AFFILIATE_CARDS } from "../../lib/affiliateConfig";
let _process_env: any;
let _process_env1: any;
let _process_env2: any;
let _process_env3: any;
let _process_env4: any;
declare global {
  interface Window {
    _emUserId?: string;
  }
}
const DEFAULT_THUMBNAIL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180"%3E%3Crect width="100%25" height="100%25" fill="%23E5E7EB"/%3E%3C/svg%3E';
// ── Supabase Auth ヘルパー（Google OAuth）──────────────────────
// supabase-js ライブラリ不要版
const SB_URL_AUTH = typeof process !== "undefined" && ((_process_env = process.env) === null || _process_env === void 0 ? void 0 : _process_env.NEXT_PUBLIC_SUPABASE_URL) || "";
const SB_ANON_AUTH = typeof process !== "undefined" && ((_process_env1 = process.env) === null || _process_env1 === void 0 ? void 0 : _process_env1.NEXT_PUBLIC_SUPABASE_ANON_KEY) || "";
const REWARD_ADS_ENABLED = (typeof process !== "undefined" && ((_process_env2 = process.env) === null || _process_env2 === void 0 ? void 0 : _process_env2.NEXT_PUBLIC_REWARD_ADS_ENABLED)) === "true";
const MAX_STUDY_CAPTIONS = 120;
const getSupabaseAuthConfig = () => {
  var _process_env, _process_env1;
  return {
    url: typeof process !== "undefined" && ((_process_env = process.env) === null || _process_env === void 0 ? void 0 : _process_env.NEXT_PUBLIC_SUPABASE_URL) || "",
    anon: typeof process !== "undefined" && ((_process_env1 = process.env) === null || _process_env1 === void 0 ? void 0 : _process_env1.NEXT_PUBLIC_SUPABASE_ANON_KEY) || ""
  };
};
const supabaseAuth = {
  // Googleログインページへリダイレクト
  signInWithGoogle: async () => {
    const {
      url: sbUrl
    } = getSupabaseAuthConfig();
    if (!sbUrl) {
      throw new Error('Supabase auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
    const isNative = typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
    const redirectTo = isNative ? 'com.englishbase.app://auth' : window.location.origin + '/';
    const url = "".concat(sbUrl.replace(/\/$/, ''), "/auth/v1/authorize?provider=google&redirect_to=").concat(encodeURIComponent(redirectTo));
    if (isNative) {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url });
      return;
    }
    window.location.href = url;
  },
  // ログアウト
  signOut: async () => {
    try {
      const token = localStorage.getItem('sb_access_token');
      if (token && SB_URL_AUTH) {
        await fetch("".concat(SB_URL_AUTH, "/auth/v1/logout"), {
          method: 'POST',
          headers: {
            apikey: SB_ANON_AUTH,
            Authorization: "Bearer ".concat(token)
          }
        });
      }
    } catch (e) {}
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
      return {
        token,
        user_id
      };
    }
    return null;
  },
  getSessionFromUrl: url => {
    if (!url) return null;
    const marker = url.includes('#') ? '#' : url.includes('?') ? '?' : '';
    if (!marker) return null;
    const params = new URLSearchParams(url.slice(url.indexOf(marker) + 1));
    const token = params.get('access_token');
    const user_id = params.get('user_id') || params.get('sub');
    if (token) {
      localStorage.setItem('sb_access_token', token);
      return {
        token,
        user_id
      };
    }
    return null;
  },
  // 保存済みセッション取得
  getStoredSession: () => {
    try {
      const token = localStorage.getItem('sb_access_token');
      const userStr = localStorage.getItem('sb_user');
      if (!token) return null;
      return {
        token,
        user: userStr ? JSON.parse(userStr) : null
      };
    } catch (e) {
      return null;
    }
  },
  // トークンからユーザー情報取得
  getUser: async token => {
    const {
      url: sbUrl,
      anon
    } = getSupabaseAuthConfig();
    if (!sbUrl || !token) return null;
    try {
      const r = await fetch("".concat(sbUrl.replace(/\/$/, ''), "/auth/v1/user"), {
        headers: {
          apikey: anon,
          Authorization: "Bearer ".concat(token)
        }
      });
      if (!r.ok) return null;
      return r.json();
    } catch (e) {
      return null;
    }
  }
};
// SUPABASE CONFIG（環境変数から読み込み）
// .env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定
// anon key はクライアント公開前提（RLSで保護）
// ═══════════════════════════════════════════════════════════════
const SB_URL = typeof process !== "undefined" && ((_process_env3 = process.env) === null || _process_env3 === void 0 ? void 0 : _process_env3.NEXT_PUBLIC_SUPABASE_URL) || "";
const SB_KEY = typeof process !== "undefined" && ((_process_env4 = process.env) === null || _process_env4 === void 0 ? void 0 : _process_env4.NEXT_PUBLIC_SUPABASE_ANON_KEY) || "";
const SB_READY = SB_URL !== "" && SB_KEY !== "";
// ── Supabase fetch クライアント ───────────────────────────────
// 将来: import { createClient } from '@supabase/supabase-js' に差し替え可能
const sbFrom = table => {
  if (!SB_READY) {
    const noop = async () => [];
    return {
      select: noop,
      insert: noop,
      delete: noop,
      upsert: noop
    };
  }
  const base = "".concat(SB_URL, "/rest/v1/").concat(table);
  const headers = {
    apikey: SB_KEY,
    Authorization: "Bearer ".concat(SB_KEY),
    "Content-Type": "application/json"
  };
  return {
    select: async function () {
      let filter = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      try {
        const r = await fetch("".concat(base, "?").concat(filter), {
          headers
        });
        if (!r.ok) throw new Error("Supabase ".concat(r.status));
        return r.json();
      } catch (e) {
        console.error("[supabase]", e.message);
        return [];
      }
    },
    insert: async data => {
      try {
        const r = await fetch(base, {
          method: "POST",
          headers: {
            ...headers,
            Prefer: "return=representation"
          },
          body: JSON.stringify(data)
        });
        if (!r.ok) throw new Error("Supabase ".concat(r.status));
        return r.json();
      } catch (e) {
        console.error("[supabase]", e.message);
        return null;
      }
    },
    delete: async filter => {
      try {
        await fetch("".concat(base, "?").concat(filter), {
          method: "DELETE",
          headers
        });
      } catch (e) {
        console.error("[supabase]", e.message);
      }
    },
    upsert: async data => {
      try {
        const r = await fetch(base, {
          method: "POST",
          headers: {
            ...headers,
            Prefer: "return=representation,resolution=merge-duplicates"
          },
          body: JSON.stringify(data)
        });
        if (!r.ok) throw new Error("Supabase ".concat(r.status));
        return r.json();
      } catch (e) {
        console.error("[supabase]", e.message);
        return null;
      }
    }
  };
};
// ── ユーザーID（将来 Supabase Auth に差し替えポイント）────────
// 将来: const { data: { user } } = await supabase.auth.getUser(); に変更
const getUserId = () => {
  try {
    let uid = localStorage.getItem("em_user_id");
    if (!uid) {
      uid = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
      localStorage.setItem("em_user_id", uid);
    }
    return uid;
  } catch (e) {
    if (typeof window !== 'undefined') {
      if (!window._emUserId) window._emUserId = Math.random().toString(36).slice(2);
      return window._emUserId;
    }
    return "anon";
  }
};
// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const GLOBAL_VIDEOS = [{
  videoId: "aGJDmCgG44c",
  title: "TED Talk - English Learning Sample",
  channelTitle: "TED",
  thumbnail: "https://img.youtube.com/vi/aGJDmCgG44c/mqdefault.jpg"
}, {
  videoId: "MhJEw1U6mB4",
  title: "BBC Learning English Sample",
  channelTitle: "BBC Learning English",
  thumbnail: "https://img.youtube.com/vi/MhJEw1U6mB4/mqdefault.jpg"
}, {
  videoId: "F0fE-rFk-pE",
  title: "English Speeches Sample",
  channelTitle: "English Speeches",
  thumbnail: "https://img.youtube.com/vi/F0fE-rFk-pE/mqdefault.jpg"
}];
const STATIC_CAPTION_OVERRIDES = {};
const AFF_CARDS = AFFILIATE_CARDS;
// URLだけ差し替えるための設定（後からA8.net等のURLに変更可能）
const getAffCard = toeic => {
  var _AFF_CARDS_find;
  return (_AFF_CARDS_find = AFF_CARDS.find(c => toeic >= c.minScore && toeic <= c.maxScore)) !== null && _AFF_CARDS_find !== void 0 ? _AFF_CARDS_find : AFF_CARDS[0];
};
// 旧コードとの互換性のため AFF も維持
const AFF = {
  low: AFF_CARDS[0],
  mid: AFF_CARDS[1],
  high: AFF_CARDS[2]
};
const RAKUTEN_TOEIC_OFFICIAL_URL = 'https://rpx.a8.net/svt/ejp?a8mat=4B3YVA+A36FSI+2HOM+BWGDT&rakuten=y&a8ejpredirect=https%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2Fg00utzy4.2bo11901.g00utzy4.2bo12546%2Fa26052517603_4B3YVA_A36FSI_2HOM_BWGDT%3Fpc%3Dhttps%253A%252F%252Fitem.rakuten.co.jp%252Fnamions%252Fnm-4sjvqa17by9qlr6r%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252Fnamions%252Fi%252F10064058%252F%26rafcid%3Dwsc_i_is_a9f492a7-8ef9-40e2-ab89-4bc43a1ee283';
const RAKUTEN_TOEIC_OFFICIAL_IMAGE = 'https://thumbnail.image.rakuten.co.jp/@0_mall/namions/cabinet/12703112/p-4906033776-01.jpg?_ex=64x64';
// ── WORD BANK (TOEIC頻出 30語) ── AI差し替えポイント ──────────
const WORDS = [{
  id: "w01",
  word: "allocate",
  meaning: "割り当てる",
  pos: "動詞"
}, {
  id: "w02",
  word: "acquire",
  meaning: "取得する",
  pos: "動詞"
}, {
  id: "w03",
  word: "implement",
  meaning: "実施する",
  pos: "動詞"
}, {
  id: "w04",
  word: "facilitate",
  meaning: "促進する",
  pos: "動詞"
}, {
  id: "w05",
  word: "negotiate",
  meaning: "交渉する",
  pos: "動詞"
}, {
  id: "w06",
  word: "comprehensive",
  meaning: "包括的な",
  pos: "形容詞"
}, {
  id: "w07",
  word: "efficient",
  meaning: "効率的な",
  pos: "形容詞"
}, {
  id: "w08",
  word: "substantial",
  meaning: "相当な",
  pos: "形容詞"
}, {
  id: "w09",
  word: "mandatory",
  meaning: "義務的な",
  pos: "形容詞"
}, {
  id: "w10",
  word: "provisional",
  meaning: "暫定的な",
  pos: "形容詞"
}, {
  id: "w11",
  word: "reimburse",
  meaning: "払い戻す",
  pos: "動詞"
}, {
  id: "w12",
  word: "comply",
  meaning: "従う",
  pos: "動詞"
}, {
  id: "w13",
  word: "authorize",
  meaning: "承認する",
  pos: "動詞"
}, {
  id: "w14",
  word: "anticipate",
  meaning: "予期する",
  pos: "動詞"
}, {
  id: "w15",
  word: "scrutinize",
  meaning: "精査する",
  pos: "動詞"
}, {
  id: "w16",
  word: "deteriorate",
  meaning: "悪化する",
  pos: "動詞"
}, {
  id: "w17",
  word: "collaborate",
  meaning: "協力する",
  pos: "動詞"
}, {
  id: "w18",
  word: "amendment",
  meaning: "修正",
  pos: "名詞"
}, {
  id: "w19",
  word: "inventory",
  meaning: "在庫",
  pos: "名詞"
}, {
  id: "w20",
  word: "revenue",
  meaning: "収益",
  pos: "名詞"
}, {
  id: "w21",
  word: "expenditure",
  meaning: "支出",
  pos: "名詞"
}, {
  id: "w22",
  word: "momentum",
  meaning: "勢い",
  pos: "名詞"
}, {
  id: "w23",
  word: "initiative",
  meaning: "主導権",
  pos: "名詞"
}, {
  id: "w24",
  word: "tentative",
  meaning: "暫定的な",
  pos: "形容詞"
}, {
  id: "w25",
  word: "proficient",
  meaning: "熟練した",
  pos: "形容詞"
}, {
  id: "w26",
  word: "streamline",
  meaning: "合理化する",
  pos: "動詞"
}, {
  id: "w27",
  word: "outsource",
  meaning: "外部委託する",
  pos: "動詞"
}, {
  id: "w28",
  word: "adjacent",
  meaning: "隣接した",
  pos: "形容詞"
}, {
  id: "w29",
  word: "consecutive",
  meaning: "連続した",
  pos: "形容詞"
}, {
  id: "w30",
  word: "flagship",
  meaning: "主力の",
  pos: "形容詞"
}];
// ── GRAMMAR BANK (Part5 15問) ── AI差し替えポイント ──────────
const GRAMMAR = [{
  id: "g01",
  s: "The meeting has been _____ until next Friday.",
  opts: ["postponed", "postponing", "postpone", "postponement"],
  ans: "postponed",
  exp: "受動態の完了形：has been + 過去分詞。「延期された」状態。",
  cat: "受動態"
}, {
  id: "g02",
  s: "_____ the budget cuts, the project continued as planned.",
  opts: ["Despite", "Although", "However", "Because"],
  ans: "Despite",
  exp: "Despite（前置詞）は名詞句を伴う。Althoughは接続詞で節を伴う。",
  cat: "前置詞・接続詞"
}, {
  id: "g03",
  s: "The report must be submitted _____ Friday.",
  opts: ["by", "until", "since", "for"],
  ans: "by",
  exp: "by = 期限（〜までに）。until = 継続（〜までずっと）。",
  cat: "前置詞"
}, {
  id: "g04",
  s: "Employees are required to _____ their time sheets weekly.",
  opts: ["submit", "submitting", "submitted", "submission"],
  ans: "submit",
  exp: "to不定詞の後には動詞の原形が来る。",
  cat: "動詞の形"
}, {
  id: "g05",
  s: "The new policy will take _____ on April 1st.",
  opts: ["effect", "affect", "effort", "efficiency"],
  ans: "effect",
  exp: "take effect（発効する）は重要熟語。affectは動詞。",
  cat: "語彙・熟語"
}, {
  id: "g06",
  s: "_____ she finished early, she was able to leave on time.",
  opts: ["Because", "Despite", "Unless", "Although"],
  ans: "Because",
  exp: "becauseは理由の接続詞。因果関係を表す。",
  cat: "接続詞"
}, {
  id: "g07",
  s: "Please contact us _____ you have any questions.",
  opts: ["if", "unless", "despite", "while"],
  ans: "if",
  exp: "if（もし〜なら）が条件節を導く。",
  cat: "条件節"
}, {
  id: "g08",
  s: "The manager is responsible _____ overseeing the team.",
  opts: ["for", "of", "to", "at"],
  ans: "for",
  exp: "be responsible for（〜に責任がある）は重要表現。",
  cat: "前置詞"
}, {
  id: "g09",
  s: "_____ completed the training, all new staff must pass a final test.",
  opts: ["Having", "After having", "To have", "Have"],
  ans: "Having",
  exp: "分詞構文：Having + 過去分詞で「〜し終えてから」。",
  cat: "分詞構文"
}, {
  id: "g10",
  s: "Sales figures _____ significantly compared to last quarter.",
  opts: ["have risen", "are risen", "risen", "rising"],
  ans: "have risen",
  exp: "現在完了形：have + 過去分詞。riseの過去分詞はrisen。",
  cat: "時制"
}, {
  id: "g11",
  s: "_____ staff members attended the seminar voluntarily.",
  opts: ["Most", "Almost", "Mostly", "The most"],
  ans: "Most",
  exp: "Mostは形容詞として名詞を直接修飾できる。Almostは副詞。",
  cat: "形容詞・副詞"
}, {
  id: "g12",
  s: "The CEO announced that the company would _____ 200 new employees.",
  opts: ["hire", "hiring", "hired", "hires"],
  ans: "hire",
  exp: "間接話法：wouldの後に動詞の原形が来る。",
  cat: "時制・間接話法"
}, {
  id: "g13",
  s: "The room is available _____ you reserve it in advance.",
  opts: ["provided that", "in spite of", "due to", "regardless of"],
  ans: "provided that",
  exp: "provided that（〜という条件で）。as long asと言い換え可能。",
  cat: "接続詞"
}, {
  id: "g14",
  s: "The proposal was _____ accepted by all board members.",
  opts: ["unanimously", "ambiguously", "tentatively", "separately"],
  ans: "unanimously",
  exp: "unanimously（全員一致で）が文脈に合う副詞。",
  cat: "語彙・副詞"
}, {
  id: "g15",
  s: "We need to _____ our marketing strategy to reach younger audiences.",
  opts: ["revise", "revising", "revised", "revision"],
  ans: "revise",
  exp: "need to の後には動詞の原形が来る。",
  cat: "動詞の形"
}];
// ── LISTENING BANK (10文) ── AI差し替えポイント ───────────────
const LISTENING = [{
  id: "l01",
  en: "Please submit your report by the end of the week.",
  jp: "週末までにレポートを提出してください。",
  d: ["週の初めにレポートを確認してください。", "会議の前にレポートを印刷してください。", "レポートの内容を修正してください。"]
}, {
  id: "l02",
  en: "The meeting has been postponed until next Tuesday.",
  jp: "会議は来週火曜日まで延期されました。",
  d: ["会議は来週火曜日に予定されています。", "会議は今週火曜日にキャンセルされました。", "来週月曜日に会議の場所が変更になりました。"]
}, {
  id: "l03",
  en: "We need to reduce our expenditures this quarter.",
  jp: "今四半期は支出を削減する必要があります。",
  d: ["今四半期は収益を増やす必要があります。", "今四半期は人員を削減する必要があります。", "今四半期は在庫を確認する必要があります。"]
}, {
  id: "l04",
  en: "All staff are required to attend the training session.",
  jp: "全スタッフはトレーニングに参加が必要です。",
  d: ["スタッフはトレーニングに任意参加できます。", "管理職のみ参加が必要です。", "トレーニングは来月に延期されました。"]
}, {
  id: "l05",
  en: "The company has acquired a new business partner in Asia.",
  jp: "アジアで新しいビジネスパートナーを獲得しました。",
  d: ["アジアで新しい支社を開設しました。", "アジアのパートナーとの契約を終了しました。", "アジア市場から撤退することを決めました。"]
}, {
  id: "l06",
  en: "You can get a full refund if you are not satisfied.",
  jp: "ご満足いただけない場合は全額返金いたします。",
  d: ["ご満足いただいた場合は割引をご提供します。", "返金はご購入から30日以内に限ります。", "ご満足いただけない場合は交換をいたします。"]
}, {
  id: "l07",
  en: "Please contact the help desk if you have any issues.",
  jp: "問題がある場合はヘルプデスクにご連絡ください。",
  d: ["問題がある場合は上司に報告してください。", "すべての問題はメールでご報告ください。", "ヘルプデスクは平日のみ対応しています。"]
}, {
  id: "l08",
  en: "The project deadline has been moved up to next Monday.",
  jp: "締め切りが来週月曜日に前倒しになりました。",
  d: ["締め切りが来週月曜日まで延長されました。", "プロジェクトは来週月曜日に開始されます。", "来週月曜日にプロジェクトレビューがあります。"]
}, {
  id: "l09",
  en: "We are looking for motivated individuals to join our team.",
  jp: "意欲的な人材を募集しています。",
  d: ["チームの人員削減を検討しています。", "新しいチームを外部から雇用する予定です。", "経験豊富なマネージャーを探しています。"]
}, {
  id: "l10",
  en: "The annual sales report will be released next month.",
  jp: "年次売上レポートは来月公開される予定です。",
  d: ["年次売上レポートは先月公開されました。", "売上レポートは毎週更新されます。", "年次レポートの提出期限は来月です。"]
}];
const GACHA_PRIZES = [{
  emoji: "◆",
  text: "50 コイン獲得！",
  pts: 50,
  skill: null
}, {
  emoji: "✦",
  text: "30 コイン獲得！",
  pts: 30,
  skill: null
}, {
  emoji: "✦",
  text: "20 コイン獲得！",
  pts: 20,
  skill: null
}, {
  emoji: "•",
  text: "10 コイン獲得！",
  pts: 10,
  skill: null
}, {
  emoji: "·",
  text: "5 コイン獲得！",
  pts: 5,
  skill: null
}];
const COIN_COSTS = {
  VIDEO_GENERATION: 100,
  VIDEO_PARTIAL_REFUND: 50,
  VIDEO_CONTINUE_TRANSLATION: 10,
  VIDEO_CONTINUE_PARTIAL_REFUND: 5,
  PRACTICE: 5,
  TEST: 10,
  AI: 5
};
const AI_LIMIT_MESSAGE = 'システム側のAI利用上限に達したため、現在翻訳を利用できません。数日後に再度お試しください。';
const isAiLimitError = err => /AI_SYSTEM_LIMIT|rate_limit|quota|429|利用上限|limit/i.test(String((err === null || err === void 0 ? void 0 : err.message) || err || ''));
// ══ UTILS ════════════════════════════════════════════════════════
const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const shuffleQuestionOptions = q => {
  const options = Array.isArray(q === null || q === void 0 ? void 0 : q.options) ? q.options : Array.isArray(q === null || q === void 0 ? void 0 : q.opts) ? q.opts : null;
  if (!(options === null || options === void 0 ? void 0 : options.length)) return q;
  return {
    ...q,
    options: shuffle(options),
    opts: Array.isArray(q === null || q === void 0 ? void 0 : q.opts) ? shuffle(options) : q === null || q === void 0 ? void 0 : q.opts
  };
};
// AI差し替えポイント: savedLinesがある場合はAPI Route /api/ai/quiz でAI生成
// savedLinesが少ない場合はローカルダミーデータにフォールバック
// ── 問題生成（AI生成＋DBキャッシュ方式）────────────────────────
// /api/quiz/generate がキャッシュ確認→AI生成→DB保存を一括処理する
// source_type / level をクライアントで決定
function getSourceType(savedLines) {
  return savedLines.length >= 5 ? 'custom' : 'toeic';
}
async function fetchQuiz(quizType, savedLines, n, userId) {
  let forceRegen = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
  const sourceType = getSourceType(savedLines);
  console.log("[quiz] generate: ".concat(quizType, " / ").concat(sourceType, " / userId=").concat(userId.slice(0, 8)));
  try {
    const res = await fetch('/api/quiz/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quizType,
        sourceType,
        level: 'level_600',
        count: n,
        savedLines: savedLines.slice(0, 20),
        userId,
        forceRegen
      })
    });
    if (!res.ok) throw new Error("HTTP ".concat(res.status));
    const d = await res.json();
    console.log("[quiz] " + (d.fromCache ? 'CACHE HIT' : 'AI生成') + ": " + d.cacheKey + " (" + d.questions.length + "問)");
    return d.questions;
  } catch (err) {
    console.error('[quiz] fetch error:', err);
    return [];
  }
}
const genWord = async function () {
  let savedLines = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
    n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10,
    userId = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '';
  const qs = await fetchQuiz('word', savedLines, n, userId);
  if (qs.length > 0) return qs;
  // フォールバック: ダミー
  return shuffle(WORDS).slice(0, n).map((w, __idx) => {
    const others = shuffle(WORDS.filter(x => x.id !== w.id)).slice(0, 3);
    var _w_meaning, _w_meaning1;
    return {
      ...w,
      options: shuffle([(_w_meaning = w.meaning) !== null && _w_meaning !== void 0 ? _w_meaning : '', ...others.map((o, __idx) => {
        var _o_meaning;
        return (_o_meaning = o.meaning) !== null && _o_meaning !== void 0 ? _o_meaning : '';
      })]),
      correct: (_w_meaning1 = w.meaning) !== null && _w_meaning1 !== void 0 ? _w_meaning1 : ''
    };
  });
};
const genGrammar = async function () {
  let savedLines = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
    n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10,
    userId = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '';
  const qs = await fetchQuiz('grammar', savedLines, n, userId);
  if (qs.length > 0) return qs;
  return shuffle(GRAMMAR).slice(0, n).map((q, __idx) => {
    var _q_opts, _q_ans;
    return {
      ...q,
      options: (_q_opts = q.opts) !== null && _q_opts !== void 0 ? _q_opts : [],
      correct: (_q_ans = q.ans) !== null && _q_ans !== void 0 ? _q_ans : ''
    };
  });
};
async function fetchGrammarList(userId) {
  try {
    const res = await fetch("/api/grammar/list?userId=".concat(encodeURIComponent(userId)));
    if (!res.ok) throw new Error("HTTP ".concat(res.status));
    const data = await res.json();
    const questions = Array.isArray(data.questions) ? data.questions : [];
    questions._meta = data;
    return questions;
  } catch (err) {
    console.error('[grammar/list]', err);
    return [];
  }
}
async function fetchGrammarSession(userId) {
  let mode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'test',
    count = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 5,
    questionId = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : '';
  try {
    const res = await fetch('/api/grammar/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        mode,
        count,
        questionId
      })
    });
    if (!res.ok) throw new Error("HTTP ".concat(res.status));
    const data = await res.json();
    const questions = Array.isArray(data.questions) ? data.questions : [];
    questions._meta = data;
    return questions;
  } catch (err) {
    console.error('[grammar/session]', err);
    return [];
  }
}
async function saveGrammarAttempt(userId, question, selected) {
  let mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 'test';
  if (!(question === null || question === void 0 ? void 0 : question.id)) return;
  if (String(question.id).startsWith('fallback-')) return;
  var _question_correct;
  fetch('/api/grammar/attempt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      questionId: question.id,
      selected,
      correct: (_question_correct = question.correct) !== null && _question_correct !== void 0 ? _question_correct : question.ans,
      mode
    })
  }).catch(err => console.error('[grammar/attempt]', err));
}
const genListening = async function () {
  let savedLines = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
    n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10,
    userId = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '';
  const qs = await fetchQuiz('listening', savedLines, n, userId);
  if (qs.length > 0) return qs;
  return shuffle(LISTENING).slice(0, n).map((item, __idx) => {
    var _item_jp, _item_d, _item_jp1;
    return {
      ...item,
      options: shuffle([(_item_jp = item.jp) !== null && _item_jp !== void 0 ? _item_jp : '', ...((_item_d = item.d) !== null && _item_d !== void 0 ? _item_d : [])]),
      correct: (_item_jp1 = item.jp) !== null && _item_jp1 !== void 0 ? _item_jp1 : ''
    };
  });
};
const formatPart5Sentence = function () {
  let sentence = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
  return sentence.replace(/_{3,}/g, '(     )');
};
const getPart5Japanese = q => {
  const ja = String((q === null || q === void 0 ? void 0 : q.ja) || (q === null || q === void 0 ? void 0 : q.jp) || '').trim();
  return ja || '問題文の日本語訳は次回生成時に追加されます。';
};
const calcToeic = r => {
  const last = a => a.length > 0 ? a[a.length - 1] : null;
  const acc = x => x ? x.correct / x.total : 0;
  const shAvg = r.shadowing.length > 0 ? r.shadowing.reduce((s, x) => s + x.score, 0) / r.shadowing.length : 0;
  const tests = r.word.length + r.grammar.length + r.listening.length + r.shadowing.length;
  const raw = 280 + acc(last(r.word)) * 110 + acc(last(r.grammar)) * 120 + acc(last(r.listening)) * 150 + shAvg / 100 * 80;
  const confidencePenalty = tests < 3 ? 70 : tests < 6 ? 35 : 0;
  return Math.min(990, Math.max(250, Math.round(raw - confidencePenalty)));
};
const toeicConfidence = r => {
  const tests = r.word.length + r.grammar.length + r.listening.length + r.shadowing.length;
  if (tests < 3) return {
    label: '低',
    note: 'まだ参考値です。3回以上テストすると精度が上がります。'
  };
  if (tests < 6) return {
    label: '中',
    note: '学習データが増えるほど安定します。'
  };
  return {
    label: '高',
    note: '最近の学習結果をもとに推定しています。'
  };
};
const spLevel = t => {
  if (t < 300) return {
    label: "入門",
    en: "Starter",
    color: "#94A3B8",
    grade: "A1"
  };
  if (t < 400) return {
    label: "初級",
    en: "Elementary",
    color: "#8FA3B8",
    grade: "A2"
  };
  if (t < 500) return {
    label: "初中級",
    en: "Pre-Intermediate",
    color: "#34D399",
    grade: "B1"
  };
  if (t < 600) return {
    label: "中級",
    en: "Intermediate",
    color: "#FBBF24",
    grade: "B1+"
  };
  if (t < 700) return {
    label: "中上級",
    en: "Upper-Intermediate",
    color: "#F97316",
    grade: "B2"
  };
  if (t < 800) return {
    label: "上級",
    en: "Advanced",
    color: "#A78BFA",
    grade: "C1"
  };
  return {
    label: "最上級",
    en: "Proficient",
    color: "#EF4444",
    grade: "C2"
  };
};
const affLevel = s => s < 500 ? "low" : s < 700 ? "mid" : "high";
const stars = (n, t) => Array.from({
  length: 5
}, (_, i) => i < Math.round(n / t * 5));
// ══ ICONS ════════════════════════════════════════════════════════
const I = param => {
  let {
    n,
    s = 20,
    c = "currentColor"
  } = param;
  return {
    home: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill={c}>{/*#__PURE__*/<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />}</svg>,
    learn: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />}{/*#__PURE__*/<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />}</svg>,
    bkmk: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />}</svg>,
    bkmkF: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill={c}>{/*#__PURE__*/<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />}</svg>,
    gift: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<polyline points="20 12 20 22 4 22 4 12" />}{/*#__PURE__*/<rect x="2" y="7" width="20" height="5" />}{/*#__PURE__*/<line x1="12" y1="22" x2="12" y2="7" />}{/*#__PURE__*/<path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />}{/*#__PURE__*/<path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />}</svg>,
    cog: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<circle cx="12" cy="12" r="3" />}{/*#__PURE__*/<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />}</svg>,
    star: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill={c}>{/*#__PURE__*/<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />}</svg>,
    play: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill={c}>{/*#__PURE__*/<polygon points="5 3 19 12 5 21 5 3" />}</svg>,
    mic: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />}{/*#__PURE__*/<path d="M19 10v2a7 7 0 0 1-14 0v-2" />}{/*#__PURE__*/<line x1="12" y1="19" x2="12" y2="23" />}{/*#__PURE__*/<line x1="8" y1="23" x2="16" y2="23" />}</svg>,
    close: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5">{/*#__PURE__*/<line x1="18" y1="6" x2="6" y2="18" />}{/*#__PURE__*/<line x1="6" y1="6" x2="18" y2="18" />}</svg>,
    chL: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5">{/*#__PURE__*/<polyline points="15 18 9 12 15 6" />}</svg>,
    chR: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5">{/*#__PURE__*/<polyline points="9 18 15 12 9 6" />}</svg>,
    ok: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5">{/*#__PURE__*/<polyline points="20 6 9 17 4 12" />}</svg>,
    ng: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5">{/*#__PURE__*/<line x1="18" y1="6" x2="6" y2="18" />}{/*#__PURE__*/<line x1="6" y1="6" x2="18" y2="18" />}</svg>,
    vol: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />}{/*#__PURE__*/<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}{/*#__PURE__*/<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}</svg>,
    chart: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<line x1="18" y1="20" x2="18" y2="10" />}{/*#__PURE__*/<line x1="12" y1="20" x2="12" y2="4" />}{/*#__PURE__*/<line x1="6" y1="20" x2="6" y2="14" />}</svg>,
    yt: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill={c}>{/*#__PURE__*/<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />}{/*#__PURE__*/<polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />}</svg>,
    trophy: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />}{/*#__PURE__*/<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />}{/*#__PURE__*/<path d="M4 22h16" />}{/*#__PURE__*/<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />}{/*#__PURE__*/<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />}{/*#__PURE__*/<path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />}</svg>,
    trash: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<polyline points="3 6 5 6 21 6" />}{/*#__PURE__*/<path d="M19 6l-1 14H6L5 6" />}{/*#__PURE__*/<path d="M10 11v6" />}{/*#__PURE__*/<path d="M14 11v6" />}{/*#__PURE__*/<path d="M9 6V4h6v2" />}</svg>,
    ad: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<rect x="2" y="5" width="20" height="14" rx="2" />}{/*#__PURE__*/<path d="M8 14l4-8 4 8" />}{/*#__PURE__*/<line x1="9.5" y1="11" x2="14.5" y2="11" />}</svg>,
    pie: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<path d="M21.21 15.89A10 10 0 1 1 8 2.83" />}{/*#__PURE__*/<path d="M22 12A10 10 0 0 0 12 2v10z" />}</svg>,
    vid: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<polygon points="23 7 16 12 23 17 23 7" />}{/*#__PURE__*/<rect x="1" y="5" width="15" height="14" rx="2" />}</svg>,
    book: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />}{/*#__PURE__*/<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />}</svg>,
    info: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<circle cx="12" cy="12" r="10" />}{/*#__PURE__*/<line x1="12" y1="8" x2="12" y2="12" />}{/*#__PURE__*/<line x1="12" y1="16" x2="12.01" y2="16" />}</svg>,
    ear: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<path d="M3 18v-6a9 9 0 0 1 18 0v6" />}{/*#__PURE__*/<path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />}</svg>,
    news: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />}{/*#__PURE__*/<path d="M18 14h-8" />}{/*#__PURE__*/<path d="M15 18h-5" />}{/*#__PURE__*/<path d="M10 6h8v4h-8V6Z" />}</svg>,
    globe: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<circle cx="12" cy="12" r="10" />}{/*#__PURE__*/<line x1="2" y1="12" x2="22" y2="12" />}{/*#__PURE__*/<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />}</svg>,
    extlnk: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />}{/*#__PURE__*/<polyline points="15 3 21 3 21 9" />}{/*#__PURE__*/<line x1="10" y1="14" x2="21" y2="3" />}</svg>,
    xmark: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5">{/*#__PURE__*/<circle cx="12" cy="12" r="10" />}{/*#__PURE__*/<line x1="15" y1="9" x2="9" y2="15" />}{/*#__PURE__*/<line x1="9" y1="9" x2="15" y2="15" />}</svg>,
    refresh: /*#__PURE__*/<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">{/*#__PURE__*/<polyline points="23 4 23 10 17 10" />}{/*#__PURE__*/<polyline points="1 20 1 14 7 14" />}{/*#__PURE__*/<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />}</svg>
  }[n] || null;
};
// ═══════════════════════════════════════════════════════════════
// AI & YOUTUBE UTILS  （AI差し替えポイント）
// ═══════════════════════════════════════════════════════════════
// ① YouTube動画情報取得（oEmbed - 認証不要）
const fetchVideoInfo = async videoId => {
  try {
    const r = await fetch("https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=".concat(videoId, "&format=json"));
    if (!r.ok) return null;
    const d = await r.json();
    return {
      title: d.title,
      channelTitle: d.author_name,
      thumbnail: "https://img.youtube.com/vi/".concat(videoId, "/mqdefault.jpg")
    };
  } catch (e) {
    return null;
  }
};
const buildTimedSentences = function () {
  let segments = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  const out = [];
  let buf = '',
    wc = 0,
    start = null,
    end = 0;
  for (const seg of segments || []) {
    const w = String((seg === null || seg === void 0 ? void 0 : seg.text) || '').replace(/\n/g, ' ').trim();
    if (!w) continue;
    if (start === null) start = Number(seg.start || 0);
    end = Math.max(end, Number(seg.start || 0) + Number(seg.duration || 0));
    buf += (buf ? ' ' : '') + w;
    wc += w.split(/\s+/).length;
    if (wc >= 12 || /[.!?]$/.test(w)) {
      if (buf.split(/\s+/).length >= 4) {
        out.push({
          text: buf.trim(),
          start: start || 0,
          duration: Math.max(0.5, end - (start || 0))
        });
      }
      buf = '';
      wc = 0;
      start = null;
      end = 0;
    }
  }
  if (buf.split(/\s+/).length >= 4) {
    out.push({
      text: buf.trim(),
      start: start || 0,
      duration: Math.max(0.5, end - (start || 0))
    });
  }
  return out.slice(0, MAX_STUDY_CAPTIONS);
};
// ② YouTube字幕取得
// 優先順: DBキャッシュ → サーバーサイドAPI(戦略A/B) → CORSプロキシ(戦略C)
// ※ CORSプロキシ(allorigins/corsproxy)はサーバー側には一切置かない
const fetchTranscript = async videoId => {
  let serverReason = '';
  // ── DBキャッシュ確認 ─────────────────────────────────────
  if (SB_READY) {
    try {
      const cr = await fetch("/api/transcript/cache?videoId=".concat(encodeURIComponent(videoId)), {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
      });
      if (cr.ok) {
        const cd = await cr.json();
        if (cd.ok && cd.hit && Array.isArray(cd.sentences) && cd.sentences.length >= 2) {
          console.debug("[fetchTranscript] DBキャッシュヒット: ".concat(cd.sentences.length, "文"));
          const rebuiltTimedSentences = buildTimedSentences(cd.segments || []);
          const timedSentences = Array.isArray(cd.timedSentences) && cd.timedSentences.length > 20 ? cd.timedSentences : rebuiltTimedSentences;
          const sentences = timedSentences.length ? timedSentences.map((item, __idx) => item.text) : cd.sentences;
          return {
            ok: true,
            sentences,
            timedSentences,
            segments: cd.segments || [],
            fromCache: true
          };
        }
      }
    } catch (e) {}
  }
  // ── 戦略A+B: サーバーサイドAPI ───────────────────────────
  try {
    console.debug("[fetchTranscript] 戦略A/B: /api/transcript?videoId=".concat(videoId));
    const r = await fetch("/api/transcript?videoId=".concat(encodeURIComponent(videoId)), {
      signal: AbortSignal.timeout ? AbortSignal.timeout(15000) : undefined
    });
    if (r.ok) {
      const d = await r.json();
      if (d.ok && Array.isArray(d.sentences) && d.sentences.length >= 2) {
        var _d_segments;
        console.debug("[fetchTranscript] サーバーAPI成功: ".concat(d.sentences.length, "文 / ").concat(d.count || '?', "セグメント / ").concat(d.elapsed, "ms"));
        // DBキャッシュへ非同期保存（失敗しても継続）
        if (SB_READY && ((_d_segments = d.segments) === null || _d_segments === void 0 ? void 0 : _d_segments.length)) {
          const timedSentences = Array.isArray(d.timedSentences) && d.timedSentences.length ? d.timedSentences : buildTimedSentences(d.segments || []);
          fetch('/api/transcript/cache', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              videoId,
              segments: d.segments,
              sentences: d.sentences,
              timedSentences
            })
          }).catch(() => {});
        }
        return {
          ok: true,
          sentences: d.sentences,
          timedSentences: Array.isArray(d.timedSentences) ? d.timedSentences : buildTimedSentences(d.segments || []),
          segments: d.segments || []
        };
      }
      if (!d.ok) {
        serverReason = d.reason || 'サーバー側で字幕を取得できませんでした';
        console.debug("[fetchTranscript] サーバーAPI失敗: ".concat(serverReason, " → 戦略Cへ"));
      }
    }
  } catch (e) {
    console.warn('[fetchTranscript] サーバーAPI失敗:', e.message, '→ 戦略Cへ');
  }
  // ── 戦略C: CORSプロキシ（サーバーAPI停止時の最終保険）────
  // ※ 不安定な外部サービスへの依存は最小限に
  const PROXIES = [url => "https://api.allorigins.win/get?url=".concat(encodeURIComponent(url)), url => "https://corsproxy.io/?".concat(encodeURIComponent(url))];
  const langs = ['en', 'a.en', 'en-US', 'en-GB'];
  for (const proxy of PROXIES) {
    for (const lang of langs) {
      try {
        const ytUrl = "https://www.youtube.com/api/timedtext?v=".concat(videoId, "&lang=").concat(lang, "&fmt=xml");
        const signal = AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined;
        const r = await fetch(proxy(ytUrl), {
          signal
        });
        if (!r.ok) continue;
        const ct = r.headers.get('content-type') || '';
        let xml = '';
        if (ct.includes('application/json')) {
          const d = await r.json();
          xml = d.contents || '';
        } else {
          xml = await r.text();
        }
        if (!xml.includes('<text')) continue;
        const sentences = [];
        let buf = '',
          wc = 0;
        const re = /<text[^>]*>([\s\S]*?)<\/text>/g;
        let m;
        while ((m = re.exec(xml)) !== null) {
          const w = m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\n/g, ' ').trim();
          if (!w) continue;
          buf += (buf ? ' ' : '') + w;
          wc += w.split(/\s+/).length;
          if (wc >= 12 || /[.!?]$/.test(w)) {
            if (buf.split(/\s+/).length >= 4) sentences.push(buf.trim());
            buf = '';
            wc = 0;
          }
        }
        if (buf.split(/\s+/).length >= 4) sentences.push(buf.trim());
        if (sentences.length >= 2) {
          console.debug("[fetchTranscript] 戦略C成功: lang=".concat(lang, ", ").concat(sentences.length, "文"));
          return {
            ok: true,
            sentences: sentences.slice(0, MAX_STUDY_CAPTIONS),
            segments: []
          };
        }
      } catch (e) {}
    }
  }
  console.debug('[fetchTranscript] 全戦略失敗');
  return {
    ok: false,
    reason: "".concat(serverReason ? "".concat(serverReason, "\n") : '', "字幕の自動取得に失敗しました。字幕がある動画でも、YouTube側の制限で取得できないことがあります。\n下に英語字幕を貼り付けると、そのままAI処理を続行できます。")
  };
};
// ③ Anthropic API: 日本語イメージ生成（AI差し替えポイント - モデル・プロンプト変更可）
const aiGenerateChunks = async (sentences, onProgress) => {
  // API Route /api/ai/chunk 経由（APIキーはサーバー側）
  const results = [];
  const batchSize = 4;
  for (let i = 0; i < sentences.length; i += batchSize) {
    const batch = sentences.slice(i, i + batchSize);
    try {
      const r = await fetch('/api/ai/chunk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sentences: batch
        })
      });
      const d = await r.json();
      if (!r.ok) {
        const msg = (d === null || d === void 0 ? void 0 : d.error) || "HTTP ".concat(r.status);
        if (r.status === 429 || r.status === 503 || isAiLimitError(msg)) throw new Error('AI_SYSTEM_LIMIT');
        throw new Error(msg);
      }
      if (Array.isArray(d.captions)) {
        results.push(...d.captions);
      } else if (Array.isArray(d.chunks)) {
        results.push(...d.chunks.map((c, j) => ({
          id: "ai_".concat(i + j),
          english: c.en || '',
          chunks: c.en ? c.en.split(/\s+/).filter(Boolean).slice(0, 8) : [],
          meaning: c.ja ? [c.ja] : ['日本語イメージを生成できませんでした。']
        })).filter(c => c.english));
      }
    } catch (err) {
      console.error('[aiGenerateChunks]', err.message);
      if (isAiLimitError(err)) throw err;
      batch.forEach(s => results.push({
        english: s,
        chunks: s.split(' ').slice(0, 5),
        meaning: ['(生成失敗)']
      }));
    }
    onProgress(Math.round((i + batchSize) / sentences.length * 85));
    await new Promise(r => setTimeout(r, 200));
  }
  return results;
};
const looksLikeLegacyChunkMeaning = caption => {
  const text = ((caption === null || caption === void 0 ? void 0 : caption.meaning) || []).join(' / ');
  if (!text.trim()) return true;
  if (/日本語イメージを生成できません|生成失敗|AI未接続|未生成です/.test(text)) return true;
  if (/日本語イメージを生成できません|生成失敗|AI未接続/.test(text)) return true;
  if (/[譌繧縺蜿逕謨隱譁]/.test(text)) return true;
  return false;
};
const refreshJapaneseImagesIfNeeded = async function (captions) {
  let onProgress = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : () => {};
  if (!Array.isArray(captions) || !captions.length) return captions;
  if (!captions.some(looksLikeLegacyChunkMeaning)) return captions;
  const regenerated = await aiGenerateChunks(captions.map((c, __idx) => c.english).filter(Boolean), onProgress);
  return captions.map((caption, i) => {
    var _next_meaning;
    const next = regenerated[i];
    if (!(next === null || next === void 0 ? void 0 : (_next_meaning = next.meaning) === null || _next_meaning === void 0 ? void 0 : _next_meaning.length)) return caption;
    return {
      ...caption,
      chunks: [],
      meaning: next.meaning
    };
  });
};
// ════════════════════════════════════════════════════════════════
// NEWS UTILS
// ════════════════════════════════════════════════════════════════
// ① BBC RSS フィード取得（CORS proxy経由）
const fetchBBCNews = async function () {
  let feed = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'world';
  let country = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'us';
  // API Route /api/news/bbc 経由（サーバー側でCORSを解決）
  // allorigins.win は本番不安定なためサーバープロキシに変更
  try {
    const r = await fetch("/api/news/bbc?feed=".concat(encodeURIComponent(feed), "&country=").concat(encodeURIComponent(country)), {
      signal: AbortSignal.timeout(10000)
    });
    if (!r.ok) throw new Error("BBC API error: ".concat(r.status));
    const d = await r.json();
    return Array.isArray(d.articles) ? d.articles : [];
  } catch (err) {
    console.error('[fetchBBCNews]', err.message);
    return [];
  }
};
const fetchPageSixNews = async function () {
  let feed = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'latest';
  try {
    const r = await fetch("/api/news/pagesix?feed=".concat(encodeURIComponent(feed)), {
      signal: AbortSignal.timeout(10000)
    });
    if (!r.ok) throw new Error("PageSix API error: ".concat(r.status));
    const d = await r.json();
    return Array.isArray(d.articles) ? d.articles : [];
  } catch (err) {
    console.error('[fetchPageSixNews]', err.message);
    return [];
  }
};
// ② 英文を文単位に分割
const splitSentences = text => {
  var _text_match;
  const re = new RegExp('[^.!?]+[.!?]+[\\s]*', 'g');
  return ((_text_match = text.match(re)) === null || _text_match === void 0 ? void 0 : _text_match.map((s, __idx) => s.trim()).filter(s => s.split(' ').length >= 3)) || [text];
};
// ③ AI: 単語の意味を返す
const aiWordMeaning = async function (word, sentence) {
  let userId = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '';
  // API Route /api/ai/word 経由
  try {
    const r = await fetch('/api/ai/word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word,
        sentence,
        userId
      })
    });
    const d = await r.json();
    if (!r.ok) return d;
    return d;
  } catch (err) {
    console.error('[aiWordMeaning]', err.message);
    return {
      meaning: '取得できませんでした',
      pos: '',
      example: ''
    };
  }
};
// ④ AI: 1文を翻訳する
const aiTranslateSentence = async function (sentence) {
  let userId = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
  // API Route /api/ai/translate 経由
  try {
    const r = await fetch('/api/ai/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: sentence,
        mode: 'sentence',
        userId
      })
    });
    const d = await r.json();
    if (!r.ok) return d;
    return d;
  } catch (err) {
    console.error('[aiTranslateSentence]', err.message);
    return {
      translation: '翻訳に失敗しました。もう一度お試しください。',
      error: err === null || err === void 0 ? void 0 : err.message
    };
  }
};
// ⑤ AI: 全文翻訳
const aiTranslateAll = async function (text) {
  let userId = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
  // API Route /api/ai/translate 経由（mode: full）
  try {
    const r = await fetch('/api/ai/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        mode: 'full',
        userId
      })
    });
    const d = await r.json();
    if (!r.ok) return d;
    return d;
  } catch (err) {
    console.error('[aiTranslateAll]', err.message);
    return {
      translation: '翻訳に失敗しました。もう一度お試しください。',
      error: err === null || err === void 0 ? void 0 : err.message
    };
  }
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
      added_at: new Date().toISOString()
    }, 'user_id,video_id');
  } catch (e) {}
};
const dbLoadVideos = async userId => {
  if (!SB_READY) return [];
  try {
    const [rows, captionRows] = await Promise.all([sbFrom('user_videos').select("order=added_at.desc&limit=100"), sbFrom('video_captions').select("select=video_id&limit=1000")]);
    if (!Array.isArray(rows)) return [];
    const readyVideoIds = new Set((Array.isArray(captionRows) ? captionRows : []).map((r, __idx) => r.video_id));
    return rows.map((r, __idx) => ({
      videoId: r.video_id,
      title: r.title,
      channelTitle: r.channel_title,
      thumbnail: r.thumbnail,
      aiReady: readyVideoIds.has(r.video_id),
      hasTranslation: readyVideoIds.has(r.video_id),
      shared: r.user_id !== userId,
      addedAt: r.added_at,
      likes: Number(r.like_count || 0),
      dislikes: Number(r.dislike_count || 0)
    }));
  } catch (e) {
    return [];
  }
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
      start: Number(c.start || 0),
      duration: Number(c.duration || 0)
    }));
    const saved = await sbFrom('video_captions').upsert(rows, 'video_id,caption_index');
    if (!saved) {
      const legacyRows = rows.map(({ start, duration, ...row }) => row);
      await sbFrom('video_captions').upsert(legacyRows, 'video_id,caption_index');
    }
  } catch (e) {}
};
// ⑥ Supabase: 字幕を取得
const dbLoadCaptions = async videoId => {
  if (!SB_READY) return null;
  try {
    const rows = await sbFrom('video_captions').select("video_id=eq.".concat(videoId, "&order=caption_index.asc"));
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows.map((r, i) => ({
      id: "".concat(videoId, "_").concat(i),
      english: r.english,
      chunks: r.chunks || [],
      meaning: r.meaning || [],
      start: Number(r.start || 0),
      duration: Number(r.duration || 0)
    }));
  } catch (e) {
    return null;
  }
};
// ══ CSS ══════════════════════════════════════════════════════════

export { DEFAULT_THUMBNAIL, SB_URL_AUTH, SB_ANON_AUTH, REWARD_ADS_ENABLED, MAX_STUDY_CAPTIONS, getSupabaseAuthConfig, supabaseAuth, SB_URL, SB_KEY, SB_READY, sbFrom, getUserId, GLOBAL_VIDEOS, STATIC_CAPTION_OVERRIDES, AFF_CARDS, getAffCard, AFF, RAKUTEN_TOEIC_OFFICIAL_URL, RAKUTEN_TOEIC_OFFICIAL_IMAGE, WORDS, GRAMMAR, LISTENING, GACHA_PRIZES, COIN_COSTS, AI_LIMIT_MESSAGE, isAiLimitError, shuffle, shuffleQuestionOptions, getSourceType, fetchQuiz, genWord, genGrammar, fetchGrammarList, fetchGrammarSession, saveGrammarAttempt, genListening, formatPart5Sentence, getPart5Japanese, calcToeic, toeicConfidence, spLevel, affLevel, stars, I, fetchVideoInfo, buildTimedSentences, fetchTranscript, aiGenerateChunks, looksLikeLegacyChunkMeaning, refreshJapaneseImagesIfNeeded, fetchBBCNews, fetchPageSixNews, splitSentences, aiWordMeaning, aiTranslateSentence, aiTranslateAll, dbSaveVideo, dbLoadVideos, dbSaveCaptions, dbLoadCaptions };
