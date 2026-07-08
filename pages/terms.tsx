import Link from 'next/link';
import SiteLayout from '../components/SiteLayout';
import styles from './pages.module.css';

export default function Terms() {
  return (
    <SiteLayout
      title="利用規約 | eigo base"
      description="eigo baseの利用条件、免責事項、著作権、禁止事項、サービス変更、外部リンクについて説明します。"
      canonicalPath="/terms"
    >
      <article className={styles.article}>
        <h1>利用規約</h1>
        <p className={styles.lastUpdate}>最終更新日：2026年7月8日</p>

        <section>
          <h2>利用条件</h2>
          <p>
            eigo baseは、英語学習を支援するためのメディアおよび学習支援サービスです。
            利用者は、本規約、関連法令、公序良俗を守り、個人の学習目的の範囲で本サービスを利用するものとします。
          </p>
        </section>

        <section>
          <h2>免責事項</h2>
          <p>
            当サイトの記事、AIによる説明、翻訳、例文、学習アドバイス、教材紹介は、英語学習を補助するための参考情報です。
            正確性、完全性、最新性、特定の学習成果を保証するものではありません。
            TOEICなどの試験情報、料金、キャンペーン、サービス仕様は変更される場合があるため、必要に応じて公式情報をご確認ください。
          </p>
          <p>
            当サイトの利用により発生した損害、学習成果の未達、外部サービス利用時のトラブルについて、
            当サイトは法令上認められる範囲で責任を負いません。
          </p>
        </section>

        <section>
          <h2>著作権</h2>
          <p>
            当サイトに掲載されている文章、構成、画像、ロゴ、学習コンテンツ、プログラム等の著作権は、
            当サイトまたは正当な権利者に帰属します。私的利用の範囲を超えて、無断で複製、転載、販売、配布、改変することを禁止します。
          </p>
        </section>

        <section>
          <h2>禁止事項</h2>
          <ul>
            <li>不正アクセス、データ改ざん、過度な負荷をかける行為</li>
            <li>第三者の権利、プライバシー、著作権、商標権を侵害する行為</li>
            <li>違法または公序良俗に反する内容の投稿や利用</li>
            <li>当サイトの内容を無断で複製、販売、配布する行為</li>
            <li>広告、アフィリエイト、アクセス解析の仕組みを不正に操作する行為</li>
            <li>YouTube、Google、その他外部サービスの規約に違反する行為</li>
          </ul>
        </section>

        <section>
          <h2>サービス変更・停止</h2>
          <p>
            当サイトは、機能改善、保守、法令対応、外部サービス仕様変更、運営上の理由により、
            事前の通知なくサービス内容の変更、停止、終了を行う場合があります。
          </p>
        </section>

        <section>
          <h2>外部リンクと広告リンク</h2>
          <p>
            当サイトには、スタディサプリENGLISH、Cambly、教材、公式サイト、広告配信サービス、
            アフィリエイトリンクなど、外部サイトへのリンクが含まれる場合があります。
            外部リンク先の情報やサービスの利用については、各提供元の規約と表示をご確認ください。
          </p>
        </section>

        <section>
          <h2>個人情報の取り扱い</h2>
          <p>
            個人情報、Cookie、Google Analytics、Google AdSense等の取り扱いについては、
            <Link href="/privacy">プライバシーポリシー</Link>をご確認ください。
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
