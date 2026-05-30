import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Eigo Master" />
        <meta
          name="description"
          content="Eigo Masterは、TOEIC頻出単語、Part 5文法、リスニング、動画字幕学習、ニュース読解、AI学習アドバイスを組み合わせた英語学習アプリです。"
        />
        <meta property="og:title" content="Eigo Master | TOEIC・動画・AIで続ける英語学習" />
        <meta
          property="og:description"
          content="単語、Part 5、リスニング、動画字幕、ニュース読解、AI学習アドバイスで英語学習を続けやすくします。"
        />
        <meta property="og:type" content="website" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4600703702846282"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
