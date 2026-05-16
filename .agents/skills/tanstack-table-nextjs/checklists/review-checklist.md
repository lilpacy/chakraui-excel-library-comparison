# Review Checklist: TanStack Table + Next.js

## 基本

- [ ] `@tanstack/react-table`を使っている。
- [ ] `TData`型が定義され、`ColumnDef<TData>[]`に反映されている。
- [ ] `useReactTable`に`data`、`columns`、`getCoreRowModel`が渡っている。
- [ ] header/cell/footerは`flexRender`で描画している。
- [ ] `key`は`header.id`、`row.id`、`cell.id`など安定IDを使っている。
- [ ] Empty stateがある。
- [ ] Loading/Skeletonまたはroute `loading.tsx`がある。

## Next.js境界

- [ ] `useReactTable`を呼ぶファイルはClient Componentである。
- [ ] `useState`、イベントハンドラ、browser APIをServer Componentに置いていない。
- [ ] DB/API secret/server-only helperをClient Componentにimportしていない。
- [ ] ServerからClientへ渡すpropsはシリアライズ可能である。
- [ ] `columns`をServerからClientへpropsとして渡していない。Client module内で定義/参照している。

## 列定義

- [ ] Accessor/Display/Grouping Columnの用途が正しい。
- [ ] display columnには`id`がある。
- [ ] accessor値はsorting/filteringしやすいプリミティブである。
- [ ] 行アクション、checkbox、expanderなどはdisplay columnである。
- [ ] 非表示にしてはいけない列は`enableHiding: false`。
- [ ] ソート不可/フィルタ不可の列は明示的に無効化している。

## State / Row Models

- [ ] 使う機能のstate型と`on*Change`が正しい。
- [ ] 必要なrow modelだけをimportしている。
- [ ] client-side機能とmanual server-side機能を混同していない。
- [ ] `getRowId`で安定IDを使っている（特にrow selection, mutations, DnD）。

## 機能別

- [ ] Sorting UIは`column.getCanSort()`を尊重している。
- [ ] Filtering UIは`column.getCanFilter()`を尊重している。
- [ ] PaginationはpageIndex 0始まりとURL 1始まりの変換が明確。
- [ ] Row selectionはmanualPagination時のページ外選択に注意している。
- [ ] Column visibilityは`row.getVisibleCells()`で描画している。
- [ ] Pinningはsticky CSS、z-index、背景色、横スクロールを考慮している。
- [ ] Column sizingは`column.getSize()`を実DOM/CSSへ反映している。
- [ ] Expandingは`colSpan`を可視セル数に合わせている。
- [ ] Virtualizationはscroll container、高さ、overscan、sticky headerの影響を検討している。

## Server-side/manual mode

- [ ] `manualSorting`、`manualFiltering`、`manualPagination`が必要に応じて設定されている。
- [ ] `rowCount`または`pageCount`が渡っている。
- [ ] sort/filter/page/pageSizeがURLやAPI queryに同期している。
- [ ] Server側でsort/filterの許可リスト検証をしている。
- [ ] filter/sort変更時にpageを1へ戻している。
- [ ] debounce、`router.replace`、`scroll: false`が適切に使われている。

## UX / Accessibility

- [ ] ソートボタンの状態が視覚・ariaで分かる。
- [ ] checkboxにlabel/aria-labelがある。
- [ ] pagination buttonはdisabled状態を持つ。
- [ ] 行アクションはキーボード操作できる。
- [ ] テーブルcaptionまたは周辺見出しがある。
- [ ] 横スクロール時も重要操作列が使いやすい。

## 品質

- [ ] TypeScript型チェックが通る。
- [ ] lintが通る。
- [ ] 空データ、1件、複数ページ、大量データを確認している。
- [ ] 権限がない操作はServer側でも拒否される。
- [ ] 既存デザインシステムに合わせている。
