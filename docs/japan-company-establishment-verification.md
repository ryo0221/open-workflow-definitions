# 設立工程定義の検証（2026-10-25）

基点は fa1771b22e77c36832db4fe51ca5cc7620717fb1（software-product 1.7.0）。schema/definition.schema.json、scripts/check.mjs、既存software-productには変更を加えません。

## 現行版（16工程・4セクション・19成果物・34達成条件）

- PASS: mainを取り込んだ後の `node scripts/check.mjs`。新定義と既存software-product 1.7.0が通過。ID・参照・工程の順・成果物と達成条件の有無・セクション所属と並びを検査。
- NOT RUN: PaoBubのframework関数による初期プロジェクトの読込・影響伝播の検査（下記は改訂前の版で実施）。
- NOT RUN: PaoBubのUI、実際のProject登録、法定手続・権利移転・公開。定義追加だけで実務完了とは扱わない。

## 改訂前の版（12工程・13成果物・24達成条件）での検証

- PASS: 既存schema（draft 2020-12、Ajv2020）による検査。
- PASS: PaoBub 6916ec8b2b0ddbde877acf225e50dd07eca31b43 の実際のcheckDefinition/checkWorkflowFile/buildIndex/evaluateRulesで、プロジェクト初期案との読込互換性を確認。
- PASS: 初期プロジェクトの欠落、重複、参照切れと不正状態を検出し、上流変更の影響伝播を確認。
- PASS: sections検査で所属漏れ・重複・順序逆転の異常系をそれぞれ検出。

会社固有の条件、担当・期限、情報の区分、公的根拠、接続手順と実務完了検査はtokiwa-inc側の初期構成で管理します。版のtag発行はこのPRでは行いません。
