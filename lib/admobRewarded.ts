import { Capacitor } from '@capacitor/core';

export type RewardedAdReason = 'gacha' | 'coin' | 'ai';

export type RewardedAdResult = {
  success: boolean;
  rewardEarned: boolean;
  error?: string;
};

let initialized = false;
let showing = false;

function getRewardedAdId() {
  return process.env.NEXT_PUBLIC_ADMOB_REWARDED_ID_ANDROID || '';
}

function isEnabled() {
  return process.env.NEXT_PUBLIC_ADMOB_ENABLED === 'true';
}

export function getRewardedAdAvailability() {
  if (typeof window === 'undefined') {
    return { available: false, reason: 'browser' as const };
  }
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return { available: false, reason: 'web' as const };
  }
  if (!isEnabled()) {
    return { available: false, reason: 'disabled' as const };
  }
  if (!getRewardedAdId()) {
    return { available: false, reason: 'missing-ad-id' as const };
  }
  return { available: true, reason: 'android' as const };
}

export async function showRewardedAd(reason: RewardedAdReason): Promise<RewardedAdResult> {
  const availability = getRewardedAdAvailability();
  if (!availability.available) {
    const message =
      availability.reason === 'web'
        ? 'Web版ではこの機能はAndroidアプリで利用できます'
        : availability.reason === 'disabled'
          ? 'AdMobが無効です。NEXT_PUBLIC_ADMOB_ENABLED=true を設定してください'
          : availability.reason === 'missing-ad-id'
            ? 'AdMob広告IDが未設定です'
            : 'AdMobはブラウザでは実行できません';
    return { success: false, rewardEarned: false, error: message };
  }

  if (showing) {
    return { success: false, rewardEarned: false, error: '広告を表示中です' };
  }

  showing = true;
  const handles: Array<{ remove: () => Promise<void> }> = [];
  let rewardEarned = false;

  try {
    const { AdMob, RewardAdPluginEvents } = await import('@capacitor-community/admob');

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

    await AdMob.prepareRewardVideoAd({
      adId: getRewardedAdId(),
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
    const message = error instanceof Error ? error.message : '広告の読み込みに失敗しました';
    return { success: false, rewardEarned: false, error: message };
  } finally {
    showing = false;
    await Promise.all(handles.map((handle) => handle.remove().catch(() => undefined)));
  }
}
