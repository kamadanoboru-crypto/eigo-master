import type { NextApiRequest, NextApiResponse } from 'next';
import type { NewsArticle } from '../../../types';

const FEEDS: Record<string, string> = {
  world:    'https://feeds.bbci.co.uk/news/world/rss.xml',
  science:  'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  tech:     'https://feeds.bbci.co.uk/news/technology/rss.xml',
  business: 'https://feeds.bbci.co.uk/news/business/rss.xml',
};

function decode(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ articles: NewsArticle[] } | { error: string }>,
) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const feed = (req.query.feed as string) || 'world';
  const url = FEEDS[feed];
  if (!url) return res.status(400).json({ error: `Unknown feed: ${feed}` });

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'EnglishBase/1.0 (educational)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`BBC HTTP ${r.status}`);

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
      const description = decode(get('description')).slice(0, 400);
      const link = get('link').trim() || get('guid').trim();
      if (!title || description.length < 30) continue;
      articles.push({ id: get('guid') || link, title, description, link, pubDate: get('pubDate'), category: feed });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ articles });
  } catch (err) {
    console.error('[bbc]', err);
    return res.status(500).json({ error: 'BBC RSSの取得に失敗しました' });
  }
}
