"use client";

import { Fragment, useEffect, useState, useTransition } from "react";
import {
  Badge,
  Box,
  EditableArea,
  EditableInput,
  EditablePreview,
  EditableRoot,
  HStack,
  Input,
  Popover,
  Table,
  Text,
} from "@chakra-ui/react";
import {
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type Table as TanStackTable,
} from "@tanstack/react-table";
import { updateSalesOrder } from "@/app/actions/sales-orders";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";
import {
  editableInputStyles as inputStyles,
  editablePreviewStyles as previewStyles,
  editableRootStyles,
  editableSelectStyles as selectFieldStyles,
  getSalesTableHeaderCellProps,
  gridCellStyles,
  salesStatusColorPalette,
  tableHeaderRowProps,
} from "@/app/design-system/patterns";
import { salesOrderStatuses } from "@/lib/db/schema";

type TanStackSalesTableClientProps = {
  initialRows: SalesOrderRow[];
};

type ColumnKey = keyof SalesOrderRow;
type TextColumnKey = Exclude<ColumnKey, "quantity" | "unitPrice" | "status">;
type NumericColumnKey = Extract<ColumnKey, "quantity" | "unitPrice">;

type TanStackSalesRow = SalesOrderRow & {
  __rowKey: string;
};

type EditingCell = {
  rowKey: string;
  column: ColumnKey;
  originalRow: TanStackSalesRow;
} | null;

type SalesTableColumnMeta = {
  column: ColumnKey;
  editor: "text" | "number" | "status";
  filter: "text" | "number" | "status";
  headerIndex: number;
  textAlign?: "end";
  fontFamily?: "mono";
  fontSize?: "xs";
};

type TanStackSalesTableMeta = {
  isEditing: (rowKey: string, column: ColumnKey) => boolean;
  startEditing: (rowKey: string, column: ColumnKey) => void;
  stopEditing: () => void;
  updateRow: <K extends ColumnKey>(rowKey: string, key: K, value: SalesOrderRow[K]) => void;
  commitTextCell: <K extends TextColumnKey>(rowKey: string, key: K, value: string) => void;
  commitNumberCell: (rowKey: string, key: NumericColumnKey, value: number) => void;
  commitStatusCell: (rowKey: string, status: SalesOrderStatus) => void;
  revertCustomEdit: (rowKey: string) => void;
  handleNumberEditorKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    rowKey: string,
    key: NumericColumnKey,
  ) => void;
};

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const statusColorPalette: Record<SalesOrderStatus, string> = salesStatusColorPalette;
const columnHelper = createColumnHelper<TanStackSalesRow>();

function parseNumber(value: string) {
  return value === "" ? 0 : Number(value);
}

function toTableRows(rows: SalesOrderRow[]): TanStackSalesRow[] {
  return rows.map((row, index) => ({
    ...row,
    __rowKey: `tanstack-row-${index}`,
  }));
}

function toSalesOrderRow(row: TanStackSalesRow): SalesOrderRow {
  return {
    orderId: row.orderId,
    orderDate: row.orderDate,
    customer: row.customer,
    region: row.region,
    rep: row.rep,
    category: row.category,
    product: row.product,
    quantity: row.quantity,
    unitPrice: row.unitPrice,
    status: row.status,
  };
}

function getTableMeta(table: TanStackTable<TanStackSalesRow>) {
  return table.options.meta as TanStackSalesTableMeta;
}

function getFieldName(scope: "filter" | "edit", column: ColumnKey, rowKey?: string) {
  return rowKey ? `tanstack-${scope}-${column}-${rowKey}` : `tanstack-${scope}-${column}`;
}

function FilterIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      style={{ color: active ? "var(--chakra-colors-blue-600)" : "var(--chakra-colors-fg-subtle)" }}
      fill="none"
      height="14"
      viewBox="0 0 16 16"
      width="14"
    >
      <path
        d="M2.5 3.5h11l-4.25 4.75v3.25l-2.5 1V8.25L2.5 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function createTextColumn(
  key: TextColumnKey,
  header: string,
  headerIndex: number,
  options?: Pick<SalesTableColumnMeta, "fontFamily" | "fontSize">,
) {
  return columnHelper.accessor(key, {
    header,
    meta: {
      column: key,
      editor: "text",
      filter: "text",
      headerIndex,
      ...options,
    } satisfies SalesTableColumnMeta,
    filterFn: (row, columnId, filterValue) =>
      String(row.getValue(columnId) ?? "")
        .toLowerCase()
        .includes(String(filterValue ?? "").toLowerCase()),
    cell: ({ getValue, row, table }) => {
      const meta = getTableMeta(table);
      const value = getValue();

      return (
        <EditableRoot
          {...editableRootStyles}
          defaultValue={value}
          key={`${key}-${row.original.__rowKey}-${value}`}
          onValueCommit={(details) =>
            meta.commitTextCell(row.original.__rowKey, key, details.value)
          }
        >
          <EditableArea>
            <EditablePreview
              {...previewStyles}
              fontFamily={options?.fontFamily}
              fontSize={options?.fontSize}
            />
            <EditableInput
              {...inputStyles}
              name={getFieldName("edit", key, row.original.__rowKey)}
              fontFamily={options?.fontFamily}
              fontSize={options?.fontSize}
            />
          </EditableArea>
        </EditableRoot>
      );
    },
  });
}

function createNumberColumn(
  key: NumericColumnKey,
  header: string,
  headerIndex: number,
) {
  return columnHelper.accessor(key, {
    header,
    meta: {
      column: key,
      editor: "number",
      filter: "number",
      headerIndex,
      textAlign: "end",
    } satisfies SalesTableColumnMeta,
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === undefined || filterValue === "") {
        return true;
      }

      return Number(row.getValue(columnId)) === Number(filterValue);
    },
    cell: ({ getValue, row, table }) => {
      const meta = getTableMeta(table);
      const rowKey = row.original.__rowKey;
      const isEditing = meta.isEditing(rowKey, key);
      const value = getValue();

      if (isEditing) {
        return (
          <Input
            {...inputStyles}
            autoFocus
            name={getFieldName("edit", key, rowKey)}
            type="number"
            textAlign="end"
            value={value}
            onBlur={(event) => meta.commitNumberCell(rowKey, key, parseNumber(event.target.value))}
            onChange={(event) => meta.updateRow(rowKey, key, parseNumber(event.target.value))}
            onKeyDown={(event) => meta.handleNumberEditorKeyDown(event, rowKey, key)}
          />
        );
      }

      return key === "unitPrice" ? currencyFormatter.format(value) : value;
    },
  });
}

const columns = [
  createTextColumn("orderId", "Order ID", 0, { fontFamily: "mono", fontSize: "xs" }),
  createTextColumn("orderDate", "Date", 1),
  createTextColumn("customer", "Customer", 2),
  createTextColumn("region", "Region", 3),
  createTextColumn("rep", "Sales Rep", 4),
  createTextColumn("category", "Category", 5),
  createTextColumn("product", "Product", 6),
  createNumberColumn("quantity", "Qty", 7),
  createNumberColumn("unitPrice", "Unit Price", 8),
  columnHelper.accessor("status", {
    header: "Status",
    meta: {
      column: "status",
      editor: "status",
      filter: "status",
      headerIndex: 9,
    } satisfies SalesTableColumnMeta,
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === undefined || filterValue === "") {
        return true;
      }

      return String(row.getValue(columnId)) === String(filterValue);
    },
    cell: ({ getValue, row, table }) => {
      const meta = getTableMeta(table);
      const rowKey = row.original.__rowKey;
      const value = getValue();

      if (meta.isEditing(rowKey, "status")) {
        return (
          <Box position="relative">
            <select
              autoFocus
              name={getFieldName("edit", "status", rowKey)}
              style={selectFieldStyles}
              value={value}
              onBlur={meta.stopEditing}
              onChange={(event) =>
                meta.commitStatusCell(rowKey, event.target.value as SalesOrderStatus)
              }
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  meta.revertCustomEdit(rowKey);
                }
              }}
            >
              {salesOrderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Box
              aria-hidden="true"
              color="fg.subtle"
              insetEnd="0"
              pointerEvents="none"
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
            >
              ▾
            </Box>
          </Box>
        );
      }

      return (
        <Badge colorPalette={statusColorPalette[value]} variant="subtle">
          {value}
        </Badge>
      );
    },
  }),
];

export function TanStackSalesTableClient({
  initialRows,
}: TanStackSalesTableClientProps) {
  const [rows, setRows] = useState(() => toTableRows(initialRows));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isPending, startTransition] = useTransition();
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setRows(toTableRows(initialRows));
    setSorting([]);
    setColumnFilters([]);
    setEditingCell(null);
    setSaveError(null);
  }, [initialRows]);

  function findRow(rowKey: string) {
    return rows.find((row) => row.__rowKey === rowKey);
  }

  function updateRow<K extends ColumnKey>(rowKey: string, key: K, value: SalesOrderRow[K]) {
    setRows((currentRows) =>
      currentRows.map((row) => (row.__rowKey === rowKey ? { ...row, [key]: value } : row)),
    );
  }

  function replaceRow(rowKey: string, nextRow: TanStackSalesRow) {
    setRows((currentRows) =>
      currentRows.map((row) => (row.__rowKey === rowKey ? nextRow : row)),
    );
  }

  function startEditing(rowKey: string, column: ColumnKey) {
    const row = findRow(rowKey);

    if (!row) {
      return;
    }

    setEditingCell({ rowKey, column, originalRow: row });
  }

  function stopEditing() {
    setEditingCell(null);
  }

  function isEditing(rowKey: string, column: ColumnKey) {
    return editingCell?.rowKey === rowKey && editingCell.column === column;
  }

  function persistRowChange(
    rowKey: string,
    previousRow: TanStackSalesRow,
    nextRow: TanStackSalesRow,
  ) {
    const previousValue = JSON.stringify(toSalesOrderRow(previousRow));
    const nextValue = JSON.stringify(toSalesOrderRow(nextRow));

    if (previousValue === nextValue) {
      stopEditing();
      return;
    }

    replaceRow(rowKey, nextRow);
    stopEditing();
    setSaveError(null);

    startTransition(async () => {
      try {
        await updateSalesOrder(previousRow.orderId, toSalesOrderRow(nextRow));
      } catch (error) {
        replaceRow(rowKey, previousRow);
        setSaveError(error instanceof Error ? error.message : "Failed to save sales order");
      }
    });
  }

  function commitTextCell<K extends TextColumnKey>(rowKey: string, key: K, value: string) {
    const previousRow = findRow(rowKey);

    if (!previousRow) {
      return;
    }

    const nextRow = { ...previousRow, [key]: value as TanStackSalesRow[K] };
    persistRowChange(rowKey, previousRow, nextRow);
  }

  function commitNumberCell(rowKey: string, key: NumericColumnKey, value: number) {
    const previousRow = editingCell?.rowKey === rowKey ? editingCell.originalRow : findRow(rowKey);
    const currentRow = findRow(rowKey);

    if (!previousRow || !currentRow) {
      stopEditing();
      return;
    }

    const nextRow = { ...currentRow, [key]: value };
    persistRowChange(rowKey, previousRow, nextRow);
  }

  function commitStatusCell(rowKey: string, status: SalesOrderStatus) {
    const previousRow = editingCell?.rowKey === rowKey ? editingCell.originalRow : findRow(rowKey);
    const currentRow = findRow(rowKey);

    if (!previousRow || !currentRow) {
      stopEditing();
      return;
    }

    const nextRow = { ...currentRow, status };
    persistRowChange(rowKey, previousRow, nextRow);
  }

  function revertCustomEdit(rowKey: string) {
    if (editingCell?.rowKey !== rowKey) {
      stopEditing();
      return;
    }

    replaceRow(rowKey, editingCell.originalRow);
    stopEditing();
  }

  function handleNumberEditorKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    rowKey: string,
    key: NumericColumnKey,
  ) {
    if (event.key === "Escape") {
      revertCustomEdit(rowKey);
      return;
    }

    if (event.key === "Enter") {
      commitNumberCell(rowKey, key, parseNumber(event.currentTarget.value));
    }
  }

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.__rowKey,
    meta: {
      isEditing,
      startEditing,
      stopEditing,
      updateRow,
      commitTextCell,
      commitNumberCell,
      commitStatusCell,
      revertCustomEdit,
      handleNumberEditorKeyDown,
    } satisfies TanStackSalesTableMeta,
  });

  return (
    <Box className="tanstack-comparison">
      <Table.ScrollArea maxW="100%">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Fragment key={headerGroup.id}>
                <Table.Row key={headerGroup.id} {...tableHeaderRowProps}>
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as SalesTableColumnMeta;
                    const sortState = header.column.getIsSorted();
                    const filterValue = header.column.getFilterValue();
                    const hasFilterValue =
                      filterValue !== undefined && filterValue !== null && String(filterValue) !== "";

                    return (
                      <Table.ColumnHeader
                        key={header.id}
                        {...gridCellStyles}
                        {...getSalesTableHeaderCellProps(meta.headerIndex)}
                        textAlign={meta.textAlign}
                        userSelect="none"
                      >
                        <HStack gap="2" justify={meta.textAlign === "end" ? "flex-end" : "flex-start"}>
                          <button
                            type="button"
                            style={{
                              alignItems: "center",
                              background: "transparent",
                              border: "none",
                              cursor: header.column.getCanSort() ? "pointer" : "default",
                              display: "inline-flex",
                              gap: "0.5rem",
                              padding: 0,
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <Text>{flexRender(header.column.columnDef.header, header.getContext())}</Text>
                            <Text color="fg.subtle" fontSize="xs" minW="3">
                              {sortState === "asc" ? "▲" : sortState === "desc" ? "▼" : ""}
                            </Text>
                          </button>
                          <Popover.Root positioning={{ placement: "bottom-start" }}>
                            <Popover.Trigger asChild>
                              <button
                                type="button"
                                aria-label={`Filter ${String(header.column.columnDef.header)}`}
                                style={{
                                  alignItems: "center",
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  justifyContent: "center",
                                  padding: 0,
                                }}
                              >
                                <FilterIcon active={hasFilterValue} />
                              </button>
                            </Popover.Trigger>
                            <Popover.Positioner>
                              <Popover.Content minW="56" p="3">
                                <Popover.Body p="0">
                                  <Text color="fg.muted" fontSize="xs" mb="2">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                  </Text>
                                  {meta.filter === "status" ? (
                                    <select
                                      name={getFieldName("filter", meta.column)}
                                      style={selectFieldStyles}
                                      value={String(filterValue ?? "")}
                                      onChange={(event) =>
                                        header.column.setFilterValue(event.target.value || undefined)
                                      }
                                    >
                                      <option value="">All</option>
                                      {salesOrderStatuses.map((status) => (
                                        <option key={status} value={status}>
                                          {status}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <Input
                                      size="sm"
                                      name={getFieldName("filter", meta.column)}
                                      type={meta.filter === "number" ? "number" : "text"}
                                      value={String(filterValue ?? "")}
                                      placeholder={meta.filter === "number" ? "Equals..." : "Contains..."}
                                      onChange={(event) =>
                                        header.column.setFilterValue(event.target.value || undefined)
                                      }
                                    />
                                  )}
                                </Popover.Body>
                              </Popover.Content>
                            </Popover.Positioner>
                          </Popover.Root>
                        </HStack>
                      </Table.ColumnHeader>
                    );
                  })}
                </Table.Row>
              </Fragment>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((tableRow) => (
              <Table.Row key={tableRow.id}>
                {tableRow.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as SalesTableColumnMeta;
                  const isManualEditCell = meta.editor === "number" || meta.editor === "status";

                  return (
                    <Table.Cell
                      key={cell.id}
                      {...gridCellStyles}
                      fontFamily={meta.fontFamily}
                      fontSize={meta.fontSize}
                      textAlign={meta.textAlign}
                      onDoubleClick={
                        isManualEditCell
                          ? () => getTableMeta(table).startEditing(tableRow.original.__rowKey, meta.column)
                          : undefined
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      {table.getRowModel().rows.length === 0 && (
        <Text color="fg.muted" fontSize="sm" px="4" py="3">
          No matching rows.
        </Text>
      )}
      {saveError && (
        <Text color="fg.error" fontSize="sm" mt="3">
          {saveError}
        </Text>
      )}
      {!saveError && isPending && (
        <Text color="fg.subtle" fontSize="sm" mt="3">
          Saving changes...
        </Text>
      )}
    </Box>
  );
}
