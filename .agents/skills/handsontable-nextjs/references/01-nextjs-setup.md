# Next.js セットアップ

## 依存関係

```bash
npm install handsontable @handsontable/react-wrapper
# または pnpm add handsontable @handsontable/react-wrapper
```

数式を使う場合は Handsontable の Formulas plugin の要求に合わせて HyperFormula も確認する。

```bash
npm install hyperformula
```

## App Router の基本形

`app/` 配下では page / layout は Server Component が既定。Handsontable は DOM、event handler、状態、ブラウザ側の描画に依存するため、グリッド本体は Client Component に分離する。

```tsx
// app/orders/page.tsx  -- Server Component
import HandsontableGrid from './HandsontableGrid';

export default async function Page() {
  const rows = [
    { id: 1, customer: 'A Corp', amount: 120000, status: 'open', tags: ['urgent'], dueDate: '2026-05-20', active: true },
    { id: 2, customer: 'B Inc', amount: 90000, status: 'done', tags: [], dueDate: '2026-05-21', active: false },
  ];

  return <HandsontableGrid initialRows={rows} />;
}
```

```tsx
// app/orders/HandsontableGrid.tsx  -- Client Component
'use client';

import { useMemo, useRef } from 'react';
import { HotTable, HotColumn } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import { mainTheme, registerTheme } from 'handsontable/themes';

registerAllModules();

const theme = registerTheme(mainTheme)
  .setColorScheme('auto')
  .setDensityType('comfortable');

type OrderRow = {
  id: number;
  customer: string;
  amount: number;
  status: 'open' | 'done' | 'blocked';
  tags: string[];
  dueDate: string;
  active: boolean;
};

type Props = { initialRows: OrderRow[] };

const StatusRenderer = ({ value }: { value: unknown }) => {
  return <span>{String(value ?? '')}</span>;
};

export default function HandsontableGrid({ initialRows }: Props) {
  const hotRef = useRef<any>(null);
  const statuses = useMemo(() => ['open', 'done', 'blocked'], []);
  const tags = useMemo(() => ['urgent', 'vip', 'renewal', 'support'], []);

  return (
    <HotTable
      ref={hotRef}
      data={initialRows}
      theme={theme}
      rowHeaders={true}
      colHeaders={['ID', 'Customer', 'Amount', 'Status', 'Tags', 'Due', 'Active']}
      height="auto"
      width="100%"
      autoWrapRow={true}
      autoWrapCol={true}
      autoRowSize={false}
      autoColumnSize={false}
      dropdownMenu={true}
      filters={true}
      multiColumnSorting={true}
      contextMenu={true}
      licenseKey={process.env.NEXT_PUBLIC_HANDSONTABLE_LICENSE_KEY ?? 'non-commercial-and-evaluation'}
      afterChange={(changes, source) => {
        if (!changes || source === 'loadData') return;
        void fetch('/api/orders/changes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes }),
        });
      }}
    >
      <HotColumn data="id" type="numeric" readOnly={true} />
      <HotColumn data="customer" type="text" />
      <HotColumn
        data="amount"
        type="numeric"
        numericFormat={{ style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }}
      />
      <HotColumn data="status" type="dropdown" source={statuses} renderer={StatusRenderer} />
      <HotColumn data="tags" type="multiselect" source={tags} />
      <HotColumn
        data="dueDate"
        type="intl-date"
        dateFormat={{ year: 'numeric', month: '2-digit', day: '2-digit' }}
      />
      <HotColumn data="active" type="checkbox" />
    </HotTable>
  );
}
```

## SSR を明示的に避ける場合

Handsontable 周辺で `window is not defined`、hydration mismatch、サイズ計測問題が出る場合は、Client Component 内に `next/dynamic` を置き、`ssr: false` を指定する。Server Component で `ssr: false` を直接使わない。

```tsx
// app/orders/ClientOnlyGrid.tsx
'use client';

import dynamic from 'next/dynamic';

const HandsontableGrid = dynamic(() => import('./HandsontableGrid'), {
  ssr: false,
  loading: () => <p>Loading grid...</p>,
});

export default HandsontableGrid;
```

```tsx
// app/orders/page.tsx
import ClientOnlyGrid from './ClientOnlyGrid';

export default async function Page() {
  const rows = await Promise.resolve([]);
  return <ClientOnlyGrid initialRows={rows} />;
}
```

## Pages Router の基本形

`pages/` では `next/dynamic` で client-only にする形が扱いやすい。

```tsx
// pages/handsontable.tsx
import dynamic from 'next/dynamic';

const HandsontableGrid = dynamic(() => import('../components/HandsontableGrid'), {
  ssr: false,
});

export default function Page() {
  return <HandsontableGrid initialRows={[]} />;
}
```

## CSS / Theme の扱い

Theme API を使う場合は `handsontable/themes` から `mainTheme` / `horizonTheme` / `classicTheme` と `registerTheme` を使う。

```tsx
import { mainTheme, registerTheme } from 'handsontable/themes';

const theme = registerTheme(mainTheme)
  .setColorScheme('auto')
  .setDensityType('compact');

<HotTable theme={theme} />
```

CSS ファイル方式を使う場合は、Next.js の global CSS 制約に合わせて `app/layout.tsx`、`pages/_app.tsx`、または global stylesheet で読み込む。

```tsx
import 'handsontable/styles/ht-theme-main.min.css';
```

```tsx
<HotTable theme="ht-theme-main" />
```

## Next.js 側の注意

- Server Component から Client Component に渡す props は serializable にする。
- DB接続、秘密鍵、非公開 API token は Client Component に import しない。
- `NEXT_PUBLIC_` prefix の環境変数は client bundle に含まれる。公開してよい値だけに使う。
- Handsontable の列設定に関数（renderer / hooks など）が必要な場合は Client Component 内で定義する。
- 大きなグリッドは、virtualization、batch operations、plugin の絞り込み、個別 module registration を検討する。
