# React Datasheet Grid API cheat sheet

This file is the detailed API reference to use when writing or reviewing code with `react-datasheet-grid`.

## Installation and base usage

```bash
npm i react-datasheet-grid
# or: pnpm add react-datasheet-grid
# or: yarn add react-datasheet-grid
```

Import the CSS once in the app root, not in every grid component:

```ts
import 'react-datasheet-grid/dist/style.css'
```

Basic controlled grid:

```tsx
'use client'

import { useMemo, useState } from 'react'
import {
  DataSheetGrid,
  checkboxColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import type { Column } from 'react-datasheet-grid'

type Row = {
  id: string
  active: boolean
  firstName: string | null
  lastName: string | null
}

export function PeopleGrid() {
  const [data, setData] = useState<Row[]>([
    { id: '1', active: true, firstName: 'Ada', lastName: 'Lovelace' },
    { id: '2', active: false, firstName: 'Grace', lastName: 'Hopper' },
  ])

  const columns = useMemo<Column<Row>[]>(
    () => [
      { ...keyColumn<Row, 'active'>('active', checkboxColumn), title: 'Active' },
      { ...keyColumn<Row, 'firstName'>('firstName', textColumn), title: 'First name' },
      { ...keyColumn<Row, 'lastName'>('lastName', textColumn), title: 'Last name' },
    ],
    []
  )

  return <DataSheetGrid<Row> value={data} onChange={setData} columns={columns} rowKey="id" />
}
```

## Package root exports

Use these from the package root:

```ts
import {
  DataSheetGrid,
  DynamicDataSheetGrid,
  textColumn,
  createTextColumn,
  checkboxColumn,
  floatColumn,
  intColumn,
  percentColumn,
  dateColumn,
  isoDateColumn,
  keyColumn,
  createAddRowsComponent,
  createContextMenuComponent,
  renderContextMenuItem,
} from 'react-datasheet-grid'

import type {
  AddRowsComponentProps,
  CellComponent,
  CellProps,
  Column,
  ContextMenuComponentProps,
  ContextMenuItem,
  DataSheetGridProps,
  DataSheetGridRef,
  SimpleColumn,
} from 'react-datasheet-grid'
```

Do not import from internal `dist` paths unless debugging type declarations.

## Grid components

### `DataSheetGrid<T>`

Default component. It is **static by default**: non-primitive props such as arrays, objects, and functions are captured on the first render and do not update afterward. This is good for performance and lets inline props avoid unnecessary re-renders.

Use it when columns and callback implementations do not need to change after first render.

### `DynamicDataSheetGrid<T>`

Use when non-primitive props must change after first render, for example when columns are user-configurable. When using this component, memoize arrays and functions:

```tsx
const columns = useMemo<Column<Row>[]>(() => buildColumns(schema), [schema])
const createRow = useCallback((): Row => ({ id: newId(), name: null }), [])

return (
  <DynamicDataSheetGrid<Row>
    value={data}
    onChange={setData}
    columns={columns}
    createRow={createRow}
  />
)
```

## Built-in columns

Rows can be primitive values for a single-column grid, but real apps usually use object rows and `keyColumn`.

| Column | Typical value type | Notes |
|---|---:|---|
| `textColumn` | `string | null` | Text input. Empty/deleted values are usually `null`. |
| `checkboxColumn` | `boolean` | Toggles on focus/Enter. Copies `YES` / `NO`; common falsy paste strings become `false`. |
| `intColumn` | `number | null` | Right-aligned integer. Parses and rounds numeric input. |
| `floatColumn` | `number | null` | Right-aligned number. Parses numeric input. |
| `percentColumn` | `number | null` | Displays with `Intl.NumberFormat(..., { style: 'percent' })`; typed input is converted as a percentage. Verify paste behavior for your domain. |
| `dateColumn` | `Date | null` | Uses `Date` objects. Good for purely client-side data. |
| `isoDateColumn` | `string | null` | Stores ISO date strings such as `YYYY-MM-DD`. Prefer this for server-loaded Next.js data. |

### `createTextColumn<T>(options)`

Use to customize text-like columns:

```ts
const currencyColumn = createTextColumn<number | null>({
  alignRight: true,
  deletedValue: null,
  parseUserInput: (value) => {
    const n = Number(value.replace(/,/g, ''))
    return Number.isFinite(n) ? n : null
  },
  formatBlurredInput: (value) =>
    typeof value === 'number' ? new Intl.NumberFormat('ja-JP').format(value) : '',
  formatInputOnFocus: (value) => (value == null ? '' : String(value)),
  formatForCopy: (value) => (value == null ? '' : String(value)),
  parsePastedValue: (value) => {
    const n = Number(value.replace(/,/g, ''))
    return Number.isFinite(n) ? n : null
  },
})
```

Options include:

- `placeholder?: string`
- `alignRight?: boolean`
- `continuousUpdates?: boolean`
- `deletedValue?: T`
- `parseUserInput?: (value: string) => T`
- `formatBlurredInput?: (value: T) => string`
- `formatInputOnFocus?: (value: T) => string`
- `formatForCopy?: (value: T) => string`
- `parsePastedValue?: (value: string) => T`

## `keyColumn`

`keyColumn('field', column)` adapts a column that edits a single value so it can edit one key of an object row. It also improves rendering because the cell receives only the relevant property rather than the entire row object.

```tsx
const columns: Column<Row>[] = [
  { ...keyColumn<Row, 'name'>('name', textColumn), title: 'Name' },
  { ...keyColumn<Row, 'age'>('age', intColumn), title: 'Age' },
]
```

`keyColumn` wraps `copyValue`, `deleteValue`, `pasteValue`, `disabled`, `cellClassName`, and `isCellEmpty` so those functions receive the keyed value.

## Grid props

### Data

- `value?: T[]` — controlled row array.
- `onChange?: (value: T[], operations: Operation[]) => void` — receives new rows and an operation list.

`Operation`:

```ts
type Operation = {
  type: 'UPDATE' | 'DELETE' | 'CREATE'
  fromRowIndex: number
  toRowIndex: number // exclusive
}
```

For `DELETE`, row indexes refer to the old `value`, not the new value.

### Columns

- `columns?: Partial<Column<T, any, any>>[]` — main columns.
- `gutterColumn?: SimpleColumn<T, any> | false` — left gutter / row-number column. Pass `false` to hide.
- `stickyRightColumn?: SimpleColumn<T, any>` — right sticky action column, often for row actions.

Example sticky delete button:

```tsx
<DataSheetGrid<Row>
  value={data}
  onChange={setData}
  columns={columns}
  stickyRightColumn={{
    component: ({ deleteRow }) => <button type="button" onClick={deleteRow}>Delete</button>,
  }}
/>
```

### Size

- `height?: number` — max grid height in px; content scrolls when longer.
- `rowHeight?: number | ((opt: { rowData: T; rowIndex: number }) => number)` — docs usually show a number; current types also allow a function.
- `headerRowHeight?: number` — set `0` to hide the header.

### Options

- `lockRows?: boolean` — blocks adding/removing rows, including shortcuts and large paste operations.
- `autoAddRow?: boolean` — adds a row when pressing Enter while editing the last row; irrelevant if `lockRows` is true.
- `disableContextMenu?: boolean` — disables right-click context menu; automatically true when `lockRows` is true.
- `disableExpandSelection?: boolean` — disables dragging the selection corner to expand.
- `disableSmartDelete?: boolean` — controls smart deletion of empty cells/rows.

### Styling

- `className?: string` — outer div class.
- `style?: React.CSSProperties` — outer div style.
- `rowClassName?: string | ((opt: { rowData: T; rowIndex: number }) => string | undefined)`.
- `cellClassName?: string | ((opt: { rowData: unknown; rowIndex: number; columnId?: string }) => string | undefined)`.

### Row behavior

- `rowKey?: string | ((opts: { rowData: T; rowIndex: number }) => string)` — use a stable ID, not the index, when rows are inserted/deleted.
- `createRow?: () => T` — default values and IDs for newly inserted/appended rows.
- `duplicateRow?: (opts: { rowData: T; rowIndex: number }) => T` — clone behavior; assign a fresh ID if using `rowKey`.

### Customizable components

- `addRowsComponent?: ((props: AddRowsComponentProps) => React.ReactElement | null) | false`.
- `contextMenuComponent?: (props: ContextMenuComponentProps) => React.ReactElement | null`.

### Callbacks

- `onFocus?: (opts: { cell: CellWithId }) => void` — cell starts editing.
- `onBlur?: (opts: { cell: CellWithId }) => void` — cell stops editing.
- `onActiveCellChange?: (opts: { cell: CellWithId | null }) => void` — active/highlighted cell changes.
- `onSelectionChange?: (opts: { selection: SelectionWithId | null }) => void` — selection rectangle changes.
- `onScroll?: React.UIEventHandler<HTMLDivElement>` — use for infinite scroll.

Cell with id:

```ts
type CellWithId = { colId?: string; col: number; row: number }
type SelectionWithId = { min: CellWithId; max: CellWithId }
```

## Column object props

Columns are simple objects. Use spread to override built-ins:

```tsx
{
  ...keyColumn<Row, 'firstName'>('firstName', textColumn),
  title: 'First name',
  minWidth: 180,
  disabled: ({ rowData }) => !rowData.active,
}
```

### Header and id

- `title?: React.ReactNode` — header content.
- `id?: string` — unique column ID. Enables ref selection by column id.

### Sizing

- `basis?: number` — initial width in px before flex growth/shrink.
- `grow?: number` — flex-grow factor.
- `shrink?: number` — flex-shrink factor.
- `minWidth?: number` — default is typically 100.
- `maxWidth?: number` — maximum width.
- `width?: string | number` — deprecated; prefer flex-style properties.

### Copy/paste/delete

- `copyValue?: ({ rowData, rowIndex }) => number | string | null`.
- `pasteValue?: ({ rowData, value, rowIndex }) => T`.
- `prePasteValues?: (values: string[]) => any[] | Promise<any[]>` — batch preprocess pasted values for one column; useful for async mapping labels to IDs.
- `deleteValue?: ({ rowData, rowIndex }) => T` — used for cut, clear, and delete row operations.

Make sure `pasteValue` can handle everything `copyValue` returns.

### Rendering

- `component?: CellComponent<T, C>` — cell renderer.
- `columnData?: C` — options/data passed to every cell in this column.
- `headerClassName?: string` — header cell class.
- `cellClassName?: string | (({ rowData, rowIndex, columnId }) => string | undefined)` — per-cell class.

### Options and behavior

- `disabled?: boolean | (({ rowData, rowIndex }) => boolean)` — disabled cells cannot edit/paste/delete but can be copied.
- `disableKeys?: boolean` — while editing, prevents DSG from consuming up/down/Enter. Use for selects, steppers, and widgets that handle keys themselves; call `stopEditing` manually.
- `keepFocus?: boolean` — keep editing when interacting with portals/overlays outside the cell; call `stopEditing` manually to release focus.
- `isCellEmpty?: ({ rowData, rowIndex }) => boolean` — controls whether Del can delete rows. Default effectively treats cells as non-empty; implement for smart row deletion.

## Cell component props

```ts
type CellProps<T, C> = {
  rowData: T
  setRowData: (rowData: T) => void
  rowIndex: number
  columnIndex: number
  columnData: C
  active: boolean
  focus: boolean
  disabled: boolean
  stopEditing: (opts?: { nextRow?: boolean }) => void
  insertRowBelow: () => void
  duplicateRow: () => void
  deleteRow: () => void
  getContextMenuItems: () => ContextMenuItem[]
}
```

Guidelines:

- Render from `rowData`; update with `setRowData`.
- Hide placeholders or heavy UI when `active` is false.
- Avoid pointer interactions when `focus` is false: `pointerEvents: focus ? undefined : 'none'`.
- Use `stopEditing({ nextRow: false })` for toggles, menus, and portals that should keep the active cell in place.
- Wrap custom cell components with `React.memo` unless extremely trivial.

## Ref API

```tsx
const ref = useRef<DataSheetGridRef>(null)

<DataSheetGrid<Row> ref={ref} value={data} onChange={setData} columns={columns} />

ref.current?.setActiveCell({ col: 'firstName', row: 0 })
ref.current?.setSelection({
  min: { col: 'firstName', row: 0 },
  max: { col: 2, row: 3 },
})
```

- `activeCell: CellWithId | null`.
- `selection: SelectionWithId | null`.
- `setActiveCell(activeCell: { col: number | string; row: number } | null): void`.
- `setSelection(selection: { min: { col: number | string; row: number }; max: { col: number | string; row: number } } | null): void`.

Use column ids for stability when columns are reorderable or dynamic.

## Add rows component

Translation-only helper:

```tsx
const AddRows = createAddRowsComponent({
  button: '追加',
  unit: '行',
})

<DataSheetGrid<Row> addRowsComponent={AddRows} />
```

Custom component:

```tsx
function AddRows({ addRows }: AddRowsComponentProps) {
  return <button type="button" onClick={() => addRows(5)}>5行追加</button>
}

<DataSheetGrid<Row> addRowsComponent={AddRows} />
```

Pass `addRowsComponent={false}` to hide it.

## Context menu component

Translation-only helper:

```tsx
const ContextMenu = createContextMenuComponent((item: ContextMenuItem) => {
  switch (item.type) {
    case 'INSERT_ROW_BELLOW':
      return <>下に行を挿入</>
    case 'DELETE_ROW':
      return <>行を削除</>
    case 'DELETE_ROWS':
      return <>{item.toRow - item.fromRow} 行を削除</>
    case 'DUPLICATE_ROW':
      return <>行を複製</>
    case 'DUPLICATE_ROWS':
      return <>{item.toRow - item.fromRow} 行を複製</>
    case 'COPY':
      return <>コピー</>
    case 'CUT':
      return <>切り取り</>
    case 'PASTE':
      return <>貼り付け</>
    default:
      return renderContextMenuItem(item)
  }
})

<DataSheetGrid<Row> contextMenuComponent={ContextMenu} />
```

`INSERT_ROW_BELLOW` is the library's exported type spelling; do not “fix” it to `BELOW` in code.

Custom component signature:

```ts
type ContextMenuComponentProps = {
  clientX: number
  clientY: number
  items: ContextMenuItem[]
  cursorIndex: { col: number; row: number }
  close: () => void
}
```

## Keyboard and UX features to test

- Arrow navigation.
- Tab / Shift+Tab.
- Shift+Arrow multi-select.
- Ctrl/Cmd+Arrow and Ctrl/Cmd+Shift+Arrow.
- Esc blur.
- Enter / F2 edit.
- Shift+Enter insert row below.
- Ctrl/Cmd+D duplicate rows.
- Backspace / Del clear cells and smart-delete rows.
- Ctrl/Cmd+A select all.
- Right-click or Ctrl+Left-click context menu.
- Copy/paste to and from Excel or Google Sheets.
- Drag selection corner unless disabled.
