import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import SiteLayout from '../../components/SiteLayout';
import { BlogPost, blogPosts, getBlogPost } from '../../lib/blogPosts';
import styles from '../pages.module.css';

type Props = {
  post: BlogPost;
};

export default function BlogArticle({ post }: Props) {
  return (
    <SiteLayout title={`${post.title} | Eigo Master`} description={post.description}>
      <article className={styles.article}>
        <p className={styles.kicker}>英語学習コラム</p>
        <h1>{post.title}</h1>
        <p>{post.lead}</p>
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <h3>実践のポイント</h3>
            <p>
              読んで終わりにせず、今日の学習でひとつだけ試してみましょう。Eigo Masterの単語、文法、動画、AI会話のいずれかを使い、
              短い時間でも実際に英語へ触れることが継続につながります。
            </p>
          </section>
        ))}
        <div className={styles.notice}>
          <p>
            AIによる説明や翻訳は学習補助の参考情報です。正確性が必要な内容は、辞書、公式教材、専門家の確認も併用してください。
          </p>
        </div>
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
