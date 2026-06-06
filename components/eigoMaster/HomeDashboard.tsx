// @ts-nocheck

import React from "react";

export function HomeDashboard({
  DEFAULT_THUMBNAIL,
  I,
  StudySapuriCard,
  dVids,
  goVideo,
  openGrammarHub,
  setNavTab,
  setScreen,
  streakStats,
  wallet
}) {
  const latestVideo = dVids?.[0];
  const streak = Number(streakStats?.streak || 0);
  const cards = [{
    title: "TOEIC Part5",
    desc: "文法と語彙を10問で確認",
    icon: "info",
    bg: "linear-gradient(135deg,#14B8A6,#0F766E)",
    onClick: () => openGrammarHub()
  }, {
    title: "単語学習",
    desc: "TOEIC頻出単語を復習",
    icon: "book",
    bg: "linear-gradient(135deg,#6D5BD0,#4338CA)",
    onClick: () => setScreen("wordHub")
  }, {
    title: "リスニング",
    desc: "音声で理解力を伸ばす",
    icon: "ear",
    bg: "linear-gradient(135deg,#F97316,#EA580C)",
    onClick: () => setScreen("listeningHub")
  }, {
    title: "動画学習",
    desc: "YouTube字幕で学ぶ",
    icon: "yt",
    bg: "linear-gradient(135deg,#EF4444,#DC2626)",
    onClick: () => setScreen("videoLibrary")
  }, {
    title: "ニュース学習",
    desc: "海外生活ニュースを読む",
    icon: "news",
    bg: "linear-gradient(135deg,#3B82F6,#1D4ED8)",
    onClick: () => setNavTab("news")
  }, {
    title: "ランキング",
    desc: "学習の積み上げを確認",
    icon: "trophy",
    bg: "linear-gradient(135deg,#F59E0B,#D97706)",
    onClick: () => setNavTab("talk")
  }];

  return (
    <div className="sa">
      <div style={{ padding: "14px 16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{
          background: "linear-gradient(135deg,#0B1F38,#1D4ED8)",
          borderRadius: "var(--r)",
          padding: 18,
          color: "#fff",
          boxShadow: "var(--sh)",
          border: "1px solid rgba(255,255,255,.18)"
        }}>
          <div className="jp" style={{ fontSize: 12, fontWeight: 700, opacity: .82, marginBottom: 8 }}>今日の学習</div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-end" }}>
            <div>
              <div className="jp" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2 }}>
                {streak > 0 ? `${streak}日連続！` : "今日からスタート"}
              </div>
              <div className="jp" style={{ fontSize: 12, opacity: .78, marginTop: 6 }}>
                英語をもっと楽しく、もっと続く体験へ。
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div className="jp" style={{ fontSize: 11, opacity: .78 }}>コイン</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{wallet?.coins ?? 0}</div>
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,.24)", marginTop: 14, overflow: "hidden" }}>
            <div style={{
              width: `${Math.min(100, Math.max(18, streak * 8))}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg,#FFFFFF,#FDE68A)"
            }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
          {cards.map(card => (
            <button key={card.title} className="lcard" onClick={card.onClick} style={{
              minHeight: 118,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 10,
              padding: 14,
              background: card.bg,
              color: "#fff",
              border: "none"
            }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,.2)"
              }}>
                {I({ n: card.icon, s: 21, c: "#fff" })}
              </div>
              <div>
                <div className="jp" style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.25, marginBottom: 4 }}>{card.title}</div>
                <div className="jp" style={{ fontSize: 11, lineHeight: 1.45, opacity: .86 }}>{card.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{
          background: "rgba(255,253,248,.9)",
          border: "1px solid rgba(222,214,200,.82)",
          borderRadius: "var(--r)",
          padding: 14,
          boxShadow: "var(--sh)"
        }}>
          <div className="jp" style={{ fontSize: 12, fontWeight: 800, color: "var(--t)", marginBottom: 10 }}>今日のおすすめ</div>
          {latestVideo ? (
            <button className="vcard" onClick={() => goVideo(latestVideo)} style={{ padding: 0, boxShadow: "none", border: "none", background: "transparent" }}>
              <div className="vth">
                <img src={latestVideo.thumbnail || DEFAULT_THUMBNAIL} alt="" onError={e => {
                  const img = e.currentTarget;
                  if (img.src !== DEFAULT_THUMBNAIL) img.src = DEFAULT_THUMBNAIL;
                }} />
                <div className="vtho">{I({ n: "play", s: 22, c: "white" })}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  marginBottom: 4
                }}>{latestVideo.title}</div>
                <div className="jp" style={{ fontSize: 11, color: "var(--t3)" }}>動画学習・5分</div>
              </div>
              {I({ n: "chR", s: 18, c: "var(--t3)" })}
            </button>
          ) : (
            <div className="jp" style={{ fontSize: 12, color: "var(--t2)" }}>学習メニューから動画を追加できます。</div>
          )}
        </div>

        <StudySapuriCard screenName="home" variant="home" />
      </div>
    </div>
  );
}
