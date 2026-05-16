---
name: handsontable-nextjs
description: Next.js/ReactでHandsontableデータグリッドを実装・修正・レビュー・移行するためのSkill。App Router/Pages Router、Client Component境界、@handsontable/react-wrapper、HotTable、HotColumn、EditorComponent、Reactカスタムrenderer/editor/validator、全セル型、モジュール/プラグイン、Theme API/CSS、i18n、hooks/API/保存、bundle最適化を扱う依頼で使う。
allowed-tools: Read, Write, Edit, MultiEdit, Bash, Grep, Glob
---

# Handsontable + Next.js Skill

## 目的

Next.js で Handsontable を安全に導入・実装・移行・レビューする。特に、React wrapper のコンポーネント種別、セル型、セル関数、モジュール、プラグイン、テーマ、国際化、hooks/API を漏らさず確認する。

## 最初に読むファイル

依頼に合わせて、次の順で参照する。

1. `references/01-nextjs-setup.md` — Next.js App Router / Pages Router、Client Component、SSR回避、CSS/テーマ
2. `references/02-component-inventory.md` — `HotTable` / `HotColumn` / `EditorComponent` / React renderer / editor / validator / ref の全体像
3. `references/03-cell-types-and-cell-functions.md` — built-in cell types、renderer/editor/validator、custom cell type
4. `references/04-modules-plugins-themes-i18n.md` — モジュール登録、全プラグイン、テーマ、i18n、機能マップ
5. `references/05-hooks-api-data-saving.md` — hooks、instance API、保存、サーバー連携
6. `references/06-quality-checklist.md` — 実装前後の漏れ防止チェック

公式ドキュメントや `package.json` の Handsontable バージョンが、この Skill 作成時点の参照バージョンと違う場合は、実装前に該当バージョンの公式 docs / changelog / migration guide を確認する。

## 実装ワークフロー

1. **環境を判定する**
   - App Router か Pages Router か。
   - TypeScript か JavaScript か。
   - Handsontable / `@handsontable/react-wrapper` のバージョン。
   - Server Component から渡すデータが JSON serializable か。

2. **Client Component 境界を作る**
   - Handsontable を直接描画するファイルは `'use client'` を先頭に置く。
   - Server Component ではデータ取得だけを行い、表示は Client Component に渡す。
   - `window` 依存や hydration mismatch が出る場合は、Client Component 内で `next/dynamic(..., { ssr: false })` を使う。

3. **パッケージと登録方式を決める**
   - 基本: `handsontable` と `@handsontable/react-wrapper` を追加。
   - 開発初期: `registerAllModules()`。
   - 本番最適化: 必要な cell type / renderer / editor / validator / plugin / i18n のみ個別登録。

4. **必ずコンポーネント種別を確認する**
   - `HotTable`: グリッド本体。
   - `HotColumn`: 列単位の props / object data mapping / custom renderer/editor。
   - `EditorComponent`: React カスタムエディタを declarative に作る高レベル部品。
   - React renderer component: `renderer={Component}` として `HotTable` または `HotColumn` に渡す。
   - React editor component / `editorFactory` / `useHotEditor`: カスタム編集 UI。
   - validator function: 入力値検証。
   - `HotTable` ref / `hotInstance`: instance API 呼び出し。
   - Theme API object / CSS theme string: 見た目の適用。

5. **セル型と列仕様を選ぶ**
   - 文字列なら `text`、数値なら `numeric`、日付なら `intl-date` またはバージョン互換の `date`、時刻なら `intl-time` または `time`、選択肢なら `select` / `dropdown` / `autocomplete` / `multiselect`、真偽値なら `checkbox`、秘匿表示なら `password`、入れ子表なら `handsontable`。
   - object data で `HotColumn` を使う場合は `data="propertyName"` を必ず指定する。

6. **機能・プラグインを明示する**
   - 並び替え、フィルタ、コンテキストメニュー、コピー、非表示、リサイズ、移動、固定、結合、コメント、数式、検索、エクスポート、Undo/Redo などを `references/04...` のリストで照合する。
   - 必要な plugin を有効化する prop と、必要な module registration を対応させる。

7. **保存・API・hooks を設計する**
   - 変更保存は原則 `afterChange` を使い、`source === 'loadData'` は保存対象から除外する。
   - 外部ボタン操作や選択などは `ref.current?.hotInstance` から API を呼ぶ。
   - 破壊的操作の制御や validation は `before*` hook で必要に応じて `false` を返す。

8. **レビューで最後に漏れチェックを行う**
   - `references/06-quality-checklist.md` のチェックリストを使い、コンポーネント・セル型・plugin・hooks・theme・i18n・Next.js 境界を確認する。

## よくある失敗を避ける

- Server Component の中で `HotTable` を直接 import / render しない。
- 旧 wrapper `@handsontable/react` の `settings` prop 前提の書き方を、新 wrapper `@handsontable/react-wrapper` に混ぜない。
- object data で `<HotColumn data="..." />` を省略しない。
- カスタム React renderer を使う列で、自動サイズ計測に起因する問題が出たら `autoRowSize={false}` / `autoColumnSize={false}` を検討する。
- `licenseKey` を省略しない。非商用評価だけなら `non-commercial-and-evaluation`、本番は契約に沿った key を使う。
- テーマ/CSSの旧 `handsontable.full.min.css` 前提にしない。v15+ はテーマ方式を確認する。
- `registerAllModules()` と個別登録を混在させる場合は、重複や bundle size の意図を明確にする。
- Server Component から Client Component に関数・クラス・Date など非 serializable な props を渡さない。

## 出力方針

- 実装回答では、必ず「Client Component ファイル」「Server からの呼び出し」「列定義」「登録方式」「テーマ」「保存/hook」のどれを使ったかを示す。
- 修正回答では、変更理由を Handsontable / Next.js の境界、セル型、plugin、API の観点で説明する。
- 既存コードレビューでは、漏れている component / cell type / plugin / theme / hook を箇条書きで指摘し、修正案を出す。
