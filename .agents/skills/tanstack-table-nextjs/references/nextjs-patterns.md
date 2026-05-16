# Next.js Patterns for TanStack Table

## 1. App Routerの基本分離

```text
app/users/page.tsx                  # Server Component: 認可・データ取得
app/users/users-table-client.tsx    # Client Component: columns + DataTable接続
app/users/columns.tsx               # Client module: ColumnDef[]
components/data-table/*.tsx         # Client Components: useReactTableとUI
```

### Server Componentでやること

- DB/APIからデータ取得する。
- 認可・権限チェックを行う。
- `Date`、`Decimal`、`BigInt`、class instanceなどをClientへ渡す前に文字列/数値へ正規化する。
- `searchParams`を読んでserver-side/manual modeのクエリ条件に変換する。
- Client Componentへ`data`、`rowCount`、初期状態などを渡す。

### Client Componentでやること

- `useReactTable`を呼ぶ。
- `useState`でsorting/filtering/pagination/selection等を制御する。
- click/change/keyboardなどイベントハンドラを持つ。
- `useRouter`、`usePathname`、`useSearchParams`でURL同期する。
- row actions、dialog、dropdown、checkbox、inputなどインタラクティブUIを扱う。

## 2. Client-side mode

全データをServerで取得し、Client側で並び替え・絞り込み・ページングします。数千〜数万行程度まで検討可能ですが、列数・セル内容・端末性能に依存します。

```tsx
// app/users/page.tsx
import { UsersTableClient } from './users-table-client'
import { getUsers } from '@/lib/users'

export default async function Page() {
  const users = await getUsers()
  return <UsersTableClient data={users} />
}
```

```tsx
// app/users/users-table-client.tsx
'use client'

import { columns } from './columns'
import { DataTable } from '@/components/data-table/data-table'
import type { User } from './types'

export function UsersTableClient({ data }: { data: User[] }) {
  return <DataTable columns={columns} data={data} filterColumnId="email" />
}
```

## 3. Server-side/manual mode

DB側でsorting/filtering/paginationを行い、Tableには現在ページ分のdataだけを渡します。URL search paramsを状態源にすると、リロード・共有・戻る/進むに強くなります。

### Server page

```tsx
// app/users/page.tsx
import { UsersTableClient } from './users-table-client'
import { getUsersPage } from '@/lib/users-query'

export default async function Page({
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
    <UsersTableClient
      data={result.rows}
      rowCount={result.rowCount}
      initialState={{ pageIndex, pageSize, sort, q }}
    />
  )
}
```

### Client table

- `manualPagination: true`
- `manualSorting: true`
- `manualFiltering: true`
- `rowCount`または`pageCount`を渡す。
- `onPaginationChange`、`onSortingChange`、`onGlobalFilterChange`でURLを更新する。

## 4. URL search params同期の原則

- ユーザー入力はdebounceする。
- 入力中の検索は`router.replace`、明確なページ遷移は`router.push`を使い分ける。
- `pageIndex`はUI内部では0始まり、URLでは1始まりにするとユーザーに分かりやすい。
- filter/sort変更時は`page=1`へ戻す。
- `scroll: false`を使ってテーブル操作で画面上部へ飛ばないようにする。
- 配列filterは`status=open,closed`のようなCSV、または同名パラメータ複数などプロジェクトの規約に合わせる。

## 5. Pages Routerの場合

- `pages/users.tsx`で`getServerSideProps`またはclient fetchを使う。
- `DataTable`自体はClient React componentとして同じ。
- URL同期は`next/router`の`router.push/replace`と`router.query`を使う。

## 6. Server Actions / Mutations

行削除、更新、ステータス変更などは以下のどちらかに寄せます。

1. **Server Action**: form actionまたはClient Componentから呼ぶ。完了後`router.refresh()`。
2. **Route Handler/API + mutation library**: TanStack Query/SWR等でoptimistic updateと再取得。

いずれの場合も、`row.original`から取得したIDを使い、表示上のrow indexに依存しないでください。

## 7. `columns.tsx`のClient境界

- `columns.tsx`が`DataTableColumnHeader`、`DataTableRowActions`、checkbox、button、dropdownなどを返すならClient側のmoduleとして扱う。
- Server Componentから直接`columns`をimportしない。`UsersTableClient`の中でimportする。
- ColumnDefは関数・React要素を含み得るため、ServerからClientへpropsとして渡すのではなくClient module内で定義/参照する。

## 8. Loading / Empty / Error

- `app/<route>/loading.tsx`でテーブル骨格を出す。
- `DataTable`内で`rows.length === 0`を扱う。
- mutation中は対象行のボタンdisable、optimistic表示、toastなどを検討。
- server-side modeではURL更新中のpending stateを`useTransition`で表現できる。

## 9. Performance

- `columns`はコンポーネント外で定義、または`useMemo`。
- `data`をClientで加工する場合は`useMemo`。
- 重いcell componentはmemo化を検討。
- 何万行も描画するならpaginationかvirtualizationを選ぶ。
- column resizing、pinning、virtualizationの組み合わせはCSS計算が重くなりやすい。

## 10. Security

- DBクライアント、API secret、server-only helperをClient Componentにimportしない。
- Clientから送るsort/filter/page値は必ずServer側で許可リスト検証する。
- Row actionはUI上で隠すだけでなくServer側で権限確認する。
