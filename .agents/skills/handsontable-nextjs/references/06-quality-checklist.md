# 品質・漏れ防止チェックリスト

## 1. Next.js 境界

- [ ] `HotTable` を render するファイルに `'use client'` がある。
- [ ] Server Component で DB/API 取得、Client Component でグリッド描画という分離になっている。
- [ ] Client Component に server-only code / secret を import していない。
- [ ] Client Component へ渡す props は serializable。
- [ ] 必要なら Client Component 内の `next/dynamic(..., { ssr: false })` を使っている。
- [ ] `ssr: false` を Server Component で直接使っていない。

## 2. package / version / wrapper

- [ ] `handsontable` と `@handsontable/react-wrapper` が入っている。
- [ ] React 18+ 前提に合っている。
- [ ] 旧 `@handsontable/react` と新 `@handsontable/react-wrapper` の API を混ぜていない。
- [ ] 旧 `settings` prop 前提ではなく、wrapper props または `HotColumn` props を使っている。
- [ ] migration guide が必要なバージョンか確認した。

## 3. モジュール登録

- [ ] `registerAllModules()` または個別登録を行った。
- [ ] 個別登録の場合、使う cell type / renderer / editor / validator / plugin / i18n が登録されている。
- [ ] bundle size の意図が説明できる。
- [ ] `formulas` を使う場合、HyperFormula との関係を確認した。

## 4. コンポーネント

- [ ] `HotTable` の全体 props が適切。
- [ ] `HotColumn` または `columns` 配列を選び、プロジェクト内で一貫している。
- [ ] object data の `data` mapping が漏れていない。
- [ ] React renderer component を使う列が明示されている。
- [ ] React editor component / `EditorComponent` が必要な列を確認した。
- [ ] validator が必要な列を確認した。
- [ ] ref / `hotInstance` が必要か判断した。

## 5. Built-in cell types

全セル型を要件に照らして確認する。

- [ ] `text`
- [ ] `numeric`
- [ ] `date` / `intl-date`
- [ ] `time` / `intl-time`
- [ ] `checkbox`
- [ ] `select`
- [ ] `dropdown`
- [ ] `autocomplete`
- [ ] `multiselect`
- [ ] `password`
- [ ] `handsontable`

## 6. Plugins / features

全 plugin / feature を要件に照らして確認する。

- [ ] AutoColumnSize / AutoRowSize
- [ ] Autofill
- [ ] BindRowsWithHeaders
- [ ] CollapsibleColumns
- [ ] ColumnSorting / MultiColumnSorting
- [ ] ColumnSummary
- [ ] Comments
- [ ] ContextMenu
- [ ] CopyPaste
- [ ] CustomBorders
- [ ] DragToScroll / TouchScroll
- [ ] DropdownMenu
- [ ] ExportFile
- [ ] Filters
- [ ] Formulas
- [ ] HiddenColumns / HiddenRows
- [ ] ManualColumnFreeze
- [ ] ManualColumnMove / ManualRowMove
- [ ] ManualColumnResize / ManualRowResize
- [ ] MergeCells
- [ ] MultipleSelectionHandles
- [ ] NestedHeaders / NestedRows
- [ ] Search
- [ ] StretchColumns
- [ ] TrimRows
- [ ] UndoRedo
- [ ] Empty Data State / Dialog / Loading / Pagination など guide-level feature

## 7. Theme / CSS / i18n

- [ ] Theme API object または CSS theme string を使っている。
- [ ] v15+ の theme 要件を確認した。
- [ ] 旧 `handsontable.full.min.css` 前提ではない。
- [ ] Next.js の global CSS 制約に合わせて CSS import 場所を選んだ。
- [ ] 日本語など UI 翻訳が必要なら `registerLanguageDictionary(jaJP)` と `language` を設定した。
- [ ] numeric/date/time で `locale` を設定した。
- [ ] 日本語 IME 入力をテストした。

## 8. Hooks / API / 保存

- [ ] `afterChange` 保存で `source === 'loadData'` を除外した。
- [ ] debounce / batch / manual save の必要性を判断した。
- [ ] Route Handler / API 側で認証・認可・validation を行う。
- [ ] ref / `hotInstance` の API 呼び出しが null-safe。
- [ ] plugin API を呼ぶ前に plugin が有効化されている。
- [ ] 競合・同時編集・ロールバック方針を決めた。

## 9. Performance

- [ ] 大量データで virtualization / render performance を確認した。
- [ ] 大量更新で `batch` を検討した。
- [ ] 重い renderer を避けた。
- [ ] React renderer 使用時、auto size との相性を確認した。
- [ ] 必要 plugin だけ登録・有効化した。
- [ ] dynamic import で初期 bundle を抑えた。

## 10. Security / accessibility

- [ ] HTML renderer / custom renderer で XSS を防いだ。
- [ ] password cell を本当の秘密情報保護と誤解していない。
- [ ] copy/paste、export、context menu で権限上問題がない。
- [ ] keyboard navigation / focus / screen reader を確認した。
- [ ] readOnly / disabled cells の UX が明確。

## 11. 最終回答テンプレート

実装・レビュー結果を返すときは、必要に応じて以下を含める。

```text
- Next.js構成: App Router / Pages Router、Client Component境界、SSR回避有無
- Handsontable構成: wrapper、HotTable、HotColumn/columns、module registration
- セル型: 採用した type と理由
- コンポーネント: renderer/editor/validator/ref の有無
- Plugins/features: 有効化したもの
- Theme/i18n: theme、language、locale
- 保存/API: hooks、Route Handler、validation
- 注意点: bundle size、security、migration、testing
```
