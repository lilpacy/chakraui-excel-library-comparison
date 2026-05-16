---
name: glide-data-grid-nextjs
description: Next.js/Reactプロジェクトで @glideapps/glide-data-grid を導入・修正・レビューするときに使う。DataEditor/DataEditorCore、標準GridCellKind、@glideapps/glide-data-grid-cells の全追加セル、App Router/Pages Router、dynamic ssr:false、CSS/portal、編集・選択・コピー/ペースト・カスタムセル・パフォーマンスを扱う。
allowed-tools:
  - Read
  - Write
  - Edit
  - MultiEdit
  - Grep
  - Glob
  - Bash
---

# Glide Data Grid for Next.js

## 目的

このSkillは、Next.jsで `@glideapps/glide-data-grid` を安全に導入・実装・修正・レビューするための手順パッケージです。標準セル、追加セル、Next.js固有のSSR/CSS制約、編集・選択・コピー/ペースト・カスタムセルまでを漏れなく扱います。

## 使うべき場面

次のいずれかが出たらこのSkillを使います。

- `@glideapps/glide-data-grid`, `Glide Data Grid`, `DataEditor`, `GridCellKind`, `GridColumn`, `customRenderers`
- Next.jsで高性能な表、スプレッドシート風UI、仮想化グリッドを作る依頼
- SSRエラー、CSSが効かない、portal/overlay/editing/copy-paste/custom cellの相談
- `@glideapps/glide-data-grid-cells` の追加セルを使う依頼

## 最初に読むファイル

依頼内容に応じて、必要な参照だけを読むこと。

- Next.js導入とSSR/CSS: [references/nextjs-setup.md](references/nextjs-setup.md)
- コンポーネント・props・セル種別の全体表: [references/component-and-cell-reference.md](references/component-and-cell-reference.md)
- カスタムセル・エディタ: [references/custom-cells-and-editors.md](references/custom-cells-and-editors.md)
- 実装レシピ: [references/recipes.md](references/recipes.md)
- よくある不具合: [references/troubleshooting.md](references/troubleshooting.md)
- 公式ソース対応表: [references/sources.md](references/sources.md)

## 基本ワークフロー

1. **Next.js構成を判定する**  
   `app/` があればApp Router、`pages/` があればPages Routerとして扱う。両方ある場合は対象ファイルの配置で判断する。

2. **インストール状態を確認する**  
   `package.json` を読み、`@glideapps/glide-data-grid`、peer dependency、必要なら `@glideapps/glide-data-grid-cells` が入っているか確認する。バージョンはプロジェクト実体を優先し、思い込みで固定しない。

3. **Client Component境界を守る**  
   App Routerでは、Grid本体コンポーネントに `"use client"` を付ける。SSRを避ける場合、`dynamic(..., { ssr: false })` はClient Componentのラッパー内で使う。

4. **CSSとportalを確認する**  
   `@glideapps/glide-data-grid/dist/index.css` は必須。`ImageCell` のoverlayを使うときは `react-responsive-carousel/lib/styles/carousel.min.css` も読み込む。overlay用に `#portal` をlayout/bodyへ置く。

5. **DataEditorの最小要件を満たす**  
   `columns`, `rows`, `getCellContent` は必須。座標は `[col, row]`。`getCellContent` は高速・純粋にし、必要に応じて `useCallback` と `useMemo` を使う。

6. **編集はstate/source of truth側で処理する**  
   Gridは元データを自動更新しない。`onCellEdited`, `onCellsEdited`, `onPaste`, `onRowAppended` などで外部stateやDBを更新する。

7. **コピー/ペーストと選択を明示する**  
   コピーには `getCellsForSelection`、各セルの `copyData`、必要なら `copyHeaders` を設計する。貼り付けは `onPaste` を実装するか、仕様に合わせて禁止する。

8. **追加セルは `customRenderers` に登録する**  
   `@glideapps/glide-data-grid-cells` を使う場合は `customRenderers={allCells}` または必要なrendererだけを渡す。現在の追加セル一覧は参照ファイルの表で確認する。

9. **完了前チェックを必ず行う**  
   実装・回答・レビューの前に下の「網羅チェック」を見て、セル種別・Next.js設定・編集/選択/コピーの漏れがないか確認する。

## 網羅チェック

回答やコードに必要な範囲で、以下を漏らしていないか確認する。

### 標準セル（`GridCellKind`）

- `Text`
- `Number`
- `Boolean`
- `Uri`
- `Image`
- `Markdown`
- `Bubble`
- `Drilldown`
- `RowID`
- `Protected`
- `Loading`
- `Custom`

### 内部/特殊セル

- `Marker`
- `NewRow`

### 主要コンポーネント/exports

- `DataEditor`
- `DataEditorCore`
- `DataEditorRef`
- `ImageOverlayEditor`
- `MarkdownDiv`
- `TextCellEntry`
- 標準renderer群と `AllCellRenderers`
- `useTheme`, `getDefaultTheme`, `useColumnSizer`, `useRowGrouping`

### 追加セル（`@glideapps/glide-data-grid-cells`）

- `StarCell`
- `SparklineCell`
- `TagsCell`
- `UserProfileCell`
- `DropdownCell`
- `ArticleCell`
- `RangeCell`
- `SpinnerCell`
- `DatePickerCell`
- `LinksCell`
- `ButtonCell`
- `TreeViewCell`
- `MultiSelectCell`
- `allCells`

### Next.js固有項目

- App Router: `"use client"`, dynamic import wrapper, global CSS import位置, `#portal`
- Pages Router: `_app.tsx` のglobal CSS, page側dynamic import
- `ssr:false` をServer Component内で直接使わない

## 重要な禁止事項

- 座標を `[row, col]` として扱わない。常に `[col, row]`。
- Gridが元データを勝手に更新すると説明しない。
- `getCellContent` 内で重い計算、同期fetch、DOM操作、React Hook呼び出しをしない。
- Next.js App RouterのServer Component内で `dynamic(..., { ssr:false })` を直接使う実装を提案しない。
- 追加セルを使うのに `customRenderers` 登録を忘れない。

## 便利な検証

Skillフォルダ内で以下を実行すると、参照ファイルに主要セル/コンポーネント名が含まれているか簡易確認できる。

```bash
python scripts/verify_coverage.py
```
