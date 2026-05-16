# Custom Components 実装例

このファイルは代表的な custom component の最小実装例。完全な一覧は `reference/component-catalog.md` を参照。

## 1. Cell Renderer

```tsx
import type { CustomCellRendererProps } from "ag-grid-react";

type Row = { id: string; status: "ok" | "warning" | "error" };

function StatusRenderer(
  props: CustomCellRendererProps<Row, Row["status"]> & { labels: Record<Row["status"], string> }
) {
  if (!props.value) return null;
  return <span aria-label={`Status: ${props.labels[props.value]}`}>{props.labels[props.value]}</span>;
}

const columnDefs = useMemo<ColDef<Row>[]>(
  () => [
    {
      field: "status",
      cellRenderer: StatusRenderer,
      cellRendererParams: {
        labels: { ok: "OK", warning: "Warning", error: "Error" },
      },
    },
  ],
  []
);
```

## 2. Dynamic Cell Renderer with selector

```tsx
const columnDefs = useMemo<ColDef<Row>[]>(
  () => [
    {
      field: "value",
      cellRendererSelector: (params) => {
        if (params.data?.kind === "money") {
          return { component: MoneyRenderer, params: { currency: "USD" } };
        }
        if (params.data?.kind === "date") {
          return { component: DateRenderer };
        }
        return undefined;
      },
    },
  ],
  []
);
```

## 3. Cell Editor

```tsx
import type { CustomCellEditorProps } from "ag-grid-react";

type Row = { id: string; priority: "low" | "medium" | "high" };

function PriorityEditor(props: CustomCellEditorProps<Row, Row["priority"]>) {
  return (
    <select
      value={props.value ?? "medium"}
      onChange={(event) => props.onValueChange(event.target.value as Row["priority"])}
      autoFocus
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  );
}

const columnDefs = useMemo<ColDef<Row>[]>(
  () => [
    { field: "priority", editable: true, cellEditor: PriorityEditor },
  ],
  []
);
```

## 4. Custom Filter with `enableFilterHandlers`

```tsx
function ContainsFilter({
  model,
  onModelChange,
}: {
  model: string | null;
  onModelChange: (value: string | null) => void;
}) {
  return (
    <div style={{ padding: 8 }}>
      <input
        value={model ?? ""}
        placeholder="Contains..."
        onChange={(event) => onModelChange(event.target.value === "" ? null : event.target.value)}
      />
    </div>
  );
}

const columnDefs = useMemo<ColDef<Row>[]>(
  () => [
    {
      field: "name",
      filter: {
        component: ContainsFilter,
        doesFilterPass: (params) => {
          const filterText = String(params.model ?? "").toLowerCase();
          const cellValue = String(params.handlerParams.getValue(params.node) ?? "").toLowerCase();
          return cellValue.includes(filterText);
        },
      },
    },
  ],
  []
);

<AgGridReact enableFilterHandlers columnDefs={columnDefs} />;
```

新方式では filter UI と filter logic を分ける。複雑な条件では `doesFilterPass` ではなく `handler` を使う。SSRM のように server-side filtering する場合、logic は API route / backend で処理する。古い legacy custom filter 方式を新規採用しない。

## 5. Floating Filter

```tsx
function StartsWithFloatingFilter({
  model,
  onModelChange,
}: {
  model: string | null;
  onModelChange: (value: string | null) => void;
}) {
  return (
    <input
      aria-label="Filter by prefix"
      value={model ?? ""}
      onChange={(event) => onModelChange(event.target.value === "" ? null : event.target.value)}
    />
  );
}

const columnDefs = useMemo<ColDef<Row>[]>(
  () => [
    {
      field: "name",
      filter: "agTextColumnFilter",
      floatingFilter: StartsWithFloatingFilter,
    },
  ],
  []
);

<AgGridReact enableFilterHandlers columnDefs={columnDefs} />;
```

## 6. Inner Header Component

`innerHeaderComponent` は標準 header の sort/filter/menu を維持しながら表示部分だけ変えたいときに使う。

```tsx
function RequiredHeader({ displayName }: { displayName: string }) {
  return (
    <span>
      {displayName} <span aria-label="required">*</span>
    </span>
  );
}

const defaultColDef = useMemo<ColDef<Row>>(
  () => ({ innerHeaderComponent: RequiredHeader }),
  []
);
```

## 7. Overlay Component

```tsx
function GridOverlay({ overlayType, message }: { overlayType?: string; message?: string }) {
  return (
    <div role="status" style={{ padding: 16 }}>
      {message ?? `Overlay: ${overlayType ?? "custom"}`}
    </div>
  );
}

<AgGridReact
  overlayComponent={GridOverlay}
  overlayComponentParams={{ message: "Nothing to show" }}
/>
```

Active overlay:

```tsx
<AgGridReact
  activeOverlay={isSaving ? GridOverlay : undefined}
  activeOverlayParams={{ message: "Saving..." }}
/>
```

## 8. Status Bar Panel（Enterprise）

```tsx
function SelectedCountPanel({ api }: { api: GridApi<Row> }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(api.getSelectedRows().length);
    api.addEventListener("selectionChanged", update);
    update();
    return () => {
      if (!api.isDestroyed()) api.removeEventListener("selectionChanged", update);
    };
  }, [api]);

  return <span>Selected: {count}</span>;
}

const statusBar = useMemo(
  () => ({
    statusPanels: [
      { statusPanel: "agTotalRowCountComponent", align: "left" },
      { key: "selected", statusPanel: SelectedCountPanel, align: "right" },
    ],
  }),
  []
);

<AgGridReact statusBar={statusBar} />;
```

## 9. Tool Panel（Enterprise）

```tsx
function ActionsToolPanel({ api }: { api: GridApi<Row> }) {
  return (
    <div style={{ padding: 12 }}>
      <button type="button" onClick={() => api.exportDataAsCsv()}>
        Export CSV
      </button>
    </div>
  );
}

const sideBar = useMemo(
  () => ({
    toolPanels: [
      "columns",
      "filters",
      {
        id: "actions",
        labelDefault: "Actions",
        labelKey: "actions",
        iconKey: "menu",
        toolPanel: ActionsToolPanel,
      },
    ],
    defaultToolPanel: "actions",
  }),
  []
);

<AgGridReact sideBar={sideBar} />;
```

## 10. Toolbar Item（Enterprise）

```tsx
function ExportToolbarItem({ api, fileName = "rows.csv" }: { api: GridApi<Row>; fileName?: string }) {
  return (
    <button type="button" onClick={() => api.exportDataAsCsv({ fileName })}>
      Export
    </button>
  );
}

const toolbar = useMemo(
  () => ({
    items: [
      "agQuickFilterToolbarItem",
      "separator",
      { toolbarItem: ExportToolbarItem, toolbarItemParams: { fileName: "orders.csv" } },
    ],
  }),
  []
);

<AgGridReact toolbar={toolbar} />;
```

## 11. Menu Item（Enterprise）

```tsx
function RefreshMenuItem({ name, action }: { name: string; action?: () => void }) {
  return (
    <div className="ag-menu-option" onClick={action} role="menuitem">
      <span className="ag-menu-option-part ag-menu-option-text">{name}</span>
    </div>
  );
}

const getContextMenuItems = useCallback(
  () => [
    {
      name: "Refresh rows",
      menuItem: RefreshMenuItem,
      action: () => refetchRows(),
    },
    "copy",
    "separator",
    "export",
  ],
  [refetchRows]
);

<AgGridReact getContextMenuItems={getContextMenuItems} />;
```

## 12. Default component override

```tsx
const components = useMemo(
  () => ({
    agNoRowsOverlay: EmptyStateOverlay,
    agLoadingOverlay: LoadingOverlay,
    agTooltipComponent: AppTooltip,
  }),
  []
);

<AgGridReact components={components} />;
```
