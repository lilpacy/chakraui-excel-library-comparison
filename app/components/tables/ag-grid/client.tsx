"use client";

import { useEffect, useState, useTransition } from "react";
import { Box, Text } from "@chakra-ui/react";
import type { CellValueChangedEvent, ColDef } from "ag-grid-community";
import { AllCommunityModule, themeBalham } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { updateSalesOrder } from "@/app/actions/sales-orders";
import { designSystemClassNames } from "@/app/design-system/patterns";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";
import { salesOrderStatuses } from "@/lib/db/schema";

type AgGridSalesTableClientProps = {
  initialRows: SalesOrderRow[];
};

type ColumnKey = keyof SalesOrderRow;

type AgGridRow = SalesOrderRow & {
  __rowKey: string;
};

const modules = [AllCommunityModule];

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const gridTheme = themeBalham;

const columnDefs: ColDef<AgGridRow>[] = [
  { field: "orderId", headerName: "Order ID", editable: true, width: 128, cellClass: "ag-grid-order-id" },
  { field: "orderDate", headerName: "Date", editable: true, width: 124 },
  { field: "customer", headerName: "Customer", editable: true, width: 210 },
  { field: "region", headerName: "Region", editable: true, width: 120 },
  { field: "rep", headerName: "Sales Rep", editable: true, width: 160 },
  { field: "category", headerName: "Category", editable: true, width: 150 },
  { field: "product", headerName: "Product", editable: true, width: 220 },
  {
    field: "quantity",
    headerName: "Qty",
    editable: true,
    width: 92,
    type: "numericColumn",
    cellEditor: "agNumberCellEditor",
    valueParser: (params) => parseNumber(params.newValue),
  },
  {
    field: "unitPrice",
    headerName: "Unit Price",
    editable: true,
    width: 128,
    type: "numericColumn",
    cellEditor: "agNumberCellEditor",
    valueParser: (params) => parseNumber(params.newValue),
    valueFormatter: (params) =>
      typeof params.value === "number" ? currencyFormatter.format(params.value) : "",
  },
  {
    field: "status",
    headerName: "Status",
    editable: true,
    width: 132,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: [...salesOrderStatuses] },
    valueParser: (params) => coerceStatus(params.newValue),
  },
];

const defaultColDef: ColDef<AgGridRow> = {
  editable: true,
  sortable: false,
  filter: false,
  resizable: true,
};

function parseNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.trunc(numericValue) : 0;
}

function coerceStatus(value: unknown): SalesOrderStatus {
  return salesOrderStatuses.includes(value as SalesOrderStatus)
    ? (value as SalesOrderStatus)
    : "Pending";
}

function toGridRows(rows: SalesOrderRow[]): AgGridRow[] {
  return rows.map((row, index) => ({
    ...row,
    __rowKey: `${index}`,
  }));
}

function toSalesOrderRow(row: AgGridRow): SalesOrderRow {
  return {
    orderId: String(row.orderId),
    orderDate: String(row.orderDate),
    customer: String(row.customer),
    region: String(row.region),
    rep: String(row.rep),
    category: String(row.category),
    product: String(row.product),
    quantity: parseNumber(row.quantity),
    unitPrice: parseNumber(row.unitPrice),
    status: coerceStatus(row.status),
  };
}

function buildPreviousRow(
  row: AgGridRow,
  field: ColumnKey,
  oldValue: unknown,
): SalesOrderRow {
  const previousRow = toSalesOrderRow(row);

  switch (field) {
    case "quantity":
    case "unitPrice":
      previousRow[field] = parseNumber(oldValue);
      return previousRow;
    case "status":
      previousRow.status = coerceStatus(oldValue);
      return previousRow;
    default:
      previousRow[field] = String(oldValue) as SalesOrderRow[typeof field];
      return previousRow;
  }
}

export function AgGridSalesTableClient({ initialRows }: AgGridSalesTableClientProps) {
  const [rows, setRows] = useState(() => toGridRows(initialRows));
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setRows(toGridRows(initialRows));
  }, [initialRows]);

  function handleCellValueChanged(event: CellValueChangedEvent<AgGridRow>) {
    const field = event.colDef.field as ColumnKey | undefined;

    if (!field || !event.data || event.oldValue === event.newValue) {
      return;
    }

    const rowKey = event.data.__rowKey;
    const nextRow = toSalesOrderRow(event.data);
    const previousRow = buildPreviousRow(event.data, field, event.oldValue);

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.__rowKey === rowKey ? { ...nextRow, __rowKey: rowKey } : row,
      ),
    );
    setSaveError(null);

    startTransition(async () => {
      try {
        await updateSalesOrder(previousRow.orderId, nextRow);
      } catch (error) {
        setRows((currentRows) =>
          currentRows.map((row) =>
            row.__rowKey === rowKey ? { ...previousRow, __rowKey: rowKey } : row,
          ),
        );
        setSaveError(error instanceof Error ? error.message : "Failed to save sales order");
      }
    });
  }

  return (
    <AgGridProvider modules={modules}>
      <Box className="ag-grid-comparison">
        <Box h="440px">
          <AgGridReact
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            theme={gridTheme}
            getRowId={(params) => params.data.__rowKey}
            stopEditingWhenCellsLoseFocus
            onCellValueChanged={handleCellValueChanged}
          />
        </Box>
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
    </AgGridProvider>
  );
}
