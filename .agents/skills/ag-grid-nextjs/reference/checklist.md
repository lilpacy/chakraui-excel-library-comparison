# AG Grid + Next.js レビュー用チェックリスト

## セットアップ

- [ ] `ag-grid-react` が installed。
- [ ] Enterprise 機能を使う場合、`ag-grid-enterprise` が installed。
- [ ] `ag-grid-react` と `ag-grid-enterprise` の version が一致している。
- [ ] 新規実装では `AgGridProvider` に modules が渡されている。
- [ ] bundle size が重要な場合、`AllCommunityModule` ではなく必要 module だけを登録している。

## Next.js

- [ ] `AgGridReact` を含む file に `"use client";` がある。
- [ ] Server Component から Client Component に serializable props だけを渡している。
- [ ] 親 container に明示的な height がある。
- [ ] Pages Router で必要な場合、`dynamic(..., { ssr: false })` を使っている。

## テーマ

- [ ] v33+ 新規実装では Theming API を使っている。
- [ ] legacy theme の場合、CSS import / `ag-theme-*` class / `theme="legacy"` が揃っている。
- [ ] theme object は render ごとに再生成されない。

## React Hooks / 状態

- [ ] `rowData` が `useState` / `useMemo` で安定している。
- [ ] `columnDefs` が `useState` / `useMemo` で安定している。
- [ ] `defaultColDef`, `rowSelection`, `sideBar`, `statusBar`, `toolbar`, `components` が `useMemo` / `useState` で安定している。
- [ ] callback props が `useCallback` で安定し、依存配列が正しい。
- [ ] row update がある場合、`getRowId` がある。

## Column / Feature 設定

- [ ] `ColDef<TData>[]` と `AgGridReact<TData>` を使っている。
- [ ] `pagination` は boolean として渡し、page size は `paginationPageSize` で渡している。
- [ ] filter type は data type / Enterprise 利用可否に合っている。
- [ ] editing では `editable`, `cellEditor`, `valueParser` / `valueSetter`, `onCellValueChanged` が目的に合っている。
- [ ] row selection は `rowSelection={{ mode: 'singleRow' | 'multiRow' }}` の object API を使っている。

## Components

- [ ] component 種別は `reference/component-catalog.md` の表に照らして選んでいる。
- [ ] provided component で足りる場合、custom component を作りすぎていない。
- [ ] custom component は direct reference を優先している。
- [ ] JSON 化した columnDefs が必要な場合だけ `components` map に名前登録している。
- [ ] custom props は対応する `*Params` で渡している。
- [ ] 行ごとの切り替えは `*Selector` で実装している。
- [ ] custom editor は controlled component として `onValueChange` を呼んでいる。
- [ ] custom filter / floating filter は `enableFilterHandlers` を前提にしている。
- [ ] custom cell renderer 内のボタンや input は keyboard/focus 操作を考慮している。

## Enterprise

- [ ] Enterprise 機能であることをユーザーに明示している。
- [ ] license key を `.env.local` などから読み、直書きしていない。
- [ ] `NEXT_PUBLIC_` の値は client に露出することを理解している。
- [ ] Enterprise module が provider に登録されている。

## SSRM / API

- [ ] SSRM を使う場合、`rowModelType="serverSide"` がある。
- [ ] `serverSideDatasource` を `onGridReady` などで設定している。
- [ ] route handler が sort/filter/pagination を server-side で処理している。
- [ ] error 時に `params.fail()` を呼んでいる。
- [ ] response が `{ rows, lastRow }` または AG Grid API に合う形になっている。

## QA

- [ ] `npm run lint` が通る。
- [ ] `npm run typecheck` があれば通る。
- [ ] `npm test` があれば通る。
- [ ] Grid の初期表示、sort、filter、pagination、selection、editing、custom component が手動または自動 test されている。
