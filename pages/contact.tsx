import { FormEvent, useState } from 'react';
import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

type ContactState = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<ContactState>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      category: String(formData.get('category') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || '送信できませんでした。');
      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信できませんでした。時間をおいて再度お試しください。');
      setStatus('error');
    }
  }

  return (
    <SiteLayout
      title="お問い合わせ | eigo base"
      description="eigo baseへのお問い合わせフォームです。不具合報告、掲載内容の確認、サービスへのご意見を送信できます。"
    >
      <article className={styles.article}>
        <h1>お問い合わせ</h1>
        <p>
          eigo baseへのご質問、不具合報告、掲載内容に関するご連絡は、以下のフォームから送信してください。
          内容を確認し、必要に応じて返信またはサービス改善の参考にします。
        </p>

        {status === 'sent' ? (
          <div className={styles.successMessage}>お問い合わせを送信しました。ありがとうございます。</div>
        ) : null}
        {status === 'error' ? (
          <div className={styles.notice}><p>{error}</p></div>
        ) : null}

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">お名前またはニックネーム <span className={styles.required}>*</span></label>
            <input id="name" name="name" type="text" autoComplete="name" required maxLength={80} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">返信先メールアドレス <span className={styles.required}>*</span></label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={160} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">お問い合わせ種別</label>
            <select id="category" name="category" defaultValue="general">
              <option value="general">一般的なお問い合わせ</option>
              <option value="bug">不具合報告</option>
              <option value="content">掲載内容について</option>
              <option value="privacy">データ・プライバシーについて</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">お問い合わせ内容 <span className={styles.required}>*</span></label>
            <textarea id="message" name="message" rows={8} required maxLength={4000} />
          </div>

          <button className={styles.submitButton} type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? '送信中...' : '送信する'}
          </button>
        </form>

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

