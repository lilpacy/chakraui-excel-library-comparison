"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  DataSheetGrid,
  createTextColumn,
  intColumn,
  keyColumn,
  textColumn,
  type Column,
} from "react-datasheet-grid";
import type { Operation } from "react-datasheet-grid/dist/types";
import { updateSalesOrder } from "@/app/actions/sales-orders";
import { designSystemClassNames } from "@/app/design-system/patterns";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";
import { salesOrderStatuses } from "@/lib/db/schema";

type ReactDataSheetGridSalesTableClientProps = {
  initialRows: SalesOrderRow[];
};

type GridRow = {
  orderId: string | null;
  orderDate: string | null;
  customer: string | null;
  region: string | null;
  rep: string | null;
  category: string | null;
  product: string | null;
  quantity: number | null;
  unitPrice: number | null;
  status: string | null;
  __rowKey: string;
};

const gridHeight = 442;
const gridRowHeight = 38;

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

function toGridRows(rows: SalesOrderRow[]): GridRow[] {
  return rows.map((row, index) => ({
    ...row,
    __rowKey: `row-${index}`,
  }));
}

function parseNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.trunc(numericValue) : 0;
}

function coerceStatus(value: unknown): SalesOrderStatus {
  return salesOrderStatuses.includes(value as SalesOrderStatus)
    ? (value as SalesOrderStatus)
    : "Pending";
}

function toSalesOrderRow(row: GridRow): SalesOrderRow {
  return {
    orderId: String(row.orderId ?? ""),
    orderDate: String(row.orderDate ?? ""),
    customer: String(row.customer ?? ""),
    region: String(row.region ?? ""),
    rep: String(row.rep ?? ""),
    category: String(row.category ?? ""),
    product: String(row.product ?? ""),
    quantity: parseNumber(row.quantity),
    unitPrice: parseNumber(row.unitPrice),
    status: coerceStatus(row.status),
  };
}

export function ReactDataSheetGridSalesTableClient({
  initialRows,
}: ReactDataSheetGridSalesTableClientProps) {
  const [rows, setRows] = useState(() => toGridRows(initialRows));
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setRows(toGridRows(initialRows));
  }, [initialRows]);

  const columns = useMemo<Column<GridRow>[]>(() => {
    const currencyColumn = createTextColumn<number | null>({
      alignRight: true,
      parseUserInput: (value) => {
        const digitsOnly = value.replace(/[^\d-]/g, "");
        return digitsOnly === "" ? null : parseNumber(digitsOnly);
      },
      formatBlurredInput: (value) =>
        typeof value === "number" ? currencyFormatter.format(value) : "",
      formatInputOnFocus: (value) => (typeof value === "number" ? String(value) : ""),
      formatForCopy: (value) => (typeof value === "number" ? String(value) : ""),
      parsePastedValue: (value) => {
        const digitsOnly = value.replace(/[^\d-]/g, "");
        return digitsOnly === "" ? null : parseNumber(digitsOnly);
      },
    });

    return [
      {
        ...keyColumn<GridRow, "orderId">("orderId", textColumn),
        id: "orderId",
        title: "Order ID",
        headerClassName: "rdsg-header-tone rdsg-header-tone--blue",
        minWidth: 118,
        basis: 118,
        grow: 0,
        cellClassName: "rdsg-cell-order-id",
      },
      {
        ...keyColumn<GridRow, "orderDate">("orderDate", textColumn),
        id: "orderDate",
        title: "Date",
        headerClassName: "rdsg-header-tone rdsg-header-tone--yellow",
        minWidth: 120,
        basis: 120,
      },
      {
        ...keyColumn<GridRow, "customer">("customer", textColumn),
        id: "customer",
        title: "Customer",
        headerClassName: "rdsg-header-tone rdsg-header-tone--green",
        minWidth: 205,
        basis: 205,
      },
      {
        ...keyColumn<GridRow, "region">("region", textColumn),
        id: "region",
        title: "Region",
        headerClassName: "rdsg-header-tone rdsg-header-tone--fuchsia",
        minWidth: 120,
        basis: 120,
      },
      {
        ...keyColumn<GridRow, "rep">("rep", textColumn),
        id: "rep",
        title: "Sales Rep",
        headerClassName: "rdsg-header-tone rdsg-header-tone--aqua",
        minWidth: 160,
        basis: 160,
      },
      {
        ...keyColumn<GridRow, "category">("category", textColumn),
        id: "category",
        title: "Category",
        headerClassName: "rdsg-header-tone rdsg-header-tone--orange",
        minWidth: 145,
        basis: 145,
      },
      {
        ...keyColumn<GridRow, "product">("product", textColumn),
        id: "product",
        title: "Product",
        headerClassName: "rdsg-header-tone rdsg-header-tone--iris",
        minWidth: 220,
        basis: 220,
      },
      {
        ...keyColumn<GridRow, "quantity">("quantity", intColumn),
        id: "quantity",
        title: "Qty",
        headerClassName: "rdsg-header-tone rdsg-header-tone--red rdsg-header-tone--numeric",
        minWidth: 92,
        basis: 92,
        grow: 0,
      },
      {
        ...keyColumn<GridRow, "unitPrice">("unitPrice", currencyColumn),
        id: "unitPrice",
        title: "Unit Price",
        headerClassName: "rdsg-header-tone rdsg-header-tone--lime rdsg-header-tone--numeric",
        minWidth: 120,
        basis: 120,
        grow: 0,
      },
      {
        ...keyColumn<GridRow, "status">("status", textColumn),
        id: "status",
        title: "Status",
        headerClassName: "rdsg-header-tone rdsg-header-tone--magenta",
        minWidth: 140,
        basis: 140,
        grow: 0,
      },
    ];
  }, []);

  function handleChange(nextRows: GridRow[], operations: Operation[]) {
    const previousRows = rows;
    setRows(nextRows);
    setSaveError(null);

    const updatedRowPairs = operations.flatMap((operation) => {
      if (operation.type !== "UPDATE") {
        return [];
      }

      const entries: Array<{ previousRow: GridRow; nextRow: GridRow }> = [];

      for (let index = operation.fromRowIndex; index < operation.toRowIndex; index += 1) {
        const previousRow = previousRows[index];
        const nextRow = nextRows[index];

        if (!previousRow || !nextRow) {
          continue;
        }

        entries.push({ previousRow, nextRow });
      }

      return entries;
    });

    if (updatedRowPairs.length === 0) {
      return;
    }

    startTransition(async () => {
      for (const { previousRow, nextRow } of updatedRowPairs) {
        const previousSalesOrder = toSalesOrderRow(previousRow);
        const nextSalesOrder = toSalesOrderRow(nextRow);

        try {
          await updateSalesOrder(previousSalesOrder.orderId, nextSalesOrder);
        } catch (error) {
          setRows((currentRows) =>
            currentRows.map((row) =>
              row.__rowKey === previousRow.__rowKey ? previousRow : row,
            ),
          );
          setSaveError(
            error instanceof Error ? error.message : "Failed to save sales order",
          );
        }
      }
    });
  }

  return (
    <Box className={`${designSystemClassNames.dataGrid} react-datasheet-grid-comparison`}>
      <DataSheetGrid<GridRow>
        value={rows}
        onChange={handleChange}
        columns={columns}
        rowKey="__rowKey"
        height={gridHeight}
        rowHeight={gridRowHeight}
        headerRowHeight={gridRowHeight}
        gutterColumn={false}
        lockRows
        disableContextMenu
        autoAddRow={false}
        addRowsComponent={false}
      />
      {(isPending || saveError) && (
        <Text
          px="4"
          py="3"
          className={saveError ? designSystemClassNames.statusError : undefined}
          color={saveError ? "red.600" : "fg.muted"}
          fontSize="sm"
        >
          {saveError ?? "Saving changes..."}
        </Text>
      )}
    </Box>
  );
}
