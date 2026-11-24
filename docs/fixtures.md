# 作品の見本（fixture）

定義の引用と網羅の規則を、小さな作品の見本に当てはめて確かめるためのデータです。`fixtures/<定義の id>/<見本>.json` に置き、`node scripts/check.mjs`（`npm run check`）がその定義の今の版に照らして検査します。

見本で確かめるのは、AI が確かめる構造の条件だけです。作品の出来、画風、ラフの意図、人物の同一性のような人が確かめる達成条件は確かめません。定義と見本が通っても、作品が仕上がったことや、利用側の道具が正しく動くことにはなりません。

## 収録している見本

| 見本 | 定義 | 中身 |
|---|---|---|
| `fiction-novel/short-story.json` | fiction-novel@1.2.0 | 絵を使わない短編小説。画作りの成果物を理由つきで省く。回想でのシーンの再提示、裏の出来事、次作へ持ち越す筋 |
| `fiction-manga/four-pages.json` | fiction-manga@1.1.0 | 4ページの短編漫画。舞台の3Dモデルを省く。コマはページを親にせず欄 `in` で入るページを書く。絵だけで見せる台詞を吹き出しから除く |
| `fiction-manga/two-styles.json` | fiction-manga@1.1.0 | 同じ世界・人物・場所・ラフから二つの画風。橋が落ちる前と後を出来事で分け、設定の訂正を版で分け、既刊の提示位置を古い版のまま残す |
| `product-design-engineering/skeleton-watch.json` | product-design-engineering@1.0.0 | スケルトンの手巻き腕時計を詳細設計の出図まで。後の工程を理由つきで省き、購入品の図面・未設計の部品・試験で確かめる要求を網羅から除く |
| `product-design-engineering/mid-engine-car.json` | product-design-engineering@1.0.0 | ミッドシップの2人乗りの外形を詳細設計まで。選ばなかった外装の方向、骨格と足回りの部品、確認用の乗員の形を理由つきで扱う |
| `construction-planning/skytree.json` | construction-planning@1.0.0 | 634 m の電波塔の建設（東京スカイツリーを題材にした近似）。PaoBub の Project の項目と引用を写したもの。昇るタワークレーン・引き上げ・搬入、吊りの検査の記録。構造の確認を理由つきで省く。網羅の例外 1 件（制約で扱う条件） |
| `production-system-planning/small-line.json` | production-system-planning@1.0.0 | 架空の動力系の小さな組立ライン（9 資源・7 つながり）。手計算と極端な条件でのモデルの確認、現状・バッファ増・加工機増の 3 案と所見、わざと誤った制御の確認。網羅の例外 6 件（配置で扱う要件、流れの外の作業者、時間のデータの要らない資源、説明しない案） |
| `vehicle-styling/sho.json` | vehicle-styling@1.0.0 | 独自の2座ミッドシップ「翔」の外観（Editor Platform の CAD で描いた記録から写したもの）。3案から1案を選び、比率をベルトラインで直した版、面の波を線図へ戻して直した記録、配色3案から紅を選ぶ判断。網羅の例外 2 件（測りの無い目安） |
| `editor-development/card-editor.json` | editor-development@1.0.0 | Editor のテンプレートが最初から持つカードの Editor を、目的・形式・操作・画面・試験・取り込みの項目で書き直したもの。網羅の例外 2 件（データを変えない保存と再読込、しないと決めた共同編集） |
| `failure-analysis/kettle-shutoff.json` | failure-analysis@1.1.0 | 架空の電気ケトルで沸騰後に電源が切れない問題を、要因分析・FMEA・FTA と対策まで。確認済み・仮説・除外の原因の候補、候補を経ない故障原因。網羅の例外 2 件（対策しない故障原因、実施中の対策）

## 形

```json
{
  "fixture": 1,
  "id": "short-story", "title": "…", "purpose": "…",
  "definition": { "id": "fiction-novel", "version": "1.2.0" },
  "deliverables": {
    "<成果物の id>": { "items": [ { "id": "SC-001", "name": "…", "version": 2, "cites": ["EV-001@1", "CH-01"], "…": "…" } ], "note": "…" },
    "<項目の無い成果物>": { "note": "何を作ったか" },
    "<省いた成果物>": { "skipped": "省いた理由" }
  },
  "keepOld": [ { "item": "OC-001", "cite": "SC-001@1", "reason": "古い版のまま残す理由" } ],
  "exceptions": [ { "rule": "thread-covered", "item": "PT-02", "reason": "除く理由" } ]
}
```

- 定義のすべての成果物を書く。項目を持つなら `items`、項目の無い成果物は `note`、省いた成果物は `skipped` に理由を書く。
- 項目の `cites` は引用。`ID@版` で固定した版を引用する。版を書かない項目は版 1。
- 参照の欄 `in`・`from`・`to`・`chapter`・`page` は、値の全体が「ID」か「ID@版」でなければならない。ID の形と、項目と版があるかを確かめる。
- ほかの欄（`text`・`pose` など）は自由。文章の中に書いた ID も、項目があるかを確かめる。
- `keepOld`：引用先の今の版より古い版を引用するときの理由。
- `exceptions`：網羅の規則のうち、定義で除けるもの（`exempt`）だけを、理由つきで除く。

## 検査すること

- 見本の定義の id と版が、今の定義と同じ。
- 定義のすべての成果物が、項目・覚え書き・省いた理由のどれかで書かれている。
- 項目の ID が定義のどれかの項目の形に合い、その項目の種類を見出しに持つ成果物に置かれ、重なっていない。
- 引用先がある。固定した版がある。引用の向きが定義の `cites` の規則にある。規則の最低数を満たす。
- 古い版の引用には `keepOld` の理由がある。
- 網羅の規則（`covered`）を満たす。除けるのは `exempt` の規則で、理由を書いたときだけ。使っていない例外や `keepOld` も知らせる。

利用側の道具で読み込んだときの結果（工程・成果物・項目の扱い、変更の影響の出し方）は、この検査とは別に記録します。
