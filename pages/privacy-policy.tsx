import Head from 'next/head';
import Link from 'next/link';
import styles from './pages.module.css';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>プライバシーポリシー | English Base</title>
        <meta name="description" content="English Baseのプライバシーポリシーです。個人情報の取り扱いについて説明しています。" />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/">
            <a className={styles.logo}>🎓 English Base</a>
          </Link>
        </header>

        <main className={styles.main}>
          <article className={styles.article}>
            <h1>プライバシーポリシー</h1>
            <p className={styles.lastUpdate}>最終更新日：2026年5月</p>

            <section>
              <h2>1. はじめに</h2>
              <p>
                「English Base」（以下「本アプリ」）は、ユーザーのプライバシーを重視しています。本プライバシーポリシーは、本アプリにおける個人情報の取り扱いについて説明しています。
              </p>
            </section>

            <section>
              <h2>2. 収集する情報</h2>

              <h3>2.1 ユーザーが直接入力する情報</h3>
              <ul>
                <li>Google Account情報（ログイン時のみ）</li>
                <li>学習履歴・成績データ</li>
                <li>AI翻訳・AIアドバイス生成に必要な学習状況、過去のアドバイス履歴</li>
                <li>お問い合わせフォーム入力内容</li>
              </ul>

              <h3>2.2 自動的に収集される情報</h3>
              <ul>
                <li>
                  <strong>Google Analytics</strong>：アクセス解析のため、ページビュー、セッション情報等を収集
                </li>
                <li>
                  <strong>Google AdSense</strong>：広告配信のため、クッキー等を使用して関心・行動データを収集
                </li>
                <li>
                  <strong>サーバーログ</strong>：IPアドレス、ブラウザ種類、アクセス時刻等を記録
                </li>
              </ul>
            </section>

            <section>
              <h2>3. 情報の利用目的</h2>
              <ul>
                <li>本アプリの提供・改善</li>
                <li>学習支援・成績管理</li>
                <li>ユーザーのサポート対応</li>
                <li>
                  アクセス解析・利用統計（個人を特定しない形で集計）
                </li>
                <li>Google AdSenseによる適切な広告配信</li>
                <li>アフィリエイトリンクの効果測定、学習サービスの推薦</li>
                <li>利用規約等の遵守確認</li>
              </ul>
            </section>

            <section>
              <h2>3.1 AI機能について</h2>
              <p>
                本アプリは、翻訳、単語解説、学習アドバイス等の生成にAIサービスを利用する場合があります。AI生成の品質向上とコスト削減のため、一度生成した翻訳・アドバイス等をデータベースに保存し、同様の学習場面で再利用することがあります。
              </p>
            </section>

            <section>
              <h2>4. 情報の保護</h2>
              <p>
                本アプリは、Supabaseを通じた安全な暗号化通信（SSL/TLS）を使用し、情報を保護しています。ただし、インターネット上の通信は完全に安全であることを保証できません。
              </p>
            </section>

            <section>
              <h2>5. Google Analytics・AdSenseについて</h2>
              <p>
                本アプリは、Google Analytics および Google AdSense を使用しています。これらのサービスは、Googleプライバシーポリシーに従って個人情報を処理します。
              </p>
              <p>
                詳細は <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google プライバシーポリシー</a> をご参照ください。
              </p>
            </section>

            <section>
              <h2>6. Supabaseについて</h2>
              <p>
                本アプリは、Supabaseをバックエンドサービスとして使用しており、認証・データベース・ストレージなどの処理が行われます。詳細は <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabaseプライバシーポリシー</a> をご参照ください。
              </p>
            </section>

            <section>
              <h2>7. 第三者への情報開示</h2>
              <p>
                本アプリは、ユーザーの同意なく個人情報を第三者に提供することはありません。ただし、以下の場合は例外とします：
              </p>
              <ul>
                <li>法律で要求された場合</li>
                <li>本アプリの利用規約に違反する行為が認められた場合</li>
                <li>ユーザーの同意を得た場合</li>
              </ul>
            </section>

            <section>
              <h2>8. クッキーの使用</h2>
              <p>
                本アプリは、利便性向上のためクッキーを使用します。ブラウザの設定によりクッキーを無効にできますが、本アプリの機能が一部制限される可能性があります。
              </p>
            </section>

            <section>
              <h2>9. ポリシーの変更</h2>
              <p>
                本プライバシーポリシーは、予告なく変更される可能性があります。変更後のポリシーは本ページに掲載した時点で効力を生じます。
              </p>
            </section>

            <section>
              <h2>10. お問い合わせ</h2>
              <p>
                本プライバシーポリシーについてのご質問やご不明な点は、<Link href="/contact">お問い合わせ</Link>ページからお気軽にご連絡ください。
              </p>
            </section>
          </article>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <Link href="/">ホーム</Link>
            <Link href="/about">について</Link>
            <Link href="/terms">利用規約</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
          <p>&copy; 2025 English Base. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
