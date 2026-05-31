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
    <SiteLayout title={`${post.title} | English Base`} description={post.description}>
      <article className={styles.article}>
        <p className={styles.kicker}>学習コラム</p>
        <h1>{post.title}</h1>
        <p>{post.lead}</p>
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        ))}
        <div className={styles.notice}>
          <p>
            AIによる説明、翻訳、問題生成、学習アドバイスは学習補助の参考情報です。
            正確性が必要な内容は、辞書、公式教材、専門家の情報もあわせて確認してください。
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
