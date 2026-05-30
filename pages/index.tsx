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

const description =
  'Eigo Masterは、TOEIC頻出単語、Part 5文法、リスニング、動画字幕学習、ニュース読解、AIアドバイスを組み合わせた英語学習アプリです。';

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) return <EigoMaster />;

  return (
    <>
      <Head>
        <title>Eigo Master | TOEIC・動画・AIで続ける英語学習</title>
        <meta name="description" content={description} />
      </Head>
      <SiteLayout title="Eigo Master | TOEIC・動画・AIで続ける英語学習" description={description}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>英語学習メディア + 学習アプリ</p>
            <h1>TOEIC・動画・AIで続ける英語学習</h1>
            <p>
              Eigo Masterは、短時間の単語・文法練習、YouTubeやニュースを使った読解・リスニング、
              AIによる翻訳や学習アドバイスを組み合わせて、毎日少しずつ英語に触れられる環境を目指しています。
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
            <div className={styles.infoCard}><h3>TOEIC頻出単語</h3><p>単語テストと単語シューティングで、意味の判断スピードを鍛えられます。</p></div>
            <div className={styles.infoCard}><h3>Part 5文法</h3><p>既存問題とAI生成問題を組み合わせ、4択の空欄補充問題を練習できます。</p></div>
            <div className={styles.infoCard}><h3>動画字幕学習</h3><p>YouTubeの字幕を使い、英文、単語、日本語イメージを確認しながら学べます。</p></div>
            <div className={styles.infoCard}><h3>ニュース読解</h3><p>BBCやPage Sixの要約を読み、単語確認やAI翻訳を学習補助として使えます。</p></div>
            <div className={styles.infoCard}><h3>学習SNS</h3><p>学習トーク、いいね、コメント、ランキングで学習を続けやすくします。</p></div>
            <div className={styles.infoCard}><h3>AI学習コーチ</h3><p>学習履歴をもとに、次に取り組む内容のヒントを受け取れます。</p></div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>こんな人におすすめ</h2>
          <ul className={styles.checkList}>
            <li>TOEIC対策を始めたいが、単語・文法・リスニングをどう回すか迷っている人</li>
            <li>YouTubeやニュースを教材にして、実際の英文に触れる時間を増やしたい人</li>
            <li>ゲーム感覚の単語復習やランキングで、学習の継続力を上げたい人</li>
            <li>AI翻訳やAIアドバイスを参考にしながら、自分の弱点を整理したい人</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>使い方</h2>
          <div className={styles.steps}>
            <div><strong>STEP1</strong><span>単語・Part 5・リスニングを解く</span></div>
            <div><strong>STEP2</strong><span>動画やニュースで英文に触れる</span></div>
            <div><strong>STEP3</strong><span>保存単語やミス問題を復習する</span></div>
            <div><strong>STEP4</strong><span>学習履歴とランキングを確認する</span></div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>FAQ</h2>
          <div className={styles.faqList}>
            <div><h3>無料で使えますか？</h3><p>基本的な学習機能は利用できます。一部のAI生成、翻訳、動画字幕生成などではアプリ内コインを使います。</p></div>
            <div><h3>TOEIC初心者でも使えますか？</h3><p>はい。短い単語練習、Part 5形式の文法問題、短時間の動画学習から始められます。</p></div>
            <div><h3>AIの回答は正確ですか？</h3><p>AI生成内容は学習補助です。正確性が必要な内容は辞書や公式教材でも確認してください。</p></div>
            <div><h3>学習履歴は保存されますか？</h3><p>Googleログイン時はSupabaseに保存される場合があります。未ログイン時はブラウザ内に保存される情報があります。</p></div>
          </div>
        </section>
      </SiteLayout>
    </>
  );
}
