import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

export default function About() {
  return (
    <SiteLayout
      title="このサイトについて | Eigo Master"
      description="Eigo Masterの学習機能、AI機能、コイン、学習履歴、コミュニティ機能について説明します。"
    >
      <article className={styles.article}>
        <h1>このサイトについて</h1>
        <p>
          Eigo Masterは、英語学習を続けやすくするための学習支援アプリです。
          TOEIC頻出単語、Part 5文法、リスニング、単語シューティング、動画字幕学習、
          ニュース読解、AI学習アドバイス、学習トークを組み合わせています。
        </p>
        <section>
          <h2>学習機能</h2>
          <p>
            単語テスト、Part 5形式の空欄補充、リスニング問題、単語シューティングで基礎練習ができます。
            Part 5は既存問題とAI生成問題を組み合わせ、問題へのいいね・わるいねも出題の重み付けに使います。
          </p>
        </section>
        <section>
          <h2>動画・ニュース学習</h2>
          <p>
            YouTube字幕を使った英文確認、保存、AI日本語イメージ生成に対応しています。
            BBCやPage SixのRSS要約を使った読解学習では、単語確認や全文翻訳を補助的に利用できます。
          </p>
        </section>
        <section>
          <h2>AI機能について</h2>
          <p>
            AIは翻訳、単語説明、Part 5問題生成、動画字幕の日本語イメージ生成、学習アドバイスに使います。
            AI生成内容は参考情報であり、正確性が必要な内容は辞書や公式教材も併用してください。
          </p>
        </section>
        <section>
          <h2>学習履歴とコミュニティ</h2>
          <p>
            学習履歴、ポイント、コイン消費、ランキング、学習トークを通じて、学習の継続を支援します。
            Googleログイン時はクラウド保存、未ログイン時はブラウザ保存を使う場合があります。
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
