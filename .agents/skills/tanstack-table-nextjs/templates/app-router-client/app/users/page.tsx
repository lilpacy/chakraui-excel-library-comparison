import { UsersTableClient } from './users-table-client'
import type { User } from './types'

async function getUsers(): Promise<User[]> {
  // Replace with DB/API call in a Server Component.
  return [
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
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-gray-500">Client-side TanStack Table example.</p>
      </div>
      <UsersTableClient data={users} />
    </main>
  )
}
