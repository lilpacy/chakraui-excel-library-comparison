# セル型・セル関数・custom cell

Handsontable のセルは、`renderer`、`editor`、必要に応じて `validator` の組み合わせで動く。`type` はこの組み合わせに alias を付けたものと考える。

## Built-in cell types 一覧

| cell type | 用途 | 主な設定 | Next.js/React 実装メモ |
|---|---|---|---|
| `text` | 文字列。既定セル型 | `renderer`, `editor`, `readOnly` | base module に含まれる。明示しなくても既定。 |
| `numeric` | 数値、通貨、割合、単位、正しい数値 sort/filter | `numericFormat`, `locale`, `validator` | `Intl.NumberFormat` 方式を優先。保存値は number に保つ。 |
| `date` | 日付。旧来の string-style / Moment.js 互換が必要な場合 | `dateFormat`, `correctFormat`, `datePickerConfig` | v17 では Intl object-style が推奨。互換性を確認。 |
| `intl-date` | 日付。Intl.DateTimeFormat object-style | `dateFormat={{ year, month, day }}`, `locale` | 新規実装ではこちらを優先。実際の alias はバージョンで確認。 |
| `time` | 時刻。旧来の string-style / Moment.js 互換が必要な場合 | `timeFormat`, `correctFormat` | v17 では Intl object-style が推奨。互換性を確認。 |
| `intl-time` | 時刻。Intl.DateTimeFormat object-style | `timeFormat={{ timeStyle: 'short' }}`, `locale` | 新規実装ではこちらを優先。実際の alias はバージョンで確認。 |
| `checkbox` | boolean / checked values | `checkedTemplate`, `uncheckedTemplate`, `label` | boolean 以外の値を使う場合は template を明示。 |
| `select` | HTML select 的な単一選択 | `selectOptions` | 少数候補で単純な選択に向く。 |
| `dropdown` | dropdown による単一選択 | `source`, `strict`, `allowInvalid` | 固定候補から選ばせるなら `strict: true` を検討。 |
| `autocomplete` | 入力補完つき候補選択 | `source`, `filter`, `strict`, `visibleRows` | 大量候補は source function / API 連携を検討。 |
| `multiselect` | 1セルに複数値を配列として保存 | `source` array または `{ key, value }[]` | renderer は選択済み値を chip 表示する。保存値が array であることに注意。 |
| `password` | copyable ではない秘匿表示 | `copyable` | 実際の機密情報を client に置かない。表示だけの秘匿。 |
| `handsontable` | セル内に入れ子の Handsontable editor | `handsontable`, `source` | 複雑で重い。必要性と UX を確認。 |

## セル型の使い方

### `HotColumn` で指定

```tsx
<HotColumn data="amount" type="numeric" numericFormat={{ style: 'currency', currency: 'JPY' }} />
<HotColumn data="status" type="dropdown" source={['open', 'closed']} strict={true} />
<HotColumn data="tags" type="multiselect" source={['urgent', 'vip', 'support']} />
<HotColumn data="active" type="checkbox" />
```

### `columns` 配列で指定

```tsx
const columns = [
  { data: 'id', type: 'numeric', readOnly: true },
  { data: 'name', type: 'text' },
  { data: 'amount', type: 'numeric', numericFormat: { style: 'currency', currency: 'JPY' } },
  { data: 'status', type: 'dropdown', source: ['open', 'closed'], strict: true },
  { data: 'tags', type: 'multiselect', source: ['urgent', 'vip', 'support'] },
  { data: 'dueDate', type: 'intl-date', dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' } },
  { data: 'startTime', type: 'intl-time', timeFormat: { hour: '2-digit', minute: '2-digit' } },
  { data: 'active', type: 'checkbox' },
];
```

## renderer / editor / validator の直接指定

`type` に紐づく関数より、列やセルに直接指定した `renderer` / `editor` / `validator` が優先される。意図せず built-in の renderer/editor/validator を上書きしていないか確認する。

```tsx
const RequiredValidator = (value: unknown, callback: (valid: boolean) => void) => {
  callback(String(value ?? '').trim().length > 0);
};

const BadgeRenderer = ({ value }: { value: unknown }) => {
  return <span>{String(value ?? '')}</span>;
};

<HotColumn
  data="status"
  type="dropdown"
  source={['open', 'closed']}
  renderer={BadgeRenderer}
  validator={RequiredValidator}
  allowInvalid={false}
/>
```

## custom cell type の登録

複数箇所で同じ renderer/editor/validator の組み合わせを使う場合は、custom cell type として alias 登録する。

```ts
import Handsontable from 'handsontable/base';

const requiredTextRenderer = Handsontable.renderers.TextRenderer;

function requiredValidator(value: unknown, callback: (valid: boolean) => void) {
  callback(String(value ?? '').trim().length > 0);
}

Handsontable.cellTypes.registerCellType('app.required-text', {
  renderer: requiredTextRenderer,
  editor: Handsontable.editors.TextEditor,
  validator: requiredValidator,
  allowInvalid: false,
});
```

```tsx
<HotColumn data="name" type="app.required-text" />
```

命名衝突を避けるため、`app.required-text` のような project prefix を使う。`numeric` や `password` など built-in alias を上書きしない。

## numeric の実装メモ

- 保存値は number にする。
- `Intl.NumberFormat` object-style の `numericFormat` を優先。
- 通貨や割合は display format と保存値を分けて考える。
- 入力値を number に変換する必要がある場合は `validator`, `beforeChange`, `valueParser` などを使う。

```tsx
<HotColumn
  data="price"
  type="numeric"
  numericFormat={{ style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }}
/>
```

## date / time の実装メモ

- v17 系の公式 docs では、date/time は `Intl.DateTimeFormat` object-style が推奨。
- `date` / `time` の legacy string-style は Moment.js 互換・移行時だけ検討。
- 保存値の形式は API と統一する。例: ISO string、`YYYY-MM-DD`、`HH:mm`。
- locale を切り替える場合は `locale` prop と表示 format をあわせる。

```tsx
<HotColumn
  data="dueDate"
  type="intl-date"
  dateFormat={{ year: 'numeric', month: '2-digit', day: '2-digit' }}
/>

<HotColumn
  data="startTime"
  type="intl-time"
  timeFormat={{ hour: '2-digit', minute: '2-digit' }}
/>
```

## select / dropdown / autocomplete / multiselect の選び分け

- `select`: シンプルな HTML select 的 UI。
- `dropdown`: 単一選択。候補外を拒否したいなら `strict: true`。
- `autocomplete`: 入力しながら候補を絞り込む。候補数が多い場合に向く。
- `multiselect`: 複数値を配列として 1 セルに保存する。

```tsx
<HotColumn data="category" type="autocomplete" source={categories} strict={false} />
<HotColumn data="status" type="dropdown" source={statuses} strict={true} allowInvalid={false} />
<HotColumn data="labels" type="multiselect" source={labels} />
```

## cell-level / row-level の調整

セルごとの条件分岐は `cells`、特定セルの明示設定は `cell`、行/列での設定は `columns` または `HotColumn` を使う。

```tsx
<HotTable
  data={rows}
  cells={(row, col) => {
    const cellProperties: Record<string, unknown> = {};
    if (col === 0) cellProperties.readOnly = true;
    if (row === 0) cellProperties.className = 'first-row';
    return cellProperties;
  }}
  licenseKey="non-commercial-and-evaluation"
/>
```

## セル型選定チェック

- [ ] 保存データ型を確認した。
- [ ] 表示形式と保存値の変換を分けた。
- [ ] built-in cell type で足りるか確認した。
- [ ] `renderer` / `editor` / `validator` の上書きが必要か確認した。
- [ ] custom cell type alias が必要なら project prefix で登録した。
- [ ] object data で `data` mapping を指定した。
- [ ] locale / i18n / IME の影響を確認した。
