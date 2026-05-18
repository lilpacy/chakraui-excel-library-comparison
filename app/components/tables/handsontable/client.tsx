"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { HotTable, type HotTableRef } from "@handsontable/react-wrapper";
import { hasCellType, registerCellType } from "handsontable/cellTypes";
import { DropdownCellType } from "handsontable/cellTypes/dropdownType";
import { NumericCellType } from "handsontable/cellTypes/numericType";
import type { CellChange } from "handsontable/common";
import { ColumnSorting } from "handsontable/plugins/columnSorting";
import { ContextMenu } from "handsontable/plugins/contextMenu";
import { CopyPaste } from "handsontable/plugins/copyPaste";
import { DropdownMenu } from "handsontable/plugins/dropdownMenu";
import { Filters } from "handsontable/plugins/filters";
import { ManualColumnMove } from "handsontable/plugins/manualColumnMove";
import { registerPlugin } from "handsontable/plugins/registry";
import { UndoRedo } from "handsontable/plugins/undoRedo";
import { textRenderer } from "handsontable/renderers/textRenderer";
import { updateSalesOrder } from "@/app/actions/sales-orders";
import {
  designSystemClassNames,
  salesStatusColorPalette,
} from "@/app/design-system/patterns";
import type { HandsontableFeatureProfile } from "@/app/components/tables/handsontable/profiles";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";
import type { CellProperties, ColumnSettings } from "handsontable/settings";
import { salesOrderStatuses } from "@/lib/db/schema";

type HandsontableSalesTableClientProps = {
  initialRows: SalesOrderRow[];
  featureProfile?: HandsontableFeatureProfile;
};

type ColumnKey = keyof SalesOrderRow;
type HandsontableCore = Parameters<typeof textRenderer>[0];
type ContextMenuTarget = "cell" | "column-header" | "row-header" | "corner";
type ContextMenuPlugin = {
  close: () => void;
};
type DropdownMenuPlugin = {
  open: (position: { left: number; top: number }) => void;
};
type UndoRedoPlugin = {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  isUndoAvailable: () => boolean;
  isRedoAvailable: () => boolean;
};

const defaultFeatureProfile: HandsontableFeatureProfile = {
  filters: true,
  dropdownMenu: true,
  contextMenu: true,
  columnSorting: true,
  manualColumnMove: true,
  undo: true,
  headerStyling: true,
  statusRenderer: true,
};

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

function registerHandsontableModules() {
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

registerHandsontableModules();

const columnKeys: ColumnKey[] = [
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

const colHeaders = [
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

const contextMenuItems = [
  "filter_by_condition",
  "filter_by_value",
  "filter_action_bar",
  "cut",
  "copy",
  "undo",
  "redo",
] as const;

const contextMenuKeysByTarget = {
  cell: new Set(["cut", "copy", "undo", "redo"]),
  "column-header": new Set([
    "filter_by_condition",
    "filter_by_value",
    "filter_action_bar",
  ]),
  "row-header": new Set(["copy", "undo", "redo"]),
  corner: new Set(["copy", "undo", "redo"]),
} as const;

function salesStatusRenderer(
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

function createColumns(featureProfile: HandsontableFeatureProfile): ColumnSettings[] {
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

function cloneRow(row: SalesOrderRow): SalesOrderRow {
  return { ...row };
}

function cloneRows(rows: SalesOrderRow[]): SalesOrderRow[] {
  return rows.map(cloneRow);
}

function rowsEqual(left: SalesOrderRow[], right: SalesOrderRow[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((row, index) =>
    columnKeys.every((key) => row[key] === right[index]?.[key]),
  );
}

function isColumnKey(value: unknown): value is ColumnKey {
  return typeof value === "string" && columnKeys.includes(value as ColumnKey);
}

function coerceNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.trunc(numericValue) : 0;
}

function coerceStatus(value: unknown): SalesOrderStatus {
  return salesOrderStatuses.includes(value as SalesOrderStatus)
    ? (value as SalesOrderStatus)
    : "Pending";
}

function coerceRow(value: Partial<SalesOrderRow> & Record<string, unknown>): SalesOrderRow {
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

function rollbackChanges(
  physicalRowIndex: number,
  row: SalesOrderRow,
): Array<[number, ColumnKey, SalesOrderRow[ColumnKey]]> {
  return columnKeys.map((key) => [physicalRowIndex, key, row[key]]);
}

function handleAfterGetColHeader(
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

function getContextMenuTarget(row: number, column: number): ContextMenuTarget {
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

function getUndoRedoPlugin(hotRef: React.RefObject<HotTableRef | null>) {
  return hotRef.current?.hotInstance?.getPlugin("undoRedo") as
    | UndoRedoPlugin
    | undefined;
}

function getDropdownMenuPlugin(hotRef: React.RefObject<HotTableRef | null>) {
  return hotRef.current?.hotInstance?.getPlugin("dropdownMenu") as
    | DropdownMenuPlugin
    | undefined;
}

function getContextMenuPlugin(hotRef: React.RefObject<HotTableRef | null>) {
  return hotRef.current?.hotInstance?.getPlugin("contextMenu") as
    | ContextMenuPlugin
    | undefined;
}

export function HandsontableSalesTableClient({
  initialRows,
  featureProfile = defaultFeatureProfile,
}: HandsontableSalesTableClientProps) {
  const hotRef = useRef<HotTableRef | null>(null);
  const contextMenuTargetRef = useRef<ContextMenuTarget>("cell");
  const rowsRef = useRef(cloneRows(initialRows));
  const columns = createColumns(featureProfile);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const isFilterMenuEnabled = featureProfile.filters && featureProfile.dropdownMenu;
  const isContextMenuEnabled = featureProfile.contextMenu;

  const syncUndoRedoState = useCallback(() => {
    if (!featureProfile.undo) {
      setCanUndo(false);
      setCanRedo(false);
      return;
    }

    const undoRedo = getUndoRedoPlugin(hotRef);

    setCanUndo(Boolean(undoRedo?.isUndoAvailable()));
    setCanRedo(Boolean(undoRedo?.isRedoAvailable()));
  }, [featureProfile.undo]);

  useEffect(() => {
    const nextRows = cloneRows(initialRows);
    const hotInstance = hotRef.current?.hotInstance;

    if (rowsEqual(nextRows, rowsRef.current)) {
      syncUndoRedoState();
      return;
    }

    rowsRef.current = nextRows;
    hotInstance?.loadData(nextRows, "external");
    getUndoRedoPlugin(hotRef)?.clear();
    syncUndoRedoState();
  }, [initialRows, syncUndoRedoState]);

  function handleUndo() {
    if (!featureProfile.undo) {
      return;
    }

    const undoRedo = getUndoRedoPlugin(hotRef);

    if (!undoRedo?.isUndoAvailable()) {
      return;
    }

    setSaveError(null);
    undoRedo.undo();
    syncUndoRedoState();
  }

  function handleRedo() {
    if (!featureProfile.undo) {
      return;
    }

    const undoRedo = getUndoRedoPlugin(hotRef);

    if (!undoRedo?.isRedoAvailable()) {
      return;
    }

    setSaveError(null);
    undoRedo.redo();
    syncUndoRedoState();
  }

  function handleAfterChange(changes: CellChange[] | null, source: string) {
    if (
      !changes ||
      !hotRef.current?.hotInstance ||
      source === "loadData" ||
      source === "external" ||
      source === "rollback"
    ) {
      return;
    }

    const hotInstance = hotRef.current.hotInstance;
    const changedPhysicalRows = new Set<number>();

    for (const [rowIndex, prop, oldValue, newValue] of changes) {
      if (oldValue !== newValue && isColumnKey(prop)) {
        const physicalRowIndex = hotInstance.toPhysicalRow(rowIndex);

        if (physicalRowIndex >= 0) {
          changedPhysicalRows.add(physicalRowIndex);
        }
      }
    }

    if (changedPhysicalRows.size === 0) {
      syncUndoRedoState();
      return;
    }

    syncUndoRedoState();
    setSaveError(null);

    startTransition(async () => {
      for (const physicalRowIndex of changedPhysicalRows) {
        const previousRow = cloneRow(rowsRef.current[physicalRowIndex]);
        const nextRow = coerceRow(
          hotInstance.getSourceDataAtRow(physicalRowIndex) as Partial<SalesOrderRow> &
            Record<string, unknown>,
        );

        try {
          await updateSalesOrder(previousRow.orderId, nextRow);
          rowsRef.current[physicalRowIndex] = cloneRow(nextRow);
        } catch (error) {
          hotInstance.setSourceDataAtCell(
            rollbackChanges(physicalRowIndex, previousRow),
            "rollback",
          );
          setSaveError(error instanceof Error ? error.message : "Failed to save sales order");
        }
      }
    });
  }

  function handleBeforeOnCellContextMenu(
    event: MouseEvent,
    coords: { row: number; col: number },
  ) {
    if (!isContextMenuEnabled) {
      return;
    }

    const contextMenuTarget = getContextMenuTarget(coords.row, coords.col);
    const hotInstance = hotRef.current?.hotInstance;

    contextMenuTargetRef.current = contextMenuTarget;

    if (!hotInstance) {
      return;
    }

    if (contextMenuTarget === "column-header" && isFilterMenuEnabled) {
      hotInstance.selectColumns(coords.col, coords.col, -1);
      event.preventDefault();
      event.stopImmediatePropagation();
      getContextMenuPlugin(hotRef)?.close();
      getDropdownMenuPlugin(hotRef)?.open({
        left: event.clientX,
        top: event.clientY,
      });
      return;
    }

    if (contextMenuTarget === "row-header") {
      hotInstance.selectRows(coords.row, coords.row, -1);
      return;
    }

    if (contextMenuTarget === "cell") {
      hotInstance.selectCell(coords.row, coords.col);
    }
  }

  function handleBeforeContextMenuSetItems(
    menuItems: Array<{ key?: string }>,
  ) {
    if (!isContextMenuEnabled) {
      menuItems.splice(0, menuItems.length);
      return;
    }

    if (contextMenuTargetRef.current === "column-header") {
      menuItems.splice(0, menuItems.length);
      return;
    }

    const allowedKeys = contextMenuKeysByTarget[contextMenuTargetRef.current];
    const filteredItems = menuItems.filter((item) => item.key && allowedKeys.has(item.key));

    menuItems.splice(0, menuItems.length, ...filteredItems);
  }

  return (
    <Box className={designSystemClassNames.dataGrid}>
      {featureProfile.undo && (
        <HStack px="4" py="3" justify="space-between" borderBottomWidth="1px" borderColor="border">
          <HStack gap="2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleUndo}
              disabled={!canUndo || isPending}
            >
              Undo
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRedo}
              disabled={!canRedo || isPending}
            >
              Redo
            </Button>
          </HStack>
          <Text color="fg.muted" fontSize="sm">
            Cmd/Ctrl+Z, Cmd/Ctrl+Y
          </Text>
        </HStack>
      )}
      <HotTable
        ref={hotRef}
        className="handsontable-comparison"
        data={rowsRef.current}
        columns={columns}
        colHeaders={colHeaders}
        rowHeaders
        rowHeaderWidth={44}
        width="100%"
        height={360}
        stretchH="none"
        readOnly={isPending}
        contextMenu={isContextMenuEnabled ? { items: [...contextMenuItems] } : false}
        filters={featureProfile.filters}
        dropdownMenu={
          isFilterMenuEnabled
            ? ["filter_by_condition", "filter_by_value", "filter_action_bar"]
            : false
        }
        columnSorting={featureProfile.columnSorting}
        fixedColumnsStart={1}
        manualColumnMove={featureProfile.manualColumnMove}
        undo={featureProfile.undo}
        licenseKey="non-commercial-and-evaluation"
        themeName="ht-theme-main"
        textEllipsis
        afterChange={handleAfterChange}
        afterGetColHeader={featureProfile.headerStyling ? handleAfterGetColHeader : undefined}
        afterInit={syncUndoRedoState}
        afterUndo={featureProfile.undo ? syncUndoRedoState : undefined}
        afterRedo={featureProfile.undo ? syncUndoRedoState : undefined}
        afterUndoStackChange={featureProfile.undo ? syncUndoRedoState : undefined}
        afterRedoStackChange={featureProfile.undo ? syncUndoRedoState : undefined}
        beforeOnCellContextMenu={isContextMenuEnabled ? handleBeforeOnCellContextMenu : undefined}
        beforeContextMenuSetItems={isContextMenuEnabled ? handleBeforeContextMenuSetItems : undefined}
      />
      {(isPending || saveError) && (
        <Text px="4" py="3" color={saveError ? "fg.error" : "fg.muted"} fontSize="sm">
          {saveError ?? "Saving changes..."}
        </Text>
      )}
    </Box>
  );
}
