# Custom columns and recipes

Use this file when the built-in columns are not enough or when implementing common application patterns.

## Custom column pattern

A column is an object. A cell renderer receives `CellProps`.

```tsx
import React from 'react'
import type { CellProps, Column } from 'react-datasheet-grid'

type RatingOptions = { max: number }

const RatingCell = React.memo(function RatingCell({
  rowData,
  setRowData,
  focus,
  disabled,
  columnData,
  stopEditing,
}: CellProps<number | null, RatingOptions>) {
  return (
    <select
      disabled={disabled}
      value={rowData ?? ''}
      style={{ pointerEvents: focus ? undefined : 'none' }}
      onChange={(event) => {
        setRowData(event.target.value === '' ? null : Number(event.target.value))
        stopEditing({ nextRow: false })
      }}
    >
      <option value="">-</option>
      {Array.from({ length: columnData.max }, (_, index) => index + 1).map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  )
})

export function ratingColumn(max = 5): Column<number | null, RatingOptions> {
  return {
    component: RatingCell,
    columnData: { max },
    disableKeys: true,
    deleteValue: () => null,
    copyValue: ({ rowData }) => (rowData == null ? null : String(rowData)),
    pasteValue: ({ value }) => {
      const n = Number(value)
      return Number.isInteger(n) && n >= 1 && n <= max ? n : null
    },
    isCellEmpty: ({ rowData }) => rowData == null,
  }
}
```

Checklist for custom columns:

- Wrap cell component with `React.memo`.
- Read current value from `rowData`.
- Update with `setRowData`.
- Use `columnData` for options.
- Hide visual noise when `active` is false.
- Avoid pointer interaction when `focus` is false.
- Use `disableKeys` when the widget needs arrow/Enter keys.
- Use `keepFocus` for portals/popovers and manually call `stopEditing`.
- Implement `deleteValue`, `copyValue`, `pasteValue`, and `isCellEmpty`.
- Use `keyColumn` to apply the column to an object-row property.

## Select column with `react-select`

Install:

```bash
npm i react-select
```

Important Next.js details:

- This must be in a Client Component file.
- Guard `document.body` for `menuPortalTarget`.
- Use `menuIsOpen={focus}`, `disableKeys: true`, and `keepFocus: true`.
- Call `setTimeout(stopEditing, 0)` after `onChange` so React Select can finish its own event handling.

See `examples/components/SelectColumn.tsx` for a complete implementation.

Usage with object rows:

```tsx
const columns: Column<Row>[] = [
  {
    ...keyColumn<Row, 'flavor'>('flavor', selectColumn({
      choices: [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
      ],
    })),
    title: 'Flavor',
    minWidth: 180,
  },
]
```

## Default values for new and duplicated rows

Use `createRow` and `duplicateRow`:

```tsx
<DataSheetGrid<Row>
  value={data}
  onChange={setData}
  columns={columns}
  createRow={() => ({ id: newId(), age: 25, date: new Date() })}
  duplicateRow={({ rowData }) => ({ ...rowData, id: newId(), copied: true })}
  rowKey="id"
/>
```

## Unique IDs and stable row keys

Use stable IDs whenever users can insert/delete/duplicate rows:

```tsx
<DataSheetGrid<Row>
  rowKey="id"
  createRow={() => ({ id: newId(), name: null })}
  duplicateRow={({ rowData }) => ({ ...rowData, id: newId() })}
/>
```

Do not rely on row index keys in editable grids unless rows are never reordered, inserted, or deleted.

## Track created, updated, and deleted rows

Use the second argument of `onChange`:

```tsx
const createdIds = useMemo(() => new Set<string>(), [])
const updatedIds = useMemo(() => new Set<string>(), [])
const deletedIds = useMemo(() => new Set<string>(), [])

<DataSheetGrid<Row>
  value={data}
  onChange={(newValue, operations) => {
    for (const operation of operations) {
      if (operation.type === 'CREATE') {
        newValue
          .slice(operation.fromRowIndex, operation.toRowIndex)
          .forEach((row) => createdIds.add(row.id))
      }

      if (operation.type === 'UPDATE') {
        newValue
          .slice(operation.fromRowIndex, operation.toRowIndex)
          .forEach((row) => {
            if (!createdIds.has(row.id) && !deletedIds.has(row.id)) {
              updatedIds.add(row.id)
            }
          })
      }

      if (operation.type === 'DELETE') {
        data
          .slice(operation.fromRowIndex, operation.toRowIndex)
          .forEach((row) => {
            updatedIds.delete(row.id)
            if (createdIds.has(row.id)) {
              createdIds.delete(row.id)
            } else {
              deletedIds.add(row.id)
            }
          })
      }
    }

    setData(newValue)
  }}
/>
```

For deleted rows, indices refer to the old `data` array, not `newValue`.

## Row styling for change tracking

```tsx
<DataSheetGrid<Row>
  rowClassName={({ rowData }) => {
    if (deletedIds.has(rowData.id)) return 'row-deleted'
    if (createdIds.has(rowData.id)) return 'row-created'
    if (updatedIds.has(rowData.id)) return 'row-updated'
  }}
/>
```

```css
.row-deleted .dsg-cell { background: #fff1f0; }
.row-created .dsg-cell { background: #f6ffed; }
.row-updated .dsg-cell { background: #fff7e6; }
```

## Internationalization

### Row numbers / gutter column

Override `gutterColumn.component`:

```tsx
import type { CellProps } from 'react-datasheet-grid'

function RowNumber({ rowIndex }: CellProps<unknown, unknown>) {
  return <>{new Intl.NumberFormat('ja-JP').format(rowIndex + 1)}</>
}

<DataSheetGrid<Row>
  gutterColumn={{ basis: 64, component: RowNumber }}
/>
```

### Add rows label

```tsx
const AddRows = createAddRowsComponent({ button: '追加', unit: '行' })

<DataSheetGrid<Row> addRowsComponent={AddRows} />
```

### Context menu labels

```tsx
const ContextMenu = createContextMenuComponent((item) => {
  if (item.type === 'DELETE_ROW') return <>行を削除</>
  if (item.type === 'COPY') return <>コピー</>
  return renderContextMenuItem(item)
})

<DataSheetGrid<Row> contextMenuComponent={ContextMenu} />
```

## Styling

Use class props for conditional styling:

```tsx
<DataSheetGrid<Row>
  className="orders-grid"
  rowClassName={({ rowData }) => rowData.status === 'error' ? 'row-error' : undefined}
  cellClassName={({ columnId }) => columnId === 'amount' ? 'cell-number' : undefined}
/>
```

Use DSG CSS custom properties globally or on a class:

```css
.orders-grid {
  --dsg-selection-border-color: tomato;
  --dsg-selection-border-radius: 4px;
  --dsg-cell-background-color: white;
  --dsg-cell-disabled-background-color: #f5f5f5;
}
```

Known CSS custom properties include:

- `--dsg-border-color`
- `--dsg-selection-border-color`
- `--dsg-selection-border-radius`
- `--dsg-selection-border-width`
- `--dsg-selection-background-color`
- `--dsg-selection-disabled-border-color`
- `--dsg-selection-disabled-background-color`
- `--dsg-corner-indicator-width`
- `--dsg-header-text-color`
- `--dsg-header-active-text-color`
- `--dsg-cell-background-color`
- `--dsg-cell-disabled-background-color`
- `--dsg-transition-duration`
- `--dsg-expand-rows-indicator-width`
- `--dsg-scroll-shadow-width`
- `--dsg-scroll-shadow-color`

More specific classes are prefixed with `.dsg-`.

## Performance

- Use `DataSheetGrid` static mode by default.
- Use `DynamicDataSheetGrid` only when non-primitive props need to change.
- With `DynamicDataSheetGrid`, memoize all object/function props.
- Wrap custom cell components with `React.memo`.
- Use `keyColumn` so custom cells receive only their field value.
- Use stable `rowKey`.
- Avoid heavyweight render work in every cell. Move options into `columnData` and memoize outside cells.

## Controlling the grid from a parent

```tsx
const gridRef = useRef<DataSheetGridRef>(null)

<DataSheetGrid<Row> ref={gridRef} value={data} onChange={setData} columns={columns} />

<button
  type="button"
  onClick={() => gridRef.current?.setActiveCell({ col: 'firstName', row: 0 })}
>
  Focus first name
</button>
```

Use `setSelection(null)` or `setActiveCell(null)` to blur.

## Collapsible rows

DSG does not provide nested/collapsible rows natively. Implement by flattening nested data before passing it to DSG:

1. Keep nested source data in state.
2. Keep `openedGroups` in state.
3. Build `rows` with `useMemo` where each row has `type: 'GROUP' | 'CHILD'` plus indexes.
4. Disable child-only columns on group rows and group-only columns on child rows.
5. In `onChange`, map `UPDATE`, `CREATE`, and `DELETE` operations back to nested source data.

Skeleton:

```tsx
const rows = useMemo<Row[]>(() => {
  const result: Row[] = []
  groups.forEach((group, groupIndex) => {
    result.push({ type: 'GROUP', groupIndex, name: group.name, opened: openedGroups.includes(groupIndex) })
    if (openedGroups.includes(groupIndex)) {
      group.children.forEach((child, childIndex) => {
        result.push({ type: 'CHILD', groupIndex, childIndex, ...child })
      })
    }
  })
  return result
}, [groups, openedGroups])
```

## Infinite scroll

Use `onScroll` and fetch more when near the bottom:

```tsx
const fetchMoreOnBottomReached = useCallback<React.UIEventHandler<HTMLDivElement>>(
  (event) => {
    const target = event.target as HTMLDivElement
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 300
    if (nearBottom && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  },
  [fetchNextPage, hasNextPage, isFetching]
)

<DataSheetGrid<Row>
  value={rows}
  onChange={setRows}
  columns={columns}
  height={500}
  onScroll={fetchMoreOnBottomReached}
/>
```

Pair this with TanStack Query / React Query or the project's existing data-fetching layer.
