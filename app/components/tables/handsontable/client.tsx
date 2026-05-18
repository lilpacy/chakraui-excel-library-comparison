"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { HotTable, type HotTableRef } from "@handsontable/react-wrapper";
import type { CellChange } from "handsontable/common";
import { textRenderer } from "handsontable/renderers/textRenderer";
import { registerAllModules } from "handsontable/registry";
import { updateSalesOrder } from "@/app/actions/sales-orders";
import {
  designSystemClassNames,
  salesStatusColorPalette,
} from "@/app/design-system/patterns";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";
import type { CellProperties, ColumnSettings } from "handsontable/settings";
import { salesOrderStatuses } from "@/lib/db/schema";

registerAllModules();

type HandsontableSalesTableClientProps = {
  initialRows: SalesOrderRow[];
};

type ColumnKey = keyof SalesOrderRow;
type HandsontableCore = Parameters<typeof textRenderer>[0];
type UndoRedoPlugin = {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  isUndoAvailable: () => boolean;
  isRedoAvailable: () => boolean;
};

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

const columns: ColumnSettings[] = [
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
    renderer: salesStatusRenderer,
    source: [...salesOrderStatuses],
    strict: true,
    allowInvalid: false,
  },
];

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

function getUndoRedoPlugin(hotRef: React.RefObject<HotTableRef | null>) {
  return hotRef.current?.hotInstance?.getPlugin("undoRedo") as
    | UndoRedoPlugin
    | undefined;
}

export function HandsontableSalesTableClient({
  initialRows,
}: HandsontableSalesTableClientProps) {
  const hotRef = useRef<HotTableRef | null>(null);
  const rowsRef = useRef(cloneRows(initialRows));
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  function syncUndoRedoState() {
    const undoRedo = getUndoRedoPlugin(hotRef);

    setCanUndo(Boolean(undoRedo?.isUndoAvailable()));
    setCanRedo(Boolean(undoRedo?.isRedoAvailable()));
  }

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
  }, [initialRows]);

  function handleUndo() {
    const undoRedo = getUndoRedoPlugin(hotRef);

    if (!undoRedo?.isUndoAvailable()) {
      return;
    }

    setSaveError(null);
    undoRedo.undo();
    syncUndoRedoState();
  }

  function handleRedo() {
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

  return (
    <Box className={designSystemClassNames.dataGrid}>
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
      <HotTable
        ref={hotRef}
        className="handsontable-comparison"
        data={rowsRef.current}
        columns={columns}
        colHeaders={colHeaders}
        rowHeaders={(row) => rowsRef.current[row]?.orderId ?? ""}
        rowHeaderWidth={96}
        width="100%"
        height={360}
        stretchH="none"
        readOnly={isPending}
        filters
        dropdownMenu
        columnSorting
        fixedColumnsStart={1}
        manualColumnMove
        undo
        licenseKey="non-commercial-and-evaluation"
        themeName="ht-theme-main"
        textEllipsis
        afterChange={handleAfterChange}
        afterGetColHeader={handleAfterGetColHeader}
        afterInit={syncUndoRedoState}
        afterUndo={syncUndoRedoState}
        afterRedo={syncUndoRedoState}
        afterUndoStackChange={syncUndoRedoState}
        afterRedoStackChange={syncUndoRedoState}
      />
      {(isPending || saveError) && (
        <Text px="4" py="3" color={saveError ? "fg.error" : "fg.muted"} fontSize="sm">
          {saveError ?? "Saving changes..."}
        </Text>
      )}
    </Box>
  );
}
