import Link from 'next/link';
import SiteLayout from '../components/SiteLayout';
import { BlogCategoryKey, blogCategories, blogPosts, getBlogCategoryPath, getBlogPath } from '../lib/blogPosts';
import styles from './pages.module.css';

export default function SitemapPage() {
  return (
    <SiteLayout
      title="サイトマップ | eigo base"
      description="eigo baseの主要ページ、カテゴリ、英語学習記事一覧をまとめたサイトマップです。"
      canonicalPath="/sitemap"
    >
      <article className={styles.article}>
        <h1>サイトマップ</h1>
        <p>
          eigo baseの主要ページ、英語学習カテゴリ、記事一覧をまとめています。
          TOEIC、英単語、リスニング、AI英語学習、英会話学習の記事を探すときにご利用ください。
        </p>

        <section>
          <h2>主要ページ</h2>
          <ul>
            <li><Link href="/">ホーム</Link></li>
            <li><Link href="/blog">英語学習コラム</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/about">運営者情報</Link></li>
            <li><Link href="/privacy">プライバシーポリシー</Link></li>
            <li><Link href="/terms">利用規約</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
          </ul>
        </section>

        <section>
          <h2>おすすめ・比較ページ</h2>
          <ul>
            <li><Link href="/recommend/english-learning-services">eigo base・スタディサプリENGLISH・Camblyの使い分け</Link></li>
            <li><Link href="/recommend/study-sapuri-english">スタディサプリENGLISH TOEIC対策の特徴と使い方</Link></li>
            <li><Link href="/recommend/cambly">Camblyの特徴と英会話実践での使い方</Link></li>
          </ul>
        </section>

        <section>
          <h2>カテゴリ</h2>
          <ul>
            {Object.entries(blogCategories).map(([key, category]) => (
              <li key={key}>
                <Link href={getBlogCategoryPath(key as BlogCategoryKey)}>{category.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>全記事一覧</h2>
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
