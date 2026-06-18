import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import './globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const SITE_URL = 'https://eigobase.jp';

export default function App({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  const canonicalPath = asPath.split(/[?#]/)[0];
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  useEffect(() => {
    import('../lib/nativeAppBridge')
      .then(({ initNativeAppBridge }) => initNativeAppBridge())
      .catch(error => console.warn('[native bridge]', error));
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#2563EB" />
        <meta
          name="description"
          content="eigo baseは、TOEIC、英単語、英文法、動画リスニング、AI学習アドバイスを組み合わせて、毎日の英語学習を続けやすくする学習支援サービスです。"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="eigo base" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <title>eigo base</title>
      </Head>
      {GA_ID ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      ) : null}
      <Component {...pageProps} />
    </>
  );
}


