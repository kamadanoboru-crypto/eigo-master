import Head from 'next/head';
import Link from 'next/link';
import styles from './pages.module.css';

export default function Terms() {
  return (
    <>
      <Head>
        <title>利用規約 | 英語マスター</title>
        <meta name="description" content="英語マスターの利用規約です。サービス利用にあたってのルールをご確認ください。" />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/">
            <a className={styles.logo}>🎓 英語マスター</a>
          </Link>
        </header>

        <main className={styles.main}>
          <article className={styles.article}>
            <h1>利用規約</h1>
            <p className={styles.lastUpdate}>最終更新日：2025年5月</p>

            <section>
              <h2>1. 本規約の適用</h2>
              <p>
                本規約は、「英語マスター」（以下「本アプリ」）の利用にあたり、ユーザーが同意すべき条件を定めています。本アプリを利用することで、本規約に同意したものと見なされます。
              </p>
            </section>

            <section>
              <h2>2. サービスの内容</h2>
              <p>
                本アプリは、YouTube動画やBBCニュースを活用した英語学習支援サービスを提供しています。サービス内容は予告なく変更されることがあります。
              </p>
            </section>

            <section>
              <h2>3. ユーザーの責務</h2>
              <ul>
                <li>本アプリは個人的な学習目的のみに使用するものとします</li>
                <li>本アプリを商用目的で利用してはいけません</li>
                <li>
                  他のユーザーの権利を侵害する行為、不正アクセス、データの改ざんなどを行ってはいけません
                </li>
                <li>法律に違反する行為を行ってはいけません</li>
                <li>YouTube等の外部サービスの利用規約を遵守する必要があります</li>
              </ul>
            </section>

            <section>
              <h2>4. 知的財産権</h2>

              <h3>4.1 本アプリのコンテンツ</h3>
              <p>
                本アプリで提供されるUI、デザイン、機能等の知的財産権は、本アプリ運営者に帰属します。
              </p>

              <h3>4.2 YouTube動画等の著作権</h3>
              <p>
                YouTube動画、BBC動画・音声等の著作権は各権利者に帰属します。本アプリで提供される字幕・翻訳は学習補助目的に限り使用できます。
              </p>

              <h3>4.3 AI生成コンテンツ</h3>
              <p>
                本アプリが提供する字幕・翻訳・文法説明はAIによって生成されたものです。その正確性は保証されません。
              </p>
            </section>

            <section>
              <h2>5. 免責事項</h2>
              <ul>
                <li>
                  本アプリが提供する字幕・翻訳・文法説明等の<strong>正確性は保証されません</strong>。学習補助ツールとしてのみご利用ください。
                </li>
                <li>本アプリの不具合・障害に起因する損害について、我々は一切の責任を負いません</li>
                <li>
                  外部サービス（YouTube、BBC等）の停止・変更に対して、我々は責任を負いません
                </li>
                <li>
                  本アプリの利用に際してウイルスやマルウェアに感染した場合、我々は責任を負いません
                </li>
                <li>
                  本アプリによる学習成果（TOEIC・英検等の資格試験合格等）は保証されません
                </li>
              </ul>
            </section>

            <section>
              <h2>6. AI字幕・翻訳について</h2>
              <div className={styles.notice}>
                <p>
                  <strong>⚠️ 重要：</strong> 本アプリで提供される<strong>AI字幕・翻訳・文法説明の正確性は保証されません</strong>。
                </p>
                <ul>
                  <li>学習補助目的での利用のみを想定しています</li>
                  <li>公式な翻訳・字幕としての利用はできません</li>
                  <li>重要な翻訳には公式ツールや専門家の確認が必要です</li>
                </ul>
              </div>
            </section>

            <section>
              <h2>7. YouTube・外部コンテンツについて</h2>
              <p>
                本アプリで使用されるYouTube動画の著作権は各権利者（コンテンツ作成者等）に帰属します。
              </p>
              <ul>
                <li>動画の使用は学習目的のみとします</li>
                <li>動画の違法複製・配信・販売は厳禁です</li>
                <li>
                  YouTube利用規約を遵守する必要があります
                </li>
              </ul>
            </section>

            <section>
              <h2>8. サービスの中断・停止</h2>
              <p>
                本アプリ運営者は、以下の場合、予告なくサービスを中断・停止することができます：
              </p>
              <ul>
                <li>本規約違反が認められた場合</li>
                <li>システム保守・更新が必要な場合</li>
                <li>不可抗力による支障が生じた場合</li>
                <li>本アプリの提供継続が困難と判断した場合</li>
              </ul>
            </section>

            <section>
              <h2>9. 個人情報の取り扱い</h2>
              <p>
                個人情報の取り扱いについては、<Link href="/privacy-policy">プライバシーポリシー</Link>をご参照ください。
              </p>
            </section>

            <section>
              <h2>10. 規約の変更</h2>
              <p>
                本規約は、予告なく変更される可能性があります。変更後の規約は本ページに掲載した時点で効力を生じます。
              </p>
            </section>

            <section>
              <h2>11. 準拠法</h2>
              <p>
                本規約の解釈・適用については、日本法に準拠します。
              </p>
            </section>

            <section>
              <h2>12. お問い合わせ</h2>
              <p>
                本利用規約についてのご質問やご不明な点は、<Link href="/contact">お問い合わせ</Link>ページからお気軽にご連絡ください。
              </p>
            </section>
          </article>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <Link href="/">ホーム</Link>
            <Link href="/about">について</Link>
            <Link href="/privacy-policy">プライバシーポリシー</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
          <p>&copy; 2025 英語マスター. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
