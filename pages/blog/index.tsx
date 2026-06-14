import Link from 'next/link';
import SiteLayout from '../../components/SiteLayout';
import { blogCategories, blogPosts } from '../../lib/blogPosts';
import styles from '../pages.module.css';

export default function BlogIndex() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '英語学習コラム',
    description: 'TOEIC、スタディサプリENGLISH、Cambly、AI英語学習、YouTube英語学習を扱うEigo Baseの学習メディアです。',
    url: 'https://eigo-master.vercel.app/blog',
  };

  return (
    <SiteLayout
      title="英語学習コラム | Eigo Base"
      description="TOEIC、スタディサプリENGLISH、Cambly、AI英語学習、YouTube英語学習を扱うEigo Baseの英語学習メディアです。"
      canonicalPath="/blog"
      structuredData={structuredData}
    >
      <article className={styles.article}>
        <p className={styles.kicker}>Eigo Base 英語学習メディア</p>
        <h1>英語学習コラム</h1>
        <p>
          Eigo Baseでは、AI英語学習、TOEIC対策、英会話、YouTube字幕学習、英語教材比較を扱います。
          広告のための記事ではなく、英語学習者が次の一歩を決めやすくなる記事を目指しています。
        </p>

        <section>
          <h2>カテゴリ</h2>
          <div className={styles.cardGrid}>
            {Object.entries(blogCategories).map(([key, category]) => (
              <Link key={key} href={`/blog/${key}`} className={styles.blogCard}>
                <h2>{category.label}</h2>
                <p>{category.description}</p>
                <span>カテゴリを見る</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>最新記事</h2>
          <div className={styles.blogList}>
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.blogCard}>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <span>記事を読む</span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </SiteLayout>
  );
}
