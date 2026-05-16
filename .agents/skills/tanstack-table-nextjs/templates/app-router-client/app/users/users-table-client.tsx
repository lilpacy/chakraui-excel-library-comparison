'use client'

import { DataTable } from '@/components/data-table/data-table'
import { columns } from './columns'
import type { User } from './types'

export function UsersTableClient({ data }: { data: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumnId="email"
      filterPlaceholder="Filter emails..."
    />
  )
}
