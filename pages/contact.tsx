import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

export default function Contact() {
  return (
    <SiteLayout
      title="お問い合わせ | English Base"
      description="English Baseへのお問い合わせ方法を掲載しています。"
    >
      <article className={styles.article}>
        <h1>お問い合わせ</h1>
        <p>
          English Baseへのご質問、不具合報告、掲載内容に関するご連絡は、運営者までお問い合わせください。
          内容を確認し、必要に応じて返信またはサービス改善の参考にします。
        </p>

        <div className={styles.contactBox}>
          <h2>お問い合わせ先</h2>
          <p>
            メールでのお問い合わせ：
            <a href="mailto:kamadanoboru@gmail.com">kamadanoboru@gmail.com</a>
          </p>
          <p>以下の内容を添えていただくと確認がスムーズです。</p>
          <ul>
            <li>お名前またはニックネーム</li>
            <li>返信先メールアドレス</li>
            <li>お問い合わせ内容</li>
            <li>不具合の場合は、利用端末、ブラウザ、発生した画面</li>
          </ul>
        </div>

        <section>
          <h2>返信について</h2>
          <p>
            すべてのお問い合わせに個別回答できない場合がありますが、いただいた内容はサービス改善の参考にします。
            迷惑メール設定をしている場合は、返信を受け取れるように設定をご確認ください。
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
