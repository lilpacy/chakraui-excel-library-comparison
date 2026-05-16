'use client'

import type { ColumnDef } from '@tanstack/react-table'

export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Select all rows on this page"
        checked={table.getIsAllPageRowsSelected()}
        ref={(input) => {
          if (input) input.indeterminate = table.getIsSomePageRowsSelected()
        }}
        onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label="Select row"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        ref={(input) => {
          if (input) input.indeterminate = row.getIsSomeSelected()
        }}
        onChange={(event) => row.toggleSelected(event.target.checked)}
      />
    ),
  }
}
