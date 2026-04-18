"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Slide = {
  title: string;
  subtitle?: string;
  emoji: string;
  body: ReactNode;
};

const slides: Slide[] = [
  {
    title: "GitHubのしくみ",
    subtitle: "はじめての人のための、やさしい説明書",
    emoji: "🐙",
    body: (
      <div className="space-y-4 text-lg text-slate-600">
        <p>プログラムを書く人たちが、世界中で使っている道具「GitHub（ギットハブ）」。</p>
        <p>このスライドでは、GitHubのしくみを身近なたとえ話で説明します。</p>
        <p className="text-sm text-slate-400 pt-4">← → キーでページをめくれます</p>
      </div>
    ),
  },
  {
    title: "GitHubって何？",
    emoji: "💡",
    body: (
      <div className="space-y-4 text-lg text-slate-700">
        <p>ひとことで言うと…</p>
        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded">
          <p className="font-bold text-indigo-900">
            プログラムを「みんなで」「安全に」「記録しながら」書ける場所
          </p>
        </div>
        <p>Google ドキュメントの、プログラム版のようなものです。</p>
      </div>
    ),
  },
  {
    title: "たとえばこんな時に便利",
    emoji: "🤝",
    body: (
      <div className="grid md:grid-cols-3 gap-4">
        <Card icon="📚">
          <strong>記録</strong>
          <p className="text-sm mt-1">いつ、誰が、どこを変えたかを全部残せる</p>
        </Card>
        <Card icon="↩️">
          <strong>やり直し</strong>
          <p className="text-sm mt-1">前の状態にいつでも戻せる</p>
        </Card>
        <Card icon="👥">
          <strong>共同作業</strong>
          <p className="text-sm mt-1">遠くにいる人と一緒に作業できる</p>
        </Card>
      </div>
    ),
  },
  {
    title: "GitとGitHubはちがうの？",
    emoji: "🔍",
    body: (
      <div className="space-y-4 text-slate-700">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-2xl mb-2">📦 Git</p>
            <p className="font-semibold">変更を記録するしくみ</p>
            <p className="text-sm text-slate-500 mt-2">自分のパソコンの中で動く</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-2xl mb-2">🌐 GitHub</p>
            <p className="font-semibold">Gitをネットで共有する場所</p>
            <p className="text-sm text-slate-500 mt-2">インターネットの向こうにある倉庫</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 text-center pt-2">
          Git＝道具、GitHub＝みんなで使う場所、という関係です。
        </p>
      </div>
    ),
  },
  {
    title: "リポジトリ（Repository）",
    subtitle: "作品を入れる「箱」",
    emoji: "📁",
    body: (
      <div className="space-y-4 text-slate-700 text-lg">
        <p>プロジェクトごとに1つ用意する、ファイル置き場のことです。</p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="font-semibold mb-2">📁 my-website（リポジトリの例）</p>
          <ul className="text-sm space-y-1 text-slate-600 ml-4">
            <li>├── index.html</li>
            <li>├── style.css</li>
            <li>└── README.md</li>
          </ul>
        </div>
        <p className="text-sm text-slate-500">
          略して「リポ」や「repo（レポ）」とも呼ばれます。
        </p>
      </div>
    ),
  },
  {
    title: "コミット（Commit）",
    subtitle: "ゲームのセーブポイント",
    emoji: "💾",
    body: (
      <div className="space-y-4 text-slate-700 text-lg">
        <p>「ここまでの変更を記録する」操作です。</p>
        <div className="flex items-center gap-2 justify-center flex-wrap">
          <Dot label="最初" />
          <Arrow />
          <Dot label="タイトル追加" color="bg-indigo-400" />
          <Arrow />
          <Dot label="色を変更" color="bg-indigo-500" />
          <Arrow />
          <Dot label="画像追加" color="bg-indigo-600" />
        </div>
        <p className="text-sm text-slate-500 text-center pt-2">
          コミットごとにメッセージをつけるので、あとから見ても「何をしたか」がわかります。
        </p>
      </div>
    ),
  },
  {
    title: "ブランチ（Branch）",
    subtitle: "作業用のコピー",
    emoji: "🌿",
    body: (
      <div className="space-y-4 text-slate-700 text-lg">
        <p>本番をこわさずに、新しいことを試すための「分かれ道」です。</p>
        <div className="bg-white border border-slate-200 rounded-xl p-5 font-mono text-sm">
          <p className="text-slate-500">main（本番）</p>
          <p className="text-green-600">●━━━●━━━●━━━━━━━━●</p>
          <p className="text-slate-400 ml-8">↘</p>
          <p className="text-blue-600 ml-8">●━━━● new-feature（試す用）</p>
        </div>
        <p className="text-sm text-slate-500">
          うまくいけば本番に合流、ダメなら消すだけ。安心して実験できます。
        </p>
      </div>
    ),
  },
  {
    title: "プッシュ & プル",
    subtitle: "アップロードとダウンロード",
    emoji: "🔄",
    body: (
      <div className="grid md:grid-cols-2 gap-4 text-slate-700">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-3xl mb-2">⬆️</p>
          <p className="font-bold text-blue-900">Push（プッシュ）</p>
          <p className="text-sm mt-2">自分のパソコンの記録を GitHub に<strong>アップロード</strong></p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-3xl mb-2">⬇️</p>
          <p className="font-bold text-green-900">Pull（プル）</p>
          <p className="text-sm mt-2">GitHub の最新の記録を自分のパソコンに<strong>ダウンロード</strong></p>
        </div>
      </div>
    ),
  },
  {
    title: "プルリクエスト（Pull Request）",
    subtitle: "「合流させてください！」のお願い",
    emoji: "📨",
    body: (
      <div className="space-y-4 text-slate-700 text-lg">
        <p>作ったブランチを本番に取り込むときの「申請」です。略して「PR」。</p>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 space-y-2">
          <p className="font-semibold">📨 プルリクエストでできること</p>
          <ul className="text-sm space-y-1 ml-4 list-disc text-slate-600">
            <li>他の人に変更内容を見てもらう（レビュー）</li>
            <li>「ここはこうしたら？」とコメントをもらう</li>
            <li>OKが出てから本番にマージする</li>
          </ul>
        </div>
        <p className="text-sm text-slate-500">
          いきなり本番を変えるのではなく、一度みんなで確認するしくみです。
        </p>
      </div>
    ),
  },
  {
    title: "マージ（Merge）",
    subtitle: "ブランチを合流させる",
    emoji: "🔗",
    body: (
      <div className="space-y-4 text-slate-700 text-lg">
        <p>プルリクエストが承認されたら、ブランチを本番に<strong>合流</strong>させます。</p>
        <div className="bg-white border border-slate-200 rounded-xl p-5 font-mono text-sm">
          <p className="text-green-600">main ●━━●━━●━━━━━━━●━━━●</p>
          <p className="text-slate-400 ml-10">↘━━━━↗ マージ！</p>
          <p className="text-blue-600 ml-10">●━━●</p>
        </div>
        <p className="text-sm text-slate-500">
          これで新しい機能が本番に追加されました。
        </p>
      </div>
    ),
  },
  {
    title: "イシュー（Issue）",
    subtitle: "やることリスト・ご意見箱",
    emoji: "📝",
    body: (
      <div className="space-y-4 text-slate-700 text-lg">
        <p>「こんなバグがあった」「こんな機能がほしい」を書いて残せる場所です。</p>
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-600">●</span>
            <span className="font-semibold">#12 ボタンの色が見えにくい</span>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">bug</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">●</span>
            <span className="font-semibold">#13 ダークモードがほしい</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">feature</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">●</span>
            <span className="text-slate-500">#11 ログインできない（解決済み）</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "基本の流れ",
    subtitle: "GitHubでの作業はこの順番",
    emoji: "🛤️",
    body: (
      <div className="space-y-3 text-slate-700">
        <Step n={1} title="ブランチを作る" desc="本番をこわさない作業場所を用意" />
        <Step n={2} title="変更してコミット" desc="少しずつ作業を記録していく" />
        <Step n={3} title="プッシュ" desc="GitHubにアップロード" />
        <Step n={4} title="プルリクエスト" desc="「合流させてください」と申請" />
        <Step n={5} title="レビュー＆マージ" desc="確認してもらってから本番に合流" />
      </div>
    ),
  },
  {
    title: "まとめ",
    emoji: "🎉",
    body: (
      <div className="space-y-4 text-slate-700 text-lg">
        <p>GitHubは、ひとりでも、みんなでも使える「ものづくりの記録ノート」です。</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <Term word="Repository" mean="作品の箱" />
          <Term word="Commit" mean="セーブポイント" />
          <Term word="Branch" mean="作業用コピー" />
          <Term word="Push / Pull" mean="上げる / 取る" />
          <Term word="Pull Request" mean="合流の申請" />
          <Term word="Merge" mean="合流させる" />
        </div>
        <p className="text-center text-slate-500 pt-4">
          まずは自分用のリポジトリを1つ作ってみましょう！
        </p>
      </div>
    ),
  },
];

export default function GitHubGuidePage() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, slides.length - 1));
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = slides[index];
  const progress = ((index + 1) / slides.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">GitHubの説明書</h1>
        <span className="text-sm text-slate-500">
          {index + 1} / {slides.length}
        </span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-1">
        <div
          className="bg-indigo-500 h-1 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[460px] p-8 md:p-12 flex flex-col">
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl">{slide.emoji}</span>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{slide.title}</h2>
            {slide.subtitle && (
              <p className="text-slate-500 mt-1">{slide.subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <div className="w-full">{slide.body}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← 前へ
        </button>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-indigo-500 w-6" : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`スライド ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={index === slides.length - 1}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}

function Card({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 text-slate-700">
      <p className="text-3xl mb-2">{icon}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function Dot({ label, color = "bg-indigo-300" }: { label: string; color?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-4 h-4 rounded-full ${color}`} />
      <span className="text-xs text-slate-500 mt-1">{label}</span>
    </div>
  );
}

function Arrow() {
  return <span className="text-slate-400">→</span>;
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4">
      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center flex-shrink-0">
        {n}
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function Term({ word, mean }: { word: string; mean: string }) {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-center">
      <p className="font-semibold text-indigo-900 text-sm">{word}</p>
      <p className="text-xs text-slate-600">{mean}</p>
    </div>
  );
}
