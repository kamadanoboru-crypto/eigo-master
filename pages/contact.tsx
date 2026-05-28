import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

export default function Contact() {
  return (
    <SiteLayout
      title="お問い合わせ | Eigo Master"
      description="Eigo Masterへのお問い合わせ方法を掲載しています。"
    >
      <article className={styles.article}>
        <h1>お問い合わせ</h1>
        <p>
          Eigo Masterへのご質問、不具合報告、掲載内容に関するお問い合わせは、運営者までご連絡ください。
          現在メールアドレスが未設定の場合は「お問い合わせは運営者まで」としてご案内しています。
        </p>
        <div className={styles.contactBox}>
          <h2>お問い合わせフォーム</h2>
          <p>以下の項目を添えてご連絡いただくと確認がスムーズです。</p>
          <ul>
            <li>お名前またはニックネーム</li>
            <li>返信先メールアドレス</li>
            <li>お問い合わせ内容</li>
            <li>不具合の場合は、利用端末、ブラウザ、再現手順</li>
          </ul>
          <p>
            メールでのお問い合わせ先：
            <a href="mailto:kamadanoboru@gmail.com">kamadanoboru@gmail.com</a>
          </p>
        </div>
        <section>
          <h2>返信について</h2>
          <p>
            内容を確認のうえ、必要に応じて返信します。すべてのお問い合わせに個別回答できない場合がありますが、
            サービス改善の参考にいたします。
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
