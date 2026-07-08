import Link from 'next/link';
import SiteLayout from '../components/SiteLayout';
import { BlogCategoryKey, blogCategories, blogPosts, getBlogCategoryPath, getBlogPath } from '../lib/blogPosts';
import { columnArticles, getColumnPath } from '../lib/columns';
import styles from './pages.module.css';

export default function SitemapPage() {
  return (
    <SiteLayout
      title="サイトマップ | eigo base"
      description="eigo baseの主要ページ、学習コラム、ブログ記事、おすすめ教材ページをまとめたサイトマップです。"
      canonicalPath="/sitemap"
    >
      <article className={styles.article}>
        <h1>サイトマップ</h1>
        <p>
          eigo baseの主要ページ、学習コラム、英語学習カテゴリ、記事一覧をまとめています。
          TOEIC、英単語、リスニング、AI英語学習、英会話学習の記事を探すときにご利用ください。
        </p>

        <section>
          <h2>主要ページ</h2>
          <ul>
            <li><Link href="/">ホーム</Link></li>
            <li><Link href="/columns">学習コラム</Link></li>
            <li><Link href="/blog">ブログ記事</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/about">このサイトについて</Link></li>
            <li><Link href="/privacy">プライバシーポリシー</Link></li>
            <li><Link href="/terms">利用規約</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
          </ul>
        </section>

        <section>
          <h2>おすすめ教材ページ</h2>
          <ul>
            <li><Link href="/recommend/english-learning-services">eigo base・スタディサプリENGLISH・Camblyの使い分け</Link></li>
            <li><Link href="/recommend/study-sapuri-english">スタディサプリENGLISHの特徴と使い方</Link></li>
            <li><Link href="/recommend/cambly">Camblyの特徴と英会話実践での使い方</Link></li>
          </ul>
        </section>

        <section>
          <h2>学習コラム</h2>
          <ul>
            {columnArticles.map((article) => (
              <li key={article.slug}>
                <Link href={getColumnPath(article)}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>ブログカテゴリ</h2>
          <ul>
            {Object.entries(blogCategories).map(([key, category]) => (
              <li key={key}>
                <Link href={getBlogCategoryPath(key as BlogCategoryKey)}>{category.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>ブログ記事</h2>
          <ul>
            {blogPosts.map((post) => (
              <li key={post.slug}>
                <Link href={getBlogPath(post)}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </SiteLayout>
  );
}
