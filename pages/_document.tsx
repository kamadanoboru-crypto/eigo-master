import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="English Base" />
        {/* SEO */}
        <meta name="description" content="AI字幕・対訳・単語テスト・ガチャで毎日英語を続けよう" />
        <meta property="og:title" content="English Base - 英語学習基地" />
        <meta property="og:description" content="YouTube英語動画でAI学習。毎日触りたくなる英語基地。" />
        <meta property="og:type" content="website" />
        {/* Google Ads */}
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
