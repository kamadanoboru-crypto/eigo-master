const APP_ORIGIN = 'https://eigo-master.vercel.app';

type NativeWindow = Window & {
  Capacitor?: {
    getPlatform?: () => string;
    isNativePlatform?: () => boolean;
  };
};

function isNativeAndroid() {
  if (typeof window === 'undefined') return false;
  const cap = (window as NativeWindow).Capacitor;
  return Boolean(cap?.isNativePlatform?.()) && cap?.getPlatform?.() === 'android';
}

function isHttpUrl(value: string) {
  return value.startsWith('http://') || value.startsWith('https://');
}

function shouldOpenExternally(url: URL) {
  return url.origin !== window.location.origin && url.origin !== APP_ORIGIN;
}

function showConnectionBanner() {
  const id = 'native-connection-banner';
  let banner = document.getElementById(id);
  if (navigator.onLine) {
    banner?.remove();
    return;
  }

  if (!banner) {
    banner = document.createElement('div');
    banner.id = id;
    banner.className = 'native-connection-banner';
    banner.textContent = '通信できません。ネットワーク接続を確認してください。';
    document.body.appendChild(banner);
  }
}

export async function initNativeAppBridge() {
  if (!isNativeAndroid()) return;

  document.documentElement.dataset.appPlatform = 'android';
  document.body.classList.add('native-android');

  const [{ App }, { Browser }, { SplashScreen }, { StatusBar, Style }] = await Promise.all([
    import('@capacitor/app'),
    import('@capacitor/browser'),
    import('@capacitor/splash-screen'),
    import('@capacitor/status-bar'),
  ]);

  StatusBar.setBackgroundColor({ color: '#FFFDF8' }).catch(() => {});
  StatusBar.setStyle({ style: Style.Light }).catch(() => {});
  SplashScreen.hide().catch(() => {});

  window.addEventListener('online', showConnectionBanner);
  window.addEventListener('offline', showConnectionBanner);
  showConnectionBanner();

  const originalOpen = window.open.bind(window);
  window.open = (url?: string | URL, target?: string, features?: string) => {
    const value = typeof url === 'string' ? url : url?.toString();
    if (value && isHttpUrl(value)) {
      Browser.open({ url: value }).catch(() => originalOpen(value, target, features));
      return null;
    }
    return originalOpen(value, target, features);
  };

  document.addEventListener(
    'click',
    event => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (!isHttpUrl(href)) return;

      const url = new URL(href, window.location.href);
      if (!shouldOpenExternally(url)) return;

      event.preventDefault();
      Browser.open({ url: url.toString() }).catch(() => {
        window.location.href = url.toString();
      });
    },
    true,
  );

  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack || window.history.length > 1) {
      window.history.back();
      return;
    }
    App.minimizeApp().catch(() => {});
  });
}

export function getAppPlatform() {
  if (isNativeAndroid()) return 'android';
  return 'web';
}
