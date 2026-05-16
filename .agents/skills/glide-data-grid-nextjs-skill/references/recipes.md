# 実装レシピ

## 1. 編集可能なGrid

Glide Data Gridは表示しているデータソースを自動更新しない。編集callbackでstateやDBを更新する。

```tsx
const onCellEdited = React.useCallback((cell: Item, newValue: EditableGridCell) => {
  const [col, row] = cell;
  const columnId = columns[col]?.id;

  setRows((current) => {
    const next = [...current];
    const target = next[row];
    if (!target) return current;

    if (columnId === "name" && newValue.kind === GridCellKind.Text) {
      next[row] = { ...target, name: newValue.data };
      return next;
    }

    return current;
  });
}, []);
```

複数セル編集・paste・fill handleをまとめて扱いたい場合は `onCellsEdited` を検討する。

## 2. copy対応

```tsx
<DataEditor
  getCellsForSelection
  copyHeaders="selected"
  getCellContent={(cell) => ({
    kind: GridCellKind.Text,
    data: "Alice",
    displayData: "Alice",
    allowOverlay: true,
    copyData: "Alice",
  })}
/>
```

- `getCellsForSelection` を有効化する。
- セルごとに `copyData` を明示する。
- headerもコピーしたい場合は `copyHeaders` を設定する。

## 3. paste対応

単純pasteを許すだけなら `onPaste` を仕様に沿って実装する。セル型ごとの変換を間違えない。

```tsx
<DataEditor
  onPaste={(target, values) => {
    // targetからvaluesを反映する。
    // boolean/number/dateなどはparseとvalidationを行う。
    return true;
  }}
/>
```

## 4. サーバーサイド/遅延ロード

表示範囲が変わったら必要な範囲を取得し、未取得セルは `Loading` を返す。

```tsx
const onVisibleRegionChanged = React.useCallback((range) => {
  // rangeから必要なrow/column範囲を計算し、APIへfetchする。
}, []);

function getCellContent([col, row]: Item): GridCell {
  const value = cache.get(`${row}:${col}`);
  if (value == null) {
    return { kind: GridCellKind.Loading, allowOverlay: false };
  }
  return {
    kind: GridCellKind.Text,
    data: value,
    displayData: value,
    allowOverlay: true,
    copyData: value,
  };
}
```

キャッシュだけが更新された場合は `ref.current?.updateCells([{ cell: [col, row] }])` で局所再描画できる。

## 5. 検索

```tsx
<DataEditor showSearch />
```

大規模データではGrid内検索だけに頼らず、サーバー側検索結果を `searchResults` などで反映する設計を検討する。

## 6. 行マーカー・checkbox選択

```tsx
<DataEditor rowMarkers="both" rowSelectionMode="multi" />
```

- `"number"`: 行番号
- `"checkbox"`: checkbox
- `"both"`: 行番号 + checkbox
- `"none"`: なし

## 7. 固定列

```tsx
<DataEditor freezeColumns={1} />
```

左から指定数の列を固定する。行マーカーも使う場合、見た目とスクロール境界を確認する。

## 8. 末尾の新規行

```tsx
<DataEditor
  trailingRowOptions={{ sticky: true, tint: true, hint: "New row..." }}
  onRowAppended={() => {
    setRows((rows) => [...rows, createEmptyRow()]);
  }}
/>
```

`NewRow` は通常この仕組みから扱う。アプリ側で直接 `NewRow` cellを返す設計にはしない。

## 9. カラム追加

```tsx
<DataEditor
  onColumnAppended={() => {
    setColumns((columns) => [...columns, createColumn()]);
  }}
/>
```

追加列に対応するデータ構造も同時に更新する。

## 10. テーマ

```tsx
<DataEditor
  theme={{
    accentColor: "#4f46e5",
    bgCell: "#ffffff",
    textDark: "#111827",
  }}
/>
```

色指定はプロジェクトのデザイントークンへ寄せる。セル単位に変えたい場合は `themeOverride` を使う。

## 11. ソート・フィルタ

Glide Data Gridはデータソース非依存のGrid。ソート・フィルタはアプリ側で状態管理する。

```tsx
const sortedRows = React.useMemo(() => {
  return [...rows].sort((a, b) => a.name.localeCompare(b.name));
}, [rows]);
```

ヘッダクリックでsort stateを更新し、`getCellContent` が参照する配列を切り替える。

## 12. 画像セル

```ts
{
  kind: GridCellKind.Image,
  data: ["https://example.com/image.png"],
  allowOverlay: true,
  copyData: "https://example.com/image.png",
}
```

- 画像URLはCORS・認証・キャッシュを確認する。
- overlayを使うならcarousel CSSと `#portal` を用意する。

## 13. 追加セルのDropdown

```tsx
import { DropdownCell } from "@glideapps/glide-data-grid-cells";

const statusCell = {
  kind: GridCellKind.Custom,
  allowOverlay: true,
  copyData: "Todo",
  data: {
    kind: "dropdown-cell",
    value: "Todo",
    allowedValues: ["Todo", "Doing", "Done"],
  },
};

<DataEditor customRenderers={[DropdownCell]} />;
```

## 14. 追加セルのMultiSelect

```tsx
import { MultiSelectCell } from "@glideapps/glide-data-grid-cells";

const tagsCell = {
  kind: GridCellKind.Custom,
  allowOverlay: true,
  copyData: "frontend, urgent",
  data: {
    kind: "multi-select-cell",
    values: ["frontend", "urgent"],
    options: ["frontend", "backend", "urgent"],
    allowCreation: true,
    allowDuplicates: false,
  },
};

<DataEditor customRenderers={[MultiSelectCell]} />;
```

## 15. 大量データでの注意

- `rows` は数値なので、全データ配列を必ず持つ必要はない。
- `getCellContent` は見えている範囲を中心に非常に多く呼ばれる。
- 行データのfetchは `onVisibleRegionChanged` などで範囲取得する。
- 値の整形はキャッシュ・memoizeする。
- セルを局所更新するときは `updateCells` を使う。
- ソート/フィルタ/検索はデータソース側で実装する方が安全。
