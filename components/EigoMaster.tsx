// @ts-nocheck

import React, { useState, useRef, useCallback, useEffect } from "react";
import { CoinCostLabel, ErrorBoundary } from "./common";
import { CSS } from "./eigoMaster/styles";
import { useEigoMasterViews } from "./eigoMaster/views";
import { isAndroidNativeRewardedAdEnvironment, showRewardedAd } from "../lib/admobRewarded";
import { AFFILIATE_LINKS } from "../lib/affiliateLinks";
import { DEFAULT_THUMBNAIL, SB_URL_AUTH, SB_ANON_AUTH, REWARD_ADS_ENABLED, MAX_STUDY_CAPTIONS, getSupabaseAuthConfig, supabaseAuth, SB_URL, SB_KEY, SB_READY, sbFrom, getUserId, GLOBAL_VIDEOS, STATIC_CAPTION_OVERRIDES, AFF_CARDS, getAffCard, AFF, RAKUTEN_TOEIC_OFFICIAL_URL, RAKUTEN_TOEIC_OFFICIAL_IMAGE, WORDS, GRAMMAR, LISTENING, GACHA_PRIZES, COIN_COSTS, AI_LIMIT_MESSAGE, isAiLimitError, shuffle, shuffleQuestionOptions, getSourceType, fetchQuiz, genWord, genGrammar, fetchGrammarList, fetchGrammarSession, saveGrammarAttempt, genListening, formatPart5Sentence, getPart5Japanese, calcToeic, toeicConfidence, spLevel, affLevel, stars, I, fetchVideoInfo, buildTimedSentences, fetchTranscript, aiGenerateChunks, looksLikeLegacyChunkMeaning, refreshJapaneseImagesIfNeeded, fetchBBCNews, fetchPageSixNews, splitSentences, aiWordMeaning, aiTranslateSentence, aiTranslateAll, dbSaveVideo, dbLoadVideos, dbSaveCaptions, dbLoadCaptions } from "./eigoMaster/core";

// ErrorBoundaryでラップしてデフォルトエクスポート
function EigoMasterInner() {
  // ── Auth state（Phase4: Google OAuth）──────────────────────
  const [authUser, setAuthUser] = useState<any>(null); // {id, email, name, avatar_url}
  const [authLoading, setAuthLoading] = useState<any>(true); // 初期認証チェック中
  // ── nav & screens
  const [navTab, setNavTab] = useState<any>("home");
  const [screen, setScreen] = useState<any>("main"); // main|video|wordTest|grammarTest|listeningTest|analysis
  const [homeTab, setHomeTab] = useState<any>("all");
  const [videoPage, setVideoPage] = useState<any>(0);
  // video
  const [curVid, setCurVid] = useState<any>(null);
  const [capIdx, setCapIdx] = useState<any>(0);
  const [autoSync, setAutoSync] = useState<any>(false);
  const manualNavUntilRef = useRef(0);
  const autoSyncTimerRef = useRef(null);
  const ytReaderRef = useRef(null);
  const [ytReaderReady, setYtReaderReady] = useState<any>(false);
  const [jpRegenerating, setJpRegenerating] = useState<any>(false);
  const [videos, setVideos] = useState<any>(GLOBAL_VIDEOS);
  const [translationApiLimited, setTranslationApiLimited] = useState<any>(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('eb_translation_api_limited') === '1';
    } catch (e) {
      return false;
    }
  });
  const [videoVotes, setVideoVotes] = useState<any>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('eb_video_votes') : '';
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });
  const [urlIn, setUrlIn] = useState<any>("");
  const [urlLd, setUrlLd] = useState<any>(false);
  const [myList, setMyList] = useState<any>([]);
  const [saved, setSaved] = useState<any>(() => {
    try {
      const s = typeof window !== 'undefined' && localStorage.getItem('em_saved');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return [];
  });
  const [affVis, setAffVis] = useState<any>(true);
  const [sett, setSett] = useState<any>({
    affOn: true,
    rewOn: REWARD_ADS_ENABLED
  });
  // shadowing
  const [shwShow, setShwShow] = useState<any>(false);
  const [shwPh, setShwPh] = useState<any>("idle"); // idle|rec|score
  const [shwSc, setShwSc] = useState<any>(0);
  const [shwTranscript, setShwTranscript] = useState<any>(''); // 認識されたテキスト
  const [shwWords, setShwWords] = useState<any>(0); // マッチした単語数
  const [shwTotal, setShwTotal] = useState<any>(0); // 総単語数
  const [shwEngine, setShwEngine] = useState<any>('unavailable'); // 使用エンジン
  // reward ad
  const [rewShow, setRewShow] = useState<any>(false);
  const [rewPct, setRewPct] = useState<any>(0);
  const [rewCb, setRewCb] = useState<any>(null);
  const [rewStatus, setRewStatus] = useState<any>('idle');
  const [rewardedAdsAvailable, setRewardedAdsAvailable] = useState<any>(false);
  const rewardAdInFlightRef = useRef(false);
  // points / gacha
  const [pts, setPts] = useState<any>(() => {
    try {
      const s = typeof window !== 'undefined' && localStorage.getItem('em_pts');
      if (s) return Number(s) || 120;
    } catch (e) {}
    return 120;
  });
  const [gRes, setGRes] = useState<any>(null);
  const [gHist, setGHist] = useState<any>([]);
  // ── Parallel Reader state ──
  const [prMode, setPrMode] = useState<any>('input'); // 'input'|'read'
  const [prEnText, setPrEnText] = useState<any>('');
  const [prJpText, setPrJpText] = useState<any>('');
  const [prSyncScroll, setPrSyncScroll] = useState<any>(false);
  const [prSelWord, setPrSelWord] = useState<any>(null); // {word, index}
  const [prSelSent, setPrSelSent] = useState<any>(null); // {sentence, index}
  const [prPopup, setPrPopup] = useState<any>(false);
  const [prMemo, setPrMemo] = useState<any>('');
  const [prSaved, setPrSaved] = useState<any>([]); // [{id,type,word,meaning,memo,date}]
  // Refs for sync scroll
  const prEnRef = typeof window !== 'undefined' ? {
    current: null
  } : {
    current: null
  };
  const prJpRef = typeof window !== 'undefined' ? {
    current: null
  } : {
    current: null
  };
  // ── Word Shooter state v2 ──
  const [wsActive, setWsActive] = useState<any>(false);
  const [wsWords, setWsWords] = useState<any>([]);
  const [wsInput, setWsInput] = useState<any>('');
  const [wsScore, setWsScore] = useState<any>(0);
  const [wsLives, setWsLives] = useState<any>(5); // ❤️ HP（最大5）
  const [wsMaxLives, setWsMaxLives] = useState<any>(5);
  const [wsHits, setWsHits] = useState<any>([]);
  const [wsPhase, setWsPhase] = useState<any>('idle');
  const [wsCombo, setWsCombo] = useState<any>(0);
  const [wsCoins, setWsCoins] = useState<any>(0); // 🪙 コイン
  const [wsWrong, setWsWrong] = useState<any>(null); // 不正解時表示
  const [wsFlash, setWsFlash] = useState<any>(false); // ダメージフラッシュ
  const [wsSlowed, setWsSlowed] = useState<any>(false); // スロースキル
  const [wsSkills, setWsSkills] = useState<any>({
    slow: 1,
    hint: 1,
    heal: 1
  });
  const [wsQuizWords, setWsQuizWords] = useState<any>([]);
  const [wsPhaseScreen, setWsPhaseScreen] = useState<any>('equip'); // 装備→プレイ→結果
  const [wsEquipped, setWsEquipped] = useState<any>([]); // 装備中スキル名 (max3)
  const [wsCurrentWord, setWsCurrentWord] = useState<any>(null); // 現在落下中の単語
  const [wsChoices, setWsChoices] = useState<any>([]); // 8択の選択肢(jp)
  const [wsChoiceResult, setWsChoiceResult] = useState<any>(null); // 選択結果
  const [wsWordQueue, setWsWordQueue] = useState<any>([]); // 残り問題キュー
  const [wsStage, setWsStage] = useState<any>(1); // ステージ番号(1:1個, 2以降:2個同時)
  // ガチャ在庫（スキルチケット）
  const [gachaSkillStock, setGachaSkillStock] = useState<any>({
    shield: 0,
    slow: 0,
    hint: 0,
    heal: 0
  });
  // ── ニュース state ──
  const [newsScreen, setNewsScreen] = useState<any>('countryHub'); // countryHub|hub|bbcList|bbcReader
  const [newsCountry, setNewsCountry] = useState<any>('us');
  const [newsSource, setNewsSource] = useState<any>('bbc');
  const [bbcFeed, setBbcFeed] = useState<any>('world');
  const [bbcArticles, setBbcArticles] = useState<any>([]);
  const [bbcLoading, setBbcLoading] = useState<any>(false);
  const [curArticle, setCurArticle] = useState<any>(null);
  // BBC Reader interactive state
  const [selWord, setSelWord] = useState<any>(null); // {word, sentence, index}
  const [selSent, setSelSent] = useState<any>(null); // {sentence, index}
  const [wordData, setWordData] = useState<any>(null); // {meaning, pos, example}
  const [sentData, setSentData] = useState<any>(null); // 翻訳文字列
  const [fullTrans, setFullTrans] = useState<any>('');
  const [fullTransCache, setFullTransCache] = useState<any>({});
  const [showFull, setShowFull] = useState<any>(false);
  const [transLoading, setTransLoading] = useState<any>(false);
  // ── AI処理状態 ──
  const [captionCache, setCaptionCache] = useState<any>({}); // videoId → captions[]
  const [captionLoading, setCaptionLoading] = useState<any>(false);
  const [captionTimingLoading, setCaptionTimingLoading] = useState<any>(false);
  const [proc, setProc] = useState<any>({
    active: false,
    step: '',
    pct: 0,
    videoId: null,
    videoTitle: '',
    needManual: false,
    errorMsg: ''
  });
  const markTranslationApiLimited = useCallback(() => {
    setTranslationApiLimited(true);
    try {
      localStorage.setItem('eb_translation_api_limited', '1');
    } catch (e) {}
    t$(AI_LIMIT_MESSAGE, 'warn');
  }, []);
  const [manualText, setManualText] = useState<any>('');
  const [manualLoading, setManualLoading] = useState<any>(false);
  // test results (persistent)
  const [TR, setTR] = useState<any>(() => {
    // localStorage から復元（Supabase未設定時のフォールバック）
    try {
      const s = typeof window !== 'undefined' && localStorage.getItem('em_tr');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return {
      word: [],
      grammar: [],
      listening: [],
      shadowing: []
    };
  });
  // active test session
  const [tQs, setTQs] = useState<any>([]);
  const [tIdx, setTIdx] = useState<any>(0);
  const [tAns, setTAns] = useState<any>([]);
  const [tSel, setTSel] = useState<any>(null);
  const [tPh, setTPh] = useState<any>("quiz"); // quiz|result
  const [lisN, setLisN] = useState<any>(0);
  const [play, setPlay] = useState<any>(false);
  const [grammarMode, setGrammarMode] = useState<any>('test');
  const [grammarList, setGrammarList] = useState<any>([]);
  const [grammarListLoading, setGrammarListLoading] = useState<any>(false);
  const [grammarListPage, setGrammarListPage] = useState<any>(0);
  const [grammarNote, setGrammarNote] = useState<any>('');
  const [grammarSavedNotice, setGrammarSavedNotice] = useState<any>('');
  const [studyHubPages, setStudyHubPages] = useState<any>({
    word: 0,
    listening: 0,
    shooter: 0
  });
  const [studyVotes, setStudyVotes] = useState<any>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('em_study_votes') : '';
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });
  const [generatedQuestionBank, setGeneratedQuestionBank] = useState<any>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('eb_generated_question_bank') : '';
      return raw ? JSON.parse(raw) : {
        word: [],
        listening: [],
        shooter: []
      };
    } catch (e) {
      return {
        word: [],
        listening: [],
        shooter: []
      };
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('eb_generated_question_bank', JSON.stringify(generatedQuestionBank));
    } catch (e) {}
  }, [generatedQuestionBank]);
  const rememberGeneratedQuestions = useCallback(function (kind) {
    let questions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    const normalized = questions.map((q, __idx) => {
      if (kind === 'listening') {
        var _q_en;
        const en = String((_q_en = q === null || q === void 0 ? void 0 : q.en) !== null && _q_en !== void 0 ? _q_en : '').trim();
        var _q_jp, _ref;
        const jp = String((_ref = (_q_jp = q === null || q === void 0 ? void 0 : q.jp) !== null && _q_jp !== void 0 ? _q_jp : q === null || q === void 0 ? void 0 : q.correct) !== null && _ref !== void 0 ? _ref : '').trim();
        var _q_id, _q_correct;
        return en && jp ? {
          ...q,
          id: (_q_id = q === null || q === void 0 ? void 0 : q.id) !== null && _q_id !== void 0 ? _q_id : "generated-listening-".concat(en),
          en,
          jp,
          correct: (_q_correct = q === null || q === void 0 ? void 0 : q.correct) !== null && _q_correct !== void 0 ? _q_correct : jp
        } : null;
      }
      var _q_word, _ref1;
      const word = String((_ref1 = (_q_word = q === null || q === void 0 ? void 0 : q.word) !== null && _q_word !== void 0 ? _q_word : q === null || q === void 0 ? void 0 : q.en) !== null && _ref1 !== void 0 ? _ref1 : '').trim();
      var _q_meaning, _ref2, _ref3;
      const meaning = String((_ref3 = (_ref2 = (_q_meaning = q === null || q === void 0 ? void 0 : q.meaning) !== null && _q_meaning !== void 0 ? _q_meaning : q === null || q === void 0 ? void 0 : q.jp) !== null && _ref2 !== void 0 ? _ref2 : q === null || q === void 0 ? void 0 : q.correct) !== null && _ref3 !== void 0 ? _ref3 : '').trim();
      var _q_id1, _q_correct1;
      return word && meaning ? {
        ...q,
        id: (_q_id1 = q === null || q === void 0 ? void 0 : q.id) !== null && _q_id1 !== void 0 ? _q_id1 : "generated-".concat(kind, "-").concat(word),
        word,
        en: word,
        meaning,
        jp: meaning,
        correct: (_q_correct1 = q === null || q === void 0 ? void 0 : q.correct) !== null && _q_correct1 !== void 0 ? _q_correct1 : meaning
      } : null;
    }).filter(Boolean);
    if (!normalized.length) return;
    setGeneratedQuestionBank(prev => {
      const current = Array.isArray(prev === null || prev === void 0 ? void 0 : prev[kind]) ? prev[kind] : [];
      const seen = new Set();
      const merged = [...normalized, ...current].filter(q => {
        var _q_word;
        const key = kind === 'listening' ? String(q.en) : String((_q_word = q.word) !== null && _q_word !== void 0 ? _q_word : q.en);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 100);
      return {
        ...prev,
        [kind]: merged
      };
    });
  }, []);
  // onboarding: 初回のみ表示
  const [showOnb, setShowOnb] = useState<any>(() => {
    try {
      return !localStorage.getItem('em_onb_done');
    } catch (e) {
      return true;
    }
  });
  const dismissOnb = () => {
    setShowOnb(false);
    try {
      localStorage.setItem('em_onb_done', '1');
    } catch (e) {}
  };
  // PWA install prompt (Android Chrome)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState<any>(false);
  useEffect(() => {
    const h = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);
  // toast: { msg, type:'ok'|'ng'|'warn'|'info' }
  const [toast, setToast] = useState<any>(null);
  const tmr = useRef(null);
  const t$ = useCallback(function (m) {
    let type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'info';
    setToast({
      msg: m,
      type
    });
    if (tmr.current) clearTimeout(tmr.current);
    tmr.current = setTimeout(() => setToast(null), 2800);
  }, []);
  useEffect(() => {
    setRewardedAdsAvailable(isAndroidNativeRewardedAdEnvironment());
  }, []);
  // ── Supabase: ユーザーID ────────────────────────────────────
  // user_id: ログイン済みは auth.uid, 未ログインはlocalStorage UUID
  const [userId] = useState<any>(() => getUserId());
  const activeWalletUserId = (authUser === null || authUser === void 0 ? void 0 : authUser.id) || userId;
  // ── ウォレット state ─────────────────────────────────────────
  const [wallet, setWallet] = useState<any>(() => {
    try {
      const s = typeof window !== 'undefined' && localStorage.getItem('em_wallet');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return {
      coins: 0,
      video_tickets: 0,
      quiz_tickets: 0,
      translation_tickets: 0,
      gacha_tickets: 0,
      daily_earned_coins: 0
    };
  });
  const [unlockModal, setUnlockModal] = useState<any>(null);
  const [dailyGachaLeft, setDailyGachaLeft] = useState<any>(1);
  const [adGachaLeft, setAdGachaLeft] = useState<any>(6);
  const [gachaInFlight, setGachaInFlight] = useState<any>(false);
  // ── SNS state ────────────────────────────────────────────────
  const [myProfile, setMyProfile] = useState<any>(null);
  const [rankingTab, setRankingTab] = useState<any>('points');
  const [rankingPeriod, setRankingPeriod] = useState<any>('weekly');
  const [rankingData, setRankingData] = useState<any>([]);
  const [rankingLoading, setRankingLoading] = useState<any>(false);
  const [showRanking, setShowRanking] = useState<any>(false);
  const [showNickEdit, setShowNickEdit] = useState<any>(false);
  const [nickInput, setNickInput] = useState<any>('');
  const [transShared, setTransShared] = useState<any>({});
  const [lastGachaRewardType, setLastGachaRewardType] = useState<any>(undefined);
  const [dbReady, setDbReady] = useState<any>(false);
  const [dbLoading, setDbLoading] = useState<any>(true);
  const [adviceHistory, setAdviceHistory] = useState<any>([]);
  const [adviceSelected, setAdviceSelected] = useState<any>(null);
  const [adviceLoading, setAdviceLoading] = useState<any>(false);
  const [adviceGenerating, setAdviceGenerating] = useState<any>(false);
  // ── Supabase: 初回データロード ──────────────────────────────
  // ── Auth初期化: URLハッシュまたは保存済みセッションから復元 ──
  useEffect(() => {
    let appUrlListener: any = null;
    const applyAuthSession = async (session: any) => {
      if (!(session === null || session === void 0 ? void 0 : session.token)) return false;
      const user = await supabaseAuth.getUser(session.token);
      if (user) {
        localStorage.setItem('sb_user', JSON.stringify(user));
        setAuthUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url || null
        });
        return true;
      }
      return false;
    };
    const setupNativeAuthReturn = async () => {
      if (typeof window === 'undefined' || !(window as any).Capacitor?.isNativePlatform?.()) return;
      const { App } = await import('@capacitor/app');
      const { Browser } = await import('@capacitor/browser');
      appUrlListener = await App.addListener('appUrlOpen', async ({ url }) => {
        const session = supabaseAuth.getSessionFromUrl(url);
        if (await applyAuthSession(session)) {
          await Browser.close().catch(() => {});
          setAuthLoading(false);
        }
      });
    };
    const initAuth = async () => {
      // OAuthコールバック: URLハッシュにtokenがあればセッション確立
      const hashSession = supabaseAuth.getSessionFromHash();
      if (hashSession === null || hashSession === void 0 ? void 0 : hashSession.token) {
        if (await applyAuthSession(hashSession)) {
          console.log('[Auth] Googleログイン成功');
        }
        // URLハッシュをクリア
        history.replaceState(null, '', window.location.pathname);
      } else {
        // 保存済みセッションを確認
        const stored = supabaseAuth.getStoredSession();
        if (stored === null || stored === void 0 ? void 0 : stored.token) {
          const user = await supabaseAuth.getUser(stored.token);
          if (user) {
            var _user_user_metadata2, _user_user_metadata3;
            setAuthUser({
              id: user.id,
              email: user.email,
              name: ((_user_user_metadata2 = user.user_metadata) === null || _user_user_metadata2 === void 0 ? void 0 : _user_user_metadata2.full_name) || user.email,
              avatar_url: ((_user_user_metadata3 = user.user_metadata) === null || _user_user_metadata3 === void 0 ? void 0 : _user_user_metadata3.avatar_url) || null
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
    setupNativeAuthReturn();
    initAuth();
    return () => {
      appUrlListener?.remove?.();
    };
  }, []);
  // ── ウォレット初期化: ログイン時に残高と本日のガチャ残数を取得 ──
  useEffect(() => {
    if (!SB_READY) return;
    const uid = activeWalletUserId;
    const initWallet = async () => {
      try {
        const r = await fetch("/api/wallet?userId=".concat(encodeURIComponent(uid)));
        if (!r.ok) return;
        const w = await r.json();
        console.log('[GACHA_WALLET_GET]', {
          activeWalletUserId,
          requestedUserId: activeWalletUserId,
          walletUserId: w?.user_id ?? w?.userId,
          freeLeft: w?.gacha_daily?.freeLeft,
          adLeft: w?.gacha_daily?.adLeft,
          dailyLeft: w?.gacha_daily?.dailyLeft,
          hasUsedToday: (w?.gacha_daily?.freeLeft ?? 0) <= 0,
          buildSha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'local',
        });
        setWallet(w);
        if (w.gacha_daily) {
          var _w_gacha_daily_freeLeft;
          setDailyGachaLeft((_w_gacha_daily_freeLeft = w.gacha_daily.freeLeft) !== null && _w_gacha_daily_freeLeft !== void 0 ? _w_gacha_daily_freeLeft : 0);
          var _w_gacha_daily_adLeft;
          setAdGachaLeft((_w_gacha_daily_adLeft = w.gacha_daily.adLeft) !== null && _w_gacha_daily_adLeft !== void 0 ? _w_gacha_daily_adLeft : 0);
        }
        console.log('[wallet] 残高取得:', w.coins, 'coins');
      } catch (e) {
        console.error('[wallet] 初期化エラー:', e);
      }
    };
    initWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWalletUserId]);
  // プロフィール初回ロード
  useEffect(() => {
    loadProfile().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  useEffect(() => {
    if (!SB_READY) {
      setDbLoading(false);
      return;
    }
    const load = async () => {
      try {
        const uid = "user_id=eq.".concat(userId);
        const [sLines, myL, tRes, uPts, uVids, captionRows, vVotes, allVideoVotes] = await Promise.all([sbFrom("saved_items").select("*&".concat(uid, "&item_type=eq.caption&order=saved_at.desc")), fetch("/api/list/get?userId=".concat(encodeURIComponent(userId))).then(r => r.json()), sbFrom("learning_logs").select("*&".concat(uid, "&order=created_at.asc")), sbFrom("user_points").select("*&".concat(uid)), sbFrom("user_videos").select("*&order=added_at.desc&limit=100"), sbFrom("video_captions").select("select=video_id&limit=1000"), sbFrom("video_votes").select("select=video_id,vote_type&user_id=eq.".concat(encodeURIComponent(userId), "&limit=1000")), sbFrom("video_votes").select("select=video_id,vote_type&limit=10000")]);
        // saved_items から保存済み文を復元（Phase3: 永続化）
        if (Array.isArray(sLines) && sLines.length > 0) {
          setSaved(sLines.map((r, __idx) => {
            const c = r.content || {};
            return {
              id: c.id || r.id,
              english: c.english || '',
              chunks: c.chunks || [],
              meaning: c.meaning || [],
              videoTitle: c.videoTitle || null,
              savedAt: r.saved_at || Date.now(),
              _dbId: r.id
            };
          }).filter(r => r.english));
          console.log('[DB] saved_items 復元:', sLines.length, '件');
        }
        // my playlist
        if (Array.isArray(myL)) {
          setMyList(myL.map((r, __idx) => {
            const item = typeof r === 'object' && r ? r : {};
            const videoId = typeof item.video_id === 'string' ? item.video_id : '';
            const rawThumbnail = typeof item.thumbnail === 'string' ? item.thumbnail : '';
            const thumbnail = rawThumbnail.trim() ? rawThumbnail.trim() : videoId ? "https://img.youtube.com/vi/".concat(encodeURIComponent(videoId), "/hqdefault.jpg") : DEFAULT_THUMBNAIL;
            return {
              videoId,
              title: typeof item.title === 'string' ? item.title : '',
              channelTitle: typeof item.channel_title === 'string' ? item.channel_title : '',
              thumbnail,
              chunks: Array.isArray(item.chunks) ? item.chunks : [],
              originalText: typeof item.original_text === 'string' ? item.original_text : '',
              addedAt: item.created_at || item.added_at || ''
            };
          }).filter(item => item.videoId || item.title || item.channelTitle));
        } else {
          setMyList([]);
        }
        // learning_logs から学習結果を復元（Phase3: 永続化）
        if (Array.isArray(tRes) && tRes.length > 0) {
          const grouped = {
            word: [],
            grammar: [],
            listening: [],
            shadowing: []
          };
          tRes.forEach(r => {
            const key = r.type || r.test_type; // 両フィールドに対応
            if (!grouped[key]) return;
            grouped[key].push({
              date: r.created_at || r.test_date,
              correct: r.correct || 0,
              total: r.total || 0,
              score: r.score || 0
            });
          });
          setTR(grouped);
          console.log('[DB] learning_logs 復元:', Object.entries(grouped).map((param, __idx) => {
            let [k, v] = param;
            return "".concat(k, ":").concat(v.length);
          }).join(' '));
        }
        // points
        if (Array.isArray(uPts) && uPts.length > 0) {
          setPts(uPts[0].points);
        }
        const videoVoteCounts = new Map();
        if (Array.isArray(allVideoVotes)) {
          allVideoVotes.forEach(row => {
            const id = String((row === null || row === void 0 ? void 0 : row.video_id) || '');
            if (!id) return;
            const cur = videoVoteCounts.get(id) || {
              likes: 0,
              dislikes: 0
            };
            if (Number(row.vote_type) === 1) cur.likes += 1;
            if (Number(row.vote_type) === -1) cur.dislikes += 1;
            videoVoteCounts.set(id, cur);
          });
        }
        const withVoteCounts = v => {
          const counts = videoVoteCounts.get(v.videoId);
          if (!counts) return v;
          return {
            ...v,
            likes: counts.likes,
            dislikes: counts.dislikes,
            like_count: counts.likes,
            dislike_count: counts.dislikes
          };
        };
        if (videoVoteCounts.size > 0) setVideos(prev => prev.map(withVoteCounts));
        // user_videos: 共有動画としてAll Videosへマージ（端末依存/localStorage依存を減らす）
        if (Array.isArray(uVids) && uVids.length > 0) {
          const readyVideoIds = new Set((Array.isArray(captionRows) ? captionRows : []).map((r, __idx) => r.video_id));
          const userVids = uVids.map((r, __idx) => {
            const counts = videoVoteCounts.get(r.video_id);
            return {
              videoId: r.video_id,
              title: r.title,
              channelTitle: r.channel_title,
              thumbnail: r.thumbnail,
              aiReady: readyVideoIds.has(r.video_id),
              hasTranslation: readyVideoIds.has(r.video_id),
              shared: r.user_id !== userId,
              addedAt: r.added_at,
              likes: counts ? counts.likes : Number(r.like_count || 0),
              dislikes: counts ? counts.dislikes : Number(r.dislike_count || 0)
            };
          });
          setVideos(prev => {
            const byId = new Map(userVids.map(v => [v.videoId, v]));
            const merged = prev.map(v => {
              const row = byId.get(v.videoId);
              if (!row) return v;
              byId.delete(v.videoId);
              return {
                ...v,
                ...row,
                likes: Number(row.likes || row.like_count || 0),
                dislikes: Number(row.dislikes || row.dislike_count || 0),
                like_count: Number(row.likes || row.like_count || 0),
                dislike_count: Number(row.dislikes || row.dislike_count || 0)
              };
            });
            return [...Array.from(byId.values()), ...merged];
          });
        }
        if (Array.isArray(vVotes)) {
          setVideoVotes(Object.fromEntries(vVotes.map((row, __idx) => [row.video_id, Number(row.vote_type)])));
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
    try {
      localStorage.setItem('em_wallet', JSON.stringify(wallet));
    } catch (e) {}
  }, [wallet]);
  // ── TR を localStorage に同期（Supabase未設定時フォールバック）─
  useEffect(() => {
    try {
      localStorage.setItem('em_tr', JSON.stringify(TR));
    } catch (e) {}
  }, [TR]);
  // ── saved を localStorage に同期（Supabase未設定時フォールバック）─
  useEffect(() => {
    try {
      localStorage.setItem('em_saved', JSON.stringify(saved));
    } catch (e) {}
  }, [saved]);
  // ── pts を localStorage に同期 ─────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('em_pts', String(pts));
    } catch (e) {}
  }, [pts]);
  useEffect(() => {
    try {
      localStorage.setItem('em_study_votes', JSON.stringify(studyVotes));
    } catch (e) {}
  }, [studyVotes]);
  // ── Supabase: ポイント同期（500ms debounce）────────────────
  const ptsSyncTimer = useRef(null);
  useEffect(() => {
    if (!SB_READY || !dbReady) return;
    if (ptsSyncTimer.current) clearTimeout(ptsSyncTimer.current);
    ptsSyncTimer.current = setTimeout(() => {
      sbFrom("user_points").upsert({
        user_id: userId,
        points: pts,
        updated_at: new Date().toISOString()
      });
    }, 500);
  }, [pts, dbReady, userId]);
  // ── DB helpers ──────────────────────────────────────────────
  const dbSaveLine = async line => {
    if (!SB_READY) {
      console.log('[DB] Supabase未設定 - saved_items スキップ');
      return;
    }
    try {
      var _line_english;
      await sbFrom("saved_items").insert({
        user_id: userId,
        item_type: 'caption',
        content: {
          id: line.id,
          english: line.english,
          chunks: line.chunks || [],
          meaning: line.meaning || [],
          videoTitle: line.videoTitle || null
        },
        saved_at: line.savedAt || Date.now()
      });
      console.log('[DB] saved_items 保存:', (_line_english = line.english) === null || _line_english === void 0 ? void 0 : _line_english.slice(0, 40));
    } catch (e) {
      console.error('[DB] saved_items 保存失敗:', e.message);
    }
  };
  const dbDeleteLine = async captionId => {
    if (!SB_READY) return;
    try {
      // saved_items: content->>'id' でフィルタ (JSON演算子)
      await sbFrom("saved_items").delete("user_id=eq.".concat(userId, "&content->>id=eq.").concat(captionId, "&item_type=eq.caption"));
      console.log('[DB] saved_items 削除:', captionId);
    } catch (e) {
      console.error('[DB] saved_items 削除失敗:', e.message);
    }
  };
  const dbAddPlaylist = async video => {
    if (!SB_READY) return;
    const res = await fetch('/api/list/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: video.title,
        videoId: video.videoId,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        chunks: [],
        originalText: '',
        userId
      })
    });
    if (!res.ok) throw new Error("playlist save failed: ".concat(res.status));
  };
  const dbRemovePlaylist = async videoId => {
    if (!SB_READY) return;
    await fetch("/api/list/delete?videoId=".concat(encodeURIComponent(videoId), "&userId=").concat(encodeURIComponent(userId)), {
      method: 'DELETE'
    });
  };
  const dbSaveTestResult = async function (type, correct, total) {
    let score = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
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
        score
      });
      console.log("[DB] learning_logs 保存: ".concat(type, " ").concat(correct, "/").concat(total));
    } catch (e) {
      console.error('[DB] learning_logs 保存失敗:', e.message);
    }
    // テスト完了報酬（コインではなく学習ポイント）
    if (total > 0) {
      const rate = correct / total;
      const reward = rate >= 0.8 ? 10 : rate >= 0.6 ? 6 : rate >= 0.4 ? 3 : 1;
      setPts(p => p + reward);
    }
  };
  // ── AI処理: 動画の日本語イメージ生成オーケストレーション ────────────
  const processNewVideo = useCallback(async function (video) {
    let manualTranscript = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    const {
      videoId,
      title
    } = video;
    const upd = function (step, pct) {
      let extra = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return setProc(p => ({
        ...p,
        active: true,
        step,
        pct,
        videoId,
        videoTitle: title,
        ...extra
      }));
    };
    const fail = function () {
      let reason = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
      console.error('[processNewVideo] 失敗:', reason);
      setProc({
        active: false,
        step: 'error',
        pct: 0,
        videoId: null,
        videoTitle: '',
        needManual: false,
        errorMsg: reason
      });
      t$(reason || '字幕生成に失敗しました', 'ng');
    };
    try {
      // STEP 0: DBに既存データがあればスキップ（再追加対策）
      if (!manualTranscript) {
        let existing = null;
        try {
          existing = await dbLoadCaptions(videoId);
        } catch (e) {}
        if (existing && existing.length > 0) {
          let withTiming = existing;
          if (!existing.some(c => Number(c.duration) > 0)) {
            try {
              const tr = await fetchTranscript(videoId);
              const timing = Array.isArray(tr.timedSentences) ? tr.timedSentences : [];
              if (tr.ok && timing.length) {
                withTiming = existing.map((c, i) => {
                  var _timing_i, _timing_i1;
                  var _timing_i_start, _timing_i_duration;
                  return {
                    ...c,
                    start: Number((_timing_i_start = (_timing_i = timing[i]) === null || _timing_i === void 0 ? void 0 : _timing_i.start) !== null && _timing_i_start !== void 0 ? _timing_i_start : 0),
                    duration: Number((_timing_i_duration = (_timing_i1 = timing[i]) === null || _timing_i1 === void 0 ? void 0 : _timing_i1.duration) !== null && _timing_i_duration !== void 0 ? _timing_i_duration : 0)
                  };
                });
              }
            } catch (e) {}
          }
          setCaptionCache(prev => ({
            ...prev,
            [videoId]: withTiming
          }));
          setVideos(prev => prev.map((v, __idx) => v.videoId === videoId ? {
            ...v,
            aiReady: true
          } : v));
          setProc({
            active: false,
            step: 'done',
            pct: 100,
            videoId: null,
            videoTitle: '',
            needManual: false
          });
          t$('DB済み字幕を読み込みました', 'ok');
          return;
        }
      }
      // STEP 1: 字幕取得
      upd('transcript', 10);
      let sentences = manualTranscript ? manualTranscript.split(/[\n。.!?]+/).map((s, __idx) => s.trim()).filter(s => s.split(/\s+/).length >= 4).slice(0, MAX_STUDY_CAPTIONS) : null;
      let timingMeta = [];
      if (!sentences) {
        var _res_sentences;
        let res;
        try {
          res = await fetchTranscript(videoId);
        } catch (e) {
          res = {
            ok: false,
            reason: '通信エラー: ' + (e.message || '')
          };
        }
        if (res.ok && ((_res_sentences = res.sentences) === null || _res_sentences === void 0 ? void 0 : _res_sentences.length) > 0) {
          const timedSentences = Array.isArray(res.timedSentences) && res.timedSentences.length ? res.timedSentences : buildTimedSentences(res.segments || []);
          sentences = timedSentences.length ? timedSentences.map((item, __idx) => item.text) : res.sentences;
          timingMeta = timedSentences;
          console.log("[processNewVideo] 字幕取得成功: ".concat(sentences.length, "文"));
          upd('transcript', 18);
        } else {
          // 自動取得失敗 → 手動入力モーダルへ
          const reason = res.reason || '字幕が見つかりませんでした';
          console.log('[processNewVideo] 字幕取得失敗 → 手動入力モードへ:', reason);
          setProc(p => ({
            ...p,
            active: true,
            step: 'manual',
            pct: 0,
            videoId,
            videoTitle: title,
            needManual: true,
            errorMsg: reason
          }));
          return; // 手動入力待ち
        }
      }
      if (!sentences || sentences.length === 0) {
        fail('字幕テキストが空です');
        return;
      }
      if (SB_READY && wallet.coins < COIN_COSTS.VIDEO_GENERATION) {
        fail("動画生成には".concat(COIN_COSTS.VIDEO_GENERATION, "コイン必要です。"));
        return;
      }
      // STEP 2: AI 日本語イメージ生成
      upd('ai', 20, {
        needManual: false
      });
      let rawCaptions = [];
      try {
        rawCaptions = await aiGenerateChunks(sentences, pct => upd('ai', 20 + Math.round(pct * 0.65)));
      } catch (e) {
        console.error('[processNewVideo] AI Japanese image failed:', e.message);
        if (isAiLimitError(e)) {
          markTranslationApiLimited();
          fail(AI_LIMIT_MESSAGE);
          return;
        }
        // フォールバック: 文をそのまま使う
        rawCaptions = sentences.map((s, __idx) => ({
          english: s,
          chunks: s.split(/\s+/).slice(0, 6),
          meaning: ['(AI未接続)']
        }));
      }
      if (rawCaptions.length === 0) {
        fail('AI処理に失敗しました');
        return;
      }
      // IDを付与
      const captions = rawCaptions.map((c, i) => {
        var _timingMeta_i, _timingMeta_i1;
        var _timingMeta_i_start, _timingMeta_i_duration;
        return {
          ...c,
          id: "".concat(videoId, "_").concat(i),
          start: Number((_timingMeta_i_start = (_timingMeta_i = timingMeta[i]) === null || _timingMeta_i === void 0 ? void 0 : _timingMeta_i.start) !== null && _timingMeta_i_start !== void 0 ? _timingMeta_i_start : 0),
          duration: Number((_timingMeta_i_duration = (_timingMeta_i1 = timingMeta[i]) === null || _timingMeta_i1 === void 0 ? void 0 : _timingMeta_i1.duration) !== null && _timingMeta_i_duration !== void 0 ? _timingMeta_i_duration : 0)
        };
      });
      if (SB_READY) {
        const paid = await chargeVideoGeneration();
        if (!paid) {
          fail('生成失敗のためコインは消費されませんでした');
          return;
        }
        t$("動画生成 -".concat(COIN_COSTS.VIDEO_GENERATION, "コイン"), 'info');
      }
      // STEP 3: Supabase保存
      upd('saving', 88);
      try {
        await dbSaveCaptions(videoId, captions);
      } catch (e) {
        console.warn('[processNewVideo] DB保存失敗:', e.message);
      }
      // STEP 4: キャッシュ更新 & 完了
      setCaptionCache(prev => ({
        ...prev,
        [videoId]: captions
      }));
      setVideos(prev => prev.map((v, __idx) => v.videoId === videoId ? {
        ...v,
        aiReady: true
      } : v));
      setProc({
        active: false,
        step: 'done',
        pct: 100,
        videoId: null,
        videoTitle: '',
        needManual: false,
        errorMsg: ''
      });
      t$("✨ AI字幕生成完了！（".concat(captions.length, "文）"));
    } catch (e) {
      console.error('[processNewVideo] 予期しないエラー:', e);
      fail((e === null || e === void 0 ? void 0 : e.message) || '予期しないエラーが発生しました');
    }
  }, [t$]);
  // 手動入力でリトライ
  const makeManualCaptions = (chunks, videoId) => {
    return chunks.map((c, i) => ({
      id: "".concat(videoId, "_manual_").concat(i),
      english: c.en || '',
      chunks: c.en ? c.en.split(' ').filter(Boolean).slice(0, 6) : [],
      meaning: c.ja ? [c.ja] : ['(生成失敗)']
    }));
  };
  const fetchManualChunks = async text => {
    const res = await fetch('/api/ai/chunk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text
      })
    });
    const data = await res.json();
    if (!res.ok || !Array.isArray(data.chunks)) {
      if (res.status === 429 || res.status === 503 || isAiLimitError(data === null || data === void 0 ? void 0 : data.error)) throw new Error('AI_SYSTEM_LIMIT');
      throw new Error((data === null || data === void 0 ? void 0 : data.error) || 'chunk generation failed');
    }
    return data.chunks;
  };
  const submitManualTranscript = async () => {
    if (!manualText.trim() || !proc.videoId) return;
    const video = videos.find(v => v.videoId === proc.videoId);
    if (!video) return;
    if (SB_READY && wallet.coins < COIN_COSTS.VIDEO_GENERATION) {
      t$("動画生成には".concat(COIN_COSTS.VIDEO_GENERATION, "コイン必要です。"), 'warn');
      return;
    }
    setManualLoading(true);
    setProc(p => ({
      ...p,
      active: true,
      step: 'ai',
      pct: 10,
      needManual: false
    }));
    try {
      let chunks;
      try {
        chunks = await fetchManualChunks(manualText);
      } catch (err) {
        console.error('[manualChunk]', err);
        if (isAiLimitError(err)) {
          markTranslationApiLimited();
          setManualLoading(false);
          setProc(p => ({
            ...p,
            active: true,
            step: 'error',
            pct: 100,
            errorMsg: AI_LIMIT_MESSAGE
          }));
          return;
        }
        chunks = [{
          en: 'Hello everyone',
          ja: 'みなさんこんにちは'
        }];
      }
      const captions = makeManualCaptions(chunks, video.videoId);
      if (SB_READY) {
        const paid = await chargeVideoGeneration();
        if (!paid) {
          t$('生成失敗のためコインは消費されませんでした', 'warn');
          return;
        }
        t$("動画生成 -".concat(COIN_COSTS.VIDEO_GENERATION, "コイン"), 'info');
      }
      setCaptionCache(prev => ({
        ...prev,
        [video.videoId]: captions
      }));
      setVideos(prev => prev.map((v, __idx) => v.videoId === video.videoId ? {
        ...v,
        aiReady: true
      } : v));
      dbSaveCaptions(video.videoId, captions).catch(() => {});
      // マイリストに保存
      try {
        await fetch('/api/list/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: video.title,
            videoId: video.videoId,
            thumbnail: video.thumbnail,
            channelTitle: video.channelTitle,
            chunks,
            originalText: manualText,
            userId
          })
        });
        console.log('[save] Saved to my list');
      } catch (saveErr) {
        console.error('[save]', saveErr);
      }
      setProc({
        active: false,
        step: 'done',
        pct: 100,
        videoId: null,
        videoTitle: '',
        needManual: false,
        errorMsg: ''
      });
      setManualText('');
      t$('✨ AIで日本語イメージを生成しました');
    } finally {
      setManualLoading(false);
    }
  };
  // ── derived ──
  // 実際に取得・生成された字幕だけを表示する
  const caps = curVid ? captionCache[curVid.videoId] || STATIC_CAPTION_OVERRIDES[curVid.videoId] || [] : [];
  const curCap = caps[capIdx] || null;
  const hasCaptionTiming = useCallback(list => Array.isArray(list) && list.some(c => Number((c === null || c === void 0 ? void 0 : c.start) || 0) > 0 || Number((c === null || c === void 0 ? void 0 : c.duration) || 0) > 0), []);
  const addCaptionTiming = useCallback(async (videoId, list) => {
    if (!videoId || !Array.isArray(list) || !list.length || hasCaptionTiming(list)) return list;
    try {
      const tr = await fetchTranscript(videoId);
      const timing = Array.isArray(tr.timedSentences) && tr.timedSentences.length ? tr.timedSentences : buildTimedSentences(tr.segments || []);
      if (tr.ok && timing.length) {
        const normalizeTimingText = value => String(value || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
        const timingScore = (a, b) => {
          const left = normalizeTimingText(a);
          const right = normalizeTimingText(b);
          if (!left || !right) return 0;
          if (left.includes(right) || right.includes(left)) return 1;
          const leftWords = new Set(left.split(' ').filter(w => w.length > 2));
          const rightWords = new Set(right.split(' ').filter(w => w.length > 2));
          if (!leftWords.size || !rightWords.size) return 0;
          let overlap = 0;
          leftWords.forEach(word => {
            if (rightWords.has(word)) overlap += 1;
          });
          return overlap / Math.min(leftWords.size, rightWords.size);
        };
        const pickTiming = (caption, index) => {
          const captionText = caption === null || caption === void 0 ? void 0 : caption.english;
          const direct = timing[index];
          if (direct && Number(direct.duration || 0) > 0 && (!captionText || timingScore(captionText, direct.text) >= 0.28)) return direct;
          let best = direct && Number(direct.duration || 0) > 0 ? direct : null;
          let bestScore = best ? timingScore(captionText, best.text) : 0;
          for (const item of timing) {
            if (!item || Number(item.duration || 0) <= 0) continue;
            const score = timingScore(captionText, item.text);
            if (score > bestScore) {
              best = item;
              bestScore = score;
            }
          }
          return bestScore >= 0.34 ? best : direct;
        };
        return list.map((c, i) => {
          var _matched_start, _matched_duration;
          const matched = pickTiming(c, i);
          return {
            ...c,
            start: Number((_matched_start = matched === null || matched === void 0 ? void 0 : matched.start) !== null && _matched_start !== void 0 ? _matched_start : 0),
            duration: Number((_matched_duration = matched === null || matched === void 0 ? void 0 : matched.duration) !== null && _matched_duration !== void 0 ? _matched_duration : 0)
          };
        });
      }
    } catch (e) {}
    return list;
  }, [buildTimedSentences, fetchTranscript, hasCaptionTiming]);
  const ensureCurrentCaptionTiming = useCallback(async () => {
    if (!(curVid === null || curVid === void 0 ? void 0 : curVid.videoId) || !caps.length) return null;
    if (hasCaptionTiming(caps)) return caps;
    setCaptionTimingLoading(true);
    try {
      const nextCaps = await addCaptionTiming(curVid.videoId, caps);
      const ready = hasCaptionTiming(nextCaps);
      if (ready) {
        setCaptionCache(prev => ({
          ...prev,
          [curVid.videoId]: nextCaps
        }));
        dbSaveCaptions(curVid.videoId, nextCaps).catch(() => {});
      }
      return ready ? nextCaps : null;
    } finally {
      setCaptionTimingLoading(false);
    }
  }, [addCaptionTiming, caps, curVid, dbSaveCaptions, hasCaptionTiming]);
  const isSaved = id => saved.some(s => s.id === id);
  const toeic = calcToeic(TR);
  const spLv = spLevel(toeic);
  const afLv = affLevel(toeic);
  const afCard = AFF[afLv];
  const sortAllVideos = items => [...items].sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0) || Number(a.dislikes || 0) - Number(b.dislikes || 0) || new Date(b.addedAt || b.added_at || 0).getTime() - new Date(a.addedAt || a.added_at || 0).getTime());
  const sortMyVideos = items => [...items].sort((a, b) => new Date(b.addedAt || b.created_at || b.added_at || 0).getTime() - new Date(a.addedAt || a.created_at || a.added_at || 0).getTime());
  const dVids = homeTab === "my" ? sortMyVideos(myList) : homeTab === "review" ? sortAllVideos(videos.filter(v => saved.some(s => s.videoTitle === v.title))) : sortAllVideos(videos);
  const captionsRef = useRef(caps);
  useEffect(() => {
    captionsRef.current = caps;
  }, [caps]);
  useEffect(() => {
    try {
      localStorage.setItem('eb_video_votes', JSON.stringify(videoVotes));
    } catch (e) {}
  }, [videoVotes]);
  useEffect(() => {
    ytReaderRef.current = null;
    setYtReaderReady(false);
    setAutoSync(false);
  }, [curVid === null || curVid === void 0 ? void 0 : curVid.videoId]);
  const moveCaption = useCallback(next => {
    manualNavUntilRef.current = Date.now() + 3500;
    setCapIdx(prev => {
      const value = typeof next === 'function' ? next(prev) : next;
      return Math.max(0, Math.min(Math.max(0, caps.length - 1), value));
    });
  }, [caps.length]);
  const findCaptionIndexByTime = useCallback((seconds, sourceList) => {
    const list = sourceList || captionsRef.current || [];
    if (!list.length) return -1;
    if (!hasCaptionTiming(list)) return -1;
    let best = 0;
    for (let i = 0; i < list.length; i += 1) {
      var _list_i, _list_i1, _list_;
      const start = Number(((_list_i = list[i]) === null || _list_i === void 0 ? void 0 : _list_i.start) || 0);
      const duration = Number(((_list_i1 = list[i]) === null || _list_i1 === void 0 ? void 0 : _list_i1.duration) || 0);
      const end = duration > 0 ? start + duration : Number(((_list_ = list[i + 1]) === null || _list_ === void 0 ? void 0 : _list_.start) || start + 4);
      if (seconds >= start - 0.35 && seconds < end + 0.35) return i;
      if (start <= seconds + 0.35) best = i;
    }
    return best;
  }, [hasCaptionTiming]);
  const syncCaptionToCurrentTime = useCallback(async function () {
    let showToast = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    const reader = ytReaderRef.current;
    if (!reader) {
      if (showToast) t$('YouTubeプレイヤーの準備中です');
      return;
    }
    let listForSync = captionsRef.current || caps;
    if (!hasCaptionTiming(listForSync)) {
      const nextCaps = await ensureCurrentCaptionTiming();
      if (!nextCaps) {
        if (showToast) t$('字幕の時間情報を取得できませんでした。少し時間をおいて再度お試しください', 'warn');
        return;
      }
      listForSync = nextCaps;
    }
    const seconds = reader.getCurrentTime();
    const nextIdx = findCaptionIndexByTime(seconds, listForSync);
    if (nextIdx < 0) {
      if (showToast) t$('現在位置に合う字幕が見つかりませんでした', 'warn');
      return;
    }
    setCapIdx(prev => prev === nextIdx ? prev : nextIdx);
    if (showToast) t$("現在位置 ".concat(Math.round(seconds), "秒 に合わせました"), 'ok');
  }, [caps, ensureCurrentCaptionTiming, findCaptionIndexByTime, hasCaptionTiming, t$]);
  useEffect(() => {
    if (autoSyncTimerRef.current) {
      clearInterval(autoSyncTimerRef.current);
      autoSyncTimerRef.current = null;
    }
    if (!autoSync || screen !== 'video' || !ytReaderReady || !caps.length) return;
    syncCaptionToCurrentTime(false);
    autoSyncTimerRef.current = setInterval(() => {
      syncCaptionToCurrentTime(false);
    }, 1000);
    return () => {
      if (autoSyncTimerRef.current) {
        clearInterval(autoSyncTimerRef.current);
        autoSyncTimerRef.current = null;
      }
    };
  }, [autoSync, screen, ytReaderReady, caps.length, syncCaptionToCurrentTime]);
  useEffect(() => {
    if (screen !== 'video') setAutoSync(false);
  }, [screen]);
  const regenerateCurrentJapanese = useCallback(async () => {
    if (!(curVid === null || curVid === void 0 ? void 0 : curVid.videoId) || !caps.length || jpRegenerating) return;
    setJpRegenerating(true);
    try {
      const regenerated = await aiGenerateChunks(caps.map((c, __idx) => c.english).filter(Boolean), () => {});
      const nextCaps = caps.map((caption, i) => {
        var _next_meaning;
        const next = regenerated[i];
        if (!(next === null || next === void 0 ? void 0 : (_next_meaning = next.meaning) === null || _next_meaning === void 0 ? void 0 : _next_meaning.length)) return caption;
        return {
          ...caption,
          chunks: [],
          meaning: next.meaning
        };
      });
      setCaptionCache(prev => ({
        ...prev,
        [curVid.videoId]: nextCaps
      }));
      await dbSaveCaptions(curVid.videoId, nextCaps);
      t$('日本語イメージを再生成しました', 'ok');
    } catch (err) {
      console.error('[regenerateCurrentJapanese]', err);
      t$('日本語イメージの再生成に失敗しました', 'ng');
    } finally {
      setJpRegenerating(false);
    }
  }, [curVid === null || curVid === void 0 ? void 0 : curVid.videoId, caps, jpRegenerating]);
  // ── 学習ストリーク計算（TR から） ──────────────────────────
  const streakStats = (() => {
    const allLogs = [...TR.word, ...TR.grammar, ...TR.listening, ...TR.shadowing].map((r, __idx) => (r.date || '').slice(0, 10)).filter(Boolean);
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = allLogs.filter(d => d === today).length;
    const days = Array.from(new Set(allLogs)).sort().reverse();
    let streak = 0;
    let cur = new Date();
    cur.setHours(0, 0, 0, 0);
    for (const d of days) {
      const dd = new Date(d);
      dd.setHours(0, 0, 0, 0);
      const diff = Math.round((cur.getTime() - dd.getTime()) / 86400000);
      if (diff <= 1) {
        streak++;
        cur = dd;
      } else break;
    }
    const todayWords = saved.filter(s => {
      if (!s.savedAt) return false;
      const d = new Date(s.savedAt);
      return d.toISOString().slice(0, 10) === today;
    }).length;
    return {
      todayCount,
      streak,
      todayWords
    };
  })();
  const openGrammarHub = async () => {
    setScreen("grammarHub");
    setGrammarListPage(0);
    setGrammarListLoading(true);
    const rows = await fetchGrammarList(userId);
    setGrammarList(rows);
    setGrammarListLoading(false);
  };
  const quizCountForMode = (mode, type = '') => type === 'grammarTest' && mode !== 'practice' ? 8 : mode === 'practice' ? 5 : 10;
  const costForMode = mode => mode === 'practice' ? COIN_COSTS.PRACTICE : COIN_COSTS.TEST;
  const canStartPaidMode = cost => {
    if (!SB_READY) return true;
    if (wallet.coins >= cost) return true;
    t$("Not enough coins: ".concat(cost), 'warn');
    return false;
  };
  const chargeStartedMode = async (mode, options = {}) => {
    if (!SB_READY || options.free) return true;
    const cost = costForMode(mode);
    const paid = await spendCoins(cost);
    if (paid) t$("".concat(mode === 'practice' ? 'Practice' : 'Test', " -").concat(cost, " coins"), 'info');
    return paid;
  };
  const resetQuizState = screenName => {
    setScreen(screenName);
    setTQs([]);
    setTIdx(0);
    setTAns([]);
    setTSel(null);
    setTPh("quiz");
    setLisN(0);
    setPlay(false);
  };
  const weightedStudyShuffle = (items, keyFn) => {
    return items.map((item, index) => {
      const vote = Number(studyVotes[keyFn(item, index)] || 0);
      const weight = vote > 0 ? 1.35 : vote < 0 ? 0.7 : 1;
      return { item, key: Math.random() ** (1 / weight) };
    }).sort((a, b) => b.key - a.key).map(entry => entry.item);
  };
  const existingQuizQuestions = (type, count) => {
    if (type === "wordTest") return weightedStudyShuffle(WORDS, w => `word:${w.id}`).slice(0, count).map((w, __idx) => {
      const correct = w.meaning || '';
      const wrong = shuffle(WORDS.filter(x => x.id !== w.id && x.meaning !== correct)).slice(0, 3).map(x => x.meaning || '');
      return {
        ...w,
        options: shuffle([correct, ...wrong]),
        correct
      };
    });
    if (type === "grammarTest") return shuffle(GRAMMAR).slice(0, count).map((q, __idx) => ({
      ...q,
      options: q.options || q.opts || [],
      correct: q.correct || q.ans
    }));
    return weightedStudyShuffle(LISTENING, (i, idx) => `listening:${i.id || idx}`).slice(0, count).map((i, __idx) => ({
      ...i,
      options: shuffle([i.jp, ...(i.d || []), ...LISTENING.filter(x => x.jp !== i.jp).slice(0, 7).map(x => x.jp)]).slice(0, 8),
      correct: i.jp
    }));
  };
  const buildStandardQuizQuestions = async (type, mode) => {
    const count = quizCountForMode(mode, type);
    if (mode === 'practice') return existingQuizQuestions(type, count);
    const quizType = type === "wordTest" ? 'word' : type === "grammarTest" ? 'grammar' : 'listening';
    const existing = existingQuizQuestions(type, 5);
    const generated = await fetchQuiz(quizType, saved, 5, userId, true);
    if (!generated.length) {
      console.warn('[quiz] AI generation failed; falling back to existing 10 questions', type);
      return existingQuizQuestions(type, 10);
    }
    return shuffle([...existing, ...generated]).slice(0, count);
  };
  const normalizeWordQuestionOptions = q => {
    if (!q) return q;
    var _q_correct, _q_meaning;
    const correct = String((_q_correct = q.correct) !== null && _q_correct !== void 0 ? _q_correct : (_q_meaning = q.meaning) !== null && _q_meaning !== void 0 ? _q_meaning : '').trim();
    if (!correct) return q;
    const knownMeanings = new Set(WORDS.map(w => w.meaning).filter(Boolean));
    const existing = Array.isArray(q.options) ? q.options.map(String).map(s => s.trim()).filter(Boolean) : [];
    const wrong = existing.filter(opt => opt && opt !== correct && knownMeanings.has(opt));
    const fill = shuffle(WORDS.map(w => w.meaning).filter(meaning => meaning && meaning !== correct && !wrong.includes(meaning))).slice(0, Math.max(0, 3 - wrong.length));
    return {
      ...q,
      correct,
      options: shuffle([correct, ...wrong.slice(0, 3), ...fill]).slice(0, 4)
    };
  };
  const startGrammarPractice = async function () {
    let questionId = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '',
      options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const isSingleListPractice = Boolean(options.single || questionId);
    const count = isSingleListPractice ? 1 : 5;
    if (!options.free && !canStartPaidMode(COIN_COSTS.PRACTICE)) return;
    if (isSingleListPractice) t$('Starting one selected question', 'ok');
    const qs = await fetchGrammarSession(userId, 'practice', count, questionId);
    const source = qs.length ? qs : await genGrammar(saved, count, userId);
    const enriched = source.map((q, __idx) => {
      const listed = grammarList.find(item => item.id === q.id);
      return listed ? {
        ...q,
        topExplanation: listed.topExplanation,
        myExplanation: listed.myExplanation,
        quality: listed.quality
      } : q;
    });
    if (!enriched.length) return;
    setGrammarMode('practice');
    setGrammarSavedNotice('');
    resetQuizState('grammarTest');
    setTQs(enriched.map(shuffleQuestionOptions));
    if (!(await chargeStartedMode('practice', options))) resetQuizState('grammarHub');
  };
  const mergeGrammarQuestionsIntoList = questions => {
    const rows = (Array.isArray(questions) ? questions : []).filter(q => q && q.id && !String(q.id).startsWith('fallback-'));
    if (!rows.length) return;
    setGrammarList(prev => {
      const seen = new Set(prev.map(q => String(q.id)));
      const added = rows.filter(q => !seen.has(String(q.id)));
      return added.length ? [...added, ...prev] : prev;
    });
    setGrammarListPage(0);
  };
  const startGrammarDbTest = async () => {
    var _qs__meta_plan, _qs__meta, _qs__meta_plan1, _qs__meta1;
    if (!canStartPaidMode(COIN_COSTS.TEST)) return;
    const qs = await fetchGrammarSession(userId, 'test', 8);
    if (typeof ((_qs__meta = qs._meta) === null || _qs__meta === void 0 ? void 0 : (_qs__meta_plan = _qs__meta.plan) === null || _qs__meta_plan === void 0 ? void 0 : _qs__meta_plan.remaining) === 'number') setWallet(w => ({
      ...w,
      coins: qs._meta.plan.remaining
    }));
    if ((_qs__meta1 = qs._meta) === null || _qs__meta1 === void 0 ? void 0 : (_qs__meta_plan1 = _qs__meta1.plan) === null || _qs__meta_plan1 === void 0 ? void 0 : _qs__meta_plan1.aiCost) t$("Part5 AI -".concat(qs._meta.plan.aiCost, " coins"), 'info');
    if ((qs === null || qs === void 0 ? void 0 : qs._meta) && qs._meta.ok === false) t$('Part5 AI generation failed. Existing questions only.', 'warn');
    if (!qs.length) {
      t$('AI新規問題を生成できませんでした。コインは消費されません。', 'warn');
      return;
    }
    const nextQuestions = qs;
    if (!nextQuestions.length) return;
    setGrammarMode('test');
    resetQuizState('grammarTest');
    setTQs(nextQuestions.map(shuffleQuestionOptions));
    mergeGrammarQuestionsIntoList(nextQuestions);
    if (!(await chargeStartedMode('test'))) resetQuizState('grammarHub');
    fetchGrammarList(userId).then(rows => {
      setGrammarList(rows);
      setGrammarListPage(0);
    }).catch(() => {});
  };
  const startTest = async function (type) {
    let mode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'test';
    const isFree = !SB_READY || type === "grammarTest";
    const cost = costForMode(mode);
    if (!isFree && !canStartPaidMode(cost)) return;
    const qCount = quizCountForMode(mode, type);
    try {
      var _qs__meta_plan, _qs__meta;
      const qs = type === "grammarTest" ? await fetchGrammarSession(userId, mode, qCount) : await buildStandardQuizQuestions(type, mode);
      if (!qs.length) {
        if (type === "grammarTest" && mode !== 'practice') t$('AI新規問題を生成できませんでした。コインは消費されません。', 'warn');
        return;
      }
      if (type === "grammarTest" && typeof ((_qs__meta = qs._meta) === null || _qs__meta === void 0 ? void 0 : (_qs__meta_plan = _qs__meta.plan) === null || _qs__meta_plan === void 0 ? void 0 : _qs__meta_plan.remaining) === 'number') {
        setWallet(w => ({
          ...w,
          coins: qs._meta.plan.remaining
        }));
      }
      if (type === "grammarTest" && (qs === null || qs === void 0 ? void 0 : qs._meta) && qs._meta.ok === false) t$('Part5 AI generation failed. Existing questions only.', 'warn');
      const normalizedQs = type === "wordTest" ? qs.map(normalizeWordQuestionOptions) : qs;
      const shuffledQs = normalizedQs.map(shuffleQuestionOptions);
      if (type === "wordTest") rememberGeneratedQuestions('word', shuffledQs);
      if (type === "listeningTest") rememberGeneratedQuestions('listening', shuffledQs);
      if (type === "grammarTest") mergeGrammarQuestionsIntoList(shuffledQs);
      resetQuizState(type);
      setTQs(shuffledQs);
      if (!isFree && !(await chargeStartedMode(mode))) resetQuizState('studyHub');
    } catch (err) {
      console.error('[startTest]', err.message);
      t$('Question generation failed. Starting with existing questions.');
      const qs = existingQuizQuestions(type, mode === 'practice' ? 5 : 10);
      resetQuizState(type);
      setTQs((type === "wordTest" ? qs.map(normalizeWordQuestionOptions) : qs).map(shuffleQuestionOptions));
      if (!isFree && !(await chargeStartedMode(mode))) resetQuizState('studyHub');
    }
  };
  const startSingleStudyQuestion = async (kind, item) => {
    t$('選んだ問題を1問だけ練習します', 'ok');
    setScreen(kind === 'word' ? 'wordTest' : 'listeningTest');
    setTIdx(0);
    setTAns([]);
    setTSel(null);
    setTPh("quiz");
    setLisN(0);
    setPlay(false);
    if (kind === 'word') {
      var _item_word, _ref;
      const word = (_ref = (_item_word = item.word) !== null && _item_word !== void 0 ? _item_word : item.en) !== null && _ref !== void 0 ? _ref : '';
      var _item_meaning, _ref1, _ref2;
      const meaning = (_ref2 = (_ref1 = (_item_meaning = item.meaning) !== null && _item_meaning !== void 0 ? _item_meaning : item.jp) !== null && _ref1 !== void 0 ? _ref1 : item.correct) !== null && _ref2 !== void 0 ? _ref2 : '';
      const others = shuffle(WORDS.filter(w => w.meaning !== meaning)).slice(0, 3).map((w, __idx) => w.meaning);
      setTQs([{
        ...item,
        word,
        meaning,
        options: shuffle([meaning, ...others]),
        correct: meaning
      }]);
      return;
    }
    var _item_jp, _ref3;
    const answer = (_ref3 = (_item_jp = item.jp) !== null && _item_jp !== void 0 ? _item_jp : item.correct) !== null && _ref3 !== void 0 ? _ref3 : '';
    const distractors = Array.isArray(item.d) ? item.d : Array.isArray(item.distractors) ? item.distractors : [];
    const fallback = LISTENING.filter(q => q.jp !== answer).slice(0, 3).map((q, __idx) => q.jp);
    setTQs([{
      ...item,
      jp: answer,
      options: shuffle([answer, ...(distractors.length ? distractors : fallback)]).slice(0, 4),
      correct: answer
    }]);
  };
  const voteStudyItem = (key, vote) => {
    setStudyVotes(prev => ({
      ...prev,
      [key]: prev[key] === vote ? undefined : vote
    }));
    t$(vote === 1 ? 'いいねを記録しました' : 'わるいねを記録しました', 'ok');
  };
  const pickOpt = opt => {
    if (tSel !== null) return;
    setTSel(opt);
  };
  const addGrammarExplanation = async q => {
    const body = grammarNote.trim();
    if (!body || !(q === null || q === void 0 ? void 0 : q.id)) return;
    const res = await fetch('/api/grammar/explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        questionId: q.id,
        body
      })
    }).catch(() => null);
    if (res === null || res === void 0 ? void 0 : res.ok) {
      setGrammarNote('');
      const added = await res.json().catch(() => null);
      setGrammarSavedNotice('自分の解説を保存しました。次回この問題を開いた時にも表示されます。');
      setTQs(prev => prev.map((item, __idx) => item.id === q.id ? {
        ...item,
        topExplanation: item.topExplanation || (added === null || added === void 0 ? void 0 : added.explanation),
        myExplanation: (added === null || added === void 0 ? void 0 : added.explanation) || {
          body
        }
      } : item));
      t$('自分の解説を保存しました', 'ok');
    } else {
      t$('解説の追加に失敗しました', 'warn');
    }
  };
  const voteGrammarExplanation = async function (explanationId) {
    let value = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    if (!explanationId) return;
    fetch('/api/grammar/explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'vote',
        userId,
        explanationId,
        value
      })
    }).then(() => t$('投票しました', 'ok')).catch(() => t$('投票に失敗しました', 'warn'));
  };
  const voteGrammarQuestion = async (q, value) => {
    if (!(q === null || q === void 0 ? void 0 : q.id) || String(q.id).startsWith('fallback-')) {
      t$('DB保存後の問題で評価できます', 'warn');
      return;
    }
    try {
      const res = await fetch('/api/grammar/question-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          questionId: q.id,
          value
        })
      });
      if (!res.ok) throw new Error("HTTP ".concat(res.status));
      const data = await res.json();
      var _data_quality;
      const quality = (_data_quality = data.quality) !== null && _data_quality !== void 0 ? _data_quality : q.quality;
      setTQs(prev => prev.map((item, __idx) => item.id === q.id ? {
        ...item,
        quality
      } : item));
      setGrammarList(prev => prev.map((item, __idx) => item.id === q.id ? {
        ...item,
        quality
      } : item));
      t$(value > 0 ? '問題にいいねしました' : '問題にわるいねしました', 'ok');
    } catch (err) {
      console.error('[grammar/question-vote]', err);
      t$('問題評価に失敗しました', 'warn');
    }
  };
  const nextQ = () => {
    const q = tQs[tIdx];
    var _q_correct;
    const ok = tSel === ((_q_correct = q.correct) !== null && _q_correct !== void 0 ? _q_correct : q.ans);
    if (screen === "grammarTest") saveGrammarAttempt(userId, q, tSel, grammarMode);
    const newAns = [...tAns, {
      qId: q.id,
      sel: tSel,
      ok,
      q
    }];
    setTAns(newAns);
    setTSel(null);
    setLisN(0);
    setPlay(false);
    window.speechSynthesis && window.speechSynthesis.cancel();
    if (tIdx + 1 >= tQs.length) {
      setTPh("result");
      const cnt = newAns.filter(a => a.ok).length;
      const key = screen === "wordTest" ? "word" : screen === "grammarTest" ? "grammar" : "listening";
      setTR(p => ({
        ...p,
        [key]: [...p[key], {
          date: new Date().toISOString(),
          correct: cnt,
          total: newAns.length
        }]
      }));
      setPts(p => p + cnt * 5);
      t$("学習ポイント +".concat(cnt * 5, "pt"), 'ok');
      dbSaveTestResult(key, cnt, newAns.length);
    } else {
      setTQs(prev => prev.map((q, idx) => idx === tIdx + 1 ? shuffleQuestionOptions(q) : q));
      setTIdx(i => i + 1);
    }
  };
  // リスニング音声再生
  // 現在: window.speechSynthesis (ブラウザTTS) を使用
  // 将来の差し替えポイント:
  //   音声ファイル: new Audio('/audio/word.mp3').play()
  //   外部TTS API: /api/speech/tts?text=... のようなAPI Routeを作成
  const speak = txt => {
    if (!window.speechSynthesis) return;
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
    u.onend = () => setPlay(false);
    u.onerror = () => setPlay(false);
    window.speechSynthesis.speak(u);
    setLisN(n => n + 1);
  };
  const optCls = opt => {
    var _tQs_tIdx, _tQs_tIdx1;
    if (tSel === null) return "";
    var _tQs_tIdx_correct;
    const ca = (_tQs_tIdx_correct = (_tQs_tIdx = tQs[tIdx]) === null || _tQs_tIdx === void 0 ? void 0 : _tQs_tIdx.correct) !== null && _tQs_tIdx_correct !== void 0 ? _tQs_tIdx_correct : (_tQs_tIdx1 = tQs[tIdx]) === null || _tQs_tIdx1 === void 0 ? void 0 : _tQs_tIdx1.ans;
    if (opt === ca) return "ok";
    if (opt === tSel && opt !== ca) return "ng";
    return "";
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
  const calcShadowScore = (recognized, reference) => {
    const normalize = s => s.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
    const recWords = normalize(recognized);
    const refWords = normalize(reference);
    if (!refWords.length) return {
      score: 0,
      matched: 0,
      total: 0
    };
    // 順序を考慮したマッチ（LCS的アプローチ）
    let matched = 0;
    const used = new Set();
    recWords.forEach(word => {
      const idx = refWords.findIndex((w, i) => w === word && !used.has(i));
      if (idx >= 0) {
        matched++;
        used.add(idx);
      }
    });
    const score = Math.min(100, Math.round(matched / refWords.length * 100));
    return {
      score,
      matched,
      total: refWords.length
    };
  };
  /** Web Speech API を使ったシャドーイング録音・採点 */
  const doRec = () => {
    var _curCaptions_capIdx;
    if (shwPh !== "idle") return;
    var _curVid_videoId, _captionCache_;
    // 参照テキスト: 現在表示中の字幕、なければダミー
    const curCaptions = (_captionCache_ = captionCache[(_curVid_videoId = curVid === null || curVid === void 0 ? void 0 : curVid.videoId) !== null && _curVid_videoId !== void 0 ? _curVid_videoId : '']) !== null && _captionCache_ !== void 0 ? _captionCache_ : [];
    var _curCaptions_capIdx_english;
    const refText = (_curCaptions_capIdx_english = (_curCaptions_capIdx = curCaptions[capIdx]) === null || _curCaptions_capIdx === void 0 ? void 0 : _curCaptions_capIdx.english) !== null && _curCaptions_capIdx_english !== void 0 ? _curCaptions_capIdx_english : "The quick brown fox jumps over the lazy dog";
    // ── Web Speech API が使えるか確認 ─────────────────────────
    const SpeechRecognitionAPI = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognitionAPI) {
      console.warn('[shadowing] SpeechRecognition未対応');
      setShwEngine('unavailable');
      setShwSc(0);
      setShwTranscript('このブラウザは音声認識に対応していません。Chrome / Edge でお試しください。');
      setShwWords(0);
      setShwTotal(refText.split(/\s+/).filter(Boolean).length);
      setShwPh("score");
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
    recognition.onresult = event => {
      recognized = Array.from(event.results).map((r, __idx) => r[0].transcript).join(' ');
      setShwTranscript(recognized);
      console.log('[shadowing] 認識テキスト:', recognized);
      console.log('[shadowing] 参照テキスト:', refText);
    };
    recognition.onend = () => {
      const {
        score,
        matched,
        total
      } = calcShadowScore(recognized, refText);
      setShwSc(score);
      setShwWords(matched);
      setShwTotal(total);
      setShwPh("score");
      setPts(p => p + Math.floor(score / 10));
      setTR(p => ({
        ...p,
        shadowing: [...p.shadowing, {
          date: new Date().toISOString(),
          score
        }]
      }));
      dbSaveTestResult("shadowing", matched, total, score);
      console.log("[shadowing] スコア: ".concat(score, " (").concat(matched, "/").concat(total, "単語)"));
    };
    recognition.onerror = event => {
      console.error('[shadowing] recognition error:', event.error);
      setShwSc(0);
      setShwTranscript('音声を認識できませんでした。マイク権限と入力音量を確認して、もう一度お試しください。');
      setShwWords(0);
      setShwTotal(refText.split(/\s+/).filter(Boolean).length);
      setShwPh("score");
    };
    // 5秒録音
    recognition.start();
    setTimeout(() => {
      try {
        recognition.stop();
      } catch (e) {}
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
  */
  ;
  // ── reward ad ──
  // アフィリエイトクリックをログ送信（バックグラウンド・失敗してもOK）
  const logAffiliateClick = (cardKey, cardTitle, toeicScore, extra = {}) => {
    fetch('/api/affiliate/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        cardKey,
        cardTitle,
        toeicScore,
        ...extra
      })
    }).catch(() => {});
  };
  const openStudySapuriOffer = useCallback((screenName, url, label) => {
    logAffiliateClick('study_sapuri', label, toeic, {
      affiliateName: 'study_sapuri',
      screenName
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [toeic, userId]);
  const StudySapuriCard = useCallback(function (props = {}) {
    const {
      screenName = 'home',
      variant = 'home',
      compact = false
    } = props;
    const isToeic = variant === 'toeic';
    const isTrial = variant === 'trial';
    const url = isTrial ? AFFILIATE_LINKS.STUDY_SUPPLI_TRIAL : isToeic ? AFFILIATE_LINKS.STUDY_SUPPLI_TOEIC : AFFILIATE_LINKS.STUDY_SUPPLI_HOME;
    const cta = isTrial ? 'まずは無料体験' : isToeic ? 'TOEIC対策はこちら' : 'スタディサプリ ENGLISH';
    const title = isTrial ? '学習継続おめでとうございます' : 'おすすめ教材';
    const nextToeicTarget = toeic < 700 ? 700 : toeic < 800 ? 800 : 900;
    const toeicGap = Math.max(0, nextToeicTarget - toeic);
    const desc = isTrial ? '次のレベルへ進みませんか？' : isToeic ? "あと".concat(toeicGap, "点で").concat(nextToeicTarget, "点です。TOEIC対策をまとめて進められます。") : '毎日の英語学習に、TOEIC対策コースを組み合わせられます。';
    return /*#__PURE__*/<div className="afcard" style={{
      margin: compact ? "8px 0" : "8px 16px 12px",
      borderColor: "#B8893233",
      background: "#fff",
      boxShadow: compact ? "none" : "var(--sh)"
    }}>{/*#__PURE__*/<div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10
      }}>{/*#__PURE__*/<div style={{
          fontSize: 24,
          lineHeight: 1
        }}>🎓</div>}{/*#__PURE__*/<div style={{
          flex: 1,
          minWidth: 0
        }}>{/*#__PURE__*/<div className="afbdg" style={{
            background: "#B8893214",
            color: "#8A5A18"
          }}>{title}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--t)",
            marginBottom: 3
          }}>スタディサプリ ENGLISH</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            color: "var(--t2)",
            lineHeight: 1.55,
            marginBottom: 10
          }}>{desc}</div>}{/*#__PURE__*/<button className="afcta" style={{
            background: "#B88932"
          }} onClick={() => openStudySapuriOffer(screenName, url, cta)}>{cta}</button>}</div>}</div>}</div>;
  }, [openStudySapuriOffer]);
  const openAffiliateOffer = useCallback(function () {
    let card = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : afCard;
    if (!card) return;
    var _card_key;
    logAffiliateClick((_card_key = card.key) !== null && _card_key !== void 0 ? _card_key : '', card.title, toeic);
    if (card.url && card.url !== '#') {
      window.open(card.url, '_blank', 'noopener');
    } else {
      t$('紹介リンクは未設定です。環境変数 NEXT_PUBLIC_AFFILIATE_*_URL を設定してください。', 'warn');
    }
  }, [afCard, toeic, userId]);
  // ── SNS ヘルパー ──────────────────────────────────────────────
  const loadProfile = async () => {
    try {
      const r = await fetch("/api/social/profile?userId=".concat(encodeURIComponent(userId)));
      if (r.ok) {
        const p = await r.json();
        setMyProfile(p);
        return p;
      }
    } catch (e) {}
    return null;
  };
  const saveProfile = async function (nickname) {
    let avatarEmoji = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '🎓';
    setMyProfile({
      nickname,
      avatar_emoji: avatarEmoji
    });
    fetch('/api/social/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        nickname,
        avatarEmoji
      })
    }).catch(() => {});
  };
  const loadRanking = async function (type) {
    let period = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : rankingPeriod;
    setRankingTab(type);
    setRankingPeriod(period);
    setRankingLoading(true);
    try {
      const r = await fetch("/api/social/ranking?type=".concat(type, "&period=").concat(period, "&limit=30&userId=").concat(encodeURIComponent(userId)));
      if (r.ok) {
        const d = await r.json();
        var _d_ranking;
        setRankingData((_d_ranking = d.ranking) !== null && _d_ranking !== void 0 ? _d_ranking : []);
      }
    } catch (e) {
      setRankingData([]);
    }
    setRankingLoading(false);
  };
  const postTranslation = async (videoId, captionIndex, english, translation) => {
    if (!translation.trim()) return;
    try {
      const r = await fetch('/api/social/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          videoId,
          captionIndex,
          english,
          translation
        })
      });
      if (r.ok) {
        t$('翻訳を投稿しました！', 'ok');
      } else t$('投稿に失敗しました');
    } catch (e) {
      t$('オフラインのため投稿できません');
    }
  };
  const voteTranslation = async (translationId, vote) => {
    try {
      const r = await fetch('/api/social/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          translationId,
          vote
        })
      });
      const d = await r.json();
      if (d.ok) t$(vote === 1 ? '👍 いいね！' : '👎 評価しました');else t$(d.message || '投票に失敗しました');
    } catch (e) {
      t$('オフラインのため投票できません');
    }
  };
  const loginWithGoogle = () => {
    try {
      supabaseAuth.signInWithGoogle();
    } catch (err) {
      console.error('[Auth] login failed:', err);
      t$('ログイン設定が未完了です。Supabaseの環境変数を確認してください。', 'warn');
    }
  };
  const openRew = async function (cb) {
    let reason = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'ai';
    if (!rewardedAdsAvailable) {
      return;
    }
    if (rewardAdInFlightRef.current) {
      t$('広告を表示中です。完了までお待ちください。', 'warn');
      return;
    }
    rewardAdInFlightRef.current = true;
    setRewCb(() => cb);
    setRewPct(10);
    setRewStatus('広告を読み込んでいます');
    setRewShow(true);
    let progressTimer = null;
    try {
      progressTimer = setInterval(() => {
        setRewPct(p => Math.min(90, p + 8));
      }, 450);
      const result = await showRewardedAd(reason);
      if (progressTimer) clearInterval(progressTimer);
      if (result.success && result.rewardEarned) {
        setRewPct(100);
        setRewStatus(reason === 'gacha' ? '視聴完了：ガチャを実行します' : '視聴完了：報酬を獲得しました');
        await Promise.resolve(cb && cb());
        t$(reason === 'gacha' ? '視聴完了：ガチャ報酬を獲得しました' : '視聴完了：報酬を獲得しました', 'ok');
        setTimeout(() => setRewShow(false), 350);
        return;
      }
      const detail = result.reason ? "".concat(result.reason, ": ").concat(result.error || '') : result.error || '広告の読み込みに失敗しました';
      setRewStatus(detail);
      t$(detail || '広告の読み込みに失敗しました。時間をおいて再度お試しください', 'warn');
      setTimeout(() => setRewShow(false), 700);
    } catch (e) {
      if (progressTimer) clearInterval(progressTimer);
      setRewStatus('広告の読み込みに失敗しました');
      t$('広告の読み込みに失敗しました。時間をおいて再度お試しください', 'warn');
      setTimeout(() => setRewShow(false), 700);
    } finally {
      rewardAdInFlightRef.current = false;
    }
  };
  const SponsorCard = param => {
    let {
      compact = false
    } = param;
    if (!sett.affOn || !afCard) return null;
    return /*#__PURE__*/<div className="afcard" style={{
      margin: compact ? 0 : "8px 16px 12px",
      borderColor: afCard.color + "33",
      background: "#fff",
      boxShadow: compact ? "none" : "var(--sh)"
    }}>{/*#__PURE__*/<div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10
      }}>{/*#__PURE__*/<div style={{
          fontSize: 24,
          lineHeight: 1
        }}>{afCard.emoji}</div>}{/*#__PURE__*/<div style={{
          flex: 1,
          minWidth: 0
        }}>{/*#__PURE__*/<div className="afbdg" style={{
            background: afCard.color + "14",
            color: afCard.color
          }}>おすすめ</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--t)",
            marginBottom: 3
          }}>{afCard.title}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            color: "var(--t2)",
            lineHeight: 1.55,
            marginBottom: 10
          }}>{afCard.desc}</div>}{/*#__PURE__*/<button className="afcta" style={{
            background: afCard.color
          }} onClick={() => openAffiliateOffer(afCard)}>{afCard.cta}</button>}</div>}</div>}</div>;
  };
  // ── gacha ──
  // ═══════════════════════════════════════════════════════════
  // ECONOMY HELPERS
  // ═══════════════════════════════════════════════════════════
  /** ウォレット取得（API → localStorage フォールバック） */
  const buildAdviceClientSummary = () => {
    const totalLogs = Math.max(1, TR.word.length + TR.grammar.length + TR.listening.length + TR.shadowing.length);
    return {
      toeic_estimate: toeic,
      study_summary: "".concat(streakStats.streak, "日継続 / 今日").concat(streakStats.todayCount, "回学習"),
      study_frequency: streakStats.todayCount,
      learning_log_count: totalLogs,
      listening_ratio: (TR.listening.length + TR.shadowing.length) / totalLogs,
      conversation_ratio: TR.shadowing.length / totalLogs,
      vocabulary_count: saved.length,
      streak_days: streakStats.streak,
      today_words: streakStats.todayWords,
      recent_videos: myList.slice(0, 5).map((v, __idx) => v.title).filter(Boolean)
    };
  };
  const loadAdviceHistory = async () => {
    setAdviceLoading(true);
    try {
      const uid = (authUser === null || authUser === void 0 ? void 0 : authUser.id) || userId;
      const r = await fetch("/api/advice/history?userId=".concat(encodeURIComponent(uid), "&limit=20"));
      const d = await r.json();
      const rows = Array.isArray(d.history) ? d.history : [];
      setAdviceHistory(rows);
      setAdviceSelected(prev => prev || rows[0] || null);
    } catch (e) {
      setAdviceHistory([]);
    } finally {
      setAdviceLoading(false);
    }
  };
  const generateAdvice = async () => {
    if (adviceGenerating) return;
    if (wallet.coins < 5) {
      t$('AIアドバイスには5コイン必要です。ガチャでコインを取得してください。', 'warn');
      setNavTab('gacha');
      return;
    }
    setAdviceGenerating(true);
    try {
      const uid = (authUser === null || authUser === void 0 ? void 0 : authUser.id) || userId;
      const r = await fetch('/api/advice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: uid,
          clientSummary: buildAdviceClientSummary()
        })
      });
      const d = await r.json();
      if (!d.ok) {
        t$(d.message || 'AIアドバイスを生成できませんでした', 'warn');
        return;
      }
      if (typeof d.remaining === 'number') setWallet(w => ({
        ...w,
        coins: d.remaining
      }));
      if (d.advice) {
        setAdviceSelected(d.advice);
        setAdviceHistory(prev => prev.some(x => x.id === d.advice.id) ? prev : [d.advice, ...prev]);
      }
      t$(d.duplicate ? '直前のアドバイスを表示しました' : 'AIアドバイスを保存しました', 'ok');
    } catch (e) {
      t$('AIアドバイスの取得に失敗しました', 'ng');
    } finally {
      setAdviceGenerating(false);
    }
  };
  useEffect(() => {
    if (navTab === 'advice') loadAdviceHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navTab, authUser === null || authUser === void 0 ? void 0 : authUser.id, userId]);
  const fetchWallet = async () => {
    try {
      const r = await fetch("/api/wallet?userId=".concat(encodeURIComponent(activeWalletUserId)));
      if (r.ok) {
        const w = await r.json();
        console.log('[GACHA_WALLET_GET]', {
          activeWalletUserId,
          requestedUserId: activeWalletUserId,
          walletUserId: w?.user_id ?? w?.userId,
          freeLeft: w?.gacha_daily?.freeLeft,
          adLeft: w?.gacha_daily?.adLeft,
          dailyLeft: w?.gacha_daily?.dailyLeft,
          hasUsedToday: (w?.gacha_daily?.freeLeft ?? 0) <= 0,
          buildSha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'local',
        });
        setWallet(w);
        if (w.gacha_daily) {
          var _w_gacha_daily_freeLeft;
          setDailyGachaLeft((_w_gacha_daily_freeLeft = w.gacha_daily.freeLeft) !== null && _w_gacha_daily_freeLeft !== void 0 ? _w_gacha_daily_freeLeft : 0);
          var _w_gacha_daily_adLeft;
          setAdGachaLeft((_w_gacha_daily_adLeft = w.gacha_daily.adLeft) !== null && _w_gacha_daily_adLeft !== void 0 ? _w_gacha_daily_adLeft : 0);
        }
        return w;
      }
    } catch (e) {}
    return wallet;
  };
  /** コイン加算（デイリー上限・減衰あり） */
  const earnCoins = async function (amount) {
    let decay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    try {
      const r = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          action: 'add',
          amount,
          decay
        })
      });
      if (r.ok) {
        const d = await r.json();
        setWallet(w => ({
          ...w,
          coins: d.total
        }));
        if (d.limitReached) t$('本日のコイン獲得上限に達しました', 'warn');
        return d;
      }
    } catch (e) {}
    // フォールバック: ローカル加算
    setWallet(w => ({
      ...w,
      coins: w.coins + amount
    }));
    return {
      added: amount,
      total: wallet.coins + amount
    };
  };
  /** コイン消費 */
  const spendCoins = async amount => {
    if (wallet.coins < amount) {
      t$("コインが不足しています（必要: ".concat(amount, "枚、所持: ").concat(wallet.coins, "枚）"));
      return false;
    }
    try {
      const r = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          action: 'spend',
          amount
        })
      });
      if (r.ok) {
        const d = await r.json();
        if (!d.ok) {
          t$(d.message || 'コイン消費に失敗しました');
          return false;
        }
        setWallet(w => ({
          ...w,
          coins: d.remaining
        }));
        return true;
      }
    } catch (e) {}
    // フォールバック: ローカル消費
    setWallet(w => ({
      ...w,
      coins: w.coins - amount
    }));
    return true;
  };
  const refundCoinsLocal = async amount => {
    setWallet(w => ({
      ...w,
      coins: w.coins + amount
    }));
    if (!SB_READY) return;
    try {
      const r = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          action: 'refund',
          amount
        })
      });
      if (r.ok) {
        const d = await r.json();
        if (typeof d.total === 'number') setWallet(w => ({
          ...w,
          coins: d.total
        }));
      }
    } catch (e) {}
  };
  const chargeVideoGeneration = async () => {
    if (!SB_READY) return true;
    if (wallet.coins < COIN_COSTS.VIDEO_GENERATION) {
      t$("動画生成には".concat(COIN_COSTS.VIDEO_GENERATION, "コイン必要です。"), 'warn');
      return false;
    }
    return spendCoins(COIN_COSTS.VIDEO_GENERATION);
  };
  const toggleMyVideo = async () => {
    if (!(curVid === null || curVid === void 0 ? void 0 : curVid.videoId)) return;
    const exists = myList.some(v => v.videoId === curVid.videoId);
    if (exists) {
      setMyList(p => p.filter(v => v.videoId !== curVid.videoId));
      await dbRemovePlaylist(curVid.videoId);
      t$('MY\u30ea\u30b9\u30c8\u304b\u3089\u524a\u9664\u3057\u307e\u3057\u305f');
      return;
    }
    try {
      await dbAddPlaylist(curVid);
      setMyList(p => p.some(v => v.videoId === curVid.videoId) ? p : [{
        ...curVid,
        addedAt: new Date().toISOString()
      }, ...p]);
      t$("".concat(String.fromCodePoint(0x1F4CC), " MY追加しました"), 'ok');
    } catch (e) {
      t$('MY\u8ffd\u52a0\u306b\u5931\u6557\u3057\u307e\u3057\u305f', 'ng');
    }
  };
  /** ??????????????? */
  const showUnlockModal = opts => {
    setUnlockModal({
      visible: true,
      ...opts
    });
  };
  /** コンテンツ解放実行 */
  const unlockContent = async opts => {
    try {
      const r = await fetch('/api/wallet/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          ...opts
        })
      });
      const d = await r.json();
      if (d.ok) {
        if (opts.payWith === 'coin' && d.remaining !== undefined) {
          setWallet(w => ({
            ...w,
            coins: d.remaining
          }));
        }
        if (opts.payWith === 'ticket') {
          const col = opts.contentType === 'video' ? 'video_tickets' : opts.contentType === 'quiz' ? 'quiz_tickets' : 'translation_tickets';
          setWallet(w => ({
            ...w,
            [col]: Math.max(0, w[col] - 1)
          }));
        }
        return true;
      }
      t$(d.message || '解放に失敗しました');
      return false;
    } catch (e) {
      // フォールバック: ローカルで消費
      return await spendCoins(opts.payWith === 'coin' ? opts.isNewAI ? COIN_COSTS.VIDEO_GENERATION : COIN_COSTS.AI : 0);
    }
  };
  const doGacha = async function () {
    let payWith = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'free';
    if (gachaInFlight) return;
    // 残回数チェック
    if (payWith === 'free' && dailyGachaLeft <= 0) {
      t$('本日の無料ガチャは終了しました');
      return;
    }
    if (payWith === 'ad' && adGachaLeft <= 0) {
      t$('本日の広告ガチャは上限です');
      return;
    }
    if (payWith === 'coin' && wallet.coins < 10) {
      t$('コインが不足しています（必要: 10枚）');
      return;
    }
    if (payWith === 'ticket' && wallet.gacha_tickets <= 0) {
      t$('ガチャチケットがありません');
      return;
    }
    console.log('[GACHA_CLICK]', {
      payWith,
      activeWalletUserId,
      dailyGachaLeft,
      adGachaLeft,
      walletUserId: wallet?.user_id ?? wallet?.userId,
      freeLeft: wallet?.gacha_daily?.freeLeft,
      adLeft: wallet?.gacha_daily?.adLeft,
      dailyLeft: wallet?.gacha_daily?.dailyLeft,
      hasUsedToday: dailyGachaLeft <= 0,
      buildSha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'local',
    });
    setGachaInFlight(true);
    try {
      const r = await fetch('/api/wallet/gacha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: activeWalletUserId,
          payWith,
          lastRewardType: lastGachaRewardType
        })
      });
      const d = await r.json();
      console.log('[GACHA_POST_RESULT]', {
        payWith,
        activeWalletUserId,
        ok: d?.ok,
        message: d?.message,
        freeLeft: d?.freeLeft,
        adLeft: d?.adLeft,
        dailyLeft: d?.dailyLeft,
        hasUsedToday: (d?.freeLeft ?? 0) <= 0,
        daily: d?.daily,
        buildSha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'local',
      });
      if (!d.ok) {
        setGachaInFlight(false);
        t$(d.message || 'ガチャに失敗しました');
        return;
      }
      const prize = d.prize;
      setLastGachaRewardType(prize.reward_type);
      var _d_freeLeft, _ref;
      setDailyGachaLeft((_ref = (_d_freeLeft = d.freeLeft) !== null && _d_freeLeft !== void 0 ? _d_freeLeft : d.dailyLeft) !== null && _ref !== void 0 ? _ref : 0);
      if (typeof d.adLeft === 'number') setAdGachaLeft(d.adLeft);
      // ウォレット更新
      setWallet(w => {
        var _d_newCoins;
        return {
          ...w,
          coins: (_d_newCoins = d.newCoins) !== null && _d_newCoins !== void 0 ? _d_newCoins : w.coins,
          quiz_tickets: prize.reward_type === 'quiz_ticket' ? w.quiz_tickets + prize.reward_value : w.quiz_tickets,
          video_tickets: prize.reward_type === 'video_ticket' ? w.video_tickets + prize.reward_value : w.video_tickets,
          translation_tickets: prize.reward_type === 'translation_ticket' ? w.translation_tickets + prize.reward_value : w.translation_tickets,
          gacha_tickets: prize.reward_type === 'gacha_ticket' ? w.gacha_tickets + prize.reward_value - (payWith === 'ticket' ? 1 : 0) : payWith === 'ticket' ? w.gacha_tickets - 1 : w.gacha_tickets
        };
      });
      // 旧 pts との互換性（pts は legacy、coins に統合）
      if (prize.reward_type === 'coin') setPts(p => {
        var _prize_reward_value;
        return p + ((_prize_reward_value = prize.reward_value) !== null && _prize_reward_value !== void 0 ? _prize_reward_value : 0);
      });
      var _prize_reward_key;
      // スキル系は gachaSkillStock へ（shooter 装備と連携）
      if (['shield', 'slow', 'hint', 'heal'].includes((_prize_reward_key = prize.reward_key) !== null && _prize_reward_key !== void 0 ? _prize_reward_key : '')) {
        setGachaSkillStock(s => {
          var _s_prize_reward_key;
          return {
            ...s,
            [prize.reward_key]: ((_s_prize_reward_key = s[prize.reward_key]) !== null && _s_prize_reward_key !== void 0 ? _s_prize_reward_key : 0) + 1
          };
        });
      }
      setGRes({
        ...prize,
        pts: prize.reward_type === 'coin' ? prize.reward_value : 0,
        text: prize.text,
        emoji: prize.emoji
      });
      setGHist(h => [{
        ...prize,
        time: new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }, ...h].slice(0, 15));
      t$("\uD83C\uDF8A ".concat(prize.text));
      setGachaInFlight(false);
    } catch (e) {
      if (SB_READY) {
        setGachaInFlight(false);
        t$('ガチャ処理に失敗しました。通信状態を確認してもう一度お試しください。', 'ng');
        return;
      }
      // Supabase未設定の開発・オフライン時だけローカル抽選
      const fallbackWeights = [3, 10, 20, 30, 37];
      let roll = Math.random() * fallbackWeights.reduce((s, w) => s + w, 0);
      let prize = GACHA_PRIZES[GACHA_PRIZES.length - 1];
      for (let i = 0; i < GACHA_PRIZES.length; i += 1) {
        var _fallbackWeights_i;
        roll -= (_fallbackWeights_i = fallbackWeights[i]) !== null && _fallbackWeights_i !== void 0 ? _fallbackWeights_i : 0;
        if (roll <= 0) {
          prize = GACHA_PRIZES[i];
          break;
        }
      }
      setGRes(prize);
      if (prize.pts > 0) {
        setPts(p => p + prize.pts);
        setWallet(w => ({
          ...w,
          coins: w.coins + prize.pts
        }));
      }
      setGHist(h => [{
        ...prize,
        time: new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }, ...h].slice(0, 15));
      t$("\uD83C\uDF8A ".concat(prize.text, "（オフライン）"));
      setGachaInFlight(false);
    }
  };
  // ── url add（oEmbed + AI自動処理）──────────────────────────
  const addUrl = async overrideUrl => {
    const targetUrl = typeof overrideUrl === 'string' ? overrideUrl : urlIn;
    if (!targetUrl.trim()) return;
    const m = targetUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (!m) {
      t$('有効なYouTube URLを入力してください', 'ng');
      return;
    }
    const id = m[1];
    if (videos.some(v => v.videoId === id)) {
      t$('既存の動画です！', 'ok');
      setUrlIn('');
      return;
    }
    setUrlLd(true);
    // ① oEmbed でタイトル・チャンネル名を取得
    const info = await fetchVideoInfo(id);
    const newVideo = {
      videoId: id,
      title: (info === null || info === void 0 ? void 0 : info.title) || '新しい動画',
      channelTitle: (info === null || info === void 0 ? void 0 : info.channelTitle) || 'YouTube',
      thumbnail: "https://img.youtube.com/vi/".concat(id, "/mqdefault.jpg"),
      aiReady: false
    };
    setVideos(p => [newVideo, ...p]);
    setUrlIn('');
    setUrlLd(false);
    // ② タイトルが取れたらSupabaseに保存（リロード後も一覧に残る）
    dbSaveVideo(userId, newVideo);
    // ③ 字幕取得 + AI 日本語イメージ生成を開始
    processNewVideo(newVideo);
  };
  const goVideo = async v => {
    setCurVid(v);
    setCapIdx(0);
    setShwPh("idle");
    setScreen("video");
    setCaptionLoading(true);
    const setReadyCaptions = captions => {
      setCaptionCache(prev => ({
        ...prev,
        [v.videoId]: captions
      }));
      setVideos(prev => prev.map((vid, __idx) => vid.videoId === v.videoId ? {
        ...vid,
        aiReady: true
      } : vid));
    };
    try {
      const cached = captionCache[v.videoId];
      if (Array.isArray(cached) && cached.length > 0) {
        const captions = await addCaptionTiming(v.videoId, cached);
        setReadyCaptions(captions);
        if (!hasCaptionTiming(cached) && hasCaptionTiming(captions)) {
          dbSaveCaptions(v.videoId, captions).catch(() => {});
        }
        return;
      }
      // Supabaseから読み込み
      const fromDb = await dbLoadCaptions(v.videoId);
      if (fromDb && fromDb.length > 0) {
        const captions = await addCaptionTiming(v.videoId, fromDb);
        setReadyCaptions(captions);
        if (!hasCaptionTiming(fromDb) && hasCaptionTiming(captions)) {
          dbSaveCaptions(v.videoId, captions).catch(() => {});
        }
        return;
      }
      // マイリストのchunksがあればそれを使う
      if (v.chunks && v.chunks.length > 0) {
        const captions = await addCaptionTiming(v.videoId, makeManualCaptions(v.chunks, v.videoId));
        setReadyCaptions(captions);
        if (hasCaptionTiming(captions)) {
          dbSaveCaptions(v.videoId, captions).catch(() => {});
        }
      }
    } finally {
      setCaptionLoading(false);
    }
  };
  const voteSharedVideo = async (videoId, vote) => {
    const current = Number(videoVotes[videoId] || 0);
    const nextVote = vote;
    const applyCounts = (likes, dislikes) => {
      setVideos(prev => prev.map((v, __idx) => v.videoId === videoId ? {
        ...v,
        likes,
        dislikes,
        like_count: likes,
        dislike_count: dislikes
      } : v));
    };
    const optimistic = v => {
      if (v.videoId !== videoId) return v;
      const likes = Math.max(0, Number(v.likes || v.like_count || 0) - (current === 1 ? 1 : 0) + (nextVote === 1 ? 1 : 0));
      const dislikes = Math.max(0, Number(v.dislikes || v.dislike_count || 0) - (current === -1 ? 1 : 0) + (nextVote === -1 ? 1 : 0));
      return {
        ...v,
        likes,
        dislikes,
        like_count: likes,
        dislike_count: dislikes
      };
    };
    setVideos(prev => prev.map(optimistic));
    setVideoVotes(prev => ({
      ...prev,
      [videoId]: nextVote
    }));
    try {
      const r = await fetch('/api/social/video-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          videoId,
          vote: nextVote
        })
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) {
        if (typeof d.likes === 'number' && typeof d.dislikes === 'number') applyCounts(Number(d.likes), Number(d.dislikes));
        setVideoVotes(prev => ({
          ...prev,
          [videoId]: d.vote
        }));
      } else {
        console.warn('[video vote]', d.error || r.status);
        t$(d.error || 'いいねの保存に失敗しました', 'warn');
      }
    } catch (err) {
      console.warn('[video vote]', err);
      t$('いいねの保存に失敗しました', 'warn');
    }
  };
  // SCREENS
  // ════════════════════════════════════════════════════════════════
  // ── HOME ────────────────────────────────────────────────────────
  const {
    Home,
    LearnHub,
    StudyHub,
    GrammarHub,
    Quiz,
    Result,
    Analysis,
    VideoScreen,
    Saved,
    Advice,
    Gacha,
    ParallelReader,
    WordShooter,
    NewsCountryHub,
    NewsHub,
    BBCList,
    BBCReader,
    UnlockModal,
    Talk,
    RankingScreen,
    NicknameModal,
    Settings
  } = useEigoMasterViews({
    AFF,
    AFF_CARDS,
    AI_LIMIT_MESSAGE,
    COIN_COSTS,
    DEFAULT_THUMBNAIL,
    GACHA_PRIZES,
    GLOBAL_VIDEOS,
    GRAMMAR,
    I,
    LISTENING,
    MAX_STUDY_CAPTIONS,
    RAKUTEN_TOEIC_OFFICIAL_IMAGE,
    RAKUTEN_TOEIC_OFFICIAL_URL,
    REWARD_ADS_ENABLED,
    SB_ANON_AUTH,
    SB_KEY,
    SB_READY,
    SB_URL,
    SB_URL_AUTH,
    STATIC_CAPTION_OVERRIDES,
    SponsorCard,
    StudySapuriCard,
    TR,
    WORDS,
    adGachaLeft,
    addGrammarExplanation,
    addUrl,
    adviceGenerating,
    adviceHistory,
    adviceLoading,
    adviceSelected,
    afCard,
    afLv,
    affLevel,
    affVis,
    aiGenerateChunks,
    aiTranslateAll,
    aiTranslateSentence,
    aiWordMeaning,
    authLoading,
    authUser,
    autoSync,
    autoSyncTimerRef,
    bbcArticles,
    bbcFeed,
    bbcLoading,
    buildTimedSentences,
    calcToeic,
    capIdx,
    caps,
    captionCache,
    captionLoading,
    captionTimingLoading,
    captionsRef,
    chargeVideoGeneration,
    curArticle,
    curCap,
    curVid,
    dVids,
    dailyGachaLeft,
    dbAddPlaylist,
    dbDeleteLine,
    dbLoadCaptions,
    dbLoadVideos,
    dbLoading,
    dbReady,
    dbRemovePlaylist,
    dbSaveCaptions,
    dbSaveLine,
    dbSaveTestResult,
    dbSaveVideo,
    deferredPrompt,
    dismissOnb,
    doGacha,
    fetchBBCNews,
    fetchGrammarList,
    fetchGrammarSession,
    fetchManualChunks,
    fetchPageSixNews,
    fetchQuiz,
    fetchTranscript,
    fetchVideoInfo,
    fetchWallet,
    findCaptionIndexByTime,
    formatPart5Sentence,
    fullTrans,
    fullTransCache,
    gHist,
    gRes,
    gachaSkillStock,
    gachaInFlight,
    genGrammar,
    genListening,
    genWord,
    generateAdvice,
    generatedQuestionBank,
    getAffCard,
    getPart5Japanese,
    getSourceType,
    getSupabaseAuthConfig,
    getUserId,
    goVideo,
    grammarList,
    grammarListLoading,
    grammarListPage,
    grammarMode,
    grammarNote,
    grammarSavedNotice,
    homeTab,
    isAiLimitError,
    isSaved,
    jpRegenerating,
    lastGachaRewardType,
    lisN,
    loadAdviceHistory,
    loadProfile,
    loadRanking,
    logAffiliateClick,
    loginWithGoogle,
    looksLikeLegacyChunkMeaning,
    makeManualCaptions,
    manualLoading,
    manualNavUntilRef,
    manualText,
    markTranslationApiLimited,
    moveCaption,
    myList,
    myProfile,
    navTab,
    newsScreen,
    newsCountry,
    newsSource,
    nextQ,
    nickInput,
    openAffiliateOffer,
    openGrammarHub,
    openRew,
    optCls,
    pickOpt,
    play,
    postTranslation,
    prEnRef,
    prEnText,
    prJpRef,
    prJpText,
    prMemo,
    prMode,
    prPopup,
    prSaved,
    prSelSent,
    prSelWord,
    prSyncScroll,
    proc,
    processNewVideo,
    pts,
    ptsSyncTimer,
    rankingData,
    rankingLoading,
    rankingPeriod,
    rankingTab,
    refreshJapaneseImagesIfNeeded,
    refundCoinsLocal,
    regenerateCurrentJapanese,
    rememberGeneratedQuestions,
    rewCb,
    rewPct,
    rewShow,
    rewStatus,
    rewardedAdsAvailable,
    saveGrammarAttempt,
    saveProfile,
    saved,
    sbFrom,
    screen,
    selSent,
    selWord,
    sentData,
    setAdGachaLeft,
    setAdviceGenerating,
    setAdviceHistory,
    setAdviceLoading,
    setAdviceSelected,
    setAffVis,
    setAuthLoading,
    setAuthUser,
    setAutoSync,
    setBbcArticles,
    setBbcFeed,
    setBbcLoading,
    setCapIdx,
    setCaptionCache,
    setCurArticle,
    setCurVid,
    setDailyGachaLeft,
    setDbLoading,
    setDbReady,
    setDeferredPrompt,
    setFullTrans,
    setFullTransCache,
    setGHist,
    setGRes,
    setGachaSkillStock,
    setGeneratedQuestionBank,
    setGrammarList,
    setGrammarListLoading,
    setGrammarListPage,
    setGrammarMode,
    setGrammarNote,
    setGrammarSavedNotice,
    setHomeTab,
    setJpRegenerating,
    setLastGachaRewardType,
    setLisN,
    setManualLoading,
    setManualText,
    setMyList,
    setMyProfile,
    setNavTab,
    setNewsScreen,
    setNewsCountry,
    setNewsSource,
    setNickInput,
    setPlay,
    setPrEnText,
    setPrJpText,
    setPrMemo,
    setPrMode,
    setPrPopup,
    setPrSaved,
    setPrSelSent,
    setPrSelWord,
    setPrSyncScroll,
    setProc,
    setPts,
    setRankingData,
    setRankingLoading,
    setRankingPeriod,
    setRankingTab,
    setRewCb,
    setRewPct,
    setRewShow,
    setSaved,
    setScreen,
    setSelSent,
    setSelWord,
    setSentData,
    setSett,
    setShowFull,
    setShowInstall,
    setShowNickEdit,
    setShowOnb,
    setShowRanking,
    setShwEngine,
    setShwPh,
    setShwSc,
    setShwShow,
    setShwTotal,
    setShwTranscript,
    setShwWords,
    setStudyHubPages,
    setStudyVotes,
    setVideoPage,
    setTAns,
    setTIdx,
    setTPh,
    setTQs,
    setTR,
    setTSel,
    setToast,
    setTransLoading,
    setTransShared,
    setTranslationApiLimited,
    setUnlockModal,
    setUrlIn,
    setUrlLd,
    setVideoVotes,
    setVideos,
    setWallet,
    setWordData,
    setWsActive,
    setWsChoiceResult,
    setWsChoices,
    setWsCoins,
    setWsCombo,
    setWsCurrentWord,
    setWsEquipped,
    setWsFlash,
    setWsHits,
    setWsInput,
    setWsLives,
    setWsMaxLives,
    setWsPhase,
    setWsPhaseScreen,
    setWsQuizWords,
    setWsScore,
    setWsSkills,
    setWsSlowed,
    setWsStage,
    setWsWordQueue,
    setWsWords,
    setWsWrong,
    setYtReaderReady,
    sett,
    showFull,
    showInstall,
    showNickEdit,
    showOnb,
    showRanking,
    shuffle,
    shuffleQuestionOptions,
    shwEngine,
    shwPh,
    shwSc,
    shwShow,
    shwTotal,
    shwTranscript,
    shwWords,
    sortAllVideos,
    sortMyVideos,
    spLevel,
    spLv,
    speak,
    splitSentences,
    stars,
    startGrammarDbTest,
    startGrammarPractice,
    startSingleStudyQuestion,
    startTest,
    streakStats,
    studyHubPages,
    studyVotes,
    submitManualTranscript,
    supabaseAuth,
    syncCaptionToCurrentTime,
    t$,
    tAns,
    tIdx,
    tPh,
    tQs,
    tSel,
    tmr,
    toast,
    toeic,
    toeicConfidence,
    toggleMyVideo,
    transLoading,
    transShared,
    translationApiLimited,
    unlockModal,
    urlIn,
    urlLd,
    userId,
    videoPage,
    videoVotes,
    videos,
    voteGrammarExplanation,
    voteGrammarQuestion,
    voteSharedVideo,
    voteStudyItem,
    voteTranslation,
    wallet,
    wordData,
    wsActive,
    wsChoiceResult,
    wsChoices,
    wsCoins,
    wsCombo,
    wsCurrentWord,
    wsEquipped,
    wsFlash,
    wsHits,
    wsInput,
    wsLives,
    wsMaxLives,
    wsPhase,
    wsPhaseScreen,
    wsQuizWords,
    wsScore,
    wsSkills,
    wsSlowed,
    wsStage,
    wsWordQueue,
    wsWords,
    wsWrong,
    ytReaderReady,
    ytReaderRef
  });
  const isTest = ["wordTest", "grammarTest", "listeningTest"].includes(screen);
  const isVideo = screen === "video";
  const isAnal = screen === "analysis";
  const isGrammarHub = screen === "grammarHub";
  const isStudyHub = ["wordHub", "listeningHub", "shooterHub"].includes(screen);
  const isNews = navTab === "news";
  const hideNav = isTest || isVideo || isAnal || isGrammarHub || isStudyHub;
  const testName = {
    wordTest: "単語テスト",
    grammarTest: "文法 Part5",
    listeningTest: "リスニング"
  };
  const getContent = () => {
    if (isVideo) return VideoScreen();
    if (isAnal) return /*#__PURE__*/<Analysis />;
    if (wsActive) return /*#__PURE__*/<WordShooter />;
    if (isGrammarHub) return /*#__PURE__*/<GrammarHub />;
    if (screen === "wordHub") return /*#__PURE__*/<StudyHub kind="word" />;
    if (screen === "listeningHub") return /*#__PURE__*/<StudyHub kind="listening" />;
    if (screen === "shooterHub") return /*#__PURE__*/<StudyHub kind="shooter" />;
    if (isTest) return /*#__PURE__*/<Quiz />;
    if (navTab === "home") return /*#__PURE__*/<Home />;
    if (navTab === "learn") {
      if (wsActive) return /*#__PURE__*/<WordShooter />;
      return /*#__PURE__*/<LearnHub />;
    }
    if (navTab === "news") {
      if (wsActive && wsPhase !== 'idle') return /*#__PURE__*/<WordShooter />;
      if (newsScreen === "parallelReader") return /*#__PURE__*/<ParallelReader />;
      if (newsScreen === "bbcReader") return /*#__PURE__*/<BBCReader />;
      if (newsScreen === "bbcList") return /*#__PURE__*/<BBCList />;
      if (newsScreen === "countryHub") return /*#__PURE__*/<NewsCountryHub />;
      return /*#__PURE__*/<NewsHub />;
    }
    if (navTab === "talk") return /*#__PURE__*/<Talk />;
    if (navTab === "advice") return /*#__PURE__*/<Advice />;
    if (navTab === "gacha") return /*#__PURE__*/<Gacha />;
    if (navTab === "settings") return /*#__PURE__*/<Settings />;
    if (navTab === "saved") return /*#__PURE__*/<Saved />;
    return /*#__PURE__*/<Home />;
  };
  // ニュース画面のヘッダータイトル
  const newsTitle = () => {
    if (wsActive && wsPhase !== 'idle') return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>🎮 シューティング</span>;
    if (newsScreen === "parallelReader") return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>📖 英文記事リーダー</span>;
    if (newsScreen === "bbcReader" && curArticle) return /*#__PURE__*/<span style={{
      maxWidth: 200,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: 13,
      fontWeight: 600
    }}>{curArticle.title}</span>;
    if (newsScreen === "countryHub") return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>海外生活ニュース</span>;
    if (newsScreen === "bbcList") return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>{newsSource === 'pagesix' ? '✨ Page Six' : '🗞️ BBC News'}</span>;
    return /*#__PURE__*/<span className="jp">ニュース学習</span>;
  };
  // ニュース画面の戻るボタン
  const newsBack = () => {
    if (wsActive) {
      setWsPhase('idle');
      setWsActive(false);
      return;
    }
    if (newsScreen === "parallelReader") {
      setNewsScreen("hub");
      return;
    }
    if (newsScreen === "bbcReader") {
      setNewsScreen("bbcList");
      setCurArticle(null);
      return;
    }
    if (newsScreen === "bbcList") {
      setNewsScreen(newsCountry === 'us' ? "hub" : "countryHub");
      return;
    }
    if (newsScreen === "hub") {
      setNewsScreen("countryHub");
    }
  };
  const getHeaderTitle = () => {
    if (isVideo) return /*#__PURE__*/<>{/*#__PURE__*/<span style={{
        fontSize: 16
      }}>{I({
          n: "yt",
          s: 16,
          c: "#FF0000"
        })}</span>}{/*#__PURE__*/<span style={{
        maxWidth: 180,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: 14
      }}>{curVid === null || curVid === void 0 ? void 0 : curVid.title}</span>}</>;
    if (isGrammarHub) return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>文法 Part5</span>;
    if (screen === "wordHub") return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>単語テスト</span>;
    if (screen === "listeningHub") return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>リスニング</span>;
    if (screen === "shooterHub") return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>単語シューティング</span>;
    if (isTest) return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>{testName[screen]}</span>;
    if (isAnal) return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>📊 成績分析</span>;
    if (wsActive) return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>🎮 単語シューティング</span>;
    if (isNews) return newsTitle();
    if (navTab === "advice") return /*#__PURE__*/<span className="jp" style={{
      fontSize: 15
    }}>AIコーチ</span>;
    return /*#__PURE__*/<>{/*#__PURE__*/<span style={{
        fontSize: 20
      }}>🎓</span>}{/*#__PURE__*/<span className="jp">English Base</span>}{streakStats.streak > 0 && /*#__PURE__*/<span className="streak-badge">🔥{/*#__PURE__*/<span className="streak-num">{streakStats.streak}</span>}日</span>}</>;
  };
  const showBack = isVideo || isTest || isAnal || isGrammarHub || isStudyHub || wsActive || isNews && newsScreen !== "countryHub";
  const handleBack = () => {
    if (wsActive) {
      setWsActive(false);
      setWsPhase('idle');
      setWsPhaseScreen('equip');
      return;
    }
    if (isNews && newsScreen !== "countryHub") {
      newsBack();
      return;
    }
    setScreen("main");
    window.speechSynthesis && window.speechSynthesis.cancel();
  };
  return /*#__PURE__*/<div>{/*#__PURE__*/<style>{CSS}</style>}{/*#__PURE__*/<div className="app">{/*#__PURE__*/<div className="hdr">{/*#__PURE__*/<div className="hdr-in">{showBack ? /*#__PURE__*/<>{/*#__PURE__*/<button className="back-btn" onClick={handleBack}>{I({
                n: "chL",
                s: 18
              })} 戻る</button>}{/*#__PURE__*/<div className="hdr-t">{getHeaderTitle()}</div>}{/*#__PURE__*/<div style={{
              width: 60
            }} />}</> : /*#__PURE__*/<>{/*#__PURE__*/<div className="hdr-t">{getHeaderTitle()}</div>}{/*#__PURE__*/<div style={{
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>{/*#__PURE__*/<div style={{
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>{/*#__PURE__*/<div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}>{/*#__PURE__*/<div className="jp" style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#F59E0B",
                    background: "#FEF3C7",
                    padding: "4px 8px",
                    borderRadius: 16
                  }}>🪙{wallet.coins}</div>}</div>}{authUser ? /*#__PURE__*/<div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}>{authUser.avatar_url ? /*#__PURE__*/<img src={authUser.avatar_url} alt="" style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "1.5px solid var(--bd)"
                  }} /> : /*#__PURE__*/<div style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "var(--p)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: "#fff",
                    fontWeight: 700
                  }}>{(authUser.name || "?")[0]}</div>}</div> : /*#__PURE__*/<button onClick={loginWithGoogle} style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--p)",
                  background: "var(--pl)",
                  border: "1px solid var(--cbb)",
                  borderRadius: 20,
                  padding: "3px 10px",
                  cursor: "pointer",
                  fontFamily: "'Noto Sans JP'",
                  whiteSpace: "nowrap"
                }}>ログイン</button>}</div>}{SB_READY ? /*#__PURE__*/<div title="Supabase接続中" style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: dbReady ? "#10B981" : "#F59E0B",
                flexShrink: 0
              }} /> : /*#__PURE__*/<div title="Supabase未設定（データはリセットされます）" style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#94A3B8",
                flexShrink: 0
              }} />}{/*#__PURE__*/<button style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--t3)",
                padding: 4,
                display: "flex",
                alignItems: "center"
              }} onClick={() => setNavTab("settings")} title="設定">{I({
                  n: "cog",
                  s: 20
                })}</button>}</div>}</>}</div>}</div>}{getContent()}{!hideNav && /*#__PURE__*/<div className="bnav">{[{
          id: "home",
          n: "home",
          lbl: "ホーム"
        }, {
          id: "learn",
          n: "learn",
          lbl: "学習"
        }, {
          id: "advice",
          n: "pie",
          lbl: "AI"
        }, {
          id: "news",
          n: "news",
          lbl: "ニュース"
        }, {
          id: "talk",
          n: "globe",
          lbl: "トーク"
        }, {
          id: "gacha",
          n: "gift",
          lbl: "ガチャ"
        }].map((param, __idx) => {
          let {
            id,
            n,
            lbl
          } = param;
          return /*#__PURE__*/<button key={param?.id ?? __idx} className={"ni".concat(navTab === id ? " on" : "")} onClick={() => {
            setNavTab(id);
            setScreen("main");
            if (id === "news") setNewsScreen("countryHub");
          }}>{I({
              n,
              s: 20,
              c: navTab === id ? "var(--p)" : "var(--t3)"
            })}{/*#__PURE__*/<span key={param?.id ?? __idx}>{lbl}</span>}</button>;
        })}</div>}{proc.active && proc.step !== 'manual' && /*#__PURE__*/<div className="mov">{/*#__PURE__*/<div className="msh" style={{
          paddingBottom: 32
        }}>{/*#__PURE__*/<div className="mhnd" />}{/*#__PURE__*/<div style={{
            textAlign: 'center',
            marginBottom: 16
          }}>{/*#__PURE__*/<div style={{
              fontSize: 36,
              marginBottom: 8
            }}>{proc.step === 'transcript' ? '📡' : proc.step === 'ai' ? '🤖' : proc.step === 'saving' ? '💾' : proc.step === 'error' ? '⚠️' : '✨'}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 17,
              fontWeight: 700,
              marginBottom: 4
            }}>{proc.step === 'transcript' && 'Fetching subtitles...'}{proc.step === 'ai' && 'Generating Japanese images...'}{proc.step === 'saving' && 'Saving to database...'}{proc.step === 'done' && 'Complete! 🎉'}{proc.step === 'error' && 'Error'}</div>}{proc.errorMsg && /*#__PURE__*/<div style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "var(--rs)",
              padding: "10px 12px",
              margin: "8px 0",
              textAlign: "left"
            }}>{/*#__PURE__*/<div className="jp" style={{
                fontSize: 12,
                color: "#991B1B",
                lineHeight: 1.5
              }}>⚠️ {proc.errorMsg}</div>}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 12,
              color: 'var(--t3)',
              marginBottom: 12
            }}>{proc.videoTitle}</div>}{proc.step === 'transcript' && /*#__PURE__*/<div className="jp" style={{
              fontSize: 12,
              color: 'var(--t2)',
              marginBottom: 10,
              lineHeight: 1.6,
              background: 'var(--pl)',
              padding: '8px 12px',
              borderRadius: 'var(--rs)'
            }}>Fetching English subtitles from YouTube...{/*#__PURE__*/<br />}{/*#__PURE__*/<span style={{
                fontSize: 11,
                color: 'var(--t3)'
              }}>字幕なし動画は手動入力モードへ切替</span>}</div>}</div>}{/*#__PURE__*/<div style={{
            height: 8,
            background: 'var(--bd)',
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 8
          }}>{/*#__PURE__*/<div style={{
              height: '100%',
              background: 'var(--p)',
              borderRadius: 4,
              transition: 'width .4s ease',
              width: "".concat(proc.pct, "%")
            }} />}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            color: 'var(--t3)',
            textAlign: 'center',
            marginBottom: 20
          }}>{proc.pct}% 完了</div>}{proc.step === 'ai' && /*#__PURE__*/<div style={{
            background: 'var(--pl)',
            borderRadius: 'var(--rs)',
            padding: '12px',
            marginBottom: 12
          }}>{/*#__PURE__*/<div className="jp" style={{
              fontSize: 12,
              color: 'var(--p)',
              lineHeight: 1.7
            }}>🤖 Claudeが日本語イメージを生成しています。{/*#__PURE__*/<br />}英文の意味を自然な日本語に変換中...</div>}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 11,
            color: 'var(--t3)',
            textAlign: 'center'
          }}>完了後に自動的に閉じます</div>}</div>}</div>}{proc.active && proc.step === 'manual' && /*#__PURE__*/<div className="mov" onClick={e => e.target === e.currentTarget && setProc(p => ({
        ...p,
        active: false
      }))}>{/*#__PURE__*/<div className="msh">{/*#__PURE__*/<div className="mhnd" />}{/*#__PURE__*/<div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8
          }}>{/*#__PURE__*/<span style={{
              fontSize: 22
            }}>📋</span>}{/*#__PURE__*/<div>{/*#__PURE__*/<div style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "'Noto Sans JP'"
              }}>字幕テキストを貼り付け</div>}{/*#__PURE__*/<div className="jp" style={{
                fontSize: 11,
                color: 'var(--t3)'
              }}>自動取得できませんでした</div>}</div>}</div>}{proc.errorMsg && /*#__PURE__*/<div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--rs)',
            padding: '10px 12px',
            marginBottom: 12
          }}>{/*#__PURE__*/<div className="jp" style={{
              fontSize: 12,
              color: '#991B1B',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>⚠️ {proc.errorMsg}</div>}</div>}{/*#__PURE__*/<div style={{
            marginBottom: 14,
            background: 'var(--pl)',
            borderRadius: 'var(--rs)',
            padding: '10px 12px'
          }}>{/*#__PURE__*/<div style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--p)',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>{/*#__PURE__*/<span>▶️</span>} 字幕付きおすすめ動画を試す：</div>}{/*#__PURE__*/<div style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap'
            }}>{/*#__PURE__*/<button className="bg" style={{
                padding: '6px 12px',
                fontSize: 11,
                flex: '1 1 auto',
                background: '#fff',
                borderColor: 'var(--bd)'
              }} onClick={() => {
                setProc(p => ({
                  ...p,
                  active: false
                }));
                addUrl("https://www.youtube.com/watch?v=aGJDmCgG44c");
              }}>TED</button>}{/*#__PURE__*/<button className="bg" style={{
                padding: '6px 12px',
                fontSize: 11,
                flex: '1 1 auto',
                background: '#fff',
                borderColor: 'var(--bd)'
              }} onClick={() => {
                setProc(p => ({
                  ...p,
                  active: false
                }));
                addUrl("https://www.youtube.com/watch?v=MhJEw1U6mB4");
              }}>BBC Learning English</button>}{/*#__PURE__*/<button className="bg" style={{
                padding: '6px 12px',
                fontSize: 11,
                flex: '1 1 auto',
                background: '#fff',
                borderColor: 'var(--bd)'
              }} onClick={() => {
                setProc(p => ({
                  ...p,
                  active: false
                }));
                addUrl("https://www.youtube.com/watch?v=F0fE-rFk-pE");
              }}>English Speeches</button>}</div>}</div>}{/*#__PURE__*/<div style={{
            background: 'var(--bg)',
            borderRadius: 'var(--rs)',
            padding: '10px 12px',
            marginBottom: 14,
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start'
          }}>{/*#__PURE__*/<span style={{
              fontSize: 15,
              flexShrink: 0
            }}>💡</span>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: 'var(--t2)',
              lineHeight: 1.7
            }}>{/*#__PURE__*/<b>YouTube字幕の手動コピー方法：</b>}{/*#__PURE__*/<br />}動画ページ →「…」メニュー→「字幕を開く」{/*#__PURE__*/<br />}表示されたテキストを全選択してコピー</div>}</div>}{proc.videoTitle && /*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            color: 'var(--t2)',
            marginBottom: 8,
            padding: '6px 10px',
            background: 'var(--bg)',
            borderRadius: 'var(--rs)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>🎬 {proc.videoTitle}</div>}{/*#__PURE__*/<textarea value={manualText} onChange={e => setManualText(e.target.value)} placeholder="英語の字幕テキストをここに貼り付けてください...\n\nHello everyone, welcome to today's video.\nToday we're going to talk about how to..." style={{
            width: '100%',
            minHeight: 150,
            padding: '10px 12px',
            border: '1.5px solid var(--bd)',
            borderRadius: 'var(--rs)',
            fontFamily: 'inherit',
            fontSize: 13,
            outline: 'none',
            resize: 'vertical',
            marginBottom: 8,
            lineHeight: 1.6,
            background: 'var(--bg)',
            transition: 'border-color .2s'
          }} onFocus={e => {
            e.target.style.borderColor = 'var(--p)';
          }} onBlur={e => {
            e.target.style.borderColor = 'var(--bd)';
          }} />}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 11,
            color: 'var(--t3)',
            marginBottom: 12
          }}>{manualText.length > 0 ? "".concat(manualText.length, "文字 入力済み") : '英文を貼り付けると自動でAI処理します'}</div>}{/*#__PURE__*/<div style={{
            display: 'flex',
            gap: 8
          }}>{/*#__PURE__*/<button className="bg" style={{
              flex: 1
            }} onClick={() => setProc(p => ({
              ...p,
              active: false,
              needManual: false,
              errorMsg: ''
            }))}>キャンセル</button>}{/*#__PURE__*/<button className="bp" style={{
              flex: 2
            }} disabled={!manualText.trim() || manualLoading} onClick={submitManualTranscript}>{manualLoading ? '生成中...' : "AIで日本語生成する（".concat(COIN_COSTS.VIDEO_GENERATION, "）")}</button>}</div>}</div>}</div>}{shwShow && /*#__PURE__*/<div className="mov" onClick={e => e.target === e.currentTarget && (setShwShow(false), setShwPh("idle"))}>{/*#__PURE__*/<div className="msh">{/*#__PURE__*/<div className="mhnd" />}{shwPh !== "score" ? /*#__PURE__*/<>{/*#__PURE__*/<div style={{
              fontSize: 17,
              fontWeight: 700,
              marginBottom: 4,
              fontFamily: "'Noto Sans JP'"
            }}>🎤 シャドーイング {/*#__PURE__*/<span style={{
                fontSize: 11,
                color: "#92400E",
                background: "#FEF3C7",
                border: "1px solid #FDE68A",
                borderRadius: 12,
                padding: "2px 7px",
                verticalAlign: "middle"
              }}>β</span>}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 13,
              color: "var(--t3)",
              marginBottom: 18
            }}>読まれた英文を声に出しましょう</div>}{/*#__PURE__*/<div style={{
              fontSize: 17,
              fontWeight: 600,
              color: "var(--t)",
              lineHeight: 1.5,
              padding: 14,
              background: "var(--bg)",
              borderRadius: "var(--rs)",
              marginBottom: 18,
              textAlign: "center"
            }}>{(curCap === null || curCap === void 0 ? void 0 : curCap.english) || "動画画面でキャプションを選択してください"}</div>}{/*#__PURE__*/<button className={"micbtn".concat(shwPh === "rec" ? " rec" : "")} onClick={doRec} disabled={shwPh === "rec"}>{I({
                n: "mic",
                s: 30,
                c: "white"
              })}</button>}{/*#__PURE__*/<div className="jp" style={{
              textAlign: "center",
              fontSize: 12,
              color: "var(--t3)",
              marginBottom: 8
            }}>{shwPh === "idle" ? shwEngine === 'webSpeech' ? "マイクボタンを押して録音（5秒間）" : "マイクボタンを押す（簡易採点モード）" : "🔴 録音中... 英文を声に出してください"}</div>}{shwPh === "rec" && /*#__PURE__*/<div style={{
              width: '100%',
              marginBottom: 16
            }}>{/*#__PURE__*/<div style={{
                height: 4,
                background: 'var(--bd)',
                borderRadius: 2,
                overflow: 'hidden'
              }}>{/*#__PURE__*/<div style={{
                  height: '100%',
                  background: 'var(--ng)',
                  borderRadius: 2,
                  animation: 'recProgress 5s linear forwards'
                }} />}</div>}</div>}{/*#__PURE__*/<button className="bg" style={{
              width: "100%"
            }} onClick={() => {
              setShwShow(false);
              setShwPh("idle");
            }}>キャンセル</button>}</> : /*#__PURE__*/<>{/*#__PURE__*/<div style={{
              fontSize: 17,
              fontWeight: 700,
              marginBottom: 4,
              fontFamily: "'Noto Sans JP'"
            }}>📊 スコア結果</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 13,
              color: "var(--t3)",
              marginBottom: 18
            }}>お疲れ様でした！</div>}{/*#__PURE__*/<div className="sdbox">{/*#__PURE__*/<div style={{
                fontSize: 10,
                color: 'var(--t3)',
                marginBottom: 4,
                fontFamily: "'Noto Sans JP'"
              }}>{shwEngine === 'webSpeech' ? '🎤 Web Speech API（実音声認識）' : '⚠️ 音声認識未対応'}</div>}{/*#__PURE__*/<div style={{
                fontSize: 46,
                fontWeight: 700,
                color: "var(--p)",
                lineHeight: 1
              }}>{shwSc}{/*#__PURE__*/<span style={{
                  fontSize: 20
                }}>点</span>}</div>}{/*#__PURE__*/<div style={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                margin: "8px 0"
              }}>{stars(shwSc, 100).map((on, i) => I({
                  n: "star",
                  s: 22,
                  c: on ? "#F59E0B" : "#E2E8F0"
                }))}</div>}{shwTotal > 0 && /*#__PURE__*/<div className="jp" style={{
                fontSize: 12,
                color: 'var(--t2)',
                margin: '4px 0'
              }}>単語一致: {shwWords} / {shwTotal} 語</div>}{/*#__PURE__*/<div className="jp" style={{
                fontSize: 13,
                color: "var(--t3)"
              }}>学習ポイント +{Math.floor(shwSc / 10)}pt</div>}</div>}{shwTranscript && shwTranscript.length > 2 && /*#__PURE__*/<div style={{
              background: 'var(--bg)',
              borderRadius: 'var(--rs)',
              padding: '10px 12px',
              marginBottom: 12,
              border: '1px solid var(--bd)'
            }}>{/*#__PURE__*/<div style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--t3)',
                marginBottom: 4,
                fontFamily: "'Noto Sans JP'"
              }}>認識されたテキスト</div>}{/*#__PURE__*/<div style={{
                fontSize: 13,
                color: 'var(--t)',
                fontStyle: 'italic'
              }}>{shwTranscript}</div>}</div>}{sett.rewOn && /*#__PURE__*/<div className="rdbox">{/*#__PURE__*/<div style={{
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 6,
                fontFamily: "'Noto Sans JP'"
              }}>📺 広告を視聴して詳細分析を解放</div>}{/*#__PURE__*/<div style={{
                color: "#94A3B8",
                fontSize: 11,
                marginBottom: 10,
                fontFamily: "'Noto Sans JP'"
              }}>発音・リズム・アクセントの詳細スコア</div>}{/*#__PURE__*/<button style={{
                background: "var(--a)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--rs)",
                padding: "9px 20px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP'",
                width: "100%",
                fontSize: 13
              }} onClick={() => openRew(() => t$("🔓 詳細分析解放！"))}>広告を見て解放 →</button>}</div>}{/*#__PURE__*/<button className="bp" style={{
              width: "100%"
            }} onClick={() => {
              setShwShow(false);
              setShwPh("idle");
            }}>閉じる</button>}</>}</div>}</div>}{rewShow && /*#__PURE__*/<div className="mov">{/*#__PURE__*/<div className="msh">{/*#__PURE__*/<div className="mhnd" />}{/*#__PURE__*/<div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 18
          }}>{I({
              n: "ad",
              s: 18,
              c: "var(--t3)"
            })}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 14,
              fontWeight: 700
            }}>{rewStatus && rewStatus !== 'idle' ? rewStatus : '広告を表示しています'}</div>}</div>}{/*#__PURE__*/<div style={{
            background: "#1e293b",
            borderRadius: 12,
            aspectRatio: "16/9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            gap: 10
          }}>{/*#__PURE__*/<div style={{
              fontSize: 40
            }}>📺</div>}{/*#__PURE__*/<div className="jp" style={{
              color: "#fff",
              fontSize: 14
            }}>リワード広告</div>}</div>}{/*#__PURE__*/<div className="rpb">{/*#__PURE__*/<div className="rpbb" style={{
              width: "".concat(rewPct, "%")
            }} />}</div>}{/*#__PURE__*/<div className="jp" style={{
            textAlign: "center",
            fontSize: 13,
            color: "var(--t3)",
            marginTop: 8
          }}>{Math.round(rewPct)}% 視聴完了</div>}</div>}</div>}{toast && /*#__PURE__*/<div className={"toast toast-".concat(toast.type)}>{toast.type === 'ok' && '✅ '}{toast.type === 'ng' && '❌ '}{toast.type === 'warn' && '⚠️ '}{toast.msg}</div>}{/*#__PURE__*/<UnlockModal />}{NicknameModal()}{showRanking && /*#__PURE__*/<div style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column"
      }}>{/*#__PURE__*/<div className="hdr">{/*#__PURE__*/<div className="hdr-in">{/*#__PURE__*/<button className="back-btn" onClick={() => setShowRanking(false)}>{I({
                n: "chL",
                s: 18,
                c: "var(--p)"
              })} 戻る</button>}{/*#__PURE__*/<span className="jp" style={{
              fontSize: 15,
              fontWeight: 700
            }}>🏆 ランキング</span>}{/*#__PURE__*/<div style={{
              width: 60
            }} />}</div>}</div>}{/*#__PURE__*/<RankingScreen />}</div>}</div>}</div>;
}
export default function EigoMaster() {
  return /*#__PURE__*/<ErrorBoundary>{/*#__PURE__*/<EigoMasterInner />}</ErrorBoundary>;
}
