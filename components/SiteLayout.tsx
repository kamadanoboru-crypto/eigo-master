import Head from 'next/head';
import Link from 'next/link';
import styles from '../pages/pages.module.css';

type SiteLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function SiteLayout({ title, description, children }: SiteLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>English Base</Link>
          <nav className={styles.nav} aria-label="メインナビゲーション">
            <Link href="/">ホーム</Link>
            <Link href="/blog">学習コラム</Link>
            <Link href="/recommend/english-learning-services">おすすめ教材</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about">このサイトについて</Link>
            <Link href="/contact">お問い合わせ</Link>
          </nav>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <Link href="/">ホーム</Link>
            <Link href="/blog">学習コラム</Link>
            <Link href="/recommend/english-learning-services">おすすめ教材</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about">このサイトについて</Link>
            <Link href="/terms">利用規約</Link>
            <Link href="/privacy-policy">プライバシーポリシー</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
          <p>&copy; 2026 English Base. 英語学習を毎日の習慣にするための学習支援サービスです。</p>
        </footer>
      </div>
    </>
  );
}
