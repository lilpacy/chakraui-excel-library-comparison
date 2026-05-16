'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { columns } from './columns'
import type { User, UsersTableInitialState } from './types'

type UsersTableClientProps = {
  data: User[]
  rowCount: number
  initialState: UsersTableInitialState
}

function sortingToParam(sorting: SortingState): string | undefined {
  const first = sorting[0]
  return first ? `${first.id}.${first.desc ? 'desc' : 'asc'}` : undefined
}

function paramToSorting(sort?: string): SortingState {
  if (!sort) return []
  const [id, direction] = sort.split('.')
  if (!id) return []
  return [{ id, desc: direction === 'desc' }]
}

export function UsersTableClient({ data, rowCount, initialState }: UsersTableClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()
  const [globalFilter, setGlobalFilter] = React.useState(initialState.q)
  const [sorting, setSorting] = React.useState<SortingState>(() => paramToSorting(initialState.sort))
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: initialState.pageIndex,
    pageSize: initialState.pageSize,
  })

  const replaceParams = React.useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === '') next.delete(key)
        else next.set(key, String(value))
      }
      startTransition(() => {
        router.replace(`${pathname}?${next.toString()}`, { scroll: false })
      })
    },
    [pathname, router, searchParams]
  )

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<User>[],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(next)
      setPagination((current) => ({ ...current, pageIndex: 0 }))
      replaceParams({ sort: sortingToParam(next), page: 1 })
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater
      setPagination(next)
      replaceParams({ page: next.pageIndex + 1, pageSize: next.pageSize })
    },
    onGlobalFilterChange: (updater) => {
      const next = typeof updater === 'function' ? updater(globalFilter) : updater
      setGlobalFilter(next)
      setPagination((current) => ({ ...current, pageIndex: 0 }))
      replaceParams({ q: next, page: 1 })
    },
  })

  return (
    <div className="space-y-4 opacity-100" aria-busy={isPending}>
      <div className="flex items-center gap-2">
        <input
          className="h-9 rounded border px-3 text-sm"
          value={globalFilter ?? ''}
          placeholder="Search users..."
          onChange={(event) => table.setGlobalFilter(event.target.value)}
        />
        {isPending ? <span className="text-sm text-gray-500">Updating...</span> : null}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border-b px-3 py-2 text-left font-medium">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        disabled={!header.column.getCanSort()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}{' '}
                        {header.column.getIsSorted() === 'asc'
                          ? '↑'
                          : header.column.getIsSorted() === 'desc'
                            ? '↓'
                            : ''}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-b px-3 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-sm text-gray-500">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Page {pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)} · {rowCount} rows
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 rounded border px-3 text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            type="button"
            className="h-9 rounded border px-3 text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
