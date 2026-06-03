import { Capacitor } from '@capacitor/core';

export type RewardedAdReason = 'gacha' | 'coin' | 'ai';

export type RewardedAdFailureReason =
  | 'enabled_env_false'
  | 'enabled_env_missing'
  | 'rewarded_id_missing'
  | 'not_native'
  | 'not_android'
  | 'plugin_missing'
  | 'already_showing'
  | 'load_or_show_failed'
  | 'browser';

export type RewardedAdResult = {
  success: boolean;
  rewardEarned: boolean;
  error?: string;
  reason?: RewardedAdFailureReason;
};

const TEST_REWARDED_AD_ID = 'ca-app-pub-3940256099942544/5224354917';

let initialized = false;
let showing = false;

function getEnabledEnv() {
  return process.env.NEXT_PUBLIC_ADMOB_ENABLED;
}

function getRewardedAdIdEnv() {
  return process.env.NEXT_PUBLIC_ADMOB_REWARDED_ID_ANDROID;
}

function getRewardedAdId() {
  return getRewardedAdIdEnv() || TEST_REWARDED_AD_ID;
}

function logAdMobDebug(context: string) {
  const isNative = typeof window !== 'undefined' ? Capacitor.isNativePlatform() : false;
  const platform = typeof window !== 'undefined' ? Capacitor.getPlatform() : 'server';
  const enabledEnv = getEnabledEnv();
  const rewardedIdEnv = getRewardedAdIdEnv();
  const rewardedId = getRewardedAdId();

  console.log('[AdMob rewarded debug]', {
    context,
    NEXT_PUBLIC_ADMOB_ENABLED: enabledEnv,
    NEXT_PUBLIC_ADMOB_REWARDED_ID_ANDROID: rewardedIdEnv,
    rewardedAdIdUsed: rewardedId,
    usingTestFallback: !rewardedIdEnv,
    isNativePlatform: isNative,
    platform,
  });
}

export function getRewardedAdAvailability() {
  logAdMobDebug('availability');

  if (typeof window === 'undefined') {
    return { available: false, reason: 'browser' as const };
  }

  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();
  if (!isNative) {
    return { available: false, reason: 'not_native' as const };
  }
  if (platform !== 'android') {
    return { available: false, reason: 'not_android' as const };
  }

  const enabledEnv = getEnabledEnv();
  if (enabledEnv === 'false') {
    return { available: false, reason: 'enabled_env_false' as const };
  }

  if (!enabledEnv) {
    console.warn('[AdMob rewarded debug] NEXT_PUBLIC_ADMOB_ENABLED is missing; allowing Android test fallback.');
  }
  if (!getRewardedAdIdEnv()) {
    console.warn('[AdMob rewarded debug] NEXT_PUBLIC_ADMOB_REWARDED_ID_ANDROID is missing; using Google test rewarded ad ID fallback.');
  }

  return { available: true, reason: 'android' as const };
}

export function isAndroidNativeRewardedAdEnvironment() {
  if (typeof window === 'undefined') return false;
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

function errorMessage(reason: RewardedAdFailureReason) {
  const messages: Record<RewardedAdFailureReason, string> = {
    enabled_env_false: 'AdMob is disabled: NEXT_PUBLIC_ADMOB_ENABLED=false',
    enabled_env_missing: 'AdMob enabled env is missing: NEXT_PUBLIC_ADMOB_ENABLED',
    rewarded_id_missing: 'AdMob rewarded id is missing: NEXT_PUBLIC_ADMOB_REWARDED_ID_ANDROID',
    not_native: 'AdMob is available only in the Android native app: not_native',
    not_android: 'AdMob is available only on Android: not_android',
    plugin_missing: 'AdMob plugin is missing or failed to load: plugin_missing',
    already_showing: 'Rewarded ad is already showing: already_showing',
    load_or_show_failed: 'Rewarded ad failed to load or show: load_or_show_failed',
    browser: 'AdMob cannot run during server/browser rendering: browser',
  };
  return messages[reason];
}

export async function showRewardedAd(reason: RewardedAdReason): Promise<RewardedAdResult> {
  logAdMobDebug(`show:${reason}`);

  const availability = getRewardedAdAvailability();
  if (!availability.available) {
    const failureReason = availability.reason as RewardedAdFailureReason;
    return {
      success: false,
      rewardEarned: false,
      reason: failureReason,
      error: errorMessage(failureReason),
    };
  }

  if (showing) {
    return {
      success: false,
      rewardEarned: false,
      reason: 'already_showing',
      error: errorMessage('already_showing'),
    };
  }

  showing = true;
  const handles: Array<{ remove: () => Promise<void> }> = [];
  let rewardEarned = false;

  try {
    let admobModule: typeof import('@capacitor-community/admob');
    try {
      admobModule = await import('@capacitor-community/admob');
    } catch (error) {
      console.error('[AdMob rewarded debug] plugin import failed', error);
      return {
        success: false,
        rewardEarned: false,
        reason: 'plugin_missing',
        error: errorMessage('plugin_missing'),
      };
    }

    const { AdMob, RewardAdPluginEvents } = admobModule;

    if (!initialized) {
      await AdMob.initialize({
        initializeForTesting: true,
      });
      initialized = true;
    }

    handles.push(
      await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        rewardEarned = true;
      }),
    );

    const adId = getRewardedAdId();
    console.log('[AdMob rewarded debug] prepareRewardVideoAd', {
      adId,
      reason,
      usingTestFallback: !getRewardedAdIdEnv(),
    });

    await AdMob.prepareRewardVideoAd({
      adId,
      isTesting: true,
      immersiveMode: true,
      ssv: {
        customData: JSON.stringify({ reason }),
      },
    });

    const rewardItem = await AdMob.showRewardVideoAd();
    rewardEarned = rewardEarned || !!rewardItem;

    return { success: true, rewardEarned };
  } catch (error) {
    console.error('[AdMob rewarded debug] load/show failed', error);
    const message = error instanceof Error ? error.message : errorMessage('load_or_show_failed');
    return {
      success: false,
      rewardEarned: false,
      reason: 'load_or_show_failed',
      error: `${errorMessage('load_or_show_failed')}: ${message}`,
    };
  } finally {
    showing = false;
    await Promise.all(handles.map((handle) => handle.remove().catch(() => undefined)));
  }
}
