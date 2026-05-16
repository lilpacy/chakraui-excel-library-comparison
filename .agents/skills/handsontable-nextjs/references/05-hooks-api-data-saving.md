# Hooks / Instance API / 保存

## Hooks の分類

Handsontable の hooks は、イベント的な `after*`、処理を止めたり変更できる `before*`、処理結果を変更する `modify*` で使い分ける。

### `after*` hooks

処理が完了したあとに反応する。保存、ログ、UI通知に向く。

```tsx
<HotTable
  afterCreateRow={(row, amount) => {
    console.log(`${amount} rows inserted from ${row}`);
  }}
/>
```

### `before*` hooks

処理前に検証し、必要なら `false` を返してブロックする。

```tsx
<HotTable
  beforeRemoveRow={(index, amount) => {
    return window.confirm(`${amount} rows will be removed from ${index}. Continue?`);
  }}
/>
```

### `modify*` hooks

幅、値、表示などの内部処理を変更する。

```tsx
<HotTable
  modifyColWidth={(width, column) => {
    if (column === 0) return Math.max(width, 120);
    return width;
  }}
/>
```

## 保存の基本: `afterChange`

変更保存では `source === 'loadData'` を無視する。初期読み込み・再読み込みで保存 API が呼ばれないようにする。

```tsx
<HotTable
  data={rows}
  afterChange={(changes, source) => {
    if (!changes || source === 'loadData') return;

    void fetch('/api/grid/changes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changes }),
    });
  }}
  licenseKey="non-commercial-and-evaluation"
/>
```

`changes` は通常 `[row, propOrCol, oldValue, newValue][]` 形式。object data の場合は prop name が入る。

## debounce / batch 保存

高頻度保存を避けるため、debounce、queue、保存ボタン方式を検討する。

```tsx
const queueRef = useRef<any[]>([]);
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const flushChanges = () => {
  const changes = queueRef.current.splice(0);
  if (changes.length === 0) return;
  void fetch('/api/grid/changes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ changes }),
  });
};

<HotTable
  afterChange={(changes, source) => {
    if (!changes || source === 'loadData') return;
    queueRef.current.push(...changes);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flushChanges, 500);
  }}
/>
```

## Next.js Route Handler 例

```ts
// app/api/grid/changes/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const changes = body.changes as Array<[number, string | number, unknown, unknown]>;

  // TODO: 認証・認可・schema validation・DB更新
  // prop name を信頼せず、許可された列だけ処理する。

  return NextResponse.json({ ok: true, count: changes.length });
}
```

## Instance API

`HotTable` の ref から `hotInstance` を取り、API を呼ぶ。

```tsx
const hotRef = useRef<any>(null);

const loadRows = async () => {
  const response = await fetch('/api/grid');
  const data = await response.json();
  hotRef.current?.hotInstance?.loadData(data.rows);
};

const saveAll = async () => {
  const hot = hotRef.current?.hotInstance;
  const sourceData = hot?.getSourceData();
  await fetch('/api/grid', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows: sourceData }),
  });
};

<HotTable ref={hotRef} data={rows} licenseKey="non-commercial-and-evaluation" />
```

## よく使う API 操作

| 目的 | API / 設定 | メモ |
|---|---|---|
| 全データ取得 | `getData()` | visual data。配列中心。 |
| source data 取得 | `getSourceData()` | object data の保存に向く。 |
| データ読み込み | `loadData(data)` | state をリセットする可能性を確認。 |
| データ差し替え | `updateData(data)` | state 維持を期待する場合に検討。 |
| セル更新 | `setDataAtCell(row, col, value)` | array data 向け。 |
| object prop 更新 | `setDataAtRowProp(row, prop, value)` | object data 向け。 |
| 選択 | `selectCell(row, col)` | 外部ボタンから操作。 |
| plugin 取得 | `getPlugin('filters')` など | plugin 有効化・登録が必要。 |
| 一括処理 | `batch(() => { ... })` | 大量更新時の再描画を減らす。 |
| 再描画 | `render()` | 外部状態変更後に必要な場合のみ。 |
| 検証 | `validateCells()` | 保存前 validation。 |

## Data binding の選び方

- Array of arrays: 表計算的。行列操作・列挿入・削除が多い場合。
- Array of objects: 業務データ向き。API / DB schema と対応しやすい。
- Function data source / schema: 動的な行列や schema 生成が必要な場合。
- No data: 空テーブルから入力させる場合。

object data では `HotColumn data="property"` または `columns: [{ data: 'property' }]` を明示する。

## 競合・バリデーション・セキュリティ

- 保存 API では client から来た `row`, `prop`, `newValue` をそのまま信頼しない。
- 認証・認可・schema validation を Route Handler / Server Action / API で行う。
- 行 ID を隠し列に置くだけで権限チェック済みとみなさない。
- `afterChange` の oldValue は client 側値なので、競合解決は server 側で実装する。
- HTML renderer / rich renderer では XSS を防ぐ。

## Hooks/API チェック

- [ ] 保存に `afterChange` を使い、`loadData` source を除外した。
- [ ] validation を client と server の両方で考えた。
- [ ] 外部操作が必要なら ref / `hotInstance` を用意した。
- [ ] 大量更新は `batch` や debounce を使った。
- [ ] plugin API を呼ぶ前に plugin module 登録・有効化を確認した。
- [ ] API route / Route Handler 側で認証・認可・schema validation を行った。
