import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'rimick.tokyo@gmail.com';

function clean(value: unknown, maxLength: number) {
  return String(value || '').replace(/\r/g, '').trim().slice(0, maxLength);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const name = clean(req.body?.name, 80);
  const email = clean(req.body?.email, 160);
  const category = clean(req.body?.category || 'general', 40);
  const message = clean(req.body?.message, 4000);

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: '必須項目を入力してください。' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ ok: false, error: 'メールアドレスの形式を確認してください。' });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.CONTACT_FROM_EMAIL || user;

  if (!host || !user || !pass || !from) {
    console.error('[contact] SMTP env is missing');
    return res.status(503).json({ ok: false, error: '現在お問い合わせを送信できません。時間をおいて再度お試しください。' });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const subject = `eigo base お問い合わせ: ${category}`;
  const text = [
    'eigo baseのお問い合わせフォームから送信されました。',
    '',
    `お名前: ${name}`,
    `返信先: ${email}`,
    `種別: ${category}`,
    '',
    'お問い合わせ内容:',
    message,
  ].join('\n');
  const html = `
    <p>eigo baseのお問い合わせフォームから送信されました。</p>
    <dl>
      <dt>お名前</dt><dd>${escapeHtml(name)}</dd>
      <dt>返信先</dt><dd>${escapeHtml(email)}</dd>
      <dt>種別</dt><dd>${escapeHtml(category)}</dd>
    </dl>
    <h2>お問い合わせ内容</h2>
    <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
  `;

  try {
    await transporter.sendMail({
      from,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject,
      text,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[contact] send failed', err);
    return res.status(500).json({ ok: false, error: '送信できませんでした。時間をおいて再度お試しください。' });
  }
}

