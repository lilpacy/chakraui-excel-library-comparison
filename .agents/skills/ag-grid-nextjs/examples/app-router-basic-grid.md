# App Router 基本例

この例は Next.js App Router + TypeScript + AG Grid v33+ Theming API + `AgGridProvider` を前提にした新規導入テンプレート。

## 1. Install

```bash
npm install ag-grid-react
```

Enterprise 機能も使う場合:

```bash
npm install ag-grid-enterprise
```

## 2. Provider

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

## 3. Page

`app/orders/page.tsx`:

```tsx
import { OrdersGrid } from "./OrdersGrid";

export default function OrdersPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Orders</h1>
      <OrdersGrid />
    </main>
  );
}
```

## 4. Grid Client Component

`app/orders/OrdersGrid.tsx`:

```tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, GetRowIdParams, RowSelectionOptions } from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";

type OrderRow = {
  id: string;
  customer: string;
  country: string;
  amount: number;
  status: "draft" | "paid" | "cancelled";
  createdAt: string;
};

const rows: OrderRow[] = [
  { id: "o-1001", customer: "Acme", country: "US", amount: 1200, status: "paid", createdAt: "2026-05-01" },
  { id: "o-1002", customer: "Globex", country: "JP", amount: 850, status: "draft", createdAt: "2026-05-03" },
  { id: "o-1003", customer: "Initech", country: "US", amount: 420, status: "cancelled", createdAt: "2026-05-04" },
];

function StatusBadge({ value }: { value?: OrderRow["status"] }) {
  return <span>{value === "paid" ? "Paid" : value === "draft" ? "Draft" : "Cancelled"}</span>;
}

export function OrdersGrid() {
  const [rowData, setRowData] = useState<OrderRow[]>(rows);

  const columnDefs = useMemo<ColDef<OrderRow>[]>(
    () => [
      { field: "customer", headerName: "Customer", filter: "agTextColumnFilter" },
      { field: "country", filter: true },
      {
        field: "amount",
        filter: "agNumberColumnFilter",
        editable: true,
        valueFormatter: (params) =>
          typeof params.value === "number" ? `$${params.value.toLocaleString()}` : "",
        valueParser: (params) => Number(params.newValue),
      },
      { field: "status", cellRenderer: StatusBadge },
      { field: "createdAt", headerName: "Created", filter: "agDateColumnFilter" },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<OrderRow>>(
    () => ({ sortable: true, filter: true, resizable: true, flex: 1, minWidth: 120 }),
    []
  );

  const rowSelection = useMemo<RowSelectionOptions>(() => ({ mode: "multiRow" }), []);

  const getRowId = useCallback((params: GetRowIdParams<OrderRow>) => params.data.id, []);

  return (
    <div style={{ height: 560, width: "100%" }}>
      <AgGridReact<OrderRow>
        theme={themeQuartz}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection={rowSelection}
        getRowId={getRowId}
        pagination
        paginationPageSize={25}
        paginationPageSizeSelector={[10, 25, 50, 100]}
        onCellValueChanged={(event) => {
          console.log("updated row", event.data);
        }}
      />
    </div>
  );
}
```

## 5. Server fetch → Client Grid

`app/orders/page.tsx`:

```tsx
import { OrdersGrid } from "./OrdersGrid";
import { getOrders } from "@/lib/orders";

export default async function OrdersPage() {
  const rows = await getOrders();
  return <OrdersGrid initialRows={rows} />;
}
```

`app/orders/OrdersGrid.tsx`:

```tsx
"use client";

export function OrdersGrid({ initialRows }: { initialRows: OrderRow[] }) {
  const [rowData, setRowData] = useState(initialRows);
  // AG Grid setup...
}
```

## 6. Enterprise provider example

`app/ag-grid-provider.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { LicenseManager, ServerSideRowModelModule, StatusBarModule } from "ag-grid-enterprise";

LicenseManager.setLicenseKey(process.env.NEXT_PUBLIC_AG_GRID_LICENSE ?? "");

const modules = [AllCommunityModule, ServerSideRowModelModule, StatusBarModule];

export function AgGridProviders({ children }: { children: ReactNode }) {
  return <AgGridProvider modules={modules}>{children}</AgGridProvider>;
}
```
