import Link from 'next/link';
import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

export default function PrivacyPolicy() {
  return (
    <SiteLayout
      title="プライバシーポリシー | eigo base"
      description="eigo baseにおける個人情報、Cookie、Google Analytics、Google AdSense、広告配信、アクセス解析、お問い合わせ情報の取り扱いを説明します。"
      canonicalPath="/privacy"
    >
      <article className={styles.article}>
        <h1>プライバシーポリシー</h1>
        <p className={styles.lastUpdate}>最終更新日：2026年6月19日</p>

        <section>
          <h2>基本方針</h2>
          <p>
            eigo baseは、英語学習支援メディアおよび学習支援サービスとして、利用者のプライバシーを尊重します。
            本ページでは、当サイトで取得する可能性のある情報、Cookieの利用、アクセス解析、広告配信、個人情報の管理方針について説明します。
          </p>
        </section>

        <section>
          <h2>取得する可能性のある情報</h2>
          <p>
            当サイトでは、サービス提供と改善のため、ニックネーム、ログインに関する識別情報、学習履歴、
            問題への回答履歴、投稿内容、お問い合わせ内容、アクセスログ、ブラウザや端末に関する情報を取得する場合があります。
            取得した情報は、学習機能の提供、復習体験の改善、不具合調査、不正利用防止、お問い合わせ対応のために利用します。
          </p>
        </section>

        <section>
          <h2>Google Analyticsについて</h2>
          <p>
            当サイトでは、利用状況を把握し、記事や学習機能を改善するためにGoogle Analyticsを利用する場合があります。
            Google AnalyticsはCookieを使用して、ページ閲覧数、滞在時間、利用環境などの情報を収集します。
            これらの情報は匿名化された統計情報として扱われ、個人を直接特定する目的では使用しません。
          </p>
        </section>

        <section>
          <h2>Google AdSenseと広告配信について</h2>
          <p>
            当サイトでは、第三者配信の広告サービスであるGoogle AdSenseを利用する場合があります。
            Googleなどの広告配信事業者は、Cookieを使用することで、利用者が過去にアクセスしたサイトや興味関心に基づく広告を表示することがあります。
            パーソナライズ広告を無効にしたい場合は、Googleの広告設定から変更できます。
          </p>
          <p>
            広告はサイト運営のために掲載しますが、記事本文を読む妨げにならない配置を基本方針とします。
            記事冒頭を広告だけにする、過剰なポップアップを出す、学習操作を妨げる表示を行うことは避けます。
          </p>
        </section>

        <section>
          <h2>Cookieの利用について</h2>
          <p>
            当サイトでは、利便性向上、ログイン状態の保持、アクセス解析、広告配信、アフィリエイト成果計測のためにCookieを使用する場合があります。
            Cookieはブラウザ設定により無効化できます。ただし、Cookieを無効にすると、一部の学習機能や表示が正しく動作しない場合があります。
          </p>
        </section>

        <section>
          <h2>アフィリエイトリンクについて</h2>
          <p>
            当サイトでは、A8.net等のアフィリエイトプログラムを利用する場合があります。
            掲載リンクから外部サービスへ移動した場合、移動先サイトの規約やプライバシーポリシーが適用されます。
            アフィリエイトリンクは、英語学習に関連する教材やサービスを紹介する目的で掲載します。
          </p>
        </section>

        <section>
          <h2>個人情報の管理</h2>
          <p>
            取得した情報は、適切な管理に努め、法令に基づく場合を除き、本人の同意なく第三者へ提供しません。
            ただし、サービス提供に必要な範囲で、認証、データ保存、広告配信、アクセス解析、メール送信などの外部サービスを利用する場合があります。
          </p>
        </section>

        <section>
          <h2>外部リンクについて</h2>
          <p>
            当サイトには、教材、英会話サービス、公式サイト、参考情報などへの外部リンクが含まれる場合があります。
            外部サイトでの個人情報の取り扱いについては、各外部サイトのプライバシーポリシーをご確認ください。
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
            もあわせてご確認ください。
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
