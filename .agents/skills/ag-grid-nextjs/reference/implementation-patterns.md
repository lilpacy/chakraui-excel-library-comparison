# 実装パターン集

## 1. 新規導入の判断フロー

1. データ量が少〜中規模で browser に全件を持てる → Client-Side Row Model。
2. データ量が大きい、server-side sort/filter/group/pivot が必要 → Server-Side Row Model（Enterprise）。
3. 単に無限スクロールで page/block を取得したい → Infinite Row Model も候補。
4. row grouping / pivot / integrated charts / status bar / side bar / rich select などが必要 → Enterprise を検討。
5. custom UI が必要 → まず provided component で足りるか確認し、足りなければ custom component。

## 2. 基本機能

### Sorting

多くの構成では sorting は column から操作できる。明示的に全列へ付ける場合:

```tsx
const defaultColDef = useMemo<ColDef<Row>>(
  () => ({ sortable: true }),
  []
);
```

列ごとに無効化:

```tsx
{ field: "country", sortable: false }
```

### Filtering

```tsx
const columnDefs = useMemo<ColDef<Row>[]>(
  () => [
    { field: "name", filter: "agTextColumnFilter" },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "createdAt", filter: "agDateColumnFilter" },
    { field: "country", filter: true, floatingFilter: true },
  ],
  []
);
```

Enterprise では `filter: true` が Set Filter になる場合がある。Community と同じ Text/Number/Date 推定にしたい場合は `suppressSetFilterByDefault` を検討する。

### Editing

```tsx
const columnDefs = useMemo<ColDef<Row>[]>(
  () => [
    {
      field: "quantity",
      editable: true,
      cellEditor: "agNumberCellEditor",
      valueParser: (params) => Number(params.newValue),
      onCellValueChanged: (event) => {
        // server update, optimistic update, toast など
        console.log(event.data);
      },
    },
  ],
  []
);
```

注意:

- server 永続化が必要なら `onCellValueChanged` で API を呼ぶ。
- validation が必要なら `valueParser`、`valueSetter`、custom editor、または cell editing validation を検討する。

### Row Selection

```tsx
const rowSelection = useMemo<RowSelectionOptions>(() => ({ mode: "multiRow" }), []);

<AgGridReact rowSelection={rowSelection} />
```

`singleRow` / `multiRow` を使い分ける。選択状態を rowData 更新後も維持したい場合は `getRowId` を必ず実装する。

### Pagination

```tsx
<AgGridReact
  pagination
  paginationPageSize={25}
  paginationPageSizeSelector={[10, 25, 50, 100]}
/>
```

注意: `pagination` は boolean。設定 object を作る場合は spread する。

```tsx
const paginationOptions = useMemo(
  () => ({ pagination: true, paginationPageSize: 25, paginationPageSizeSelector: [10, 25, 50] }),
  []
);

<AgGridReact {...paginationOptions} />
```

## 3. データ取得パターン

### Client Component 内で取得

小規模・簡単なページ向け。

```tsx
"use client";

useEffect(() => {
  let ignore = false;

  async function load() {
    const res = await fetch("/api/customers");
    const rows = (await res.json()) as CustomerRow[];
    if (!ignore) setRowData(rows);
  }

  load();
  return () => {
    ignore = true;
  };
}, []);
```

### Server Component で取得して Client Component に渡す

初期表示の SEO / server fetch / auth context を使いたい場合。

```tsx
// app/customers/page.tsx
import { CustomersGrid } from "./CustomersGrid";

export default async function Page() {
  const rows = await getCustomers();
  return <CustomersGrid initialRows={rows} />;
}
```

```tsx
// app/customers/CustomersGrid.tsx
"use client";

export function CustomersGrid({ initialRows }: { initialRows: CustomerRow[] }) {
  const [rowData, setRowData] = useState(initialRows);
  // ...
}
```

Client Component に渡す props は serializable にする。Date は ISO string にして、必要なら client 側で変換する。

### Server-Side Row Model（Enterprise）

大量データや server-side sort/filter/group が必要な場合。

Client:

```tsx
"use client";

import { useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from "ag-grid-community";

function createDatasource(): IServerSideDatasource {
  return {
    async getRows(params: IServerSideGetRowsParams) {
      try {
        const res = await fetch("/api/customers-grid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params.request),
        });
        const result = await res.json();
        params.success({ rowData: result.rows, rowCount: result.lastRow });
      } catch (error) {
        params.fail();
      }
    },
  };
}

export function CustomersGrid() {
  const columnDefs = useMemo<ColDef<CustomerRow>[]>(() => [{ field: "name" }, { field: "orders" }], []);

  const onGridReady = useCallback((event: GridReadyEvent<CustomerRow>) => {
    event.api.setGridOption("serverSideDatasource", createDatasource());
  }, []);

  return (
    <div style={{ height: 600 }}>
      <AgGridReact<CustomerRow>
        rowModelType="serverSide"
        columnDefs={columnDefs}
        onGridReady={onGridReady}
      />
    </div>
  );
}
```

Route Handler:

```ts
// app/api/customers-grid/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const gridRequest = await request.json();
  const { startRow = 0, endRow = 100, sortModel = [], filterModel = {} } = gridRequest;

  // 実運用では DB query に sort/filter/pagination を反映する。
  const rows = await queryCustomers({ startRow, endRow, sortModel, filterModel });
  const total = await countCustomers({ filterModel });

  return NextResponse.json({ rows, lastRow: total });
}
```

注意:

- SSRM は Enterprise。
- `params.request` に sort/filter/group/pivot/page range の情報が入る。
- DB 側で sort/filter/pagination を処理する。
- error 時は `params.fail()` を呼ぶ。

## 4. Module 選定

### 全 Community module

```tsx
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";

const modules = [AllCommunityModule];
```

### 個別 module

bundle size が重要なら、必要な機能だけを登録する。

```tsx
import {
  ClientSideRowModelModule,
  CsvExportModule,
  TextFilterModule,
  NumberFilterModule,
} from "ag-grid-community";

const modules = [
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  CsvExportModule,
];
```

### Enterprise module

```tsx
import { AllCommunityModule } from "ag-grid-community";
import { ServerSideRowModelModule, StatusBarModule } from "ag-grid-enterprise";

const modules = [AllCommunityModule, ServerSideRowModelModule, StatusBarModule];
```

Integrated Charts:

```tsx
import { AllCommunityModule } from "ag-grid-community";
import { ContextMenuModule, IntegratedChartsModule } from "ag-grid-enterprise";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";

const modules = [
  AllCommunityModule,
  ContextMenuModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
];
```

## 5. 型設計

`AgGridReact<TData>`、`ColDef<TData>` を必ず使う。

```tsx
type OrderRow = {
  id: string;
  customer: string;
  total: number;
  status: "draft" | "paid" | "cancelled";
};

const columnDefs = useMemo<ColDef<OrderRow>[]>(
  () => [
    { field: "customer" },
    { field: "total", valueFormatter: (p) => `$${p.value?.toFixed(2) ?? "0.00"}` },
    { field: "status" },
  ],
  []
);

<AgGridReact<OrderRow> columnDefs={columnDefs} />;
```

## 6. パフォーマンス

- `rowData`, `columnDefs`, object props, callbacks を安定化する。
- 大量更新は transaction API を検討する。
- 重い `valueGetter` がある場合は value cache を検討する。
- 重い cell renderer は `deferRender` / lazy loading / `memo` を検討する。
- `debug` prop を一時的に有効化し、毎 render で props が変化していないか確認する。
- 大量データを client に全件ロードしない。SSRM / Infinite Row Model を検討する。

## 7. Testing

### React Testing Library

- AG Grid は仮想化を使う。画面に見えている cell だけが DOM にある前提で test を書く。
- `getByRole("grid")`、header text、cell text を確認する。
- 行数全体ではなく、visible rows / API / state を test する。

### E2E

- Playwright / Cypress では column header click、filter popup、cell editing、selection、pagination を主要 path として test する。
- custom component を入れた列は keyboard 操作も test する。

## 8. 移行・既存コード修正

### ModuleRegistry から AgGridProvider へ

既存で `ModuleRegistry.registerModules(...)` が散在している場合、provider に集約する。

Before:

```tsx
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
```

After:

```tsx
const modules = [AllCommunityModule];
<AgGridProvider modules={modules}>{children}</AgGridProvider>;
```

### Legacy theme から Theming API へ

Before:

```tsx
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

<div className="ag-theme-quartz"><AgGridReact /></div>
```

After:

```tsx
import { themeQuartz } from "ag-grid-community";

<AgGridReact theme={themeQuartz} />
```

## 9. よくあるミス

- `AgGridReact` を Server Component に置く。
- 親 container に高さを設定しない。
- `pagination` に object を渡す。
- `columnDefs` を component body で毎 render 新規作成し、列状態がリセットされる。
- `rowData` を毎 render 新規作成し、選択状態がリセットされる。
- `getRowId` がないまま immutable data 更新をする。
- Enterprise component を Community 環境で使う。
- `ag-grid-react` と `ag-grid-enterprise` のバージョンがずれる。
- v33+ 新規実装なのに legacy CSS theme だけを設定し、`theme="legacy"` を忘れる。
