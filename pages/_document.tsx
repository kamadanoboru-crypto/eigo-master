import { Html, Head, Main, NextScript } from 'next/document';

const SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  'qouV0nFZgZUIHnK_z9nM36M8GaWxwcjH-tMo_Z4UUZg';

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="English Base" />
        {SITE_VERIFICATION ? <meta name="google-site-verification" content={SITE_VERIFICATION} /> : null}
        <meta
          name="description"
          content="English Baseは、TOEIC、英単語、英文法、動画リスニング、AI学習アドバイスを組み合わせて、毎日の英語学習を続けやすくする学習支援サービスです。"
        />
        <meta property="og:title" content="English Base | AIと動画で続ける英語学習" />
        <meta
          property="og:description"
          content="TOEIC、英単語、英文法、動画リスニング、AI学習アドバイスで毎日の英語学習を続けやすくします。"
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
