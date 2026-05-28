import Link from 'next/link';
import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

export default function Terms() {
  return (
    <SiteLayout
      title="利用規約 | Eigo Master"
      description="Eigo Masterの利用条件、禁止事項、免責事項、AI生成内容の扱いについて説明します。"
    >
      <article className={styles.article}>
        <h1>利用規約</h1>
        <p className={styles.lastUpdate}>最終更新日：2026年5月28日</p>
        <section>
          <h2>利用条件</h2>
          <p>
            Eigo Masterは、英語学習を支援するためのサービスです。ユーザーは、本規約および関連する法令、
            外部サービスの利用規約を守ったうえで、本サービスを個人の学習目的で利用するものとします。
          </p>
        </section>
        <section>
          <h2>禁止事項</h2>
          <ul>
            <li>不正アクセス、データ改ざん、過度な負荷をかける行為</li>
            <li>他者の権利、プライバシー、著作権を侵害する行為</li>
            <li>違法または公序良俗に反する内容の投稿や利用</li>
            <li>本サービスの内容を無断で複製、販売、再配布する行為</li>
            <li>YouTube等の外部サービスの規約に違反する行為</li>
          </ul>
        </section>
        <section>
          <h2>免責事項</h2>
          <p>
            本サービスは学習支援を目的として提供されます。TOEIC等の試験結果、英語力向上、学習成果を保証するものではありません。
            サービス内容は予告なく変更、停止、終了される場合があります。
          </p>
        </section>
        <section>
          <h2>AI生成内容について</h2>
          <p>
            AIが生成する翻訳、説明、会話例、問題文は参考情報であり、正確性、完全性、最新性を保証しません。
            重要な内容は、辞書、公式教材、専門家の確認を併用してください。
          </p>
        </section>
        <section>
          <h2>個人情報の取り扱い</h2>
          <p>
            個人情報やCookieの取り扱いについては、<Link href="/privacy-policy">プライバシーポリシー</Link>をご確認ください。
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
