---
name: react-datasheet-grid-nextjs
description: Use this skill when implementing, reviewing, or fixing React Datasheet Grid in Next.js or React apps. Covers App Router and Pages Router setup, client components, global CSS import, DataSheetGrid, DynamicDataSheetGrid, built-in columns, keyColumn, createTextColumn, custom Cell components, props, refs, i18n, styling, performance, row operations, and common recipes.
---

# React Datasheet Grid for Next.js

Use this skill whenever a task involves `react-datasheet-grid`, spreadsheet-like grids, Excel/Airtable-like editing, custom grid columns, copy/paste, row operations, or Next.js integration problems around the package.

## Default approach

1. **Detect the Next.js router.** If the user does not specify, assume App Router.
2. **Install and import CSS once.** Use `npm i react-datasheet-grid`. In App Router import `react-datasheet-grid/dist/style.css` in `app/layout.tsx`; in Pages Router import it in `pages/_app.tsx`.
3. **Put the grid in a Client Component.** In App Router, any component using DSG state, events, refs, or browser APIs must start with `'use client'`.
4. **Prefer object rows + `keyColumn`.** Define a row type, keep `value` as `Row[]`, and map object keys with `keyColumn('field', builtInColumn)`.
5. **Choose grid component intentionally.** Use `DataSheetGrid` by default. Use `DynamicDataSheetGrid` only when object/function props such as `columns`, `createRow`, or `duplicateRow` need to change after the first render; memoize dynamic props with `useMemo` / `useCallback`.
6. **Cover editing semantics.** For custom columns, always define `component`, `deleteValue`, `copyValue`, `pasteValue`, and usually `isCellEmpty`. Use `columnData` for options.
7. **Check Next.js SSR pitfalls.** Guard `document` / `window`; use `isoDateColumn` when passing server-loaded date strings, or convert strings to `Date` objects before using `dateColumn`.
8. **Verify the full API checklist below before finalizing.**

## Must-not-miss API checklist

When implementing or reviewing, make sure no relevant piece is omitted:

- Grid components: `DataSheetGrid`, `DynamicDataSheetGrid`.
- Built-in columns: `textColumn`, `checkboxColumn`, `intColumn`, `floatColumn`, `percentColumn`, `dateColumn`, `isoDateColumn`.
- Column factories/helpers: `keyColumn`, `createTextColumn`.
- Customizable component helpers: `createAddRowsComponent`, `createContextMenuComponent`, `renderContextMenuItem`.
- Public types: `Column`, `CellComponent`, `CellProps`, `DataSheetGridProps`, `AddRowsComponentProps`, `SimpleColumn`, `ContextMenuComponentProps`, `ContextMenuItem`, `DataSheetGridRef`.
- Grid props: `value`, `onChange`, `columns`, `gutterColumn`, `stickyRightColumn`, `height`, `rowHeight`, `headerRowHeight`, `lockRows`, `autoAddRow`, `disableContextMenu`, `disableExpandSelection`, `disableSmartDelete`, `className`, `style`, `rowClassName`, `cellClassName`, `rowKey`, `createRow`, `duplicateRow`, `addRowsComponent`, `contextMenuComponent`, `onFocus`, `onBlur`, `onActiveCellChange`, `onSelectionChange`, `onScroll`.
- Column props: `title`, `id`, `basis`, `grow`, `shrink`, `minWidth`, `maxWidth`, `copyValue`, `pasteValue`, `prePasteValues`, `deleteValue`, `component`, `columnData`, `headerClassName`, `cellClassName`, `disabled`, `disableKeys`, `keepFocus`, `isCellEmpty`.
- Cell props: `rowData`, `setRowData`, `rowIndex`, `columnIndex`, `columnData`, `active`, `focus`, `disabled`, `stopEditing`, `insertRowBelow`, `duplicateRow`, `deleteRow`, `getContextMenuItems`.
- Ref API: `activeCell`, `selection`, `setActiveCell`, `setSelection`.
- Operation API: `onChange(newValue, operations)` where operations have `type: 'UPDATE' | 'DELETE' | 'CREATE'`, `fromRowIndex`, `toRowIndex`.

## Reference files

Read these as needed:

- [React Datasheet Grid API cheat sheet](reference/react-datasheet-grid-api.md) for exhaustive exports, props, column options, cell props, refs, and operations.
- [Next.js integration guide](reference/nextjs-integration.md) for App Router, Pages Router, CSS, SSR, dates, and dynamic import guidance.
- [Custom columns and recipes](reference/custom-columns-and-recipes.md) for custom cell components, select columns, i18n, row IDs, change tracking, collapsible rows, and infinite scroll.

## Output standard

When producing code:

- Use TypeScript unless the project is clearly JavaScript-only.
- Include the CSS import location, not just the component code.
- Use `import type` for DSG types when possible.
- Prefer `rowKey="id"` and `createRow` / `duplicateRow` when rows can be inserted, deleted, or duplicated.
- Avoid accessing `document.body`, `window`, or `localStorage` during render without a `typeof` guard.
- Do not import internal files from `react-datasheet-grid/dist/...`; use the package root exports.
