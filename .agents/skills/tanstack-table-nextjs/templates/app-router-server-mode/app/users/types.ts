export type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  status: 'active' | 'inactive' | 'invited'
  createdAt: string
}

export type UsersTableInitialState = {
  pageIndex: number
  pageSize: number
  sort?: string
  q: string
}
