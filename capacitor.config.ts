import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.englishbase.app',
  appName: 'English Base',
  webDir: 'capacitor-www',
  server: {
    url: 'https://eigo-master.vercel.app',
    cleartext: false,
    errorPath: 'error.html',
  },
  android: {
    path: 'android',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#FFFDF8',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
