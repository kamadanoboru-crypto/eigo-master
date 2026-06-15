import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import AffiliateCard from '../../components/AffiliateCard';
import SiteLayout from '../../components/SiteLayout';
import {
  BlogCategoryKey,
  BlogPost,
  SITE_URL,
  blogCategories,
  blogPosts,
  getBlogCategoryPath,
  getBlogPath,
  getBlogPostByPath,
  getBlogUrl,
  getPostsByCategory,
  getRelatedPosts,
} from '../../lib/blogPosts';
import styles from '../pages.module.css';

type Props = {
  post?: BlogPost;
  relatedPosts?: BlogPost[];
  categoryKey?: BlogCategoryKey;
  categoryPosts?: BlogPost[];
};

function getAffiliateService(post: BlogPost) {
  if (post.service) return post.service;
  if (post.category === 'cambly' || post.category === 'english-conversation') return 'cambly';
  return 'study_sapuri';
}

function getAffiliateReason(post: BlogPost, footer = false) {
  const service = getAffiliateService(post);
  if (service === 'cambly') {
    return footer
      ? 'AIや独学で準備した英語を、ネイティブ講師との会話で実践したい人に向いています。'
      : '英会話やアウトプットを伸ばしたい人は、Camblyでネイティブ講師と話す練習も選択肢になります。';
  }
  return footer
    ? 'TOEIC対策を講義と演習で整理したい人は、まず無料体験で学習導線を確認してみましょう。'
    : 'TOEIC、単語、文法、リスニングを体系的に進めたい人には、スタディサプリENGLISHが相性のよい選択肢です。';
}

function buildStructuredData(post: BlogPost, relatedPosts: BlogPost[]) {
  const url = getBlogUrl(post);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      url,
      author: {
        '@type': 'Organization',
        name: 'AI英語学習アプリ Eigo Base運営',
        description: '英語学習サービスを研究し、AI英語学習を実践しながら、TOEIC学習者向けコンテンツを発信しています。',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Eigo Base',
      },
      mainEntityOfPage: url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: '英語学習コラム', item: `${SITE_URL}/blog` },
        {
          '@type': 'ListItem',
          position: 3,
          name: blogCategories[post.category].label,
          item: `${SITE_URL}${getBlogCategoryPath(post.category)}`,
        },
        { '@type': 'ListItem', position: 4, name: post.title, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '関連記事',
      itemListElement: relatedPosts.map((relatedPost, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: getBlogUrl(relatedPost),
        name: relatedPost.title,
      })),
    },
  ];
}

export default function BlogArticle({ post, relatedPosts = [], categoryKey, categoryPosts = [] }: Props) {
  if (!post && categoryKey) {
    const category = blogCategories[categoryKey];
    const canonicalPath = getBlogCategoryPath(categoryKey);
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.label}の記事一覧`,
      description: category.description,
      url: `${SITE_URL}${canonicalPath}`,
    };

    return (
      <SiteLayout
        title={`${category.label}の記事一覧 | Eigo Base`}
        description={category.description}
        canonicalPath={canonicalPath}
        structuredData={structuredData}
      >
        <article className={styles.article}>
          <p className={styles.kicker}>英語学習カテゴリ</p>
          <h1>{category.label}</h1>
          <p>{category.description}</p>

          <div className={styles.blogList}>
            {categoryPosts.map((categoryPost) => (
              <Link key={categoryPost.slug} href={getBlogPath(categoryPost)} className={styles.blogCard}>
                <h2>{categoryPost.title}</h2>
                <p>{categoryPost.description}</p>
                <span>記事を読む</span>
              </Link>
            ))}
          </div>

          <p><Link href="/blog">英語学習コラム一覧へ戻る</Link></p>
        </article>
      </SiteLayout>
    );
  }

  if (!post) return null;

  const category = blogCategories[post.category];
  const service = getAffiliateService(post);
  const structuredData = buildStructuredData(post, relatedPosts);

  return (
    <SiteLayout
      title={`${post.title} | Eigo Base`}
      description={post.description}
      canonicalPath={getBlogPath(post)}
      ogType="article"
      structuredData={structuredData}
    >
      <article className={styles.article}>
        <p className={styles.kicker}>{category.label}</p>
        <h1>{post.title}</h1>
        <p className={styles.lastUpdate}>執筆者: AI英語学習アプリ Eigo Base運営</p>
        <p>{post.lead}</p>

        {post.sections.map((section, sectionIndex) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            {section.points?.map((point) => (
              <div key={point.heading}>
                <h3>{point.heading}</h3>
                {point.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ))}
            {sectionIndex === 1 ? (
              <AffiliateCard
                service={service}
                placement="blog_body"
                variant="compact"
                urlKey={service === 'cambly' ? 'trial' : 'toeic'}
                reason={getAffiliateReason(post)}
              />
            ) : null}
          </section>
        ))}

        <section className={styles.notice}>
          <h2>執筆者プロフィール</h2>
          <p>
            AI英語学習アプリ Eigo Base運営。英語学習サービスを研究し、AI英語学習を実践しながら、
            TOEIC学習者向けコンテンツを発信しています。
          </p>
        </section>

        <section>
          <h2>関連記事</h2>
          <ul>
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.slug}>
                <Link href={getBlogPath(relatedPost)}>{relatedPost.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <AffiliateCard
          service={service}
          placement="blog_footer"
          variant="standard"
          urlKey={service === 'cambly' ? 'detail' : 'trial'}
          reason={getAffiliateReason(post, true)}
        />

        <p>
          <Link href={getBlogCategoryPath(post.category)}>{category.label}の記事一覧へ</Link>
          {' / '}
          <Link href="/blog">学習コラム一覧へ戻る</Link>
        </p>
      </article>
    </SiteLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [
    ...Object.keys(blogCategories).map((slug) => ({ params: { slug: [slug] } })),
    ...blogPosts.map((post) => ({ params: { slug: [post.category, post.slug] } })),
  ],
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slugParam = params?.slug;
  const parts = Array.isArray(slugParam) ? slugParam.map(String) : [String(slugParam || '')];

  if (parts.length === 1 && blogCategories[parts[0] as BlogCategoryKey]) {
    const categoryKey = parts[0] as BlogCategoryKey;
    return { props: { categoryKey, categoryPosts: getPostsByCategory(categoryKey) } };
  }

  const post = getBlogPostByPath(parts);
  if (!post) {
    return { notFound: true };
  }
  return { props: { post, relatedPosts: getRelatedPosts(post, 5) } };
};
