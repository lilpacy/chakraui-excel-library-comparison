# Official Examples Coverage

TanStack Table公式Examplesに出てくる実装パターンを、Next.jsでどう扱うかの対応表です。機能追加依頼では、この表も確認して漏れを防ぎます。

| 公式Example | Next.jsでの用途 | 主な実装部品 |
|---|---|---|
| Basic | 最小テーブル | `DataTable`, `columns`, `getCoreRowModel`, `flexRender` |
| Header Groups | 複数段ヘッダー | Grouping Column、`header.colSpan`, `header.isPlaceholder` |
| Column Filters | 列ごとの検索/絞り込み | `DataTableFilterInput`, `ColumnFiltersState`, `getFilteredRowModel` |
| Column Filters (Faceted) | ステータス/カテゴリの候補付き絞り込み | `DataTableFacetedFilter`, faceting row models |
| Fuzzy Search Filters | あいまい検索 | global/column filter、`@tanstack/match-sorter-utils` |
| Column Ordering | 列順変更 | `columnOrder` state、列設定UI |
| Column Ordering (DnD) | ドラッグで列順変更 | DnDライブラリ、`columnOrder` state |
| Column Pinning | 左右固定列 | `columnPinning` state、pin操作UI |
| Sticky Column Pinning | sticky CSS付き固定列 | sticky style helper、z-index、背景色、列幅 |
| Column Sizing | 列幅設定 | `size`, `minSize`, `maxSize`, `column.getSize()` |
| Performant Column Resizing | 高速な列リサイズ | CSS variables、memo化、`columnResizeMode` |
| Column Visibility | 表示列切替 | `DataTableViewOptions`, `columnVisibility` state |
| Editable Data | インライン編集 | `DataTableEditableCell`, `table.options.meta.updateData`, mutation |
| Expanding | ツリー/展開行 | `expanded` state、`getExpandedRowModel`, expander column |
| Sub Components | 行詳細パネル | `DataTableExpandedRow`, 追加`tr`, `colSpan` |
| Fully Controlled | 外部状態管理 | state全体を外部管理、URL/Store連携 |
| Grouping | グループ化/集計 | `grouping` state、`getGroupedRowModel`, aggregation |
| Pagination | client-sideページング | `DataTablePagination`, `getPaginationRowModel` |
| Pagination Controlled | server/API連携ページング | `manualPagination`, `rowCount`, URL/API query |
| Row DnD | 行並び替え | drag handle display column、安定row ID |
| Row Pinning | 上下固定行 | `rowPinning` state、top/bottom row rendering |
| Row Selection | checkbox選択 | select display column、`rowSelection` state |
| Sorting | 列ソート | `DataTableColumnHeader`, `SortingState`, `getSortedRowModel` |
| Virtualized Columns | 大量列 | `@tanstack/react-virtual`, 横スクロール、列サイズ |
| Virtualized Columns (Experimental) | 実験的な大量列 | 公式差分を確認し、production投入は慎重に判断 |
| Virtualized Rows | 大量行 | `@tanstack/react-virtual`, fixed/estimated row height |
| Virtualized Rows (Experimental) | 実験的な大量行 | 可変高さ/ブラウザ互換を検証 |
| Virtualized Infinite Scrolling | 無限スクロール | TanStack Query/SWR、Intersection/virtualizer、cursor pagination |
| Kitchen Sink | 複合機能 | 機能の相互作用確認用。必要機能だけ抽出する |
| React Bootstrap | UIライブラリ統合 | markupをReact Bootstrapに差し替え |
| Material UI Pagination | MUI連携 | MUI Table/Pagination部品に差し替え |
| React Full Width | 横幅いっぱいの表 | container/column sizing/scroll設計 |
| React Full Width Resizable | full width + resize | column sizingとlayout CSS |
| Custom Features | 独自機能拡張 | `meta`、wrapper hook、またはcustom feature API |
| Query Router Search Params | URL search params同期 | Next.js `useSearchParams`/`useRouter`またはTanStack Router相当 |

## 使い方

1. ユーザー要件から該当Exampleを選ぶ。
2. `references/feature-matrix.md`で必要なstate/import/optionsを確認する。
3. Next.jsでは`references/nextjs-patterns.md`に従ってServer/Client境界へ割り当てる。
4. 公式Exampleをそのまま貼るのではなく、プロジェクトのUIライブラリ・認可・データ取得方法に合わせて移植する。
