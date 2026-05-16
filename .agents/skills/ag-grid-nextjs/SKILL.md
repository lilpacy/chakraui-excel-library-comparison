---
name: ag-grid-nextjs
description: Next.js / React プロジェクトで AG Grid を導入・実装・移行・レビューするときに使う。App Router/Client Component、AgGridProvider、モジュール登録、Theming API、columnDefs/rowData、基本機能、custom/provided components、Enterprise ライセンス、SSRM、パフォーマンス、テスト方針を扱う。ag-grid, AG Grid, ag-grid-react, Next.js, React table, data grid, cellRenderer, cellEditor, filter, statusBar, toolPanel, overlay などがトリガー。
---

# AG Grid for Next.js Skill

## 目的

Next.js（特に App Router）で AG Grid React を安全に導入・実装・修正する。ブラウザ API 依存、モジュール登録、テーマ、コンポーネント種別、Enterprise 機能、SSRM、React Hooks の参照安定性を見落とさない。

## 使うタイミング

- Next.js / React に `ag-grid-react` を追加する。
- `AgGridReact`、`columnDefs`、`rowData`、`defaultColDef`、`rowSelection`、`pagination`、`cellRenderer`、`cellEditor`、`filter` などを実装・修正する。
- AG Grid の custom components / provided components / Enterprise 機能を選定する。
- AG Grid が Next.js で表示されない、hydration/SSR エラー、テーマが当たらない、行選択がリセットされる、列状態がリセットされる問題を調査する。

## 最初に確認すること

1. `package.json` で `ag-grid-react`、`ag-grid-community`、`ag-grid-enterprise`、`next`、`react` のバージョンを確認する。
2. `app/` と `pages/` のどちらを使っているか確認する。App Router では AG Grid を含むファイルを Client Component にする。
3. 既存コードが `AgGridProvider` を使っているか、`ModuleRegistry.registerModules(...)` を使っているかを確認する。新規実装では原則 `AgGridProvider` を優先する。
4. v33 以降の Theming API を使うか、既存の legacy CSS theme を維持するかを確認する。新規実装では Theming API を優先する。
5. custom/provided component に触れる依頼では、必ず [reference/component-catalog.md](reference/component-catalog.md) を読む。

## 実装ルール

### Next.js での必須ルール

- `AgGridReact` を直接含むコンポーネントには必ず `"use client";` を置く。
- `app/page.tsx` や `app/**/page.tsx` は Server Component のままにしてよい。AG Grid 部分だけを client component に分離する。
- AG Grid の親コンテナには明示的な高さを与える。例: `style={{ height: 520, width: '100%' }}`、Tailwind なら `h-[520px] w-full`。
- Client Component でしか使えない値（Grid API、DOM、`window`、イベントハンドラ）を Server Component に持ち込まない。

### モジュール登録

- 新規コードでは `AgGridProvider` に `modules` を渡す。
- Community の全機能が必要で bundle size が優先でない場合は `AllCommunityModule` を使う。
- bundle size を抑える必要がある場合は、必要な module だけを選ぶ。
- Enterprise 機能は `ag-grid-enterprise` と該当 module、必要なら `ag-charts-enterprise` を追加する。
- `ag-grid-react` と `ag-grid-enterprise` を併用する場合、バージョンは一致させる。

### テーマ

- v33+ の新規実装では CSS import ではなく Theming API を優先する。
- 例: `import { themeQuartz } from 'ag-grid-community';` を使い、`<AgGridReact theme={themeQuartz} />` と渡す。
- 既存が legacy theme の場合だけ、`theme="legacy"` と CSS import / `ag-theme-*` class を維持する。

### React Hooks / 参照安定性

- `rowData` は更新するなら `useState`、固定なら `useMemo`。
- `columnDefs` は更新するなら `useState`、固定なら `useMemo`。
- object props（`defaultColDef`, `rowSelection`, `sideBar`, `statusBar`, `toolbar`, `components`）は `useMemo` / `useState` で安定化する。
- callback props（`getRowId`, `isRowSelectable`, `valueGetter`, `valueFormatter`, `cellRendererSelector` など）は `useCallback` を使い、依存配列を正しく書く。
- 行データを更新する場合は `getRowId` を実装して、選択状態・展開状態・編集状態がリセットされないようにする。

## コンポーネントを扱うときの手順

1. [reference/component-catalog.md](reference/component-catalog.md) を開いて、該当する component type、設定場所、属性名を確認する。
2. 「列内表示」なら `cellRenderer`、「編集 UI」なら `cellEditor`、「列メニュー内フィルタ」なら `filter`、「ヘッダー直下の簡易フィルタ」なら `floatingFilter` を選ぶ。
3. 既存の grid-provided component で足りるか確認する。足りない場合だけ custom component を作る。
4. custom component は direct reference を優先する。永続化した JSON columnDefs が必要な場合だけ `components` map に名前登録する。
5. custom props は `[propName]Params`（例: `cellRendererParams`, `filterParams`, `statusPanelParams`）で渡す。
6. 行ごとに component を切り替える場合は `*Selector`（例: `cellRendererSelector`, `cellEditorSelector`, `overlayComponentSelector`）を使う。

## 参照ファイル

- Next.js セットアップ: [reference/nextjs-setup.md](reference/nextjs-setup.md)
- コンポーネント全種別・設定属性: [reference/component-catalog.md](reference/component-catalog.md)
- 実装パターン: [reference/implementation-patterns.md](reference/implementation-patterns.md)
- レビュー用チェックリスト: [reference/checklist.md](reference/checklist.md)
- App Router 基本例: [examples/app-router-basic-grid.md](examples/app-router-basic-grid.md)
- custom component 例: [examples/custom-components-examples.md](examples/custom-components-examples.md)

## 出力方針

- ユーザーがコード修正を求めたら、既存の Next.js 構成に合わせて最小差分で直す。
- 新規導入なら App Router / TypeScript / Theming API / `AgGridProvider` の構成で提示する。
- Enterprise 機能を使う場合は Community では使えないこと、ライセンス設定、client-side exposure を明記する。
- 実装後に `npm run lint`、`npm run typecheck`、`npm test` など既存 scripts があれば実行または提案する。
