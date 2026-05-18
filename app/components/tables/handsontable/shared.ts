import Handsontable from "handsontable/base";
import { hasCellType, registerCellType } from "handsontable/cellTypes";
import { DropdownCellType } from "handsontable/cellTypes/dropdownType";
import { NumericCellType } from "handsontable/cellTypes/numericType";
import { ColumnSorting } from "handsontable/plugins/columnSorting";
import {
  ContextMenu,
  type PredefinedMenuItemKey,
} from "handsontable/plugins/contextMenu";
import { CopyPaste } from "handsontable/plugins/copyPaste";
import { DropdownMenu } from "handsontable/plugins/dropdownMenu";
import { Filters } from "handsontable/plugins/filters";
import { ManualColumnMove } from "handsontable/plugins/manualColumnMove";
import { registerPlugin } from "handsontable/plugins/registry";
import { UndoRedo } from "handsontable/plugins/undoRedo";
import { textRenderer } from "handsontable/renderers/textRenderer";
import type { CellProperties, ColumnSettings, GridSettings } from "handsontable/settings";
import { salesStatusColorPalette } from "@/app/design-system/patterns";
import type { HandsontableFeatureProfile } from "@/app/components/tables/handsontable/profiles";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";
import { salesOrderStatuses } from "@/lib/db/schema";

export type ColumnKey = keyof SalesOrderRow;
export type HandsontableCore = Parameters<typeof textRenderer>[0];
export type ContextMenuTarget = "cell" | "column-header" | "row-header" | "corner";

export const defaultFeatureProfile: HandsontableFeatureProfile = {
  filters: true,
  dropdownMenu: true,
  contextMenu: true,
  columnSorting: true,
  manualColumnMove: true,
  undo: true,
  headerStyling: true,
  statusRenderer: true,
};

export const columnKeys: ColumnKey[] = [
  "orderId",
  "orderDate",
  "customer",
  "region",
  "rep",
  "category",
  "product",
  "quantity",
  "unitPrice",
  "status",
];

export const colHeaders = [
  "Order ID",
  "Date",
  "Customer",
  "Region",
  "Sales Rep",
  "Category",
  "Product",
  "Qty",
  "Unit Price",
  "Status",
];

export const contextMenuItems: readonly PredefinedMenuItemKey[] = [
  "filter_by_condition",
  "filter_by_value",
  "filter_action_bar",
  "cut",
  "copy",
  "undo",
  "redo",
];

export const contextMenuKeysByTarget = {
  cell: new Set(["cut", "copy", "undo", "redo"]),
  "column-header": new Set([
    "filter_by_condition",
    "filter_by_value",
    "filter_action_bar",
  ]),
  "row-header": new Set(["copy", "undo", "redo"]),
  corner: new Set(["copy", "undo", "redo"]),
} as const;

const textColumnHeaderClassName = "ds-ht-column-header";
const numericColumnHeaderClassName = "ds-ht-column-header ds-ht-column-header--numeric";
const headerToneClassNames = [
  "ds-ht-column-header--tone-blue",
  "ds-ht-column-header--tone-yellow",
  "ds-ht-column-header--tone-green",
  "ds-ht-column-header--tone-fuchsia",
  "ds-ht-column-header--tone-aqua",
  "ds-ht-column-header--tone-orange",
  "ds-ht-column-header--tone-iris",
  "ds-ht-column-header--tone-red",
  "ds-ht-column-header--tone-lime",
  "ds-ht-column-header--tone-magenta",
] as const;
const headerToneBackgroundVars = [
  "var(--ds-color-accent-blue-bg)",
  "var(--ds-color-accent-yellow-bg)",
  "var(--ds-color-accent-green-bg)",
  "var(--ds-color-accent-fuchsia-bg)",
  "var(--ds-color-accent-aqua-bg)",
  "var(--ds-color-accent-orange-bg)",
  "var(--ds-color-accent-iris-bg)",
  "var(--ds-color-accent-red-bg)",
  "var(--ds-color-accent-lime-bg)",
  "var(--ds-color-accent-magenta-bg)",
] as const;
const headerToneClassNameByKey = Object.fromEntries(
  columnKeys.map((key, index) => [key, headerToneClassNames[index]]),
) as Record<ColumnKey, (typeof headerToneClassNames)[number]>;
const headerToneBackgroundVarByKey = Object.fromEntries(
  columnKeys.map((key, index) => [key, headerToneBackgroundVars[index]]),
) as Record<ColumnKey, (typeof headerToneBackgroundVars)[number]>;
const numericColumnKeys = new Set<ColumnKey>(["quantity", "unitPrice"]);

function registerCellTypeIfNeeded(name: "numeric" | "dropdown") {
  if (hasCellType(name)) {
    return;
  }

  if (name === "numeric") {
    registerCellType(NumericCellType);
    return;
  }

  registerCellType(DropdownCellType);
}

export function registerHandsontableModules() {
  registerCellTypeIfNeeded("numeric");
  registerCellTypeIfNeeded("dropdown");
  registerPlugin(CopyPaste);
  registerPlugin(Filters);
  registerPlugin(DropdownMenu);
  registerPlugin(ContextMenu);
  registerPlugin(ColumnSorting);
  registerPlugin(ManualColumnMove);
  registerPlugin(UndoRedo);
}

export function cloneRow(row: SalesOrderRow): SalesOrderRow {
  return { ...row };
}

export function cloneRows(rows: SalesOrderRow[]): SalesOrderRow[] {
  return rows.map(cloneRow);
}

export function rowsEqual(left: SalesOrderRow[], right: SalesOrderRow[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((row, index) =>
    columnKeys.every((key) => row[key] === right[index]?.[key]),
  );
}

export function isColumnKey(value: unknown): value is ColumnKey {
  return typeof value === "string" && columnKeys.includes(value as ColumnKey);
}

export function coerceNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.trunc(numericValue) : 0;
}

export function coerceStatus(value: unknown): SalesOrderStatus {
  return salesOrderStatuses.includes(value as SalesOrderStatus)
    ? (value as SalesOrderStatus)
    : "Pending";
}

export function coerceRow(
  value: Partial<SalesOrderRow> & Record<string, unknown>,
): SalesOrderRow {
  return {
    orderId: String(value.orderId ?? ""),
    orderDate: String(value.orderDate ?? ""),
    customer: String(value.customer ?? ""),
    region: String(value.region ?? ""),
    rep: String(value.rep ?? ""),
    category: String(value.category ?? ""),
    product: String(value.product ?? ""),
    quantity: coerceNumber(value.quantity),
    unitPrice: coerceNumber(value.unitPrice),
    status: coerceStatus(value.status),
  };
}

export function rollbackChanges(
  physicalRowIndex: number,
  row: SalesOrderRow,
): Array<[number, ColumnKey, SalesOrderRow[ColumnKey]]> {
  return columnKeys.map((key) => [physicalRowIndex, key, row[key]]);
}

export function salesStatusRenderer(
  instance: HandsontableCore,
  td: HTMLTableCellElement,
  row: number,
  column: number,
  prop: string | number,
  value: unknown,
  cellProperties: CellProperties,
) {
  textRenderer(instance, td, row, column, prop, value, cellProperties);

  const status = coerceStatus(value);
  const tone = salesStatusColorPalette[status];

  td.textContent = "";

  const badge = document.createElement("span");
  badge.className = "ds-sales-status-badge";
  badge.dataset.tone = tone;
  badge.textContent = status;

  td.appendChild(badge);
}

export function createColumns(
  featureProfile: HandsontableFeatureProfile,
): ColumnSettings[] {
  return [
    {
      data: "orderId",
      type: "text",
      width: 88,
      className: "ds-ht-cell--order-id",
      headerClassName: `${textColumnHeaderClassName} ds-ht-column-header--tone-blue`,
    },
    {
      data: "orderDate",
      type: "text",
      width: 92,
      headerClassName: `${textColumnHeaderClassName} ds-ht-column-header--tone-yellow`,
    },
    {
      data: "customer",
      type: "text",
      width: 135,
      headerClassName: `${textColumnHeaderClassName} ds-ht-column-header--tone-green`,
    },
    {
      data: "region",
      type: "text",
      width: 92,
      headerClassName: `${textColumnHeaderClassName} ds-ht-column-header--tone-fuchsia`,
    },
    {
      data: "rep",
      type: "text",
      width: 106,
      headerClassName: `${textColumnHeaderClassName} ds-ht-column-header--tone-aqua`,
    },
    {
      data: "category",
      type: "text",
      width: 99,
      headerClassName: `${textColumnHeaderClassName} ds-ht-column-header--tone-orange`,
    },
    {
      data: "product",
      type: "text",
      width: 131,
      headerClassName: `${textColumnHeaderClassName} ds-ht-column-header--tone-iris`,
    },
    {
      data: "quantity",
      type: "numeric",
      width: 59,
      className: "htRight htNumeric ds-ht-cell--numeric",
      headerClassName: `${numericColumnHeaderClassName} ds-ht-column-header--tone-red`,
      locale: "ja-JP",
      numericFormat: { maximumFractionDigits: 0, useGrouping: true },
    },
    {
      data: "unitPrice",
      type: "numeric",
      width: 79,
      className: "htRight htNumeric ds-ht-cell--numeric",
      headerClassName: `${numericColumnHeaderClassName} ds-ht-column-header--tone-lime`,
      locale: "ja-JP",
      numericFormat: {
        style: "currency",
        currency: "JPY",
        maximumFractionDigits: 0,
      },
    },
    {
      data: "status",
      type: "dropdown",
      width: 87,
      className: "ds-ht-cell--status",
      headerClassName: `${textColumnHeaderClassName} ds-ht-column-header--tone-magenta`,
      renderer: featureProfile.statusRenderer ? salesStatusRenderer : undefined,
      source: [...salesOrderStatuses],
      strict: true,
      allowInvalid: false,
    },
  ];
}

export function handleAfterGetColHeader(
  this: HandsontableCore,
  column: number,
  th: HTMLTableCellElement,
) {
  if (column < 0) {
    return;
  }

  const prop = this.colToProp(column);

  if (!isColumnKey(prop)) {
    return;
  }

  th.classList.remove(...headerToneClassNames, "ds-ht-column-header--numeric");
  th.classList.add(textColumnHeaderClassName, headerToneClassNameByKey[prop]);
  th.style.backgroundColor = headerToneBackgroundVarByKey[prop];
  th.style.textAlign = numericColumnKeys.has(prop) ? "end" : "start";

  if (numericColumnKeys.has(prop)) {
    th.classList.add("ds-ht-column-header--numeric");
  }
}

export function getContextMenuTarget(row: number, column: number): ContextMenuTarget {
  if (row < 0 && column < 0) {
    return "corner";
  }

  if (row < 0) {
    return "column-header";
  }

  if (column < 0) {
    return "row-header";
  }

  return "cell";
}

export function createGridSettings(
  rows: SalesOrderRow[],
  featureProfile: HandsontableFeatureProfile,
): GridSettings {
  return {
    data: rows,
    columns: createColumns(featureProfile),
    colHeaders,
    rowHeaders: true,
    rowHeaderWidth: 44,
    width: "100%",
    height: 360,
    stretchH: "none",
    fixedColumnsStart: 1,
    autoRowSize: false,
    autoColumnSize: false,
    licenseKey: "non-commercial-and-evaluation",
    themeName: "ht-theme-main",
    textEllipsis: true,
    contextMenu: featureProfile.contextMenu ? { items: [...contextMenuItems] } : false,
    filters: featureProfile.filters,
    dropdownMenu:
      featureProfile.filters && featureProfile.dropdownMenu
        ? ["filter_by_condition", "filter_by_value", "filter_action_bar"]
        : false,
    columnSorting: featureProfile.columnSorting,
    manualColumnMove: featureProfile.manualColumnMove,
    undo: featureProfile.undo,
    afterGetColHeader: featureProfile.headerStyling ? handleAfterGetColHeader : undefined,
  };
}

export type HandsontableInstance = Handsontable;
