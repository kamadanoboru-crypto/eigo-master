import type { NextApiRequest, NextApiResponse } from 'next';
import type { NewsArticle } from '../../../types';

const FEEDS: Record<string, string> = {
  latest: 'https://pagesix.com/feed/',
  celebrity: 'https://pagesix.com/celebrity-news/feed/',
  entertainment: 'https://pagesix.com/entertainment/feed/',
  style: 'https://pagesix.com/style/feed/',
};

function decode(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&#8216;/g, "'").replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-').replace(/&#8212;/g, '-')
    .trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ articles: NewsArticle[] } | { error: string }>,
) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const feed = (req.query.feed as string) || 'latest';
  const url = FEEDS[feed];
  if (!url) return res.status(400).json({ error: `Unknown feed: ${feed}` });

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'EnglishBase/1.0 (educational RSS reader)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`PageSix HTTP ${r.status}`);

    const xml = await r.text();
    const articles: NewsArticle[] = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let m: RegExpExecArray | null;

    while ((m = itemRe.exec(xml)) !== null && articles.length < 15) {
      const item = m[1];
      const get = (tag: string) => {
        const r2 = item.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))<\\/${tag}>`));
        return r2 ? (r2[1] ?? r2[2] ?? '').trim() : '';
      };
      const title = decode(get('title'));
      const description = decode(get('description')).slice(0, 360);
      const link = get('link').trim() || get('guid').trim();
      if (!title || !link) continue;
      articles.push({ id: get('guid') || link, title, description: description || title, link, pubDate: get('pubDate'), category: feed });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ articles });
  } catch (err) {
    console.error('[pagesix]', err);
    return res.status(500).json({ error: 'Page Six RSSの取得に失敗しました' });
  }
}
