import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import AffiliateCard from '../../components/AffiliateCard';
import SiteLayout from '../../components/SiteLayout';
import { BlogPost, blogPosts, getBlogCategories, getBlogPost } from '../../lib/blogPosts';
import styles from '../pages.module.css';

type Props = {
  post: BlogPost;
};

export default function BlogArticle({ post }: Props) {
  const categories = getBlogCategories(post);
  const isConversation = categories.some((category) =>
    ['speaking', 'ai_conversation', 'overseas', 'conversation'].includes(category),
  );
  const isComparison = categories.includes('comparison');
  const primaryService = isConversation ? 'cambly' : 'study_sapuri';

  return (
    <SiteLayout title={`${post.title} | English Base`} description={post.description}>
      <article className={styles.article}>
        <p className={styles.kicker}>学習コラム</p>
        <h1>{post.title}</h1>
        <p>{post.lead}</p>
        {post.sections.map((section, sectionIndex) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            {section.points?.map((point) => (
              <div key={point.heading}>
                <h3>{point.heading}</h3>
                {point.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ))}
            {sectionIndex === 0 && (
              isComparison ? (
                <>
                  <AffiliateCard service="study_sapuri" placement="blog_body" variant="compact" />
                  <AffiliateCard service="cambly" placement="blog_body" variant="compact" urlKey="trial" />
                </>
              ) : (
                <AffiliateCard
                  service={primaryService}
                  placement="blog_body"
                  variant="compact"
                  urlKey={primaryService === 'cambly' ? 'trial' : 'toeic'}
                />
              )
            )}
          </section>
        ))}
        <div className={styles.notice}>
          <p>
            AIによる説明、翻訳、問題生成、学習アドバイスは学習補助の参考情報です。
            正確性が必要な内容は、辞書、公式教材、専門家の情報もあわせて確認してください。
          </p>
        </div>
        <section>
          <h2>あわせて読みたい</h2>
          <ul>
            <li><Link href="/">English Baseのトップページで学習機能を見る</Link></li>
            <li><Link href="/blog/toeic-600-study-plan">TOEIC600点を目指す初心者向け勉強法</Link></li>
            <li><Link href="/blog/ai-english-app">AI英会話アプリを使うメリットと注意点</Link></li>
            <li><Link href="/recommend/study-sapuri-english">スタディサプリENGLISHの特徴とEnglish Baseとの使い分け</Link></li>
            <li><Link href="/recommend/cambly">Camblyの特徴と英会話実践での使い方</Link></li>
            <li><Link href="/recommend/english-learning-services">English Base・スタディサプリENGLISH・Camblyの使い分け</Link></li>
          </ul>
        </section>
        {isComparison ? (
          <>
            <AffiliateCard service="study_sapuri" placement="blog_footer" variant="standard" />
            <AffiliateCard service="cambly" placement="blog_footer" variant="standard" urlKey="detail" />
          </>
        ) : (
          <AffiliateCard
            service={primaryService}
            placement="blog_footer"
            variant="standard"
            urlKey={primaryService === 'cambly' ? 'detail' : 'toeic'}
          />
        )}
        <p><Link href="/blog">学習コラム一覧へ戻る</Link></p>
      </article>
    </SiteLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: blogPosts.map((post) => ({ params: { slug: post.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const post = getBlogPost(String(params?.slug || ''));
  if (!post) return { notFound: true };
  return { props: { post } };
};
