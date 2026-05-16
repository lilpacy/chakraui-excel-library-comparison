import { getUsersPage } from '@/lib/users-query'
import { UsersTableClient } from './users-table-client'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const pageIndex = Math.max(Number(sp.page ?? '1') - 1, 0)
  const pageSize = Math.min(Math.max(Number(sp.pageSize ?? '20'), 1), 100)
  const sort = typeof sp.sort === 'string' ? sp.sort : undefined
  const q = typeof sp.q === 'string' ? sp.q : ''

  const result = await getUsersPage({ pageIndex, pageSize, sort, q })

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-gray-500">Server-side/manual TanStack Table example.</p>
      </div>
      <UsersTableClient
        data={result.rows}
        rowCount={result.rowCount}
        initialState={{ pageIndex, pageSize, sort, q }}
      />
    </main>
  )
}
