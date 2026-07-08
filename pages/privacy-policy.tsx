import Link from 'next/link';
import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

export default function PrivacyPolicy() {
  return (
    <SiteLayout
      title="プライバシーポリシー | eigo base"
      description="eigo baseにおける個人情報、Cookie、アクセス解析、Google AdSense、アフィリエイト、問い合わせ情報の扱いを説明します。"
      canonicalPath="/privacy"
    >
      <article className={styles.article}>
        <h1>プライバシーポリシー</h1>
        <p className={styles.lastUpdate}>最終更新日：2026年7月8日</p>

        <section>
          <h2>基本方針</h2>
          <p>
            eigo baseは、英語学習メディアおよび学習支援サービスとして、利用者のプライバシーを尊重します。
            本ページでは、当サイトで取得する可能性のある情報、Cookieの利用、アクセス解析、広告配信、
            アフィリエイト、個人情報の管理方針について説明します。
          </p>
        </section>

        <section>
          <h2>取得する可能性のある情報</h2>
          <p>
            当サイトでは、サービス提供と改善のため、ニックネーム、ログインに関する識別情報、学習履歴、
            問題への回答履歴、投稿内容、お問い合わせ内容、アクセスログ、ブラウザや端末に関する情報を取得する場合があります。
            取得した情報は、学習機能の提供、復習体験の改善、不正利用防止、お問い合わせ対応のために利用します。
          </p>
        </section>

        <section>
          <h2>Cookieとアクセス解析</h2>
          <p>
            当サイトでは、利便性向上、ログイン状態の保持、アクセス解析、広告配信、アフィリエイト成果計測のためにCookieを使用する場合があります。
            Cookieはブラウザ設定により無効化できます。ただし、Cookieを無効にすると一部の機能が正しく動作しない場合があります。
          </p>
          <p>
            Google Analyticsなどのアクセス解析ツールを利用する場合、ページ閲覧数、滞在時間、利用環境などの統計情報が収集されます。
            これらは個人を直接特定する目的では使用しません。
          </p>
        </section>

        <section>
          <h2>Google AdSenseと広告配信</h2>
          <p>
            当サイトでは、第三者配信の広告サービスであるGoogle AdSenseを利用する場合があります。
            Googleなどの広告配信事業者は、Cookieを使用することで、利用者が過去にアクセスしたサイトや興味関心に基づいた広告を表示することがあります。
          </p>
          <p>
            広告はサイト運営のために掲載しますが、記事本文を読む妨げにならない配置を基本方針とします。
            広告だけを目的としたページ作成や、過剰な広告表示は行いません。
          </p>
        </section>

        <section>
          <h2>アフィリエイトリンク</h2>
          <p>
            当サイトには、教材、英会話サービス、公式サイト、参考情報などへの外部リンクやアフィリエイトリンクが含まれる場合があります。
            リンク先の商品、サービス、料金、キャンペーン、個人情報の取り扱いについては、各提供元の表示をご確認ください。
          </p>
        </section>

        <section>
          <h2>個人情報の管理</h2>
          <p>
            取得した情報は適切に管理し、法令に基づく場合を除き、本人の同意なく第三者へ提供しません。
            ただし、認証、データ保存、メール送信、アクセス解析、広告配信など、サービス提供に必要な範囲で外部サービスを利用する場合があります。
          </p>
        </section>

        <section>
          <h2>お問い合わせ</h2>
          <p>
            個人情報の開示、訂正、削除、利用停止、その他プライバシーに関するお問い合わせは、
            <Link href="/contact">お問い合わせページ</Link>からご連絡ください。
          </p>
          <p>
            Googleによる情報の取り扱いについては、
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Googleプライバシーポリシー
            </a>
            も合わせてご確認ください。
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
