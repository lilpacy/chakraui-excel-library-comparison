# Component Catalog: TanStack Table + Next.js

TanStack Tableはヘッドレスライブラリです。このため「コンポーネントの種類」は、公式Core APIオブジェクト、列定義の種類、React/Next.jsで実装するUI部品の3層で考えます。

## 1. TanStack Table Core APIオブジェクト

| 種類 | 役割 | よく使うAPI/使い方 | 実装時の注意 |
|---|---|---|---|
| `ColumnDef<TData, TValue>` | 列の設定。データ抽出、header/cell/footerテンプレート、feature設定の入口 | `accessorKey`, `accessorFn`, `id`, `header`, `cell`, `footer`, `columns`, `enableSorting`, `enableHiding`, `filterFn`, `meta` | 最重要。`TData`に型を合わせる。display列は`id`必須にする。 |
| `Table<TData>` / table instance | 状態とAPIを持つ中核オブジェクト。`useReactTable`で作る | `getHeaderGroups()`, `getRowModel()`, `getState()`, `setPageIndex()`, `getCanNextPage()`, `getAllColumns()` | 実DOMの`<table>`ではない。状態管理・行モデル計算のAPI。 |
| Table Data / `TData[]` | 行データの元配列 | `data` optionに渡す | Client Componentに渡す場合はシリアライズ可能にする。DateやDecimal等は文字列化を検討。 |
| `Column<TData, TValue>` | ColumnDefから作られる列インスタンス | `column.getCanSort()`, `column.toggleSorting()`, `column.getIsSorted()`, `column.getCanHide()`, `column.toggleVisibility()`, `column.getFilterValue()` | UI部品（列ヘッダー、表示切替、フィルタ）で使う。 |
| `HeaderGroup<TData>` | ネスト列・グループ列を描画するためのヘッダー行 | `table.getHeaderGroups().map(group => group.headers)` | `colSpan`を設定する。複数段ヘッダーに必須。 |
| `Header<TData, TValue>` | 個々のヘッダーセル | `header.isPlaceholder`, `header.colSpan`, `header.column`, `header.getContext()` | `flexRender(header.column.columnDef.header, header.getContext())`で描画。 |
| `Row<TData>` | 行インスタンス。元データ、選択、展開、可視セルなどを持つ | `row.original`, `row.id`, `row.getVisibleCells()`, `row.getIsSelected()`, `row.toggleSelected()`, `row.getCanExpand()` | `getRowId`を設定しないとindexベースIDになりがち。選択や更新では安定ID推奨。 |
| `Cell<TData, TValue>` | 個々のセル | `cell.column`, `cell.row`, `cell.getValue()`, `cell.getContext()` | `flexRender(cell.column.columnDef.cell, cell.getContext())`で描画。 |

## 2. ColumnDefの3分類

| 分類 | 使いどころ | 例 | 注意 |
|---|---|---|---|
| Accessor Column | データモデルを持つ列。sorting/filtering/grouping対象になる | `accessorKey: 'email'`、`accessorFn: row => row.user.name` | accessor値は原則プリミティブにする。複雑な表示は`cell`で整形。 |
| Display Column | データモデルを持たない表示専用列 | 行選択checkbox、行アクション、展開ボタン、ドラッグハンドル | sorting/filtering不可。`id`を明示する。 |
| Grouping Column | 複数列をグループ化する列 | `columns: [firstNameColumn, lastNameColumn]` | 複数段ヘッダーやフッターに使う。 |

## 3. 必須レンダリング関数・import

| import | 用途 |
|---|---|
| `useReactTable` | React adapterでtable instanceを作る。 |
| `getCoreRowModel` | 基本行モデル。必須。 |
| `flexRender` | `header`/`cell`/`footer`が文字列・React要素・関数のどれでも描画できるようにする。 |
| `ColumnDef` | 列定義の型。 |
| `SortingState`, `ColumnFiltersState`, `VisibilityState`, `PaginationState`, `RowSelectionState` | 制御stateの型。必要な機能だけimportする。 |
| `createColumnHelper` | 型安全にaccessor/display/group列を定義したい場合に使う。 |

## 4. Next.jsで実装するUIコンポーネントの種類

| コンポーネント/ファイル | Server/Client | 役割 | 使い方 |
|---|---|---|---|
| `app/<route>/page.tsx` | Server推奨 | データ取得、認可、DB/API呼び出し、search params解析 | `const data = await getRows()`してClient wrapperへ渡す。manual modeでは`searchParams`からsorting/filtering/pageを復元。 |
| `app/<route>/loading.tsx` | Server | ルート単位のローディングUI | Table skeletonを返す。 |
| `app/<route>/error.tsx` | Client | エラー境界 | retry UIを出す。 |
| `<Feature>TableClient.tsx` | Client | Serverから受けたデータを`DataTable`へ接続する境界 | `'use client'`を付け、`columns`と`DataTable`をimport。 |
| `columns.tsx` | Client寄り | `ColumnDef<TData>[]`を定義 | JSX、行アクション、checkbox、ソートヘッダーを含むならClient側に置く。単純な定義のみならClient moduleからimportされるようにする。 |
| `DataTable<TData, TValue>` | Client | `useReactTable`、state、table/header/body描画の本体 | 汎用コンポーネントとして`columns`と`data`を受ける。 |
| `DataTableColumnHeader` | Client | sortable/hidable column header | `column.toggleSorting()`、`column.getIsSorted()`、`column.getCanSort()`を使う。 |
| `DataTableToolbar` | Client | テーブル上部の操作領域 | global filter、column filter、faceted filter、bulk actions、resetを置く。 |
| `DataTableFilterInput` / `DebouncedInput` | Client | テキスト検索 | `column.setFilterValue(value)`または`table.setGlobalFilter(value)`。サーバー側ではdebounceしてURL更新。 |
| `DataTableFacetedFilter` | Client | ステータス・カテゴリなどの複数選択フィルタ | faceting row modelまたは固定optionsを使う。 |
| `DataTableViewOptions` | Client | 表示列切替 | `table.getAllColumns().filter(c => c.getCanHide())`と`column.toggleVisibility()`を使う。 |
| `DataTablePagination` | Client | ページングUI | `table.previousPage()`, `nextPage()`, `setPageIndex()`, `setPageSize()`など。manual modeではURL更新も行う。 |
| `DataTableRowSelectionCheckbox` / select column | Client | 行選択・全選択 | display columnとして`id: 'select'`を追加し、`row.toggleSelected()`を呼ぶ。 |
| `DataTableBulkActions` | Client | 選択行への一括操作 | `table.getSelectedRowModel().rows`またはrowSelection stateからIDを取得。manualPaginationではページ外選択IDに注意。 |
| `DataTableRowActions` | Client | 行単位メニュー | `row.original`を受けて編集、削除、詳細、コピーなどを提供。 |
| `DataTableExpandedRow` / `SubComponent` | Client | 展開行の詳細表示 | `row.getIsExpanded()`時に追加`<tr>`を描画。`colSpan={row.getVisibleCells().length}`。 |
| `DataTableEditableCell` | Client | インライン編集セル | `cell.getValue()`を初期値にし、blur/submitでServer Action/APIへ送る。optimistic updateを検討。 |
| `DataTableColumnResizeHandle` | Client | 列幅変更UI | `header.getResizeHandler()`、`column.getSize()`、`columnResizeMode`を使う。 |
| `DataTablePinnedStyles` | Client | 固定列/固定行のstyle算出 | `column.getIsPinned()`, `column.getStart('left')`, `column.getAfter('right')`などでsticky styleを作る。 |
| `DataTableVirtualizedRows` | Client | 大量行の仮想化 | TanStack Virtual等を併用。Tableのrow modelは表示対象計算、VirtualizerはDOM削減。 |
| `DataTableVirtualizedColumns` | Client | 大量列の仮想化 | 横スクロールと列サイズ管理を組み合わせる。実装難度が高いので専用部品化。 |
| `DataTableEmptyState` | Server/Client | 空データ表示 | `table.getRowModel().rows.length === 0`時に描画。 |
| `DataTableSkeleton` | Server/Client | loading placeholder | `loading.tsx`やSuspense fallbackで使う。 |
| `DataTableProvider` / custom hook | Client | 複数部品でtable instanceを共有 | コンポーネント分割が深い場合のみ導入。通常はpropsで十分。 |

## 5. UI部品ライブラリ別の扱い

- **shadcn/ui**: `Table`, `Button`, `DropdownMenu`, `Checkbox`, `Input`, `Select`, `Badge`等に置き換える。TanStack TableのAPIは変えない。
- **MUI/Chakra/Ant Design**: 表示部品だけ差し替える。`flexRender`、row model、state管理は同じ。
- **素のHTML**: `table`, `thead`, `tbody`, `tr`, `th`, `td`, `button`, `input`, `select`で実装する。最小依存に適している。

## 6. 最小構成と拡張構成

### 最小構成

```text
app/users/page.tsx                  # Server: data fetch
app/users/users-table-client.tsx    # Client: DataTableへ接続
app/users/columns.tsx               # Client: ColumnDef[]
components/data-table/data-table.tsx
```

### 実務構成

```text
app/users/page.tsx
app/users/loading.tsx
app/users/error.tsx
app/users/users-table-client.tsx
app/users/columns.tsx
components/data-table/data-table.tsx
components/data-table/data-table-column-header.tsx
components/data-table/data-table-toolbar.tsx
components/data-table/data-table-filter-input.tsx
components/data-table/data-table-faceted-filter.tsx
components/data-table/data-table-view-options.tsx
components/data-table/data-table-pagination.tsx
components/data-table/data-table-select-column.tsx
components/data-table/data-table-row-actions.tsx
components/data-table/data-table-empty-state.tsx
components/data-table/data-table-skeleton.tsx
```
