import Head from 'next/head';
import Link from 'next/link';
import styles from '../pages/pages.module.css';

type SiteLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

const SITE_URL = 'https://eigobase.jp';

export default function SiteLayout({
  title,
  description,
  children,
  canonicalPath,
  ogType = 'website',
  structuredData,
}: SiteLayoutProps) {
  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;
  const jsonLd = structuredData ? JSON.stringify(structuredData).replace(/</g, '\\u003c') : undefined;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="eigo base" />
        {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
        {jsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        ) : null}
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>eigo base</Link>
          <nav className={styles.nav} aria-label="メインナビゲーション">
            <Link href="/">ホーム</Link>
            <Link href="/columns">学習コラム</Link>
            <Link href="/recommend/english-learning-services">おすすめ教材</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about">運営者情報</Link>
            <Link href="/contact">お問い合わせ</Link>
          </nav>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <Link href="/">ホーム</Link>
            <Link href="/columns">学習コラム</Link>
            <Link href="/recommend/english-learning-services">おすすめ教材</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about">運営者情報</Link>
            <Link href="/terms">利用規約</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
            <Link href="/sitemap">サイトマップ</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
          <p>&copy; eigo base. 英語学習を毎日の習慣にするための学習支援サービスです。</p>
        </footer>
      </div>
    </>
  );
}


