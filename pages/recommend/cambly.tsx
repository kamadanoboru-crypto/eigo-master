import Link from 'next/link';
import AffiliateCard from '../../components/AffiliateCard';
import SiteLayout from '../../components/SiteLayout';
import { AFFILIATE_LINKS } from '../../lib/affiliateLinks';
import styles from '../pages.module.css';

const sponsoredRel = 'nofollow sponsored noopener noreferrer';

export default function CamblyRecommend() {
  return (
    <SiteLayout
      title="Camblyの特徴と英会話実践での使い方 | English Base"
      description="Camblyの特徴、ネイティブ講師との英会話、English BaseやスタディサプリENGLISHとの使い分け、向いている人を解説します。"
    >
      <article className={styles.article}>
        <p className={styles.kicker}>おすすめ学習サービス</p>
        <h1>Camblyの特徴と英会話実践での使い方</h1>
        <p>
          英単語や文法を学んでいても、実際に英語を話す場面になると言葉が出てこないことがあります。
          English Baseでは、AI英会話や単語、Part5、動画リスニングを通して、英語に触れる回数を増やすことを重視しています。
          その次のステップとして、実際の講師と話す練習を取り入れたい人に候補になるのがCamblyです。
          Camblyは、ネイティブ講師とのオンライン英会話を提供するサービスで、会話量を増やしたい学習者に向いています。
        </p>

        <AffiliateCard
          service="cambly"
          placement="recommend_page"
          variant="wide"
          urlKey="trial"
          reason="AIで練習した英語を、次はネイティブ講師との会話で試したい方に向いています。"
        />

        <section>
          <h2>Camblyとは</h2>
          <p>
            Camblyは、オンラインで英語講師と会話練習ができる英会話サービスです。
            特徴は、英語を母語とする講師との実践的な会話に触れやすいことです。
            教材を読むだけでは身につきにくい、返答の速さ、聞き返し方、自然な相づち、言い換え表現などを、
            実際の会話の中で練習できます。
          </p>
          <p>
            英会話の上達には、単語や文法の知識だけでなく、使ってみる時間が必要です。
            Camblyは、英語を話す機会を生活の中に作りたい人、海外赴任や留学前に会話量を増やしたい人、
            TOEICで一定のスコアを取った後にアウトプットへ進みたい人にとって検討しやすいサービスです。
          </p>
        </section>

        <section>
          <h2>ネイティブ講師と話せる特徴</h2>
          <p>
            Camblyでは、ネイティブ講師との会話を通して、教材だけでは分かりにくい自然な表現に触れられます。
            たとえば、教科書的には正しい英文でも、会話では少し硬く聞こえることがあります。
            講師とのやり取りでは、より自然な言い方や、場面に合った表現を確認しやすくなります。
          </p>
          <h3>24時間利用しやすい</h3>
          <p>
            忙しい社会人にとって、決まった時間に毎回レッスンを受けるのは簡単ではありません。
            Camblyは時間帯を選びやすく、早朝や夜など、自分の生活リズムに合わせた英会話練習を組み込みやすい点が魅力です。
          </p>
          <h3>予約なしで使える場面がある</h3>
          <p>
            予定が読みにくい人にとって、空いた時間に会話を始められる柔軟さは大きなメリットです。
            もちろん講師やプラン、利用状況によって体験は変わるため、最新の提供内容は公式サイトで確認してください。
          </p>
          <h3>レッスン録画やチャットを復習に使える</h3>
          <p>
            英会話は、話して終わりにすると同じ表現を忘れやすくなります。
            レッスン中に出てきた表現、講師がチャットで直してくれた文、うまく言えなかった内容を見返すことで、
            次の会話で使える表現に変えられます。
          </p>
        </section>

        <section>
          <h2>English Baseとの使い分け</h2>
          <p>
            English Baseは、単語、文法、リスニング、AI学習補助を使って、毎日少しずつ英語に触れるためのサービスです。
            AI英会話では、間違いを恐れずに短い英文を試し、表現を確認できます。
            ただし、AIとの練習だけでは、相手の反応を見ながら話す緊張感や、予想外の返答に対応する経験は不足しやすくなります。
          </p>
          <p>
            Camblyは、その不足を補う実践の場として使えます。
            English Baseで単語や表現を準備し、AI英会話で一度試し、Camblyで講師と話す。
            レッスン後に、言えなかった表現をEnglish Baseの復習へ戻す。
            この流れにすると、インプットとアウトプットがつながります。
          </p>
        </section>

        <section>
          <h2>スタディサプリENGLISHとの違い</h2>
          <p>
            スタディサプリENGLISHは、TOEIC対策や講義型学習に向いています。
            文法やリスニングの解き方を体系的に学び、スコアアップを目指したい場合に使いやすい教材です。
          </p>
          <p>
            Camblyは、講義を受けるよりも、実際に話す時間を増やしたい人に向いています。
            TOEICのスコアを伸ばした後、会議で発言したい、海外の相手と話したい、自然な会話表現を増やしたい場合は、
            Camblyのような実践型サービスが役立ちます。
          </p>
        </section>

        <section>
          <h2>向いている人・向かない人</h2>
          <h3>向いている人</h3>
          <ul>
            <li>AI英会話の次に、人との会話へ進みたい人</li>
            <li>ネイティブ講師と話す経験を増やしたい人</li>
            <li>海外赴任、留学、旅行、仕事で英語を使う予定がある人</li>
            <li>TOEIC高得点後に、スピーキングの実践量を増やしたい人</li>
          </ul>
          <h3>向かない人</h3>
          <p>
            英単語や中学英文法がほとんど分からない段階では、いきなり英会話だけを増やしても負担が大きい場合があります。
            まずEnglish Baseで基礎表現を確認し、スタディサプリENGLISHや教材で文法・リスニングを整理してから使うと、
            レッスン時間をより有効に使いやすくなります。
          </p>
        </section>

        <section>
          <h2>TOEIC学習後の会話練習に向く理由</h2>
          <p>
            TOEIC学習で得た語彙やリスニング力は、英会話にも役立ちます。
            しかし、試験で英文を理解できることと、自分の考えをその場で英語にすることは別の力です。
            Camblyでは、TOEICで覚えた表現を実際の会話で使い、講師の反応を受けながら修正できます。
          </p>
          <p>
            TOEIC600点から800点を目指す間はスタディサプリENGLISHで体系的に学び、
            その後の会話実践や海外赴任準備ではCamblyを使う、という流れも考えられます。
            どちらか一方だけでなく、目的に合わせて使い分けることが大切です。
          </p>
          <div className={styles.heroActions}>
            <a href={AFFILIATE_LINKS.CAMBLY_TRIAL} target="_blank" rel={sponsoredRel} className={styles.primaryButton}>
              ネイティブ講師と英会話を試す
            </a>
            <a href={AFFILIATE_LINKS.CAMBLY_DETAIL} target="_blank" rel={sponsoredRel} className={styles.secondaryButton}>
              Cambly公式サイトで詳細を見る
            </a>
          </div>
        </section>

        <section>
          <h2>関連リンク</h2>
          <ul>
            <li><Link href="/blog/ai-english/ai-conversation-merits">AI英会話のメリットと注意点</Link></li>
            <li><Link href="/blog/english-conversation/shadowing-beginner">シャドーイング初心者のやさしい始め方</Link></li>
            <li><Link href="/recommend/study-sapuri-english">スタディサプリENGLISHの特徴を見る</Link></li>
            <li><Link href="/recommend/english-learning-services">3サービスの使い分けを見る</Link></li>
            <li><a href={AFFILIATE_LINKS.CAMBLY_HOME} target="_blank" rel={sponsoredRel}>Cambly公式サイト</a></li>
          </ul>
        </section>
      </article>
    </SiteLayout>
  );
}
