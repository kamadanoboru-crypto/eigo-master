// @ts-nocheck

import React from "react";
import { CoinCostLabel } from "../common";
import { YouTubeEmbed } from "../video/VideoPlayer";
import type { EigoMasterViewDeps } from "./viewTypes";
export function useStudyViews(deps: EigoMasterViewDeps) {
  const {
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
    buildWordPool,
    calcToeic,
    capIdx,
    caps,
    captionCache,
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
    saveGrammarAttempt,
    saveProfile,
    saved,
    wordBook,
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
    setVideoPage,
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
    startWordShooter,
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
  } = deps;
  const getStreakAffiliateService = () => {
    const streak = Number(streakStats?.streak || 0);
    if (![7, 30, 100].includes(streak)) return '';
    const key = `affiliate_streak_seen_${streak}`;
    try {
      if (typeof window !== 'undefined' && localStorage.getItem(key)) return '';
      if (typeof window !== 'undefined') localStorage.setItem(key, new Date().toISOString());
    } catch (e) {}
    return streak >= 30 ? 'cambly' : 'study_sapuri';
  };
  const elsaCard = {
    key: 'elsa',
    title: 'ELSA Speak',
    desc: '発音チェックとシャドーイング練習はELSAで行えます。',
    cta: 'ELSAを開く',
    emoji: '🎙️',
    color: '#059669',
    url: process.env.NEXT_PUBLIC_AFFILIATE_ELSA_URL || 'https://elsaspeak.com/'
  };
  const videoPageSize = 4;
  React.useEffect(() => {
    setVideoPage(0);
  }, [homeTab, setVideoPage]);
  React.useEffect(() => {
    setVideoPage(p => Math.min(p, Math.max(0, Math.ceil(dVids.length / videoPageSize) - 1)));
  }, [dVids.length, setVideoPage]);
  const Home = () => {
    const hasAiReady = dVids.some(v => captionCache[v.videoId] || STATIC_CAPTION_OVERRIDES[v.videoId]);
    const hasSaved = saved.length > 0;
    const totalVideoPages = Math.max(1, Math.ceil(dVids.length / videoPageSize));
    const safeVideoPage = Math.min(videoPage, totalVideoPages - 1);
    const pageVids = dVids.slice(safeVideoPage * videoPageSize, safeVideoPage * videoPageSize + videoPageSize);
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="tabs">{[["all", "\u5171\u6709\u52d5\u753b"], ["my", "MY\u30ea\u30b9\u30c8"], ["review", "\u5fa9\u7fd2"], ["add", "\u8ffd\u52a0"]].map((param, __idx) => {
          let [k, v] = param;
          return /*#__PURE__*/<div key={param?.id ?? __idx} className={"tab ".concat(homeTab === k ? "on" : "")} onClick={() => setHomeTab(k)}>{v}</div>;
        })}</div>}{homeTab === "add" && /*#__PURE__*/<div className="url-sec">{/*#__PURE__*/<div className="jp" style={{
          fontSize: 13,
          fontWeight: 800,
          color: "var(--t)",
          marginBottom: 8
        }}>動画を追加してAI字幕学習に変換</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 12,
          color: "var(--t2)",
          lineHeight: 1.7,
          background: "var(--bg)",
          border: "1px solid var(--bd)",
          borderRadius: "var(--rs)",
          padding: "10px 12px",
          marginBottom: 10
        }}>追加した動画と生成された学習データは、共有動画として他のユーザーにも表示されます。{/*#__PURE__*/<br />}共有動画の「いいね」「わるいね」は動画表示の優先度を調整するためのものです。動画や投稿者を本当に悪いと思って押す評価ではありません。</div>}{/*#__PURE__*/<div style={{
          background: "var(--sur)",
          border: "1px solid var(--bd)",
          borderRadius: "var(--r)",
          padding: "14px 16px",
          marginBottom: 10
        }}>{/*#__PURE__*/<div style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--t)",
            marginBottom: 6
          }}>YouTube動画を追加</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            color: "var(--t2)",
            lineHeight: 1.7
          }}>英語動画のURLを貼り付けると{/*#__PURE__*/<br />}AI字幕・対訳・単語学習が始まります</div>}</div>}{/*#__PURE__*/<div className="url-row">{/*#__PURE__*/<input className="url-inp" placeholder="YouTube URLを貼り付け" value={urlIn} onChange={e => setUrlIn(e.target.value)} onKeyDown={e => e.key === "Enter" && addUrl()} />}{/*#__PURE__*/<button className="bp" onClick={addUrl}>{"追加 (".concat(String.fromCodePoint(0x1FA99)).concat(COIN_COSTS.VIDEO_GENERATION, "コイン)")}</button>}</div>}{urlLd && /*#__PURE__*/<div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          background: "var(--pl)",
          borderRadius: "var(--rs)",
          marginTop: 8
        }}>{/*#__PURE__*/<div className="spin" />}{/*#__PURE__*/<span className="jp" style={{
            fontSize: 13,
            color: "var(--p)",
            fontWeight: 500
          }}>Loading video...</span>}</div>}</div>}{showInstall && /*#__PURE__*/<div className="install-banner">{/*#__PURE__*/<span style={{
          fontSize: 28,
          flexShrink: 0
        }}>📲</span>}{/*#__PURE__*/<div style={{
          flex: 1
        }}>{/*#__PURE__*/<div style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 2
          }}>ホーム画面に追加</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 11,
            color: "rgba(255,255,255,.7)"
          }}>オフラインでも使えるアプリとして追加</div>}</div>}{/*#__PURE__*/<button style={{
          border: "none",
          background: "rgba(255,255,255,.2)",
          color: "#fff",
          borderRadius: "var(--rs)",
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          flexShrink: 0
        }} onClick={async () => {
          deferredPrompt === null || deferredPrompt === void 0 ? void 0 : deferredPrompt.prompt();
          const r = await (deferredPrompt === null || deferredPrompt === void 0 ? void 0 : deferredPrompt.userChoice);
          setShowInstall(false);
          setDeferredPrompt(null);
        }}>追加</button>}{/*#__PURE__*/<button style={{
          border: "none",
          background: "none",
          color: "rgba(255,255,255,.5)",
          cursor: "pointer",
          padding: 4,
          flexShrink: 0
        }} onClick={() => setShowInstall(false)}>{I({
            n: "close",
            s: 16,
            c: "rgba(255,255,255,.5)"
          })}</button>}</div>}{showOnb && dVids.length === 0 && /*#__PURE__*/<div className="onb-card">{/*#__PURE__*/<div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12
        }}>{/*#__PURE__*/<div>{/*#__PURE__*/<div style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 2
            }}>Welcome to English Base! 🎓</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 12,
              color: "rgba(255,255,255,.8)"
            }}>まずはYouTube動画を追加してみよう</div>}</div>}{/*#__PURE__*/<button style={{
            border: "none",
            background: "rgba(255,255,255,.15)",
            color: "#fff",
            borderRadius: "50%",
            width: 24,
            height: 24,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }} onClick={dismissOnb}>{I({
              n: "close",
              s: 14,
              c: "#fff"
            })}</button>}</div>}{[{
          n: 1,
          icon: "🎬",
          text: "YouTube英語動画のURLを貼り付ける"
        }, {
          n: 2,
          icon: "🤖",
          text: "AIが字幕を解析・翻訳する"
        }, {
          n: 3,
          icon: "📖",
          text: "対訳で読みながら単語を保存"
        }, {
          n: 4,
          icon: "📝",
          text: "TOEIC形式の問題で腕試し"
        }, {
          n: 5,
          icon: "🎰",
          text: "ガチャでご褒美をゲット！"
        }].map((s, __idx) => /*#__PURE__*/<div key={s?.id ?? __idx} className="onb-step">{/*#__PURE__*/<div key={s?.id ?? __idx} className="onb-num">{s.n}</div>}{/*#__PURE__*/<span key={s?.id ?? __idx} style={{
            fontSize: 16
          }}>{s.icon}</span>}{/*#__PURE__*/<div key={s?.id ?? __idx} className="jp" style={{
            fontSize: 13,
            color: "rgba(255,255,255,.9)",
            fontWeight: 500
          }}>{s.text}</div>}</div>)}{/*#__PURE__*/<button className="bp" style={{
          width: "100%",
          marginTop: 14,
          background: "rgba(255,255,255,.2)",
          color: "#fff",
          fontSize: 13
        }} onClick={dismissOnb}>わかった！動画を追加する →</button>}</div>}{(streakStats.todayCount > 0 || streakStats.todayWords > 0) && /*#__PURE__*/<div style={{
        margin: "12px 16px 0",
        padding: "10px 14px",
        background: "var(--sur)",
        borderRadius: "var(--r)",
        boxShadow: "var(--sh)",
        display: "flex",
        gap: 16,
        alignItems: "center"
      }}>{streakStats.streak > 0 && /*#__PURE__*/<div style={{
          textAlign: "center"
        }}>{/*#__PURE__*/<div style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#F59E0B"
          }}>🔥{streakStats.streak}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 10,
            color: "var(--t3)"
          }}>連続日</div>}</div>}{/*#__PURE__*/<div style={{
          textAlign: "center"
        }}>{/*#__PURE__*/<div style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--p)"
          }}>{streakStats.todayCount}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 10,
            color: "var(--t3)"
          }}>今日の学習</div>}</div>}{streakStats.todayWords > 0 && /*#__PURE__*/<div style={{
          textAlign: "center"
        }}>{/*#__PURE__*/<div style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#10B981"
          }}>{streakStats.todayWords}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 10,
            color: "var(--t3)"
          }}>保存単語</div>}</div>}{/*#__PURE__*/<div style={{
          flex: 1,
          textAlign: "right"
        }}>{/*#__PURE__*/<div className="jp" style={{
            fontSize: 11,
            color: "var(--t3)"
          }}>{streakStats.streak >= 7 ? "🏆 1週間継続！" : streakStats.streak >= 3 ? "👏 いい調子！" : "💪 今日も学習"}</div>}</div>}</div>}{hasAiReady && hasSaved && /*#__PURE__*/<button className="next-action" onClick={() => setNavTab('learn')} style={{
        margin: "12px 16px 0",
        width: "calc(100% - 32px)"
        }}>{/*#__PURE__*/<span style={{
          fontSize: 22,
          flexShrink: 0
        }}>🎯</span>}{/*#__PURE__*/<div style={{
          flex: 1
        }}>{/*#__PURE__*/<div style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 1
          }}>Test your vocabulary</div>}{/*#__PURE__*/<div style={{
            fontSize: 11,
            color: "rgba(255,255,255,.8)"
          }}>保存単語{saved.length}語 → 単語テスト or Part5</div>}</div>}{/*#__PURE__*/<span style={{
          color: "rgba(255,255,255,.7)",
          fontSize: 20
        }}>›</span>}</button>}{dbLoading && SB_READY && /*#__PURE__*/<div style={{
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}>{[1, 2, 3].map((i, __idx) => /*#__PURE__*/<div key={i?.id ?? __idx} style={{
          height: 82,
          borderRadius: "var(--r)"
        }} className="skel" />)}</div>}{homeTab !== "add" && (!dbLoading && dVids.length === 0 ? /*#__PURE__*/<div className="empty">{/*#__PURE__*/<div style={{
          fontSize: 48,
          marginBottom: 12
        }}>🎬</div>}{/*#__PURE__*/<div style={{
          fontSize: 16,
          fontWeight: 700,
          color: "var(--t)",
          marginBottom: 6
        }}>まだ動画がありません</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 13,
          color: "var(--t2)",
          marginBottom: 16,
          lineHeight: 1.7
        }}>動画を追加すると、ここに表示されます。</div>}</div> : /*#__PURE__*/<div className="vlist">{pageVids.map((v, __idx) => {
          const thumbSrc = typeof v.thumbnail === 'string' && v.thumbnail.trim() ? v.thumbnail : DEFAULT_THUMBNAIL;
          return /*#__PURE__*/<button key={v?.id ?? __idx} className="vcard" onClick={() => goVideo(v)} aria-label={v.title}>{/*#__PURE__*/<div key={v?.id ?? __idx} className="vth">{/*#__PURE__*/<img key={v?.id ?? __idx} src={thumbSrc} alt="" onError={e => {
                const img = e.currentTarget;
                if (img.src !== DEFAULT_THUMBNAIL) img.src = DEFAULT_THUMBNAIL;
              }} />}{/*#__PURE__*/<div key={v?.id ?? __idx} className="vtho">{I({
                  n: "play",
                  s: 22,
                  c: "white"
                })}</div>}</div>}{/*#__PURE__*/<div key={v?.id ?? __idx} style={{
              flex: 1,
              minWidth: 0
            }}>{/*#__PURE__*/<div key={v?.id ?? __idx} style={{
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.4,
                marginBottom: 4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>{v.title}</div>}{/*#__PURE__*/<div key={v?.id ?? __idx} style={{
                fontSize: 11,
                color: "var(--t3)",
                marginBottom: 6
              }}>{v.channelTitle}</div>}{/*#__PURE__*/<div key={v?.id ?? __idx} style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                flexWrap: "wrap"
              }}>{captionCache[v.videoId] || STATIC_CAPTION_OVERRIDES[v.videoId] || v.aiReady ? /*#__PURE__*/<span key={v?.id ?? __idx} style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: "#D1FAE5",
                  color: "#059669"
                }}>✨ AI Ready</span> : proc.videoId === v.videoId && proc.active ? /*#__PURE__*/<span key={v?.id ?? __idx} style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: "var(--al)",
                  color: "#B45309"
                }}>⚙️ 処理中</span> : v.aiReady === false ? /*#__PURE__*/<span key={v?.id ?? __idx} style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: "#FEE2E2",
                  color: "#991B1B"
                }}>⚠️ 字幕未対応 (手動入力可)</span> : /*#__PURE__*/<span key={v?.id ?? __idx} style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: "var(--pl)",
                  color: "var(--p)"
                }}>Tap to study</span>}{v.shared && /*#__PURE__*/<span key={v?.id ?? __idx} className="jp" style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: "var(--pl)",
                  color: "var(--p)"
                }}>共有動画</span>}{myList.some(m => m.videoId === v.videoId) && /*#__PURE__*/<span key={v?.id ?? __idx} style={{
                  fontSize: 10,
                  color: "var(--a)",
                  fontWeight: 700
                }}>📌</span>}</div>}{homeTab === "all" && /*#__PURE__*/<div key={v?.id ?? __idx} style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                marginTop: 8
              }}>{/*#__PURE__*/<button key={v?.id ?? __idx} className="bg" style={{
                  fontSize: 11,
                  padding: "5px 8px",
                  borderColor: videoVotes[v.videoId] === 1 ? "var(--a)" : "var(--bd)"
                }} onClick={e => {
                  e.stopPropagation();
                  voteSharedVideo(v.videoId, 1);
                }}>👍 {v.likes || 0}</button>}{/*#__PURE__*/<button key={v?.id ?? __idx} className="bg" style={{
                  fontSize: 11,
                  padding: "5px 8px",
                  borderColor: videoVotes[v.videoId] === -1 ? "#FCA5A5" : "var(--bd)",
                  color: videoVotes[v.videoId] === -1 ? "#DC2626" : "var(--t)"
                }} onClick={e => {
                  e.stopPropagation();
                  voteSharedVideo(v.videoId, -1);
                }}>👎 {v.dislikes || 0}</button>}</div>}{proc.videoId === v.videoId && proc.active && /*#__PURE__*/<div key={v?.id ?? __idx} style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "var(--bd)",
                borderRadius: "0 0 var(--r) var(--r)",
                overflow: "hidden"
              }}>{/*#__PURE__*/<div key={v?.id ?? __idx} style={{
                  width: "".concat(proc.pct, "%"),
                  height: "100%",
                  background: "linear-gradient(90deg,var(--p),var(--a))",
                  transition: "width .4s ease"
                }} />}</div>}</div>}</button>;
        })}{dVids.length > videoPageSize && /*#__PURE__*/<div className="jp" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "4px 2px 2px"
        }}>{/*#__PURE__*/<button className="bg" style={{
            flex: 1,
            fontSize: 12
          }} disabled={safeVideoPage <= 0} onClick={() => setVideoPage(p => Math.max(0, p - 1))}>前へ</button>}{/*#__PURE__*/<span style={{
            fontSize: 12,
            color: "var(--t3)",
            whiteSpace: "nowrap"
          }}>{safeVideoPage * videoPageSize + 1}-{Math.min(dVids.length, safeVideoPage * videoPageSize + pageVids.length)} / {dVids.length}</span>}{/*#__PURE__*/<button className="bg" style={{
            flex: 1,
            fontSize: 12
          }} disabled={safeVideoPage >= totalVideoPages - 1} onClick={() => setVideoPage(p => Math.min(totalVideoPages - 1, p + 1))}>次へ</button>}</div>}</div>)}{/*#__PURE__*/<StudySapuriCard screenName="home" placement="home" variant="home" />}{(() => { const service = getStreakAffiliateService(); return service ? /*#__PURE__*/<StudySapuriCard screenName="streak" placement="streak" service={service} variant="trial" /> : null; })()}{/*#__PURE__*/<div className="divhr" />}{/*#__PURE__*/<div style={{
        margin: "0 16px 8px",
        background: "linear-gradient(135deg,#FFF7ED,#FFEDD5)",
        borderRadius: "var(--r)",
        padding: "14px 16px",
        border: "1.5px solid #FDE68A"
      }}>{/*#__PURE__*/<div style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#92400E",
          marginBottom: 4,
          fontFamily: "'Noto Sans JP'",
          textTransform: "uppercase",
          letterSpacing: .5
        }}>📖 おすすめ</div>}{/*#__PURE__*/<div style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--t)",
          marginBottom: 2
        }}>ランガク</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 12,
          color: "var(--t2)",
          marginBottom: 10,
          lineHeight: 1.6
        }}>集英社の英語学習マンガアプリ。マンガで楽しく英語が身につく！</div>}{/*#__PURE__*/<a href="https://langaku.app/" target="_blank" rel="noreferrer" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "8px 16px",
          background: "#F97316",
          color: "#fff",
          borderRadius: "var(--rs)",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: 13,
          fontFamily: "'Noto Sans JP'"
        }}>ランガクを見る {I({
            n: "extlnk",
            s: 14,
            c: "#fff"
          })}</a>}</div>}{/*#__PURE__*/<div className="bad-w">{/*#__PURE__*/<div className="bad-lbl">広告</div>}{/*#__PURE__*/<div className="bad">{/*#__PURE__*/<div>{/*#__PURE__*/<div style={{
              fontSize: 11.5,
              color: "#92400E",
              fontWeight: 600,
              fontFamily: "'Noto Sans JP'"
            }}>🎓 TOEIC 900点への最短ルート</div>}{/*#__PURE__*/<div style={{
              fontSize: 10,
              color: "#92400E",
              opacity: .7
            }}>スキマ時間で効率学習</div>}</div>}{/*#__PURE__*/<div style={{
            fontSize: 10,
            color: "#78350F",
            background: "rgba(255,255,255,.6)",
            padding: "4px 10px",
            borderRadius: 20,
            fontWeight: 700
          }}>詳細 ▶</div>}</div>}</div>}{/*#__PURE__*/<div style={{
        height: 16
      }} />}</div>;
  };
  // ── LEARN HUB ───────────────────────────────────────────────────
  const LearnHub = () => {
    const lw = TR.word.slice(-1)[0],
      lg = TR.grammar.slice(-1)[0],
      ll = TR.listening.slice(-1)[0];
    const pct = r => r ? "".concat(Math.round(r.correct / r.total * 100), "%") : null;
    const items = [{
      id: "wordTest",
      ico: "book",
      bg: "var(--pl)",
      ic: "var(--p)",
      title: "単語テスト",
      desc: "TOEIC頻出単語 10問4択",
      btext: pct(lw) || "NEW",
      bcls: lw ? lw.correct / lw.total >= .7 ? "lbd" : "lbs" : "lbn"
    }, {
      id: "grammarTest",
      ico: "info",
      bg: "var(--al)",
      ic: "var(--a)",
      title: "文法 Part5",
      desc: "穴埋め4択・解説付き 10問",
      btext: pct(lg) || "NEW",
      bcls: lg ? lg.correct / lg.total >= .7 ? "lbd" : "lbs" : "lbn"
    }, {
      id: "listeningTest",
      ico: "ear",
      bg: "#FFF7ED",
      ic: "#C2410C",
      title: "リスニング",
      desc: "音声再生→意味4択 10問",
      btext: pct(ll) || "NEW",
      bcls: ll ? ll.correct / ll.total >= .7 ? "lbd" : "lbs" : "lbn"
    }, {
      id: "shadow",
      ico: "mic",
      bg: "#F0FDF4",
      ic: "#059669",
      title: "シャドーイング",
      desc: "発音練習はELSA Speakで行います",
      btext: "ELSA",
      bcls: "lbs"
    }, {
      id: "shooter",
      ico: "play",
      bg: "#183153",
      ic: "#F5E2B7",
      title: "単語シューティング",
      desc: "落ちてくる英単語を撃破！HP制+スキル",
      btext: "NEW",
      bcls: "lbn"
    }, {
      id: "analysis",
      ico: "pie",
      bg: "#FFF1F2",
      ic: "#BE185D",
      title: "成績分析",
      desc: "TOEIC予想 ".concat(toeic, "点"),
      btext: "→",
      bcls: "lbn"
    }];
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="lhub">{/*#__PURE__*/<div className="lsec">📺 動画</div>}{/*#__PURE__*/<button className="lcard" onClick={() => setScreen("videoLibrary")}>{/*#__PURE__*/<div className="lcard-ico" style={{
            background: "#F0F9FF"
          }}>{I({
              n: "vid",
              s: 22,
              c: "#0369A1"
            })}</div>}{/*#__PURE__*/<div style={{
            flex: 1
          }}>{/*#__PURE__*/<div className="lcard-t">動画学習</div>}{/*#__PURE__*/<div className="lcard-d">YouTubeで語順理解トレーニング</div>}</div>}{I({
            n: "chR",
            s: 18,
            c: "var(--t3)"
          })}</button>}{/*#__PURE__*/<button className="lcard" onClick={() => setScreen("wordBook")}>{/*#__PURE__*/<div className="lcard-ico" style={{
            background: "#FFFBEB"
          }}>📒</div>}{/*#__PURE__*/<div style={{
            flex: 1,
            minWidth: 0,
            paddingRight: 64
          }}>{/*#__PURE__*/<div className="lcard-t">単語帳</div>}{/*#__PURE__*/<div className="lcard-d">確認した単語の意味を復習</div>}</div>}{/*#__PURE__*/<span className="lbdg lbs">{(wordBook || []).length}語</span>}</button>}{/*#__PURE__*/<div className="lsec" style={{
          marginTop: 4
        }}>📝 テスト・学習</div>}{items.map((it, __idx) => /*#__PURE__*/<button key={it?.id ?? __idx} className="lcard" onClick={() => it.id === "grammarTest" ? openGrammarHub() : it.id === "wordTest" ? setScreen("wordHub") : it.id === "listeningTest" ? setScreen("listeningHub") : it.id === "shooter" ? setScreen("shooterHub") : it.id === "shadow" ? openAffiliateOffer(elsaCard) : it.id === "analysis" ? setScreen("analysis") : startTest(it.id)}>{/*#__PURE__*/<div key={it?.id ?? __idx} className="lcard-ico" style={{
            background: it.bg
          }}>{I({
              n: it.ico,
              s: 22,
              c: it.ic
            })}</div>}{/*#__PURE__*/<div key={it?.id ?? __idx} style={{
            flex: 1,
            minWidth: 0,
            paddingRight: 64
          }}>{/*#__PURE__*/<div key={it?.id ?? __idx} className="lcard-t">{it.title}</div>}{/*#__PURE__*/<div key={it?.id ?? __idx} className="lcard-d">{it.desc}</div>}</div>}{/*#__PURE__*/<span key={it?.id ?? __idx} className={"lbdg ".concat(it.bcls)}>{it.btext}</span>}</button>)}{/*#__PURE__*/<div style={{
          background: "var(--sur)",
          borderRadius: "var(--r)",
          padding: "14px 16px",
          boxShadow: "var(--sh)"
        }}>{/*#__PURE__*/<div style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--t2)",
            marginBottom: 10,
            fontFamily: "'Noto Sans JP'"
          }}>📊 現在の実力</div>}{/*#__PURE__*/<div style={{
            display: "flex",
            justifyContent: "space-around"
          }}>{[{
              label: "TOEIC予想",
              val: toeic,
              unit: "点",
              c: "var(--p)"
            }, {
              label: "レベル",
              val: spLv.grade,
              c: spLv.color,
              text: true
            }, {
              label: "ポイント",
              val: pts,
              unit: "pt",
              c: "var(--a)"
            }].map((param, __idx) => {
              let {
                label,
                val,
                unit = "",
                c,
                text
              } = param;
              return /*#__PURE__*/<div key={param?.id ?? __idx} style={{
                textAlign: "center"
              }}>{/*#__PURE__*/<div key={param?.id ?? __idx} style={{
                  fontSize: text ? 20 : 22,
                  fontWeight: 700,
                  color: c
                }}>{val}{!text && unit}</div>}{/*#__PURE__*/<div key={param?.id ?? __idx} style={{
                  fontSize: 11,
                  color: "var(--t3)",
                  fontFamily: "'Noto Sans JP'"
                }}>{label}</div>}</div>;
            })}</div>}</div>}</div>}{/*#__PURE__*/<div style={{
        height: 20
      }} />}</div>;
  };
  const StudyHub = param => {
    let {
      kind
    } = param;
    const latest = kind === 'word' ? TR.word.slice(-1)[0] : kind === 'listening' ? TR.listening.slice(-1)[0] : null;
    var _latest_correct;
    const correct = (_latest_correct = latest === null || latest === void 0 ? void 0 : latest.correct) !== null && _latest_correct !== void 0 ? _latest_correct : 0;
    const misses = latest ? Math.max(0, latest.total - latest.correct) : 0;
    const isWord = kind === 'word';
    const isListening = kind === 'listening';
    const title = isWord ? '単語テスト' : isListening ? 'リスニング' : '単語シューティング';
    const desc = isWord ? 'TOEIC頻出単語を練習し、テストでは過去の正解・ミス・新規問題を混ぜて出題します。' : isListening ? '音声を聞いて意味を選ぶ練習をします。テストでは過去のミスと新規問題を混ぜて出題します。' : '落ちてくる英単語を撃ち落としながら、語彙力と瞬間反応を鍛えます。';
    const generatedRows = Array.isArray(generatedQuestionBank[kind]) ? generatedQuestionBank[kind] : [];
    const baseRows = isWord ? WORDS.map((w, i) => ({
      no: i + 1,
      key: "word:".concat(w.id),
      main: w.word,
      sub: "".concat(w.meaning, " / ").concat(w.pos),
      raw: w
    })) : isListening ? LISTENING.map((q, i) => ({
      no: i + 1,
      key: "listening:".concat(q.id || i),
      main: q.en,
      sub: q.jp,
      raw: q
    })) : buildWordPool().map((w, i) => ({
      no: i + 1,
      key: "shooter:".concat(w.en),
      main: w.en,
      sub: w.jp,
      raw: w
    }));
    const generatedListRows = generatedRows.map((q, i) => {
      var _q_word;
      const main = isListening ? q.en : (_q_word = q.word) !== null && _q_word !== void 0 ? _q_word : q.en;
      var _q_meaning;
      const sub = isListening ? q.jp : (_q_meaning = q.meaning) !== null && _q_meaning !== void 0 ? _q_meaning : q.jp;
      return {
        no: baseRows.length + i + 1,
        key: "".concat(kind, ":generated:").concat(main),
        main,
        sub,
        raw: q
      };
    }).filter(row => row.main && row.sub);
    const seenStudyRows = new Set();
    const allRows = [...generatedListRows, ...baseRows].filter(row => {
      const identity = "".concat(kind, ":").concat(row.main);
      if (seenStudyRows.has(identity)) return false;
      seenStudyRows.add(identity);
      return true;
    }).map((row, i) => ({
      ...row,
      no: i + 1
    }));
    const sortedRows = [...allRows].sort((a, b) => {
      var _studyVotes_a_key;
      const av = (_studyVotes_a_key = studyVotes[a.key]) !== null && _studyVotes_a_key !== void 0 ? _studyVotes_a_key : 0;
      var _studyVotes_b_key;
      const bv = (_studyVotes_b_key = studyVotes[b.key]) !== null && _studyVotes_b_key !== void 0 ? _studyVotes_b_key : 0;
      if (bv !== av) return bv - av;
      return b.no - a.no;
    }).map((row, i) => ({
      ...row,
      displayNo: i + 1
    }));
    const pageSize = 10;
    var _studyHubPages_kind;
    const currentPage = (_studyHubPages_kind = studyHubPages[kind]) !== null && _studyHubPages_kind !== void 0 ? _studyHubPages_kind : 0;
    const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
    const safePage = Math.min(currentPage, totalPages - 1);
    const rows = sortedRows.slice(safePage * pageSize, safePage * pageSize + pageSize);
    const registered = allRows.length;
    const startPractice = () => kind === 'shooter' ? startWordShooter('practice') : startTest(kind === 'word' ? 'wordTest' : 'listeningTest', 'practice');
    const startMain = () => kind === 'shooter' ? startWordShooter('test') : startTest(kind === 'word' ? 'wordTest' : 'listeningTest', 'test');
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="lhub">{/*#__PURE__*/<div style={{
          background: "rgba(255,253,248,.9)",
          border: "1px solid rgba(222,214,200,.82)",
          borderRadius: "var(--r)",
          padding: "18px",
          boxShadow: "var(--sh)"
        }}>{/*#__PURE__*/<div style={{
            fontSize: 20,
            fontWeight: 800,
            color: "var(--t)",
            marginBottom: 6
          }}>{title}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            color: "var(--t2)",
            lineHeight: 1.7
          }}>{desc}</div>}{/*#__PURE__*/<div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 14
          }}>{/*#__PURE__*/<button className="bg" onClick={startPractice}>{/*#__PURE__*/<CoinCostLabel coins={COIN_COSTS.PRACTICE}>練習する</CoinCostLabel>}</button>}{/*#__PURE__*/<button className="bp" onClick={startMain}>{/*#__PURE__*/<CoinCostLabel coins={COIN_COSTS.TEST}>テスト開始</CoinCostLabel>}</button>}</div>}</div>}{/*#__PURE__*/<div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8
        }}>{/*#__PURE__*/<div className="sc" style={{
            margin: 0,
            textAlign: "center"
          }}>{/*#__PURE__*/<div style={{
              fontSize: 20,
              fontWeight: 800,
              color: "var(--p)"
            }}>{registered}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: "var(--t3)"
            }}>登録数</div>}</div>}{/*#__PURE__*/<div className="sc" style={{
            margin: 0,
            textAlign: "center"
          }}>{/*#__PURE__*/<div style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#059669"
            }}>{correct}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: "var(--t3)"
            }}>直近正解</div>}</div>}{/*#__PURE__*/<div className="sc" style={{
            margin: 0,
            textAlign: "center"
          }}>{/*#__PURE__*/<div style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#C2410C"
            }}>{misses}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: "var(--t3)"
            }}>直近ミス</div>}</div>}</div>}{/*#__PURE__*/<div className="lsec">{kind === 'shooter' ? '練習単語一覧' : '問題一覧'}</div>}{allRows.length > 0 && /*#__PURE__*/<div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          background: "var(--bg)",
          border: "1px solid var(--bd)",
          borderRadius: 8,
          padding: "10px 12px"
        }}>{/*#__PURE__*/<button className="bg" style={{
            fontSize: 12,
            padding: "7px 10px"
          }} disabled={safePage <= 0} onClick={() => setStudyHubPages(p => ({
            ...p,
            [kind]: Math.max(0, safePage - 1)
          }))}>戻る</button>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            fontWeight: 800,
            color: "var(--t2)",
            textAlign: "center"
          }}>{safePage + 1} / {totalPages} ページ{/*#__PURE__*/<br />}{/*#__PURE__*/<span style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--t3)"
            }}>No.{safePage * pageSize + 1}〜No.{Math.min(allRows.length, safePage * pageSize + pageSize)}</span>}</div>}{/*#__PURE__*/<button className="bg" style={{
            fontSize: 12,
            padding: "7px 10px"
          }} disabled={safePage >= totalPages - 1} onClick={() => setStudyHubPages(p => ({
            ...p,
            [kind]: Math.min(totalPages - 1, safePage + 1)
          }))}>次へ</button>}</div>}{rows.length === 0 ? /*#__PURE__*/<div className="jp" style={{
          padding: 20,
          textAlign: "center",
          color: "var(--t3)"
        }}>まだ表示できる問題がありません。</div> : rows.map((row, __idx) => /*#__PURE__*/<div key={row?.id ?? __idx} className="lcard" style={{
          cursor: isWord || isListening ? "pointer" : "default"
        }} onClick={() => {
          if (isWord) startSingleStudyQuestion('word', row.raw);
          if (isListening) startSingleStudyQuestion('listening', row.raw);
        }}>{/*#__PURE__*/<div key={row?.id ?? __idx} style={{
            width: 42,
            height: 42,
            borderRadius: 8,
            background: "var(--pl)",
            color: "var(--p)",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>{row.no}</div>}{/*#__PURE__*/<div key={row?.id ?? __idx} style={{
            flex: 1,
            minWidth: 0
          }}>{/*#__PURE__*/<div key={row?.id ?? __idx} style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--t)",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>{row.main}</div>}{/*#__PURE__*/<div key={row?.id ?? __idx} className="jp" style={{
              fontSize: 12,
              color: "var(--t3)",
              marginTop: 3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>{row.sub}</div>}{(isWord || isListening) && /*#__PURE__*/<div key={row?.id ?? __idx} className="jp" style={{
              fontSize: 10,
              color: "var(--t3)",
              marginTop: 4
            }}>タップで1問だけ練習</div>}</div>}{(isWord || isListening) && /*#__PURE__*/<div key={row?.id ?? __idx} style={{
            display: "flex",
            gap: 5,
            flexShrink: 0
          }} onClick={e => e.stopPropagation()}>{/*#__PURE__*/<button key={row?.id ?? __idx} className="bg" style={{
              fontSize: 12,
              padding: "6px 8px",
              borderColor: studyVotes[row.key] === 1 ? "var(--a)" : "var(--bd)"
            }} onClick={() => voteStudyItem(row.key, 1)}>👍</button>}{/*#__PURE__*/<button key={row?.id ?? __idx} className="bg" style={{
              fontSize: 12,
              padding: "6px 8px",
              borderColor: studyVotes[row.key] === -1 ? "#FCA5A5" : "var(--bd)",
              color: studyVotes[row.key] === -1 ? "#DC2626" : "var(--t)"
            }} onClick={() => voteStudyItem(row.key, -1)}>👎</button>}</div>}</div>)}</div>}</div>;
  };
  // ── QUIZ ────────────────────────────────────────────────────────
  const GrammarHub = () => {
    const done = grammarList.filter(q => q.userStats).length;
    const correct = grammarList.filter(q => {
      var _q_userStats;
      return (_q_userStats = q.userStats) === null || _q_userStats === void 0 ? void 0 : _q_userStats.lastCorrect;
    }).length;
    const sortedGrammarList = [...grammarList].sort((a, b) => {
      var _a_quality, _b_quality, _a_quality1, _b_quality1;
      var _a_quality_likes;
      const aLikes = Number((_a_quality_likes = (_a_quality = a.quality) === null || _a_quality === void 0 ? void 0 : _a_quality.likes) !== null && _a_quality_likes !== void 0 ? _a_quality_likes : 0);
      var _b_quality_likes;
      const bLikes = Number((_b_quality_likes = (_b_quality = b.quality) === null || _b_quality === void 0 ? void 0 : _b_quality.likes) !== null && _b_quality_likes !== void 0 ? _b_quality_likes : 0);
      if (bLikes !== aLikes) return bLikes - aLikes;
      var _a_quality_dislikes;
      const aDislikes = Number((_a_quality_dislikes = (_a_quality1 = a.quality) === null || _a_quality1 === void 0 ? void 0 : _a_quality1.dislikes) !== null && _a_quality_dislikes !== void 0 ? _a_quality_dislikes : 0);
      var _b_quality_dislikes;
      const bDislikes = Number((_b_quality_dislikes = (_b_quality1 = b.quality) === null || _b_quality1 === void 0 ? void 0 : _b_quality1.dislikes) !== null && _b_quality_dislikes !== void 0 ? _b_quality_dislikes : 0);
      if (aDislikes !== bDislikes) return aDislikes - bDislikes;
      const aDate = new Date(a.created_at || a.updated_at || 0).getTime();
      const bDate = new Date(b.created_at || b.updated_at || 0).getTime();
      if (bDate !== aDate) return bDate - aDate;
      var _a_no, _b_no;
      return Number((_a_no = a.no) !== null && _a_no !== void 0 ? _a_no : 0) - Number((_b_no = b.no) !== null && _b_no !== void 0 ? _b_no : 0);
    });
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(sortedGrammarList.length / pageSize));
    const safePage = Math.min(grammarListPage, totalPages - 1);
    const pageRows = sortedGrammarList.slice(safePage * pageSize, safePage * pageSize + pageSize);
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="lhub">{/*#__PURE__*/<div style={{
          background: "#fff",
          border: "1px solid var(--bd)",
          borderRadius: 8,
          padding: "16px",
          boxShadow: "var(--sh)"
        }}>{/*#__PURE__*/<div style={{
            fontSize: 20,
            fontWeight: 800,
            color: "var(--t)",
            marginBottom: 6
          }}>TOEIC Part5</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            color: "var(--t2)",
            lineHeight: 1.7
          }}>DBにたまった問題を練習し、テストでは過去の正解・ミス・新規生成を混ぜて出題します。</div>}{/*#__PURE__*/<div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 14
          }}>{/*#__PURE__*/<button className="bg" onClick={() => startGrammarPractice()}>{/*#__PURE__*/<CoinCostLabel coins={COIN_COSTS.PRACTICE}>練習する</CoinCostLabel>}</button>}{/*#__PURE__*/<button className="bp" onClick={startGrammarDbTest}>{/*#__PURE__*/<CoinCostLabel coins={COIN_COSTS.TEST}>テスト開始</CoinCostLabel>}</button>}</div>}</div>}{/*#__PURE__*/<div style={{
          background: "#fff",
          border: "1px solid var(--bd)",
          borderRadius: 8,
          padding: "12px 14px",
          boxShadow: "var(--sh)",
          display: "flex",
          gap: 10,
          alignItems: "center"
        }}>{/*#__PURE__*/<img src={RAKUTEN_TOEIC_OFFICIAL_IMAGE} alt="" width={48} height={48} style={{
            borderRadius: 6,
            objectFit: "cover",
            border: "1px solid var(--bd)",
            flexShrink: 0
          }} />}{/*#__PURE__*/<div style={{
            flex: 1,
            minWidth: 0
          }}>{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--t3)",
              marginBottom: 2
            }}>本番形式も確認したい人へ</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--t)",
              lineHeight: 1.35
            }}>TOEIC公式問題集 12</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: "var(--t3)",
              lineHeight: 1.5
            }}>アプリ練習の仕上げに、紙の模試で時間配分を確認できます。</div>}</div>}{/*#__PURE__*/<a href={RAKUTEN_TOEIC_OFFICIAL_URL} target="_blank" rel="nofollow sponsored noopener noreferrer" onClick={() => logAffiliateClick('rakuten-toeic-official-12', 'TOEIC公式問題集 12', toeic)} className="bg" style={{
            fontSize: 12,
            padding: "7px 10px",
            textDecoration: "none",
            whiteSpace: "nowrap"
          }}>見る</a>}</div>}{/*#__PURE__*/<div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8
        }}>{/*#__PURE__*/<div className="sc" style={{
            margin: 0,
            textAlign: "center"
          }}>{/*#__PURE__*/<div style={{
              fontSize: 20,
              fontWeight: 800,
              color: "var(--p)"
            }}>{grammarList.length}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: "var(--t3)"
            }}>登録問題</div>}</div>}{/*#__PURE__*/<div className="sc" style={{
            margin: 0,
            textAlign: "center"
          }}>{/*#__PURE__*/<div style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#059669"
            }}>{correct}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: "var(--t3)"
            }}>直近正解</div>}</div>}{/*#__PURE__*/<div className="sc" style={{
            margin: 0,
            textAlign: "center"
          }}>{/*#__PURE__*/<div style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#C2410C"
            }}>{Math.max(0, done - correct)}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: "var(--t3)"
            }}>直近ミス</div>}</div>}</div>}{/*#__PURE__*/<div className="lsec">問題一覧</div>}{grammarListLoading && /*#__PURE__*/<div className="jp" style={{
          padding: 20,
          textAlign: "center",
          color: "var(--t3)"
        }}>読み込み中...</div>}{!grammarListLoading && grammarList.length === 0 && /*#__PURE__*/<div className="jp" style={{
          padding: 20,
          textAlign: "center",
          color: "var(--t3)"
        }}>Supabaseから問題を取得できませんでした。テスト開始で予備問題を使います。</div>}{!grammarListLoading && grammarList.length > 0 && /*#__PURE__*/<div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          background: "var(--bg)",
          border: "1px solid var(--bd)",
          borderRadius: 8,
          padding: "10px 12px"
        }}>{/*#__PURE__*/<button className="bg" style={{
            fontSize: 12,
            padding: "7px 10px"
          }} disabled={safePage <= 0} onClick={() => setGrammarListPage(p => Math.max(0, p - 1))}>戻る</button>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            fontWeight: 800,
            color: "var(--t2)",
            textAlign: "center"
          }}>{safePage + 1} / {totalPages} ページ{/*#__PURE__*/<br />}{/*#__PURE__*/<span style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--t3)"
            }}>No.{safePage * pageSize + 1}〜No.{Math.min(sortedGrammarList.length, safePage * pageSize + pageSize)}</span>}</div>}{/*#__PURE__*/<button className="bg" style={{
            fontSize: 12,
            padding: "7px 10px"
          }} disabled={safePage >= totalPages - 1} onClick={() => setGrammarListPage(p => Math.min(totalPages - 1, p + 1))}>次へ</button>}</div>}{pageRows.map((q, __idx) => {
          var _q_userStats, _q_userStats1, _q_userStats2, _q_userStats3, _q_quality, _q_quality1;
          const mark = ((_q_userStats = q.userStats) === null || _q_userStats === void 0 ? void 0 : _q_userStats.lastCorrect) === true ? "○" : ((_q_userStats1 = q.userStats) === null || _q_userStats1 === void 0 ? void 0 : _q_userStats1.lastCorrect) === false ? "×" : "未";
          const color = ((_q_userStats2 = q.userStats) === null || _q_userStats2 === void 0 ? void 0 : _q_userStats2.lastCorrect) === true ? "#059669" : ((_q_userStats3 = q.userStats) === null || _q_userStats3 === void 0 ? void 0 : _q_userStats3.lastCorrect) === false ? "#DC2626" : "#94A3B8";
          var _q_no, _q_quality_likes, _q_quality_dislikes;
          return /*#__PURE__*/<button key={q?.id ?? __idx} className="lcard" onClick={() => startGrammarPractice(q.id, {
            free: true,
            single: true
          })}>{/*#__PURE__*/<div key={q?.id ?? __idx} style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: color + "15",
              color,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>{mark}</div>}{/*#__PURE__*/<div key={q?.id ?? __idx} style={{
              flex: 1,
              minWidth: 0
            }}>{/*#__PURE__*/<div key={q?.id ?? __idx} style={{
                fontSize: 12,
                color: "var(--t3)",
                fontWeight: 700
              }}>No.{(_q_no = q.no) !== null && _q_no !== void 0 ? _q_no : "-"}</div>}{/*#__PURE__*/<div key={q?.id ?? __idx} style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--t)",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>{formatPart5Sentence(q.s)}</div>}{/*#__PURE__*/<div key={q?.id ?? __idx} style={{
                fontSize: 11,
                color: "var(--t3)",
                marginTop: 4
              }}>👍 {(_q_quality_likes = (_q_quality = q.quality) === null || _q_quality === void 0 ? void 0 : _q_quality.likes) !== null && _q_quality_likes !== void 0 ? _q_quality_likes : 0}　👎 {(_q_quality_dislikes = (_q_quality1 = q.quality) === null || _q_quality1 === void 0 ? void 0 : _q_quality1.dislikes) !== null && _q_quality_dislikes !== void 0 ? _q_quality_dislikes : 0}</div>}</div>}{I({
              n: "chR",
              s: 18,
              c: "var(--t3)"
            })}</button>;
        })}</div>}</div>;
  };
  const Quiz = () => {
    var _q_quality, _q_quality1, _q_quality2, _q_quality3, _q_quality4, _q_topExplanation, _q_myExplanation;
    // 問題生成中のローディング表示
    if (!tQs.length && tPh === 'quiz') return /*#__PURE__*/<div className="sa" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      gap: 16,
      padding: 40
    }}>{/*#__PURE__*/<div className="spin" style={{
        width: 32,
        height: 32,
        borderWidth: 3
      }} />}{/*#__PURE__*/<div className="jp" style={{
        fontSize: 14,
        color: "var(--t3)"
      }}>問題を生成中です...</div>}{/*#__PURE__*/<div className="jp" style={{
        fontSize: 12,
        color: "var(--t3)"
      }}>保存済みの英文からAIが作成しています</div>}</div>;
    if (!tQs.length) return null;
    if (tPh === "result") return /*#__PURE__*/<Result />;
    const q = tQs[tIdx];
    const isW = screen === "wordTest",
      isG = screen === "grammarTest",
      isL = screen === "listeningTest";
    const answered = tSel !== null;
    const progress = tIdx / tQs.length * 100;
    const grammarOptionJapanese = {
      postponed: '延期された',
      postponing: '延期すること',
      postpone: '延期する',
      postponement: '延期',
      by: 'までに',
      until: 'までずっと',
      since: '以来',
      for: 'の間 / のために',
      submit: '提出する',
      submitting: '提出すること',
      submitted: '提出された',
      submission: '提出 / 提出物',
      effect: '効果 / 発効',
      affect: '影響する',
      effort: '努力',
      efficiency: '効率',
      Despite: 'にもかかわらず',
      Although: 'だけれども',
      However: 'しかしながら',
      Because: 'なぜなら',
      Unless: 'でない限り',
      unless: 'でない限り',
      if: 'もしなら',
      while: '一方で / 間に',
      of: 'の',
      to: 'へ / に',
      at: 'で / に',
      Having: '持っていること / 完了分詞',
      'After having': 'したあとで',
      'To have': '持つために',
      Have: '持つ',
      'have risen': '上昇している',
      'are risen': '上昇されている',
      risen: 'riseの過去分詞',
      rising: '上昇している',
      Most: 'ほとんどの',
      Almost: 'ほとんど',
      Mostly: '主に',
      'The most': '最も',
      hire: '雇う',
      hiring: '雇用すること',
      hired: '雇われた',
      hires: '雇う（三単現）',
      'provided that': 'もしなら / という条件で',
      'in spite of': 'にもかかわらず',
      'due to': 'が原因で',
      'regardless of': 'に関係なく',
      unanimously: '満場一致で',
      ambiguously: '曖昧に',
      tentatively: '暫定的に',
      separately: '別々に',
      revise: '修正する',
      revising: '修正すること',
      revised: '修正された',
      revision: '修正 / 改訂',
      when: 'するとき',
      during: 'の間に',
      with: 'と一緒に / で',
      from: 'から',
      review: '確認する',
      reviewed: '確認された',
      reviewing: '確認すること',
      'to review': '確認するために',
      secure: '安全な',
      secures: '安全にする',
      securely: '安全に',
      security: '安全 / 警備',
      earlier: 'より早く',
      early: '早い',
      earliest: '最も早い',
      earliness: '早さ',
      immediately: 'すぐに',
      immediate: '即時の',
      immediacy: '即時性',
      'more immediate': 'より即時の'
    };
    const optionStudyLabel = opt => {
      if (!answered) return '';
      if (isW) {
        var _q_word, _q_en;
        const wordRows = [
          { word: (_q_word = q.word) !== null && _q_word !== void 0 ? _q_word : q.en, meaning: q.meaning || q.correct },
          ...WORDS
        ];
        const found = wordRows.find(w => String(w.meaning || '').trim() === String(opt).trim());
      return found === null || found === void 0 ? void 0 : found.word;
      }
      if (isG) {
        var _q_optionMeanings, _q_optionMeanings_opt, _q_optionMeanings1, _q_optionMeanings1_opt;
        const mapped = (_q_optionMeanings_opt = (_q_optionMeanings = q.optionMeanings) === null || _q_optionMeanings === void 0 ? void 0 : _q_optionMeanings[opt]) !== null && _q_optionMeanings_opt !== void 0 ? _q_optionMeanings_opt : (_q_optionMeanings1_opt = (_q_optionMeanings1 = q.option_meanings) === null || _q_optionMeanings1 === void 0 ? void 0 : _q_optionMeanings1[opt]) !== null && _q_optionMeanings1_opt !== void 0 ? _q_optionMeanings1_opt : grammarOptionJapanese[opt];
        if (mapped) return mapped;
        const lower = String(opt).toLowerCase();
        if (/ly$/.test(lower)) return '副詞形';
        if (/(tion|ment|ness|ity)$/.test(lower)) return '名詞形';
        if (/ing$/.test(lower)) return '動名詞 / 現在分詞';
        if (/ed$/.test(lower)) return '過去形 / 過去分詞';
        if (/^to\s+/.test(lower)) return 'to不定詞';
        return '';
      }
      return '';
    };
    var _q_quality_likes, _q_quality_dislikes, _q_topExplanation_likes, _ref, _q_topExplanation_dislikes;
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="tscr">{/*#__PURE__*/<div className="tpb-w">{/*#__PURE__*/<div className="tpb" style={{
            width: "".concat(progress, "%")
          }} />}</div>}{/*#__PURE__*/<div className="tqn">{/*#__PURE__*/<span className="jp">{tIdx + 1} / {tQs.length} 問</span>}{isG && q.cat && /*#__PURE__*/<span className="tcbdg">{q.cat}</span>}{isW && q.pos && /*#__PURE__*/<span className="tcbdg">{q.pos}</span>}</div>}{isW && /*#__PURE__*/<>{/*#__PURE__*/<div className="tword">{q.word}</div>}{/*#__PURE__*/<div className="tpos">{q.pos}</div>}{/*#__PURE__*/<button className="bg" style={{
            margin: "0 auto 14px",
            padding: "8px 12px",
            fontSize: 12,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6
          }} onClick={() => speak(q.word)}>{I({
              n: "vol",
              s: 14,
              c: "var(--p)"
            })}{/*#__PURE__*/<span className="jp">読み上げ</span>}</button>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            color: "var(--t2)",
            marginBottom: 16,
            textAlign: "center"
          }}>正しい意味を選んでください</div>}</>}{isG && /*#__PURE__*/<>{/*#__PURE__*/<div className="tq">{formatPart5Sentence(q.s)}</div>}{/*#__PURE__*/<button className="bg" style={{
            margin: "0 auto 14px",
            padding: "8px 12px",
            fontSize: 12,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6
          }} onClick={() => speak(String(q.s || '').replace(/_{3,}/g, ' blank '))}>{I({
              n: "vol",
              s: 14,
              c: "var(--p)"
            })}{/*#__PURE__*/<span className="jp">英文を聞く</span>}</button>}</>}{isG && grammarMode === 'practice' && /*#__PURE__*/<div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          margin: "0 0 14px",
          padding: "10px 12px",
          background: "var(--bg)",
          border: "1px solid var(--bd)",
          borderRadius: 8
        }}>{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            color: "var(--t2)"
          }}>この問題の品質</div>}{/*#__PURE__*/<div style={{
            display: "flex",
            gap: 8
          }}>{/*#__PURE__*/<button className="bg" style={{
              padding: "7px 10px",
              fontSize: 12,
              borderColor: ((_q_quality = q.quality) === null || _q_quality === void 0 ? void 0 : _q_quality.myVote) === 1 ? "var(--a)" : "var(--bd)"
            }} onClick={() => voteGrammarQuestion(q, 1)}>👍 {(_q_quality_likes = (_q_quality1 = q.quality) === null || _q_quality1 === void 0 ? void 0 : _q_quality1.likes) !== null && _q_quality_likes !== void 0 ? _q_quality_likes : 0}</button>}{/*#__PURE__*/<button className="bg" style={{
              padding: "7px 10px",
              fontSize: 12,
              borderColor: ((_q_quality2 = q.quality) === null || _q_quality2 === void 0 ? void 0 : _q_quality2.myVote) === -1 ? "#FCA5A5" : "var(--bd)",
              color: ((_q_quality3 = q.quality) === null || _q_quality3 === void 0 ? void 0 : _q_quality3.myVote) === -1 ? "#DC2626" : "var(--t)"
            }} onClick={() => voteGrammarQuestion(q, -1)}>👎 {(_q_quality_dislikes = (_q_quality4 = q.quality) === null || _q_quality4 === void 0 ? void 0 : _q_quality4.dislikes) !== null && _q_quality_dislikes !== void 0 ? _q_quality_dislikes : 0}</button>}</div>}</div>}{isL && /*#__PURE__*/<>{/*#__PURE__*/<div className="lplay">{/*#__PURE__*/<button className={"pbl".concat(play ? " on" : "")} onClick={() => speak(q.en)}>{I({
                n: "vol",
                s: 30,
                c: "white"
              })}</button>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 12,
              color: "var(--t3)"
            }}>タップして英文を再生</div>}{lisN > 0 && /*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: "var(--p)",
              fontWeight: 600,
              background: "var(--pl)",
              padding: "3px 10px",
              borderRadius: 10
            }}>再生{lisN}回 · もう一度聴けます</div>}</div>}{answered && /*#__PURE__*/<div className="lrev">{/*#__PURE__*/<div style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--t)",
              marginBottom: 4
            }}>{q.en}</div>}{/*#__PURE__*/<div style={{
              fontSize: 13,
              color: "var(--t2)",
              fontFamily: "'Noto Sans JP'"
            }}>{q.jp}</div>}</div>}{!answered && /*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            color: "var(--t2)",
            marginBottom: 14,
            textAlign: "center"
          }}>意味を選んでください</div>}</>}{/*#__PURE__*/<div className="opts">{q.options.map((opt, i) => {
            const cls = optCls(opt);
            const studyLabel = optionStudyLabel(opt);
            return /*#__PURE__*/<button key={opt?.id ?? i} className={"opt ".concat(cls)} disabled={answered} onClick={() => pickOpt(opt)}>{/*#__PURE__*/<span key={opt?.id ?? i} className="jp" style={{
                flex: 1,
                minWidth: 0,
                textAlign: 'left'
              }}>{opt}</span>}{studyLabel && /*#__PURE__*/<span key={opt?.id ?? i} className="jp" style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: cls === "ng" ? "#991B1B" : cls === "ok" ? "#065F46" : "var(--t2)",
                fontWeight: 700,
                textAlign: 'right',
                maxWidth: '48%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{studyLabel}</span>}{cls === "ok" && I({
                n: "ok",
                s: 18,
                c: "var(--ok)"
              })}{cls === "ng" && I({
                n: "ng",
                s: 18,
                c: "var(--ng)"
              })}</button>;
          })}</div>}{answered && isG && q.exp && /*#__PURE__*/<div className="exbox">{/*#__PURE__*/<div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#92400E",
            marginBottom: 5,
            fontFamily: "'Noto Sans JP'"
          }}>日本語訳</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            color: "var(--t2)",
            lineHeight: 1.6,
            marginBottom: 10
          }}>{getPart5Japanese(q)}</div>}{/*#__PURE__*/<div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#92400E",
            marginBottom: 5,
            fontFamily: "'Noto Sans JP'"
          }}>💡 解説</div>}{/*#__PURE__*/<div className="extxt">{q.exp}</div>}{((_q_topExplanation = q.topExplanation) === null || _q_topExplanation === void 0 ? void 0 : _q_topExplanation.body) && /*#__PURE__*/<div style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid #FED7AA"
          }}>{/*#__PURE__*/<div style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#92400E",
              marginBottom: 5,
              fontFamily: "'Noto Sans JP'"
            }}>みんなの解説</div>}{/*#__PURE__*/<div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 5
            }}>{/*#__PURE__*/<span style={{
                fontSize: 16
              }}>{q.topExplanation.authorAvatar || '🎓'}</span>}{/*#__PURE__*/<span className="jp" style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--t2)"
              }}>{q.topExplanation.authorNickname || '匿名'}</span>}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 13,
              color: "var(--t)",
              lineHeight: 1.6,
              marginBottom: 8
            }}>{q.topExplanation.body}</div>}{/*#__PURE__*/<div style={{
              display: "flex",
              gap: 6
            }}>{/*#__PURE__*/<button className="bg" style={{
                fontSize: 12,
                padding: "7px 10px"
              }} onClick={() => voteGrammarExplanation(q.topExplanation.id, 1)}>👍 {(_ref = (_q_topExplanation_likes = q.topExplanation.likes) !== null && _q_topExplanation_likes !== void 0 ? _q_topExplanation_likes : q.topExplanation.score) !== null && _ref !== void 0 ? _ref : 0}</button>}{/*#__PURE__*/<button className="bg" style={{
                fontSize: 12,
                padding: "7px 10px"
              }} onClick={() => voteGrammarExplanation(q.topExplanation.id, -1)}>👎 {(_q_topExplanation_dislikes = q.topExplanation.dislikes) !== null && _q_topExplanation_dislikes !== void 0 ? _q_topExplanation_dislikes : 0}</button>}</div>}</div>}{grammarSavedNotice && /*#__PURE__*/<div className="jp" style={{
            marginTop: 10,
            fontSize: 12,
            color: "#065F46",
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            borderRadius: 8,
            padding: "8px 10px"
          }}>{grammarSavedNotice}</div>}{q.id && !String(q.id).startsWith('fallback-') && /*#__PURE__*/<div style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid #FED7AA"
          }}>{/*#__PURE__*/<textarea value={grammarNote || ((_q_myExplanation = q.myExplanation) === null || _q_myExplanation === void 0 ? void 0 : _q_myExplanation.body) || ''} onChange={e => setGrammarNote(e.target.value)} placeholder="自分の解説・覚え方を追記" style={{
              width: "100%",
              minHeight: 70,
              border: "1px solid var(--bd)",
              borderRadius: 8,
              padding: 10,
              fontSize: 13,
              fontFamily: "'Noto Sans JP'",
              resize: "vertical"
            }} />}{/*#__PURE__*/<button className="bp" style={{
              marginTop: 8,
              fontSize: 12,
              padding: "8px 12px"
            }} onClick={() => addGrammarExplanation(q)}>解説を保存</button>}</div>}</div>}{answered && /*#__PURE__*/<button className="bp" style={{
          width: "100%"
        }} onClick={nextQ}>{tIdx + 1 < tQs.length ? "次の問題 →" : "結果を見る →"}</button>}</div>}{/*#__PURE__*/<div style={{
        height: 20
      }} />}</div>;
  };
  // ── RESULT ──────────────────────────────────────────────────────
  const Result = () => {
    const cnt = tAns.filter(a => a.ok).length,
      total = tAns.length;
    const pct = Math.round(cnt / total * 100);
    const st = stars(cnt, total);
    const wrong = tAns.filter(a => !a.ok);
    const msg = pct >= 80 ? "素晴らしい！🎉" : pct >= 60 ? "よくできました！👍" : "もう一度チャレンジ！💪";
    const isW = screen === "wordTest",
      isG = screen === "grammarTest",
      isL = screen === "listeningTest";
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="rscr">{/*#__PURE__*/<div className="rring">{/*#__PURE__*/<div className="rnum">{cnt}</div>}{/*#__PURE__*/<div className="rden">/ {total}</div>}</div>}{/*#__PURE__*/<div className="rstars">{st.map((on, i) => I({
            n: "star",
            s: 24,
            c: on ? "#F59E0B" : "#E2E8F0"
          }))}</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 4
        }}>{msg}</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 13,
          color: "var(--t2)",
          marginBottom: 18
        }}>正答率 {pct}% · 学習ポイント +{cnt * 5}pt{/*#__PURE__*/<div style={{
            fontSize: 11,
            color: "var(--t3)",
            marginTop: 4
          }}>学習ポイントは経験値・ランキング用です。コインとは別で消費されません。</div>}</div>}{wrong.length > 0 && /*#__PURE__*/<div style={{
          width: "100%",
          marginBottom: 16
        }}>{/*#__PURE__*/<div style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--t2)",
            marginBottom: 8,
            fontFamily: "'Noto Sans JP'"
          }}>❌ 間違えた問題 ({wrong.length}問)</div>}{wrong.map((a, i) => /*#__PURE__*/<div key={a?.id ?? i} className="rw">{isW && /*#__PURE__*/<React.Fragment key={a?.id ?? i}>{/*#__PURE__*/<div key={a?.id ?? i} style={{
                fontSize: 15,
                fontWeight: 700
              }}>{a.q.word}</div>}{/*#__PURE__*/<div key={a?.id ?? i} className="jp" style={{
                fontSize: 13,
                color: "var(--ok)",
                marginTop: 3
              }}>✓ 正解: {a.q.correct}</div>}{/*#__PURE__*/<div key={a?.id ?? i} className="jp" style={{
                fontSize: 12,
                color: "var(--ng)"
              }}>✗ あなた: {a.sel}</div>}</React.Fragment>}{isG && /*#__PURE__*/<React.Fragment key={a?.id ?? i}>{/*#__PURE__*/<div key={a?.id ?? i} style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 4
              }}>{formatPart5Sentence(a.q.s)}</div>}{/*#__PURE__*/<div key={a?.id ?? i} className="jp" style={{
                fontSize: 12,
                color: "var(--t2)",
                marginBottom: 3
              }}>{getPart5Japanese(a.q)}</div>}{/*#__PURE__*/<div key={a?.id ?? i} className="jp" style={{
                fontSize: 13,
                color: "var(--ok)"
              }}>✓ 正解: {a.q.ans}</div>}{a.q.exp && /*#__PURE__*/<div key={a?.id ?? i} style={{
                fontSize: 12,
                color: "#92400E",
                marginTop: 4,
                fontFamily: "'Noto Sans JP'"
              }}>{a.q.exp}</div>}</React.Fragment>}{isL && /*#__PURE__*/<React.Fragment key={a?.id ?? i}>{/*#__PURE__*/<div key={a?.id ?? i} style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 4
              }}>{a.q.en}</div>}{/*#__PURE__*/<div key={a?.id ?? i} className="jp" style={{
                fontSize: 13,
                color: "var(--ok)"
              }}>✓ 正解: {a.q.jp}</div>}{/*#__PURE__*/<div key={a?.id ?? i} className="jp" style={{
                fontSize: 12,
                color: "var(--ng)"
              }}>✗ あなた: {a.sel}</div>}</React.Fragment>}</div>)}</div>}{sett.rewOn && wrong.length > 0 && /*#__PURE__*/<div className="rdbox" style={{
          width: "100%",
          marginBottom: 14
        }}>{/*#__PURE__*/<div style={{
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 6,
            fontFamily: "'Noto Sans JP'"
          }}>📺 広告を見て間違い問題を復習リストへ保存</div>}{/*#__PURE__*/<button style={{
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
          }} onClick={() => openRew(() => t$("🔖 間違い問題を保存しました！"))}>広告を見て保存する →</button>}</div>}{(isG || isL || isW) && /*#__PURE__*/<StudySapuriCard screenName={isG ? "grammar_result" : isL ? "listening_result" : "word_result"} placement="toeic_result" variant="toeic" compact />}{sett.affOn && /*#__PURE__*/<div style={{
          width: "100%",
          marginBottom: 14
        }}>{/*#__PURE__*/<div className="afcard" style={{
            margin: 0,
            borderColor: afCard.color + "40",
            background: afCard.color + "08"
          }}>{/*#__PURE__*/<div className="afbdg" style={{
              background: afCard.color + "20",
              color: afCard.color
            }}>次のステップ 👇</div>}{/*#__PURE__*/<div style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 3,
              fontFamily: "'Noto Sans JP'"
            }}>{afCard.emoji} {afCard.title}</div>}{/*#__PURE__*/<div style={{
              fontSize: 12,
              color: "var(--t2)",
              marginBottom: 10,
              fontFamily: "'Noto Sans JP'"
            }}>{afCard.desc}</div>}{/*#__PURE__*/<button className="afcta" style={{
              background: afCard.color
            }} onClick={() => {
              var _afCard_key;
              logAffiliateClick((_afCard_key = afCard.key) !== null && _afCard_key !== void 0 ? _afCard_key : '', afCard.title, toeic);
              if (afCard.url && afCard.url !== '#') window.open(afCard.url, '_blank', 'noopener,noreferrer');else t$('🔗 外部サービスへ（URL未設定 - lib/affiliateConfig.tsで設定）');
            }}>{afCard.cta}</button>}</div>}</div>}{/*#__PURE__*/<div style={{
          display: "flex",
          gap: 10,
          width: "100%"
        }}>{/*#__PURE__*/<button className="bp" style={{
            flex: 1
          }} onClick={() => {
            setScreen("main");
            setNavTab("learn");
          }}>学習メニューへ</button>}</div>}</div>}{/*#__PURE__*/<div style={{
        height: 20
      }} />}</div>;
  };
  // ── ANALYSIS ────────────────────────────────────────────────────
  const Analysis = () => {
    const lw = TR.word.slice(-1)[0],
      lg = TR.grammar.slice(-1)[0],
      ll = TR.listening.slice(-1)[0];
    const shAvg = TR.shadowing.length > 0 ? Math.round(TR.shadowing.reduce((s, r) => s + r.score, 0) / TR.shadowing.length) : 0;
    const pct = r => r ? Math.round(r.correct / r.total * 100) : 0;
    const total = TR.word.length + TR.grammar.length + TR.listening.length + TR.shadowing.length;
    const confidence = toeicConfidence(TR);
    const LEVELS = [{
      grade: "A1",
      label: "入門",
      color: "#94A3B8"
    }, {
      grade: "A2",
      label: "初級",
      color: "#8FA3B8"
    }, {
      grade: "B1",
      label: "初中級",
      color: "#34D399"
    }, {
      grade: "B1+",
      label: "中級",
      color: "#FBBF24"
    }, {
      grade: "B2",
      label: "中上級",
      color: "#F97316"
    }, {
      grade: "C1",
      label: "上級",
      color: "#A78BFA"
    }, {
      grade: "C2",
      label: "最上級",
      color: "#EF4444"
    }];
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="ascr">{/*#__PURE__*/<div className="tcard">{/*#__PURE__*/<div style={{
            fontSize: 11,
            fontWeight: 700,
            opacity: .8,
            textTransform: "uppercase",
            letterSpacing: .5,
            marginBottom: 6,
            fontFamily: "'Noto Sans JP'"
          }}>TOEIC 推定スコア（参考値）</div>}{/*#__PURE__*/<div style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8
          }}>{/*#__PURE__*/<div style={{
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1
            }}>{toeic}</div>}{/*#__PURE__*/<div style={{
              fontSize: 16,
              opacity: .7,
              marginBottom: 8
            }}>/990</div>}</div>}{/*#__PURE__*/<div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,.15)",
            borderRadius: 20,
            padding: "5px 12px",
            marginTop: 10,
            fontSize: 13,
            fontWeight: 600
          }}>{/*#__PURE__*/<span style={{
              fontSize: 16
            }}>🏆</span>}{/*#__PURE__*/<span className="jp">{spLv.grade} · {spLv.label} ({spLv.en})</span>}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            marginTop: 8,
            opacity: .78
          }}>信頼度：{confidence.label} · {confidence.note}</div>}{total === 0 && /*#__PURE__*/<div style={{
            fontSize: 12,
            marginTop: 8,
            opacity: .7,
            fontFamily: "'Noto Sans JP'"
          }}>テストを受けると精度が上がります</div>}</div>}{/*#__PURE__*/<StudySapuriCard screenName="toeic" variant="toeic" compact />}{/*#__PURE__*/<div className="sc">{/*#__PURE__*/<div className="sc-t">{I({
              n: "chart",
              s: 15,
              c: "var(--p)"
            })}{/*#__PURE__*/<span>科目別 正答率</span>}</div>}{[{
            label: "単語",
            val: pct(lw),
            color: "#183153",
            r: lw
          }, {
            label: "文法",
            val: pct(lg),
            color: "#B88932",
            r: lg
          }, {
            label: "リスニング",
            val: pct(ll),
            color: "#C2410C",
            r: ll
          }, {
            label: "シャドー",
            val: shAvg,
            color: "#059669",
            r: TR.shadowing.length > 0 ? {
              correct: shAvg,
              total: 100
            } : null,
            isScore: true
          }].map((param, __idx) => {
            let {
              label,
              val,
              color,
              r,
              isScore
            } = param;
            return /*#__PURE__*/<div key={param?.id ?? __idx} className="str">{/*#__PURE__*/<div key={param?.id ?? __idx} className="str-l jp">{label}</div>}{/*#__PURE__*/<div key={param?.id ?? __idx} className="str-bw">{/*#__PURE__*/<div key={param?.id ?? __idx} className="str-b" style={{
                  width: r ? "".concat(val, "%") : "0%",
                  background: color
                }} />}</div>}{r ? /*#__PURE__*/<div key={param?.id ?? __idx} className="str-p" style={{
                color
              }}>{val}{isScore ? "点" : "%"}</div> : /*#__PURE__*/<div key={param?.id ?? __idx} style={{
                fontSize: 11,
                color: "var(--t3)",
                width: 40,
                textAlign: "right",
                fontFamily: "'Noto Sans JP'"
              }}>未受験</div>}</div>;
          })}</div>}{/*#__PURE__*/<div className="sc">{/*#__PURE__*/<div className="sc-t">{I({
              n: "trophy",
              s: 15,
              c: "#F59E0B"
            })}{/*#__PURE__*/<span>詳細スタッツ</span>}</div>}{[{
            label: "受験回数",
            val: "単語".concat(TR.word.length, "・文法").concat(TR.grammar.length, "・LS").concat(TR.listening.length, "回")
          }, {
            label: "シャドーイング",
            val: "".concat(TR.shadowing.length, "回 \xb7 平均").concat(shAvg, "点")
          }, {
            label: "保存した文",
            val: "".concat(saved.length, "文")
          }, {
            label: "総ポイント",
            val: "".concat(pts, "pt")
          }].map((param, __idx) => {
            let {
              label,
              val
            } = param;
            return /*#__PURE__*/<div key={param?.id ?? __idx} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 0",
              borderBottom: "1px solid var(--bd)"
            }}>{/*#__PURE__*/<span key={param?.id ?? __idx} className="jp" style={{
                fontSize: 13,
                color: "var(--t2)"
              }}>{label}</span>}{/*#__PURE__*/<span key={param?.id ?? __idx} className="jp" style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--t)"
              }}>{val}</span>}</div>;
          })}</div>}{/*#__PURE__*/<div className="sc">{/*#__PURE__*/<div className="sc-t">{I({
              n: "mic",
              s: 15,
              c: "var(--pu)"
            })}{/*#__PURE__*/<span>スピーキングレベル（PROGOS風）</span>}</div>}{/*#__PURE__*/<div className="lvgrid">{LEVELS.map((l, __idx) => {
              const on = l.grade === spLv.grade;
              return /*#__PURE__*/<div key={l?.id ?? __idx} className={"lvi".concat(on ? " on" : "")} style={on ? {
                borderColor: l.color,
                background: l.color + "18"
              } : {}}>{/*#__PURE__*/<div key={l?.id ?? __idx} style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: on ? l.color : "var(--t3)"
                }}>{l.grade}</div>}{/*#__PURE__*/<div key={l?.id ?? __idx} style={{
                  fontSize: 9,
                  color: on ? l.color : "var(--t3)",
                  fontFamily: "'Noto Sans JP'",
                  textAlign: "center",
                  lineHeight: 1.2
                }}>{l.label}</div>}{on && /*#__PURE__*/<div key={l?.id ?? __idx} style={{
                  fontSize: 8,
                  color: l.color,
                  fontWeight: 700
                }}>▲ 現在</div>}</div>;
            })}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 11,
            color: "var(--t3)",
            marginTop: 10
          }}>※ 単語・文法・リスニング・シャドーイングから算出</div>}</div>}{/*#__PURE__*/<div className="sc">{/*#__PURE__*/<div className="sc-t">📐 スコア内訳</div>}{[{
            label: "ベース",
            val: 300,
            color: "var(--t3)"
          }, {
            label: "単語",
            val: lw ? Math.round(lw.correct / lw.total * 150) : 0,
            max: 150,
            color: "#183153"
          }, {
            label: "文法",
            val: lg ? Math.round(lg.correct / lg.total * 150) : 0,
            max: 150,
            color: "#B88932"
          }, {
            label: "リスニング",
            val: ll ? Math.round(ll.correct / ll.total * 200) : 0,
            max: 200,
            color: "#C2410C"
          }, {
            label: "シャドー",
            val: Math.round(shAvg / 100 * 100),
            max: 100,
            color: "#059669"
          }].map((param, __idx) => {
            let {
              label,
              val,
              max,
              color
            } = param;
            return /*#__PURE__*/<div key={param?.id ?? __idx} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid var(--bd)"
            }}>{/*#__PURE__*/<span key={param?.id ?? __idx} className="jp" style={{
                fontSize: 12,
                color: "var(--t2)"
              }}>{label}</span>}{/*#__PURE__*/<span key={param?.id ?? __idx} style={{
                fontSize: 12,
                fontWeight: 700,
                color
              }}>{val}{max ? "/".concat(max) : ""}</span>}</div>;
          })}{/*#__PURE__*/<div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderTop: "2px solid var(--bd)",
            marginTop: 2
          }}>{/*#__PURE__*/<span className="jp" style={{
              fontSize: 14,
              fontWeight: 700
            }}>合計（予想）</span>}{/*#__PURE__*/<span style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--p)"
            }}>{toeic}点</span>}</div>}</div>}{total < 3 && /*#__PURE__*/<div style={{
          background: "var(--pl)",
          borderRadius: "var(--r)",
          padding: "14px 16px",
          border: "1px solid var(--cbb)"
        }}>{/*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--pd)",
            marginBottom: 6
          }}>💡 精度を上げるには</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            color: "var(--p)",
            lineHeight: 1.7
          }}>単語・文法・リスニングを各1回以上受けるとTOEIC予想スコアの精度が向上します。</div>}{/*#__PURE__*/<button className="bp" style={{
            marginTop: 12,
            width: "100%",
            fontSize: 13
          }} onClick={() => {
            setScreen("main");
            setNavTab("learn");
          }}>テストを受ける →</button>}</div>}</div>}{/*#__PURE__*/<div style={{
        height: 20
      }} />}</div>;
  };
  // ── VIDEO ───────────────────────────────────────────────────────

  return {
    Home,
    LearnHub,
    StudyHub,
    GrammarHub,
    Quiz,
    Result,
    Analysis
  };
}
