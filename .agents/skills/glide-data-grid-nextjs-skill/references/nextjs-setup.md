# Next.js導入手順

## 1. パッケージ

基本パッケージ:

```bash
npm i @glideapps/glide-data-grid lodash marked react-responsive-carousel
```

追加セルを使う場合:

```bash
npm i @glideapps/glide-data-grid-cells
```

`@glideapps/glide-data-grid-cells` の `ArticleCell` などはToast UI Editor関連CSSが必要になることがある。実プロジェクトのバージョンとimport要件を確認すること。

## 2. App Router構成

### `app/layout.tsx`

Glide Data GridのCSSはglobal CSSとして読み込む。`ImageCell` のoverlay carouselを使う場合はcarousel CSSも読み込む。

```tsx
// app/layout.tsx
import "@glideapps/glide-data-grid/dist/index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// 追加セルやArticleCellを使う場合、必要に応じてCSSを追加する。
// import "@toast-ui/editor/dist/toastui-editor.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <div
          id="portal"
          style={{ position: "fixed", left: 0, top: 0, zIndex: 9999 }}
        />
      </body>
    </html>
  );
}
```

### `components/GlideGridNoSSR.tsx`

App Routerでは `dynamic(..., { ssr: false })` をClient Component内で使う。

```tsx
// components/GlideGridNoSSR.tsx
"use client";

import dynamic from "next/dynamic";

const PeopleGrid = dynamic(
  () => import("./PeopleGrid").then((mod) => mod.PeopleGrid),
  {
    ssr: false,
    loading: () => <div style={{ padding: 16 }}>Loading grid...</div>,
  }
);

export default function GlideGridNoSSR() {
  return <PeopleGrid />;
}
```

### `components/PeopleGrid.tsx`

```tsx
// components/PeopleGrid.tsx
"use client";

import * as React from "react";
import DataEditor, {
  GridCellKind,
  type EditableGridCell,
  type GridCell,
  type GridColumn,
  type Item,
} from "@glideapps/glide-data-grid";

type Person = {
  id: string;
  name: string;
  age: number;
  active: boolean;
  website: string;
};

const initialRows: Person[] = [
  { id: "u-001", name: "Alice", age: 32, active: true, website: "https://example.com" },
  { id: "u-002", name: "Bob", age: 28, active: false, website: "https://example.org" },
];

const columns: GridColumn[] = [
  { title: "ID", id: "id", width: 90 },
  { title: "Name", id: "name", width: 180 },
  { title: "Age", id: "age", width: 90 },
  { title: "Active", id: "active", width: 90 },
  { title: "Website", id: "website", width: 240 },
];

export function PeopleGrid() {
  const [rows, setRows] = React.useState<Person[]>(initialRows);

  const getCellContent = React.useCallback(
    ([col, row]: Item): GridCell => {
      const person = rows[row];
      const columnId = columns[col]?.id;

      if (!person || columnId == null) {
        return { kind: GridCellKind.Loading, allowOverlay: false };
      }

      switch (columnId) {
        case "id":
          return {
            kind: GridCellKind.RowID,
            data: person.id,
            allowOverlay: false,
          };
        case "name":
          return {
            kind: GridCellKind.Text,
            data: person.name,
            displayData: person.name,
            allowOverlay: true,
            copyData: person.name,
          };
        case "age":
          return {
            kind: GridCellKind.Number,
            data: person.age,
            displayData: String(person.age),
            allowOverlay: true,
            copyData: String(person.age),
          };
        case "active":
          return {
            kind: GridCellKind.Boolean,
            data: person.active,
            allowOverlay: false,
            copyData: person.active ? "TRUE" : "FALSE",
          };
        case "website":
          return {
            kind: GridCellKind.Uri,
            data: person.website,
            allowOverlay: true,
            copyData: person.website,
          };
        default:
          return { kind: GridCellKind.Protected, allowOverlay: false };
      }
    },
    [rows]
  );

  const onCellEdited = React.useCallback(
    ([col, row]: Item, newValue: EditableGridCell) => {
      const columnId = columns[col]?.id;
      if (columnId == null) return;

      setRows((currentRows) => {
        const next = [...currentRows];
        const target = next[row];
        if (!target) return currentRows;

        if (columnId === "name" && newValue.kind === GridCellKind.Text) {
          next[row] = { ...target, name: newValue.data };
        } else if (columnId === "age" && newValue.kind === GridCellKind.Number) {
          next[row] = { ...target, age: Number(newValue.data) };
        } else if (columnId === "active" && newValue.kind === GridCellKind.Boolean) {
          next[row] = { ...target, active: Boolean(newValue.data) };
        } else if (columnId === "website" && newValue.kind === GridCellKind.Uri) {
          next[row] = { ...target, website: newValue.data };
        } else {
          return currentRows;
        }

        return next;
      });
    },
    []
  );

  return (
    <div style={{ height: 520, width: "100%" }}>
      <DataEditor
        columns={columns}
        rows={rows.length}
        getCellContent={getCellContent}
        onCellEdited={onCellEdited}
        getCellsForSelection
        rowMarkers="both"
        smoothScrollX
        smoothScrollY
      />
    </div>
  );
}
```

### `app/page.tsx`

```tsx
// app/page.tsx
import GlideGridNoSSR from "../components/GlideGridNoSSR";

export default function Page() {
  return <GlideGridNoSSR />;
}
```

## 3. Pages Router構成

### `pages/_app.tsx`

```tsx
import type { AppProps } from "next/app";
import "@glideapps/glide-data-grid/dist/index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### `pages/index.tsx`

```tsx
import dynamic from "next/dynamic";

const PeopleGrid = dynamic(
  () => import("../components/PeopleGrid").then((mod) => mod.PeopleGrid),
  { ssr: false }
);

export default function Page() {
  return <PeopleGrid />;
}
```

## 4. CSS/portalチェックリスト

- `@glideapps/glide-data-grid/dist/index.css` をglobalに1回だけ読み込む。
- `ImageCell` の拡大overlayを使うなら `react-responsive-carousel/lib/styles/carousel.min.css` を読み込む。
- ルートlayoutまたはbody直下に `#portal` を配置する。
- `DataEditor` は明示的な高さを持つ親要素内に置く。高さ0の親要素に置くと表示されない。
- App Routerでglobal CSSをコンポーネント深部からimportしない。layoutなどのentry側へ寄せる。

## 5. Next.jsでよく守る設計

- Grid本体はClient Componentにする。
- Server Componentからはデータを取得し、Client Componentへserializableなpropsとして渡す。
- 大量データは全件をClientへ渡さず、仮想化範囲・検索・ソート・フィルタをデータソース側で処理する。
- `getCellContent` の参照を変更するとGridは再評価する。局所更新には `DataEditorRef.updateCells` を検討する。
