# Feature Matrix: TanStack Table v8/latest for Next.js

各機能を追加する時は、この表で必要なimport、state、table option、UI部品を確認します。

## Core / Rendering

| 機能 | import | state | table option | UI/API |
|---|---|---|---|---|
| 基本表示 | `useReactTable`, `getCoreRowModel`, `flexRender`, `ColumnDef` | なし | `data`, `columns`, `getCoreRowModel: getCoreRowModel()` | `table.getHeaderGroups()`, `table.getRowModel().rows`, `row.getVisibleCells()` |
| フッター | `flexRender` | なし | `footer` in ColumnDef | `table.getFooterGroups()`、`header.column.columnDef.footer` |
| ネスト/グループヘッダー | `ColumnDef` or `createColumnHelper` | なし | `columns: [...]` in grouping column | `header.colSpan`, `header.isPlaceholder` |
| 安定行ID | なし | なし | `getRowId: row => row.id` | row selection/update/deleteで必須級 |

## Sorting

| 項目 | 内容 |
|---|---|
| import | `getSortedRowModel`, `SortingState` |
| client-side state | `const [sorting, setSorting] = useState<SortingState>([])` |
| client-side options | `state: { sorting }`, `onSortingChange: setSorting`, `getSortedRowModel: getSortedRowModel()` |
| server-side/manual options | `manualSorting: true`。`getSortedRowModel`は不要または使わない。sorting stateをURL/API queryへ反映。 |
| ColumnDef options | `enableSorting`, `sortingFn`, `sortDescFirst`, `invertSorting`, `sortUndefined` |
| UI | `column.getCanSort()`, `column.getIsSorted()`, `column.toggleSorting()`, `column.getToggleSortingHandler()` |
| 注意 | Multi sortingはsorting stateが配列であることを活かす。サーバー側では`[{ id, desc }]`をAPI仕様へ変換。 |

## Column Filtering

| 項目 | 内容 |
|---|---|
| import | `getFilteredRowModel`, `ColumnFiltersState` |
| client-side state | `const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])` |
| client-side options | `state: { columnFilters }`, `onColumnFiltersChange: setColumnFilters`, `getFilteredRowModel: getFilteredRowModel()` |
| server-side/manual options | `manualFiltering: true`。filter stateをURL/API queryへ反映。 |
| ColumnDef options | `filterFn`, `enableColumnFilter`, `meta`でfilter UI情報を持たせてもよい。 |
| UI | `column.getFilterValue()`, `column.setFilterValue(value)`, `column.getCanFilter()` |
| 注意 | `accessorFn`でオブジェクトを返すと標準filter/sortが扱いにくい。プリミティブを返す。 |

## Global Filtering / Search

| 項目 | 内容 |
|---|---|
| import | `getFilteredRowModel`, `FilterFn`、必要なら`@tanstack/match-sorter-utils` |
| state | `const [globalFilter, setGlobalFilter] = useState('')` |
| options | `state: { globalFilter }`, `onGlobalFilterChange`, `globalFilterFn`, `getFilteredRowModel` |
| UI | debounced inputで`table.setGlobalFilter(value)` |
| server-side | `manualFiltering: true`、search queryをURL/APIへ。 |

## Fuzzy Filtering

| 項目 | 内容 |
|---|---|
| import | `rankItem`, `compareItems` from `@tanstack/match-sorter-utils`（導入する場合） |
| options | custom `filterFns: { fuzzy }`, `globalFilterFn: 'fuzzy'`など |
| UI | 通常のglobal/column filter input |
| 注意 | ランク情報を`addMeta`に入れてsortingへ使うことがある。依存追加を明示する。 |

## Faceting

| 項目 | 内容 |
|---|---|
| import | `getFacetedRowModel`, `getFacetedUniqueValues`, `getFacetedMinMaxValues` |
| options | faceted filter対象列に上記row modelを追加 |
| UI | `column.getFacetedUniqueValues()`で選択肢と件数、数値範囲は`getFacetedMinMaxValues()` |
| 注意 | server-sideではfacetsをAPIから返す設計も検討。client row modelだけではページ内値になる可能性。 |

## Pagination

| 項目 | 内容 |
|---|---|
| import | `getPaginationRowModel`, `PaginationState` |
| client-side state | `const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })` |
| client-side options | `state: { pagination }`, `onPaginationChange`, `getPaginationRowModel: getPaginationRowModel()` |
| server-side/manual options | `manualPagination: true`, `rowCount`または`pageCount`, `state.pagination`, `onPaginationChange` |
| UI | `table.getCanPreviousPage()`, `previousPage()`, `nextPage()`, `setPageIndex()`, `setPageSize()`, `getPageCount()` |
| 注意 | manualPagination時、tableに渡す`data`は現在ページ分だけ。row selectionはページ外IDをstateで持てるが`getSelectedRowModel()`は現在data基準。 |

## Row Selection

| 項目 | 内容 |
|---|---|
| import | `RowSelectionState`（必要なら） |
| state | `const [rowSelection, setRowSelection] = useState({})` |
| options | `state: { rowSelection }`, `onRowSelectionChange`, `enableRowSelection`, `getRowId` |
| UI | display columnでcheckbox。`table.toggleAllPageRowsSelected()`, `row.toggleSelected()`, `row.getIsSelected()` |
| APIs | `table.getSelectedRowModel()`, `getFilteredSelectedRowModel()`, `getGroupedSelectedRowModel()` |
| 注意 | DB更新や一括操作にはindexではなく安定IDを使う。 |

## Column Visibility

| 項目 | 内容 |
|---|---|
| import | `VisibilityState` |
| state | `const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})` |
| options | `state: { columnVisibility }`, `onColumnVisibilityChange` |
| ColumnDef | `enableHiding: false`で非表示不可にする |
| UI | `table.getAllColumns()`, `column.getCanHide()`, `column.getIsVisible()`, `column.toggleVisibility()` |
| render | `row.getVisibleCells()`と`table.getVisibleLeafColumns()`を使う。 |

## Column Ordering

| 項目 | 内容 |
|---|---|
| import | `ColumnOrderState` |
| state | `const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])` |
| options | `state: { columnOrder }`, `onColumnOrderChange` |
| UI | DnD、左右移動ボタン、設定画面 |
| 注意 | display column（select/actions）を固定位置にしたい場合はorder/pinningと合わせる。 |

## Column Pinning

| 項目 | 内容 |
|---|---|
| import | `ColumnPinningState` |
| state | `const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({ left: [], right: [] })` |
| options | `state: { columnPinning }`, `onColumnPinningChange`, `enableColumnPinning` |
| UI | `column.pin('left')`, `column.pin('right')`, `column.pin(false)`, `column.getIsPinned()` |
| style | sticky CSS。`column.getStart('left')`, `column.getAfter('right')`, `column.getSize()`で位置計算。 |
| 注意 | 横スクロール、z-index、背景色、影、列サイズとセットで調整。 |

## Column Sizing / Resizing

| 項目 | 内容 |
|---|---|
| import | `ColumnSizingState`（制御する場合） |
| state | `columnSizing`, `columnSizingInfo`を制御可能 |
| options | `enableColumnResizing`, `columnResizeMode: 'onChange' | 'onEnd'`, `columnResizeDirection` |
| ColumnDef | `size`, `minSize`, `maxSize` |
| UI | `header.getResizeHandler()`, `column.getSize()`, `header.column.getIsResizing()` |
| 注意 | 大量列ではCSS variablesやmemo化でパフォーマンスを確保。 |

## Grouping / Aggregation

| 項目 | 内容 |
|---|---|
| import | `getGroupedRowModel`, `getExpandedRowModel`, `GroupingState` |
| state | `const [grouping, setGrouping] = useState<GroupingState>([])` |
| options | `state: { grouping }`, `onGroupingChange`, `getGroupedRowModel`, `getExpandedRowModel` |
| ColumnDef | `enableGrouping`, `aggregationFn`, `aggregatedCell`, `groupedCell` |
| UI | `column.toggleGrouping()`, `row.getIsGrouped()`, `cell.getIsAggregated()`, `cell.getIsPlaceholder()` |
| 注意 | groupingはexpandedと一緒に使う場面が多い。 |

## Expanding / Sub Components

| 項目 | 内容 |
|---|---|
| import | `getExpandedRowModel`, `ExpandedState` |
| state | `const [expanded, setExpanded] = useState<ExpandedState>({})` |
| options | `state: { expanded }`, `onExpandedChange`, `getExpandedRowModel`, `getSubRows`, `getRowCanExpand` |
| UI | display columnで展開ボタン。`row.getCanExpand()`, `row.getIsExpanded()`, `row.toggleExpanded()` |
| sub component | `row.getIsExpanded()`時に追加`tr`を描画し、`td colSpan={row.getVisibleCells().length}`。 |
| 注意 | ツリー構造なら`getSubRows`、詳細パネルなら`getRowCanExpand`とsub row描画。 |

## Row Pinning

| 項目 | 内容 |
|---|---|
| import | `RowPinningState` |
| state | `const [rowPinning, setRowPinning] = useState<RowPinningState>({ top: [], bottom: [] })` |
| options | `state: { rowPinning }`, `onRowPinningChange`, `keepPinnedRows` |
| UI | `row.pin('top')`, `row.pin('bottom')`, `row.pin(false)`, `row.getIsPinned()` |
| render | top/center/bottom row modelを分けて描画する実装を検討。 |

## Row DnD

| 項目 | 内容 |
|---|---|
| import | TanStack Table側はdisplay columnとrow model。DnDは`@dnd-kit`等を併用。 |
| state | dataの並び順、またはserver-side order field |
| UI | drag handle display column |
| 注意 | row.idを安定化。ページング・ソート中のDnD仕様を明確にする。 |

## Editable Data

| 項目 | 内容 |
|---|---|
| import | Table coreに専用importは不要。必要ならmodule augmentationで`table.options.meta`に更新関数を置く。 |
| state | local draft、optimistic state、mutation state |
| options | `meta: { updateData }`など |
| UI | input/selectをcellに描画、blur/enterで保存 |
| 注意 | Server Action/API、バリデーション、失敗時rollback、ページ跨ぎ更新、権限を設計。 |

## Virtualization

| 項目 | 内容 |
|---|---|
| import | TanStack Table + `@tanstack/react-virtual`等 |
| state | scroll container ref、virtualizer state |
| options | Tableは通常のrow model。Virtualizerで描画DOMだけ削減。 |
| UI | fixed height container、推定行高、absolute/transform配置など |
| 注意 | paginationとvirtualizationは代替関係になることが多い。sticky header/column pinning/row height可変時は難度高。 |

## Fully Controlled / Server-side Manual Mode

| 項目 | 内容 |
|---|---|
| state | `sorting`, `columnFilters`, `globalFilter`, `pagination`, `columnVisibility`等を外部管理 |
| table options | `manualSorting`, `manualFiltering`, `manualPagination`, `rowCount`/`pageCount`, `state`, `on*Change` |
| URL同期 | Next.js `useRouter`, `usePathname`, `useSearchParams`でqueryを更新。Server pageでqueryを読んでfetch。 |
| 注意 | debounce、replace vs push、scroll抑制、戻る/進む、初期state復元を考える。 |

## Custom Features

| 項目 | 内容 |
|---|---|
| 用途 | 独自のtable/column/row/cell APIを追加したい場合 |
| 方法 | TanStack Tableのcustom feature拡張を使う、または薄いwrapper/hookで実装する |
| 注意 | まずは`meta`や外部hookで足りるか検討。core拡張は保守コストが高い。 |
