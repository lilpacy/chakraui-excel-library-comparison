'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { createSelectColumn } from '@/components/data-table/data-table-select-column'
import type { User } from './types'

export const columns: ColumnDef<User>[] = [
  createSelectColumn<User>(),
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <span className="capitalize">{row.getValue('role')}</span>,
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <span className="capitalize">{row.getValue('status')}</span>,
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const value = row.getValue<string>('createdAt')
      return <time dateTime={value}>{new Intl.DateTimeFormat('ja-JP').format(new Date(value))}</time>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <button
        type="button"
        className="rounded border px-2 py-1 text-sm"
        onClick={() => navigator.clipboard.writeText(row.original.id)}
      >
        Copy ID
      </button>
    ),
  },
]
