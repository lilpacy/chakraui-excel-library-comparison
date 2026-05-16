# Source Notes

この Skill は、2026-05-16 時点で確認した AG Grid 公式ドキュメント / 公式ブログをもとに作成している。実装時にバージョン差異が疑われる場合は、対象プロジェクトの installed version と公式ドキュメントを再確認する。

## 公式参照

- React Data Grid Quick Start: https://www.ag-grid.com/react-data-grid/getting-started/
- React Data Grid Installation: https://www.ag-grid.com/react-data-grid/installation/
- React Data Grid Custom Components: https://www.ag-grid.com/react-data-grid/components/
- React Data Grid Cell Components: https://www.ag-grid.com/react-data-grid/component-cell-renderer/
- React Data Grid Edit Components: https://www.ag-grid.com/react-data-grid/cell-editors/
- React Data Grid Filter Component: https://www.ag-grid.com/react-data-grid/component-filter/
- React Data Grid Floating Filter Component: https://www.ag-grid.com/react-data-grid/component-floating-filter/
- React Data Grid Column Headers - Custom Components: https://www.ag-grid.com/react-data-grid/column-headers-components/
- React Data Grid Tooltips: https://www.ag-grid.com/react-data-grid/tooltips/
- React Data Grid Overlays: https://www.ag-grid.com/react-data-grid/overlays-overview/
- React Data Grid Provided Overlays: https://www.ag-grid.com/react-data-grid/overlays-provided/
- React Data Grid Active Overlay: https://www.ag-grid.com/react-data-grid/overlays-active/
- React Data Grid Loading Component: https://www.ag-grid.com/react-data-grid/component-loading-cell-renderer/
- React Data Grid Status Bar: https://www.ag-grid.com/react-data-grid/status-bar/
- React Data Grid Tool Panels: https://www.ag-grid.com/react-data-grid/tool-panel/
- React Data Grid Quick Access Toolbar: https://www.ag-grid.com/react-data-grid/toolbar/
- React Data Grid Menu Item Component: https://www.ag-grid.com/react-data-grid/component-menu-item/
- React Best Practices: https://www.ag-grid.com/react-data-grid/react-hooks/
- Migrating to the Theming API: https://www.ag-grid.com/react-data-grid/theming-migration/
- Using AG Grid with Next.js to Build a React Table: https://blog.ag-grid.com/using-ag-grid-with-next-js-to-build-a-react-table/

## 反映した重要ポイント

- `ag-grid-react` は `ag-grid-community` を同時に導入する。
- current docs では `AgGridProvider` に modules を渡す構成が示されている。
- Next.js では AG Grid を含む component を client-rendered にする必要がある。
- AG Grid v33+ では Theming API が default で、legacy CSS themes は deprecated 扱い。
- React Hooks では `rowData`, `columnDefs`, object props, callbacks の参照安定性が重要。
- Custom Components ページの component usage table と grid-provided components を漏れなく反映した。
