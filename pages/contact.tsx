import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from './pages.module.css';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 実装例：メール送信APIを呼び出す場合
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, message }),
      // });

      // 現在は単に送信完了と表示（後からAPI実装）
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>お問い合わせ | 英語マスター</title>
        <meta name="description" content="英語マスターへのお問い合わせフォームです。ご質問やご不明な点はこちらから。" />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/">
            <a className={styles.logo}>🎓 英語マスター</a>
          </Link>
        </header>

        <main className={styles.main}>
          <article className={styles.article}>
            <h1>お問い合わせ</h1>
            <p>
              ご質問、ご要望、不具合報告など、お気軽にお問い合わせください。
            </p>

            {submitted && (
              <div className={styles.successMessage}>
                ✅ お問い合わせいただきありがとうございます。内容を確認いたします。
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">お名前 <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="田中太郎"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">メールアドレス <span className={styles.required}>*</span></label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your-email@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">メッセージ <span className={styles.required}>*</span></label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="ご質問や不具合など、詳細をお聞かせください"
                  rows={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? '送信中...' : 'お問い合わせを送信'}
              </button>
            </form>

            <section className={styles.faqSection}>
              <h2>よくあるご質問</h2>

              <div className={styles.faqItem}>
                <h3>❓ ログインなしで使用できますか？</h3>
                <p>
                  はい。Googleログインなしでも本アプリはご利用いただけます。ただし、学習履歴はブラウザのlocalStorageに保存されるため、ブラウザのキャッシュをクリアするとデータが失われます。
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>❓ 提供される字幕・翻訳は正確ですか？</h3>
                <p>
                  AIによって自動生成されているため、完全に正確とは限りません。学習補助ツールとしてご利用ください。重要な文書の翻訳には、専門の翻訳者や公式ツールのご利用をお勧めします。
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>❓ YouTube動画の著作権について</h3>
                <p>
                  YouTube動画および音声の著作権は各権利者に帰属します。本アプリでの使用は学習目的のみとしており、動画の違法複製・配信は厳禁です。
                </p>
              </div>

              <div className={styles.faqItem}>
                <h3>❓ 不具合が発生しました</h3>
                <p>
                  お手数ですが、以下の情報を添えてこちらのフォームからお報告ください：
                </p>
                <ul>
                  <li>発生した不具合の説明</li>
                  <li>使用しているブラウザと OS</li>
                  <li>再現方法（できればステップバイステップで）</li>
                </ul>
              </div>

              <div className={styles.faqItem}>
                <h3>❓ 機能リクエストがあります</h3>
                <p>
                  ご意見・ご要望は非常に大切です。本フォームから気軽にお知らせください。今後の改善に活かさせていただきます。
                </p>
              </div>
            </section>
          </article>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerLinks}>
            <Link href="/">ホーム</Link>
            <Link href="/about">について</Link>
            <Link href="/privacy-policy">プライバシーポリシー</Link>
            <Link href="/terms">利用規約</Link>
          </div>
          <p>&copy; 2025 英語マスター. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
