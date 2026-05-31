import Link from 'next/link';
import SiteLayout from '../../components/SiteLayout';
import { blogPosts } from '../../lib/blogPosts';
import styles from '../pages.module.css';

export default function BlogIndex() {
  return (
    <SiteLayout
      title="学習コラム | English Base"
      description="TOEIC、英単語、英文法、リスニング、動画学習、AI活用に関する英語学習コラムの一覧です。"
    >
      <article className={styles.article}>
        <h1>学習コラム</h1>
        <p>
          English Baseでは、アプリで練習するだけでなく、英語学習の進め方を理解できる読み物も掲載しています。
          TOEIC、単語、Part5、リスニング、動画学習、AI活用など、毎日の学習に戻しやすいテーマをまとめています。
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
