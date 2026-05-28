# 🎓 English Base

YouTube動画・BBC/Page Sixニュースで**英語を語順のまま理解する**学習アプリ。

**⚠️ 重要：本アプリで提供される字幕・翻訳の正確性は保証されません。学習補助ツールとしてご利用ください。**

---

## 機能一覧

| 機能 | 説明 |
|------|------|
| 🎬 YouTube語順学習 | 字幕をChunk分解、語順イメージを表示 |
| 📝 単語/文法/リスニングテスト | quiz_cacheで全ユーザー共有。2回目以降はAI不使用 |
| 🎮 シューティング単語ゲーム | 英単語が落下→日本語4択で撃破、HP制+スキル装備 |
| 🎰 ガチャ・装備 | ガチャでスキルチケット取得→ステージ前装備 |
| 📰 対訳リーダー | 英文+翻訳を貼り付け→上下分割表示+同期スクロール |
| 🌐 ニュース学習モード | BBC / Page Six のRSS要約で、単語タップ→意味、文タップ→翻訳 |
| 📊 TOEIC予想スコア | 学習履歴からスコア推定 |
| 🔐 Googleログイン | Supabase Auth、未設定でもlocalStorageで動作 |

---

## 📖 固定ページ

- **`/about`** - アプリについて、使い方、注意事項
- **`/privacy-policy`** - プライバシーポリシー
- **`/terms`** - 利用規約
- **`/contact`** - お問い合わせフォーム

---

## ⚡ すぐに動かす（env未設定でも動く）

```bash
git clone https://github.com/your-name/eigo-base.git
cd eigo-base
npm install
npm run dev          # http://localhost:3000
```

**env未設定の場合：**
- Supabase → localStorage で代替（リロードでもデータ保持）
- AI → ダミーデータで動作
- AdSense → 無効（client ID未設定）
- アプリは絶対にクラッシュしない設計

---

## 📋 Vercel デプロイ前のセットアップ手順

### Step 1: 環境変数を設定

```bash
cp .env.local.example .env.local
```

`.env.local` を開いて以下を入力：

```env
# ── Supabase（必須）──────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# ── AI（優先順位: Groq→Cohere→Gemini→OpenAI→Dummy）─────────
AI_PROVIDER_PRIORITY=groq,cohere,gemini,openai,dummy

GROQ_API_KEY=gsk_...        # 推奨・最速・無料枠大
COHERE_API_KEY=...          # 安価
GEMINI_API_KEY=AIzaSy...    # 安定
OPENAI_API_KEY=sk-proj-...  # 最終手段

# ── Google AdSense（任意・Vercel審査後に設定）─────────────────
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
```

### Step 2: Supabase DBをセットアップ

1. [supabase.com](https://supabase.com) でプロジェクト作成
2. **SQL Editor** を開いて `sql/schema.sql` の内容を全部貼り付けて **Run**
3. Settings → API → Project URL と anon key をコピーして `.env.local` に貼る

### Step 3: 動作確認

```bash
npm run dev
npm run build        # ビルドエラーがないか確認
npm run type-check   # TypeScript型チェック
```

---

## 📊 Google AdSense 設定（Google審査後）

### 環境変数

本アプリは `NEXT_PUBLIC_ADSENSE_CLIENT` 環境変数から AdSense クライアントID を読み込みます。

```env
# Google AdSense クライアントID
# https://adsense.google.com → 設定 → アカウント情報 → クライアントID
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
```

### ads.txt

Google AdSense 審査通過後、以下のファイルが自動的に `/public/ads.txt` に配置されます：

```
google.com, pub-xxxxxxxxxxxxxxxx, DIRECT, f08c47fec0942fa0
```

**Vercel にデプロイすると、自動的に以下の URL でアクセス可能になります：**

```
https://yourdomain.com/ads.txt
```

### 広告実装

現在は **Google AdSense Auto Ads** のみを実装しています。

- ページ読み込み時に自動的に広告が挿入されます
- 追加の広告枠コンポーネントは未実装（今後対応予定）

### AdSense Auto Ads の有効化

1. [AdSense ダッシュボード](https://adsense.google.com) を開く
2. **広告** → **サマリー** → **広告ユニット**
3. **自動広告** → **編集** → **ON**

---

## ⚠️ 重要な注意事項

### AI字幕・翻訳について

```
⚠️  本アプリで提供される字幕・翻訳・文法説明は
   AIによって自動生成されたものです。

   正確性は保証されません。
   学習補助ツールとしてのみご利用ください。

   重要な翻訳には必ず専門家に確認してください。
```

### YouTube 動画について

```
📺 本アプリで使用される YouTube 動画・音声の著作権は
   各権利者（コンテンツ作成者）に帰属します。

   使用は学習目的のみとしており、
   違法複製・配信・販売は厳禁です。

   → 利用規約: /terms
   → プライバシーポリシー: /privacy-policy
```

### 学習補助について

- 本アプリは TOEIC・英検等の資格試験**合格を保証しません**
- 学習支援ツール**としてのみ**ご活用ください

---

## 🔐 Google ログイン設定手順（任意）

Google OAuthを有効にしないと「Googleでログイン」ボタンは非表示。  
未設定でも localStorage UUID でデータは保存されます。

### Step 1: Supabase で Google プロバイダーを有効化

1. [Supabase Dashboard](https://supabase.com) → 自分のプロジェクトを開く
2. 左メニュー → **Authentication** → **Providers**
3. **Google** を見つけて **Enable** をON

### Step 2: Google Cloud Console でOAuthクライアントを作成

1. [console.cloud.google.com](https://console.cloud.google.com) を開く
2. プロジェクトを作成（または既存を選択）
3. 左メニュー → **APIとサービス** → **認証情報**
4. **認証情報を作成** → **OAuthクライアントID**
5. アプリの種類：**ウェブアプリケーション**
6. **承認済みのリダイレクトURI** に以下を追加：

```
https://[プロジェクトID].supabase.co/auth/v1/callback
```

（ローカル開発時は `http://localhost:3000` も追加）

7. **作成** → クライアントID とクライアントシークレットをコピー

### Step 3: Supabase に Google のクライアント情報を入力

1. Supabase → Authentication → Providers → Google
2. **Client ID** と **Client Secret** を入力して **Save**

### Step 4: 動作確認

```bash
npm run dev
```

アプリの「設定」タブ → **Googleでログイン** ボタンが表示されます。

---

## 🗄️ Supabaseテーブル（共有 vs ユーザー別）

| テーブル | 役割 | 共有 |
|---------|------|------|
| `quiz_cache` | AI問題（cache_keyで一意、全員再利用） | ✅ 全員共有 |
| `video_captions` | AI字幕・Chunk（videoId単位） | ✅ 全員共有 |
| `user_videos` | ユーザーが追加した動画 | 👤 ユーザー別 |
| `learning_logs` | テスト結果・スコア | 👤 ユーザー別 |
| `saved_items` | 保存した英文・単語 | 👤 ユーザー別 |
| `my_playlist` | マイリスト | 👤 ユーザー別 |
| `user_points` | ポイント残高 | 👤 ユーザー別 |

---

## 🔁 クイズ生成のキャッシュ仕様

```
1回目: AI生成（Groq→Cohere→Gemini→OpenAI→Dummy）
      → quiz_cache に保存（cache_key で一意）

2回目以降: DBから即返却（AI不使用）
          → 他のユーザーも同じ問題を共有
```

cache_key例：
```
word:toeic:level_600:set_001
grammar:part5:level_600:set_001
video:PlFx2XlbTK4:word
```

---

## 🚀 Vercel デプロイ

```bash
npm i -g vercel
vercel

# Vercel Dashboard → Settings → Environment Variables に追加
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# AI_PROVIDER_PRIORITY
# GROQ_API_KEY（など）
```

---

## 📁 ファイル構成

```
eigo-base/
├── components/EigoMaster.tsx   # メインUI（全機能）
├── pages/
│   ├── index.tsx               # エントリー（SSR無効）
│   ├── _app.tsx                # PWAヘッダー
│   └── api/
│       ├── ai/chunk.ts         # 字幕→チャンク分解
│       ├── ai/word.ts          # 単語の意味
│       ├── ai/translate.ts     # 翻訳
│       ├── quiz/generate.ts    # ★ キャッシュ確認→AI生成→DB保存
│       ├── quiz/get.ts         # キャッシュ確認のみ
│       ├── quiz/cache.ts       # キャッシュ管理
│       └── news/bbc.ts         # BBC RSSプロキシ
├── lib/
│   ├── aiClient.ts             # Groq→Cohere→Gemini→OpenAI→Dummy
│   ├── quizCache.ts            # quiz_cache CRUD
│   └── supabase.ts             # Supabase設定
├── types/index.ts              # TypeScript型定義
├── sql/schema.sql              # DBスキーマ（実行してください）
├── .env.local.example          # 環境変数テンプレート
└── README.md                   # このファイル
```

---

## 🛟 よくあるトラブル

**Q: npm run build でエラーが出る**
```bash
npm run type-check  # エラー箇所を確認
```

**Q: AIが動かない**
- `.env.local` の `AI_PROVIDER_PRIORITY` と対応するキーを確認
- 開発サーバーを再起動: `npm run dev`
- キー未設定でもダミーデータで動作します

**Q: Supabaseに保存されない**
- `NEXT_PUBLIC_SUPABASE_URL` が `https://` で始まるか確認
- `sql/schema.sql` を Supabase SQL Editor で実行したか確認
- 未接続でも localStorage で代替動作します

**Q: Googleログインが動かない**
- Supabase → Authentication → Providers → Google が有効か確認
- リダイレクトURIが正しいか確認

---

## 📊 全機能実装状況（最終確認）

| 機能 | 状態 | 備考 |
|------|------|------|
| Googleログイン | ✅ | Supabase OAuth / 未設定時はlocalStorage UUID |
| Supabase保存 | ✅ | 7テーブル全対応 |
| YouTube字幕/Chunk | ✅ | DB先読み→AI生成→DB保存 |
| quiz_cache | ✅ | 全ユーザー共有キャッシュ |
| AI優先順位 | ✅ | Groq→Cohere→Gemini→OpenAI→Dummy |
| コイン＋チケット制 | ✅ | user_wallet / unlocked_content |
| ガチャ報酬 | ✅ | weight管理 / デイリー上限 / インフレ対策 |
| ニュース上下2画面 | ✅ | ParallelReader / 同期スクロール |
| シューティング単語ゲーム | ✅ | 日本語4択 / HP制 / 装備 / ガチャ連動 |
| アフィリエイト導線 | ✅ | 設定ファイル化 / クリックログ |
| 広告枠 | ✅ | バナー・リワード（ダミー） / ON/OFF設定 |
| ニックネーム | ✅ | profiles テーブル / 自動Guest名 |
| 翻訳共有 | ✅ | user_translations / +5コイン報酬 |
| 👍/👎評価 | ✅ | translation_votes / 1ユーザー1票 / +10コイン |
| ランキング | ✅ | 翻訳スコア・学習回数ランキング |
| .env未設定でも動作 | ✅ | localStorage / Dummy fallback |

---

## 💰 経済設計

### コイン獲得方法
| アクション | 獲得コイン |
|-----------|----------|
| 広告視聴 | +30 |
| テスト完了（正答率80%+） | +10 |
| テスト完了（60%+） | +6 |
| 翻訳投稿 | +5 |
| シャドーイング | +スコア/10 |
| ステージクリア | +20 |
| 👍もらう | +10（翻訳者に） |

### コイン消費先（インフレ対策）
| 用途 | コスト |
|------|------|
| 新規AI翻訳 | 100 |
| 既存DB翻訳 | 10 |
| クイズ1回 | 5 |
| ガチャ1回 | 10 |
| 1日上限 | 200 |

### チケット種類
| チケット | 用途 | 有効期限 |
|---------|------|---------|
| video_ticket | 動画解放 | 24時間 |
| quiz_ticket | クイズ1回 | 24時間 |
| translation_ticket | 翻訳解放 | 24時間 |
| gacha_ticket | ガチャ1回 | 無制限 |

---

## 🔗 API Route 一覧（完全版）

| エンドポイント | メソッド | 役割 |
|--------------|---------|------|
| `/api/ai/chunk` | POST | 字幕→チャンク分解 |
| `/api/ai/word` | POST | 単語の意味 |
| `/api/ai/translate` | POST | 翻訳 |
| `/api/quiz/generate` | POST | キャッシュ→AI→DB |
| `/api/quiz/get` | GET | キャッシュ確認 |
| `/api/quiz/cache` | GET/POST | キャッシュ管理 |
| `/api/news/bbc` | GET | BBC RSSプロキシ |
| `/api/wallet` | GET/POST | ウォレット操作 |
| `/api/wallet/unlock` | GET/POST | コンテンツ解放 |
| `/api/wallet/gacha` | POST | ガチャ抽選 |
| `/api/affiliate/click` | POST | クリックログ |
| `/api/social/profile` | GET/POST | ニックネーム |
| `/api/social/translations` | GET/POST | 翻訳共有 |
| `/api/social/vote` | POST | 👍/👎投票 |
| `/api/social/ranking` | GET | ランキング |

---

## 💳 アフィリエイトURL差し替え手順

```typescript
// lib/affiliateConfig.ts を開いて url を変更するだけ
export const AFFILIATE_CARDS: AffiliateCard[] = [
  {
    key:  'basic',
    url:  'https://px.a8.net/xxxxx',  // ← A8.net等の実際のURLに変更
    ...
  },
  ...
];
```

**クリックログは `affiliate_clicks` テーブルに自動保存されます。**

---

## ✅ VS Code 移行後チェックリスト

### 必須（移行後すぐ）
- [ ] `npm install` が通る
- [ ] `npm run dev` でブラウザが開く
- [ ] `npm run build` でエラーが出ない
- [ ] `npm run type-check` でTypeScriptエラーを確認
- [ ] `.env.local` を設定（`.env.local.example` をコピー）

### Supabase
- [ ] Supabase SQL Editor で `sql/schema.sql` を実行
- [ ] テーブル 12個が作成されているか確認
- [ ] RLS が有効になっているか確認
- [ ] `gacha_rewards` と `economy_settings` に初期データが入っているか確認

### 動作確認
- [ ] YouTube URL を追加して字幕が取得できるか
- [ ] クイズが起動するか（`/api/quiz/generate` が動くか）
- [ ] BBC ニュースが読み込まれるか（`/api/news/bbc`）
- [ ] ガチャが動くか（コイン/チケット増加）
- [ ] 翻訳共有ができるか（`/api/social/translations`）
- [ ] ランキングが表示されるか（`/api/social/ranking`）
- [ ] ニックネームが設定できるか（`/api/social/profile`）

### Vercel デプロイ後
- [ ] 環境変数を Vercel Dashboard に設定
- [ ] デプロイが成功するか
- [ ] 本番URLで全機能が動くか

### 本番公開前（最終）
- [ ] アフィリエイトURL を `lib/affiliateConfig.ts` で実際のURLに変更
- [ ] Google OAuth を Supabase で有効化
- [ ] RLS ポリシーを本番用（auth.uid()ベース）に変更
- [ ] `public/icons/icon-*.svg` を PNG に変換
- [ ] PWA アイコンデザインを確定
