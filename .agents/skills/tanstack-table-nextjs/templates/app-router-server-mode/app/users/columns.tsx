'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { User } from './types'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const value = row.getValue<string>('createdAt')
      return <time dateTime={value}>{new Intl.DateTimeFormat('ja-JP').format(new Date(value))}</time>
    },
  },
]
