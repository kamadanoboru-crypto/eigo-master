import Link from 'next/link';
import SiteLayout from '../../components/SiteLayout';
import { ColumnCategoryKey, columnArticles, columnCategories, getColumnPath } from '../../lib/columns';
import styles from '../pages.module.css';

export default function ColumnsIndex() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '学習コラム',
    description: 'TOEIC、英単語、英文法、リスニング、英会話、AI英語学習を扱うeigo baseの無料学習コラムです。',
    url: 'https://eigobase.jp/columns',
  };

  return (
    <SiteLayout
      title="学習コラム | eigo base"
      description="TOEIC、英単語、英文法、リスニング、英会話、AI英語学習を扱うeigo baseの無料学習コラムです。"
      canonicalPath="/columns"
      structuredData={structuredData}
    >
      <article className={styles.article}>
        <p className={styles.kicker}>無料で読める英語学習コンテンツ</p>
        <h1>学習コラム</h1>
        <p>
          eigo baseの学習コラムでは、英語初心者のロードマップ、TOEIC対策、単語、文法、リスニング、
          シャドーイング、英会話、AI英語学習、教材レビューを扱います。ログインなしで読める記事として、
          学習者が次の一歩を決めやすい内容を整理しています。
        </p>

        <section>
          <h2>カテゴリ</h2>
          <div className={styles.cardGrid}>
            {Object.entries(columnCategories).map(([key, category]) => (
              <a key={key} href={`#${key}`} className={styles.blogCard}>
                <h2>{category.label}</h2>
                <p>{category.description}</p>
                <span>記事を見る</span>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2>全記事</h2>
          <div className={styles.blogList}>
            {columnArticles.map((article) => (
              <Link key={article.slug} href={getColumnPath(article)} className={styles.blogCard}>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <span>{columnCategories[article.category].label} / 記事を読む</span>
              </Link>
            ))}
          </div>
        </section>

        {Object.entries(columnCategories).map(([key, category]) => {
          const articles = columnArticles.filter((article) => article.category === (key as ColumnCategoryKey));
          if (!articles.length) return null;
          return (
            <section key={key} id={key}>
              <h2>{category.label}</h2>
              <ul>
                {articles.map((article) => (
                  <li key={article.slug}>
                    <Link href={getColumnPath(article)}>{article.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </article>
    </SiteLayout>
  );
}
