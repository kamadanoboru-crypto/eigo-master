import type { AppProps } from 'next/app';
import Head from 'next/head';
import './globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="description" content="Eigo Masterは、TOEIC頻出単語、Part 5文法、リスニング、動画字幕学習、ニュース読解、AI学習アドバイスを組み合わせた英語学習アプリです。" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Eigo Master" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <title>Eigo Master</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}
