// @ts-nocheck
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

// SSRを無効化（speechSynthesis / localStorage / crypto などブラウザAPIを使用するため）
const EigoMaster = dynamic(
  () => import('../components/EigoMaster'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100vh', gap: 16,
        fontFamily: "'Noto Sans JP', sans-serif", background: '#F8FAFC',
      }}>
        <div style={{ fontSize: 40 }}>🎓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>English Base</div>
        <div style={{ fontSize: 14, color: '#94A3B8' }}>読み込み中...</div>
      </div>
    ),
  },
);

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <EigoMaster />;
  }

  return (
    <>
      <Head>
        <title>English Base - YouTube・BBCで英語を語順のまま理解する学習アプリ</title>
        <meta name="description" content="YouTubeやBBCニュースを使って、英語を語順のまま理解する学習アプリ。字幕チャンク分解、テスト、ゲームで楽しく英語を学習できます。" />
        <meta name="keywords" content="英語学習,YouTube,BBC,TOEIC,英文読解,語順" />
        <meta property="og:title" content="English Base" />
        <meta property="og:description" content="YouTubeやBBCで英語を語順のまま理解する学習アプリ" />
        <meta property="og:type" content="website" />
      </Head>

      <div style={styles.landingPage}>
        {/* ヘッダー */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.appTitle}>🎓 English Base</h1>
            <p style={styles.appTagline}>YouTube・BBCニュースで英語を語順のまま理解する</p>
          </div>
          <nav style={styles.nav}>
            <Link href="/about" style={styles.navLink}>について</Link>
            <Link href="/privacy" style={styles.navLink}>プライバシー</Link>
            <Link href="/terms" style={styles.navLink}>利用規約</Link>
            <Link href="/contact" style={styles.navLink}>お問い合わせ</Link>
          </nav>
        </header>

        {/* ヒーロー */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h2 style={styles.heroTitle}>英語が「読める」から「わかる」へ</h2>
            <p style={styles.heroSubtitle}>
              YouTubeの字幕をチャンク分解。語順のまま意味を理解する訓練で、自然な英文読解力が身につきます。
            </p>
            <button
              onClick={() => setShowApp(true)}
              style={styles.ctaButton}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
            >
              アプリを開く（ログインなしでOK）
            </button>
          </div>
        </section>

        {/* 主な機能 */}
        <section style={styles.features}>
          <h2 style={styles.sectionTitle}>主な機能</h2>
          <div style={styles.featureGrid}>
            {[
              {
                emoji: '🎬',
                title: 'YouTube語順学習',
                desc: '字幕をチャンク分解。語順イメージで英文の流れを理解',
              },
              {
                emoji: '✏️',
                title: 'テスト機能',
                desc: '単語・文法・リスニングのテストで理解度を確認',
              },
              {
                emoji: '🎮',
                title: 'シューティングゲーム',
                desc: '楽しく単語を学習。ゲーム感覚で継続できる',
              },
              {
                emoji: '📰',
                title: 'BBC学習モード',
                desc: 'ニュース英文を単語・文単位で学習',
              },
              {
                emoji: '🎰',
                title: 'ガチャ・装備システム',
                desc: 'ゲーム要素で学習を継続させる工夫',
              },
              {
                emoji: '📊',
                title: 'TOEIC予想スコア',
                desc: '学習履歴からスコアを自動推定',
              },
            ].map((feature, i) => (
              <div key={i} style={styles.featureCard}>
                <div style={styles.featureEmoji}>{feature.emoji}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 注意事項 */}
        <section style={styles.notices}>
          <div style={styles.noticeContainer}>
            <h2 style={styles.sectionTitle}>重要な注意事項</h2>

            <div style={styles.noticeBox}>
              <h3 style={styles.noticeTitle}>⚠️ AI字幕・翻訳について</h3>
              <p style={styles.noticeText}>
                本アプリで提供される字幕・翻訳・文法説明は<strong>AIによって自動生成されたもの</strong>です。完全に正確であることは保証されません。学習補助ツールとしてご利用ください。重要な翻訳は必ず専門家に確認してください。
              </p>
            </div>

            <div style={styles.noticeBox}>
              <h3 style={styles.noticeTitle}>📺 YouTube動画について</h3>
              <p style={styles.noticeText}>
                本アプリで使用されるYouTube動画・音声の著作権は<strong>各権利者に帰属</strong>します。動画の使用は学習目的のみとしており、違法複製・配信は厳禁です。YouTube利用規約をご遵守ください。
              </p>
            </div>

            <div style={styles.noticeBox}>
              <h3 style={styles.noticeTitle}>📝 学習補助について</h3>
              <p style={styles.noticeText}>
                本アプリはTOEIC・英検等の資格試験合格を保証するものではありません。学習支援ツールとしてご活用ください。
              </p>
            </div>

            <div style={styles.noticeBox}>
              <h3 style={styles.noticeTitle}>🔐 プライバシー</h3>
              <p style={styles.noticeText}>
                ログインなしでも利用できますが、ブラウザのキャッシュをクリアするとデータが失われます。Googleログインで安全に学習履歴を保存できます。詳細は<Link href="/privacy" style={{ color: '#2563eb' }}>プライバシーポリシー</Link>をご参照ください。
              </p>
            </div>
          </div>
        </section>

        {/* 使い方 */}
        <section style={styles.howTo}>
          <h2 style={styles.sectionTitle}>使い方</h2>
          <div style={styles.steps}>
            {[
              { num: '1', title: 'ログイン（任意）', desc: 'Google Accountでサインイン' },
              { num: '2', title: 'サンプル動画を選択', desc: 'またはYouTubeのURLを入力' },
              { num: '3', title: '字幕を表示', desc: '語順分解された字幕が表示されます' },
              { num: '4', title: 'テストに挑戦', desc: '理解度を確認。クイズで復習' },
              { num: '5', title: 'ゲームで楽しく', desc: 'シューティングやガチャで継続' },
            ].map((step, i) => (
              <div key={i} style={styles.step}>
                <div style={styles.stepNumber}>{step.num}</div>
                <div>
                  <h3 style={styles.stepTitle}>{step.title}</h3>
                  <p style={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>今すぐ始めよう</h2>
          <p style={styles.ctaSubtitle}>ログインなしで、すぐに学習を開始できます</p>
          <button
            onClick={() => setShowApp(true)}
            style={styles.ctaButtonLarge}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
          >
            アプリを開く
          </button>
        </section>

        {/* フッター */}
        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <p>&copy; 2025 English Base. All rights reserved.</p>
            <div style={styles.footerLinks}>
            <Link href="/about" style={styles.footerLink}>について</Link>
            <Link href="/privacy" style={styles.footerLink}>プライバシー</Link>
            <Link href="/terms" style={styles.footerLink}>利用規約</Link>
            <Link href="/contact" style={styles.footerLink}>お問い合わせ</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

const styles = {
  landingPage: {
    fontFamily: "'Noto Sans JP', sans-serif",
    color: '#1f2937',
    background: '#ffffff',
    minHeight: '100vh',
  } as React.CSSProperties,

  header: {
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,

  headerContent: {
    flex: 1,
  } as React.CSSProperties,

  appTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0',
    color: '#2563eb',
  } as React.CSSProperties,

  appTagline: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: '0.25rem 0 0 0',
  } as React.CSSProperties,

  nav: {
    display: 'flex',
    gap: '1.5rem',
  } as React.CSSProperties,

  navLink: {
    textDecoration: 'none',
    color: '#64748b',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
    cursor: 'pointer',
  } as React.CSSProperties,

  hero: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    padding: '4rem 2rem',
    textAlign: 'center',
  } as React.CSSProperties,

  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  } as React.CSSProperties,

  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    margin: '0 0 1rem 0',
  } as React.CSSProperties,

  heroSubtitle: {
    fontSize: '1.1rem',
    margin: '0 0 2rem 0',
    lineHeight: 1.6,
    opacity: 0.95,
  } as React.CSSProperties,

  ctaButton: {
    background: '#ffffff',
    color: '#2563eb',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  features: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#0f172a',
  } as React.CSSProperties,

  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  } as React.CSSProperties,

  featureCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  featureEmoji: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  } as React.CSSProperties,

  featureTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#0f172a',
  } as React.CSSProperties,

  featureDesc: {
    color: '#64748b',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  } as React.CSSProperties,

  notices: {
    background: '#f0f9ff',
    padding: '4rem 2rem',
    borderTop: '1px solid #bfdbfe',
    borderBottom: '1px solid #bfdbfe',
  } as React.CSSProperties,

  noticeContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  } as React.CSSProperties,

  noticeBox: {
    background: '#fef3c7',
    border: '1px solid #fcd34d',
    borderLeft: '4px solid #f59e0b',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    borderRadius: '6px',
  } as React.CSSProperties,

  noticeTitle: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#b45309',
    marginBottom: '0.5rem',
  } as React.CSSProperties,

  noticeText: {
    color: '#92400e',
    lineHeight: 1.7,
    marginBottom: 0,
  } as React.CSSProperties,

  howTo: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '4rem 2rem',
  } as React.CSSProperties,

  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  } as React.CSSProperties,

  step: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1.5rem',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  } as React.CSSProperties,

  stepNumber: {
    width: '40px',
    height: '40px',
    background: '#2563eb',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    flexShrink: 0,
    fontSize: '1.2rem',
  } as React.CSSProperties,

  stepTitle: {
    fontSize: '1.05rem',
    fontWeight: 600,
    margin: '0 0 0.25rem 0',
    color: '#0f172a',
  } as React.CSSProperties,

  stepDesc: {
    color: '#64748b',
    margin: 0,
  } as React.CSSProperties,

  ctaSection: {
    background: '#f8fafc',
    padding: '4rem 2rem',
    textAlign: 'center',
    borderTop: '1px solid #e2e8f0',
  } as React.CSSProperties,

  ctaTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#0f172a',
  } as React.CSSProperties,

  ctaSubtitle: {
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '2rem',
  } as React.CSSProperties,

  ctaButtonLarge: {
    background: '#2563eb',
    color: '#ffffff',
    padding: '1rem 3rem',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-block',
  } as React.CSSProperties,

  footer: {
    background: '#1e293b',
    color: '#e2e8f0',
    padding: '2rem',
    textAlign: 'center',
    marginTop: '2rem',
  } as React.CSSProperties,

  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,

  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '1rem',
  } as React.CSSProperties,

  footerLink: {
    color: '#93c5fd',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  } as React.CSSProperties,
}
