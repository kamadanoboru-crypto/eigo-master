import Head from 'next/head';
import Link from 'next/link';
import styles from './pages.module.css';

export default function About() {
  return (
    <>
      <Head>
        <title>英語マスターについて | 英語マスター</title>
        <meta name="description" content="英語マスターについてのページです。アプリの概要と機能を紹介しています。" />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/">
            <a className={styles.logo}>🎓 英語マスター</a>
          </Link>
        </header>

        <main className={styles.main}>
          <article className={styles.article}>
            <h1>英語マスターについて</h1>

            <section>
              <h2>アプリの概要</h2>
              <p>
                「英語マスター」は、YouTube動画やBBCニュースを使って<strong>英語を語順のまま理解する</strong>ことを目的とした学習アプリです。
              </p>
              <p>
                従来の日本語訳を見てから英語に戻る学習方法ではなく、英文の語順のまま意味を理解する訓練に特化しています。
              </p>
            </section>

            <section>
              <h2>主な機能</h2>
              <ul>
                <li><strong>YouTube語順学習</strong>：字幕をチャンク分解して、語順イメージを表示</li>
                <li><strong>単語・文法・リスニングテスト</strong>：AIが自動生成、2回目以降はキャッシュから提供</li>
                <li><strong>シューティング単語ゲーム</strong>：楽しく単語を学習</li>
                <li><strong>ガチャシステム</strong>：スキルチケット取得で学習をゲーム化</li>
                <li><strong>対訳リーダー</strong>：英文と翻訳を上下分割表示で学習</li>
                <li><strong>BBC学習モード</strong>：ニュース英文を単語・文単位で学習</li>
              </ul>
            </section>

            <section>
              <h2>学習補助について</h2>
              <div className={styles.notice}>
                <p>
                  <strong>⚠️ 重要：</strong> 本アプリで提供される<strong>AI字幕・翻訳・文法説明の正確性は保証されません</strong>。
                </p>
                <p>
                  学習補助ツールとしてご利用ください。より正確な情報が必要な場合は、専門の辞書や教材をご参照ください。
                </p>
              </div>
            </section>

            <section>
              <h2>コンテンツについて</h2>
              <div className={styles.notice}>
                <p>
                  <strong>YouTube動画について：</strong><br />
                  本アプリで使用されるYouTube動画および音声の著作権は、各権利者（コンテンツ作成者・著作権保有者）に帰属します。
                </p>
                <p>
                  動画の利用は学習目的のためのみとします。コンテンツの違法複製・配信等は厳禁です。
                </p>
              </div>
            </section>

            <section>
              <h2>使い方</h2>
              <ol>
                <li><strong>ログイン（任意）</strong>：Google Accountでログインすると、学習履歴が保存されます</li>
                <li><strong>動画を選択</strong>：YouTubeのURLを入力、またはサンプル動画から選択</li>
                <li><strong>字幕を表示</strong>：語順分解された字幕が表示されます</li>
                <li><strong>テストに挑戦</strong>：単語・文法・リスニングテストで理解度を確認</li>
                <li><strong>ゲームで復習</strong>：シューティングゲームやガチャで楽しく復習</li>
              </ol>
            </section>

            <section>
              <h2>注意事項</h2>
              <ul>
                <li>本アプリは学習支援ツールです。TOEIC・英検等の資格試験対策を保証するものではありません</li>
                <li>
                  YouTubeなど外部サービスへのアクセスは、各サービスの利用規約に従う必要があります
                </li>
                <li>個人的な学習目的以外の使用（商用利用等）はご遠慮ください</li>
                <li>
                  本アプリの不具合に起因する損害について、我々は一切の責任を負いません
                </li>
              </ul>
            </section>

            <section>
              <h2>サポート</h2>
              <p>
                ご不明な点やご質問は、<Link href="/contact">お問い合わせ</Link>ページからお気軽にご連絡ください。
              </p>
            </section>
          </article>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <Link href="/">ホーム</Link>
            <Link href="/privacy-policy">プライバシーポリシー</Link>
            <Link href="/terms">利用規約</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
          <p>&copy; 2025 英語マスター. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
