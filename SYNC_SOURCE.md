# このリポジトリの由来

2026-11-11 から、ワークフロー定義の開発はこのリポジトリで直接行います。定義・schema・検査・試験・見本への変更と Issue は、ここへ出してください。

## それより前

- それまでの開発は、非公開のリポジトリ `ryo0221/workflow-definitions` で行っていました。このリポジトリの最初の内容（commit `a6d827e`）は、そのリポジトリの commit `bdc4cbd078c2c27a47def242df1c7bace328bf7b`（2026-11-11）から、公開してよいファイルを選んで写したものです。Git の履歴は引き継いでいません。
- 写したもの：`definitions/`, `schema/`, `scripts/`, `src/`, `test/`, `fixtures/`, `docs/` 内の各定義ガイド、`package*.json`, `CHANGELOG.md`, `.gitignore`, `THIRD_PARTY_NOTICES.md`
- 公開向けに書き直したもの：`README.md`（内部の Host 移行の説明を外し、MIT の条件と公開する範囲を明記）
- `CHANGELOG.md` には、それより前の版の記録も残しています。
- 写した時点の各定義の版には、`a6d827e` にタグを付けています：`v1.7.0`（software-product）、`fiction-manga-v1.1.0`、`fiction-novel-v1.2.0`、`japan-company-establishment-v1.0.0`、`software-refactoring-v1.0.0`、`visual-identity-v1.0.0`。それより古い版のタグは、元のリポジトリにだけあります。

## これから

- 版を上げたら、`definitions/<id>.json` の `version`、`CHANGELOG.md`、README に書いた版を直し、その版が入った main の commit に `<id>-vX.Y.Z` のタグを付けます（software-product だけは、これまでどおり `vX.Y.Z`）。
- 公開リポジトリなので、内部の運用情報や非公開の道具の設計は書きません。
