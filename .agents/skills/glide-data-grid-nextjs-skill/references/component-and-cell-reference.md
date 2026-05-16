# コンポーネント・props・セル種別リファレンス

このファイルは、Glide Data GridをNext.jsで扱うときに「何があるか」を漏らさないための一覧です。実装時はプロジェクトに入っているバージョンの型定義を必ず確認してください。

## 1. 主要exports / コンポーネント

| 種類 | 名前 | 用途 |
|---|---|---|
| メインコンポーネント | `DataEditor` | 通常使う高機能Grid。default export / named exportの両方で使われる。 |
| 低レベルコンポーネント | `DataEditorCore` | 一部機能を外側で制御したい場合のcore実装。通常は `DataEditor` を優先。 |
| imperative API | `DataEditorRef` | `updateCells`, `scrollTo`, `focus`, `appendRow`, `appendColumn` などを呼ぶためのref型。 |
| overlay/editor | `ImageOverlayEditor` | `ImageCell` の画像overlayに関わるコンポーネント。 |
| markdown表示 | `MarkdownDiv` | markdown表示用export。 |
| text entry | `TextCellEntry` | テキスト系overlay/editorで使われる入力コンポーネント。 |
| テーマ | `getDefaultTheme`, `useTheme` | default theme取得・theme利用。 |
| カラム補助 | `useColumnSizer` | column幅調整補助。 |
| 行グループ | `useRowGrouping` | row grouping補助。 |
| 選択 | `emptyGridSelection`, `CompactSelection` | 空選択・コンパクト選択表現。 |
| 標準renderer | `textCellRenderer`, `numberCellRenderer`, etc. | 標準セルの描画renderer。 |
| 標準renderer配列 | `AllCellRenderers` | 標準rendererをまとめた配列。 |
| 追加renderer配列 | `allCells` | `@glideapps/glide-data-grid-cells` の追加セルrenderer配列。 |

## 2. `DataEditor` の必須props

| prop | 型の概要 | 説明 |
|---|---|---|
| `columns` | `readonly GridColumn[]` | 表示する列定義。`title`, `id`, `width` などを持つ。 |
| `rows` | `number` | 表示行数。データ配列そのものではなく数値。 |
| `getCellContent` | `(cell: Item) => GridCell` | `[col, row]` 座標からセルを返す。最重要・高頻度実行。 |

`Item` は `[col, row]`。`[row, col]` ではない。

## 3. `DataEditor` propsカテゴリ別メモ

型はバージョンで増減するため、以下は設計時の漏れ防止リストとして使う。

### 表示・サイズ・テーマ

- `width`, `height`
- `className`
- `theme`
- `scaleToRem`
- `rowHeight`
- `headerHeight`
- `groupHeaderHeight`
- `getRowThemeOverride`
- `getGroupDetails`
- `headerIcons`
- `rightElement`, `rightElementProps`
- `verticalBorder`
- `minColumnWidth`, `maxColumnWidth`, `maxColumnAutoWidth`
- `fixedShadowX`, `fixedShadowY`
- `freezeColumns`
- `freezeTrailingRows`
- `smoothScrollX`, `smoothScrollY`
- `overscrollX`, `overscrollY`
- `scrollOffsetX`, `scrollOffsetY`

### 行/列ヘッダ・マーカー

- `rowMarkers`: `"none" | "number" | "checkbox" | "both"` または詳細設定object
- `rowMarkerWidth`
- `rowMarkerStartIndex`
- `trailingRowOptions`
- `onRowAppended`
- `onColumnAppended`
- `onRowMoved`
- `onColumnMoved`
- `onColumnResize`
- `onColumnResizeEnd`

### 選択・ナビゲーション

- `gridSelection`
- `onGridSelectionChange`
- `rangeSelect`
- `columnSelect`
- `rowSelect`
- `rangeSelectionBlending`
- `rowSelectionMode`
- `columnSelectionMode`
- `drawFocusRing`
- `cellActivationBehavior`
- `scrollToActiveCell`
- `preventDiagonalScrolling`
- `allowedFillDirections`

### 編集・clipboard

- `onCellEdited`
- `onCellsEdited`
- `coercePasteValue`
- `onPaste`
- `getCellsForSelection`
- `copyHeaders`
- `fillHandle`
- `editOnType`
- `provideEditor`
- `isDraggable`
- `isOutsideClick`
- `trapFocus`
- `validateCell`

### イベント

- `onCellClicked`
- `onCellActivated`
- `onCellFocused`
- `onCellContextMenu`
- `onHeaderClicked`
- `onHeaderMenuClick`
- `onHeaderContextMenu`
- `onGroupHeaderClicked`
- `onGroupHeaderRenamed`
- `onItemHovered`
- `onMouseMove`
- `onMouseDown`
- `onKeyDown`
- `onKeyUp`
- `onDragStart`
- `onDragOverCell`
- `onDragLeave`
- `onDrop`
- `onVisibleRegionChanged`

### 検索・描画・高度な設定

- `showSearch`
- `onSearchClose`
- `searchResults`
- `drawCell`
- `drawHeader`
- `drawFocusRing`
- `customRenderers`
- `imageWindowLoader`
- `rowGrouping`
- `spanRangeBehavior`
- `experimental`
- `keybindings`

## 4. `DataEditorRef` の主なAPI

| API | 用途 |
|---|---|
| `updateCells([{ cell }])` | 指定セルだけ再描画する。外部データだけ変わり `getCellContent` 参照を変えたくない場合に有用。 |
| `appendRow(col?, openOverlay?)` | trailing rowから行追加を発火させる。 |
| `appendColumn(col?, openOverlay?)` | 列追加を発火させる。 |
| `scrollTo(col, row, options?)` | 指定セルへスクロール。 |
| `focus()` | Gridへfocus。 |
| `getBounds(col, row)` | セルの画面上bounds取得。 |
| `emit(event)` | 内部イベント発火。 |
| `remeasureColumns(columns?)` | 自動幅測定の再実行。 |
| `getMouseArgsForPosition(x, y)` | 座標からGrid mouse args取得。 |

## 5. `GridColumn`

基本形:

```ts
type GridColumn = {
  title: string;
  id?: string;
  width?: number;
  grow?: number;
  icon?: GridColumnIcon;
  overlayIcon?: GridColumnIcon;
  trailingRowOptions?: object;
  themeOverride?: Partial<Theme>;
  group?: string;
  hasMenu?: boolean;
  menuIcon?: GridColumnMenuIcon;
  indicatorIcon?: GridColumnIcon;
  style?: "normal" | "highlight";
  allowedDropdownActions?: readonly GridColumnMenuAction[];
};
```

実装では `id` を安定したキーにし、`columns[col].id` でデータfieldに対応付けるのが安全。

## 6. `BaseGridCell` 共通項目

すべての標準セル/カスタムセルは概ね次の共通項目を持つ。

| prop | 説明 |
|---|---|
| `kind` | `GridCellKind`。セル種別。 |
| `allowOverlay` | overlay editorを開けるか。 |
| `readonly` | 編集禁止。 |
| `lastUpdated` | 点滅/更新表現に使うtimestamp。 |
| `style` | `normal` / `faded` など表示style。 |
| `themeOverride` | セル単位theme override。 |
| `span` | 結合/またがり表示用。 |
| `contentAlign` | `left` / `right` / `center`。 |
| `cursor` | hover時cursor。 |
| `copyData` | clipboardへ出す文字列。コピー対応では重要。 |
| `activationBehaviorOverride` | セル単位のactivation挙動override。 |
| `allowWrapping` | overlay等で折り返しを許す。 |

## 7. 標準セル一覧（`GridCellKind`）

### 7.1 Text

```ts
{
  kind: GridCellKind.Text;
  data: string;
  displayData: string;
  allowOverlay: boolean;
  readonly?: boolean;
  hoverEffect?: boolean;
  hoverEffectTheme?: Partial<Theme>;
}
```

最も基本的な文字列セル。編集可能な文字列、名前、メモなどに使う。コピー値は `copyData` に明示すると安全。

### 7.2 Number

```ts
{
  kind: GridCellKind.Number;
  data: number | undefined;
  displayData: string;
  allowOverlay: boolean;
  readonly?: boolean;
  fixedDecimals?: number;
  thousandSeparator?: boolean;
  decimalSeparator?: string;
  hoverEffect?: boolean;
  hoverEffectTheme?: Partial<Theme>;
}
```

数値セル。表示フォーマットと内部数値を分けられる。通貨・割合は `displayData` と `copyData` を仕様に合わせる。

### 7.3 Boolean

```ts
{
  kind: GridCellKind.Boolean;
  data: boolean | BooleanEmpty;
  allowOverlay: false;
  readonly?: boolean;
  showUnchecked?: boolean;
  allowEmpty?: boolean;
  hoverEffect?: boolean;
  hoverEffectIntensity?: number;
}
```

チェックボックス/真偽値セル。`allowOverlay` は通常 `false`。nullable三値を扱う場合は `allowEmpty` を検討する。

### 7.4 Uri

```ts
{
  kind: GridCellKind.Uri;
  data: string;
  allowOverlay: boolean;
  readonly?: boolean;
  hoverEffect?: boolean;
  hoverEffectTheme?: Partial<Theme>;
  onClickUri?: (uri: string) => void;
}
```

URLセル。リンク表示・クリック挙動を扱う。`onClickUri` を設定すると独自遷移やanalytics処理ができる。

### 7.5 Image

```ts
{
  kind: GridCellKind.Image;
  data: readonly string[];
  allowOverlay: boolean;
  readonly?: boolean;
  displayData?: readonly string[];
  rounding?: number;
}
```

画像URL配列セル。overlay/carouselを使うならcarousel CSSとportalを確認する。

### 7.6 Markdown

```ts
{
  kind: GridCellKind.Markdown;
  data: string;
  allowOverlay: boolean;
  readonly?: boolean;
}
```

Markdownテキストを扱うセル。本文や説明文などに使う。HTML/Markdownの安全性はアプリ側ポリシーで確認する。

### 7.7 Bubble

```ts
{
  kind: GridCellKind.Bubble;
  data: readonly string[];
  allowOverlay: boolean;
  readonly?: boolean;
}
```

タグ風のbubble配列を表示する標準セル。色や候補付きタグ編集が必要なら追加セルの `TagsCell` を検討する。

### 7.8 Drilldown

```ts
{
  kind: GridCellKind.Drilldown;
  data: readonly { text: string; img?: string }[];
  allowOverlay: boolean;
  readonly?: boolean;
}
```

人・項目・関連リンクなどを小さなpill/rowとして表示するセル。クリックで詳細へ遷移するUIと相性が良い。

### 7.9 RowID

```ts
{
  kind: GridCellKind.RowID;
  data: string;
  allowOverlay: false;
}
```

行ID表示用セル。通常は読み取り専用で、編集しない安定IDや行番号に使う。

### 7.10 Protected

```ts
{
  kind: GridCellKind.Protected;
  allowOverlay: false;
}
```

内容を表示しない/保護されたセル。権限がない、秘匿値、操作不能領域などに使う。

### 7.11 Loading

```ts
{
  kind: GridCellKind.Loading;
  allowOverlay: false;
}
```

未ロード・遅延ロード中のセル。サーバーからデータを段階取得するGridで使う。

### 7.12 Custom

```ts
{
  kind: GridCellKind.Custom;
  data: T;
  allowOverlay: boolean;
  copyData?: string;
}
```

独自描画セル。`customRenderers` に対応rendererを登録して使う。追加セルパッケージも内部的にはCustom Cell rendererとして扱う。

## 8. 内部/特殊セル

| セル | 用途 | 注意 |
|---|---|---|
| `Marker` | 行番号・checkboxなどのrow marker領域 | 通常は `rowMarkers` propで制御し、アプリ側で直接返さない。 |
| `NewRow` | trailing row / 新規行UI | 通常は `trailingRowOptions` や `onRowAppended` で制御する。 |

## 9. 追加セル一覧（`@glideapps/glide-data-grid-cells`）

追加セルを使う基本形:

```tsx
import DataEditor, { GridCellKind, type GridCell } from "@glideapps/glide-data-grid";
import { allCells } from "@glideapps/glide-data-grid-cells";

<DataEditor
  columns={columns}
  rows={rows.length}
  getCellContent={getCellContent}
  customRenderers={allCells}
/>;
```

個別rendererだけを使う場合:

```tsx
import { DropdownCell, MultiSelectCell } from "@glideapps/glide-data-grid-cells";

<DataEditor customRenderers={[DropdownCell, MultiSelectCell]} />;
```

現在の公開indexで確認できる追加セルは次の通り。

| renderer | data.kind | 主なdata fields | 用途 |
|---|---|---|---|
| `StarCell` | `"star-cell"` | `rating: number` | 星評価。 |
| `SparklineCell` | `"sparkline-cell"` | `graphKind?: "line" | "bar" | "area"`, `values: number[]`, `displayValues?`, `yAxis`, `color?`, `hideAxis?` | 小さな時系列/分布グラフ。 |
| `TagsCell` | `"tags-cell"` | `tags: string[]`, `possibleTags: { tag: string; color: string }[]` | 色付きタグの表示/編集。 |
| `UserProfileCell` | `"user-profile-cell"` | `image`, `initial`, `tint`, `name?` | アバター/ユーザー表示。 |
| `DropdownCell` | `"dropdown-cell"` | `value`, `allowedValues` | 単一選択ドロップダウン。 |
| `ArticleCell` | `"article-cell"` | `markdown: string` | 長文Markdown/article編集。 |
| `RangeCell` | `"range-cell"` | `value`, `min`, `max`, `step`, `label?`, `measureLabel?`, `color?` | スライダー/範囲値。 |
| `SpinnerCell` | `"spinner-cell"` | なし | 読み込み中スピナー。 |
| `DatePickerCell` | `"date-picker-cell"` | `date`, `displayDate`, `format: "date" | "time" | "datetime-local"`, `timezoneOffset?`, `min?`, `max?`, `step?` | 日付/時刻選択。 |
| `LinksCell` | `"links-cell"` | `links: { title; href?; onClick? }[]`, `underlineOffset?`, `maxLinks?`, `navigateOn?: "click" | "control-click"` | 複数リンク表示。 |
| `ButtonCell` | `"button-cell"` | `title`, `onClick?`, `backgroundColor?`, `color?`, `borderColor?`, `borderRadius?` | ボタン。readonly custom cell。 |
| `TreeViewCell` | `"tree-view-cell"` | `text`, `isOpen`, `canOpen`, `depth`, `onClickOpener?` | ツリー/階層表示。readonly custom cell。 |
| `MultiSelectCell` | `"multi-select-cell"` | `values`, `options?`, `allowCreation?`, `allowDuplicates?` | 複数選択。 |

### 追加セルの戻り値例

```ts
const dropdownCell = {
  kind: GridCellKind.Custom,
  allowOverlay: true,
  copyData: "Done",
  data: {
    kind: "dropdown-cell",
    value: "Done",
    allowedValues: ["Todo", "Doing", "Done"],
  },
};

const multiSelectCell = {
  kind: GridCellKind.Custom,
  allowOverlay: true,
  copyData: "Design, Frontend",
  data: {
    kind: "multi-select-cell",
    values: ["Design", "Frontend"],
    options: ["Design", "Frontend", "Backend"],
    allowCreation: true,
    allowDuplicates: false,
  },
};
```

## 10. `GridSelection` と `CompactSelection`

`GridSelection` は現在の選択状態を表す。

```ts
type GridSelection = {
  current?: { cell: Item; range: Rectangle; rangeStack: readonly Rectangle[] };
  columns: CompactSelection;
  rows: CompactSelection;
};
```

- controlledにしたい場合は `gridSelection` と `onGridSelectionChange` を使う。
- 大量選択では配列ではなく `CompactSelection` を使うため、範囲操作に注意する。

## 11. テーマ

`theme` で全体テーマを上書きでき、`themeOverride` で列/セル単位の上書きもできる。CSS variablesも利用されるため、暗色テーマやブランドカラーはtheme objectとCSSの両方を確認する。

よく使う項目:

- `accentColor`
- `accentLight`
- `textDark`
- `textMedium`
- `textLight`
- `bgCell`
- `bgCellMedium`
- `bgHeader`
- `bgHeaderHovered`
- `bgHeaderHasFocus`
- `borderColor`
- `headerFontStyle`
- `baseFontStyle`
- `editorFontSize`
- `cellHorizontalPadding`
- `cellVerticalPadding`

## 12. どのセルを選ぶか

| 要件 | 推奨セル |
|---|---|
| 単純な文字列 | `Text` |
| 数値入力/表示 | `Number` |
| checkbox | `Boolean` |
| URL/外部リンク | `Uri` または追加 `LinksCell` |
| 画像URL | `Image` |
| 長文Markdown | `Markdown` または追加 `ArticleCell` |
| タグ風の単純表示 | `Bubble` |
| 色付きタグ編集 | 追加 `TagsCell` |
| 関連項目/人物pill表示 | `Drilldown` または `UserProfileCell` |
| 読み込み中 | `Loading` または追加 `SpinnerCell` |
| 秘匿/権限なし | `Protected` |
| 既存セルで足りない独自UI | `Custom` + `customRenderers` |
| 評価 | 追加 `StarCell` |
| 小さなグラフ | 追加 `SparklineCell` |
| 単一選択 | 追加 `DropdownCell` |
| 複数選択 | 追加 `MultiSelectCell` |
| 日付/時刻 | 追加 `DatePickerCell` |
| スライダー | 追加 `RangeCell` |
| ボタン操作 | 追加 `ButtonCell` |
| 階層/ツリー | 追加 `TreeViewCell` |
