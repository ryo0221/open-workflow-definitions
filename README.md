# workflow-definitions

任意の分野のワークフローを、工程・成果物・項目の種類・達成条件と、それらの関係として定義するためのリポジトリです。

## 置いてあるもの

| 場所 | 中身 |
|---|---|
| `definitions/<id>.json` | 定義の本体。定義ごとに 1 ファイル |
| `schema/definition.schema.json` | 定義の形（JSON Schema） |
| `scripts/check.mjs` | 形と参照の検査。引数が無いときは作品の見本も検査する |
| `fixtures/<定義の id>/*.json` | 作品の見本。定義の引用と網羅の規則を当てはめて確かめる（[説明](docs/fixtures.md)） |
| `src/check.mjs` | 共通の定義検査関数 |
| `test/*.test.mjs` | 検査の契約試験 |
| `CHANGELOG.md` | 版ごとの変更の記録 |
| `THIRD_PARTY_NOTICES.md` | 第三者コードの表示 |

## 利用方法

個々のワークフローは、共通のデータ形式で `definitions/<id>.json` に定義します。
現在は、ソフトウェア開発向けの定義例として `definitions/software-product.json` の **`software-product@1.7.0`** を収録しています。
利用する定義ファイルと `schema/definition.schema.json` を任意のAIに渡すか、独自ツールからJSONとして読み込んで利用できます。

既存ソフトウェアの責務・依存・古いコードや試験を見直すための独立した定義として、`definitions/software-refactoring.json` の **`software-refactoring@1.0.0`** を収録しています。現状調査・維持／変更する契約・改修計画・実装・検証・受入の進め方は [利用ガイド](docs/software-refactoring.md) を参照してください。通常の小さなコード整理は software-product の実装工程の中で行えます。

小説の制作向けには `definitions/fiction-novel.json` の **`fiction-novel@1.2.0`** を収録しています。工程・項目と、利用側が受け持つことは [利用ガイド](docs/fiction-novel.md) を参照してください。

漫画の制作向けには `definitions/fiction-manga.json` の **`fiction-manga@1.1.0`** を収録しています。画作りガイド（レイヤーの決まり）・地図・ネームと、利用側が受け持つことは [利用ガイド](docs/fiction-manga.md) を参照してください。

ロゴ・シンボル・アプリアイコンなどの視覚表現の制作向けには `definitions/visual-identity.json` の **`visual-identity@1.0.0`** を収録しています。探索・ラフ・候補比較・採用・マスター・用途別展開の進め方は [利用ガイド](docs/visual-identity.md) を参照してください。

株式会社設立・事業開始向けには `definitions/japan-company-establishment.json` の **`japan-company-establishment@1.0.0`** を収録しています。適用範囲と利用上の区別は [利用ガイド](docs/japan-company-establishment.md) を参照してください。

## 定義の書き方の原則

- **今の規範だけを書く。** 変更の経緯・理由・由来・過去の版は定義に書かず、`CHANGELOG.md` に書く。
- **道具に依らない。** 製品・サービス・道具の名前、ファイル名やパスを書かない。役割の言葉で書く。
- **関係は明示の欄で書く。** 工程の順・成果物・達成条件のつながりは、ID の参照で書く。文章から関係を読み取らせない。
- **版は Git で管理する。** 版ごとにファイルを分けない。定義の `version` は、変更のたびに上げてタグを付ける。

## 定義の形

```
定義
├─ phases        工程。順（after）・目的・作る成果物・達成条件
├─ sections      工程のまとまり。既定の分け方で、使う側が変えてよい
├─ deliverables  成果物。形（文書・表・図・画面・コードなど）と、見出しの並び（outline）、見せ方（view。任意。図・カンバン・タイムライン・カレンダー・表・フォーム・マトリクス）
├─ items         ID を持つ項目の種類と、ID の形
├─ rules         引用の規則（cites）と網羅の規則（covered）
└─ acceptance    達成条件。誰が確かめるか（人・AI）と、機械で確かめる規則
```

形の詳細は `schema/definition.schema.json` を見てください。

### 成果物の見せ方（view）

成果物の `view` は、その成果物の項目をどう見せるかを決める（任意）。図（`as: "graph"`）・カンバン（`as: "kanban"`）・タイムライン（`as: "timeline"`）・カレンダー（`as: "calendar"`）・表（`as: "table"`）・フォーム（`as: "form"`）・マトリクス（`as: "matrix"`）を 1 つ書くか、配列で幾つでも書く（`as` ごとに 1 つまで）。道具は見せ方ごとに見え方を出し（利用側のエディタでタブ表示するなど）、最初の見せ方で開く。

図は、成果物の JSON の、項目の種類ごとの配列を、点（`nodes`）・線（`edges`）・枠（`sections`）のどれで描くかを、項目の種類の ID で書く。1 つの種類は、どれか 1 つにだけ置く。

- 項目の欄 `in` は、入る枠の ID。枠の中に枠を入れることもできる（ページの中のコマなど）。
- 線の項目は、`from`・`to` に点の ID を持つ。
- `at`（点の場所 `[x, y]`）・`frame`（枠の場所と大きさ `[x, y, 幅, 高さ]`）は、入っている枠の左上から測る。どれも無ければ道具が並べる。
- `colorBy` は点と枠の色を分ける欄、`edgeColorBy` は線の色を分ける欄。値ごとに色を変える。`colors`・`edgeColors` で値の色（`#rrggbb`）を決められ、決めない値は道具が選ぶ。

例（人物の相関図：陣営が枠、人物が点、関係が線で、関係の種類ごとに線の色を変える）：

```json
"view": { "as": "graph", "sections": ["group"], "nodes": ["person"], "edges": ["relation"],
          "colorBy": "in", "edgeColorBy": "type", "edgeColors": { "家族": "#e11d48", "対立": "#0f172a" } }
```

例（漫画のネーム：ページとコマが枠で、コマ割りを frame で書き、コマの中の人物の配置を点にして、登場人物ごとに色を変える）：

```json
"view": { "as": "graph", "sections": ["page", "panel"], "nodes": ["figure"], "colorBy": "who" }
```

カンバン・タイムライン・カレンダー・表・フォームは、1 つの項目の種類（`items`）を表として読み、その見え方を変える。値は表と同じ欄に書き戻す。

- カンバン：欄 `groupBy` の値ごとの列にカードを並べる。カードを別の列に動かすと、その欄の値が変わる。`columns` で列の並び（値）を、`card` でカードに出す欄を決められる。
- タイムライン：欄 `start` から欄 `end` までを帯にして、日付（`YYYY-MM-DD`）の軸に並べる。`groupBy` で帯の行を分け、`scale`（`day`・`week`・`month`）で目盛りを決められる。
- カレンダー：欄 `date` の日に、月の暦で並べる。`end` があれば `date` から `end` までの日に置く。期限のように日付が 1 つの項目に向く。
- 表：表で開くときの、欄の並び（`columns`）・並べ替え（`sort`。`{ "by": 欄, "desc": true }` の配列で、前のものほど先に効く）・行をまとめる欄（`groupBy`）・隠す欄（`hide`）を決める。
- フォーム：1 件ずつの入力の画面で開く。`fields` で欄の並びを決められる。欄の多い台帳に向く。

使う欄（状態・担当・日付など）は、その見出しの `describe` に書いて、成果物を書く人や作業役に伝える。

例（制作の進行：作業を状態ごとのカンバンと、担当ごとのタイムラインで見る）：

```json
"view": [
  { "as": "kanban", "items": "task", "groupBy": "status", "columns": ["未着手", "作業中", "確認待ち", "完了"], "card": ["name", "who", "due"] },
  { "as": "timeline", "items": "task", "start": "start", "end": "due", "groupBy": "who", "scale": "week" }
]
```

例（台帳：状態でまとめて期限が近い順の表、期限のカレンダー、1 件ずつのフォームで見る）：

```json
"view": [
  { "as": "table", "items": "premise", "groupBy": "状態", "sort": [{ "by": "確定期限" }], "hide": ["情報区分"] },
  { "as": "calendar", "items": "premise", "date": "確定期限" },
  { "as": "form", "items": "premise", "fields": ["内容", "状態", "担当", "確定期限", "次の行動"] }
]
```

マトリクスは、行の項目の種類（`rows`。この成果物の項目）と列の項目の種類（`columns`。定義のどの項目でもよい）を並べ、引用の表にある組のます目に印を付ける。ます目を切り替えると、引用の表の組が増える・減る。行と列の種類のあいだには、どちら向きかの引用の規則（`cites`）が要る。網羅の規則があれば、印の無い行・列が抜けとして見える。

例（試験の対応表：試験を行、受入条件を列にする）：

```json
"view": { "as": "matrix", "rows": "test", "columns": "criterion" }
```

## 項目と引用

成果物の中の一つ一つ（ストーリー・受入条件・画面・遷移など）は、ID を持つ項目になる。見出しの `item` が、その見出しの下の一つ一つをどの種類の項目にするかを決める。

定義を使う道具は、次のことを守る。

- **ID は変えず、使い回さない。** 項目を消しても、その ID は別の項目に付けない。
- **引用は本文の外の表で持つ。** 引用（どの項目がどの項目をもとにしているか）は、成果物の本文やコードに書かず、項目の ID の組を並べた引用の表に持つ。表は表としても図としても見せられる。文章の中の言及から引用を読み取らない。
- **影響は引用だけで決める。** 上流の項目が変わったら、その項目を引用している下流の項目を、引用をたどって全部出す。同じ版の組み合わせなら、いつも同じ結果になる。
- **項目の変化は中身で比べる。** 版の前後で中身が変わった項目だけを「変わった」とする。
- **網羅の規則で除くときは理由を書く。** `exempt` のある規則だけ、理由を書いた項目を除ける。

## 検査

```sh
npm ci
npm run check
```

PR提出前・マージ前の必須検査は `npm run check` です。生成済み検査器とschemaの一致、正式定義、契約試験を順に検査し、どれかが失敗すれば停止します。`node scripts/check.mjs` は定義のみの検査で、この必須検査の代わりにはなりません。

ID の重なり、存在しない参照、工程の順の循環、成果物や達成条件の無い工程、まとまりに入っていないか順に合わない工程を見つけます。

## 共通の定義検査

`check(definition)` を `workflow-definitions` からimportすると、schemaに基づく形式検査と参照・工程等の意味検査を同じ経路で実行できます。入力はunknown、戻り値は問題文の配列（問題がなければ空）です。入力を書き換えず、import時にファイル列挙・標準出力・process.exitを行いません。Nodeとブラウザーから同じ検査を使えます。

```js
import { check } from 'workflow-definitions';
const problems = check(definition);
```

CLIの `npm run check` もこの関数を呼びます。schemaの生成検査器は配布物に含め、利用側に別のschema実装や実行時コード生成を要求しません。schema変更時は `npm run schema:build`、生成物の一致確認は `npm run schema:check`、契約試験は `npm test` を実行してください。生成検査器のビルドにのみ開発依存を使用します。

この検査は道具に依らない宣言を検証します。7種のviewは定義として認め、実際の表示・編集・保存・AI提案の可否はHostが別に検査します。Editorの指定、出力形式の選択、実ファイル・列・版との対応、作品ごとのAI方針値を定義へ追加しません。`editor` / `exports` 等の未知の宣言欄は拒否します。

## 公開版の範囲と注意

本リポジトリはワークフローの**定義、JSON Schema、基本検査器、契約試験、作品の見本**を公開しています。作業を自動実行するエンジン、案件の承認管理、実際の成果物の品質保証、変更影響の自動評価を含みません。Schemaと定義の検査に通ることは、案件の成果物が受け入れ可能であることを意味しません。

利用時は定義の `id` / `version` と、取得したリポジトリの完全なcommit SHAまたは配布物のチェックサムを保存し、版を固定してください。 `package.json` の `private: true` はnpmレジストリへの誤公開を防ぐためで、GitHubからの利用とMITライセンスは両立します。

定義の開発はこのリポジトリで行います。2026-11-11 より前の由来と、タグの付け方は [SYNC_SOURCE.md](SYNC_SOURCE.md) に書いています。内部の実装計画や運用情報は公開していません。

## ライセンス

定義・JSON Schema・検査スクリプト・文書は [MIT License](LICENSE) で提供します。生成済み検査器に含まれる第三者コードは [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を確認してください。
