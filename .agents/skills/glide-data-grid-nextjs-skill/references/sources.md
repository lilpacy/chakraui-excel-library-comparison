# 公式ソース対応表

このSkillを作るときに確認した一次情報・公式情報です。実装時はプロジェクトに入っている実バージョンの型定義を最終確認してください。

## Glide Data Grid

- GitHub repository: https://github.com/glideapps/glide-data-grid
  - install command
  - mandatory CSS import
  - minimal `DataEditor` usage
  - Next.jsで `dynamic(..., { ssr:false })` を使う案
  - data source agnosticで、ソート/フィルタはデータソース側で実装する方針

- API docs: https://docs.grid.glideapps.com/api/dataeditor
  - `DataEditor` の必須props: `columns`, `getCellContent`, `rows`
  - coordinate形式 `[col, row]`
  - editing callbackでデータ更新する必要があること
  - CSS/portal/image overlay注意
  - `getCellsForSelection`, `updateCells`, `showSearch`, `rowMarkers` など

- Common Types docs: https://docs.grid.glideapps.com/api/common-types
  - `GridColumn`
  - `GridCell`
  - `GridCellKind`
  - `BaseGridCell`
  - `GridSelection`
  - `Theme`

- Cell docs:
  - TextCell: https://docs.grid.glideapps.com/api/cells/textcell
  - NumberCell: https://docs.grid.glideapps.com/api/cells/numbercell
  - BooleanCell: https://docs.grid.glideapps.com/api/cells/booleancell
  - UriCell: https://docs.grid.glideapps.com/api/cells/uricell
  - ImageCell: https://docs.grid.glideapps.com/api/cells/imagecell
  - MarkdownCell: https://docs.grid.glideapps.com/api/cells/markdowncell
  - BubbleCell: https://docs.grid.glideapps.com/api/cells/bubblecell
  - DrilldownCell: https://docs.grid.glideapps.com/api/cells/drilldowncell
  - RowIDCell: https://docs.grid.glideapps.com/api/cells/rowidcell
  - ProtectedCell: https://docs.grid.glideapps.com/api/cells/protectedcell
  - LoadingCell: https://docs.grid.glideapps.com/api/cells/loadingcell

## Glide Data Grid source exports

- Package source index and types in the GitHub repository
  - `DataEditor`, `DataEditorCore`, `DataEditorRef`
  - `ImageOverlayEditor`, `MarkdownDiv`, `TextCellEntry`
  - `AllCellRenderers`
  - built-in renderers
  - hooks/utilities such as `useTheme`, `useColumnSizer`, `useRowGrouping`

## Additional cells

- `@glideapps/glide-data-grid-cells` package source
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

## Next.js

- App Router Client Components docs
  - Server Components are default in App Router.
  - Browser APIs, state, eventsなどはClient Componentで扱う。
  - `"use client"` directiveを使う。

- Next.js dynamic import docs
  - `ssr:false` でClient Componentsのprerenderingを無効化できる。
  - `ssr:false` はServer Components内では使えない。

- Next.js CSS docs
  - App Routerではglobal CSS/external CSSをlayoutなどでimportできる。
  - Pages Routerではglobal CSSを `pages/_app.js` / `_app.tsx` でimportする。
