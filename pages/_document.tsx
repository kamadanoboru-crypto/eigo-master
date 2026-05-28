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
          content="Eigo Masterは、英単語・英文法・動画学習・AI会話練習を組み合わせた英語学習支援サービスです。"
        />
        <meta property="og:title" content="Eigo Master | AIと動画で続ける英語学習" />
        <meta
          property="og:description"
          content="英単語・英文法・動画学習・AI会話練習を組み合わせ、毎日少しずつ英語に触れられる環境を提供します。"
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
