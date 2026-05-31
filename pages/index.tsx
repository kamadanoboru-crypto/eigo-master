import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import SiteLayout from '../components/SiteLayout';
import { blogPosts } from '../lib/blogPosts';
import styles from './pages.module.css';

const EigoMaster = dynamic(() => import('../components/EigoMaster'), {
  ssr: false,
  loading: () => (
    <div className={styles.appLoading}>
      <div className={styles.appLoadingTitle}>English Base</div>
      <div>学習アプリを読み込んでいます...</div>
    </div>
  ),
});

const description =
  'English Baseは、TOEIC、英単語、英文法、動画リスニング、AI学習アドバイスを組み合わせて、毎日の英語学習を続けやすくする学習支援サービスです。';

const faqPreview = [
  ['無料で使えますか？', '基本的な学習機能は利用できます。一部のAI生成や高度な処理では、アプリ内のコインを使う場合があります。'],
  ['TOEIC初心者でも使えますか？', 'はい。単語、Part5、短いリスニングから始められるため、基礎固めにも使えます。'],
  ['AIの答えは正確ですか？', 'AIの説明は学習補助です。重要な内容は公式教材や信頼できる資料でも確認してください。'],
  ['スマホでも使えますか？', 'スマホ表示を前提に調整しています。短時間の復習や動画学習にも使いやすい構成です。'],
];

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) return <EigoMaster />;

  return (
    <>
      <Head>
        <title>English Base | AIと動画で続ける英語学習</title>
        <meta name="description" content={description} />
      </Head>
      <SiteLayout title="English Base | AIと動画で続ける英語学習" description={description}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>英語学習メディア + 学習アプリ</p>
            <h1>AIと動画で続ける英語学習</h1>
            <p>
              English Baseは、英単語、TOEIC Part5、動画リスニング、ニュース読解、AI学習アドバイスを
              組み合わせた学習支援サービスです。短い時間でも練習し、間違えた内容を復習し、
              英語に触れる習慣を作ることを目的にしています。
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
            <div className={styles.infoCard}><h3>TOEIC頻出単語</h3><p>4択テストや復習機能で、意味を素早く判断する練習ができます。</p></div>
            <div className={styles.infoCard}><h3>Part5英文法</h3><p>空所補充問題を通して、品詞、時制、前置詞、接続詞を確認できます。</p></div>
            <div className={styles.infoCard}><h3>動画リスニング</h3><p>YouTubeの英語動画を使い、字幕、対訳、単語確認を学習に変えられます。</p></div>
            <div className={styles.infoCard}><h3>AI学習補助</h3><p>翻訳、単語説明、学習アドバイスなどを、復習のきっかけとして活用できます。</p></div>
            <div className={styles.infoCard}><h3>学習履歴</h3><p>ミスした問題や保存した内容を見直し、次の学習に戻せます。</p></div>
            <div className={styles.infoCard}><h3>学習コミュニティ</h3><p>共有動画や投稿を通して、他の学習者の教材にも触れられます。</p></div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>こんな人におすすめ</h2>
          <ul className={styles.checkList}>
            <li>TOEIC対策を始めたいが、単語・文法・リスニングの順番に迷っている人</li>
            <li>英語学習が続かず、短時間で再開できる場所を作りたい人</li>
            <li>YouTubeやニュースを英語学習の素材として使いたい人</li>
            <li>AIの説明を参考にしながら、自分の弱点を整理したい人</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>利用の流れ</h2>
          <div className={styles.steps}>
            <div><strong>STEP1</strong><span>単語を学ぶ</span></div>
            <div><strong>STEP2</strong><span>Part5で文法を確認する</span></div>
            <div><strong>STEP3</strong><span>動画でリスニングする</span></div>
            <div><strong>STEP4</strong><span>学習履歴を振り返る</span></div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>学習コラム</h2>
          <div className={styles.blogList}>
            {blogPosts.slice(0, 4).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.blogCard}>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <span>記事を読む</span>
              </Link>
            ))}
          </div>
          <p><Link href="/blog" className={styles.textLink}>すべての学習コラムを見る</Link></p>
        </section>

        <section className={styles.section}>
          <h2>FAQ</h2>
          <div className={styles.faqList}>
            {faqPreview.map(([q, a]) => (
              <div key={q}><h3>{q}</h3><p>{a}</p></div>
            ))}
          </div>
          <p><Link href="/faq" className={styles.textLink}>FAQをすべて見る</Link></p>
        </section>
      </SiteLayout>
    </>
  );
}
