# AG Grid React コンポーネント種別カタログ

このファイルは、AG Grid の custom components / provided components を扱うときの最重要リファレンス。コンポーネントに触れる依頼では、まずこの表から「どの場所に、どの属性で設定するか」を決める。

## 1. ユーザーが提供できる custom component 種別

| # | 種別 | 主な用途 | 設定場所 | 属性 |
|---:|---|---|---|---|
| 1 | Cell Component | セル内の表示をカスタマイズする。画像、リンク、ボタン、タグ、複合 UI など。 | Column Definition | `cellRenderer`, `cellRendererParams`, `cellRendererSelector` |
| 2 | Edit Component / Cell Editor | セル編集 UI をカスタマイズする。入力、select、datepicker、独自 validation など。 | Column Definition | `cellEditor`, `cellEditorParams`, `cellEditorSelector` |
| 3 | Filter Component | 列メニュー内の独自フィルタ UI / ロジック。 | Column Definition | `filter`, `filterParams` |
| 4 | Floating Filter | ヘッダー直下に表示される簡易フィルタ UI。 | Column Definition | `floatingFilter`, `floatingFilterParams` |
| 5 | Date Component | Date Filter などで使う日付入力 UI をカスタマイズする。 | Column Definition | `dateComponent`, `dateComponentParams` |
| 6 | Header Component | 列ヘッダー全体を独自実装する。sort/filter/menu の扱いも自前で考える。 | Column Definition | `headerComponent`, `headerComponentParams` |
| 7 | Inner Header Component | ヘッダー内の表示名部分だけを置き換え、標準の sort/filter/menu は維持する。 | Column Definition | `innerHeaderComponent`, `innerHeaderComponentParams` |
| 8 | Header Group Component | 列グループヘッダー全体を独自実装する。 | Column Group Definition | `headerGroupComponent`, `headerGroupComponentParams` |
| 9 | Inner Header Group Component | 列グループヘッダー内の表示部分だけを置き換える。 | Column Group Definition | `innerHeaderGroupComponent`, `innerHeaderGroupComponentParams` |
| 10 | Tooltip Component | セルやヘッダーの tooltip 表示を独自実装する。 | Column Definition | `tooltipComponent`, `tooltipComponentParams` |
| 11 | Group Row Cell Component | row grouping の group row 表示をカスタマイズする。 | Grid Option | `groupRowRenderer`, `groupRowRendererParams` |
| 12 | Group Row Inner Cell Component | group cell renderer の内側だけをカスタマイズする。 | Column/Grid renderer params | `cellRendererParams`, `groupRowRendererParams`, `innerRenderer`, `innerRendererParams` |
| 13 | Detail Cell Component | Master Detail の detail panel を独自実装する。 | Grid Option | `detailCellRenderer`, `detailCellRendererParams` |
| 14 | Full Width Cell Component | full width row の表示を独自実装する。 | Grid Option | `fullWidthCellRenderer`, `fullWidthCellRendererParams` |
| 15 | Loading Cell Component / Loading Component | SSRM / Infinite row model などで行データ読み込み中のセル・行を表示する。 | Grid Option / Column Definition | `loadingCellRenderer`, `loadingCellRendererParams`, `loadingCellRendererSelector` |
| 16 | Overlay Component | loading / no rows / no matching rows / exporting などの overlay をまとめて置き換える。 | Grid Option | `overlayComponent`, `overlayComponentParams`, `overlayComponentSelector` |
| 17 | Active Overlay | grid state に関係なく、アプリ側から任意 overlay を表示する。 | Grid Option | `activeOverlay`, `activeOverlayParams` |
| 18 | Drag and Drop Image | grid 内の drag 中に表示する drag image をカスタマイズする。 | Grid Option | `dragAndDropImageComponent`, `dragAndDropImageComponentParams` |
| 19 | Status Bar Component | status bar panel を独自実装する。Enterprise。 | Grid Option → `statusBar.statusPanels[]` | `statusPanel`, `statusPanelParams` |
| 20 | Tool Panel Component | side bar の tool panel を独自実装する。Enterprise。 | Grid Option → `sideBar.toolPanels[]` | `toolPanel`, `toolPanelParams` |
| 21 | Toolbar Item Component | Quick Access Toolbar の item を独自実装する。Enterprise。 | Grid Option → `toolbar.items[]` | `toolbarItem`, `toolbarItemParams` |
| 22 | Menu Item Component | Column Menu / Context Menu の item を独自実装する。Enterprise。 | Grid Option → Menu | `menuItem`, `menuItemParams` |

## 2. 設定方法の基本

### Direct reference を優先

```tsx
const columnDefs = useMemo<ColDef<Row>[]>(
  () => [
    { field: "price", cellRenderer: PriceCellRenderer },
  ],
  []
);
```

利点: 型が追いやすく、余計な名前解決がない。

### 名前登録は JSON 化・永続化したいとき

```tsx
const components = useMemo(
  () => ({ priceCell: PriceCellRenderer }),
  []
);

const columnDefs = useMemo<ColDef<Row>[]>(
  () => [{ field: "price", cellRenderer: "priceCell" }],
  []
);

<AgGridReact components={components} columnDefs={columnDefs} />;
```

### `Params` で custom props を渡す

```tsx
{ field: "price", cellRenderer: PriceCellRenderer, cellRendererParams: { currency: "USD" } }
```

### `Selector` で行ごとに切り替える

```tsx
const columnDefs = useMemo<ColDef<Row>[]>(
  () => [
    {
      field: "value",
      cellRendererSelector: (params) => {
        if (params.data?.type === "money") {
          return { component: MoneyRenderer, params: { currency: "USD" } };
        }
        if (params.data?.type === "status") {
          return { component: StatusRenderer };
        }
        return undefined;
      },
    },
  ],
  []
);
```

## 3. Grid-provided components 一覧

AG Grid が事前登録している component。名前は `ag` で始まる。`(Enterprise)` は Enterprise 機能。

### Drag And Drop

- `agDragAndDropImage`: grid parts を drag するときの標準 cover element。

### Date Inputs

- `agDateInput`: filter で使う標準 date input。

### Column Headers

- `agColumnHeader`: 標準 column header。
- `agColumnHeaderGroup`: 標準 column group header。

### Column Filters

- `agSetColumnFilter` (Enterprise): Set Filter。Enterprise では `filter: true` の既定になり得る。
- `agTextColumnFilter`: Text Filter。Community では `filter: true` の既定になり得る。
- `agNumberColumnFilter`: Number Filter。
- `agDateColumnFilter`: Date Filter。
- `agMultiColumnFilter` (Enterprise): Multi Filter。
- `agGroupColumnFilter` (Enterprise): Group Column Filter。

### Floating Filters

- `agSetColumnFloatingFilter` (Enterprise): Set Filter 用 floating filter。
- `agTextColumnFloatingFilter`: Text Filter 用 floating filter。
- `agNumberColumnFloatingFilter`: Number Filter 用 floating filter。
- `agDateColumnFloatingFilter`: Date Filter 用 floating filter。
- `agMultiColumnFloatingFilter` (Enterprise): Multi Filter 用 floating filter。
- `agGroupColumnFloatingFilter` (Enterprise): Group Column Filter 用 floating filter。

### Cell Components

- `agAnimateShowChangeCellRenderer`: 値変更を show animation で表示する。
- `agAnimateSlideCellRenderer`: 値変更を slide animation で表示する。
- `agGroupCellRenderer`: group / tree / master detail の展開 UI などを表示する。
- `agLoadingCellRenderer` (Enterprise row model): loading row/cell 表示。
- `agSkeletonCellRenderer`: skeleton cell 表示。
- `agCheckboxCellRenderer`: boolean 値を checkbox で表示する。

### Overlays

- `agLoadingOverlay`: loading overlay。
- `agNoRowsOverlay`: no rows overlay。
- `agNoMatchingRowsOverlay`: no matching rows overlay。
- `agExportingOverlay`: exporting overlay。

### Cell Editors

- `agTextCellEditor`: text editor。
- `agSelectCellEditor`: select editor。
- `agRichSelectCellEditor` (Enterprise): rich select editor。
- `agLargeTextCellEditor`: large text editor。
- `agNumberCellEditor`: number editor。
- `agDateCellEditor`: Date object editor。
- `agDateStringCellEditor`: date string editor。
- `agCheckboxCellEditor`: checkbox editor。

### Master Detail

- `agDetailCellRenderer` (Enterprise): Master Detail の detail panel。

### Column Menu / Context Menu

- `agMenuItem` (Enterprise): column/context menu 内の menu item。

## 4. デフォルト component の override

Grid が default value として使う component は `components` map で同名登録すると override できる。

```tsx
const components = useMemo(
  () => ({
    agDateInput: CustomDateInput,
    agColumnHeader: CustomHeader,
    agTooltipComponent: CustomTooltip,
  }),
  []
);

<AgGridReact components={components} />;
```

主な override 対象:

- `agDragAndDropImage`
- `agDateInput`
- `agColumnHeader`
- `agColumnHeaderGroup` / version により `agColumnGroupHeader` と記載される場合があるため、対象バージョンの API を確認する。
- `agLoadingCellRenderer`
- `agSkeletonCellRenderer`
- `agLoadingOverlay`
- `agNoRowsOverlay`
- `agNoMatchingRowsOverlay`
- `agExportingOverlay`
- `agCellEditor`
- `agDetailCellRenderer`
- `agMenuItem`
- `agTooltipComponent`

## 5. 種別ごとの使い方メモ

### Cell Component

使う場面: セル内にボタン、リンク、アイコン、badge、画像、複合 UI を表示する。

```tsx
import type { CustomCellRendererProps } from "ag-grid-react";

function StatusCell(props: CustomCellRendererProps<Row, Row["status"]> & { okLabel: string }) {
  return <span>{props.value === "ok" ? props.okLabel : "Needs review"}</span>;
}

{ field: "status", cellRenderer: StatusCell, cellRendererParams: { okLabel: "OK" } }
```

注意:

- focusable elements を入れる場合、keyboard navigation を component 側で考慮する。
- 重い renderer は `cellRendererParams: { deferRender: true }` や `React.lazy` を検討する。
- `getCellRendererInstances(params)` は viewport 内に存在する instance だけを返す。virtualisation を前提にする。

### Edit Component / Cell Editor

使う場面: 編集 UI を独自実装する。Controlled Component として、`value` を受け取り `onValueChange` で grid に返す。

```tsx
import type { CustomCellEditorProps } from "ag-grid-react";

function RatingEditor(props: CustomCellEditorProps<Row, number>) {
  return (
    <input
      type="number"
      min={1}
      max={5}
      value={props.value ?? 1}
      onChange={(event) => props.onValueChange(Number(event.target.value))}
    />
  );
}

{ field: "rating", editable: true, cellEditor: RatingEditor }
```

注意:

- 値は editing が止まるまで確定しない。
- editor が外部 popup（datepicker など）を作る場合、popup element に `ag-custom-component-popup` class を付ける。
- editor 内で矢印キーなどを独自処理したい場合は `event.stopPropagation()` または `colDef.suppressKeyboardEvent()` を使う。

### Filter Component

使う場面: provided filters では表現できない条件を列メニュー内に実装する。新方式では `enableFilterHandlers` を有効にし、UI component と filter logic の 2 つを用意する。`model === null` は filter inactive を意味する。

```tsx
function ContainsFilter({
  model,
  onModelChange,
}: {
  model: string | null;
  onModelChange: (value: string | null) => void;
}) {
  return (
    <input
      value={model ?? ""}
      onChange={(event) => onModelChange(event.target.value === "" ? null : event.target.value)}
    />
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

複雑な filter では `doesFilterPass` ではなく `handler` を使う。SSRM など server-side row model だけで filtering する場合、filter logic は server 側で処理する。

### Floating Filter

使う場面: header 直下に常時表示される簡易 filter UI を作る。filter logic は親 filter と連携させる。

```tsx
function TextFloatingFilter({ model, onModelChange }: { model: string | null; onModelChange: (v: string | null) => void }) {
  return (
    <input
      value={model ?? ""}
      onChange={(event) => onModelChange(event.target.value === "" ? null : event.target.value)}
    />
  );
}

{ field: "name", filter: "agTextColumnFilter", floatingFilter: TextFloatingFilter }
```

### Header / Inner Header

- `headerComponent`: full custom。sorting/filter/menu UI を失いやすいので、要件が強い場合だけ使う。
- `innerHeaderComponent`: header label 部分だけ置換し、標準の sorting/filter/menu を維持できるため優先しやすい。

### Overlay / Active Overlay

- grid state による loading/no rows/no matching/exporting を置き換えるなら `overlayComponent` / `overlayComponentSelector`。
- アプリ側の任意タイミングで表示するなら `activeOverlay` / `activeOverlayParams`。

```tsx
<AgGridReact
  activeOverlay={isBlocked ? BlockingOverlay : undefined}
  activeOverlayParams={{ message: "Processing..." }}
/>
```

### Status Bar Component

Enterprise。`statusBar.statusPanels` に設定する。

```tsx
const statusBar = useMemo(
  () => ({
    statusPanels: [
      { statusPanel: "agTotalRowCountComponent", align: "left" },
      { statusPanel: MyStatusPanel, key: "customStatus" },
    ],
  }),
  []
);

<AgGridReact statusBar={statusBar} />
```

### Tool Panel Component

Enterprise。`sideBar.toolPanels` に設定する。

```tsx
const sideBar = useMemo(
  () => ({
    toolPanels: [
      "columns",
      "filters",
      {
        id: "custom",
        labelDefault: "Custom",
        labelKey: "custom",
        iconKey: "menu",
        toolPanel: CustomToolPanel,
        toolPanelParams: { title: "Actions" },
      },
    ],
    defaultToolPanel: "custom",
  }),
  []
);
```

### Toolbar Item Component

Enterprise。Quick Access Toolbar の `items` に設定する。

```tsx
const toolbar = useMemo(
  () => ({
    items: [
      "agQuickFilterToolbarItem",
      "separator",
      { toolbarItem: ExportButton, toolbarItemParams: { fileName: "rows.csv" } },
    ],
  }),
  []
);
```

### Menu Item Component

Enterprise。Column Menu / Context Menu の item を独自 component にする。標準 menu item と混ぜる場合、AG Grid の menu CSS 構造に合わせる。

```tsx
const getContextMenuItems = useCallback(() => [
  {
    name: "Refresh",
    menuItem: RefreshMenuItem,
    menuItemParams: { label: "Refresh data" },
  },
  "copy",
  "separator",
  "export",
], []);
```

## 6. Community / Enterprise の見分け

Enterprise と明記されている component / feature は Community だけでは使えない。代表例:

- Set Filter、Multi Filter、Group Column Filter
- Rich Select Editor
- Row Grouping / Pivoting / Aggregation の一部
- Status Bar
- Tool Panels / Side Bar
- Quick Access Toolbar
- Menu Item Component
- Master Detail
- Server-Side Row Model
- Integrated Charts

Enterprise を使うときは `ag-grid-enterprise`、license key、module 登録を確認する。
