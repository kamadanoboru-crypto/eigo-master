import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import SiteLayout from '../../components/SiteLayout';
import {
  ColumnArticle,
  SITE_URL,
  columnArticles,
  columnCategories,
  getColumnArticle,
  getColumnPath,
  getColumnUrl,
  getRelatedColumns,
} from '../../lib/columns';
import styles from '../pages.module.css';

type Props = {
  article: ColumnArticle;
  related: ColumnArticle[];
};

function formatDate(date: string) {
  return date.replace(/-/g, '/');
}

function buildStructuredData(article: ColumnArticle, related: ColumnArticle[]) {
  const url = getColumnUrl(article);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: { '@type': 'Organization', name: 'eigo base編集部' },
      publisher: { '@type': 'Organization', name: 'eigo base' },
      mainEntityOfPage: url,
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: '学習コラム', item: `${SITE_URL}/columns` },
        { '@type': 'ListItem', position: 3, name: article.title, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '関連記事',
      itemListElement: related.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: getColumnUrl(item),
      })),
    },
  ];
}

export default function ColumnArticlePage({ article, related }: Props) {
  const category = columnCategories[article.category];

  return (
    <SiteLayout
      title={`${article.title} | eigo base`}
      description={article.description}
      canonicalPath={getColumnPath(article)}
      ogType="article"
      structuredData={buildStructuredData(article, related)}
    >
      <article className={styles.article}>
        <p className={styles.kicker}>{category.label}</p>
        <h1>{article.title}</h1>
        <p className={styles.lastUpdate}>
          公開日：{formatDate(article.publishedAt)} / 更新日：{formatDate(article.updatedAt)} / 執筆者：eigo base編集部
        </p>
        <p>{article.lead}</p>

        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        ))}

        <section className={styles.notice}>
          <h2>執筆者プロフィール</h2>
          <p>
            eigo base編集部。英語学習アプリと学習メディアを運営し、TOEIC、英単語、英文法、
            動画リスニング、AI学習アドバイスを組み合わせた学習方法を発信しています。
          </p>
        </section>

        <section>
          <h2>関連記事</h2>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={getColumnPath(item)}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <p>
          <Link href="/columns">学習コラム一覧へ戻る</Link>
        </p>
      </article>
    </SiteLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: columnArticles.map((article) => ({ params: { slug: article.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug || '');
  const article = getColumnArticle(slug);
  if (!article) return { notFound: true };
  return { props: { article, related: getRelatedColumns(article, 5) } };
};
