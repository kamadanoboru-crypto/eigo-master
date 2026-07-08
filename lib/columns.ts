export type ColumnCategoryKey =
  | 'toeic'
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'shadowing'
  | 'conversation'
  | 'study-method'
  | 'ai-learning'
  | 'review';

export type ColumnSection = {
  heading: string;
  body: string[];
};

export type ColumnFaq = {
  question: string;
  answer: string;
};

export type ColumnArticle = {
  slug: string;
  title: string;
  description: string;
  category: ColumnCategoryKey;
  publishedAt: string;
  updatedAt: string;
  lead: string;
  targetReader: string;
  firstStep: string;
  practice: string;
  caution: string;
  summary: string;
  faqs: ColumnFaq[];
  sections: ColumnSection[];
};

export const SITE_URL = 'https://eigobase.jp';

export const columnCategories: Record<ColumnCategoryKey, { label: string; description: string }> = {
  toeic: {
    label: 'TOEIC',
    description: 'TOEIC600点、730点、Part5、頻出単語など、スコアアップに必要な基礎と復習法を整理します。',
  },
  vocabulary: {
    label: '英単語',
    description: '覚えても忘れやすい英単語を、復習間隔、例文、使い直しで定着させる方法を扱います。',
  },
  grammar: {
    label: '英文法',
    description: '英文法を丸暗記で終わらせず、読む、聞く、解く場面で使える知識に変える学習法です。',
  },
  listening: {
    label: 'リスニング',
    description: '聞き取れない原因を分け、短い音声、ディクテーション、ニュース読解へつなげます。',
  },
  speaking: {
    label: 'スピーキング',
    description: '短い文を作る練習から、オンライン英会話や実際の会話へ進むための発話トレーニングです。',
  },
  shadowing: {
    label: 'シャドーイング',
    description: 'シャドーイングの始め方、素材選び、音読との違い、初心者が挫折しにくい手順を解説します。',
  },
  conversation: {
    label: '英会話',
    description: 'オンライン英会話の選び方、会話量の増やし方、レッスン後の復習まで整理します。',
  },
  'study-method': {
    label: '英語学習法',
    description: '初心者ロードマップ、習慣化、アプリ活用など、毎日続けるための学習設計を扱います。',
  },
  'ai-learning': {
    label: 'AI英語学習',
    description: 'AIを英文添削、会話練習、復習、学習相談に使うメリットと注意点をまとめます。',
  },
  review: {
    label: '教材レビュー',
    description: 'Cambly、スタディサプリENGLISHなどの特徴と、eigo baseとの自然な使い分けを紹介します。',
  },
};

type ColumnSpec = {
  slug: string;
  title: string;
  category: ColumnCategoryKey;
  keyword: string;
  targetReader: string;
  firstStep: string;
  practice: string;
  caution: string;
};

const specs: ColumnSpec[] = [
  { slug: 'english-beginner-roadmap', title: '英語初心者は何から始めるべき？毎日続く学習ロードマップ', category: 'study-method', keyword: '英語初心者 ロードマップ', targetReader: '英語をやり直したいけれど、単語、文法、リスニングの順番で迷っている人', firstStep: '中学レベルの基本単語と短い英文を毎日10分だけ確認する', practice: '単語10語、短文読解1つ、音声1つを固定メニューにして、できなかった内容を翌日に戻す', caution: '最初から教材を増やしすぎると、復習前に疲れてしまいます' },
  { slug: 'toeic-600-roadmap', title: 'TOEIC600点を目指す勉強法', category: 'toeic', keyword: 'TOEIC600 勉強法', targetReader: 'TOEICの最初の目標として600点を取りたい初級者', firstStep: '頻出単語とPart5の基本文法を毎日短く回す', practice: '単語、品詞問題、短いリスニングをセットにして、週末にミスだけ解き直す', caution: '模試だけを解き続けても、基礎の穴が残ると点数は安定しません' },
  { slug: 'toeic-730-roadmap', title: 'TOEIC730点を目指す勉強法', category: 'toeic', keyword: 'TOEIC730 勉強法', targetReader: '600点台から一段上のスコアを目指したい中級者', firstStep: '既に解ける問題を速く正確に処理する練習を始める', practice: 'Part5の時間管理、Part3とPart4の先読み、長文の根拠確認を週単位で分けて練習する', caution: '難問対策ばかりに寄せると、取れる問題の取りこぼしが増えます' },
  { slug: 'toeic-part5-study', title: 'TOEIC Part5の勉強法と間違えやすいポイント', category: 'toeic', keyword: 'TOEIC Part5 勉強法', targetReader: '文法問題で時間を使いすぎる人、品詞問題を感覚で選びがちな人', firstStep: '空所の前後を見て、必要な品詞と文の構造を判断する練習をする', practice: '1問ごとに正解理由と不正解選択肢の理由を短くメモする', caution: '全文和訳だけで解こうとすると、時間が足りなくなりやすいです' },
  { slug: 'vocabulary-how-to-remember', title: '英単語を忘れにくくする覚え方', category: 'vocabulary', keyword: '英単語 覚え方', targetReader: '単語帳を何周してもすぐ忘れてしまう人', firstStep: '一度で覚えようとせず、忘れる前提で短い復習間隔を作る', practice: '意味、例文、音声、自分で作った短文を組み合わせて、翌日と週末に見直す', caution: '新しい単語だけ増やすと、覚えたつもりの語が抜けていきます' },
  { slug: 'shadowing-basic', title: 'シャドーイングとは？初心者向けのやり方', category: 'shadowing', keyword: 'シャドーイング 初心者', targetReader: 'リスニングと発音を同時に伸ばしたいが、やり方が分からない人', firstStep: '短くて意味が分かる音声を選び、まず内容理解と音読から始める', practice: 'スクリプト確認、音読、オーバーラッピング、シャドーイングの順で段階を分ける', caution: '難しすぎる素材でいきなり追いかけると、音も意味も残りません' },
  { slug: 'listening-training', title: '英語リスニングが聞き取れない理由と練習法', category: 'listening', keyword: '英語 リスニング 聞き取れない', targetReader: '音声を何度聞いても内容が入ってこない人', firstStep: '聞き取れない原因を、単語不足、音の変化、意味処理の遅れに分ける', practice: '短い音声を聞き、スクリプトで原因を確認し、同じ音声を翌日もう一度聞く', caution: '聞き流しだけを増やしても、原因を確認しなければ改善しにくいです' },
  { slug: 'english-grammar-basic', title: '英文法をやり直すなら何から始めるべきか', category: 'grammar', keyword: '英文法 やり直し', targetReader: '文法書を読んでも英文を読むときに使えない人', firstStep: '品詞、文型、時制、助動詞、関係詞のような骨組みから戻る', practice: 'ルールを読んだら、短い例文とPart5形式の問題で使い方を確認する', caution: '例外や細かい用語から入ると、全体像が見えにくくなります' },
  { slug: 'ai-english-learning', title: 'AIを英語学習に使うメリットと注意点', category: 'ai-learning', keyword: 'AI 英語学習', targetReader: 'ChatGPTやAI英会話を英語学習に取り入れたい人', firstStep: 'AIに任せる範囲を、添削、例文作成、会話練習、復習相談に分ける', practice: '自分の英文を直してもらい、修正版から使える表現を3つだけ復習する', caution: 'AIの回答は便利ですが、常に正確とは限らないため確認が必要です' },
  { slug: 'youtube-english-study', title: 'YouTubeで英語学習するときの使い方', category: 'listening', keyword: 'YouTube 英語学習', targetReader: '動画を見ているのに英語力につながっている実感がない人', firstStep: '楽しむ動画と学習用動画を分け、学習用は短い範囲に絞る', practice: '字幕なしで聞く、英語字幕で確認する、知らない表現を保存する、もう一度聞く', caution: '動画を長時間見るだけでは、復習対象が残りにくいです' },
  { slug: 'cambly-review', title: 'Camblyの特徴と向いている人', category: 'review', keyword: 'Cambly 特徴', targetReader: 'ネイティブ講師との会話量を増やしたい人', firstStep: '自己紹介、仕事、趣味、最近の出来事など話す材料を準備する', practice: 'eigo baseやAIで表現を準備し、Camblyで実際に話し、言えなかった表現を復習する', caution: '会話を受けっぱなしにすると、次に使える表現が残りにくくなります' },
  { slug: 'studysapuri-english-review', title: 'スタディサプリENGLISHの特徴と向いている人', category: 'review', keyword: 'スタディサプリENGLISH 特徴', targetReader: 'スマホでTOEIC対策や日常英会話を体系的に進めたい人', firstStep: '講義、演習、復習の流れを1日の短いメニューに落とし込む', practice: 'スタディサプリENGLISHで講義と演習を進め、eigo baseで単語やミスの復習を補助する', caution: '動画を見るだけで終わると、理解した内容が定着しにくいです' },
  { slug: 'online-english-conversation', title: 'オンライン英会話の選び方', category: 'conversation', keyword: 'オンライン英会話 選び方', targetReader: 'どのオンライン英会話を選べばよいか迷っている人', firstStep: '料金だけでなく、講師、予約、教材、復習のしやすさを比べる', practice: '体験レッスンでは話しやすさ、訂正の丁寧さ、続けられる時間帯を確認する', caution: 'ランキングだけで決めると、自分の目的と合わない場合があります' },
  { slug: 'speaking-practice', title: '英語スピーキングを伸ばす練習法', category: 'speaking', keyword: '英語 スピーキング 練習', targetReader: '読めるのに話そうとすると言葉が出てこない人', firstStep: '長い英文ではなく、短い主語と動詞で言いたいことを作る', practice: '日本語で言いたい内容を一文に絞り、英語で短く言い換え、録音して見直す', caution: '難しい表現を覚える前に、短く正確に言う練習が必要です' },
  { slug: 'dictation-basic', title: 'ディクテーションとは？リスニング力を上げる練習法', category: 'listening', keyword: 'ディクテーション やり方', targetReader: '聞き取れない音を具体的に確認したい人', firstStep: '10秒から30秒程度の短い音声を選び、聞こえた範囲だけ書き取る', practice: '書き取り、スクリプト確認、音の変化のメモ、再リスニングを1セットにする', caution: '長すぎる素材を選ぶと、確認に時間がかかりすぎて続きません' },
  { slug: 'reading-news-english', title: '英語ニュースを読むメリットと始め方', category: 'study-method', keyword: '英語ニュース 読み方', targetReader: 'ニュースを英語学習に使いたいが難しく感じている人', firstStep: '短い記事や見出しから始め、全部訳そうとしない', practice: '見出し、リード文、知らない単語、要点メモの順に読む範囲を固定する', caution: '難しい国際記事から入ると、背景知識でつまずきやすいです' },
  { slug: 'english-habit', title: '英語学習を習慣化するコツ', category: 'study-method', keyword: '英語学習 習慣化', targetReader: '何度も英語学習を始めては止まってしまう人', firstStep: 'やる気ではなく、毎日同じタイミングで始める仕組みを作る', practice: '朝は単語、昼は文法、夜は音声のように、時間帯ごとに迷わないメニューを置く', caution: '最初から完璧な計画を作るほど、崩れたときに戻りにくくなります' },
  { slug: 'common-mistakes', title: '英語学習で挫折しやすい原因', category: 'study-method', keyword: '英語学習 挫折 原因', targetReader: '勉強しているのに続かない理由を整理したい人', firstStep: '教材、時間、目標、復習方法のどこで詰まっているかを分ける', practice: '1週間の学習を振り返り、できた日ではなく戻れなかった理由をメモする', caution: '自分の意志の弱さだけで片付けると、改善する場所が見えません' },
  { slug: 'toeic-vocabulary', title: 'TOEICによく出る単語の覚え方', category: 'toeic', keyword: 'TOEIC 単語 覚え方', targetReader: 'TOEIC頻出単語を効率よく定着させたい人', firstStep: 'ビジネス、旅行、日常、案内、会議など場面ごとに単語を見る', practice: '単語の意味だけでなく、TOEICで出やすい例文とセットで復習する', caution: '日本語訳だけを覚えると、設問や選択肢で迷いやすくなります' },
  { slug: 'english-app-how-to-use', title: '英語学習アプリを効果的に使う方法', category: 'study-method', keyword: '英語学習アプリ 使い方', targetReader: 'アプリを入れても学習が続かない人', firstStep: 'アプリを開く目的を、単語、文法、リスニング、復習のどれかに絞る', practice: '毎日同じメニューを短く回し、ミスした内容を翌日の最初に確認する', caution: '機能を全部使おうとすると、何を伸ばす時間なのか分からなくなります' },
];

function makeFaqs(spec: ColumnSpec): ColumnFaq[] {
  return [
    {
      question: `${spec.keyword}は初心者でも始められますか？`,
      answer: `始められます。最初は範囲を広げすぎず、${spec.firstStep}ことから始めると負担を抑えられます。`,
    },
    {
      question: '毎日どのくらい勉強すればよいですか？',
      answer: '最初は10分から20分でも十分です。短くても同じ流れで続け、間違えた内容を翌日に戻す方が定着しやすくなります。',
    },
    {
      question: 'eigo baseはどのように使えますか？',
      answer: 'eigo baseは、単語、Part5、動画リスニング、AI学習アドバイスを毎日の復習場所として使えます。専門教材や英会話サービスの補助にも向いています。',
    },
  ];
}

function makeSections(spec: ColumnSpec): ColumnSection[] {
  return [
    {
      heading: '結論',
      body: [
        `${spec.title}で大切なのは、最初から大きな成果を狙うのではなく、今日やる学習を小さく決めることです。${spec.targetReader}にとって、英語学習で一番つまずきやすいのは、能力不足よりも「次に何をするか」が曖昧な状態です。${spec.keyword}について調べている段階では、教材やサービスを増やす前に、毎日戻れる学習の型を作ることを優先しましょう。`,
        `eigo baseでは、英単語、TOEIC Part5、動画リスニング、ニュース読解、AI学習アドバイスを組み合わせ、短い時間でも学習を再開できる状態を重視しています。この記事では、${spec.firstStep}という入口から、復習、実践、見直しまでを一つの流れとして整理します。`,
      ],
    },
    {
      heading: '最初にやること',
      body: [
        `最初の一歩は、${spec.firstStep}ことです。英語学習は、単語、文法、リスニング、スピーキングを全部同時に完璧にしようとすると負担が大きくなります。まずは一つのメニューを短く固定し、できた日とできなかった日を見えるようにします。`,
        `たとえば平日は10分から20分で構いません。新しい内容を少しだけ入れ、最後に前日つまずいた内容を確認します。この「戻る」時間がないと、学習量を増やしても記憶が流れていきます。最初の目的は、英語力を一気に変えることではなく、英語に触れる場所を生活の中に置くことです。`,
      ],
    },
    {
      heading: '具体的な練習メニュー',
      body: [
        `おすすめは、${spec.practice}ことです。学習メニューは、短くても構造がある方が続きます。単語だけの日、動画だけの日、文法だけの日がばらばらに続くと、何が伸びているのか分かりにくくなります。`,
        'eigo baseを使う場合は、単語やPart5で基礎を確認し、動画リスニングで音に触れ、AI学習アドバイスでつまずいた理由を言語化する流れを作れます。紙の教材や他社サービスを使う場合も、役割を分けることが大切です。講義型教材は理解を深める場所、オンライン英会話は実際に話す場所、eigo baseは日々の復習と記録の場所として組み合わせると、学習が散らばりにくくなります。',
      ],
    },
    {
      heading: 'つまずきやすいポイント',
      body: [
        `注意したいのは、${spec.caution}という点です。英語学習では、熱心な人ほど教材を増やしたり、難しい素材に挑戦したりしがちです。しかし、基礎が定着する前に範囲を広げると、復習対象が増えすぎて続きにくくなります。`,
        '間違えた問題、聞き取れなかった音、言えなかった表現は、失敗ではなく次の学習材料です。大切なのは、なぜできなかったのかを一段だけ分けることです。単語を知らなかったのか、文法構造を見落としたのか、音の変化に慣れていなかったのかを確認すると、次にやるべき練習がはっきりします。',
      ],
    },
    {
      heading: '復習の作り方',
      body: [
        '復習は、学習した直後よりも翌日以降に効いてきます。覚えたつもりの単語、理解したつもりの文法、聞けたつもりの音声は、少し時間を置くと抜けていることがあります。だからこそ、復習は気合いではなく仕組みにしておく必要があります。',
        `具体的には、今日の学習で迷った内容を3つだけ残します。翌日の最初にその3つを見直し、まだ曖昧なら週末にも戻します。${spec.keyword}のようなテーマでは、毎日新しい知識を増やすよりも、同じ内容を別の形で使い直す方が定着しやすくなります。`,
      ],
    },
    {
      heading: 'サービスや教材との組み合わせ',
      body: [
        '英語学習では、一つのサービスだけですべてを完結させようとしなくても大丈夫です。TOEIC対策を体系的に進めたいなら講義型教材、会話量を増やしたいならオンライン英会話、日々の基礎練習や復習には学習アプリというように、役割を分けると選びやすくなります。',
        'Camblyはネイティブ講師との会話量を増やしたい人に向いています。スタディサプリENGLISHは、スマホで講義と演習を進めやすく、TOEIC対策や日常英会話の教材構成が分かりやすい点が強みです。eigo baseはそれらと競合するより、毎日の単語、文法、動画、AI復習を支える補助ツールとして使うと自然です。',
      ],
    },
    {
      heading: 'よくある質問',
      body: makeFaqs(spec).map((faq) => `Q. ${faq.question} A. ${faq.answer}`),
    },
    {
      heading: 'まとめ',
      body: [
        `${spec.title}の要点は、学習の範囲を絞り、短く続け、必ず復習に戻すことです。英語学習は、一度に長時間頑張るより、毎日戻れる流れを作る方が成果につながりやすくなります。`,
        `まずは${spec.firstStep}ことから始めましょう。そのうえで、${spec.practice}という形にすると、学習の目的がはっきりします。eigo baseは、英語に触れる入口と復習の場所として、あなたの毎日の学習を支えます。`,
      ],
    },
  ];
}

export const columnArticles: ColumnArticle[] = specs.map((spec) => ({
  ...spec,
  publishedAt: '2026-07-08',
  updatedAt: '2026-07-08',
  description: `${spec.targetReader}向けに、${spec.keyword}の始め方、練習メニュー、注意点、eigo baseとの使い分けを解説します。`,
  lead: `${spec.keyword}で迷っている人へ。この記事では、${spec.targetReader}が今日から始めやすいように、学習の順番、復習の作り方、教材やアプリの使い分けを整理します。`,
  summary: `${spec.keyword}では、無理に範囲を広げず、毎日戻れる短い学習メニューを作ることが重要です。`,
  faqs: makeFaqs(spec),
  sections: makeSections(spec),
}));

export function getColumnArticle(slug: string) {
  return columnArticles.find((article) => article.slug === slug);
}

export function getColumnPath(article: Pick<ColumnArticle, 'slug'>) {
  return `/columns/${article.slug}`;
}

export function getColumnUrl(article: Pick<ColumnArticle, 'slug'>) {
  return `${SITE_URL}${getColumnPath(article)}`;
}

export function getRelatedColumns(article: ColumnArticle, limit = 5) {
  const sameCategory = columnArticles.filter((item) => item.slug !== article.slug && item.category === article.category);
  const fallback = columnArticles.filter((item) => item.slug !== article.slug && item.category !== article.category);
  return [...sameCategory, ...fallback].slice(0, limit);
}

export function getColumnsByCategory(category: ColumnCategoryKey) {
  return columnArticles.filter((article) => article.category === category);
}
