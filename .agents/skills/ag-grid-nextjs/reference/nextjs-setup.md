# Next.js セットアップ

## パッケージ

Community の基本導入:

```bash
npm install ag-grid-react
```

`ag-grid-react` は `ag-grid-community` も入れる。Enterprise 機能を使う場合:

```bash
npm install ag-grid-enterprise
```

Integrated Charts の Enterprise まで使う場合:

```bash
npm install ag-charts-enterprise
```

注意:

- `ag-grid-react` と `ag-grid-enterprise` は同じバージョンに揃える。
- 既存 lockfile がある場合は `npm ls ag-grid-react ag-grid-community ag-grid-enterprise` で重複や不一致を確認する。

## App Router の基本構成

AG Grid は browser-specific API に依存するため、`AgGridReact` を含むファイルは Client Component にする。

推奨構成:

```text
app/
├── layout.tsx                  # Server Component のままでよい
├── ag-grid-provider.tsx         # Client Component: AgGridProvider
└── customers/
    ├── page.tsx                 # Server Component のままでよい
    └── CustomersGrid.tsx        # Client Component: AgGridReact
```

`app/ag-grid-provider.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";

const modules = [AllCommunityModule];

export function AgGridProviders({ children }: { children: ReactNode }) {
  return <AgGridProvider modules={modules}>{children}</AgGridProvider>;
}
```

`app/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { AgGridProviders } from "./ag-grid-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AgGridProviders>{children}</AgGridProviders>
      </body>
    </html>
  );
}
```

`app/customers/page.tsx`:

```tsx
import { CustomersGrid } from "./CustomersGrid";

export default function CustomersPage() {
  return (
    <main>
      <h1>Customers</h1>
      <CustomersGrid />
    </main>
  );
}
```

`app/customers/CustomersGrid.tsx`:

```tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GetRowIdParams, RowSelectionOptions } from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";

type CustomerRow = {
  id: string;
  name: string;
  country: string;
  orders: number;
  active: boolean;
};

const initialRows: CustomerRow[] = [
  { id: "c-1", name: "Acme", country: "US", orders: 12, active: true },
  { id: "c-2", name: "Globex", country: "JP", orders: 8, active: false },
];

export function CustomersGrid() {
  const [rowData, setRowData] = useState<CustomerRow[]>(initialRows);

  const columnDefs = useMemo<ColDef<CustomerRow>[]>(
    () => [
      { field: "name", headerName: "Customer", filter: "agTextColumnFilter" },
      { field: "country", filter: true },
      { field: "orders", filter: "agNumberColumnFilter", editable: true },
      { field: "active", cellRenderer: "agCheckboxCellRenderer" },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<CustomerRow>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const rowSelection = useMemo<RowSelectionOptions>(() => ({ mode: "multiRow" }), []);

  const getRowId = useCallback(
    (params: GetRowIdParams<CustomerRow>) => params.data.id,
    []
  );

  return (
    <div style={{ height: 520, width: "100%" }}>
      <AgGridReact<CustomerRow>
        theme={themeQuartz}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        rowSelection={rowSelection}
        pagination
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50]}
      />
    </div>
  );
}
```

## Pages Router の場合

`pages/` でも AG Grid を含むコンポーネントは browser-only として扱う。必要なら `next/dynamic` を使い、SSR を切る。

```tsx
import dynamic from "next/dynamic";

const CustomersGrid = dynamic(() => import("../components/CustomersGrid"), {
  ssr: false,
});

export default function Page() {
  return <CustomersGrid />;
}
```

## テーマ

### v33+ 推奨: Theming API

```tsx
import { themeQuartz } from "ag-grid-community";

<AgGridReact theme={themeQuartz} />
```

カスタマイズ例:

```tsx
import { themeQuartz } from "ag-grid-community";

const myTheme = themeQuartz.withParams({
  accentColor: "#2563eb",
  headerHeight: "42px",
});

<AgGridReact theme={myTheme} />
```

### Legacy themes を維持する場合

既存が v32 以前の CSS theme 前提で動いている場合だけ使う。

```tsx
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

<div className="ag-theme-quartz" style={{ height: 520 }}>
  <AgGridReact theme="legacy" />
</div>
```

## Enterprise ライセンス

Enterprise 機能を production で使う場合はライセンスを設定する。AG Grid はブラウザ側で動くため、Next.js では `NEXT_PUBLIC_` 付き環境変数を使うことが多い。

`.env.local`:

```dotenv
NEXT_PUBLIC_AG_GRID_LICENSE="your_license_key"
```

Client Component または AG Grid 用 provider で設定:

```tsx
"use client";

import { LicenseManager } from "ag-grid-enterprise";

LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_AG_GRID_LICENSE ?? "");
```

注意:

- `NEXT_PUBLIC_` の値は client bundle に入る。秘密鍵として扱わず、リポジトリに直書きしない。
- Watermark や console warning が残る場合は、license key、package version、Enterprise module 登録を確認する。

## よくある Next.js 問題

### Grid が表示されない

- 親 `div` に高さがあるか確認する。
- `AgGridReact` を含むファイルに `"use client";` があるか確認する。
- module が provider で渡されているか確認する。
- legacy theme 使用時は CSS import / className / `theme="legacy"` を確認する。

### Hydration / `window is not defined`

- AG Grid を Server Component で直接 render していないか確認する。
- Pages Router では `dynamic(..., { ssr: false })` を検討する。

### 行選択や列幅が毎回リセットされる

- `rowData` / `columnDefs` / object props が render ごとに再生成されていないか確認する。
- `getRowId` を実装する。
