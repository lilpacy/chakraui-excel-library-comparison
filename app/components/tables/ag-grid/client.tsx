"use client";

import { useEffect, useState, useTransition } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import type {
  CellSelectionChangedEvent,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  SetFilterModel,
  SuppressKeyboardEventParams,
} from "ag-grid-community";
import { themeBalham } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { updateSalesOrder } from "@/app/actions/sales-orders";
import {
  designSystemClassNames,
  salesStatusColorPalette,
  salesTableHeaderToneSequence,
} from "@/app/design-system/patterns";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";
import { salesOrderStatuses } from "@/lib/db/schema";

type AgGridSalesTableClientProps = {
  initialRows: SalesOrderRow[];
};

type ColumnKey = keyof SalesOrderRow;

type AgGridRow = SalesOrderRow & {
  __rowKey: string;
};

const modules = [AllEnterpriseModule];

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const headerToneClassNames = salesTableHeaderToneSequence.slice(0, 10).map(
  (tone) => `ag-grid-header-tone--${tone}`,
);

const numericHeaderClassName = "ag-grid-header-cell--numeric";

const gridTheme = themeBalham.withParams({
  accentColor: "var(--ds-color-accent-blue-hover)",
  borderColor: "var(--ds-color-border-default)",
  wrapperBorder: false,
  wrapperBorderRadius: 0,
  headerBackgroundColor: "var(--ds-color-bg-subtle)",
  headerTextColor: "var(--ds-color-fg-primary)",
  dataBackgroundColor: "var(--ds-color-bg-panel)",
  oddRowBackgroundColor: "var(--ds-color-bg-panel)",
  rowHeight: 38,
  headerHeight: 38,
  fontSize: 12,
  headerFontWeight: 700,
  cellTextColor: "var(--ds-color-fg-primary)",
  cellHorizontalPadding: 8,
});

function renderStatusBadge(params: { value: unknown }) {
  const status = coerceStatus(params.value);
  const tone = salesStatusColorPalette[status];

  return (
    <span className="ds-sales-status-badge" data-tone={tone}>
      {status}
    </span>
  );
}

const columnDefs: ColDef<AgGridRow>[] = [
  {
    field: "orderId",
    headerName: "Order ID",
    editable: true,
    filter: "agSetColumnFilter",
    width: 77,
    cellClass: "ag-grid-order-id",
    headerClass: headerToneClassNames[0],
  },
  {
    field: "orderDate",
    headerName: "Date",
    editable: true,
    filter: "agSetColumnFilter",
    width: 92,
    headerClass: headerToneClassNames[1],
  },
  {
    field: "customer",
    headerName: "Customer",
    editable: true,
    filter: "agSetColumnFilter",
    width: 181,
    headerClass: headerToneClassNames[2],
  },
  {
    field: "region",
    headerName: "Region",
    editable: true,
    filter: "agSetColumnFilter",
    width: 81,
    headerClass: headerToneClassNames[3],
  },
  {
    field: "rep",
    headerName: "Sales Rep",
    editable: true,
    filter: "agSetColumnFilter",
    width: 96,
    headerClass: headerToneClassNames[4],
  },
  {
    field: "category",
    headerName: "Category",
    editable: true,
    filter: "agSetColumnFilter",
    width: 86,
    headerClass: headerToneClassNames[5],
  },
  {
    field: "product",
    headerName: "Product",
    editable: true,
    filter: "agSetColumnFilter",
    width: 161,
    headerClass: headerToneClassNames[6],
  },
  {
    field: "quantity",
    headerName: "Qty",
    editable: true,
    filter: "agSetColumnFilter",
    width: 42,
    type: "numericColumn",
    cellEditor: "agNumberCellEditor",
    valueParser: (params) => parseNumber(params.newValue),
    headerClass: `${headerToneClassNames[7]} ${numericHeaderClassName}`,
  },
  {
    field: "unitPrice",
    headerName: "Unit Price",
    editable: true,
    filter: "agSetColumnFilter",
    width: 78,
    type: "numericColumn",
    cellEditor: "agNumberCellEditor",
    valueParser: (params) => parseNumber(params.newValue),
    valueFormatter: (params) =>
      typeof params.value === "number" ? currencyFormatter.format(params.value) : "",
    headerClass: `${headerToneClassNames[8]} ${numericHeaderClassName}`,
  },
  {
    field: "status",
    headerName: "Status",
    editable: true,
    filter: "agSetColumnFilter",
    width: 80,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: [...salesOrderStatuses] },
    valueParser: (params) => coerceStatus(params.newValue),
    cellRenderer: renderStatusBadge,
    headerClass: headerToneClassNames[9],
  },
];

const defaultColDef: ColDef<AgGridRow> = {
  editable: true,
  sortable: true,
  filter: true,
  resizable: false,
  floatingFilter: true,
  suppressKeyboardEvent: (params) => shouldSuppressBulkRangeKey(params, params.api),
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

function hasActiveCellSelection(api: GridApi<AgGridRow> | null) {
  return Boolean(api?.getCellRanges()?.length);
}

function shouldSuppressBulkRangeKey(
  params: SuppressKeyboardEventParams<AgGridRow>,
  api: GridApi<AgGridRow> | null,
) {
  if (params.editing || !hasActiveCellSelection(api)) {
    return false;
  }

  const { event } = params;
  const isDeleteKey = event.key === "Delete" || event.key === "Backspace";
  const isBulkEditShortcut = event.key === "Enter" && (event.ctrlKey || event.metaKey);

  return isDeleteKey || isBulkEditShortcut;
}

function collectSelectedValuesByColumn(api: GridApi<AgGridRow>) {
  const cellRanges = api.getCellRanges();
  const valuesByColumn = new Map<string, Set<string | null>>();

  if (!cellRanges?.length) {
    return valuesByColumn;
  }

  for (const cellRange of cellRanges) {
    if (!cellRange.startRow || !cellRange.endRow) {
      continue;
    }

    const rowStartIndex = Math.min(cellRange.startRow.rowIndex, cellRange.endRow.rowIndex);
    const rowEndIndex = Math.max(cellRange.startRow.rowIndex, cellRange.endRow.rowIndex);

    for (let rowIndex = rowStartIndex; rowIndex <= rowEndIndex; rowIndex += 1) {
      const rowNode = api.getDisplayedRowAtIndex(rowIndex);

      if (!rowNode) {
        continue;
      }

      for (const column of cellRange.columns) {
        const columnValues = valuesByColumn.get(column.getColId()) ?? new Set<string | null>();
        const cellValue = normalizeSetFilterValue(rowNode.getDataValue(column));

        if (cellValue !== undefined) {
          columnValues.add(cellValue);
        }

        valuesByColumn.set(column.getColId(), columnValues);
      }
    }
  }

  return valuesByColumn;
}

function normalizeSetFilterValue(value: unknown) {
  if (value === null) {
    return null;
  }

  if (value === undefined || value === "") {
    return undefined;
  }

  return String(value);
}

function buildSetFilterModel(api: GridApi<AgGridRow>) {
  const valuesByColumn = collectSelectedValuesByColumn(api);
  const filterModel: Record<string, SetFilterModel> = {};

  for (const [colId, values] of valuesByColumn.entries()) {
    if (!values.size) {
      continue;
    }

    filterModel[colId] = {
      filterType: "set",
      values: [...values],
    };
  }

  return filterModel;
}

export function AgGridSalesTableClient({ initialRows }: AgGridSalesTableClientProps) {
  const [rows, setRows] = useState(() => toGridRows(initialRows));
  const [isPending, startTransition] = useTransition();
  const [gridApi, setGridApi] = useState<GridApi<AgGridRow> | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setRows(toGridRows(initialRows));
  }, [initialRows]);

  function handleGridReady(event: GridReadyEvent<AgGridRow>) {
    setGridApi(event.api);
    setHasSelection(hasActiveCellSelection(event.api));
  }

  function handleCellSelectionChanged(event: CellSelectionChangedEvent<AgGridRow>) {
    setHasSelection(Boolean(event.api.getCellRanges()?.length));
  }

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

  function handleApplySelectedValueFilter() {
    if (!gridApi) {
      return;
    }

    const filterModel = buildSetFilterModel(gridApi);

    if (!Object.keys(filterModel).length) {
      return;
    }

    gridApi.setFilterModel({
      ...gridApi.getFilterModel(),
      ...filterModel,
    });
  }

  function handleClearFilters() {
    gridApi?.setFilterModel(null);
  }

  return (
    <AgGridProvider modules={modules}>
      <Box className="ag-grid-comparison">
        <HStack
          justify="space-between"
          align="flex-start"
          gap="3"
          px="4"
          py="3"
          borderBottom="1px solid"
          borderColor="border"
          bg="bg.subtle"
          flexWrap="wrap"
        >
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="fg">
              矩形選択と値フィルタ
            </Text>
            <Text fontSize="sm" color="fg.muted">
              セルをドラッグで矩形選択し、選択値で絞り込むか、列ヘッダーのフィルタから値選択できます。
            </Text>
          </Box>
          <HStack gap="2">
            <Button
              size="sm"
              colorPalette="blue"
              onClick={handleApplySelectedValueFilter}
              disabled={!hasSelection}
            >
              選択値でフィルタ
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearFilters}>
              フィルタ解除
            </Button>
          </HStack>
        </HStack>
        <AgGridReact
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          theme={gridTheme}
          domLayout="autoHeight"
          cellSelection={{
            enableHeaderHighlight: true,
            handle: { mode: "range" },
          }}
          getRowId={(params) => params.data.__rowKey}
          stopEditingWhenCellsLoseFocus
          suppressColumnVirtualisation
          suppressRowVirtualisation
          suppressMovableColumns
          onGridReady={handleGridReady}
          onCellSelectionChanged={handleCellSelectionChanged}
          onCellValueChanged={handleCellValueChanged}
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
    </AgGridProvider>
  );
}
