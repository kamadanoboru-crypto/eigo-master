# Android Play Readiness Notes

## Current Native Shell

- Package name: `com.englishbase.app`
- Supabase Redirect URL: `com.englishbase.app://auth`
- Capacitor loads the existing production web app at `https://eigo-master.vercel.app`.
- Local `capacitor-www/error.html` is used as a native network error screen when the remote app cannot load.

## AdMob Rewarded Ads Plan

- Keep the current reward flow behind one app-level function such as `showRewardedAd(reason, onReward)`.
- Web builds should continue to use the existing fallback reward path until native ads are enabled.
- Android builds should later install a Capacitor AdMob plugin and call rewarded ads only from explicit user actions, for example:
  - save missed questions after a test
  - extra gacha / coin reward
  - unlock a short practice boost
- Reward grants must remain server-validated through existing wallet APIs. The client should only request the reward after the AdMob reward callback.
- Add privacy disclosures before release: ads, approximate data collection, and child-directed policy status.

## Play Store Items Still Needed

- Final app screenshots for phone and, if supported, tablet.
- Feature graphic.
- Short and full descriptions.
- Privacy Policy URL confirmation.
- Data Safety form.
- Content rating questionnaire.
- Test Google login on a physical Android device.
- Confirm Supabase Auth Redirect URLs include `com.englishbase.app://auth`.
- Confirm production Vercel deployment includes the native bridge changes before Play review.
