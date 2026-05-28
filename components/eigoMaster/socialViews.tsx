import React from "react";
import { CoinCostLabel } from "../common";
import { YouTubeEmbed } from "../video/VideoPlayer";
import type { EigoMasterViewDeps } from "./viewTypes";
export function useSocialViews(deps: EigoMasterViewDeps) {
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
  const UnlockModal = () => {
    if (!unlockModal) return null;
    const coinCost = unlockModal.coinCost ?? COIN_COSTS.AI ?? 5;
    const ticketCost = unlockModal.ticketCost ?? 1;
    const canCoin = wallet.coins >= coinCost;
    const canTicket = wallet.gacha_tickets >= ticketCost;
    return <div className="unlock-modal-overlay" onClick={() => setUnlockModal(null)}>
      <div className="unlock-modal" onClick={e => e.stopPropagation()}>
        <div style={{
          fontSize: 20,
          fontWeight: 800,
          textAlign: "center",
          marginBottom: 8
        }}>{unlockModal.title || "機能を解放"}</div>
        <div className="jp" style={{
          fontSize: 13,
          color: "var(--t2)",
          lineHeight: 1.7,
          textAlign: "center"
        }}>{unlockModal.message || "コインまたはチケットで続行できます。"}</div>
        <div className="unlock-price">
          <button className="unlock-price-opt" disabled={!canCoin} onClick={() => unlockModal.onConfirm?.("coin")}>
            <div className="unlock-badge unlock-badge-coin">🪙 コイン</div>
            <div style={{
              marginTop: 6,
              fontWeight: 800
            }}>{coinCost}</div>
          </button>
          <button className="unlock-price-opt" disabled={!canTicket} onClick={() => unlockModal.onConfirm?.("ticket")}>
            <div className="unlock-badge unlock-badge-ticket">🎟 チケット</div>
            <div style={{
              marginTop: 6,
              fontWeight: 800
            }}>{ticketCost}</div>
          </button>
        </div>
        <button className="bg" style={{
          width: "100%"
        }} onClick={() => setUnlockModal(null)}>閉じる</button>
      </div>
    </div>;
  };
  const Talk = () => {
    const categories = [
      { id: 'general', label: '学習相談' },
      { id: 'toeic', label: 'TOEIC' },
      { id: 'grammar', label: '文法' },
      { id: 'vocabulary', label: '単語' },
      { id: 'listening', label: 'リスニング' },
      { id: 'translation', label: '翻訳' }
    ];
    const [posts, setPosts] = React.useState([]);
    const [body, setBody] = React.useState('');
    const [category, setCategory] = React.useState('general');
    const [sortMode, setSortMode] = React.useState('popular');
    const [editing, setEditing] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const loadPosts = React.useCallback(async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/social/talk?limit=50');
        const d = await r.json().catch(() => ({}));
        setPosts(Array.isArray(d.posts) ? d.posts : []);
      } catch (e) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }, []);
    React.useEffect(() => {
      loadPosts();
    }, [loadPosts]);
    const sortedPosts = [...posts].sort((a, b) => {
      if (sortMode === 'new') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      const scoreA = Number(a.like_count || 0) - Number(a.dislike_count || 0) + Number(a.reply_count || 0) * 2;
      const scoreB = Number(b.like_count || 0) - Number(b.dislike_count || 0) + Number(b.reply_count || 0) * 2;
      return scoreB - scoreA || new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
    const submitPost = async () => {
      if (!body.trim()) return;
      const temp = {
        id: 'local-' + Date.now(),
        user_id: userId,
        nickname: myProfile?.nickname || 'Guest',
        avatar_emoji: myProfile?.avatar_emoji || '',
        body: body.trim(),
        category,
        like_count: 0,
        dislike_count: 0,
        reply_count: 0,
        created_at: new Date().toISOString()
      };
      setPosts(prev => [temp, ...prev]);
      setBody('');
      try {
        const r = await fetch('/api/social/talk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, body: temp.body, category, nickname: myProfile?.nickname, avatarEmoji: myProfile?.avatar_emoji })
        });
        const d = await r.json().catch(() => ({}));
        if (d.ok && d.post) setPosts(prev => prev.map(p => p.id === temp.id ? d.post : p));
        else loadPosts();
      } catch (e) {
        loadPosts();
      }
    };
    const saveEdit = async post => {
      const nextBody = editing?.body?.trim();
      const nextCategory = editing?.category || 'general';
      if (!nextBody) return;
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, body: nextBody, category: nextCategory } : p));
      setEditing(null);
      try {
        const r = await fetch('/api/social/talk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'edit', postId: post.id, userId, body: nextBody, category: nextCategory })
        });
        const d = await r.json().catch(() => ({}));
        if (d.ok && d.post) setPosts(prev => prev.map(p => p.id === post.id ? d.post : p));
        else loadPosts();
      } catch (e) {
        loadPosts();
      }
    };
    const votePost = async (post, vote) => {
      setPosts(prev => prev.map(p => p.id === post.id ? {
        ...p,
        like_count: Math.max(0, Number(p.like_count || 0) + (vote === 1 ? 1 : 0)),
        dislike_count: Math.max(0, Number(p.dislike_count || 0) + (vote === -1 ? 1 : 0))
      } : p));
      try {
        await fetch('/api/social/talk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'vote', postId: post.id, userId, vote })
        });
      } catch (e) {}
    };
    return <div className="sa" style={{ padding: 16 }}>
      <div className="sc" style={{ marginBottom: 14 }}>
        <div className="jp" style={{ fontWeight: 800, marginBottom: 8 }}>トークに投稿</div>
        <select className="url-inp" value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', marginBottom: 8 }}>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}</select>
        <textarea className="url-inp" value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="学習メモ・質問・気づきを書く" style={{ width: '100%', resize: 'vertical', marginBottom: 8 }} />
        <button className="bp" style={{ width: '100%' }} onClick={submitPost}>投稿する</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[{ id: 'popular', label: '人気順' }, { id: 'new', label: '新着順' }].map(tab => <button key={tab.id} className="bg" style={{ flex: 1, background: sortMode === tab.id ? 'var(--p)' : 'var(--sur)', color: sortMode === tab.id ? '#fff' : 'var(--t2)' }} onClick={() => setSortMode(tab.id)}>{tab.label}</button>)}
      </div>
      {loading && <div className="empty">読み込み中...</div>}
      {!loading && sortedPosts.length === 0 && <div className="empty">まだ投稿がありません</div>}
      {!loading && sortedPosts.map((post, i) => {
        const isMine = post.user_id === userId;
        const isEditing = editing?.id === post.id;
        const cat = categories.find(c => c.id === post.category)?.label || post.category || 'Study';
        return <div key={post.id || i} className="sc" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div className="jp" style={{ fontWeight: 800 }}>{post.nickname || post.user_id?.slice?.(0, 8) || 'Guest'}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>{post.created_at ? new Date(post.created_at).toLocaleDateString('ja-JP') : ''}</div>
            </div>
            <span className="strategy-chip sc-b">{cat}</span>
          </div>
          {isEditing ? <div style={{ display: 'grid', gap: 8 }}>
            <select className="url-inp" value={editing.category} onChange={e => setEditing(prev => ({ ...prev, category: e.target.value }))}>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}</select>
            <textarea className="url-inp" value={editing.body} onChange={e => setEditing(prev => ({ ...prev, body: e.target.value }))} rows={3} />
            <div style={{ display: 'flex', gap: 8 }}><button className="bp" onClick={() => saveEdit(post)}>Save</button><button className="bg" onClick={() => setEditing(null)}>Cancel</button></div>
          </div> : <div className="jp" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 10 }}>{post.body}</div>}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="bg" onClick={() => votePost(post, 1)}>いいね {post.like_count || 0}</button>
            <button className="bg" onClick={() => votePost(post, -1)}>うーん {post.dislike_count || 0}</button>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>返信 {post.reply_count || 0}</span>
            {isMine && !isEditing && <button className="bg" style={{ marginLeft: 'auto' }} onClick={() => setEditing({ id: post.id, body: post.body || '', category: post.category || 'general' })}>編集</button>}
          </div>
        </div>;
      })}
    </div>;
  };
  const RankingScreen = () => <div className="sa" style={{
    padding: 16
  }}>
    <div style={{
      display: "flex",
      gap: 8,
      marginBottom: 12
    }}>
      {["learning", "translation"].map((tab, __idx) => <button key={tab} className="bg" style={{
        flex: 1,
        background: rankingTab === tab ? "var(--p)" : "var(--sur)",
        color: rankingTab === tab ? "#fff" : "var(--t2)"
      }} onClick={() => loadRanking(tab, rankingPeriod)}>{tab === "learning" ? "Learning" : "Translation"}</button>)}
    </div>
    <div style={{
      display: "flex",
      gap: 8,
      marginBottom: 14
    }}>
      {["weekly", "monthly", "all"].map((period, __idx) => <button key={period} className="bg" style={{
        flex: 1,
        borderColor: rankingPeriod === period ? "var(--a)" : "var(--bd)"
      }} onClick={() => loadRanking(rankingTab, period)}>{period === "weekly" ? "Weekly" : period === "monthly" ? "Monthly" : "All"}</button>)}
    </div>
    {rankingLoading && <div className="empty">Loading...</div>}
    {!rankingLoading && rankingData.length === 0 && <div className="empty">{rankingTab === "learning" ? "No learning data yet" : "No ranking data yet"}</div>}
    {!rankingLoading && rankingData.map((row, i) => <div key={row.user_id || row.id || i} className="rank-row">
      <div key={row?.id ?? i} className={`rank-no ${i === 0 ? "rank-no-1" : i === 1 ? "rank-no-2" : i === 2 ? "rank-no-3" : "rank-no-n"}`}>{i + 1}</div>
      <div key={row?.id ?? i} className="rank-nick">{row.nickname || row.user_id?.slice?.(0, 8) || "Learner"}</div>
      <div key={row?.id ?? i} className="rank-score">{rankingTab === "learning" ? row.rank_score ?? row.score ?? 0 : row.score ?? 0}pt</div>
    </div>)}
  </div>;
  const NicknameModal = () => showNickEdit ? <div className="nick-modal-overlay" onClick={() => setShowNickEdit(false)}>
    <div className="nick-modal" onClick={e => e.stopPropagation()}>
      <div className="jp" style={{
        fontSize: 18,
        fontWeight: 800,
        marginBottom: 12
      }}>Nickname</div>
      <input className="url-inp" value={nickInput} onChange={e => setNickInput(e.target.value)} placeholder="Display name" />
      <div style={{
        display: "flex",
        gap: 8,
        marginTop: 14
      }}>
        <button className="bg" style={{
          flex: 1
        }} onClick={() => setShowNickEdit(false)}>Cancel</button>
        <button className="bp" style={{
          flex: 1
        }} onClick={() => saveProfile(nickInput)}>Save</button>
      </div>
    </div>
  </div> : null;
  const Settings = () => {
    const totalSessions = [...TR.word, ...TR.grammar, ...TR.listening, ...TR.shadowing].length;
    const todayCount = streakStats?.todayCount || 0;
    const streak = streakStats?.streak || 0;
    return <div className="sa">
      <div className="stlist">
        <div className="sc" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--pl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>EB</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="jp" style={{ fontWeight: 800, fontSize: 16 }}>{myProfile?.nickname || authUser?.email || 'ゲスト学習者'}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>{authUser ? 'Googleログイン中' : '未ログイン: 端末内に保存'}</div>
          </div>
          <button className="bg" onClick={() => { setNickInput(myProfile?.nickname || ''); setShowNickEdit(true); }}>名前変更</button>
        </div>
        <div className="stst">学習状況</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>今日の学習</div><div style={{ fontSize: 26, fontWeight: 800, color: 'var(--p)' }}>{todayCount}</div></div>
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>連続日数</div><div style={{ fontSize: 26, fontWeight: 800, color: 'var(--a)' }}>{streak}日</div></div>
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>テスト回数</div><div style={{ fontSize: 26, fontWeight: 800 }}>{totalSessions}</div></div>
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>保存アイテム</div><div style={{ fontSize: 26, fontWeight: 800 }}>{saved.length}</div></div>
        </div>
        <div className="stst">ウォレット</div>
        <div className="sti"><span>コイン</span><strong>{wallet.coins}</strong></div>
        <div className="sti"><span>ガチャチケット</span><strong>{wallet.gacha_tickets}</strong></div>
        <div className="stst">表示・連携</div>
        <div className="sti"><span>動画保存</span><strong>{SB_READY ? 'クラウド対応' : 'ローカルのみ'}</strong></div>
        <div className="sti"><span>広告・特典</span><strong>{REWARD_ADS_ENABLED ? '有効' : '準備中'}</strong></div>
        <div className="sti"><span>アフィリエイト表示</span><button className={"tog ".concat(sett.affOn ? 'on' : 'off')} onClick={() => setSett(s => ({ ...s, affOn: !s.affOn }))} /></div>
        <div className="sti"><span>復習広告</span><button className={"tog ".concat(sett.rewOn ? 'on' : 'off')} onClick={() => setSett(s => ({ ...s, rewOn: !s.rewOn }))} /></div>
        <button className="bg" onClick={() => setShowRanking(true)}>ランキングを見る</button>
        {authUser ? <button className="bg" onClick={async () => { await supabaseAuth.signOut(); if (typeof window !== 'undefined') window.location.reload(); }}>ログアウト</button> : <button className="bp" onClick={loginWithGoogle}>Googleでログイン</button>}
      </div>
    </div>;
  };
  return {
    UnlockModal,
    Talk,
    RankingScreen,
    NicknameModal,
    Settings
  };
}
