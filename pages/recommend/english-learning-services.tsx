import Link from 'next/link';
import AffiliateCard from '../../components/AffiliateCard';
import SiteLayout from '../../components/SiteLayout';
import styles from '../pages.module.css';

export default function EnglishLearningServices() {
  return (
    <SiteLayout
      title="English Base・スタディサプリENGLISH・Camblyの使い分け | English Base"
      description="English Base、スタディサプリENGLISH、Camblyの得意分野、向いている人、TOEIC学習と英会話実践での使い分けを比較します。"
    >
      <article className={styles.article}>
        <p className={styles.kicker}>比較ガイド</p>
        <h1>English Base・スタディサプリENGLISH・Camblyの使い分け</h1>
        <p>
          英語学習サービスは、それぞれ得意分野が違います。
          単語や文法を毎日少しずつ復習したい人、TOEICスコアを上げたい人、ネイティブ講師と会話したい人では、
          選ぶべきサービスも使い方も変わります。
          ここでは、English Base、スタディサプリENGLISH、Camblyを、学習目的に合わせてどう使い分けるかを整理します。
        </p>

        <section>
          <h2>3サービスの比較</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #cbd5e1', padding: 10 }}>サービス</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #cbd5e1', padding: 10 }}>得意分野</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #cbd5e1', padding: 10 }}>向いている人</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ borderBottom: '1px solid #e2e8f0', padding: 10 }}>English Base</td>
                  <td style={{ borderBottom: '1px solid #e2e8f0', padding: 10 }}>無料AI学習・単語・文法・復習</td>
                  <td style={{ borderBottom: '1px solid #e2e8f0', padding: 10 }}>毎日少しずつ学びたい人</td>
                </tr>
                <tr>
                  <td style={{ borderBottom: '1px solid #e2e8f0', padding: 10 }}>スタディサプリENGLISH</td>
                  <td style={{ borderBottom: '1px solid #e2e8f0', padding: 10 }}>TOEIC・講義型学習</td>
                  <td style={{ borderBottom: '1px solid #e2e8f0', padding: 10 }}>スコアアップしたい人</td>
                </tr>
                <tr>
                  <td style={{ borderBottom: '1px solid #e2e8f0', padding: 10 }}>Cambly</td>
                  <td style={{ borderBottom: '1px solid #e2e8f0', padding: 10 }}>ネイティブ英会話</td>
                  <td style={{ borderBottom: '1px solid #e2e8f0', padding: 10 }}>会話実践したい人</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>English Baseは毎日の学習を始める場所</h2>
          <p>
            English Baseは、英語学習を始める手間を減らすためのサービスです。
            TOEIC単語、Part5、動画リスニング、AI学習アドバイス、AI英会話を使い、
            短い時間でも英語に触れられる導線を作っています。
            忙しい日でも、単語を5問だけ解く、Part5を1問だけ確認する、動画の30秒だけ聞くという学習なら始めやすくなります。
          </p>
          <p>
            強みは、学習履歴や復習対象を残し、次に何をやるか迷いにくくすることです。
            一方で、TOEICの講義を体系的に受けたい場合や、実際の講師と会話したい場合は、専門サービスを併用した方が効率的な場面もあります。
          </p>
        </section>

        <section>
          <h2>スタディサプリENGLISHはTOEIC対策を進める場所</h2>
          <p>
            TOEICのスコアアップを目標にするなら、出題形式に沿った講義と演習が役立ちます。
            スタディサプリENGLISHは、Part5の文法、リスニング、長文対策などを順序立てて学びたい人に向いています。
            独学で公式問題集だけを解いていると、なぜ間違えたのかを整理できず、同じミスを繰り返すことがあります。
          </p>
          <p>
            English Baseで毎日の単語・文法確認を行い、スタディサプリENGLISHで講義と演習を進めると、
            基礎の反復と体系学習を分けて考えられます。
          </p>
          <AffiliateCard
            service="study_sapuri"
            placement="recommend_page"
            variant="compact"
            urlKey="toeic"
            reason="TOEIC対策を講義と演習で整理したい人に向いています。English Baseで基礎確認、スタディサプリで本格対策という流れを作れます。"
          />
        </section>

        <section>
          <h2>Camblyは英会話を実践する場所</h2>
          <p>
            Camblyは、ネイティブ講師との英会話練習に向いています。
            TOEICのスコアが上がっても、会議や雑談で英語がすぐ出てこないことは珍しくありません。
            その場で質問に答える、聞き返す、自分の考えを短く伝えるといった力は、実際に話す練習で伸ばしやすくなります。
          </p>
          <p>
            AI英会話で表現を試し、Camblyで講師と話し、言えなかった表現をEnglish Baseへ戻す。
            この循環を作ると、会話練習が一回きりで終わりにくくなります。
          </p>
          <AffiliateCard
            service="cambly"
            placement="recommend_page"
            variant="compact"
            urlKey="trial"
            reason="AI英会話の次に、人との会話でアウトプットしたい人に向いています。"
          />
        </section>

        <section>
          <h2>目的別の選び方</h2>
          <h3>TOEIC600点を目指す人</h3>
          <p>
            まずEnglish Baseで単語とPart5を短く回し、頻出語と基本文法の抜けを減らします。
            そのうえで、スタディサプリENGLISHの講義や演習を使い、出題形式ごとの解き方を整理すると進めやすくなります。
          </p>
          <h3>TOEIC800点を目指す人</h3>
          <p>
            弱点分析と復習の質が重要になります。English Baseでミスした単語や文法を残し、
            スタディサプリENGLISHや公式問題集で本番形式の演習を行うと、短い復習と実戦練習を両立できます。
          </p>
          <h3>英会話を伸ばしたい人</h3>
          <p>
            English BaseのAI英会話で表現を準備し、Camblyで実際に話す流れがおすすめです。
            レッスン後は、言えなかった表現や講師から教わった言い換えを復習に戻しましょう。
          </p>
        </section>

        <section>
          <h2>注意点</h2>
          <p>
            どのサービスも、登録しただけで英語力やTOEICスコアが上がるわけではありません。
            毎日の学習、復習、実践、振り返りを続けることが必要です。
            また、料金、プラン、キャンペーン、提供内容は変わる場合があります。申し込み前には公式サイトの最新情報を確認してください。
          </p>
        </section>

        <section>
          <h2>関連リンク</h2>
          <ul>
            <li><Link href="/recommend/study-sapuri-english">スタディサプリENGLISHの特徴と使い方</Link></li>
            <li><Link href="/recommend/cambly">Camblyの特徴と英会話実践での使い方</Link></li>
            <li><Link href="/blog/studysapuri/study-sapuri-toeic-600">スタディサプリでTOEIC600点を目指す勉強法</Link></li>
            <li><Link href="/blog/ai-english/ai-conversation-merits">AI英会話のメリットと注意点</Link></li>
          </ul>
        </section>
      </article>
    </SiteLayout>
  );
}
