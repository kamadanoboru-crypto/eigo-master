import Link from 'next/link';
import SiteLayout from '../../components/SiteLayout';
import { blogPosts } from '../../lib/blogPosts';
import styles from '../pages.module.css';

export default function BlogIndex() {
  return (
    <SiteLayout
      title="学習コラム | Eigo Master"
      description="TOEIC、英単語、リスニング、シャドーイング、AI英会話に関する英語学習コラム一覧です。"
    >
      <article className={styles.article}>
        <h1>学習コラム</h1>
        <p>
          Eigo Masterでは、アプリで練習するだけでなく、英語学習の進め方を理解できる読み物も掲載しています。
          TOEIC初心者、単語暗記、YouTubeリスニング、シャドーイング、AI英会話など、学習者がつまずきやすいテーマを具体的に解説します。
        </p>
        <div className={styles.blogList}>
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.blogCard}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <span>記事を読む</span>
            </Link>
          ))}
        </div>
      </article>
    </SiteLayout>
  );
}
