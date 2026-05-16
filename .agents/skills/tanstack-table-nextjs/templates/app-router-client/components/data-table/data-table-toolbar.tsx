'use client'

import type { Table } from '@tanstack/react-table'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  filterColumnId?: string
  filterPlaceholder?: string
}

export function DataTableToolbar<TData>({
  table,
  filterColumnId,
  filterPlaceholder = 'Filter...',
}: DataTableToolbarProps<TData>) {
  const filterColumn = filterColumnId ? table.getColumn(filterColumnId) : undefined
  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {filterColumn ? (
          <input
            className="h-9 rounded border px-3 text-sm"
            placeholder={filterPlaceholder}
            value={(filterColumn.getFilterValue() as string) ?? ''}
            onChange={(event) => filterColumn.setFilterValue(event.target.value)}
          />
        ) : null}

        {table.getState().columnFilters.length ? (
          <button
            type="button"
            className="h-9 rounded border px-3 text-sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset filters
          </button>
        ) : null}

        {selectedCount ? <span className="text-sm text-gray-500">{selectedCount} selected</span> : null}
      </div>

      <details className="relative">
        <summary className="h-9 cursor-pointer rounded border px-3 py-2 text-sm">Columns</summary>
        <div className="absolute right-0 z-10 mt-2 min-w-44 rounded border bg-white p-2 shadow">
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <label key={column.id} className="flex items-center gap-2 px-2 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={(event) => column.toggleVisibility(event.target.checked)}
                />
                <span>{column.id}</span>
              </label>
            ))}
        </div>
      </details>
    </div>
  )
}
