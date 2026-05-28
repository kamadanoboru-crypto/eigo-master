import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

export default function About() {
  return (
    <SiteLayout
      title="このサイトについて | Eigo Master"
      description="Eigo Masterのサービス内容、学習支援機能、運営方針について紹介します。"
    >
      <article className={styles.article}>
        <h1>このサイトについて</h1>
        <p>
          Eigo Masterは、英語学習を継続しやすくするための学習支援サービスです。
          TOEIC対策、英単語、英文法、動画学習、AI会話練習を組み合わせ、
          学習者が毎日少しずつ英語に触れられる環境を作ることを運営方針としています。
        </p>
        <section>
          <h2>サービスで支援する学習</h2>
          <p>
            Eigo Masterでは、TOEIC頻出単語の確認、Part 5形式の英文法問題、YouTube英語動画を使ったリスニング、
            AIとの英会話練習、学習履歴の記録を提供しています。ひとつの教材だけに頼るのではなく、
            読む、聞く、解く、話す準備を少しずつ組み合わせることで、学習を習慣にしやすくします。
          </p>
        </section>
        <section>
          <h2>学習メディアとしての方針</h2>
          <p>
            アプリ機能だけでなく、英語学習の進め方を解説するコラムも掲載しています。
            TOEIC初心者が何から始めるべきか、単語を忘れにくくするにはどう復習するか、
            YouTubeやAIをどのように学習へ取り入れるかを、具体例とともに紹介します。
          </p>
        </section>
        <section>
          <h2>AI機能について</h2>
          <p>
            AIによる翻訳、説明、会話練習は学習補助を目的としています。生成内容は常に正確とは限らないため、
            重要な判断や公式な翻訳には辞書、公式教材、専門家の確認を併用してください。
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
