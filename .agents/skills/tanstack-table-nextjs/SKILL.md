---
name: tanstack-table-nextjs
description: Next.js/ReactでTanStack Table v8/latest（@tanstack/react-table）を使った型安全なデータテーブルを実装・修正・レビューするときに使う。App Router/Pages Router、Client Component境界、columns/data/useReactTable、ColumnDef、Table/Header/Row/Cell、sorting/filtering/faceting/pagination/row-selection/visibility/ordering/pinning/sizing/grouping/expanding/row-pinning/virtualization/server-side/manual mode/URL search params/row actions/editable cellsを扱う依頼で発動する。
---

# TanStack Table for Next.js Skill

このSkillは、Next.jsでTanStack Tableを使う実装を、公式ドキュメントに沿って漏れなく組み立てるための手順パッケージです。
TanStack Tableはヘッドレスなので、DOM・スタイル・UI部品はプロジェクト側で用意します。

## 必ず守ること

1. **TanStack TableはUIコンポーネント集ではない**。`<Table>`や`<Button>`などの完成済みUIを前提にせず、`table/header/row/cell`などのAPIを使って自分でマークアップを描画する。
2. **Next.js App RouterではClient境界を明示する**。`useReactTable`、`useState`、イベントハンドラ、ブラウザAPI、インタラクティブな列ヘッダー・行アクション・チェックボックスを含むファイルはClient Component側に置く。
3. **Server Componentでデータ取得し、Client Componentへシリアライズ可能なpropsとして渡す**。DBクライアント、シークレット、サーバー専用処理をClient bundleへ混ぜない。
4. **最初に行データ型を定義する**。`type User = ...`などの`TData`を決め、`ColumnDef<TData>[]`、`DataTable<TData, TValue>`に伝播させる。
5. **`data`と`columns`は安定参照を意識する**。無限再レンダーを避けるため、コンポーネント外定義、`useMemo`、または親からの安定propsを使う。
6. **`getCoreRowModel()`は必須**。追加機能ごとに必要なrow modelだけをimportする。
7. **client-sideとserver-side/manual modeを混ぜない**。サーバー側で並び替え・絞り込み・ページングする場合は`manualSorting`、`manualFiltering`、`manualPagination`などを使い、対応するclient row modelを無条件に足さない。
8. **列定義の3分類を区別する**。Accessor Column、Display Column、Grouping Columnを用途で使い分ける。
9. **アクセシビリティを落とさない**。ソートボタン、チェックボックス、ページング、行アクションにはラベル、状態、キーボード操作を考慮する。
10. **実装前に必要コンポーネントと機能を棚卸しする**。漏れ防止のため、必ず`references/component-catalog.md`と`references/feature-matrix.md`を参照する。

## 標準ワークフロー

1. **プロジェクト調査**
   - `package.json`でNext.js、React、`@tanstack/react-table`、UIライブラリ（shadcn/ui、MUI、Chakraなど）、Tailwind有無を確認する。
   - App Router（`app/`）かPages Router（`pages/`）か確認する。
   - 既存のテーブル部品、デザインシステム、fetch/DB層、URL search params運用を確認する。

2. **要件分類**
   - 表示だけか、sorting/filtering/pagination/selection/actions/editing/virtualization/server-sideが必要かを分類する。
   - 大量データか、サーバー側制御が必要かを判断する。
   - CRUD、行アクション、選択一括操作、列表示切替、エクスポートなどの周辺部品も洗い出す。

3. **Next.js構成を選ぶ**
   - App Routerの基本形: `app/<route>/page.tsx`（Server）→ `users-table-client.tsx`（Client）→ `components/data-table/*`。
   - Client-side mode: 全データをServerで取得してClient Tableへ渡し、Table側でsorting/filtering/paginationする。
   - Server-side/manual mode: URL search paramsやフォーム入力を状態源にして、Serverでクエリし、Client Tableは表示と操作イベントだけ持つ。

4. **Coreを実装**
   - `TData`型、`columns.tsx`、`DataTable`、`useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })`を作る。
   - `table.getHeaderGroups()`、`header.headers`、`table.getRowModel().rows`、`row.getVisibleCells()`、`flexRender()`で描画する。
   - Empty state、loading/skeleton、エラー表示を必ず設ける。

5. **機能を追加**
   - `references/feature-matrix.md`の該当行を使い、必要なstate、row model、table option、UI部品を追加する。
   - サーバー側制御の場合は`manual*` option、`rowCount`/`pageCount`、URL同期、fetch再実行を設計する。

6. **検証**
   - TypeScript型チェック、lint、既存テストを実行する。
   - 並び替え、フィルタ、ページング、列表示、選択、行アクション、空データ、ローディング、権限、URL復元を手動確認する。
   - `checklists/review-checklist.md`でレビューする。

## 参照ファイル

- `references/component-catalog.md` — TanStack TableのCore API/列定義/Next.js実装コンポーネントの種類と使い方。
- `references/feature-matrix.md` — 機能別のimport、state、row model、table option、UI実装。
- `references/nextjs-patterns.md` — Next.js App Router/Pages Router、Client/Server境界、URL同期、Server-side modeの設計。
- `references/examples-coverage.md` — 公式Examplesの実装パターン対応表。
- `checklists/review-checklist.md` — 実装・レビュー時の漏れ防止チェックリスト。
- `templates/app-router-client/` — Client-side modeの最小実装テンプレート。
- `templates/app-router-server-mode/` — URL search params + manual modeの骨組みテンプレート。
- `references/official-docs.md` — 公式ドキュメントへの参照リンク集。

## 生成・修正時の出力ルール

- 新規実装では、少なくとも`types.ts`、`columns.tsx`、Client Table wrapper、`DataTable`本体、必要な周辺部品を提示する。
- 「コンポーネントを作って」と言われた場合は、Table本体だけでなく、列ヘッダー、ツールバー、フィルタ、ページング、表示列切替、行選択、行アクション、Empty/Loadingの要否を判断して含める。
- shadcn/uiなど既存UIがある場合は既存部品を優先する。ない場合は素のHTMLで実装し、依存追加を最小化する。
- APIやDBの詳細が不明でも、シリアライズ可能なデータをServerからClientに渡す境界と、manual modeの型だけは明示する。
