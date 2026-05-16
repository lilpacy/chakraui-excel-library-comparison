import type { User } from '@/app/users/types'

export type GetUsersPageInput = {
  pageIndex: number
  pageSize: number
  sort?: string
  q?: string
}

export type GetUsersPageResult = {
  rows: User[]
  rowCount: number
}

const allowedSorts = new Set(['name.asc', 'name.desc', 'email.asc', 'email.desc', 'createdAt.asc', 'createdAt.desc'])

export async function getUsersPage(input: GetUsersPageInput): Promise<GetUsersPageResult> {
  const pageIndex = Math.max(input.pageIndex, 0)
  const pageSize = Math.min(Math.max(input.pageSize, 1), 100)
  const sort = input.sort && allowedSorts.has(input.sort) ? input.sort : 'createdAt.desc'
  const q = input.q?.trim() ?? ''

  // Replace this mock implementation with a DB query.
  // Server-side must validate sort/filter/page values before using them in SQL/ORM calls.
  const allRows: User[] = [
    {
      id: 'usr_1',
      name: 'Taro Yamada',
      email: 'taro@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_2',
      name: 'Hanako Suzuki',
      email: 'hanako@example.com',
      role: 'member',
      status: 'invited',
      createdAt: new Date().toISOString(),
    },
  ]

  const filtered = q
    ? allRows.filter((row) => `${row.name} ${row.email}`.toLowerCase().includes(q.toLowerCase()))
    : allRows

  const [sortId, direction] = sort.split('.') as [keyof User, 'asc' | 'desc']
  const sorted = [...filtered].sort((a, b) => {
    const result = String(a[sortId]).localeCompare(String(b[sortId]))
    return direction === 'desc' ? -result : result
  })

  const start = pageIndex * pageSize
  return {
    rows: sorted.slice(start, start + pageSize),
    rowCount: sorted.length,
  }
}
