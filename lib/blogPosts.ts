export type BlogCategoryKey =
  | 'toeic'
  | 'studysapuri'
  | 'cambly'
  | 'english-conversation'
  | 'ai-english'
  | 'youtube-english'
  | 'study-habit';

export type BlogSection = {
  heading: string;
  body: string[];
  points?: { heading: string; body: string[] }[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  lead: string;
  category: BlogCategoryKey;
  categories?: BlogCategoryKey[];
  targetKeyword: string;
  service: 'study_sapuri' | 'cambly' | null;
  sections: BlogSection[];
  faqs: BlogFaq[];
};

export const SITE_URL = 'https://eigobase.jp';

export const blogCategories: Record<BlogCategoryKey, { label: string; description: string }> = {
  toeic: {
    label: 'TOEIC学習',
    description: 'TOEIC初心者から600点、800点を目指す人向けの勉強法、単語、文法、リスニング対策をまとめています。',
  },
  studysapuri: {
    label: 'スタディサプリENGLISH',
    description: 'スタディサプリENGLISHの評判、TOEIC対策での使い方、料金の考え方、教材との組み合わせを解説します。',
  },
  cambly: {
    label: 'Cambly',
    description: 'Camblyの評判、料金の考え方、初心者向けの使い方、オンライン英会話比較を整理します。',
  },
  'english-conversation': {
    label: '英会話学習',
    description: '英会話、発話、シャドーイング、アウトプット学習を続けるための実践的な学習ガイドです。',
  },
  'ai-english': {
    label: 'AI英語学習',
    description: 'AI英会話、ChatGPT、AI英語学習アプリを英語学習にどう活用するかを解説します。',
  },
  'youtube-english': {
    label: 'YouTube英語学習',
    description: 'YouTube字幕、リスニング、シャドーイング、動画教材の選び方を紹介します。',
  },
  'study-habit': {
    label: '学習習慣',
    description: '忙しい社会人や初心者が英語学習を続けるための習慣化、復習、ロードマップを扱います。',
  },
};

type PostSpec = {
  slug: string;
  title: string;
  keyword: string;
  category: BlogCategoryKey;
  service?: 'study_sapuri' | 'cambly';
  angle: string;
  goodFor: string;
  caution: string;
};

const specs: PostSpec[] = [
  { slug: 'study-sapuri-english-reviews', title: 'スタディサプリENGLISHの口コミと評判を英語学習者目線で解説', keyword: 'スタディサプリ 口コミ', category: 'studysapuri', service: 'study_sapuri', angle: '口コミを見るときは、料金の安さだけでなく、講義、演習、復習導線が自分の生活に合うかを見ることが大切です。', goodFor: '独学でTOEIC対策の順番に迷いやすい人', caution: '自由な英会話練習を主目的にする人は、別のサービスも検討しましょう。' },
  { slug: 'study-sapuri-toeic-600', title: 'スタディサプリでTOEIC600点を目指す勉強法', keyword: 'スタディサプリ TOEIC', category: 'studysapuri', service: 'study_sapuri', angle: '600点を目指す段階では、頻出単語、Part5の基本文法、短いリスニングを毎日回すことが近道です。', goodFor: 'TOEIC初心者から最初の目標点を作りたい人', caution: '問題を解くだけで復習しない使い方では効果が薄くなります。' },
  { slug: 'study-sapuri-toeic-800', title: 'スタディサプリでTOEIC800点は可能か', keyword: 'スタディサプリ TOEIC 800', category: 'studysapuri', service: 'study_sapuri', angle: '800点には講義を聞くだけでなく、ミスの種類を分けて復習し、公式形式の演習へつなげる姿勢が必要です。', goodFor: '600点台から伸び悩みを感じている人', caution: '実戦量が不足すると時間配分の課題が残ります。' },
  { slug: 'study-sapuri-toeic-beginner', title: 'TOEIC初心者にスタディサプリはおすすめか', keyword: 'TOEIC 初心者 スタディサプリ', category: 'studysapuri', service: 'study_sapuri', angle: '初心者には、何から始めるかを迷わずに済む学習導線が大きな価値になります。', goodFor: '英語をやり直したい社会人や学生', caution: '中学英文法がほぼ抜けている場合は、基礎文法の復習も並行しましょう。' },
  { slug: 'study-sapuri-effective-use', title: 'スタディサプリENGLISHの効果的な使い方', keyword: 'スタディサプリ 効果的な使い方', category: 'studysapuri', service: 'study_sapuri', angle: '講義、演習、復習を分けて考えると、短時間でも学習が積み上がります。', goodFor: 'アプリを入れたものの続け方に迷っている人', caution: '視聴だけで満足せず、必ず手を動かす時間を作りましょう。' },
  { slug: 'study-sapuri-price-value', title: 'スタディサプリENGLISHの料金と価値をどう考えるか', keyword: 'スタディサプリ 料金', category: 'studysapuri', service: 'study_sapuri', angle: '料金は最新の公式情報を確認しつつ、講義、演習、継続のしやすさに対して納得できるかで判断しましょう。', goodFor: '有料教材に申し込むか迷っている人', caution: 'キャンペーンやプランは変わるため、申込前に公式サイトで確認が必要です。' },
  { slug: 'study-sapuri-working-adult', title: '社会人がスタディサプリでTOEIC学習を続ける方法', keyword: '社会人 TOEIC スタディサプリ', category: 'studysapuri', service: 'study_sapuri', angle: '社会人はまとまった時間より、朝、昼、夜の短い学習を固定する方が続きやすくなります。', goodFor: '仕事とTOEIC対策を両立したい人', caution: '休日だけの長時間学習に寄せすぎると習慣が崩れやすくなります。' },
  { slug: 'toeic-material-comparison', title: 'TOEICおすすめ教材を比較する選び方', keyword: 'TOEIC おすすめ教材', category: 'toeic', service: 'study_sapuri', angle: '教材は評判だけで選ばず、目的、レベル、復習しやすさで選ぶと失敗しにくくなります。', goodFor: '公式問題集、単語帳、アプリの使い分けに迷う人', caution: '教材を増やしすぎると復習が浅くなります。' },
  { slug: 'toeic-study-roadmap', title: 'TOEIC学習ロードマップ 初心者からスコアアップまで', keyword: 'TOEIC 勉強法', category: 'toeic', service: 'study_sapuri', angle: 'TOEICは単語、文法、リスニング、模試を段階的に積み上げると進めやすくなります。', goodFor: '最初の3か月の計画を作りたい人', caution: 'いきなり模試だけを解くと弱点が見えにくくなります。' },
  { slug: 'study-sapuri-gold-phrase', title: 'スタディサプリと金フレの組み合わせ方', keyword: 'スタディサプリ 金フレ', category: 'studysapuri', service: 'study_sapuri', angle: '単語帳で頻出語を固め、アプリで文法とリスニングを補うと役割が明確になります。', goodFor: '単語帳とアプリを併用したい人', caution: '単語暗記だけでスコア全体を上げようとしないことが大切です。' },
  { slug: 'cambly-reviews', title: 'Camblyの評判は本当か 英会話学習者目線で解説', keyword: 'Cambly 評判', category: 'cambly', service: 'cambly', angle: 'Camblyの価値は、ネイティブ講師と実際に話す時間を作れる点にあります。', goodFor: '英語を話す心理的ハードルを下げたい人', caution: '講師との会話だけで単語や文法の基礎が自然に埋まるわけではありません。' },
  { slug: 'cambly-price', title: 'Camblyの料金は高いのか 価値と判断基準を解説', keyword: 'Cambly 料金', category: 'cambly', service: 'cambly', angle: '料金は最新プランを公式サイトで確認し、会話量、講師の質、目的との一致で判断しましょう。', goodFor: 'オンライン英会話の費用対効果を考えたい人', caution: 'プランや割引は変わるため、記事だけで金額を決めないでください。' },
  { slug: 'cambly-for-beginners', title: 'Camblyは初心者向きか 始め方と注意点', keyword: 'Cambly 初心者', category: 'cambly', service: 'cambly', angle: '初心者でも使えますが、自己紹介や質問テンプレートを準備すると安心して始められます。', goodFor: '初めてネイティブ講師と話す人', caution: '完全なゼロから始める場合は、基礎表現の準備が必要です。' },
  { slug: 'cambly-nativecamp-comparison', title: 'Camblyとネイティブキャンプを比較するポイント', keyword: 'Cambly ネイティブキャンプ 比較', category: 'cambly', service: 'cambly', angle: '比較では料金だけでなく、講師タイプ、予約のしやすさ、学習目的を分けて見ることが重要です。', goodFor: 'オンライン英会話を比較検討している人', caution: 'サービス内容は変わるため、最終判断は公式情報で確認しましょう。' },
  { slug: 'cambly-dmm-comparison', title: 'CamblyとDMM英会話を比較するポイント', keyword: 'Cambly DMM英会話 比較', category: 'cambly', service: 'cambly', angle: 'ネイティブ講師との実践を重視するか、幅広い講師と話すかで選び方は変わります。', goodFor: '英会話サービスの違いを整理したい人', caution: '自分の予約可能な時間帯に講師がいるかも確認しましょう。' },
  { slug: 'cambly-toeic', title: 'CamblyでTOEIC対策は可能か', keyword: 'Cambly TOEIC', category: 'cambly', service: 'cambly', angle: 'CamblyはTOEICの点数対策そのものより、覚えた英語を話す実践に向いています。', goodFor: 'TOEIC学習後に会話へ広げたい人', caution: 'スコアアップが最優先ならTOEIC専用教材を軸にしましょう。' },
  { slug: 'cambly-speaking-improvement', title: 'Camblyで英会話力は伸びるか', keyword: 'Cambly 口コミ 英会話', category: 'cambly', service: 'cambly', angle: '英会話力は、話した内容を復習し、次の会話で使い直すことで伸びやすくなります。', goodFor: 'アウトプットの機会を増やしたい人', caution: '受けっぱなしにすると表現が定着しにくくなります。' },
  { slug: 'cambly-merit-demerit', title: 'Camblyのメリットとデメリット', keyword: 'Cambly メリット デメリット', category: 'cambly', service: 'cambly', angle: 'ネイティブ講師と話せる強みがある一方で、目的を決めないと雑談だけで終わることもあります。', goodFor: '申込前に冷静に判断したい人', caution: '初心者はレッスン前の準備を軽く済ませておきましょう。' },
  { slug: 'cambly-tutor-choice', title: 'Camblyおすすめ講師の選び方', keyword: 'Cambly 講師 選び方', category: 'cambly', service: 'cambly', angle: '講師選びでは、目的、話しやすさ、フィードバックの丁寧さを見ると学習が続きやすくなります。', goodFor: '自分に合う講師を探したい人', caution: '人気だけで選ぶより相性を重視しましょう。' },
  { slug: 'cambly-trial-review', title: 'Cambly体験レビューで見るべきポイント', keyword: 'Cambly 体験', category: 'cambly', service: 'cambly', angle: '体験時は、話しやすさ、修正の受けやすさ、継続できる時間帯を確認しましょう。', goodFor: '無料体験や初回レッスンを有効に使いたい人', caution: '一度の体験だけで英会話力は判断できません。' },
  { slug: 'toeic-300-to-600', title: 'TOEIC300点から600点への勉強法', keyword: 'TOEIC 300点 600点 勉強法', category: 'toeic', service: 'study_sapuri', angle: '300点台では、難問対策より頻出単語と基本文法を先に固める方が効果的です。', goodFor: '基礎からTOEICをやり直したい人', caution: '最初から長文ばかり解くと挫折しやすくなります。' },
  { slug: 'toeic-600-to-800', title: 'TOEIC600点から800点への勉強法', keyword: 'TOEIC 600点 800点 勉強法', category: 'toeic', service: 'study_sapuri', angle: '600点以降は、正解できる問題の質を上げ、時間内に処理する練習が必要です。', goodFor: '中級者から上を目指したい人', caution: '基礎の復習を止めると伸びが不安定になります。' },
  { slug: 'toeic-beginner-guide', title: 'TOEIC初心者完全ガイド', keyword: 'TOEIC 初心者', category: 'toeic', service: 'study_sapuri', angle: '初心者は目標点、教材、学習時間を小さく決めると始めやすくなります。', goodFor: 'TOEICを初めて受ける人', caution: '試験形式を知らないまま勉強を始めると遠回りになります。' },
  { slug: 'toeic-listening', title: 'TOEICリスニング対策の始め方', keyword: 'TOEIC リスニング 対策', category: 'toeic', service: 'study_sapuri', angle: 'リスニングは音量より、短い音声を聞き直して原因を分けることが大切です。', goodFor: 'Part1からPart4で聞き逃しが多い人', caution: '聞き流しだけに頼ると弱点が残ります。' },
  { slug: 'toeic-part5-strategy', title: 'TOEIC Part5攻略 品詞と文法の見方', keyword: 'TOEIC Part5', category: 'toeic', service: 'study_sapuri', angle: 'Part5は全文和訳より、空所の前後から必要な品詞や形を判断する練習が有効です。', goodFor: '文法問題で時間を使いすぎる人', caution: '意味だけで選ぶ癖があるとひっかけに弱くなります。' },
  { slug: 'toeic-vocabulary', title: 'TOEIC単語学習法 頻出語を定着させるコツ', keyword: 'TOEIC 単語', category: 'toeic', service: 'study_sapuri', angle: '単語は一度で覚えるより、短い間隔で何度も見直す方が定着しやすくなります。', goodFor: '単語帳が続かない人', caution: '日本語訳だけでなく例文も確認しましょう。' },
  { slug: 'toeic-best-books', title: 'TOEICおすすめ教材の選び方', keyword: 'TOEIC 教材 おすすめ', category: 'toeic', service: 'study_sapuri', angle: '教材は、単語、文法、模試、講義型アプリの役割を分けて選びましょう。', goodFor: '最初の教材選びで迷っている人', caution: '評判のよい教材でもレベルが合わなければ続きません。' },
  { slug: 'toeic-working-adult', title: '社会人のTOEIC勉強法', keyword: '社会人 TOEIC 勉強法', category: 'toeic', service: 'study_sapuri', angle: '社会人は学習時間を増やすより、毎日戻れる固定メニューを持つことが重要です。', goodFor: '仕事後に勉強する余力が少ない人', caution: '完璧な計画より再開しやすい計画を優先しましょう。' },
  { slug: 'ai-english-learning-era', title: 'AIで英語学習する時代に大切なこと', keyword: 'AI英語学習', category: 'ai-english', angle: 'AIは英語学習の入口を広げますが、判断力と復習の設計は学習者側に残ります。', goodFor: 'AIを英語学習に取り入れたい人', caution: 'AIの回答は必ず学習補助として扱いましょう。' },
  { slug: 'chatgpt-english-learning', title: 'ChatGPTで英語学習する方法', keyword: 'ChatGPT 英語学習', category: 'ai-english', angle: 'ChatGPTは英文添削、例文作成、会話練習に使えますが、目的を絞るほど効果が出やすくなります。', goodFor: '無料でも英語練習の量を増やしたい人', caution: '試験対策では公式教材との併用が必要です。' },
  { slug: 'ai-conversation-merits', title: 'AI英会話のメリットと注意点', keyword: 'AI英会話', category: 'ai-english', service: 'cambly', angle: 'AI英会話は緊張せずに試せる反面、人との会話で鍛えられる即興性は別に練習が必要です。', goodFor: '発話練習を始めたい初心者', caution: 'AIだけで実践経験を代替できるとは考えない方が安全です。' },
  { slug: 'ai-english-app-comparison', title: 'AI英語学習アプリ比較の見方', keyword: '英語学習アプリ AI', category: 'ai-english', angle: 'アプリ比較では、AI機能の派手さより、復習、履歴、毎日の使いやすさを見ましょう。', goodFor: '英語学習アプリを選びたい人', caution: '機能が多すぎると学習目的がぼやけることがあります。' },
  { slug: 'what-is-eigo-base', title: 'eigo baseとは 毎日の英語学習を支える使い方', keyword: 'eigo base', category: 'ai-english', angle: 'eigo baseは、AI英語学習、単語、文法、YouTube字幕学習を日々の練習に戻すためのベースです。', goodFor: '英語学習を習慣化したい人', caution: '専門教材や講師サービスと役割を分けるとより使いやすくなります。' },
  { slug: 'youtube-english-learning-method', title: 'YouTubeで英語学習する方法', keyword: 'YouTube 英語学習', category: 'youtube-english', angle: 'YouTubeは便利ですが、見て終わりにせず、字幕確認と復習に戻すことで教材になります。', goodFor: '動画で楽しく英語に触れたい人', caution: '難しすぎる動画を選ぶと継続しにくくなります。' },
  { slug: 'youtube-listening-study', title: 'YouTube字幕でリスニングを伸ばす勉強法', keyword: 'YouTube リスニング 英語', category: 'youtube-english', angle: '字幕は答え合わせに使い、最初から頼りすぎないことがリスニング改善のコツです。', goodFor: '字幕つき動画で英語を学びたい人', caution: '日本語字幕だけで理解した気になるのは避けましょう。' },
  { slug: 'shadowing-beginner', title: 'シャドーイング初心者のやさしい始め方', keyword: 'シャドーイング 初心者', category: 'english-conversation', service: 'cambly', angle: 'シャドーイングは短い素材を選び、意味を理解してから声に出すと続けやすくなります。', goodFor: '発音とリスニングを同時に練習したい人', caution: '長い素材で完璧を目指すと負担が大きくなります。' },
  { slug: 'english-conversation-beginner', title: '英会話初心者が最初に練習すべきこと', keyword: '英会話 初心者', category: 'english-conversation', service: 'cambly', angle: '初心者は自己紹介、質問、聞き返しの型から始めると、会話の不安が減ります。', goodFor: '英語を話すのが怖い人', caution: '難しい表現より短く正確な表現を優先しましょう。' },
  { slug: 'online-english-recommend', title: 'オンライン英会話おすすめの選び方', keyword: 'オンライン英会話 おすすめ', category: 'english-conversation', service: 'cambly', angle: 'おすすめは人によって違うため、講師、予約、料金、目的の4点で比べるのが現実的です。', goodFor: 'オンライン英会話を始めたい人', caution: 'ランキングだけで決めず、体験で相性を確認しましょう。' },
  { slug: 'speaking-output-training', title: '英語アウトプット学習の始め方', keyword: '英語 アウトプット', category: 'english-conversation', service: 'cambly', angle: 'アウトプットは、覚えた単語や文法を短い文で使うところから始めると定着しやすくなります。', goodFor: '読めるのに話せない人', caution: '話す練習だけで語彙不足は自然に解決しません。' },
  { slug: 'study-habit-english', title: '英語学習を習慣化するコツ', keyword: '英語学習 習慣化', category: 'study-habit', angle: '習慣化には、やる気よりも開始しやすい場所と短いメニューが効きます。', goodFor: '何度も英語学習を挫折した人', caution: '最初から大きな目標を詰め込みすぎないようにしましょう。' },
  { slug: 'english-app-study-plan', title: '英語学習アプリを使った勉強計画の作り方', keyword: '英語学習アプリ', category: 'study-habit', angle: 'アプリは毎日の入口として使い、週末に弱点を整理すると学習が散らばりにくくなります。', goodFor: 'スマホで英語を学びたい人', caution: 'アプリを開くこと自体を目的にしないことが大切です。' },
  { slug: 'vocabulary-memorization', title: '英単語暗記を続けるための復習法', keyword: '英単語 暗記', category: 'study-habit', angle: '英単語は忘れる前提で、短い復習サイクルを作る方が現実的です。', goodFor: '単語を覚えてもすぐ忘れる人', caution: '新しい単語ばかり増やすと定着率が下がります。' },
  { slug: 'adult-english-restart', title: '社会人のやり直し英語 最初の1か月', keyword: '社会人 英語 やり直し', category: 'study-habit', angle: 'やり直し英語では、単語、文法、音声を小さく再開し、成功体験を作ることが大切です。', goodFor: '久しぶりに英語を学ぶ社会人', caution: '学生時代の参考書を最初から完璧にやり直す必要はありません。' },
  { slug: 'short-time-english-study', title: 'スキマ時間でできる英語学習メニュー', keyword: '英語学習 スキマ時間', category: 'study-habit', angle: '5分なら単語、10分なら文法、15分なら音声というように時間別メニューを決めると続きます。', goodFor: 'まとまった勉強時間が取れない人', caution: '短時間学習でも復習の記録は残しましょう。' },
  { slug: 'listening-problem-solution', title: '英語リスニングが聞き取れない理由と改善方法', keyword: '英語 リスニング 聞き取れない', category: 'youtube-english', angle: '聞き取れない原因は、単語不足、音の変化、意味処理の遅れに分けて考えると改善しやすくなります。', goodFor: '音声学習に苦手意識がある人', caution: '聞く量だけを増やしても原因が残る場合があります。' },
  { slug: 'grammar-learning-method', title: '英文法を丸暗記で終わらせない学び方', keyword: '英文法 勉強法', category: 'toeic', service: 'study_sapuri', angle: '英文法はルールを読むだけでなく、問題と例文で使い方を確認すると定着します。', goodFor: '文法書を読んでも使えない人', caution: '例外ばかり先に覚えると基本が崩れます。' },
  { slug: 'toeic-common-mistakes', title: 'TOEIC学習でよくある失敗と対策', keyword: 'TOEIC 勉強法 失敗', category: 'toeic', service: 'study_sapuri', angle: 'よくある失敗は、教材を増やしすぎる、復習しない、模試だけに偏ることです。', goodFor: '勉強しているのに伸びない人', caution: '失敗を責めるより学習設計を直しましょう。' },
  { slug: 'english-learning-ai-era', title: 'AI時代の英語学習はどう変わるか', keyword: 'AI 英語学習', category: 'ai-english', angle: 'AIで練習量は増やせますが、英語を読む、聞く、話す基礎体力は今後も重要です。', goodFor: 'これからの英語学習を考えたい人', caution: 'AI任せにせず、自分の目的に合わせて使い分けましょう。' },
  { slug: 'study-sapuri-review-for-toeic', title: 'スタディサプリENGLISHはTOEIC対策に向いているか', keyword: 'スタディサプリ 評判 TOEIC', category: 'studysapuri', service: 'study_sapuri', angle: 'TOEIC対策では、講義と演習がまとまっていることが学習の迷いを減らします。', goodFor: '独学の限界を感じている人', caution: 'アプリだけでなく本番形式の確認も取り入れましょう。' },
  { slug: 'cambly-business-english', title: 'Camblyは海外赴任準備に使えるか', keyword: 'Cambly 海外赴任', category: 'cambly', service: 'cambly', angle: '海外赴任前は、自己紹介、会議、依頼、確認の英語を実際に口に出す練習が役立ちます。', goodFor: '仕事で英語を使う予定がある人', caution: '業界専門語は別途準備してレッスンに持ち込みましょう。' },
  { slug: 'ai-to-human-conversation', title: 'AI英会話からオンライン英会話へ進むタイミング', keyword: 'AI英会話 オンライン英会話', category: 'ai-english', service: 'cambly', angle: 'AIで型を作り、人との会話で緊張感と即興性を鍛える流れが自然です。', goodFor: 'AI練習の次のステップを探している人', caution: '準備ゼロで実践に進むより、短い表現を用意しておくと安心です。' },
  { slug: 'toeic-and-speaking-balance', title: 'TOEIC対策と英会話学習をどう両立するか', keyword: 'TOEIC 英会話 両立', category: 'english-conversation', service: 'cambly', angle: 'TOEICで基礎を固め、英会話で使う練習を加えると、知識と実践がつながります。', goodFor: 'スコアも会話力も伸ばしたい人', caution: '同時に詰め込みすぎず、週ごとの比率を決めましょう。' },
];

const sectionNames = ['結論', 'メリット', 'デメリット', '向いている人', '向いていない人', '実際の活用方法', 'よくある質問', 'まとめ'];

function serviceMessage(spec: PostSpec) {
  if (spec.service === 'study_sapuri') {
    return 'スタディサプリENGLISHは、TOEIC対策や講義型学習を体系的に進めたい人にとって心強い選択肢です。eigo baseで毎日の単語、文法、動画学習を回し、スタディサプリENGLISHでスコアアップに直結する講義と演習を進めると、基礎反復と本格対策の役割を分けられます。';
  }
  if (spec.service === 'cambly') {
    return 'Camblyは、ネイティブ講師と話す実践の場として価値があります。eigo baseやAI英会話で表現を準備し、Camblyで実際に口に出し、言えなかった表現を復習に戻すと、知識が会話の中で使える形に変わっていきます。';
  }
  return 'eigo baseは、英語学習の入口を毎日作るためのサービスです。単語、文法、AI英会話、YouTube字幕学習を短く回し、必要に応じて専門教材や講師サービスにつなげることで、学習が一回きりで終わりにくくなります。';
}

function operatorView(spec: PostSpec) {
  if (spec.service === 'study_sapuri') {
    return 'AI英語学習アプリを作っている立場から見ると、スタディサプリENGLISHの強みは、TOEIC学習の順番が分かりやすいことです。eigo baseでは単語、文法、AI会話、YouTube学習を日々の補助として使えますが、TOEICの講義と演習をまとまった導線で進めたい場面では、スタディサプリENGLISHを組み合わせる価値があります。';
  }
  if (spec.service === 'cambly') {
    return 'AI英語学習アプリを作っている立場から見ると、Camblyの強みは、準備した英語を人との会話で試せることです。eigo baseやAI英会話で表現を準備し、Camblyでネイティブ講師に伝えてみる流れは、アウトプット学習として自然です。';
  }
  return 'eigo base運営者の視点では、AIは英語学習を楽にする魔法ではなく、復習と練習量を増やす補助だと考えています。単語、文法、AI会話、YouTube学習を小さく回し、必要に応じてTOEIC教材やオンライン英会話へ進む形が現実的です。';
}

function makeSections(spec: PostSpec): BlogSection[] {
  return [
    {
      heading: sectionNames[0],
      body: [
        `${spec.keyword}で調べている人に最初に伝えたいのは、目的をはっきりさせてから学習手段を選ぶことです。${spec.angle} 英語学習では、評判のよい教材やサービスを選ぶだけでは十分ではありません。自分の現在地、使える時間、伸ばしたい技能を整理し、毎日戻れる学習導線を作ることが成果につながります。`,
        operatorView(spec),
        serviceMessage(spec),
      ],
    },
    {
      heading: sectionNames[1],
      body: [
        `大きなメリットは、学習の迷いを減らせることです。${spec.goodFor}にとって、次に何をすればよいかが見えるだけでも継続しやすくなります。単語、文法、リスニング、発話のどこに時間を使うかを決めておけば、忙しい日でも短い練習を積み上げられます。`,
        'また、学習内容を記録しやすい形にしておくと、復習の質が上がります。正解した問題よりも、迷った問題、聞き取れなかった音、言えなかった表現を残すことが大切です。eigo baseでは、日々の学習を小さく始め、復習に戻しやすい形を重視しています。',
      ],
      points: [
        { heading: '学習ポイント', body: ['今日は単語、明日は文法というように行き当たりばったりで進めるより、目的別にメニューを固定した方が続きます。まずは「毎日戻る場所」を作り、復習対象を残すことを優先しましょう。'] },
        { heading: '復習すべき内容が見える', body: ['苦手な単語や文法、聞き取れない表現を残すと、次回の学習で迷わず戻れます。'] },
      ],
    },
    {
      heading: sectionNames[2],
      body: [
        `注意点は、使い方を決めないまま始めると効果が見えにくいことです。${spec.caution} どの教材やサービスも、登録しただけで英語力が伸びるわけではありません。学習、演習、復習、実践の流れを自分の生活に合わせて作る必要があります。`,
        '特に料金やプラン、キャンペーン、提供内容は変わることがあります。申し込み前には必ず公式サイトで最新情報を確認してください。この記事では、英語学習者が判断しやすいように、学習目的と活用方法を中心に整理しています。',
      ],
    },
    {
      heading: sectionNames[3],
      body: [
        `向いているのは、${spec.goodFor}です。英語学習を続けるには、今の自分に必要な練習を小さく選び、無理なく繰り返すことが欠かせません。TOEICなら頻出単語とPart5、英会話なら短い自己紹介や質問、リスニングなら短い音声の聞き直しから始めると取り組みやすくなります。`,
        'また、独学で迷いやすい人にも向いています。学習の順番が決まると、やる気に頼らなくても再開しやすくなります。eigo baseを毎日のベースにし、必要なタイミングでスタディサプリENGLISHやCamblyのような専門サービスを使うと、学習目的ごとの役割が分かりやすくなります。',
      ],
    },
    {
      heading: sectionNames[4],
      body: [
        '向いていないのは、短期間で魔法のような成果を期待している人です。英語力は、単語、文法、音声、発話の経験が積み重なって伸びます。数日だけ集中して終わるより、短い時間でも何度も戻る学習の方が現実的です。',
        'また、目的を決めずに複数サービスを同時に使う人も注意が必要です。教材が増えるほど勉強している感覚は出ますが、復習が浅くなることがあります。まずはひとつの軸を決め、足りない部分だけを補う形にしましょう。',
      ],
    },
    {
      heading: sectionNames[5],
      body: [
        `実際には、1日の学習を短く分けるのがおすすめです。朝に単語を5分、昼にPart5や短い英文を10分、夜にリスニングや英会話を15分という形にすると、忙しい日でも英語に触れる回数を作れます。${spec.keyword}に関心がある人も、最初から完璧な計画を作るより、今日できる最小メニューを決める方が続きます。`,
        '週末には、間違えた内容を見直します。なぜ間違えたのかを、単語不足、文法判断、音声認識、時間配分、発話不足に分けて考えると、次にやるべき練習が明確になります。eigo baseで基礎を回し、TOEIC対策はスタディサプリENGLISH、実践英会話はCamblyへつなげる流れも自然です。',
      ],
      points: [
        {
          heading: '具体例',
          body: [
            `たとえば${spec.goodFor}なら、最初の1週間は新しい教材を増やさず、単語10問、文法1問、短い音声1つに絞ります。2週目から、間違えた内容だけを復習リストに戻し、必要に応じて専門教材や英会話レッスンを追加すると、学習が散らばりにくくなります。`,
          ],
        },
      ],
    },
    {
      heading: sectionNames[6],
      body: [
        `Q. ${spec.keyword}は初心者にも使えますか。A. 使えます。ただし、初心者ほど学習範囲を広げすぎず、単語、基本文法、短い音声、短い発話から始めるのがおすすめです。`,
        'Q. どのくらいで効果が出ますか。A. 学習時間、現在の英語力、復習量によって変わります。目安としては、まず2週間から1か月、同じメニューを続けて、できることが増えたかを確認しましょう。',
        'Q. eigo baseだけで十分ですか。A. 毎日の学習ベースとして役立ちますが、TOEICの本格対策やネイティブ講師との実践が必要な場合は、専門サービスを組み合わせると学習の幅が広がります。',
      ],
    },
    {
      heading: sectionNames[7],
      body: [
        `${spec.title}について考えるときは、評判や料金だけでなく、自分の目的に合った学習導線を作れるかを見ましょう。英語学習は、読む、聞く、覚える、話すを一度に完璧にする必要はありません。今日やることを小さく決め、復習に戻し、必要に応じて専門サービスへ進むことが大切です。`,
        'eigo baseは、毎日の英語学習を支えるベースとして、単語、文法、AI、YouTube学習をつなげます。TOEICスコアアップを目指すならスタディサプリENGLISH、英語を実際に使う練習へ進むならCamblyというように、目的に合わせて無理なく組み合わせていきましょう。',
      ],
    },
  ];
}

function makeFaqs(spec: PostSpec): BlogFaq[] {
  return [
    { question: `${spec.keyword}は初心者にも向いていますか？`, answer: `初心者にも向いています。ただし、最初は範囲を広げすぎず、${spec.goodFor}に必要な基礎練習から始めるのがおすすめです。` },
    { question: 'eigo baseとはどう使い分ければよいですか？', answer: 'eigo baseは毎日の単語、文法、AI英会話、YouTube学習のベースとして使い、TOEIC対策や実践英会話が必要な場面で専門サービスを組み合わせると自然です。' },
    { question: '料金やプランはこの記事だけで判断できますか？', answer: '料金、プラン、キャンペーンは変わる場合があります。申し込み前には必ず公式サイトの最新情報を確認してください。' },
  ];
}

export const blogPosts: BlogPost[] = specs.map((spec) => ({
  slug: spec.slug,
  title: spec.title,
  description: `${spec.goodFor}向けに、${spec.keyword}の活用法、eigo baseとの使い分け、注意点を英語学習者目線で解説します。`,
  lead: `${spec.keyword}で迷っている人向けに、eigo base運営の視点から学習目的、使い方、注意点を整理します。広告のためではなく、英語学習を続けるための判断材料として読める内容を目指します。`,
  category: spec.category,
  categories: [spec.category],
  targetKeyword: spec.keyword,
  service: spec.service ?? null,
  sections: makeSections(spec),
  faqs: makeFaqs(spec),
}));

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostByPath(parts: string[]) {
  if (parts.length !== 2) return undefined;
  const [category, slug] = parts;
  return blogPosts.find((post) => post.category === category && post.slug === slug);
}

export function getBlogPath(post: BlogPost) {
  return `/blog/${post.category}/${post.slug}`;
}

export function getBlogUrl(post: BlogPost) {
  return `${SITE_URL}${getBlogPath(post)}`;
}

export function getBlogCategoryPath(category: BlogCategoryKey) {
  return `/blog/${category}`;
}

export function getBlogCategories(post: BlogPost) {
  return post.categories?.length ? post.categories : [post.category];
}

export function getPostsByCategory(category: BlogCategoryKey) {
  return blogPosts.filter((post) => getBlogCategories(post).includes(category));
}

export function getRelatedPosts(post: BlogPost, limit = 5) {
  const sameCategory = blogPosts.filter((item) => item.slug !== post.slug && item.category === post.category);
  const fallback = blogPosts.filter((item) => item.slug !== post.slug && item.category !== post.category);
  return [...sameCategory, ...fallback].slice(0, limit);
}


