export type NewsCountryKey = 'us' | 'india' | 'philippines';

export type NewsFeedConfig = {
  id: string;
  label: string;
  url: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type NewsCountryConfig = {
  key: NewsCountryKey;
  label: string;
  shortLabel: string;
  description: string;
  badge: string;
  sourceHomeUrl: string;
  feeds: NewsFeedConfig[];
};

export const NEWS_COUNTRIES: Record<NewsCountryKey, NewsCountryConfig> = {
  us: {
    key: 'us',
    label: 'アメリカ',
    shortLabel: 'US',
    description: '海外ニュースの基本。現在のニュース学習ページを表示します。',
    badge: '既存画面',
    sourceHomeUrl: 'https://www.bbc.com/news',
    feeds: [
      {
        id: 'world',
        label: '世界',
        url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
        sourceLabel: 'BBC',
        sourceUrl: 'https://www.bbc.com/news',
      },
      {
        id: 'science',
        label: '科学',
        url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
        sourceLabel: 'BBC',
        sourceUrl: 'https://www.bbc.com/news/science_and_environment',
      },
      {
        id: 'tech',
        label: 'テック',
        url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
        sourceLabel: 'BBC',
        sourceUrl: 'https://www.bbc.com/news/technology',
      },
      {
        id: 'business',
        label: 'ビジネス',
        url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
        sourceLabel: 'BBC',
        sourceUrl: 'https://www.bbc.com/news/business',
      },
    ],
  },
  india: {
    key: 'india',
    label: 'インド',
    shortLabel: 'IN',
    description: 'IT、経済、ビジネス、現地生活に関する英語ニュースを読む。',
    badge: '生活・IT',
    sourceHomeUrl: 'https://timesofindia.indiatimes.com/',
    feeds: [
      {
        id: 'top',
        label: 'トップ',
        url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
        sourceLabel: 'Times of India',
        sourceUrl: 'https://timesofindia.indiatimes.com/',
      },
      {
        id: 'india',
        label: 'インド',
        url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
        sourceLabel: 'Hindustan Times',
        sourceUrl: 'https://www.hindustantimes.com/india-news',
      },
      {
        id: 'business',
        label: 'ビジネス',
        url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
        sourceLabel: 'The Economic Times',
        sourceUrl: 'https://economictimes.indiatimes.com/',
      },
    ],
  },
  philippines: {
    key: 'philippines',
    label: 'フィリピン',
    shortLabel: 'PH',
    description: '海外生活、ビジネス、現地ニュース、日常英語に触れる。',
    badge: '現地生活',
    sourceHomeUrl: 'https://www.inquirer.net/',
    feeds: [
      {
        id: 'top',
        label: 'トップ',
        url: 'https://newsinfo.inquirer.net/feed',
        sourceLabel: 'Inquirer.net',
        sourceUrl: 'https://newsinfo.inquirer.net/',
      },
      {
        id: 'business',
        label: 'ビジネス',
        url: 'https://business.inquirer.net/feed',
        sourceLabel: 'Inquirer Business',
        sourceUrl: 'https://business.inquirer.net/',
      },
      {
        id: 'headlines',
        label: '社会',
        url: 'https://www.philstar.com/rss/headlines',
        sourceLabel: 'Philstar',
        sourceUrl: 'https://www.philstar.com/headlines',
      },
    ],
  },
};

export const NEWS_COUNTRY_ORDER: NewsCountryKey[] = ['us', 'india', 'philippines'];

export function getNewsCountry(key?: string): NewsCountryConfig {
  if (key === 'india' || key === 'philippines') return NEWS_COUNTRIES[key];
  return NEWS_COUNTRIES.us;
}

export function getNewsFeed(countryKey?: string, feedId?: string): NewsFeedConfig {
  const country = getNewsCountry(countryKey);
  return country.feeds.find((feed) => feed.id === feedId) || country.feeds[0];
}
