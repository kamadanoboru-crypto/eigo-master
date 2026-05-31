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
      { id: 'study', label: '学習相談', color: '#183153' },
      { id: 'toeic', label: 'TOEIC', color: '#B88932' },
      { id: 'chat', label: '雑談', color: '#0F766E' },
      { id: 'app', label: 'アプリ', color: '#6D5BD0' },
      { id: 'other', label: 'その他', color: '#64748B' }
    ];
    const normalizeCategory = value => categories.some(cat => cat.id === value) ? value : value === 'general' || value === 'grammar' || value === 'vocabulary' || value === 'listening' || value === 'translation' ? 'study' : 'other';
    const [posts, setPosts] = React.useState([]);
    const [replies, setReplies] = React.useState([]);
    const [selectedThread, setSelectedThread] = React.useState(null);
    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');
    const [category, setCategory] = React.useState('study');
    const [sortMode, setSortMode] = React.useState('popular');
    const [filterCategory, setFilterCategory] = React.useState('all');
    const [replyBody, setReplyBody] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [editing, setEditing] = React.useState(null);
    const splitPost = post => {
      const text = String(post?.body || '');
      const m = text.match(/^# (.+)\n([\s\S]*)$/);
      return m ? { title: m[1], body: m[2] } : { title: '学習メモ', body: text };
    };
    const loadPosts = React.useCallback(async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams({ limit: '50', userId, sort: sortMode, category: filterCategory });
        const r = await fetch(`/api/social/talk?${qs.toString()}`);
        const d = await r.json().catch(() => ({}));
        setPosts(Array.isArray(d.posts) ? d.posts : []);
      } catch (e) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }, [filterCategory, sortMode, userId]);
    React.useEffect(() => {
      loadPosts();
    }, [loadPosts]);
    const loadReplies = React.useCallback(async thread => {
      if (!thread?.id) return;
      try {
        const qs = new URLSearchParams({ threadId: thread.id, userId, limit: '50' });
        const r = await fetch(`/api/social/talk?${qs.toString()}`);
        const d = await r.json().catch(() => ({}));
        setReplies(Array.isArray(d.posts) ? d.posts : []);
      } catch (e) {
        setReplies([]);
      }
    }, [userId]);
    React.useEffect(() => {
      if (selectedThread) loadReplies(selectedThread);
    }, [selectedThread, loadReplies]);
    const sortedPosts = [...posts].filter(post => filterCategory === 'all' || normalizeCategory(post.category) === filterCategory);
    const submitPost = async () => {
      const nextTitle = title.trim() || '学習メモ';
      const nextBody = body.trim();
      if (!nextBody) return;
      const temp = { id: 'local-' + Date.now(), user_id: userId, nickname: myProfile?.nickname || 'Guest', avatar_emoji: myProfile?.avatar_emoji || '🎓', body: `# ${nextTitle}\n${nextBody}`, category, like_count: 0, dislike_count: 0, reply_count: 0, my_vote: 0, created_at: new Date().toISOString() };
      setPosts(prev => [temp, ...prev]);
      setTitle('');
      setBody('');
      try {
        const r = await fetch('/api/social/talk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, title: nextTitle, body: nextBody, category, nickname: myProfile?.nickname, avatarEmoji: myProfile?.avatar_emoji }) });
        const d = await r.json().catch(() => ({}));
        if (d.ok && d.post) setPosts(prev => prev.map(p => p.id === temp.id ? d.post : p));
        else loadPosts();
      } catch (e) {
        loadPosts();
      }
    };
    const votePost = async (post, vote) => {
      const previous = Number(post.my_vote || 0);
      const nextVote = previous === vote ? 0 : vote;
      const patchVote = p => p.id === post.id ? { ...p, my_vote: nextVote, like_count: Math.max(0, Number(p.like_count || 0) - (previous === 1 ? 1 : 0) + (nextVote === 1 ? 1 : 0)), dislike_count: Math.max(0, Number(p.dislike_count || 0) - (previous === -1 ? 1 : 0) + (nextVote === -1 ? 1 : 0)) } : p;
      setPosts(prev => prev.map(patchVote));
      setReplies(prev => prev.map(patchVote));
      setSelectedThread(prev => prev?.id === post.id ? patchVote(prev) : prev);
      try {
        const r = await fetch('/api/social/talk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'vote', postId: post.id, userId, vote }) });
        const d = await r.json().catch(() => ({}));
        if (d.ok) {
          const applyServer = p => p.id === post.id ? { ...p, like_count: d.like_count, dislike_count: d.dislike_count, my_vote: d.my_vote } : p;
          setPosts(prev => prev.map(applyServer));
          setReplies(prev => prev.map(applyServer));
          setSelectedThread(prev => prev?.id === post.id ? applyServer(prev) : prev);
        } else {
          t$(d.reason || '投票を保存できませんでした', 'warn');
          loadPosts();
        }
      } catch (e) {
        t$('投票を保存できませんでした', 'warn');
        loadPosts();
      }
    };
    const submitReply = async () => {
      const text = replyBody.trim();
      if (!selectedThread || !text) return;
      const temp = { id: 'reply-local-' + Date.now(), user_id: userId, nickname: myProfile?.nickname || 'Guest', avatar_emoji: myProfile?.avatar_emoji || '🎓', body: text, category: selectedThread.category, parent_id: selectedThread.id, thread_id: selectedThread.thread_id || selectedThread.id, like_count: 0, dislike_count: 0, my_vote: 0, created_at: new Date().toISOString() };
      setReplies(prev => [...prev, temp]);
      setReplyBody('');
      setSelectedThread(prev => prev ? { ...prev, reply_count: Number(prev.reply_count || 0) + 1 } : prev);
      setPosts(prev => prev.map(p => p.id === selectedThread.id ? { ...p, reply_count: Number(p.reply_count || 0) + 1 } : p));
      try {
        const r = await fetch('/api/social/talk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, body: text, parentId: selectedThread.id, category: selectedThread.category, nickname: myProfile?.nickname, avatarEmoji: myProfile?.avatar_emoji }) });
        const d = await r.json().catch(() => ({}));
        if (d.ok && d.post) setReplies(prev => prev.map(p => p.id === temp.id ? d.post : p));
        else loadReplies(selectedThread);
      } catch (e) {
        loadReplies(selectedThread);
      }
    };
    const saveEdit = async post => {
      const nextTitle = String(editing?.title || '').trim() || '学習メモ';
      const nextBody = String(editing?.body || '').trim();
      const nextCategory = editing?.category || normalizeCategory(post.category);
      if (!post?.id || !nextBody) return;
      const patched = p => p.id === post.id ? { ...p, body: `# ${nextTitle}\n${nextBody}`, category: nextCategory } : p;
      setPosts(prev => prev.map(patched));
      setReplies(prev => prev.map(patched));
      setSelectedThread(prev => prev?.id === post.id ? patched(prev) : prev);
      setEditing(null);
      try {
        const r = await fetch('/api/social/talk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'edit', postId: post.id, userId, title: nextTitle, body: nextBody, category: nextCategory }) });
        const d = await r.json().catch(() => ({}));
        if (!d.ok) {
          t$(d.reason || '保存できませんでした', 'warn');
        }
        await loadPosts();
        if (selectedThread?.id === post.id) setSelectedThread(prev => prev ? patched(prev) : prev);
      } catch (e) {
        t$('保存できませんでした', 'warn');
        loadPosts();
      }
    };
    const VoteButtons = ({ post }) => <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
      <button className="bg" title="いいね" style={{ minWidth: 58, borderColor: post.my_vote === 1 ? 'var(--a)' : 'var(--bd)', background: post.my_vote === 1 ? '#FEF3C7' : 'var(--sur)' }} onClick={() => votePost(post, 1)}>👍 {post.like_count || 0}</button>
      <button className="bg" title="わるいね" style={{ minWidth: 58, borderColor: post.my_vote === -1 ? '#FCA5A5' : 'var(--bd)', background: post.my_vote === -1 ? '#FEE2E2' : 'var(--sur)', color: post.my_vote === -1 ? '#DC2626' : 'var(--t)' }} onClick={() => votePost(post, -1)}>👎 {post.dislike_count || 0}</button>
    </div>;
    const PostCard = ({ post, i = 0, compact = false }) => {
      const cat = categories.find(c => c.id === normalizeCategory(post.category)) || categories[0];
      const parsed = splitPost(post);
      const isEditing = editing?.id === post.id;
      const isMine = post.user_id === userId;
      return <div key={post.id || i} className="sc" style={{ marginBottom: 10, cursor: compact ? 'default' : 'pointer' }} onClick={() => !compact && (setSelectedThread(post), setReplies([]))}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--pl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{post.avatar_emoji || '🎓'}</div>
          <div style={{ minWidth: 0, flex: 1 }}><div className="jp" style={{ fontWeight: 800 }}>{post.nickname || post.user_id?.slice?.(0, 8) || 'Guest'}</div><div style={{ fontSize: 11, color: 'var(--t3)' }}>{post.created_at ? new Date(post.created_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</div></div>
          <span className="strategy-chip" style={{ background: cat.color + '18', color: cat.color }}>{cat.label}</span>
        </div>
        {isEditing ? <div style={{ display: 'grid', gap: 8 }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>{categories.map(item => <button key={item.id} className="bg" style={{ padding: '7px 10px', whiteSpace: 'nowrap', borderColor: editing.category === item.id ? item.color : 'var(--bd)', color: editing.category === item.id ? item.color : 'var(--t2)' }} onClick={() => setEditing(prev => ({ ...prev, category: item.id }))}>{item.label}</button>)}</div>
          <input className="url-inp" value={editing.title} onChange={e => setEditing(prev => ({ ...prev, title: e.target.value }))} />
          <textarea className="url-inp" value={editing.body} onChange={e => setEditing(prev => ({ ...prev, body: e.target.value }))} rows={3} style={{ resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 8 }}><button className="bp" onClick={() => saveEdit(post)}>保存</button><button className="bg" onClick={() => setEditing(null)}>キャンセル</button></div>
        </div> : <>
          <div className="jp" style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{parsed.title}</div>
          <div className="jp" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, marginBottom: 10 }}>{parsed.body}</div>
        </>}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><VoteButtons post={post} />{!compact && <span className="bg" style={{ fontSize: 12, padding: '7px 10px', borderColor: 'var(--bd)' }}>💬 {post.reply_count || 0}</span>}{isMine && !isEditing && <button className="bg" style={{ marginLeft: 'auto' }} onClick={e => { e.stopPropagation(); setEditing({ id: post.id, title: parsed.title, body: parsed.body, category: normalizeCategory(post.category) }); }}>編集</button>}</div>
      </div>;
    };
    if (selectedThread) {
      const parsed = splitPost(selectedThread);
      return <div className="sa" style={{ padding: 16 }}><button className="bg" style={{ marginBottom: 10 }} onClick={() => { setSelectedThread(null); setReplies([]); loadPosts(); }}>← スレッド一覧</button><PostCard post={selectedThread} compact /><div className="lsec">コメント {selectedThread.reply_count || replies.length || 0}</div><div className="sc" style={{ marginBottom: 12 }}><textarea className="url-inp" value={replyBody} onChange={e => setReplyBody(e.target.value)} rows={3} placeholder={`${parsed.title} へのコメントを書く`} style={{ width: '100%', resize: 'vertical', marginBottom: 8 }} /><button className="bp" style={{ width: '100%' }} disabled={!replyBody.trim()} onClick={submitReply}>コメントする</button></div>{replies.length === 0 && <div className="empty">まだコメントはありません</div>}{replies.map((reply, i) => <PostCard key={reply.id || i} post={reply} i={i} compact />)}</div>;
    }
    return <div className="sa" style={{ padding: 16 }}><div className="sc" style={{ marginBottom: 14 }}><div className="jp" style={{ fontWeight: 800, marginBottom: 8 }}>学習トークを投稿</div><div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>{categories.map(cat => <button key={cat.id} className="bg" style={{ padding: '7px 10px', whiteSpace: 'nowrap', borderColor: category === cat.id ? cat.color : 'var(--bd)', color: category === cat.id ? cat.color : 'var(--t2)' }} onClick={() => setCategory(cat.id)}>{cat.label}</button>)}</div><input className="url-inp" value={title} onChange={e => setTitle(e.target.value)} placeholder="タイトル" style={{ width: '100%', marginBottom: 8 }} /><textarea className="url-inp" value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="相談、質問、気づきを書く" style={{ width: '100%', resize: 'vertical', marginBottom: 8 }} /><button className="bp" style={{ width: '100%' }} onClick={submitPost}>投稿する</button></div><div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>{[{ id: 'popular', label: '人気順' }, { id: 'new', label: '新着順' }].map(tab => <button key={tab.id} className="bg" style={{ flex: 1, background: sortMode === tab.id ? 'var(--p)' : 'var(--sur)', color: sortMode === tab.id ? '#fff' : 'var(--t2)' }} onClick={() => setSortMode(tab.id)}>{tab.label}</button>)}</div><div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 10 }}>{[{ id: 'all', label: 'ALL', color: '#64748B' }, ...categories].map(cat => <button key={cat.id} className="bg" style={{ padding: '7px 10px', whiteSpace: 'nowrap', borderColor: filterCategory === cat.id ? cat.color : 'var(--bd)', color: filterCategory === cat.id ? cat.color : 'var(--t2)' }} onClick={() => setFilterCategory(cat.id)}>{cat.label}</button>)}</div>{loading && <div className="empty">読み込み中...</div>}{!loading && sortedPosts.length === 0 && <div className="empty">まだ投稿がありません</div>}{!loading && sortedPosts.map((post, i) => <PostCard key={post.id || i} post={post} i={i} />)}</div>;
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
    const [draftAvatar, setDraftAvatar] = React.useState(myProfile?.avatar_emoji || '🎓');
    React.useEffect(() => {
      if (showNickEdit) {
        setDraftName(nickInput || myProfile?.nickname || '');
        setDraftAvatar(myProfile?.avatar_emoji || '🎓');
      }
    }, [showNickEdit, nickInput, myProfile?.nickname, myProfile?.avatar_emoji]);
    if (!showNickEdit) return null;
    return <div className="nick-modal-overlay" onClick={() => setShowNickEdit(false)}>
      <div className="nick-modal" onClick={e => e.stopPropagation()}>
        <div className="jp" style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>プロフィール編集</div>
        <input className="url-inp" value={draftName} onChange={e => setDraftName(e.target.value)} placeholder="ニックネーム" />
        <div className="jp" style={{ fontSize: 12, color: 'var(--t3)', margin: '12px 0 6px' }}>アイコン</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
          {['🎓', '📘', '🧠', '🔥', '⭐'].map(icon => <button key={icon} className="bg" style={{ padding: 8, borderColor: draftAvatar === icon ? 'var(--a)' : 'var(--bd)', fontSize: 20 }} onClick={() => setDraftAvatar(icon)}>{icon}</button>)}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button className="bg" style={{ flex: 1 }} onClick={() => setShowNickEdit(false)}>キャンセル</button>
          <button className="bp" style={{ flex: 1 }} onClick={() => { saveProfile(draftName, draftAvatar); setShowNickEdit(false); }}>保存</button>
        </div>
      </div>
    </div>;
  };
  const Settings = () => {
    const [health, setHealth] = React.useState(null);
    const [healthOpen, setHealthOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState('');
    const [checking, setChecking] = React.useState(false);
    const totalSessions = [...TR.word, ...TR.grammar, ...TR.listening, ...TR.shadowing].length;
    const todayCount = streakStats?.todayCount || 0;
    const todayWords = streakStats?.todayWords || 0;
    const streak = streakStats?.streak || 0;
    const loadHealth = React.useCallback(async () => {
      setChecking(true);
      try {
        const r = await fetch('/api/health/services');
        const d = await r.json().catch(() => ({}));
        setHealth(d);
      } catch (e) {
        setHealth({ ok: false, services: [], note: '接続状況の取得に失敗しました。' });
      } finally {
        setChecking(false);
      }
    }, []);
    const toggleHealth = React.useCallback(() => {
      const next = !healthOpen;
      setHealthOpen(next);
      if (next && !health && !checking) loadHealth();
    }, [checking, health, healthOpen, loadHealth]);
    const statusLabel = s => s === 'healthy' ? '健康' : s === 'limited' ? '上限/制限' : s === 'inactive' ? '未有効' : s === 'disconnected' ? '切断中' : s === 'error' ? 'エラー' : '未確認';
    const statusColor = s => s === 'healthy' ? '#059669' : s === 'limited' ? '#B45309' : s === 'inactive' ? '#64748B' : s === 'disconnected' ? '#64748B' : s === 'error' ? '#DC2626' : 'var(--t3)';
    return <div className="sa">
      <div className="stlist">
        <div className="sc" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--pl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{myProfile?.avatar_emoji || '🎓'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="jp" style={{ fontWeight: 800, fontSize: 16 }}>{myProfile?.nickname || authUser?.email || 'ゲスト学習者'}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>{authUser ? 'Googleログイン中' : '未ログイン: この端末に保存'}</div>
          </div>
          <button className="bg" onClick={() => { setNickInput(myProfile?.nickname || ''); setShowNickEdit(true); }}>名前変更</button>
        </div>
        <div className="stst">学習状況</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>今日の学習回数</div><div style={{ fontSize: 26, fontWeight: 800, color: 'var(--p)' }}>{todayCount}<span style={{ fontSize: 13 }}> 回</span></div></div>
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>連続日数</div><div style={{ fontSize: 26, fontWeight: 800, color: 'var(--a)' }}>{streak}<span style={{ fontSize: 13 }}> 日</span></div></div>
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>今日の保存単語</div><div style={{ fontSize: 26, fontWeight: 800 }}>{todayWords}<span style={{ fontSize: 13 }}> 語</span></div><div className="jp" style={{ fontSize: 11, color: 'var(--t3)' }}>動画字幕や英文から保存した語で増えます。</div></div>
          <div className="sc"><div className="jp" style={{ fontSize: 12, color: 'var(--t3)' }}>保存した学習メモ</div><div style={{ fontSize: 26, fontWeight: 800 }}>{saved.length}<span style={{ fontSize: 13 }}> 件</span></div><div className="jp" style={{ fontSize: 11, color: 'var(--t3)' }}>保存した字幕・単語・復習用アイテムです。</div></div>
        </div>
        <div className="stst">学習統計</div>
        <div className="sti"><span>学習ポイント</span><strong>{pts} pt</strong></div>
        <div className="sti"><span>テスト回数</span><strong>{totalSessions} 回</strong></div>
        <div className="stst">ウォレット</div>
        <div className="sti"><span>コイン</span><strong>{wallet.coins}</strong></div>
        <button className="bg" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }} onClick={toggleHealth}>
          <span>接続状況</span>
          <span>{healthOpen ? '△' : '▽'}</span>
        </button>
        {healthOpen && <>
          <button className="bg" style={{ width: '100%', marginTop: 8, marginBottom: 8 }} onClick={loadHealth}>{checking ? 'チェック中...' : '接続を再チェック'}</button>
          {(health?.services || []).map(service => <div key={service.id} className="sc" style={{ marginBottom: 8, padding: 12 }} onClick={() => setExpanded(expanded === service.id ? '' : service.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <div style={{ fontWeight: 800 }}>{service.id}</div>
              <strong style={{ color: statusColor(service.status) }}>{statusLabel(service.status)}</strong>
            </div>
            <div className="jp" style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>{service.message}{typeof service.latencyMs === 'number' ? ` / ${service.latencyMs}ms` : ''}</div>
            {expanded === service.id && <div className="jp" style={{ fontSize: 11, color: service.lastError ? '#DC2626' : 'var(--t3)', marginTop: 8, whiteSpace: 'pre-wrap' }}>{service.lastError || '直近のチェックエラーはありません。接続回数は各API提供元の管理画面で確認してください。'}</div>}
          </div>)}
          <div className="jp" style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.6 }}>{health?.note || 'AIと外部サービスの直近チェック結果を表示します。'}</div>
        </>}
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
