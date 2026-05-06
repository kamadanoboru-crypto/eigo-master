import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import './globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const adsenseClientId = "ca-pub-4600703702846282";

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="description" content="YouTube動画・BBCニュースで英語を語順のまま理解する学習アプリ" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="英語マスター" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <title>英語マスター</title>
      </Head>

      {/* Google AdSense Auto Ads */}
      {adsenseClientId && (
        <Script
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4600703702846282`}
          crossOrigin="anonymous"
        />
      )}

      <Component {...pageProps} />
    </>
  );
}
