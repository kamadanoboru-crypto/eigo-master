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
    const canCoin = wallet.coins >= coinCost;
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
        }}>{unlockModal.message || "コインで続行できます。"}</div>
        <div className="unlock-price">
          <button className="unlock-price-opt" disabled={!canCoin} onClick={() => unlockModal.onConfirm?.("coin")}>
            <div className="unlock-badge unlock-badge-coin">🪙 コイン</div>
            <div style={{
              marginTop: 6,
              fontWeight: 800
            }}>{coinCost}</div>
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
      { id: 'general', label: '学習相談', color: '#183153' },
      { id: 'toeic', label: 'TOEIC', color: '#B88932' },
      { id: 'grammar', label: '文法', color: '#0F766E' },
      { id: 'vocabulary', label: '単語', color: '#6D5BD0' },
      { id: 'listening', label: 'リスニング', color: '#0369A1' },
      { id: 'translation', label: '翻訳', color: '#B45309' }
    ];
    const [posts, setPosts] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');
    const [category, setCategory] = React.useState('general');
    const [sortMode, setSortMode] = React.useState('popular');
    const [editing, setEditing] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const splitPost = post => {
      const text = String(post?.body || '');
      const m = text.match(/^# (.+)\n([\s\S]*)$/);
      return m ? { title: m[1], body: m[2] } : { title: '学習メモ', body: text };
    };
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
      const nextTitle = title.trim() || '学習メモ';
      const nextBody = body.trim();
      if (!nextBody) return;
      const temp = {
        id: 'local-' + Date.now(),
        user_id: userId,
        nickname: myProfile?.nickname || 'Guest',
        avatar_emoji: myProfile?.avatar_emoji || 'EB',
        body: `# ${nextTitle}\n${nextBody}`,
        category,
        like_count: 0,
        dislike_count: 0,
        reply_count: 0,
        created_at: new Date().toISOString()
      };
      setPosts(prev => [temp, ...prev]);
      setTitle('');
      setBody('');
      try {
        const r = await fetch('/api/social/talk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, title: nextTitle, body: nextBody, category, nickname: myProfile?.nickname, avatarEmoji: myProfile?.avatar_emoji })
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
      const nextTitle = editing?.title?.trim() || '学習メモ';
      const nextCategory = editing?.category || 'general';
      if (!nextBody) return;
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, body: `# ${nextTitle}\n${nextBody}`, category: nextCategory } : p));
      setEditing(null);
      try {
        const r = await fetch('/api/social/talk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'edit', postId: post.id, userId, title: nextTitle, body: nextBody, category: nextCategory })
        });
        const d = await r.json().catch(() => ({}));
        if (d.ok && d.post) {
          setPosts(prev => prev.map(p => p.id === post.id ? d.post : p));
          loadPosts();
        }
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
        const r = await fetch('/api/social/talk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'vote', postId: post.id, userId, vote })
        });
        const d = await r.json().catch(() => ({}));
        if (d.ok) setPosts(prev => prev.map(p => p.id === post.id ? { ...p, like_count: d.like_count, dislike_count: d.dislike_count } : p));
      } catch (e) {}
    };
    return <div className="sa" style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[{ id: 'popular', label: '人気順' }, { id: 'new', label: '新着順' }].map(tab => <button key={tab.id} className="bg" style={{ flex: 1, background: sortMode === tab.id ? 'var(--p)' : 'var(--sur)', color: sortMode === tab.id ? '#fff' : 'var(--t2)' }} onClick={() => setSortMode(tab.id)}>{tab.label}</button>)}
      </div>
      <div className="sc" style={{ marginBottom: 14 }}>
        <div className="jp" style={{ fontWeight: 800, marginBottom: 8 }}>学習トークを投稿</div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
          {categories.map(cat => <button key={cat.id} className="bg" style={{ padding: '7px 10px', whiteSpace: 'nowrap', borderColor: category === cat.id ? cat.color : 'var(--bd)', color: category === cat.id ? cat.color : 'var(--t2)' }} onClick={() => setCategory(cat.id)}>{cat.label}</button>)}
        </div>
        <input className="url-inp" value={title} onChange={e => setTitle(e.target.value)} placeholder="タイトル" style={{ width: '100%', marginBottom: 8 }} />
        <textarea className="url-inp" value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="学習メモ・質問・気づきを書く" style={{ width: '100%', resize: 'vertical', marginBottom: 8 }} />
        <button className="bp" style={{ width: '100%' }} onClick={submitPost}>投稿する</button>
      </div>
      {loading && <div className="empty">読み込み中...</div>}
      {!loading && sortedPosts.length === 0 && <div className="empty">まだ投稿がありません</div>}
      {!loading && sortedPosts.map((post, i) => {
        const isMine = post.user_id === userId;
        const isEditing = editing?.id === post.id;
        const cat = categories.find(c => c.id === post.category) || categories[0];
        const parsed = splitPost(post);
        return <div key={post.id || i} className="sc" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--pl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--p)' }}>{post.avatar_emoji || 'EB'}</div>
            <div style={{ minWidth: 0 }}>
              <div className="jp" style={{ fontWeight: 800 }}>{post.nickname || post.user_id?.slice?.(0, 8) || 'Guest'}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>{post.created_at ? new Date(post.created_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</div>
            </div>
            <span className="strategy-chip" style={{ background: cat.color + '18', color: cat.color }}>{cat.label}</span>
          </div>
          {isEditing ? <div style={{ display: 'grid', gap: 8 }}>
            <select className="url-inp" value={editing.category} onChange={e => setEditing(prev => ({ ...prev, category: e.target.value }))}>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}</select>
            <input className="url-inp" value={editing.title} onChange={e => setEditing(prev => ({ ...prev, title: e.target.value }))} />
            <textarea className="url-inp" value={editing.body} onChange={e => setEditing(prev => ({ ...prev, body: e.target.value }))} rows={3} />
            <div style={{ display: 'flex', gap: 8 }}><button className="bp" onClick={() => saveEdit(post)}>保存</button><button className="bg" onClick={() => setEditing(null)}>キャンセル</button></div>
          </div> : <>
            <div className="jp" style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{parsed.title}</div>
            <div className="jp" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 10 }}>{parsed.body}</div>
          </>}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="bg" onClick={() => votePost(post, 1)}>いいね {post.like_count || 0}</button>
            <button className="bg" onClick={() => votePost(post, -1)}>わるいね {post.dislike_count || 0}</button>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>回答 {post.reply_count || 0}</span>
            {isMine && !isEditing && <button className="bg" style={{ marginLeft: 'auto' }} onClick={() => setEditing({ id: post.id, title: parsed.title, body: parsed.body, category: post.category || 'general' })}>編集</button>}
          </div>
        </div>;
      })}
    </div>;
  };
  const RankingScreen = () => {
    const periods = [{ id: 'daily', label: '今日' }, { id: 'weekly', label: '7日間' }, { id: 'all', label: '累計' }];
    const tabs = [{ id: 'points', label: 'ポイント獲得' }, { id: 'coins', label: 'コイン消費' }];
    return <div className="sa" style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {tabs.map(tab => <button key={tab.id} className="bg" style={{ flex: 1, background: rankingTab === tab.id ? "var(--p)" : "var(--sur)", color: rankingTab === tab.id ? "#fff" : "var(--t2)" }} onClick={() => loadRanking(tab.id, rankingPeriod)}>{tab.label}</button>)}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {periods.map(period => <button key={period.id} className="bg" style={{ flex: 1, borderColor: rankingPeriod === period.id ? "var(--a)" : "var(--bd)" }} onClick={() => loadRanking(rankingTab, period.id)}>{period.label}</button>)}
      </div>
      {rankingLoading && <div className="empty">ランキングを読み込み中...</div>}
      {!rankingLoading && rankingData.length === 0 && <div className="empty">まだランキングデータがありません</div>}
      {!rankingLoading && rankingData.length === 1 && rankingData[0]?.isSelfFallback && <div className="jp" style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>まだ参加者が少ないため、自分の行だけ表示しています。</div>}
      {!rankingLoading && rankingData.map((row, i) => {
        const value = rankingTab === 'coins' ? Number(row.coins_spent ?? row.score ?? 0) : Number(row.points ?? row.rank_score ?? row.score ?? 0);
        return <div key={row.user_id || row.id || i} className="rank-row">
          <div className={`rank-no ${i === 0 ? "rank-no-1" : i === 1 ? "rank-no-2" : i === 2 ? "rank-no-3" : "rank-no-n"}`}>{row.rank || i + 1}</div>
          <div style={{ width: 30, height: 30, borderRadius: 10, background: 'var(--pl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'var(--p)', flexShrink: 0 }}>{row.avatar || row.avatar_emoji || 'EB'}</div>
          <div className="rank-nick">{row.nickname || row.user_id?.slice?.(0, 8) || "Learner"}{row.user_id === userId ? '（自分）' : ''}</div>
          <div className="rank-score">{value}{rankingTab === 'coins' ? ' coins' : ' pt'}</div>
        </div>;
      })}
      <div className="jp" style={{ fontSize: 11, color: 'var(--t3)', marginTop: 10 }}>期間: {periods.find(p => p.id === rankingPeriod)?.label || '累計'}</div>
    </div>;
  };
  const NicknameModal = () => {
    const [draftName, setDraftName] = React.useState(nickInput || myProfile?.nickname || '');
    const [draftAvatar, setDraftAvatar] = React.useState(myProfile?.avatar_emoji || 'EB');
    React.useEffect(() => {
      if (showNickEdit) {
        setDraftName(nickInput || myProfile?.nickname || '');
        setDraftAvatar(myProfile?.avatar_emoji || 'EB');
      }
    }, [showNickEdit, nickInput, myProfile?.nickname, myProfile?.avatar_emoji]);
    if (!showNickEdit) return null;
    return <div className="nick-modal-overlay" onClick={() => setShowNickEdit(false)}>
      <div className="nick-modal" onClick={e => e.stopPropagation()}>
        <div className="jp" style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>プロフィール編集</div>
        <input className="url-inp" value={draftName} onChange={e => setDraftName(e.target.value)} placeholder="ニックネーム" />
        <div className="jp" style={{ fontSize: 12, color: 'var(--t3)', margin: '12px 0 6px' }}>アイコン</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
          {['EB', 'A+', 'TOEIC', 'AI', '★'].map(icon => <button key={icon} className="bg" style={{ padding: 8, borderColor: draftAvatar === icon ? 'var(--a)' : 'var(--bd)', color: draftAvatar === icon ? 'var(--a)' : 'var(--t2)' }} onClick={() => setDraftAvatar(icon)}>{icon}</button>)}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button className="bg" style={{ flex: 1 }} onClick={() => setShowNickEdit(false)}>キャンセル</button>
          <button className="bp" style={{ flex: 1 }} onClick={() => { saveProfile(draftName, draftAvatar); setShowNickEdit(false); }}>保存</button>
        </div>
      </div>
    </div>;
  };
  const Settings = () => {
    const totalSessions = [...TR.word, ...TR.grammar, ...TR.listening, ...TR.shadowing].length;
    const todayCount = streakStats?.todayCount || 0;
    const todayWords = streakStats?.todayWords || 0;
    const streak = streakStats?.streak || 0;
    const lastWord = TR.word.slice(-1)[0];
    const lastGrammar = TR.grammar.slice(-1)[0];
    const lastListening = TR.listening.slice(-1)[0];
    const pct = r => r && r.total ? `${Math.round(r.correct / r.total * 100)}%` : '-';
    return <div className="sa">
      <div className="stlist">
        <div className="sc" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--pl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'var(--p)' }}>{myProfile?.avatar_emoji || 'EB'}</div>
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
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>今日の単語</div><div style={{ fontSize: 26, fontWeight: 800 }}>{todayWords}</div></div>
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>保存アイテム</div><div style={{ fontSize: 26, fontWeight: 800 }}>{saved.length}</div></div>
        </div>
        <div className="stst">学習統計</div>
        <div className="sti"><span>学習ポイント</span><strong>{pts} pt</strong></div>
        <div className="sti"><span>テスト回数</span><strong>{totalSessions}</strong></div>
        <div className="sti"><span>直近単語</span><strong>{pct(lastWord)}</strong></div>
        <div className="sti"><span>直近Part5</span><strong>{pct(lastGrammar)}</strong></div>
        <div className="sti"><span>直近リスニング</span><strong>{pct(lastListening)}</strong></div>
        <div className="stst">ウォレット</div>
        <div className="sti"><span>コイン</span><strong>{wallet.coins}</strong></div>
        <div className="stst">データ連携</div>
        <div className="sti"><span>保存状態</span><strong>{SB_READY ? 'クラウド同期' : 'ローカル保存'}</strong></div>
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
