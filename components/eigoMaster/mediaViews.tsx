// @ts-nocheck

import React, { useEffect } from "react";
import { CoinCostLabel } from "../common";
import { YouTubeEmbed } from "../video/VideoPlayer";
import type { EigoMasterViewDeps } from "./viewTypes";
import { NEWS_COUNTRIES, NEWS_COUNTRY_ORDER } from "../../lib/newsCountries";
import { AFFILIATE_LINKS } from "../../lib/affiliateLinks";
export function useMediaViews(deps: EigoMasterViewDeps) {
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
    calcToeic,
    capIdx,
    caps,
    captionCache,
    captionLoading,
    captionTimingLoading,
    transcriptUnavailable,
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
    dbSaveWord,
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
    setWordBook,
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
    spendCoins,
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
    videoVotes,
    videos,
    voteGrammarExplanation,
    voteGrammarQuestion,
    voteSharedVideo,
    voteStudyItem,
    voteTranslation,
    wallet,
    wordData,
    wordBook,
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
  const elsaCard = {
    key: 'elsa',
    title: 'ELSA Speak',
    desc: '発音チェックとシャドーイング練習はELSAで行えます。',
    cta: 'ELSAを開く',
    emoji: '🎙️',
    color: '#059669',
    url: process.env.NEXT_PUBLIC_AFFILIATE_ELSA_URL || 'https://elsaspeak.com/'
  };
  const wsResultRecordedRef = React.useRef(false);
  const VideoScreen = () => /*#__PURE__*/<div className="sa">{proc.active && proc.videoId === (curVid === null || curVid === void 0 ? void 0 : curVid.videoId) && /*#__PURE__*/<div style={{
      background: 'linear-gradient(135deg,#0B1F38,#183153)',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }}>{/*#__PURE__*/<div className="spin" style={{
        borderColor: 'rgba(255,255,255,.4)',
        borderTopColor: 'white'
      }} />}{/*#__PURE__*/<div>{/*#__PURE__*/<div style={{
          color: 'white',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Noto Sans JP'"
        }}>{proc.step === 'transcript' ? '📡 字幕を取得中...' : proc.step === 'ai' ? '🤖 AIが日本語イメージを生成中...' : '💾 保存中...'}</div>}{/*#__PURE__*/<div style={{
          color: 'rgba(255,255,255,.7)',
          fontSize: 11
        }}>{proc.pct}% 完了</div>}</div>}</div>}{captionLoading && !proc.active && /*#__PURE__*/<div style={{
      background: 'linear-gradient(135deg,#0B1F38,#183153)',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }}>{/*#__PURE__*/<div className="spin" style={{
        borderColor: 'rgba(255,255,255,.4)',
        borderTopColor: 'white'
      }} />}{/*#__PURE__*/<div>{/*#__PURE__*/<div style={{
          color: 'white',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Noto Sans JP'"
        }}>字幕を読み込んでいます...</div>}{/*#__PURE__*/<div style={{
          color: 'rgba(255,255,255,.7)',
          fontSize: 11
        }}>翻訳字幕と時間情報を確認中です</div>}</div>}</div>}{(!proc.active || proc.step === 'manual') && !captionLoading && curVid && transcriptUnavailable?.[curVid.videoId] && !captionCache[curVid === null || curVid === void 0 ? void 0 : curVid.videoId] && !STATIC_CAPTION_OVERRIDES[curVid === null || curVid === void 0 ? void 0 : curVid.videoId] && /*#__PURE__*/<div style={{
      background: '#FEF2F2',
      borderTop: '1px solid #FECACA',
      borderBottom: '1px solid #FECACA',
      padding: '10px 16px',
      color: '#991B1B',
      fontSize: 12,
      lineHeight: 1.6
    }} className="jp"><strong>この動画はYouTubeから字幕情報を取得できない可能性があります。</strong><br />字幕本文が保存されていないため、生成を押しても再度失敗することがあります。コインは消費されません。</div>}{!proc.active && !captionLoading && !captionCache[curVid === null || curVid === void 0 ? void 0 : curVid.videoId] && !STATIC_CAPTION_OVERRIDES[curVid === null || curVid === void 0 ? void 0 : curVid.videoId] && /*#__PURE__*/<div style={{
      background: 'var(--al)',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }}>{/*#__PURE__*/<span>⚠️</span>}{/*#__PURE__*/<div className="jp" style={{
        fontSize: 12,
        color: '#92400E',
        flex: 1
      }}>字幕データがありません。字幕取得とAI日本語イメージ生成を実行できます。</div>}{/*#__PURE__*/<button className="bg" style={{
        fontSize: 11,
        padding: '6px 10px',
        background: '#fff'
      }} onClick={() => curVid && processNewVideo(curVid)}>AI生成（{COIN_COSTS.VIDEO_GENERATION}）</button>}</div>}{/*#__PURE__*/<div className="ytc">{/*#__PURE__*/<YouTubeEmbed videoId={curVid === null || curVid === void 0 ? void 0 : curVid.videoId} onReady={reader => {
        ytReaderRef.current = reader;
        setYtReaderReady(true);
      }} />}</div>}{/*#__PURE__*/<div className="cap-nav">{/*#__PURE__*/<button type="button" className="cbtn cbtn-g" style={{
        padding: "6px 10px"
      }} onPointerDown={e => e.preventDefault()} onMouseDown={e => e.preventDefault()} onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        moveCaption(i => i - 1);
      }} disabled={!caps.length || capIdx === 0}>{I({
          n: "chL",
          s: 16
        })} 前</button>}{/*#__PURE__*/<div className="cap-cnt">{caps.length ? capIdx + 1 : 0} / {caps.length}</div>}{/*#__PURE__*/<button type="button" className="cbtn cbtn-g" style={{
        padding: "6px 10px"
      }} onPointerDown={e => e.preventDefault()} onMouseDown={e => e.preventDefault()} onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        moveCaption(i => i + 1);
      }} disabled={!caps.length || capIdx === caps.length - 1}>次 {I({
          n: "chR",
          s: 16
        })}</button>}</div>}{/*#__PURE__*/<div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '7px 14px',
      background: 'var(--bg)',
      borderBottom: '1px solid var(--bd)'
    }}>{/*#__PURE__*/<div className="jp" style={{
        fontSize: 11,
        color: 'var(--t3)',
        lineHeight: 1.5
      }}>動画の現在秒数を読んで翻訳カードを合わせます</div>}{/*#__PURE__*/<div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>{/*#__PURE__*/<button type="button" className="cbtn cbtn-g" style={{
          fontSize: 11,
          padding: '6px 10px'
        }} onClick={() => syncCaptionToCurrentTime(true)} disabled={!caps.length || !ytReaderReady || captionTimingLoading}>{captionTimingLoading ? '時間情報を取得中...' : '現在位置に合わせる'}</button>}{/*#__PURE__*/<button type="button" className={"tog ".concat(autoSync ? "on" : "off")} onClick={() => setAutoSync(v => !v)} disabled={!caps.length || !ytReaderReady || captionTimingLoading} aria-label="自動追従" title="自動追従" />}</div>}</div>}{curCap && /*#__PURE__*/<div className="cap-panel">{/*#__PURE__*/<div className="slbl">English</div>}{/*#__PURE__*/<div className="cap-en">{curCap.english}</div>}{/*#__PURE__*/<div className="slbl" style={{
        marginTop: 12
      }}>日本語イメージ</div>}{/*#__PURE__*/<div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 5
      }}>{(looksLikeLegacyChunkMeaning(curCap) ? ['日本語イメージは未生成です'] : curCap.meaning).map((m, i, arr) => /*#__PURE__*/<span key={m?.id ?? i} style={{
          display: "flex",
          alignItems: "center",
          gap: 5
        }}>{/*#__PURE__*/<span key={m?.id ?? i} className="mng">{m}</span>}{i < arr.length - 1 && /*#__PURE__*/<span key={m?.id ?? i} className="csep">/</span>}</span>)}</div>}{caps.some(looksLikeLegacyChunkMeaning) && /*#__PURE__*/<button className="cbtn cbtn-sh" style={{
        marginTop: 10
      }} disabled={jpRegenerating} onClick={regenerateCurrentJapanese}>{jpRegenerating ? 'Generating...' : "Continue (".concat(COIN_COSTS.VIDEO_CONTINUE_TRANSLATION, ")")}</button>}</div>}{/*#__PURE__*/<div className="ctrlbar">        {/*#__PURE__*/<button className={"cbtn cbtn-s".concat(curCap && isSaved(curCap.id) ? " on" : "")} onClick={() => {
        if (!curCap) return;
        if (isSaved(curCap.id)) {
          setSaved(p => p.filter(s => s.id !== curCap.id));
          dbDeleteLine(curCap.id);
          t$("保存解除");
        } else {
          const newLine = {
            ...curCap,
            videoTitle: curVid === null || curVid === void 0 ? void 0 : curVid.title,
            savedAt: Date.now()
          };
          setSaved(p => [newLine, ...p]);
          dbSaveLine(newLine);
          t$("⭐ 保存しました！");
        }
      }}>{I({
          n: curCap && isSaved(curCap.id) ? "bkmkF" : "bkmk",
          s: 14
        })}{curCap && isSaved(curCap.id) ? "保存済" : "保存"}</button>}{/*#__PURE__*/<button className="cbtn cbtn-g" style={{
        marginLeft: "auto"
      }} onClick={toggleMyVideo}>{myList.some(v => v.videoId === (curVid === null || curVid === void 0 ? void 0 : curVid.videoId)) ? "".concat(String.fromCodePoint(0x1F4CC), " MY登録済み") : "".concat(String.fromCodePoint(0x1F4CC), " MY追加")}</button>}</div>}{affVis && sett.affOn && /*#__PURE__*/<div style={{
      paddingTop: 8
    }}>{/*#__PURE__*/<div className="afcard" style={{
        borderColor: afCard.color + "40",
        background: afCard.color + "08"
      }}>{/*#__PURE__*/<div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}>{/*#__PURE__*/<div>{/*#__PURE__*/<div className="afbdg" style={{
              background: afCard.color + "20",
              color: afCard.color
            }}>おすすめ</div>}{/*#__PURE__*/<div style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 3,
              fontFamily: "'Noto Sans JP'"
            }}>{afCard.emoji} {afCard.title}</div>}{/*#__PURE__*/<div style={{
              fontSize: 12,
              color: "var(--t2)",
              marginBottom: 10,
              fontFamily: "'Noto Sans JP'"
            }}>{afCard.desc}</div>}</div>}{/*#__PURE__*/<button style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--t3)",
            padding: 4
          }} onClick={() => setAffVis(false)}>{I({
              n: "close",
              s: 16
            })}</button>}</div>}{/*#__PURE__*/<button className="afcta" style={{
          background: afCard.color
        }} onClick={() => {
          logAffiliateClick('study_sapuri', 'スタディサプリ ENGLISH', toeic);
          window.open(AFFILIATE_LINKS.STUDY_SUPPLI_HOME, '_blank', 'noopener,noreferrer');
        }}>{afCard.cta}</button>}</div>}</div>}{/*#__PURE__*/<div style={{
      height: 20
    }} />}</div>;
  // ── SAVED ───────────────────────────────────────────────────────
  const Saved = () => /*#__PURE__*/<div className="sa">{saved.length === 0 ? /*#__PURE__*/<div className="empty">{/*#__PURE__*/<div style={{
        fontSize: 44,
        marginBottom: 10
      }}>🔖</div>}{/*#__PURE__*/<div className="jp" style={{
        fontSize: 14,
        fontWeight: 600,
        color: "var(--t2)",
        marginBottom: 4
      }}>保存した文はありません</div>}{/*#__PURE__*/<div className="jp" style={{
        fontSize: 12
      }}>動画を見ながら気になる文を保存しましょう</div>}</div> : /*#__PURE__*/<>{/*#__PURE__*/<div style={{
        padding: "12px 16px 4px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>{/*#__PURE__*/<div className="jp" style={{
          fontSize: 13,
          color: "var(--t3)"
        }}>{saved.length}件保存済み</div>}{/*#__PURE__*/<button className="bg" style={{
          fontSize: 12,
          padding: "6px 10px"
        }} onClick={() => openRew(() => t$("🔓 復習ボーナス解放！"))}>📺 広告で復習ボーナス</button>}</div>}{/*#__PURE__*/<div className="slist">{saved.map((line, __idx) => /*#__PURE__*/<div key={line?.id ?? __idx} className="scard">{I({
            n: "star",
            s: 18,
            c: "#F59E0B"
          })}{/*#__PURE__*/<div key={line?.id ?? __idx} style={{
            flex: 1,
            minWidth: 0
          }}>{line.videoTitle && /*#__PURE__*/<div key={line?.id ?? __idx} style={{
              fontSize: 11,
              color: "var(--p)",
              marginBottom: 2,
              fontWeight: 500
            }}>{line.videoTitle}</div>}{/*#__PURE__*/<div key={line?.id ?? __idx} style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--t)",
              marginBottom: 5,
              lineHeight: 1.5
            }}>{line.english}</div>}{/*#__PURE__*/<div key={line?.id ?? __idx} style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4
            }}>{(line.meaning || []).map((m, i) => /*#__PURE__*/<span key={line?.id ?? __idx} className="mng" style={{
                fontSize: 11,
                padding: "3px 7px"
              }}>{m}</span>)}</div>}</div>}{/*#__PURE__*/<button key={line?.id ?? __idx} style={{
            flexShrink: 0,
            padding: 4,
            cursor: "pointer",
            border: "none",
            background: "none",
            color: "var(--t3)"
          }} onClick={() => {
            setSaved(s => s.filter(l => !(l.id === line.id && l.savedAt === line.savedAt)));
            dbDeleteLine(line.id);
          }}>{I({
              n: "trash",
              s: 16
            })}</button>}</div>)}</div>}</>}{/*#__PURE__*/<div style={{
      height: 20
    }} />}</div>;
  // ── GACHA ───────────────────────────────────────────────────────
  const Advice = () => {
    const selected = adviceSelected || adviceHistory[0];
    const ai = (selected === null || selected === void 0 ? void 0 : selected.ai_advice) || null;
    const sites = Array.isArray(selected === null || selected === void 0 ? void 0 : selected.recommended_sites) ? selected.recommended_sites : [];
    const dateText = (selected === null || selected === void 0 ? void 0 : selected.created_at) ? new Date(selected.created_at).toLocaleDateString('ja-JP') : '';
    const adviceText = [ai?.summary, ai?.advice, ...(Array.isArray(ai?.focus) ? ai.focus : []), ...(Array.isArray(ai?.next_actions) ? ai.next_actions : [])].filter(Boolean).join(' ');
    const shouldShowToeicMaterial = /Part\s*3|Part\s*4|リスニング|TOEIC|長文読解|文法|単語|Part5/i.test(adviceText);
    const shouldShowCamblyMaterial = /英会話|発話|スピーキング|アウトプット|海外赴任|ネイティブ表現|会話/i.test(adviceText);
    var _selected_toeic_estimate;
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="lhub">{/*#__PURE__*/<div style={{
          background: "linear-gradient(135deg,#FFFDF8,#EEF3F8)",
          border: "1px solid var(--bd)",
          borderRadius: "var(--r)",
          padding: "16px",
          boxShadow: "var(--sh)"
        }}>{/*#__PURE__*/<div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 10
          }}>{/*#__PURE__*/<div>{/*#__PURE__*/<div className="jp" style={{
                fontSize: 18,
                fontWeight: 800,
                color: "var(--t)"
              }}>AI学習コーチ</div>}{/*#__PURE__*/<div className="jp" style={{
                fontSize: 12,
                color: "var(--t2)",
                lineHeight: 1.6
              }}>学習履歴と前回アドバイスを見て、次にやることを提案します。</div>}</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#B45309",
              background: "#FEF3C7",
              borderRadius: 18,
              padding: "6px 10px",
              whiteSpace: "nowrap"
            }}>🪙 {wallet.coins}</div>}</div>}{/*#__PURE__*/<button className="bp" style={{
            width: "100%",
            fontSize: 14,
            padding: "12px"
          }} disabled={adviceGenerating || wallet.coins < 5} onClick={generateAdvice}>{adviceGenerating ? '生成中...' : 'AIアドバイスをもらう（5 coins）'}</button>}{wallet.coins < 5 && /*#__PURE__*/<button className="bg" style={{
            width: "100%",
            marginTop: 8
          }} onClick={() => setNavTab('gacha')}>ガチャでコインを取得</button>}</div>}{/*#__PURE__*/<div className="lsec">最新アドバイス</div>}{adviceLoading && /*#__PURE__*/<div className="jp" style={{
          padding: 20,
          textAlign: "center",
          color: "var(--t3)"
        }}>読み込み中...</div>}{!adviceLoading && !selected && /*#__PURE__*/<div className="empty" style={{
          margin: 0
        }}>{/*#__PURE__*/<div style={{
            fontSize: 36,
            marginBottom: 8
          }}>📘</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--t2)"
          }}>まだアドバイスはありません</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            color: "var(--t3)",
            lineHeight: 1.7
          }}>AI生成後、履歴として保存されます。</div>}</div>}{selected && /*#__PURE__*/<div style={{
          background: "rgba(255,253,248,.9)",
          border: "1px solid var(--bd)",
          borderRadius: "var(--r)",
          padding: "16px",
          boxShadow: "var(--sh)"
        }}>{/*#__PURE__*/<div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 8
          }}>{/*#__PURE__*/<div className="jp" style={{
              fontSize: 12,
              fontWeight: 800,
              color: "var(--p)"
            }}>TOEIC推定 {(_selected_toeic_estimate = selected.toeic_estimate) !== null && _selected_toeic_estimate !== void 0 ? _selected_toeic_estimate : toeic}点</div>}{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              color: "var(--t3)"
            }}>{dateText}</div>}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 15,
            fontWeight: 800,
            color: "var(--t)",
            lineHeight: 1.6,
            marginBottom: 10
          }}>{(ai === null || ai === void 0 ? void 0 : ai.summary) || '学習状況を整理しました。'}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            color: "var(--t2)",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            marginBottom: 12
          }}>{ai === null || ai === void 0 ? void 0 : ai.advice}</div>}{Array.isArray(ai === null || ai === void 0 ? void 0 : ai.focus) && ai.focus.length > 0 && /*#__PURE__*/<div style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 12
          }}>{ai.focus.map((f, i) => /*#__PURE__*/<span key={f?.id ?? i} className="jp" style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#183153",
              background: "var(--pl)",
              borderRadius: 16,
              padding: "4px 9px"
            }}>{f}</span>)}</div>}{Array.isArray(ai === null || ai === void 0 ? void 0 : ai.next_actions) && ai.next_actions.length > 0 && /*#__PURE__*/<div style={{
            background: "var(--bg)",
            borderRadius: "var(--rs)",
            padding: "10px 12px"
          }}>{/*#__PURE__*/<div className="jp" style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--t3)",
              marginBottom: 6
            }}>次にやること</div>}{ai.next_actions.map((a, i) => /*#__PURE__*/<div key={a?.id ?? i} className="jp" style={{
              fontSize: 12,
              color: "var(--t)",
              lineHeight: 1.7
            }}>・{a}</div>)}</div>}{shouldShowCamblyMaterial ? /*#__PURE__*/<StudySapuriCard screenName="ai_analysis" placement="ai_analysis" service="cambly" variant="home" compact /> : shouldShowToeicMaterial && /*#__PURE__*/<StudySapuriCard screenName="ai_analysis" placement="ai_analysis" variant="toeic" compact />}</div>}{sites.length > 0 && /*#__PURE__*/<>{/*#__PURE__*/<div className="lsec">おすすめ学習サイト</div>}{sites.map((site, __idx) => /*#__PURE__*/<div key={site?.id ?? __idx} className="lcard" style={{
            alignItems: "flex-start"
          }}>{/*#__PURE__*/<div key={site?.id ?? __idx} className="lcard-ico" style={{
              background: "#F0FDF4"
            }}>{I({
                n: "extlnk",
                s: 20,
                c: "#059669"
              })}</div>}{/*#__PURE__*/<div key={site?.id ?? __idx} style={{
              flex: 1,
              minWidth: 0
            }}>{/*#__PURE__*/<div key={site?.id ?? __idx} className="lcard-t">{site.title}</div>}{/*#__PURE__*/<div key={site?.id ?? __idx} className="lcard-d" style={{
                whiteSpace: "normal",
                lineHeight: 1.55
              }}>{site.description}</div>}{/*#__PURE__*/<div key={site?.id ?? __idx} style={{
                display: "flex",
                gap: 5,
                flexWrap: "wrap",
                marginTop: 7
              }}>{(site.tags || []).slice(0, 3).map((tag, __idx) => /*#__PURE__*/<span key={site?.id ?? __idx} className="jp" style={{
                  fontSize: 10,
                  color: "#047857",
                  background: "#D1FAE5",
                  borderRadius: 12,
                  padding: "3px 7px"
                }}>{tag}</span>)}</div>}</div>}{/*#__PURE__*/<button key={site?.id ?? __idx} className="bg" style={{
              fontSize: 12,
              padding: "7px 10px",
              flexShrink: 0
            }} onClick={() => {
              logAffiliateClick(site.key || site.title, site.title, toeic);
              window.open(site.affiliate_url || site.url, '_blank', 'noopener,noreferrer');
            }}>開く</button>}</div>)}</>}{/*#__PURE__*/<div className="lsec">過去アドバイス</div>}{adviceHistory.length === 0 && !adviceLoading && /*#__PURE__*/<div className="jp" style={{
          fontSize: 12,
          color: "var(--t3)",
          textAlign: "center",
          padding: 18
        }}>履歴はまだありません。</div>}{adviceHistory.map((row, __idx) => {
          var _row_ai_advice;
          var _row_toeic_estimate;
          return /*#__PURE__*/<button key={row?.id ?? __idx} className="lcard" onClick={() => setAdviceSelected(row)}>{/*#__PURE__*/<div key={row?.id ?? __idx} className="lcard-ico" style={{
              background: "#FFF7ED"
            }}>{I({
                n: "pie",
                s: 20,
                c: "#F59E0B"
              })}</div>}{/*#__PURE__*/<div key={row?.id ?? __idx} style={{
              flex: 1,
              minWidth: 0
            }}>{/*#__PURE__*/<div key={row?.id ?? __idx} style={{
                fontSize: 12,
                color: "var(--t3)",
                fontWeight: 700
              }}>{new Date(row.created_at).toLocaleDateString('ja-JP')} / TOEIC {(_row_toeic_estimate = row.toeic_estimate) !== null && _row_toeic_estimate !== void 0 ? _row_toeic_estimate : '-'}点</div>}{/*#__PURE__*/<div key={row?.id ?? __idx} className="lcard-t" style={{
                fontSize: 13
              }}>{((_row_ai_advice = row.ai_advice) === null || _row_ai_advice === void 0 ? void 0 : _row_ai_advice.summary) || 'AIアドバイス'}</div>}</div>}{I({
              n: "chR",
              s: 18,
              c: "var(--t3)"
            })}</button>;
        })}</div>}{/*#__PURE__*/<div style={{
        height: 20
      }} />}</div>;
  };
  const Gacha = () => {
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    const diffMs = Math.max(0, nextMidnight.getTime() - Date.now());
    const diffH = Math.floor(diffMs / 3600000);
    const diffM = Math.floor(diffMs % 3600000 / 60000);
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="gcon">{/*#__PURE__*/<div style={{
          marginBottom: 20
        }}>{/*#__PURE__*/<div className={"gbc".concat(gRes ? ' gball-spin' : '')}>{/*#__PURE__*/<div className="gbi">{["#183153", "#B88932", "#6B7280", "#0F766E", "#8A5A18", "#D8C7A1", "#29415F", "#A16207", "#475569", "#F5E2B7", "#2F5D62", "#DED6C8"].map((c, i) => /*#__PURE__*/<div key={c?.id ?? i} className="gb" style={{
                background: "radial-gradient(circle at 30% 30%,".concat(c, "dd,").concat(c, "88)")
              }} />)}</div>}</div>}{/*#__PURE__*/<div className="gbase">{/*#__PURE__*/<div className="ghole" />}</div>}</div>}{/*#__PURE__*/<div style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 4
        }}>{/*#__PURE__*/<div className="gpts">🪙{/*#__PURE__*/<span>{wallet.coins} coins</span>}</div>}</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 11,
          color: "var(--t3)",
          marginBottom: 18
        }}>無料 {dailyGachaLeft} 回 / 広告ガチャ {adGachaLeft} 回{/*#__PURE__*/<br />}次回無料ガチャ：00:00（あと{diffH}時間{diffM}分）</div>}{gRes && /*#__PURE__*/<div className="gres gres-pop">{/*#__PURE__*/<div style={{
            fontSize: 44,
            marginBottom: 6
          }}>{gRes.emoji}</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#78350F"
          }}>{gRes.text}</div>}{gRes.pts > 0 && /*#__PURE__*/<div style={{
            fontSize: 13,
            color: "#92400E",
            marginTop: 4
          }}>+{gRes.pts}pt ゲット！</div>}</div>}{/*#__PURE__*/<div style={{
          display: "flex",
          gap: 10,
          marginBottom: 20
        }}>{/*#__PURE__*/<button className="bp" style={{
            flex: 1,
            fontSize: 13
          }} onClick={() => doGacha('free')} disabled={gachaInFlight || dailyGachaLeft <= 0}>{dailyGachaLeft > 0 ? "\uD83C\uDFB0 今日の無料ガチャ" : "🎰 無料は明日"}</button>}{rewardedAdsAvailable ? /*#__PURE__*/<button className="bp" style={{
            flex: 1,
            fontSize: 12,
            background: adGachaLeft > 0 ? "linear-gradient(135deg,#5F4724,#183153)" : "var(--bd)",
            color: adGachaLeft > 0 ? "#fff" : "var(--t3)"
          }} onClick={() => openRew(() => doGacha('ad'), 'gacha')} disabled={gachaInFlight || adGachaLeft <= 0}>{adGachaLeft > 0 ? "\uD83D\uDCFA CMを見てガチャ" : "\uD83D\uDCFA 本日は上限"}</button> : /*#__PURE__*/<div className="jp" style={{
            flex: 1,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 12,
            color: "var(--t2)",
            background: "var(--sur)",
            border: "1px solid var(--bd)",
            borderRadius: "var(--rs)",
            padding: "8px 10px"
          }}>広告ガチャはAndroidアプリ版で利用できます</div>}</div>}{wallet.coins < 5 && /*#__PURE__*/<div className="jp" style={{
          fontSize: 12,
          color: "var(--t2)",
          textAlign: "center",
          marginBottom: 16,
          padding: "8px 14px",
          background: "var(--al)",
          borderRadius: "var(--rs)"
        }}>💡 コインが少ない時はCMガチャで補充できます</div>}{gHist.length > 0 && /*#__PURE__*/<div style={{
          background: "var(--sur)",
          borderRadius: "var(--r)",
          padding: "12px 14px",
          boxShadow: "var(--sh)"
        }}>{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--t2)",
            marginBottom: 8
          }}>📜 今日の履歴</div>}{/*#__PURE__*/<div style={{
            display: "flex",
            flexDirection: "column",
            gap: 4
          }}>{gHist.slice(0, 5).map((h, i) => /*#__PURE__*/<div key={h?.id ?? i} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12
            }}>{/*#__PURE__*/<span key={h?.id ?? i} style={{
                fontSize: 16
              }}>{h.emoji}</span>}{/*#__PURE__*/<span key={h?.id ?? i} className="jp" style={{
                flex: 1,
                color: "var(--t2)"
              }}>{h.text}</span>}{/*#__PURE__*/<span key={h?.id ?? i} style={{
                fontSize: 11,
                color: "var(--t3)"
              }}>{h.time}</span>}</div>)}</div>}</div>}</div>}{/*#__PURE__*/<div style={{
        height: 20
      }} />}</div>;
  };
  // ── PARALLEL READER ──────────────────────────────────────────────
  const ParallelReader = () => {
    var _prSelSent_sentence;
    const canRead = prEnText.trim().length > 0;
    if (prMode === 'input') {
      return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="pr-input-wrap">{/*#__PURE__*/<div>{/*#__PURE__*/<div className="pr-input-label">{/*#__PURE__*/<span style={{
                fontSize: 14
              }}>🇺🇸</span>}{/*#__PURE__*/<span>英文（必須）</span>}{/*#__PURE__*/<span style={{
                fontSize: 11,
                color: "var(--t3)",
                marginLeft: "auto"
              }}>BBC・記事などを貼り付け</span>}</div>}{/*#__PURE__*/<textarea className="pr-textarea" rows={6} placeholder="英語の記事・本文を貼り付けてください。\n例: The meeting has been postponed..." value={prEnText} onChange={e => setPrEnText(e.target.value)} />}</div>}{/*#__PURE__*/<div>{/*#__PURE__*/<div className="pr-input-label">{/*#__PURE__*/<span style={{
                fontSize: 14
              }}>🇯🇵</span>}{/*#__PURE__*/<span>日本語訳（任意）</span>}{/*#__PURE__*/<span style={{
                fontSize: 11,
                color: "var(--t3)",
                marginLeft: "auto"
              }}>Google翻訳等で取得</span>}</div>}{/*#__PURE__*/<textarea className="pr-textarea jp" rows={5} placeholder="Google翻訳やDeepLで翻訳した日本語を貼り付けてください。\n空欄でも英文のみで読めます。" value={prJpText} onChange={e => setPrJpText(e.target.value)} />}</div>}{/*#__PURE__*/<div style={{
            background: "var(--pl)",
            borderRadius: "var(--rs)",
            padding: "12px 14px"
          }}>{/*#__PURE__*/<div style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--p)",
              marginBottom: 7
            }}>💡 使い方</div>}{["① 英文を貼り付け → Google翻訳等で翻訳", "② 翻訳文も貼り付け → 「読む」ボタンを押す", "③ 英文の単語をタップ → 単語を保存", "④ 英文の文をタップ → フレーズを保存", "⑤ 貯まった単語でシューティングゲーム！"].map((s, __idx) => /*#__PURE__*/<div key={s?.id ?? __idx} className="jp" style={{
              fontSize: 11,
              color: "var(--p)",
              lineHeight: 1.8
            }}>{s}</div>)}</div>}{/*#__PURE__*/<button className="bp" style={{
            width: "100%",
            fontSize: 15,
            padding: "13px"
          }} disabled={!canRead} onClick={() => setPrMode('read')}>{canRead ? "📖 対訳表示で読む →" : "英文を貼り付けてください"}</button>}{prSaved.length > 0 && /*#__PURE__*/<div style={{
            background: "var(--sur)",
            borderRadius: "var(--r)",
            padding: "14px 16px",
            boxShadow: "var(--sh)"
          }}>{/*#__PURE__*/<div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10
            }}>{/*#__PURE__*/<div className="jp" style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--t2)"
              }}>⭐ 保存済み（{prSaved.length}件）</div>}{/*#__PURE__*/<button style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                background: "#EF4444",
                border: "none",
                borderRadius: 20,
                padding: "4px 10px",
                cursor: "pointer"
              }} onClick={startWordShooter}>🎮 シューティング</button>}</div>}{/*#__PURE__*/<div style={{
              display: "flex",
              flexDirection: "column",
              gap: 6
            }}>{prSaved.slice(0, 5).map((item, __idx) => /*#__PURE__*/<div key={item?.id ?? __idx} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "8px 10px",
                background: "var(--bg)",
                borderRadius: "var(--rs)"
              }}>{/*#__PURE__*/<span key={item?.id ?? __idx} style={{
                  fontSize: 11,
                  background: item.type === "word" ? "var(--pl)" : "#F0FDF4",
                  color: item.type === "word" ? "var(--p)" : "#059669",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontWeight: 600,
                  flexShrink: 0
                }}>{item.type === "word" ? "単語" : "文"}</span>}{/*#__PURE__*/<div key={item?.id ?? __idx} style={{
                  flex: 1,
                  minWidth: 0
                }}>{/*#__PURE__*/<div key={item?.id ?? __idx} style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--t)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>{item.word}</div>}{item.memo && /*#__PURE__*/<div key={item?.id ?? __idx} className="jp" style={{
                    fontSize: 11,
                    color: "var(--t3)",
                    marginTop: 2
                  }}>{item.memo}</div>}</div>}{/*#__PURE__*/<button key={item?.id ?? __idx} style={{
                  flexShrink: 0,
                  padding: 2,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "var(--t3)"
                }} onClick={() => setPrSaved(p => p.filter(x => x.id !== item.id))}>{I({
                    n: "close",
                    s: 14
                  })}</button>}</div>)}{prSaved.length > 5 && /*#__PURE__*/<div className="jp" style={{
                fontSize: 11,
                color: "var(--t3)",
                textAlign: "center"
              }}>他 {prSaved.length - 5} 件...</div>}</div>}</div>}</div>}{/*#__PURE__*/<div style={{
          height: 20
        }} />}</div>;
    }
    // ── 読むモード ──────────────────────────────────────────────────
    const sentences = prSplitSentences(prEnText);
    const hasJp = prJpText.trim().length > 0;
    return /*#__PURE__*/<div className="pr-wrap">{/*#__PURE__*/<div className="pr-toolbar">{/*#__PURE__*/<button className={"pr-sync-btn ".concat(prSyncScroll ? "pr-sync-on" : "pr-sync-off")} onClick={() => setPrSyncScroll(p => !p)}>{prSyncScroll ? "🔗 同期ON" : "🔗 同期OFF"}</button>}{/*#__PURE__*/<button className="pr-action-btn" style={{
          background: "var(--al)",
          color: "#92400E",
          border: "1px solid #FDE68A"
        }} onClick={() => {
          setPrMode('input');
          setPrPopup(false);
        }}>✏️ 編集</button>}{prSaved.length > 0 && /*#__PURE__*/<button className="pr-action-btn" style={{
          background: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #FECACA"
        }} onClick={startWordShooter}>🎮 {prSaved.length}語でシュート</button>}{/*#__PURE__*/<div style={{
          marginLeft: "auto",
          fontSize: 11,
          color: "var(--t3)",
          fontFamily: "'Noto Sans JP'",
          flexShrink: 0
        }}>単語/文タップで保存</div>}</div>}{/*#__PURE__*/<div className="pr-half pr-half-en" ref={el => {
        prEnRefEl.current = el;
      }} onScroll={handlePrScroll('en')} style={{
        flex: hasJp ? 1 : 2
      }}>{/*#__PURE__*/<div className="pr-half-label pr-half-label-en">{/*#__PURE__*/<span>🇺🇸 ENGLISH</span>}{/*#__PURE__*/<span style={{
            fontSize: 10,
            opacity: .7
          }}>{sentences.length}文</span>}</div>}{/*#__PURE__*/<div className="pr-text">{sentences.map((sent, si) => {
            const words = sent.split(/(\s+)/);
            const isSel = (prSelSent === null || prSelSent === void 0 ? void 0 : prSelSent.sentence) === sent;
            return /*#__PURE__*/<span key={sent?.id ?? si} className={"pr-sent".concat(isSel ? " sel" : "")} onClick={e => {
              var _target_classList;
              const target = e.target;
              if (target === null || target === void 0 ? void 0 : (_target_classList = target.classList) === null || _target_classList === void 0 ? void 0 : _target_classList.contains('pr-word')) return;
              handlePrSentTap(sent);
            }}>{words.map((chunk, wi) => {
                if (/^\s+$/.test(chunk)) return /*#__PURE__*/<span key={sent?.id ?? si}>{chunk}</span>;
                const clean = chunk.replace(/[^a-zA-Z''-]/g, '');
                const isWSel = (prSelWord === null || prSelWord === void 0 ? void 0 : prSelWord.word) === clean && clean.length >= 2;
                return /*#__PURE__*/<span key={sent?.id ?? si} className={"pr-word".concat(isWSel ? " sel" : "")} onClick={e => {
                  e.stopPropagation();
                  handlePrWordTap(chunk);
                }}>{chunk}</span>;
              })} </span>;
          })}</div>}</div>}{hasJp && /*#__PURE__*/<div className="pr-divider" />}{hasJp && /*#__PURE__*/<div className="pr-half pr-half-jp" ref={el => {
        prJpRefEl.current = el;
      }} onScroll={handlePrScroll('jp')}>{/*#__PURE__*/<div className="pr-half-label pr-half-label-jp">{/*#__PURE__*/<span>🇯🇵 日本語訳</span>}{/*#__PURE__*/<span style={{
            fontSize: 10,
            opacity: .7
          }}>参考訳</span>}</div>}{/*#__PURE__*/<div className="pr-text pr-text-jp">{prJpText}</div>}</div>}{prPopup && (prSelWord || prSelSent) && /*#__PURE__*/<div className="pr-popup">{/*#__PURE__*/<div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10
        }}>{/*#__PURE__*/<div>{/*#__PURE__*/<div className="jp" style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--t3)",
              marginBottom: 3
            }}>{prSelWord ? "📌 単語を保存" : "📌 フレーズを保存"}</div>}{/*#__PURE__*/<div style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--t)",
              maxWidth: 260,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>{prSelWord ? prSelWord.word : (prSelSent === null || prSelSent === void 0 ? void 0 : (_prSelSent_sentence = prSelSent.sentence) === null || _prSelSent_sentence === void 0 ? void 0 : _prSelSent_sentence.slice(0, 50)) + '...'}</div>}</div>}{/*#__PURE__*/<button style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "var(--t3)",
            padding: 4
          }} onClick={() => {
            setPrPopup(false);
            setPrSelWord(null);
            setPrSelSent(null);
          }}>{I({
              n: "close",
              s: 18
            })}</button>}</div>}{/*#__PURE__*/<input placeholder="メモ（意味・コメントなど）" value={prMemo} onChange={e => setPrMemo(e.target.value)} style={{
          width: "100%",
          padding: "9px 12px",
          border: "1.5px solid var(--bd)",
          borderRadius: "var(--rs)",
          fontSize: 13,
          outline: "none",
          fontFamily: "'Noto Sans JP',sans-serif",
          marginBottom: 10,
          background: "var(--bg)"
        }} onKeyDown={e => e.key === "Enter" && handlePrSave()} />}{/*#__PURE__*/<button className="bp" style={{
          width: "100%"
        }} onClick={handlePrSave}>⭐ 保存する</button>}</div>}</div>;
  };
  // ════════════════════════════════════════════════════════════════
  // WORD SHOOTER SCREEN
  // ════════════════════════════════════════════════════════════════
  const WordShooter = () => {
    // @ts-ignore: ws state may be referenced from outer component scope
    const hpPct = wsMaxLives > 0 ? wsLives / wsMaxLives * 100 : 0;
    const hpColor = hpPct > 60 ? '#10B981' : hpPct > 30 ? '#F59E0B' : '#EF4444';
    // ── 装備選択画面 ──────────────────────────────────────────
    // @ts-ignore: ws state may be referenced from outer component scope
    if (wsPhaseScreen === 'equip') {
      const SKILL_DEFS = [{
        key: 'shield',
        emoji: '🛡️',
        name: 'シールド',
        desc: 'HP+1（最大6）'
      }, {
        key: 'slow',
        emoji: '🐢',
        name: 'スロー',
        desc: '時間を8秒延長'
      }, {
        key: 'hint',
        emoji: '💡',
        name: 'ヒント',
        desc: '単語の先頭を光らせる'
      }, {
        key: 'heal',
        emoji: '💚',
        name: 'HP回復',
        desc: 'ピンチ時にHP+1'
      }];
      return /*#__PURE__*/<div className="eq-wrap">{/*#__PURE__*/<div style={{
          textAlign: 'center',
          marginBottom: 4
        }}>{/*#__PURE__*/<div className="eq-title">🎮 ステージ準備</div>}{/*#__PURE__*/<div className="eq-sub">スキルを最大3つ装備して開始（ガチャでチケット獲得）</div>}</div>}{/*#__PURE__*/<div className="eq-grid">{SKILL_DEFS.map((param, __idx) => {
            let {
              key,
              emoji,
              name,
              desc
            } = param;
            var _gachaSkillStock_key;
            // @ts-ignore: external state references inside WordShooter
            const stock = (_gachaSkillStock_key = gachaSkillStock[key]) !== null && _gachaSkillStock_key !== void 0 ? _gachaSkillStock_key : 0;
            // @ts-ignore: external state references inside WordShooter
            const equipped = wsEquipped.includes(key);
            return /*#__PURE__*/<div key={param?.id ?? __idx} className={"eq-card ".concat(equipped ? 'equipped' : '', " ").concat(stock <= 0 && !equipped ? 'disabled' : '')} onClick={() => stock > 0 || equipped ? toggleEquip(key) : t$("".concat(name, "のチケットがありません"))}>{/*#__PURE__*/<div key={param?.id ?? __idx} className="eq-icon">{emoji}</div>}{/*#__PURE__*/<div key={param?.id ?? __idx} className="eq-name">{name}</div>}{/*#__PURE__*/<div key={param?.id ?? __idx} className="eq-desc">{desc}</div>}{/*#__PURE__*/<div key={param?.id ?? __idx} className="eq-count">在庫 {stock}</div>}{equipped && /*#__PURE__*/<div key={param?.id ?? __idx} style={{
                fontSize: 10,
                color: '#F59E0B',
                marginTop: 4,
                fontWeight: 700
              }}>✅ 装備中</div>}</div>;
          })}</div>}{/*#__PURE__*/<div style={{
          background: 'rgba(255,255,255,.05)',
          borderRadius: 10,
          padding: '12px 14px',
          fontSize: 12,
          color: '#64748B',
          fontFamily: "'Noto Sans JP'",
          lineHeight: 1.7
        }}>💡 装備はガチャ（10pt）で入手。スキルなしでも挑戦できます。</div>}{/*#__PURE__*/<div style={{
          display: 'flex',
          gap: 10
        }}>{/*#__PURE__*/<button className="bg" style={{
            flex: 1,
            color: '#94A3B8',
            borderColor: 'rgba(255,255,255,.1)'
          }} onClick={() => {
            setWsActive(false);
            setWsPhaseScreen('equip');
          }}>戻る</button>}{/*#__PURE__*/<button className="bp" style={{
            flex: 2,
            fontSize: 15
          }} onClick={startWordShooter}>▶ ゲーム開始</button>}</div>}{/*#__PURE__*/<button style={{
          background: 'linear-gradient(135deg,#5F4724,#183153)',
          border: '1px solid rgba(184,137,50,.25)',
          borderRadius: 10,
          padding: '10px',
          color: '#fff',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: "'Noto Sans JP'"
        }} onClick={() => {
          setWsActive(false);
          setNavTab('gacha');
        }}>🎰 ガチャでスキルチケットを入手する</button>}</div>;
    }
    // ── 結果画面 ───────────────────────────────────────────────
    if (wsPhase === 'result' || wsPhaseScreen === 'result') {
      const star = wsLives >= wsMaxLives ? '🌟' : wsLives >= 3 ? '⭐' : wsLives >= 1 ? '✨' : '💀';
      const cleared = wsWordQueue.length === 0;
      if (cleared && wsScore > 0 && !wsResultRecordedRef.current) {
        wsResultRecordedRef.current = true;
        const total = Math.max(1, wsQuizWords.length);
        const correct = Math.min(total, Math.max(0, Math.round(wsScore / 10)));
        dbSaveTestResult('shooter', correct, total, wsScore);
        // ステージクリア報酬
        setTimeout(() => {
          setPts(p => p + 20);
          setGachaSkillStock(s => ({
            ...s,
            hint: (s.hint || 0) + 1
          }));
        }, 100);
      }
      return /*#__PURE__*/<div className="ws-wrap">{/*#__PURE__*/<div className="ws-result">{/*#__PURE__*/<div style={{
            fontSize: 52
          }}>{star}</div>}{/*#__PURE__*/<div style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 4
          }}>スコア {wsScore}</div>}{/*#__PURE__*/<div style={{
            display: 'flex',
            gap: 4,
            marginBottom: 10
          }}>{Array.from({
              length: wsMaxLives
            }, (_, i) => /*#__PURE__*/<span key={i} style={{
              fontSize: 16,
              opacity: i < wsLives ? 1 : .25
            }}>❤️</span>)}</div>}{/*#__PURE__*/<div className="ws-coin-badge" style={{
            marginBottom: 8
          }}>🪙 {wsCoins} コイン</div>}{cleared && /*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            color: '#34D399',
            fontWeight: 700,
            marginBottom: 8
          }}>🎉 ステージクリア！ +20pt / ヒントチケット×1</div>}{/*#__PURE__*/<div className="jp" style={{
            fontSize: 13,
            color: '#94A3B8',
            marginBottom: 20,
            textAlign: 'center',
            lineHeight: 1.7
          }}>{wsScore >= 100 ? '🔥 パーフェクト！単語マスター！' : wsScore >= 60 ? '👍 よくできました！' : '💪 もう一度挑戦！'}</div>}{/*#__PURE__*/<div style={{
            display: 'flex',
            gap: 10,
            width: '100%'
          }}>{/*#__PURE__*/<button className="bg" style={{
              flex: 1,
              color: '#94A3B8',
              borderColor: 'rgba(255,255,255,.1)'
            }} onClick={() => {
              setWsActive(false);
              setWsPhaseScreen('equip');
            }}>戻る</button>}{/*#__PURE__*/<button className="bp" style={{
              flex: 1
            }} onClick={openEquipScreen}>もう一度</button>}</div>}</div>}</div>;
    }
    // ── プレイ画面（4択方式）────────────────────────────────────
    return /*#__PURE__*/<div className="ws-wrap">{/*#__PURE__*/<div className="ws-header">{/*#__PURE__*/<div>{/*#__PURE__*/<div className="ws-score">🎯 {wsScore}</div>}{wsCombo > 1 && /*#__PURE__*/<div style={{
            fontSize: 11,
            color: '#F59E0B',
            fontWeight: 700
          }}>COMBO ×{wsCombo}</div>}</div>}{/*#__PURE__*/<div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>{/*#__PURE__*/<div className="ws-coin-badge">🪙 {wsCoins}</div>}{/*#__PURE__*/<div className="ws-lives">{Array.from({
              length: wsMaxLives
            }, (_, i) => /*#__PURE__*/<span key={i} style={{
              fontSize: i < wsLives ? 16 : 12,
              opacity: i < wsLives ? 1 : .2
            }}>❤️</span>)}</div>}</div>}{/*#__PURE__*/<button style={{
          border: 'none',
          background: 'rgba(255,255,255,.08)',
          color: '#64748B',
          borderRadius: 20,
          padding: '5px 10px',
          cursor: 'pointer',
          fontSize: 11
        }} onClick={() => {
          setWsPhase('result');
          setWsPhaseScreen('result');
        }}>終了</button>}</div>}{/*#__PURE__*/<div className="ws-hp-bar-wrap">{/*#__PURE__*/<div className="ws-hp-track">{/*#__PURE__*/<div className="ws-hp-fill" style={{
            width: "".concat(hpPct, "%"),
            background: hpColor
          }} />}</div>}</div>}{/*#__PURE__*/<div className="ws-skill-bar">{[{
          key: 'slow',
          label: '🐢',
          color: '#6366F1'
        }, {
          key: 'hint',
          label: '💡',
          color: '#F59E0B'
        }, {
          key: 'heal',
          label: '💚',
          color: '#10B981'
        }].map((param, __idx) => {
          let {
            key,
            label,
            color
          } = param;
          return /*#__PURE__*/<button key={param?.id ?? __idx} className={"ws-skill-btn ".concat(wsSkills[key] > 0 ? 'ready' : '')} style={{
            background: wsSkills[key] > 0 ? color + '33' : 'rgba(255,255,255,.05)',
            color: wsSkills[key] > 0 ? color : '#334155',
            border: "1px solid ".concat(wsSkills[key] > 0 ? color + '66' : 'rgba(255,255,255,.08)')
          }} disabled={wsSkills[key] <= 0} onClick={() => activateWsSkill(key)}>{label} {/*#__PURE__*/<span key={param?.id ?? __idx} style={{
              fontSize: 9
            }}>×{wsSkills[key]}</span>}</button>;
        })}{/*#__PURE__*/<button className="ws-skill-btn" style={{
          background: 'rgba(251,191,36,.1)',
          color: '#FCD34D',
          border: '1px solid rgba(251,191,36,.2)',
          flexShrink: 0,
          minWidth: 52
        }} disabled={wsCoins < 5} onClick={wsGachaSkill}>🎰{/*#__PURE__*/<br />}{/*#__PURE__*/<span style={{
            fontSize: 9
          }}>{wsCoins}/5</span>}</button>}</div>}{/*#__PURE__*/<div className="ws-field">{wsFlash && /*#__PURE__*/<div className="ws-miss-flash" />}{wsWrong && /*#__PURE__*/<div className="ws-wrong-popup" style={{
          left: 8,
          right: 8,
          bottom: 8
        }}>{/*#__PURE__*/<div style={{
            color: '#EF4444',
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 4
          }}>❌ ミス！</div>}{/*#__PURE__*/<div style={{
            color: '#fff',
            fontSize: 15,
            fontWeight: 700
          }}>{wsWrong.en}</div>}{/*#__PURE__*/<div style={{
            color: '#94A3B8',
            fontSize: 12,
            fontFamily: "'Noto Sans JP'",
            marginTop: 2
          }}>正解の意味: {wsWrong.correct}</div>}{wsWrong.jp && wsWrong.jp !== wsWrong.correct && /*#__PURE__*/<div style={{
            color: '#D8C7A1',
            fontSize: 11,
            marginTop: 3,
            fontFamily: "'Noto Sans JP'"
          }}>あなたが選んだ日本語の英語: {wsWrong.jp}</div>}</div>}{activeWords().map((word, idx) => (wsChoiceResult?.wordId === word.id && wsChoiceResult?.sel === word.jp) ? /*#__PURE__*/<div key={word.id} className="ws-word ws-hit" style={{
          left: "".concat(word.x, "%"),
          top: '40%'
        }}>{/*#__PURE__*/<div className="ws-word-en" style={{
            background: 'rgba(16,185,129,.8)'
          }}>{word.en} OK</div>}</div> : /*#__PURE__*/<div key={word.id} className="ws-word" style={{
          left: "".concat(word.x, "%"),
          animationDuration: "".concat(Math.max(4.5, (wsSlowed ? 18 : 9) - (wsStage - 1) * 1.2 - Math.max(0, wsQuizWords.length - wsWordQueue.length - activeWords().length) * 0.15), "s"),
          animationDelay: (() => {
            const elapsedMs = Math.max(0, Date.now() - Number(word.startedAt || Date.now()) - Number(word.delayMs || 0));
            return elapsedMs > 0 ? "-".concat(elapsedMs / 1000, "s") : "".concat(Number(word.delayMs || idx * 350) / 1000, "s");
          })()
        }} onAnimationEnd={() => handleWsChoice('__timeout__', word.id)}>{/*#__PURE__*/<div className="ws-word-en">{wsSkills.hint > 0 ? /*#__PURE__*/<>{/*#__PURE__*/<span style={{
              color: '#FCD34D',
              textDecoration: 'underline'
            }}>{word.en[0]}</span>}{word.en.slice(1)}</> : word.en}</div>}</div>)}{wsWordQueue.length === 0 && activeWords().length === 0 && wsPhase === 'play' && /*#__PURE__*/<div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>{/*#__PURE__*/<div style={{
            color: '#fff',
            fontSize: 22,
            fontWeight: 700
          }}>🎉 クリア！</div>}</div>}{/*#__PURE__*/<div className="ws-active-count">残り {wsWordQueue.length + activeWords().length} / Stage {wsStage}</div>}</div>}{/*#__PURE__*/<div className="ws-choices">{wsChoices.map((jp, i) => {
          const isSelected = (wsChoiceResult === null || wsChoiceResult === void 0 ? void 0 : wsChoiceResult.sel) === jp;
          const isCorrect = wsChoiceResult && jp === wsChoiceResult.correct;
          const isWrong = isSelected && jp !== (wsChoiceResult === null || wsChoiceResult === void 0 ? void 0 : wsChoiceResult.correct);
          return /*#__PURE__*/<button key={jp?.id ?? i} className={"ws-choice ".concat(isCorrect ? 'correct' : '', " ").concat(isWrong ? 'wrong' : '')} onClick={() => handleWsChoice(jp)}>{jp}</button>;
        })}</div>}</div>;
  };
  ;
  // ════════════════════════════════════════════════════════════════
  // NEWS SCREENS
  // ════════════════════════════════════════════════════════════════
  // ── ニュースハブ ─────────────────────────────────────────────
  const NewsCountryHub = () => /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="nhub">{/*#__PURE__*/<div style={{
        fontSize: 11,
        fontWeight: 700,
        color: "var(--t3)",
        textTransform: "uppercase",
        letterSpacing: .5,
        padding: "0 2px"
      }}>News Country</div>}{/*#__PURE__*/<div style={{
        background: "linear-gradient(135deg,#183153,#2F5D62,#5F4724)",
        borderRadius: "var(--r)",
        padding: "18px 16px",
        color: "#fff",
        boxShadow: "0 14px 34px rgba(24,49,83,.18)",
        border: "1px solid rgba(255,255,255,.14)"
      }}>{/*#__PURE__*/<div className="jp" style={{
          fontSize: 18,
          fontWeight: 800,
          marginBottom: 8
        }}>海外生活を先取りするニュース学習</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 12,
          lineHeight: 1.75,
          opacity: .9
        }}>普段見ているニュースを、海外で見るであろうニュースに置き換える。アメリカ・インド・フィリピンのニュースを通じて、英語だけでなく現地感覚にも触れる。</div>}</div>}{NEWS_COUNTRY_ORDER.map(key => {
        const country = NEWS_COUNTRIES[key];
        return /*#__PURE__*/<button key={key} className="nsvc" style={{
          width: "100%",
          textAlign: "left",
          border: key === 'us' ? "2px solid var(--p)" : "1px solid var(--bd)",
          cursor: "pointer"
        }} onClick={() => openNewsCountry(key)}>{/*#__PURE__*/<div className="nsvc-hd">{/*#__PURE__*/<div className="nsvc-ico" style={{
              background: key === 'us' ? "#183153" : key === 'india' ? "#F0FDF4" : "#EFF6FF",
              color: key === 'us' ? "#fff" : key === 'india' ? "#047857" : "#1D4ED8",
              fontSize: 13,
              fontWeight: 800
            }}>{country.shortLabel}</div>}{/*#__PURE__*/<div style={{
              flex: 1
            }}>{/*#__PURE__*/<div className="nsvc-t">{country.label} {/*#__PURE__*/<span style={{
                  fontSize: 11,
                  background: key === 'us' ? "var(--pl)" : "#F8FAFC",
                  color: key === 'us' ? "var(--p)" : "var(--t2)",
                  padding: "1px 6px",
                  borderRadius: 4,
                  fontWeight: 600,
                  marginLeft: 4
                }}>{country.badge}</span>}</div>}{/*#__PURE__*/<div className="nsvc-d">{country.description}</div>}</div>}{I({
              n: "chR",
              s: 18,
              c: key === 'us' ? "var(--p)" : "var(--t3)"
            })}</div>}</button>;
      })}</div>}{/*#__PURE__*/<div style={{
      height: 20
    }} />}</div>;
  const NewsHub = () => /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="nhub">{/*#__PURE__*/<div style={{
        fontSize: 11,
        fontWeight: 700,
        color: "var(--t3)",
        textTransform: "uppercase",
        letterSpacing: .5,
        padding: "0 2px"
      }}>📰 英語ニュース学習</div>}{/*#__PURE__*/<div style={{
        background: "linear-gradient(135deg,#0B1F38,#183153,#5F4724)",
        borderRadius: "var(--r)",
        padding: "18px 16px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(184,137,50,.28)",
        boxShadow: "0 14px 34px rgba(24,49,83,.18)"
      }}>{/*#__PURE__*/<div style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(184,137,50,.12)",
          top: -20,
          right: -20
        }} />}{/*#__PURE__*/<div style={{
          fontSize: 11,
          fontWeight: 700,
          opacity: .8,
          textTransform: "uppercase",
          letterSpacing: .5,
          marginBottom: 6,
          fontFamily: "'Noto Sans JP'"
        }}>⭐ おすすめ</div>}{/*#__PURE__*/<div style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 4
        }}>📖 英文記事リーダー</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 12,
          opacity: .85,
          lineHeight: 1.7,
          marginBottom: 14
        }}>英文記事や教材を貼って、読む学習に変換。{/*#__PURE__*/<br />}必要なら日本語訳を並べて確認できます。{/*#__PURE__*/<br />}気になる単語・フレーズは単語帳に保存。</div>}{/*#__PURE__*/<div style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 14
        }}>{["記事を貼る", "訳と見比べる", "単語保存"].map((f, __idx) => /*#__PURE__*/<span key={f?.id ?? __idx} className="jp" style={{
            fontSize: 11,
            background: "rgba(255,255,255,.14)",
            border: "1px solid rgba(255,255,255,.14)",
            padding: "3px 8px",
            borderRadius: 10
          }}>{f}</span>)}</div>}{/*#__PURE__*/<button style={{
          background: "rgba(255,253,248,.95)",
          color: "#183153",
          border: "1px solid rgba(184,137,50,.22)",
          borderRadius: "var(--rs)",
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Noto Sans JP'",
          width: "100%"
        }} onClick={() => setNewsScreen('parallelReader')}>{prSaved.length > 0 ? "続きを読む（単語 ".concat(prSaved.length, "件保存済）") : "英文記事リーダーを開く →"}</button>}</div>}{/*#__PURE__*/<div className="nsvc">{/*#__PURE__*/<div className="nsvc-hd">{/*#__PURE__*/<div className="nsvc-ico" style={{
            background: "var(--pl)"
          }}>📊</div>}{/*#__PURE__*/<div>{/*#__PURE__*/<div className="nsvc-t">News in Levels</div>}{/*#__PURE__*/<div className="nsvc-d">外部サイトでレベルを選んで読む。アプリ内学習は下のBBC/Page Sixへ</div>}</div>}</div>}{/*#__PURE__*/<div style={{
          padding: "0 16px 6px",
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }}>{["Level 1-3", "外部サイト", "無料教材"].map((f, __idx) => /*#__PURE__*/<span key={f?.id ?? __idx} style={{
            fontSize: 11,
            background: "var(--pl)",
            color: "var(--p)",
            padding: "3px 8px",
            borderRadius: 10,
            fontWeight: 500,
            fontFamily: "'Noto Sans JP'"
          }}>{f}</span>)}</div>}{/*#__PURE__*/<a className="next" href="https://www.newsinlevels.com/" target="_blank" rel="noreferrer">{/*#__PURE__*/<div style={{
            textAlign: "left"
          }}>{/*#__PURE__*/<div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--p)"
            }}>News in Levels を開く</div>}{/*#__PURE__*/<div style={{
              fontSize: 11,
              color: "var(--t3)",
              fontFamily: "'Noto Sans JP'"
            }}>レベル選択はサイト側で行います</div>}</div>}{I({
            n: "extlnk",
            s: 16,
            c: "var(--p)"
          })}</a>}</div>}{/*#__PURE__*/<div className="nsvc">{/*#__PURE__*/<div className="nsvc-hd">{/*#__PURE__*/<div className="nsvc-ico" style={{
            background: "#FFF7ED"
          }}>⚡</div>}{/*#__PURE__*/<div>{/*#__PURE__*/<div className="nsvc-t">Breaking News English</div>}{/*#__PURE__*/<div className="nsvc-d">最新ニュース＋リスニング＋語彙問題つき</div>}</div>}</div>}{[{
          name: "最新記事一覧",
          url: "https://breakingnewsenglish.com/",
          desc: "今日のニュース"
        }, {
          name: "リスニング練習",
          url: "https://breakingnewsenglish.com/listening.html",
          desc: "音声付き記事"
        }].map((param, __idx) => {
          let {
            name,
            url,
            desc
          } = param;
          return /*#__PURE__*/<a key={param?.id ?? __idx} className="next" href={url} target="_blank" rel="noreferrer">{/*#__PURE__*/<div key={param?.id ?? __idx} style={{
              textAlign: "left"
            }}>{/*#__PURE__*/<div key={param?.id ?? __idx} style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#C2410C"
              }}>{name}</div>}{/*#__PURE__*/<div key={param?.id ?? __idx} style={{
                fontSize: 11,
                color: "var(--t3)",
                fontFamily: "'Noto Sans JP'"
              }}>{desc}</div>}</div>}{I({
              n: "extlnk",
              s: 16,
              c: "#C2410C"
            })}</a>;
        })}</div>}{/*#__PURE__*/<div className="nsvc" style={{
        border: "2px solid var(--p)"
      }}>{/*#__PURE__*/<div className="nsvc-hd">{/*#__PURE__*/<div className="nsvc-ico" style={{
            background: "#183153",
            fontSize: 16,
            color: "#fff",
            fontWeight: 700
          }}>BBC</div>}{/*#__PURE__*/<div style={{
            flex: 1
          }}>{/*#__PURE__*/<div className="nsvc-t">BBC News {/*#__PURE__*/<span style={{
                fontSize: 11,
                background: "var(--pl)",
                color: "var(--p)",
                padding: "1px 6px",
                borderRadius: 4,
                fontWeight: 600,
                marginLeft: 4
              }}>RSS要約学習</span>}</div>}{/*#__PURE__*/<div className="nsvc-d">BBC公式RSSの要約で読む。AI翻訳は保存済みなら0コイン</div>}</div>}</div>}{/*#__PURE__*/<div style={{
          padding: "0 16px 6px",
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }}>{["英語の特徴", "単語タップ → 意味", "文タップ → 和訳", "全文翻訳OFF→必要時だけON"].map((f, __idx) => /*#__PURE__*/<span key={f?.id ?? __idx} style={{
            fontSize: 11,
            background: "var(--pl)",
            color: "var(--p)",
            padding: "3px 8px",
            borderRadius: 10,
            fontWeight: 500,
            fontFamily: "'Noto Sans JP'"
          }}>{f}</span>)}</div>}{/*#__PURE__*/<button className="next" style={{
          color: "var(--p)",
          background: "var(--pl)",
          borderTop: "2px solid var(--p)"
        }} onClick={openBBCList}>{/*#__PURE__*/<span className="jp" style={{
            fontSize: 14,
            fontWeight: 700
          }}>🗞️ BBC要約で読む（学習モード）</span>}{I({
            n: "chR",
            s: 18,
            c: "var(--p)"
          })}</button>}</div>}{/*#__PURE__*/<div className="nsvc" style={{
        border: "1.5px solid rgba(184,137,50,.35)"
      }}>{/*#__PURE__*/<div className="nsvc-hd">{/*#__PURE__*/<div className="nsvc-ico" style={{
            background: "#5F4724",
            fontSize: 13,
            color: "#fff",
            fontWeight: 800
          }}>P6</div>}{/*#__PURE__*/<div style={{
            flex: 1
          }}>{/*#__PURE__*/<div className="nsvc-t">Page Six {/*#__PURE__*/<span style={{
                fontSize: 11,
                background: "#FBF3DF",
                color: "#8A5A18",
                padding: "1px 6px",
                borderRadius: 4,
                fontWeight: 600,
                marginLeft: 4
              }}>RSS要約学習</span>}</div>}{/*#__PURE__*/<div className="nsvc-d">芸能・エンタメ英語の短いRSS要約で読む。本文は原文リンクで確認</div>}</div>}</div>}{/*#__PURE__*/<div style={{
          padding: "0 16px 6px",
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }}>{["会話で出やすい表現", "短い要約で読む", "原文リンク付き"].map((f, __idx) => /*#__PURE__*/<span key={f?.id ?? __idx} style={{
            fontSize: 11,
            background: "#FBF3DF",
            color: "#8A5A18",
            padding: "3px 8px",
            borderRadius: 10,
            fontWeight: 500,
            fontFamily: "'Noto Sans JP'"
          }}>{f}</span>)}</div>}{/*#__PURE__*/<button className="next" style={{
          color: "#8A5A18",
          background: "#FBF3DF",
          borderTop: "1.5px solid rgba(184,137,50,.35)"
        }} onClick={openPageSixList}>{/*#__PURE__*/<span className="jp" style={{
            fontSize: 14,
            fontWeight: 700
          }}>✨ Page Six要約で読む（学習モード）</span>}{I({
            n: "chR",
            s: 18,
            c: "#8A5A18"
          })}</button>}</div>}{/*#__PURE__*/<div style={{
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
        }}>💡 使い方ガイド</div>}{[{
          icon: "1️⃣",
          text: "BBC公式RSSの要約をアプリ内で読む（翻訳は出さない）"
        }, {
          icon: "2️⃣",
          text: "わからない単語をタップ → 意味を確認"
        }, {
          icon: "3️⃣",
          text: "わからない文をタップ → 日本語訳を確認"
        }, {
          icon: "4️⃣",
          text: "全部読み終えたら全文翻訳で確認"
        }].map((param, __idx) => {
          let {
            icon,
            text
          } = param;
          return /*#__PURE__*/<div key={param?.id ?? __idx} style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 8
          }}>{/*#__PURE__*/<span key={param?.id ?? __idx} style={{
              fontSize: 16,
              flexShrink: 0
            }}>{icon}</span>}{/*#__PURE__*/<span key={param?.id ?? __idx} className="jp" style={{
              fontSize: 12,
              color: "var(--t2)",
              lineHeight: 1.6
            }}>{text}</span>}</div>;
        })}</div>}</div>}{/*#__PURE__*/<div style={{
      height: 20
    }} />}</div>;
  // ── BBC記事リスト ─────────────────────────────────────────────
  const BBCList = () => {
    const isPageSix = newsSource === 'pagesix';
    const countryConfig = NEWS_COUNTRIES[newsCountry] || NEWS_COUNTRIES.us;
    const CATS = !isPageSix && newsCountry !== 'us' ? countryConfig.feeds.map(feed => ({
      id: feed.id,
      label: feed.label
    })) : isPageSix ? [{
      id: "latest",
      label: "✨ 最新"
    }, {
      id: "celebrity",
      label: "🎬 セレブ"
    }, {
      id: "entertainment",
      label: "🎭 エンタメ"
    }, {
      id: "style",
      label: "👗 Style"
    }] : [{
      id: "world",
      label: "🌍 世界"
    }, {
      id: "science",
      label: "🔬 科学"
    }, {
      id: "tech",
      label: "💻 テクノロジー"
    }, {
      id: "business",
      label: "📈 ビジネス"
    }];
    return /*#__PURE__*/<div className="sa">{/*#__PURE__*/<div className="ncat-tabs">{CATS.map((param, __idx) => {
          let {
            id,
            label
          } = param;
          return /*#__PURE__*/<button key={param?.id ?? __idx} className={"ncat ".concat(bbcFeed === id ? "on" : "off")} onClick={() => loadBBCFeed(id)}>{label}</button>;
        })}</div>}{bbcLoading && /*#__PURE__*/<div style={{
        padding: "40px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12
      }}>{/*#__PURE__*/<div className="spin" style={{
          width: 28,
          height: 28,
          borderWidth: 3
        }} />}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 13,
          color: "var(--t3)"
        }}>{isPageSix ? 'Page Six' : newsCountry === 'us' ? 'BBC' : countryConfig.label} RSSを読み込み中...</div>}</div>}{!bbcLoading && bbcArticles.length === 0 && /*#__PURE__*/<div className="empty">{/*#__PURE__*/<div style={{
          fontSize: 40,
          marginBottom: 10
        }}>📡</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 14,
          fontWeight: 600,
          color: "var(--t2)",
          marginBottom: 4
        }}>記事を取得できませんでした</div>}{/*#__PURE__*/<div className="jp" style={{
          fontSize: 12,
          marginBottom: 16
        }}>接続を確認して再試行してください</div>}{/*#__PURE__*/<button className="bp" onClick={() => loadBBCFeed(bbcFeed)}>再読み込み</button>}</div>}{!bbcLoading && bbcArticles.length > 0 && /*#__PURE__*/<div style={{
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}>{/*#__PURE__*/<div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>{/*#__PURE__*/<div className="jp" style={{
            fontSize: 12,
            color: "var(--t3)"
          }}>{bbcArticles.length}件のRSS要約</div>}{/*#__PURE__*/<a href={isPageSix ? "https://pagesix.com/" : countryConfig.sourceHomeUrl} target="_blank" rel="noreferrer" style={{
            fontSize: 11,
            color: "var(--p)",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontWeight: 600,
            textDecoration: "none"
          }}>{isPageSix ? 'PageSix.com' : newsCountry === 'us' ? 'BBC.com' : countryConfig.label}で開く {I({
              n: "extlnk",
              s: 12,
              c: "var(--p)"
            })}</a>}</div>}{bbcArticles.map((art, __idx) => /*#__PURE__*/<button key={art?.id ?? __idx} className="nacard" onClick={() => openBBCArticle(art)}>{/*#__PURE__*/<div key={art?.id ?? __idx} className="nacard-t">{art.title}</div>}{/*#__PURE__*/<div key={art?.id ?? __idx} className="nacard-d jp">{art.description}</div>}{/*#__PURE__*/<div key={art?.id ?? __idx} className="nacard-m">{/*#__PURE__*/<span key={art?.id ?? __idx} style={{
              fontSize: 11,
              background: isPageSix ? "#FBF3DF" : "var(--pl)",
              color: isPageSix ? "#8A5A18" : "var(--p)",
              padding: "2px 6px",
              borderRadius: 4,
              fontWeight: 600
            }}>{isPageSix ? 'Page Six' : art.sourceLabel || (newsCountry === 'us' ? 'BBC' : countryConfig.label)}</span>}{/*#__PURE__*/<span key={art?.id ?? __idx}>{new Date(art.pubDate).toLocaleDateString("ja-JP", {
                month: "short",
                day: "numeric"
              })}</span>}{/*#__PURE__*/<span key={art?.id ?? __idx} style={{
              marginLeft: "auto",
              color: "var(--p)",
              fontWeight: 600
            }}>読む →</span>}</div>}</button>)}</div>}{/*#__PURE__*/<div style={{
        height: 20
      }} />}</div>;
  };
  // ── BBC記事リーダー（学習モード）─────────────────────────────
  const BBCReader = () => {
    if (!curArticle) return null;
    const fullText = curArticle.description;
    const sentences = splitSentences(fullText);
    const TransPanel = () => {
      const hasContent = selWord || selSent || showFull;
      return /*#__PURE__*/<div className="tp">{/*#__PURE__*/<div className="tp-bar">{/*#__PURE__*/<button className={"tpbtn tpbtn-g".concat(showFull ? " on" : "")} onClick={handleFullTrans}>{transLoading && showFull ? /*#__PURE__*/<>{/*#__PURE__*/<div className="spin" style={{
                width: 12,
                height: 12,
                borderWidth: 2
              }} />} 翻訳中...</> : showFull ? "📄 全文翻訳 ON" : fullTrans ? "📄 保存済み全文翻訳を表示（🪙0）" : "📄 全文翻訳（🪙5コイン）"}</button>}{hasContent && /*#__PURE__*/<button className="tpbtn tpbtn-g" onClick={() => {
            setSelWord(null);
            setSelSent(null);
            setWordData(null);
            setSentData(null);
            setShowFull(false);
          }}>✕ クリア</button>}{/*#__PURE__*/<div style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "var(--t3)",
            fontFamily: "'Noto Sans JP'",
            flexShrink: 0
          }}>{/*#__PURE__*/<span>単語タップ</span>}{/*#__PURE__*/<span style={{
              color: "var(--bd)"
            }}>|</span>}{/*#__PURE__*/<span>文タップ</span>}</div>}</div>}{/*#__PURE__*/<div className="tp-body">{transLoading && /*#__PURE__*/<div className="tp-ld">{/*#__PURE__*/<div className="spin" style={{
              width: 16,
              height: 16,
              borderWidth: 2
            }} />}{/*#__PURE__*/<span>AIが翻訳中...</span>}</div>}{!transLoading && selWord && wordData && /*#__PURE__*/<div className="wm-box">{/*#__PURE__*/<div className="wm-word">{selWord.word}</div>}{wordData.pos && /*#__PURE__*/<div className="wm-pos">{wordData.pos}</div>}{/*#__PURE__*/<div className="wm-def">{wordData.meaning}</div>}{wordData.example && /*#__PURE__*/<div className="wm-ex">例：{wordData.example}</div>}</div>}{!transLoading && selSent && sentData && /*#__PURE__*/<div className="st-box">{/*#__PURE__*/<div className="st-en">{selSent.sentence}</div>}{/*#__PURE__*/<div className="st-jp">{sentData}</div>}</div>}{!transLoading && showFull && fullTrans && /*#__PURE__*/<div className="ft-box">{fullTrans}</div>}{!transLoading && !hasContent && /*#__PURE__*/<div className="tp-empty">{/*#__PURE__*/<span style={{
              fontSize: 28
            }}>👆</span>}{/*#__PURE__*/<span style={{
              fontSize: 13,
              fontWeight: 600
            }}>単語をタップ → 意味</span>}{/*#__PURE__*/<span style={{
              fontSize: 12
            }}>文をタップ → 日本語訳</span>}</div>}</div>}</div>;
    };
    return /*#__PURE__*/<div className="rd-wrap">{/*#__PURE__*/<div className="rd-art">{/*#__PURE__*/<div className="rd-title">{curArticle.title}</div>}{/*#__PURE__*/<div className="rd-meta">{/*#__PURE__*/<span style={{
            fontSize: 12,
            background: newsSource === 'pagesix' ? "#5F4724" : "#183153",
            color: "#fff",
            padding: "2px 7px",
            borderRadius: 4,
            fontWeight: 700
          }}>{newsSource === 'pagesix' ? 'Page Six' : 'BBC'}</span>}{/*#__PURE__*/<span>{new Date(curArticle.pubDate).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}</span>}{/*#__PURE__*/<a href={curArticle.link} target="_blank" rel="noreferrer" style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "var(--p)",
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontWeight: 600,
            textDecoration: "none"
          }}>原文を開く {I({
              n: "extlnk",
              s: 11,
              c: "var(--p)"
            })}</a>}</div>}{/*#__PURE__*/<div className="rd-para">{sentences.map((sent, si) => {
            const words = sent.split(/(\s+)/);
            const isSentSel = (selSent === null || selSent === void 0 ? void 0 : selSent.sentence) === sent;
            return /*#__PURE__*/<span key={sent?.id ?? si} className={"rd-sent".concat(isSentSel ? " hi" : "")} onClick={e => {
              // 単語クリックと文クリックを区別
              if (e.target.classList.contains('rd-word')) return;
              handleSentTap(sent);
            }}>{words.map((chunk, wi) => {
                if (/^\s+$/.test(chunk)) return /*#__PURE__*/<span key={sent?.id ?? si}>{chunk}</span>;
                const clean = chunk.replace(/[^a-zA-Z'-]/g, '');
                const isWordSel = (selWord === null || selWord === void 0 ? void 0 : selWord.word) === clean;
                return /*#__PURE__*/<span key={sent?.id ?? si} className={"rd-word".concat(isWordSel ? " hi" : "")} onClick={e => {
                  e.stopPropagation();
                  handleWordTap(chunk, sent);
                }}>{chunk}</span>;
              })} </span>;
          })}</div>}{/*#__PURE__*/<div style={{
          background: "var(--pl)",
          borderRadius: "var(--rs)",
          padding: "10px 12px",
          marginTop: 4
        }}>{/*#__PURE__*/<div className="jp" style={{
            fontSize: 11,
            color: "var(--p)",
            lineHeight: 1.7
          }}>💡 {/*#__PURE__*/<b>単語タップ</b>}で意味を表示　{/*#__PURE__*/<b>文タップ</b>}で和訳を表示{/*#__PURE__*/<br />}まず英語だけで読んで、わからない部分だけ確認しよう</div>}</div>}{/*#__PURE__*/<div style={{
          height: 10
        }} />}</div>}{/*#__PURE__*/<TransPanel />}</div>;
  };
  // ════════════════════════════════════════════════════════════════
  // PARALLEL READER HANDLERS
  // ════════════════════════════════════════════════════════════════
  const prEnRefEl = typeof window !== 'undefined' ? {
    current: null
  } : {
    current: null
  };
  const prJpRefEl = typeof window !== 'undefined' ? {
    current: null
  } : {
    current: null
  };
  // 同時スクロール
  const handlePrScroll = src => e => {
    if (!prSyncScroll) return;
    const ratio = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight || 1);
    const other = src === 'en' ? prJpRefEl.current : prEnRefEl.current;
    if (other) other.scrollTop = ratio * (other.scrollHeight - other.clientHeight);
  };
  // 英文を文単位に分割（インタラクティブ表示用）
  const prSplitSentences = text => {
    var _text_match;
    if (!text.trim()) return [];
    const sentRe = new RegExp('[^.!?\\n]+[.!?\\n]*', 'g');
    return ((_text_match = text.match(sentRe)) === null || _text_match === void 0 ? void 0 : _text_match.map((s, __idx) => s.trim()).filter(Boolean)) || [text];
  };
  // 単語タップ
  const handlePrWordTap = word => {
    const clean = word.replace(/[^a-zA-Z''-]/g, '');
    if (clean.length < 2) return;
    setPrSelWord({
      word: clean
    });
    setPrSelSent(null);
    setPrPopup(true);
    setPrMemo('');
  };
  // 文タップ
  const handlePrSentTap = sent => {
    if ((prSelSent === null || prSelSent === void 0 ? void 0 : prSelSent.sentence) === sent) {
      setPrSelSent(null);
      return;
    }
    setPrSelSent({
      sentence: sent
    });
    setPrSelWord(null);
    setPrPopup(true);
    setPrMemo('');
  };
  // 単語・文を保存
  const handlePrSave = () => {
    const item = prSelWord ? {
      id: Date.now() + '',
      type: 'word',
      word: prSelWord.word,
      meaning: '',
      memo: prMemo,
      date: new Date().toLocaleDateString('ja-JP')
    } : prSelSent ? {
      id: Date.now() + '',
      type: 'sent',
      word: prSelSent.sentence.slice(0, 60) + (prSelSent.sentence.length > 60 ? '...' : ''),
      meaning: '',
      memo: prMemo,
      date: new Date().toLocaleDateString('ja-JP')
    } : null;
    if (!item) return;
    setPrSaved(p => [item, ...p]);
    setPrPopup(false);
    setPrSelWord(null);
    setPrSelSent(null);
    t$('⭐ 保存しました！');
  };
  // シューター用に単語リストを準備
  // ── 問題プールを構築（API → 保存単語 → ダミー の順で取得）──
  const buildWordPool = () => {
    if (wsQuizWords.length >= 4) return wsQuizWords;
    const saved2 = prSaved.filter(s => s.type === 'word' && s.word && s.meaning);
    if (saved2.length >= 4) return saved2.map((s, __idx) => ({
      en: s.word,
      jp: s.meaning
    }));
    return [{
      en: 'momentum',
      jp: '勢い'
    }, {
      en: 'revenue',
      jp: '収益'
    }, {
      en: 'mandate',
      jp: '指示'
    }, {
      en: 'efficient',
      jp: '効率的な'
    }, {
      en: 'allocate',
      jp: '割り当てる'
    }, {
      en: 'acquire',
      jp: '取得する'
    }, {
      en: 'negotiate',
      jp: '交渉する'
    }, {
      en: 'implement',
      jp: '実施する'
    }, {
      en: 'facilitate',
      jp: '促進する'
    }, {
      en: 'collaborate',
      jp: '協力する'
    }, {
      en: 'mandatory',
      jp: '義務的な'
    }, {
      en: 'comprehensive',
      jp: '包括的な'
    }, {
      en: 'substantial',
      jp: '相当な'
    }, {
      en: 'tentative',
      jp: '暫定的な'
    }, {
      en: 'proficient',
      jp: '熟練した'
    }, {
      en: 'streamline',
      jp: '合理化する'
    }, {
      en: 'outsource',
      jp: '外部委託する'
    }];
  };
  // ── 4択選択肢を生成（正解1 + ダミー3）────────────────────────
  const activeWords = () => Array.isArray(wsCurrentWord) ? wsCurrentWord : wsCurrentWord ? [wsCurrentWord] : [];
  const stageSize = (done, total) => {
    if (total <= 5) return done < 2 ? 1 : done < 4 ? 2 : 3;
    if (done < Math.ceil(total / 3)) return 1;
    if (done < Math.ceil(total * 2 / 3)) return 2;
    return 3;
  };
  const makeActiveWord = (word, slot) => {
    const lanes = [18, 48, 72];
    return {
      id: "".concat(Date.now(), "-").concat(slot, "-").concat(Math.random().toString(36).slice(2, 7)),
      en: word.en,
      jp: word.jp,
      x: lanes[slot % lanes.length] + (Math.random() * 8 - 4),
      startedAt: Date.now(),
      delayMs: slot * 350
    };
  };
  const makeChoices = (correct, pool) => {
    const corrects = Array.from(new Set((Array.isArray(correct) ? correct : [correct]).filter(Boolean)));
    const correctSet = new Set(corrects);
    const wrong = [];
    shuffle(pool).forEach(w => {
      if (wrong.length >= 8 - corrects.length) return;
      if (!w.jp || correctSet.has(w.jp) || wrong.includes(w.jp)) return;
      wrong.push(w.jp);
    });
    ['契約', '請求書', '在庫', '面接', '部署', '締切', '承認', '予算', '研修', '顧客'].forEach(jp => {
      if (wrong.length >= 8 - corrects.length) return;
      if (!correctSet.has(jp) && !wrong.includes(jp)) wrong.push(jp);
    });
    return shuffle([...corrects, ...wrong]).slice(0, 8);
  };
  // ── 次の問題をセット ─────────────────────────────────────────
  const refreshShooter = (nextActive, nextQueue) => {
    const total = Math.max(wsQuizWords.length, nextActive.length + nextQueue.length);
    const done = Math.max(0, total - nextActive.length - nextQueue.length);
    const target = stageSize(done, total);
    const filled = [...nextActive];
    const rest = [...nextQueue];
    while (filled.length < target && rest.length) {
      filled.push(makeActiveWord(rest.shift(), filled.length));
    }
    setWsStage(target);
    setWsWordQueue(rest);
    setWsCurrentWord(filled.length ? filled : null);
    setWsChoices(filled.length ? makeChoices(filled.map(w => w.jp), [...buildWordPool(), ...wsQuizWords]) : []);
    setWsChoiceResult(null);
    if (!filled.length && !rest.length) {
      setWsPhase('result');
      setWsActive(false);
      setWsPhaseScreen('result');
    }
  };
  const nextQuestion = (queue, current = []) => refreshShooter(current, queue);
  // ── ステージ開始 ─────────────────────────────────────────────
  const startWordShooter = async function () {
    let mode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'test';
    if (mode !== 'practice' && mode !== 'test') mode = 'test';
    const cost = mode === 'practice' ? COIN_COSTS.PRACTICE : COIN_COSTS.TEST;
    const requestedCount = mode === 'practice' ? 5 : 10;
    const localPool = buildWordPool();
    const rankedPool = localPool.map(word => {
      const vote = Number(studyVotes[`shooter:${word.en}`] || 0);
      const weight = vote > 0 ? 1.35 : vote < 0 ? 0.7 : 1;
      return { word, key: Math.random() ** (1 / weight) };
    }).sort((a, b) => b.key - a.key).map(item => item.word);
    if (!localPool.length) {
      t$('Word pool is empty.', 'warn');
      return;
    }
    if (SB_READY && wallet.coins < cost) {
      t$("Not enough coins: ".concat(cost), 'warn');
      return;
    }
    let generatedWords = [];
    if (mode === 'test') {
      try {
        const r = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quizType: 'word',
            sourceType: 'toeic',
            level: 'level_600',
            count: 5,
            forceRegen: true
          })
        });
        if (r.ok) {
          const d = await r.json();
          if (Array.isArray(d.questions) && d.questions.length > 0) {
            rememberGeneratedQuestions('shooter', d.questions);
            generatedWords = d.questions.map((q, __idx) => {
              var _q_word, _ref, _q_meaning, _ref1;
              return {
                en: (_ref = (_q_word = q.word) !== null && _q_word !== void 0 ? _q_word : q.en) !== null && _ref !== void 0 ? _ref : '',
                jp: (_ref1 = (_q_meaning = q.meaning) !== null && _q_meaning !== void 0 ? _q_meaning : q.jp) !== null && _ref1 !== void 0 ? _ref1 : ''
              };
            }).filter(w => w.en && w.jp);
          }
        }
      } catch (e) {
        console.warn('[word-shooter] AI generation failed; falling back to existing words', e);
      }
    }
    const baseWords = mode === 'practice' ? rankedPool.slice(0, requestedCount) : rankedPool.slice(0, 5);
    const queue = shuffle(mode === 'test' && generatedWords.length ? [...baseWords, ...generatedWords].slice(0, requestedCount) : rankedPool.slice(0, requestedCount));
    if (!queue.length) {
      t$('Could not start word shooter.', 'warn');
      return;
    }
    setWsQuizWords(queue);
    setWsScore(0);
    setWsLives(wsEquipped.includes('shield') ? wsMaxLives + 1 : wsMaxLives);
    setWsMaxLives(wsEquipped.includes('shield') ? 6 : 5);
    setWsCoins(0);
    setWsHits([]);
    setWsWrong(null);
    setWsFlash(false);
    setWsCombo(0);
    wsResultRecordedRef.current = false;
    const skillCount = {
      slow: wsEquipped.filter(e => e === 'slow').length,
      hint: wsEquipped.filter(e => e === 'hint').length,
      heal: wsEquipped.filter(e => e === 'heal').length
    };
    setWsSkills({
      slow: skillCount.slow + 1,
      hint: skillCount.hint + 1,
      heal: skillCount.heal + 1
    });
    setWsSlowed(false);
    setWsStage(1);
    setWsWordQueue(queue.slice(1));
    setWsCurrentWord([makeActiveWord(queue[0], 0)]);
    setWsChoices(makeChoices(queue[0].jp, [...localPool, ...generatedWords]));
    setWsChoiceResult(null);
    setWsPhase('play');
    setWsActive(true);
    setWsPhaseScreen('play');
    if (SB_READY) {
      const paid = await spendCoins(cost);
      if (!paid) {
        setWsActive(false);
        setWsPhase('idle');
        setWsPhaseScreen('menu');
        t$('開始に失敗したためコインは消費されませんでした', 'warn');
        return;
      }
      t$("".concat(mode === 'practice' ? 'Practice' : 'Test', " -").concat(cost, " coins"), 'info');
    }
  };
  const openEquipScreen = () => {
    setWsPhaseScreen('equip');
    setWsActive(true);
    setWsPhase('idle');
  };
  const toggleEquip = skill => {
    setWsEquipped(prev => {
      if (prev.includes(skill)) return prev.filter(s => s !== skill);
      if (prev.length >= 3) {
        t$('装備は最大3つです');
        return prev;
      }
      var _gachaSkillStock_skill;
      // 在庫確認
      const stock = (_gachaSkillStock_skill = gachaSkillStock[skill]) !== null && _gachaSkillStock_skill !== void 0 ? _gachaSkillStock_skill : 0;
      if (stock <= 0) {
        t$('スキルチケットがありません');
        return prev;
      }
      // 消費
      setGachaSkillStock(s => ({
        ...s,
        [skill]: s[skill] - 1
      }));
      return [...prev, skill];
    });
  };
  // ── 4択を選ぶ ────────────────────────────────────────────────
  const handleWsChoice = (jp, wordId = null) => {
    const current = activeWords();
    if (!current.length) return;
    if (jp === '__timeout__') {
      const missed = current.find(w => w.id === wordId) || current[0];
      const remainingActive = current.filter(w => w.id !== missed.id);
      setWsFlash(true);
      setTimeout(() => setWsFlash(false), 400);
      setWsCombo(0);
      setWsLives(l => {
        const next = l - 1;
        if (next <= 0) {
          setTimeout(() => {
            setWsPhase('result');
            setWsActive(false);
            setWsPhaseScreen('result');
          }, 800);
          return 0;
        }
        setTimeout(() => refreshShooter(remainingActive, wsWordQueue), 250);
        return next;
      });
      return;
    }
    const matched = current.find(w => w.jp === jp);
    if (matched) {
      setWsChoiceResult({
        sel: jp,
        correct: matched.jp,
        wordId: matched.id
      });
      setWsHits(h => [...h, matched.id]);
      const gain = 10 + wsCombo * 2;
      setWsScore(s => s + gain);
      setWsCoins(c => c + Math.ceil(gain / 10));
      setWsCombo(c => c + 1);
      setTimeout(() => {
        setWsHits(h => h.filter(id => id !== matched.id));
        refreshShooter(current.filter(w => w.id !== matched.id), wsWordQueue);
      }, 300);
      return;
    }
    const target = current[0];
    setWsChoiceResult({
      sel: jp,
      correct: target.jp,
      wordId: target.id
    });
    setWsFlash(true);
    setTimeout(() => setWsFlash(false), 400);
    const pool = buildWordPool();
    const selectedMeaning = pool.find(w => w.jp === jp);
    setWsWrong({
      id: target.id,
      en: target.en,
      correct: target.jp,
      jp: (selectedMeaning === null || selectedMeaning === void 0 ? void 0 : selectedMeaning.en) || jp
    });
    setWsCombo(0);
    setWsLives(l => {
      const next = l - 1;
      if (next <= 0) {
        setTimeout(() => {
          setWsPhase('result');
          setWsActive(false);
          setWsPhaseScreen('result');
        }, 1200);
        return 0;
      }
      return next;
    });
    setTimeout(() => {
      setWsWrong(null);
      setWsChoiceResult(null);
    }, 1200);
  };  const activateWsSkill = skill => {
    var _wsSkills_skill;
    if (((_wsSkills_skill = wsSkills[skill]) !== null && _wsSkills_skill !== void 0 ? _wsSkills_skill : 0) <= 0) return;
    setWsSkills(s => ({
      ...s,
      [skill]: s[skill] - 1
    }));
    if (skill === 'slow') {
      setWsSlowed(true);
      setTimeout(() => setWsSlowed(false), 8000);
      t$('🐢 スロー発動！8秒間ゆっくりになります');
    } else if (skill === 'hint') {
      t$('💡 ヒント: 単語の先頭が光ります');
    } else {
      setWsLives(l => Math.min(l + 1, wsMaxLives));
      t$('💚 HP +1 回復！');
    }
  };
  // ガチャでスキルチケット獲得
  const wsGachaSkill = () => {
    if (wsCoins < 5) {
      t$('コインが足りません（5枚必要）');
      return;
    }
    setWsCoins(c => c - 5);
    const skills = ['shield', 'slow', 'hint', 'heal'];
    const got = skills[Math.floor(Math.random() * skills.length)];
    setGachaSkillStock(s => {
      var _s_got;
      return {
        ...s,
        [got]: ((_s_got = s[got]) !== null && _s_got !== void 0 ? _s_got : 0) + 1
      };
    });
    const names = {
      shield: '🛡️ シールド',
      slow: '🐢 スロー',
      hint: '💡 ヒント',
      heal: '💚 HP回復'
    };
    t$("\uD83C\uDFB0 ".concat(names[got], " チケット獲得！"));
    setPts(p => p + 3);
  };
  // wsPhase が play 以外になったら currentWord をリセット
  useEffect(() => {
    if (wsPhase !== 'play') {
      setWsCurrentWord(null);
      setWsChoices([]);
    }
  }, [wsPhase]);
  const wsWordsInitRef = React.useRef(false);
  useEffect(() => {
    if (wsPhase === 'play' && !wsWordsInitRef.current) {
      wsWordsInitRef.current = true;
    }
    if (wsPhase !== 'play') {
      wsWordsInitRef.current = false;
    }
  }, [wsPhase]);
  const handleWsInput = _val => {};
  const handleWsMiss = _id => {};
  // ── BBC記事リスト読み込み ────────────────────────────────── ──────────────────────────────────
  const loadBBCFeed = async function (feed) {
    let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : newsSource;
    let country = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : newsCountry;
    setBbcFeed(feed);
    setBbcLoading(true);
    setBbcArticles([]);
    const articles = source === 'pagesix' ? await fetchPageSixNews(feed) : await fetchBBCNews(feed, country);
    setBbcArticles(articles);
    setBbcLoading(false);
  };
  const openNewsCountry = key => {
    setNewsCountry(key);
    setBbcArticles([]);
    if (key === 'us') {
      setNewsScreen('hub');
      setNewsSource('bbc');
      setBbcFeed('world');
      return;
    }
    const firstFeed = NEWS_COUNTRIES[key].feeds[0].id;
    setNewsSource('bbc');
    setNewsScreen('bbcList');
    setBbcFeed(firstFeed);
    loadBBCFeed(firstFeed, 'bbc', key);
  };
  const openBBCList = () => {
    setNewsCountry('us');
    setNewsSource('bbc');
    setNewsScreen('bbcList');
    if (bbcArticles.length === 0 || newsSource !== 'bbc' || newsCountry !== 'us') loadBBCFeed('world', 'bbc', 'us');
  };
  const openPageSixList = () => {
    setNewsCountry('us');
    setNewsSource('pagesix');
    setNewsScreen('bbcList');
    setBbcFeed('latest');
    setBbcArticles([]);
    loadBBCFeed('latest', 'pagesix');
  };
  const getNewsFullTransCacheKey = article => {
    const raw = (article === null || article === void 0 ? void 0 : article.id) || (article === null || article === void 0 ? void 0 : article.link) || "".concat((article === null || article === void 0 ? void 0 : article.title) || '', ":").concat((article === null || article === void 0 ? void 0 : article.description) || '');
    return "eb:news:full-trans:".concat(String(raw).slice(0, 700));
  };
  const openBBCArticle = article => {
    const cacheKey = getNewsFullTransCacheKey(article);
    let cachedFull = fullTransCache[cacheKey] || '';
    if (!cachedFull && typeof window !== 'undefined') {
      try {
        cachedFull = window.localStorage.getItem(cacheKey) || '';
      } catch (e) {
        cachedFull = '';
      }
      if (cachedFull) setFullTransCache(prev => ({
        ...prev,
        [cacheKey]: cachedFull
      }));
    }
    setCurArticle(article);
    setSelWord(null);
    setSelSent(null);
    setWordData(null);
    setSentData(null);
    setFullTrans(cachedFull);
    setShowFull(false);
    setNewsScreen('bbcReader');
  };
  // ── 単語タップ ───────────────────────────────────────────────
  const handleWordTap = async (word, sentence) => {
    const clean = word.replace(/[^a-zA-Z'-]/g, '');
    if (!clean || clean.length < 2) return;
    setSelWord({
      word: clean,
      sentence
    });
    setSelSent(null);
    setSentData(null);
    setShowFull(false);
    setTransLoading(true);
    const data = await aiWordMeaning(clean, sentence, (authUser === null || authUser === void 0 ? void 0 : authUser.id) || userId);
    if (typeof (data === null || data === void 0 ? void 0 : data.remaining) === 'number') setWallet(w => ({
      ...w,
      coins: data.remaining
    }));
    if (data === null || data === void 0 ? void 0 : data.fromCache) t$('保存済みのAI回答を使いました', 'ok');else if (data === null || data === void 0 ? void 0 : data.cost) t$("AI単語確認 -".concat(data.cost, "コイン"), 'info');
    if (data === null || data === void 0 ? void 0 : data.error) t$(data.error, 'warn');
    if ((data === null || data === void 0 ? void 0 : data.meaning) && !(data === null || data === void 0 ? void 0 : data.error)) {
      const item = {
        id: "word-".concat(clean.toLowerCase()),
        word: clean,
        meaning: data.meaning,
        pos: data.pos || '',
        example: data.example || '',
        exampleJa: data.exampleJa || '',
        sentence: data.sourceSentence || sentence,
        savedAt: Date.now()
      };
      const exists = (wordBook || []).some(w => String(w.word || '').toLowerCase() === clean.toLowerCase());
      if (!exists) await dbSaveWord(item);
    }
    setWordData(data);
    setTransLoading(false);
  };
  // ── 文タップ ─────────────────────────────────────────────────
  const handleSentTap = async sentence => {
    if ((selSent === null || selSent === void 0 ? void 0 : selSent.sentence) === sentence) {
      setSelSent(null);
      setSentData(null);
      return;
    }
    setSelSent({
      sentence
    });
    setSelWord(null);
    setWordData(null);
    setShowFull(false);
    setTransLoading(true);
    const jp = await aiTranslateSentence(sentence, (authUser === null || authUser === void 0 ? void 0 : authUser.id) || userId);
    if (typeof (jp === null || jp === void 0 ? void 0 : jp.remaining) === 'number') setWallet(w => ({
      ...w,
      coins: jp.remaining
    }));
    if (jp === null || jp === void 0 ? void 0 : jp.fromCache) t$('保存済み翻訳を使いました', 'ok');else if (jp === null || jp === void 0 ? void 0 : jp.cost) t$("AI翻訳 -".concat(jp.cost, "コイン"), 'info');
    if (jp === null || jp === void 0 ? void 0 : jp.error) {
      if (isAiLimitError(jp.error)) markTranslationApiLimited();else t$(jp.error, 'warn');
    }
    setSentData((jp === null || jp === void 0 ? void 0 : jp.translation) || '翻訳できませんでした');
    setTransLoading(false);
  };
  // ── 全文翻訳トグル ───────────────────────────────────────────
  const handleFullTrans = async () => {
    if (transLoading) return;
    if (showFull) {
      setShowFull(false);
      return;
    }
    setSelWord(null);
    setSelSent(null);
    setWordData(null);
    setSentData(null);
    if (curArticle) {
      const cacheKey = getNewsFullTransCacheKey(curArticle);
      let browserCached = '';
      if (typeof window !== 'undefined') {
        try {
          browserCached = window.localStorage.getItem(cacheKey) || '';
        } catch (e) {
          browserCached = '';
        }
      }
      const cached = fullTrans || fullTransCache[cacheKey] || browserCached;
      if (cached) {
        setFullTrans(cached);
        setFullTransCache(prev => ({
          ...prev,
          [cacheKey]: cached
        }));
        setShowFull(true);
        t$('保存済み全文翻訳を表示しました（0コイン）', 'ok');
        return;
      }
      if (wallet.coins < 5) {
        t$('全文翻訳には5コイン必要です。保存済み翻訳がある記事は0コインで表示できます。', 'warn');
        return;
      }
    }
    setShowFull(true);
    if (!fullTrans && curArticle) {
      setTransLoading(true);
      const text = curArticle.title + '\n\n' + curArticle.description;
      const jp = await aiTranslateAll(text, (authUser === null || authUser === void 0 ? void 0 : authUser.id) || userId);
      if (typeof (jp === null || jp === void 0 ? void 0 : jp.remaining) === 'number') setWallet(w => ({
        ...w,
        coins: jp.remaining
      }));
      if (jp === null || jp === void 0 ? void 0 : jp.fromCache) t$('保存済み全文翻訳を使いました', 'ok');else if (jp === null || jp === void 0 ? void 0 : jp.cost) t$("AI全文翻訳 -".concat(jp.cost, "コイン"), 'info');
      if (jp === null || jp === void 0 ? void 0 : jp.error) {
        if (isAiLimitError(jp.error)) markTranslationApiLimited();else t$(jp.error, 'warn');
      }
      const translated = (jp === null || jp === void 0 ? void 0 : jp.translation) || '翻訳できませんでした';
      setFullTrans(translated);
      if ((jp === null || jp === void 0 ? void 0 : jp.translation) && !(jp === null || jp === void 0 ? void 0 : jp.error)) {
        const cacheKey = getNewsFullTransCacheKey(curArticle);
        setFullTransCache(prev => ({
          ...prev,
          [cacheKey]: translated
        }));
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(cacheKey, translated);
          } catch (e) {}
        }
      }
      setTransLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────
  // 解放モーダル（コイン/チケット選択UI）
  // ─────────────────────────────────────────────────────────────

  return {
    NewsCountryHub,
    VideoScreen,
    Saved,
    Advice,
    Gacha,
    ParallelReader,
    buildWordPool,
    startWordShooter,
    WordShooter,
    NewsHub,
    BBCList,
    BBCReader
  };
}
