import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

const EigoMaster = dynamic(() => import('../components/EigoMaster'), {
  ssr: false,
  loading: () => (
    <div className={styles.appLoading}>
      <div className={styles.appLoadingTitle}>Eigo Master</div>
      <div>学習アプリを読み込んでいます...</div>
    </div>
  ),
});

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) return <EigoMaster />;

  return (
    <>
      <Head>
        <title>Eigo Master | AIと動画で続ける英語学習</title>
        <meta
          name="description"
          content="Eigo Masterは、英単語・英文法・動画学習・AI会話練習を組み合わせた英語学習支援サービスです。"
        />
      </Head>
      <SiteLayout
        title="Eigo Master | AIと動画で続ける英語学習"
        description="Eigo Masterは、英単語・英文法・動画学習・AI会話練習を組み合わせた英語学習支援サービスです。"
      >
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>英語学習メディア + 学習アプリ</p>
            <h1>AIと動画で続ける英語学習</h1>
            <p>
              Eigo Masterは、英単語・英文法・動画学習・AI会話練習を組み合わせた英語学習支援サービスです。
              TOEIC対策を始めたい人、英語学習を習慣化したい人、YouTubeを教材として使いたい人が、
              毎日少しずつ英語に触れられる環境を目指しています。
            </p>
            <div className={styles.heroActions}>
              <button className={styles.primaryButton} onClick={() => setShowApp(true)}>学習アプリを開く</button>
              <Link href="/blog" className={styles.secondaryButton}>学習コラムを読む</Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>できること</h2>
          <div className={styles.cardGrid}>
            <div className={styles.infoCard}><h3>TOEIC頻出単語の学習</h3><p>ビジネスや日常の英文でよく出る単語を、短い練習と復習で確認できます。</p></div>
            <div className={styles.infoCard}><h3>Part 5形式の英文法問題</h3><p>品詞、時制、前置詞、接続詞など、TOEICで問われやすい文法を短文で練習できます。</p></div>
            <div className={styles.infoCard}><h3>YouTube英語動画でリスニング</h3><p>興味のある動画を教材にして、聞き取れない表現や単語を確認できます。</p></div>
            <div className={styles.infoCard}><h3>AIとの英会話練習</h3><p>学んだ単語や表現を、自分の英文として使うアウトプット練習に活用できます。</p></div>
            <div className={styles.infoCard}><h3>学習履歴の記録</h3><p>学習した内容や結果を振り返り、苦手な単語・問題の復習につなげられます。</p></div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>こんな人におすすめ</h2>
          <ul className={styles.checkList}>
            <li>TOEIC対策を始めたいが、何から手をつけるか迷っている人</li>
            <li>英語学習が三日坊主になりやすく、短時間で続けられる環境がほしい人</li>
            <li>YouTubeで英語を学びたいが、ただ見るだけで終わってしまう人</li>
            <li>スキマ時間に単語や文法を復習し、学習履歴を残したい人</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>使い方</h2>
          <div className={styles.steps}>
            <div><strong>STEP1</strong><span>単語・文法を学ぶ</span></div>
            <div><strong>STEP2</strong><span>動画でリスニングする</span></div>
            <div><strong>STEP3</strong><span>AI会話でアウトプットする</span></div>
            <div><strong>STEP4</strong><span>学習履歴を振り返る</span></div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>学習コラム</h2>
          <p>
            アプリだけでなく、英語学習の進め方や復習方法を解説するコラムも用意しています。
            TOEIC初心者、単語暗記、YouTubeリスニング、シャドーイング、AI英会話の使い方を具体的に紹介しています。
          </p>
          <Link href="/blog" className={styles.textLink}>ブログ記事一覧へ</Link>
        </section>

        <section className={styles.section}>
          <h2>FAQ</h2>
          <div className={styles.faqList}>
            <div><h3>無料で使えますか？</h3><p>基本的な学習機能は無料で利用できます。一部のAI生成や追加機能では、サービス内のコインを使う場合があります。</p></div>
            <div><h3>TOEIC初心者でも使えますか？</h3><p>はい。短い単語練習、Part 5形式の文法問題、短時間の動画学習から始められるため、初心者でも取り組みやすい構成です。</p></div>
            <div><h3>AIの回答は正確ですか？</h3><p>AI生成内容は学習補助の参考情報です。正確性を保証するものではないため、重要な内容は辞書や公式教材でも確認してください。</p></div>
            <div><h3>学習履歴は保存されますか？</h3><p>Googleログインを利用する場合、学習履歴を保存することがあります。ログインしない場合は、ブラウザ内に一部の情報が保存されることがあります。</p></div>
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
