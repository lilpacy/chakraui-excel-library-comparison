"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Badge,
  Box,
  EditableArea,
  EditableInput,
  EditablePreview,
  EditableRoot,
  Input,
  Table,
  Text,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
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

type EditingCell = {
  rowIndex: number;
  column: ColumnKey;
  originalRow: SalesOrderRow;
} | null;

type SalesTableColumnMeta = {
  column: ColumnKey;
  editor: "text" | "number" | "status";
  headerIndex: number;
  textAlign?: "end";
  fontFamily?: "mono";
  fontSize?: "xs";
};

type TanStackSalesTableMeta = {
  isEditing: (rowIndex: number, column: ColumnKey) => boolean;
  startEditing: (rowIndex: number, column: ColumnKey) => void;
  stopEditing: () => void;
  updateRow: <K extends ColumnKey>(rowIndex: number, key: K, value: SalesOrderRow[K]) => void;
  commitTextCell: <K extends TextColumnKey>(rowIndex: number, key: K, value: string) => void;
  commitNumberCell: (rowIndex: number, key: NumericColumnKey, value: number) => void;
  commitStatusCell: (rowIndex: number, status: SalesOrderStatus) => void;
  revertCustomEdit: (rowIndex: number) => void;
  handleNumberEditorKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    key: NumericColumnKey,
  ) => void;
};

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const statusColorPalette: Record<SalesOrderStatus, string> = salesStatusColorPalette;
const columnHelper = createColumnHelper<SalesOrderRow>();

function parseNumber(value: string) {
  return value === "" ? 0 : Number(value);
}

function getTableMeta(table: TanStackTable<SalesOrderRow>) {
  return table.options.meta as TanStackSalesTableMeta;
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
      headerIndex,
      ...options,
    } satisfies SalesTableColumnMeta,
    cell: ({ getValue, row, table }) => {
      const meta = getTableMeta(table);
      const value = getValue();

      return (
        <EditableRoot
          {...editableRootStyles}
          defaultValue={value}
          key={`${key}-${row.original.orderId}-${value}`}
          onValueCommit={(details) => meta.commitTextCell(row.index, key, details.value)}
        >
          <EditableArea>
            <EditablePreview
              {...previewStyles}
              fontFamily={options?.fontFamily}
              fontSize={options?.fontSize}
            />
            <EditableInput
              {...inputStyles}
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
      headerIndex,
      textAlign: "end",
    } satisfies SalesTableColumnMeta,
    cell: ({ getValue, row, table }) => {
      const meta = getTableMeta(table);
      const isEditing = meta.isEditing(row.index, key);
      const value = getValue();

      if (isEditing) {
        return (
          <Input
            {...inputStyles}
            autoFocus
            type="number"
            textAlign="end"
            value={value}
            onBlur={(event) => meta.commitNumberCell(row.index, key, parseNumber(event.target.value))}
            onChange={(event) => meta.updateRow(row.index, key, parseNumber(event.target.value))}
            onKeyDown={(event) => meta.handleNumberEditorKeyDown(event, row.index, key)}
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
      headerIndex: 9,
    } satisfies SalesTableColumnMeta,
    cell: ({ getValue, row, table }) => {
      const meta = getTableMeta(table);
      const value = getValue();

      if (meta.isEditing(row.index, "status")) {
        return (
          <Box position="relative">
            <select
              autoFocus
              style={selectFieldStyles}
              value={value}
              onBlur={meta.stopEditing}
              onChange={(event) => meta.commitStatusCell(row.index, event.target.value as SalesOrderStatus)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  meta.revertCustomEdit(row.index);
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
  const [rows, setRows] = useState(initialRows);
  const [isPending, startTransition] = useTransition();
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialRows);
    setEditingCell(null);
    setSaveError(null);
  }, [initialRows]);

  function updateRow<K extends ColumnKey>(rowIndex: number, key: K, value: SalesOrderRow[K]) {
    setRows((currentRows) =>
      currentRows.map((row, index) => (index === rowIndex ? { ...row, [key]: value } : row)),
    );
  }

  function replaceRow(rowIndex: number, nextRow: SalesOrderRow) {
    setRows((currentRows) =>
      currentRows.map((row, index) => (index === rowIndex ? nextRow : row)),
    );
  }

  function startEditing(rowIndex: number, column: ColumnKey) {
    setEditingCell({ rowIndex, column, originalRow: rows[rowIndex] });
  }

  function stopEditing() {
    setEditingCell(null);
  }

  function isEditing(rowIndex: number, column: ColumnKey) {
    return editingCell?.rowIndex === rowIndex && editingCell.column === column;
  }

  function persistRowChange(rowIndex: number, previousRow: SalesOrderRow, nextRow: SalesOrderRow) {
    if (JSON.stringify(previousRow) === JSON.stringify(nextRow)) {
      stopEditing();
      return;
    }

    replaceRow(rowIndex, nextRow);
    stopEditing();
    setSaveError(null);

    startTransition(async () => {
      try {
        await updateSalesOrder(previousRow.orderId, nextRow);
      } catch (error) {
        replaceRow(rowIndex, previousRow);
        setSaveError(error instanceof Error ? error.message : "Failed to save sales order");
      }
    });
  }

  function commitTextCell<K extends TextColumnKey>(rowIndex: number, key: K, value: string) {
    const previousRow = rows[rowIndex];
    const nextRow = { ...previousRow, [key]: value as SalesOrderRow[K] };

    persistRowChange(rowIndex, previousRow, nextRow);
  }

  function commitNumberCell(rowIndex: number, key: NumericColumnKey, value: number) {
    const previousRow = editingCell?.rowIndex === rowIndex ? editingCell.originalRow : rows[rowIndex];
    const nextRow = { ...rows[rowIndex], [key]: value };

    persistRowChange(rowIndex, previousRow, nextRow);
  }

  function commitStatusCell(rowIndex: number, status: SalesOrderStatus) {
    const previousRow = editingCell?.rowIndex === rowIndex ? editingCell.originalRow : rows[rowIndex];
    const nextRow = { ...rows[rowIndex], status };

    persistRowChange(rowIndex, previousRow, nextRow);
  }

  function revertCustomEdit(rowIndex: number) {
    if (editingCell?.rowIndex !== rowIndex) {
      stopEditing();
      return;
    }

    replaceRow(rowIndex, editingCell.originalRow);
    stopEditing();
  }

  function handleNumberEditorKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    key: NumericColumnKey,
  ) {
    if (event.key === "Escape") {
      revertCustomEdit(rowIndex);
      return;
    }

    if (event.key === "Enter") {
      commitNumberCell(rowIndex, key, parseNumber(event.currentTarget.value));
    }
  }

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
              <Table.Row key={headerGroup.id} {...tableHeaderRowProps}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as SalesTableColumnMeta;

                  return (
                    <Table.ColumnHeader
                      key={header.id}
                      {...gridCellStyles}
                      {...getSalesTableHeaderCellProps(meta.headerIndex)}
                      textAlign={meta.textAlign}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.ColumnHeader>
                  );
                })}
              </Table.Row>
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
                          ? () => getTableMeta(table).startEditing(tableRow.index, meta.column)
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
