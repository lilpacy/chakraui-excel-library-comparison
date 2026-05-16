# コンポーネント種別と使い方

Handsontable + React/Next.js の実装で「コンポーネント」として扱うべきものを、漏れ防止のために分けて確認する。

## 1. `HotTable`

グリッド本体。`@handsontable/react-wrapper` から import する。

```tsx
import { HotTable } from '@handsontable/react-wrapper';

<HotTable
  data={rows}
  rowHeaders={true}
  colHeaders={true}
  height="auto"
  licenseKey="non-commercial-and-evaluation"
/>
```

主な用途:

- グリッド全体の props 設定: `data`, `columns`, `rowHeaders`, `colHeaders`, `height`, `width`, `licenseKey`
- 全体 plugin 設定: `filters`, `dropdownMenu`, `contextMenu`, `multiColumnSorting`, `hiddenColumns`, `mergeCells`, `comments`, `formulas` など
- hooks: `afterChange`, `beforeChange`, `afterCreateRow`, `modifyColWidth`, `beforeKeyDown` など
- theme / locale / language / layout direction
- ref による instance API 呼び出し

## 2. `HotColumn`

列単位の設定を JSX で宣言するコンポーネント。`HotTable` の子として置く。object data のときは `data` prop で object property を正確に指定する。

```tsx
import { HotTable, HotColumn } from '@handsontable/react-wrapper';

<HotTable data={rows} licenseKey="non-commercial-and-evaluation">
  <HotColumn data="id" type="numeric" readOnly={true} />
  <HotColumn data="name" type="text" />
  <HotColumn data="status" type="dropdown" source={['open', 'closed']} />
</HotTable>
```

主な用途:

- 列単位の `type`, `data`, `title`, `readOnly`, `width`, `className`
- 列単位の `renderer`, `editor`, `validator`
- 列単位の `source`, `numericFormat`, `dateFormat`, `timeFormat`
- object data の property mapping

## 3. React renderer component

セルの表示を React component として書き、`renderer` prop に渡す。`HotTable` 全体、または `HotColumn` に渡せる。

```tsx
const ScoreRenderer = ({ value }: { value: unknown }) => {
  const score = Number(value ?? 0);
  return <span aria-label={`score ${score}`}>{score}</span>;
};

<HotColumn data="score" type="numeric" renderer={ScoreRenderer} />
```

注意:

- 表示専用なら renderer、保存値の変換なら `valueParser` / `valueSetter` / hook を検討する。
- DOM を直接触る traditional renderer と React renderer を混在させると保守が難しくなる。
- React renderer でサイズ測定問題が出る場合は `autoColumnSize={false}` / `autoRowSize={false}` を検討する。
- HTML をそのまま描画する renderer は XSS を起こしやすい。ユーザー入力の HTML を無害化せず出さない。

## 4. `EditorComponent`

React custom editor を declarative に作るための高レベルコンポーネント。`EditorComponent` の children は render prop で、現在値、更新関数、編集終了関数などを受け取る。

```tsx
import { EditorComponent } from '@handsontable/react-wrapper';

const TextAreaEditor = () => (
  <EditorComponent>
    {({ value, setValue, finishEditing, mainElementRef }) => (
      <textarea
        ref={mainElementRef as any}
        value={String(value ?? '')}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            finishEditing();
          }
        }}
      />
    )}
  </EditorComponent>
);

<HotColumn data="memo" editor={TextAreaEditor} />
```

主な用途:

- カスタム入力 UI: text area、combobox、date picker、slider、外部 UI library
- editor lifecycle: prepare / open / close / focus
- keyboard shortcut の整理
- Handsontable の編集完了・キャンセル処理と React UI の接続

## 5. `editorFactory` / `rendererFactory` / `useHotEditor`

より低レベルまたは factory-style の custom cell を作るための選択肢。単純な React editor なら `EditorComponent` を優先し、複雑な lifecycle、既存 editor の拡張、共有可能な custom cell type の登録が必要なら factory を検討する。

```tsx
// 概念例。実装時はバージョンに合う公式 API を確認する。
import { editorFactory } from 'handsontable/editors';
import { rendererFactory } from 'handsontable/renderers';
```

## 6. validator function

セル入力値の検証関数。cell type に付属する validator を使うか、列・セル単位で custom validator を指定する。

```tsx
const positiveNumberValidator = (value: unknown, callback: (valid: boolean) => void) => {
  callback(Number(value) >= 0);
};

<HotColumn data="amount" type="numeric" validator={positiveNumberValidator} allowInvalid={false} />
```

## 7. `HotTable` ref / `hotInstance`

外部ボタン、保存、選択、scroll、plugin API、データ読み込みに使う。React wrapper の ref から `hotInstance` にアクセスする。

```tsx
const hotRef = useRef<any>(null);

const selectFirstEditableCell = () => {
  hotRef.current?.hotInstance?.selectCell(0, 1);
};

<HotTable ref={hotRef} data={rows} licenseKey="non-commercial-and-evaluation" />
```

よく使う API:

- `loadData(data)` / `updateData(data)`
- `getData()` / `getSourceData()`
- `setDataAtCell(row, col, value)` / `setDataAtRowProp(row, prop, value)`
- `selectCell(row, col)`
- `getPlugin(name)`
- `batch(() => { ... })`
- `render()` / `validateCells()`

## 8. Theme object / CSS theme string

Theme API で作った object を `theme={theme}` に渡すか、CSS file を読み込み `theme="ht-theme-main"` のように渡す。

```tsx
import { mainTheme, registerTheme } from 'handsontable/themes';

const theme = registerTheme(mainTheme).setColorScheme('auto');

<HotTable theme={theme} />
```

```tsx
import 'handsontable/styles/ht-theme-main.min.css';

<HotTable theme="ht-theme-main" />
```

## 9. `columns` 配列 vs `HotColumn`

どちらも列設定に使える。プロジェクトで統一する。

### `HotColumn` が向く場合

- JSX として列を読みやすく宣言したい。
- 列ごとに React renderer/editor を渡したい。
- object data mapping を視覚的に管理したい。

### `columns` 配列が向く場合

- 列定義を API schema から生成する。
- 数十〜数百列を map で生成する。
- 条件分岐や設定の再利用が多い。

```tsx
const columns = [
  { data: 'id', type: 'numeric', readOnly: true },
  { data: 'name', type: 'text' },
  { data: 'status', type: 'dropdown', source: ['open', 'closed'] },
];

<HotTable data={rows} columns={columns} licenseKey="non-commercial-and-evaluation" />
```

## コンポーネント漏れ防止チェック

- [ ] `HotTable` の全体 props を決めた。
- [ ] `HotColumn` または `columns` 配列で列仕様を決めた。
- [ ] object data の列に `data` property mapping を指定した。
- [ ] 必要な React renderer component を決めた。
- [ ] 必要な React editor component / `EditorComponent` を決めた。
- [ ] 必要な validator を決めた。
- [ ] ref / `hotInstance` が必要か判断した。
- [ ] Theme API object または CSS theme string を決めた。
- [ ] module registration が component / plugin / cell type と一致している。
