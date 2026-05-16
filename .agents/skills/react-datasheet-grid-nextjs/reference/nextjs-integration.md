# Next.js integration guide

Use this file for Next.js-specific setup and troubleshooting.

## App Router setup

Install:

```bash
npm i react-datasheet-grid
```

Import global CSS in `app/layout.tsx`:

```tsx
// app/layout.tsx
import 'react-datasheet-grid/dist/style.css'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

Create a client component for the grid:

```tsx
// app/components/PeopleGrid.tsx
'use client'

import { useMemo, useState } from 'react'
import { DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import type { Column } from 'react-datasheet-grid'

type Row = { id: string; name: string | null; age: number | null }

const newId = () => Math.random().toString(36).slice(2)

export default function PeopleGrid() {
  const [data, setData] = useState<Row[]>([
    { id: '1', name: 'Ada', age: 36 },
    { id: '2', name: 'Grace', age: 85 },
  ])

  const columns = useMemo<Column<Row>[]>(
    () => [
      { ...keyColumn<Row, 'name'>('name', textColumn), title: 'Name' },
      { ...keyColumn<Row, 'age'>('age', intColumn), title: 'Age' },
    ],
    []
  )

  return (
    <DataSheetGrid<Row>
      value={data}
      onChange={setData}
      columns={columns}
      rowKey="id"
      createRow={() => ({ id: newId(), name: null, age: null })}
      duplicateRow={({ rowData }) => ({ ...rowData, id: newId() })}
    />
  )
}
```

Use it in a server page:

```tsx
// app/page.tsx
import PeopleGrid from './components/PeopleGrid'

export default function Page() {
  return <PeopleGrid />
}
```

## Pages Router setup

Import global CSS in `pages/_app.tsx`:

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import 'react-datasheet-grid/dist/style.css'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

Then use the grid in normal React components. No `'use client'` directive is needed in Pages Router.

## Why `'use client'` is required in App Router

DSG is interactive: it uses React state, event handlers, refs, keyboard handling, scrolling, and sometimes browser-only APIs through custom widgets. In App Router, pages and layouts are Server Components by default. Put the grid and any custom cell component that uses hooks/events under a Client Component boundary.

## Global CSS rules

`react-datasheet-grid/dist/style.css` is global CSS. Import it once at the application root:

- App Router: `app/layout.tsx`.
- Pages Router: `pages/_app.tsx`.

Do not import it repeatedly in cell components, route components, or dynamically loaded widgets.

## Dates and server data

Be careful with `Date` objects across Server Component boundaries:

- Use `isoDateColumn` if data comes from the server as `YYYY-MM-DD` strings.
- Use `dateColumn` only when `rowData` actually contains `Date | null` on the client.
- If an API returns ISO strings but you want `dateColumn`, convert them inside the client component before passing to DSG, and convert back before saving.

Example using server-safe strings:

```tsx
const columns: Column<Row>[] = [
  { ...keyColumn<Row, 'dueDate'>('dueDate', isoDateColumn), title: 'Due date' },
]
```

## Browser-only APIs in custom cells

A Client Component can still be pre-rendered, so avoid direct unguarded access to `document` / `window` during render.

Bad:

```tsx
<Select menuPortalTarget={document.body} />
```

Safe:

```tsx
<Select menuPortalTarget={typeof document === 'undefined' ? undefined : document.body} />
```

Use `useEffect` for code that must run only in the browser.

## Dynamic import fallback

Most DSG usage should work as a Client Component. If a custom widget or dependency still fails with `window is not defined` / `document is not defined`, isolate it behind `next/dynamic` with SSR disabled.

Client wrapper pattern:

```tsx
// app/components/GridNoSsr.tsx
'use client'

import dynamic from 'next/dynamic'

const GridInner = dynamic(() => import('./PeopleGrid'), { ssr: false })

export default function GridNoSsr() {
  return <GridInner />
}
```

Then import `GridNoSsr` from a Server Component page.

Use this fallback only when the safer browser-API guards are not enough, because disabling SSR trades off initial HTML for compatibility.

## App Router data pattern

A good App Router pattern is:

1. Fetch data in a Server Component page.
2. Convert it to JSON-serializable rows.
3. Pass rows to a small Client Component.
4. Keep all editing state in the Client Component.
5. Save via Server Actions, route handlers, or API calls depending on the project architecture.

```tsx
// app/page.tsx - Server Component
import PeopleGrid from './PeopleGrid'

export default async function Page() {
  const rows = await getRowsAsSerializableJson()
  return <PeopleGrid initialRows={rows} />
}
```

```tsx
// app/PeopleGrid.tsx - Client Component
'use client'

export default function PeopleGrid({ initialRows }: { initialRows: Row[] }) {
  const [data, setData] = useState(initialRows)
  return <DataSheetGrid<Row> value={data} onChange={setData} columns={columns} />
}
```

## Troubleshooting

### CSS is missing

Check that `react-datasheet-grid/dist/style.css` is imported exactly once at the root. Without it, layout, focus states, selection, and scroll behavior will look broken.

### Columns do not update after state changes

You are probably using `DataSheetGrid` static behavior. Switch to `DynamicDataSheetGrid` and memoize object/function props.

### All row cells re-render on every edit

Use `keyColumn` and wrap custom components with `React.memo`.

### Hydration or SSR error with a select/calendar/popover

Guard `document` / `window`, avoid browser APIs during render, and use `keepFocus` + `stopEditing` for portals. If still broken, use the `GridNoSsr` dynamic import wrapper.

### Row deletion is inconsistent

Set `rowKey` to a stable ID, implement `duplicateRow` to create a new ID, and implement `isCellEmpty` for columns that should not block Del-based row deletion.
