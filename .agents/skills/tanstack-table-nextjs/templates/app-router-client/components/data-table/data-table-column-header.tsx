'use client'

import type { Column } from '@tanstack/react-table'

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span>{title}</span>
  }

  const sorted = column.getIsSorted()
  const indicator = sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 font-medium"
      onClick={() => column.toggleSorting(sorted === 'asc')}
      aria-label={`Sort by ${title}`}
    >
      <span>{title}</span>
      <span aria-hidden="true">{indicator}</span>
    </button>
  )
}
