import Link from 'next/link';
import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

export default function PrivacyPolicy() {
  return (
    <SiteLayout
      title="プライバシーポリシー | English Base"
      description="English Baseにおける取得情報、Cookie、Googleログイン、Google AdSense、Google Analytics、問い合わせ情報の扱いを説明します。"
    >
      <article className={styles.article}>
        <h1>プライバシーポリシー</h1>
        <p className={styles.lastUpdate}>最終更新日：2026年5月31日</p>

        <section>
          <h2>取得する可能性のある情報</h2>
          <p>
            English Baseでは、サービス提供と改善のため、ニックネーム、ログインに関する識別情報、
            学習履歴、問題への回答履歴、投稿内容、お問い合わせ内容、アクセスログなどを取得する場合があります。
          </p>
        </section>

        <section>
          <h2>Googleログインと学習履歴</h2>
          <p>
            Googleログインを利用した場合、学習履歴や設定を保存し、複数回の利用でも復習しやすい状態を保つために使用します。
            未ログインの場合でも、ブラウザ内に一部の学習データが保存されることがあります。
          </p>
          <p>
            本サービスでは、認証、データ保存、学習履歴、投稿、ランキングなどの機能を提供するため、
            Supabaseを利用する場合があります。保存される情報は、サービス提供、復習機能の維持、
            不正利用防止、問い合わせ対応のために利用します。
          </p>
        </section>

        <section>
          <h2>Cookie、広告、アクセス解析、アフィリエイト</h2>
          <p>
            本サイトでは、利便性向上、利用状況の把握、広告配信のためにCookieを使用する場合があります。
            Google AdSense、Google AdMobおよびGoogle Analyticsを利用する可能性があり、これらのサービスではCookieなどを用いて
            アクセス情報や広告配信に必要な情報を処理する場合があります。
          </p>
          <p>
            また、本サイトではA8.net等のアフィリエイトプログラムを利用する場合があります。
            掲載リンクから外部サービスへ移動した場合、移動先サイトの規約やプライバシーポリシーが適用されます。
            アフィリエイトリンクは、英語学習に関連する教材やサービスを紹介する目的で掲載します。
          </p>
          <p>
            Googleによる情報の取り扱いについては、
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Googleプライバシーポリシー</a>
            をご確認ください。
          </p>
        </section>

        <section>
          <h2>情報の利用目的</h2>
          <ul>
            <li>英語学習機能、学習履歴、ランキング、投稿機能の提供</li>
            <li>サービス改善、不具合調査、利用状況の分析</li>
            <li>お問い合わせへの返信</li>
            <li>不正利用の防止、利用規約違反への対応</li>
            <li>広告配信およびアクセス解析</li>
          </ul>
        </section>

        <section>
          <h2>お問い合わせ</h2>
          <p>
            個人情報の取り扱いに関するお問い合わせは、<Link href="/contact">お問い合わせページ</Link>からご連絡ください。
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
