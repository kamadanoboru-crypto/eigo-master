import Link from 'next/link';
import SiteLayout from '../../components/SiteLayout';
import { blogPosts } from '../../lib/blogPosts';
import styles from '../pages.module.css';

export default function BlogIndex() {
  return (
    <SiteLayout
      title="学習コラム | Eigo Master"
      description="TOEIC、単語、Part 5、リスニング、動画字幕学習、AI学習アドバイスに関する英語学習コラム一覧です。"
    >
      <article className={styles.article}>
        <h1>学習コラム</h1>
        <p>
          Eigo Masterでは、アプリで練習するだけでなく、英語学習の進め方を理解できる読み物も掲載しています。
          現在のアプリ機能に合わせ、単語、Part 5、リスニング、動画字幕学習、ニュース読解、AI学習アドバイスを扱います。
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
