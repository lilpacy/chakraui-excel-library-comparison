# カスタムセル・カスタムエディタ

既存の標準セル/追加セルで足りないときは `GridCellKind.Custom` と `customRenderers` を使う。

## 1. カスタムセルの基本方針

- `data.kind` に自分のセル識別子を入れる。例: `"badge-cell"`。
- `copyData` を設定してclipboard対応を忘れない。
- `draw` はCanvas描画なので、React HookやDOM操作をしない。
- `draw` は高頻度に呼ばれる。重い計算、同期fetch、画像生成を避ける。
- overlay editorが必要なら `provideEditor` を実装する。
- paste対応が必要ならrenderer側の `onPaste` またはGrid側の `coercePasteValue` / `onPaste` を設計する。

## 2. Badgeセル例

```tsx
import * as React from "react";
import DataEditor, {
  GridCellKind,
  type CustomCell,
  type CustomRenderer,
  type EditableGridCell,
  type GridCell,
  type GridColumn,
  type Item,
} from "@glideapps/glide-data-grid";

type BadgeCellData = {
  kind: "badge-cell";
  text: string;
  color: string;
};

type BadgeCell = CustomCell<BadgeCellData>;

function isBadgeCell(cell: CustomCell): cell is BadgeCell {
  return (cell.data as Partial<BadgeCellData>).kind === "badge-cell";
}

export const badgeCellRenderer: CustomRenderer<BadgeCell> = {
  kind: GridCellKind.Custom,
  isMatch: isBadgeCell,
  draw: (args, cell) => {
    const { ctx, rect, theme } = args;
    const { text, color } = cell.data;

    const x = rect.x + 8;
    const y = rect.y + 6;
    const height = rect.height - 12;
    const radius = Math.max(4, height / 2);
    const width = Math.min(rect.width - 16, Math.max(48, ctx.measureText(text).width + 20));

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();

    ctx.fillStyle = theme.bgCell;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + 10, rect.y + rect.height / 2);
    ctx.restore();

    return true;
  },
  measure: (ctx, cell) => ctx.measureText(cell.data.text).width + 28,
  onPaste: (value, cell) => ({
    ...cell,
    copyData: value,
    data: { ...cell.data, text: value },
  }),
};
```

> 注意: `CanvasRenderingContext2D.roundRect` が対象ブラウザで使えない場合は、自前のroundedRect helperまたは矩形描画に切り替える。

## 3. Gridで使う

```tsx
const columns: GridColumn[] = [{ id: "status", title: "Status", width: 160 }];

function getCellContent([col, row]: Item): GridCell {
  return {
    kind: GridCellKind.Custom,
    allowOverlay: false,
    copyData: "Ready",
    data: {
      kind: "badge-cell",
      text: "Ready",
      color: "#2a7",
    },
  } satisfies BadgeCell;
}

export function BadgeGrid() {
  return (
    <DataEditor
      columns={columns}
      rows={10}
      getCellContent={getCellContent}
      customRenderers={[badgeCellRenderer]}
      getCellsForSelection
    />
  );
}
```

## 4. overlay editor付きセルの考え方

`provideEditor` を使うと、custom cell専用のReact editorを提供できる。実プロジェクトの型定義で `ProvideEditorCallback` の戻り値を確認し、次の流れを守る。

1. `allowOverlay: true` にする。
2. editor内で一時入力値を持つ。
3. 入力変更時に `onChange` へ新しいcellを渡す。
4. 確定時に `onFinishedEditing` を呼ぶ。
5. `copyData` を更新する。

概念例:

```tsx
const editableBadgeRenderer: CustomRenderer<BadgeCell> = {
  ...badgeCellRenderer,
  provideEditor: () => {
    return function BadgeEditor(props) {
      const { value, onChange, onFinishedEditing } = props;
      const [text, setText] = React.useState(value.data.text);

      return (
        <input
          autoFocus
          value={text}
          onChange={(event) => {
            const nextText = event.target.value;
            setText(nextText);
            onChange({
              ...value,
              copyData: nextText,
              data: { ...value.data, text: nextText },
            });
          }}
          onBlur={() => onFinishedEditing()}
          onKeyDown={(event) => {
            if (event.key === "Enter") onFinishedEditing();
          }}
        />
      );
    };
  },
};
```

## 5. `drawCell` と `customRenderers` の使い分け

| 方法 | 使う場面 | 注意 |
|---|---|---|
| `customRenderers` | セル種別を新しく作る。編集・paste・measureもまとめたい。 | `GridCellKind.Custom` と `data.kind` が必要。 |
| `drawCell` | 標準セルの見た目だけ一部上書きしたい。 | セル種別や編集挙動は既存のまま。過剰な分岐に注意。 |
| `drawHeader` | ヘッダ描画だけカスタムしたい。 | column menuやresize挙動を壊さない。 |

## 6. paste設計

### renderer側でpaste変換

```ts
onPaste: (value, cell) => ({
  ...cell,
  copyData: value,
  data: { ...cell.data, text: value },
});
```

### Grid側でpasteを処理

```tsx
<DataEditor
  onPaste={(target, values) => {
    // target: 貼り付け開始セル
    // values: 2D配列または実バージョンの型に従う
    // state/databaseを更新する
    return true;
  }}
/>
```

## 7. パフォーマンス指針

- `draw` で新しいImageや大きな配列を毎回作らない。
- formatterは外側でmemoizeする。
- 文字幅測定は必要最小限にし、`measure` を活用する。
- 大量データでは、表示中範囲だけをキャッシュし、未取得セルは `Loading` を返す。
- 局所的な更新では `DataEditorRef.updateCells` を使う。
- 画像はURLとloader/cacheの設計を確認する。

## 8. 追加セルをカスタムセルとして読む

`@glideapps/glide-data-grid-cells` の各セルは、実質的にCustom Cell rendererとして使う。戻すセルは次の形になる。

```ts
{
  kind: GridCellKind.Custom,
  allowOverlay: true,
  copyData: "...",
  data: {
    kind: "dropdown-cell",
    // セル固有fields
  },
}
```

必ず `customRenderers` へ対象rendererを登録する。
