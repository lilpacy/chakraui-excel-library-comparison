"use client";

import { useState } from "react";
import {
  Badge,
  Box,
  EditableInput,
  EditablePreview,
  EditableRoot,
  Input,
  Table,
} from "@chakra-ui/react";
import { salesOrderStatuses } from "@/lib/db/schema";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";

type EditableSalesTableProps = {
  initialRows: SalesOrderRow[];
};

type ColumnKey = keyof SalesOrderRow;

type EditingCell = {
  rowIndex: number;
  column: ColumnKey;
} | null;

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const statusColorPalette: Record<SalesOrderStatus, string> = {
  Delivered: "green",
  "In Transit": "blue",
  Pending: "orange",
};

const gridCellStyles = {
  borderColor: "gray.200",
  borderInlineEndWidth: "1px",
  borderBottomWidth: "1px",
};

const inputStyles = {
  unstyled: true,
  bg: "transparent",
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  lineHeight: "inherit",
  minW: "100%",
  w: "100%",
  h: "auto",
  px: "0",
  py: "0",
  _focusVisible: {
    outline: "2px solid",
    outlineColor: "blue.400",
    outlineOffset: "2px",
    borderRadius: "sm",
  },
};

const selectFieldStyles = {
  appearance: "none" as const,
  background: "transparent",
  border: "none",
  borderRadius: "0",
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  lineHeight: "inherit",
  minWidth: "100%",
  padding: "0 1.25rem 0 0",
  width: "100%",
};

const editableRootStyles = {
  activationMode: "dblclick" as const,
  submitMode: "both" as const,
  selectOnFocus: true,
  unstyled: true,
};

const previewStyles = {
  unstyled: true,
  cursor: "text",
  display: "block",
};

function parseNumber(value: string) {
  return value === "" ? 0 : Number(value);
}

export function EditableSalesTable({ initialRows }: EditableSalesTableProps) {
  const [rows, setRows] = useState(initialRows);
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  function updateRow<K extends ColumnKey>(rowIndex: number, key: K, value: SalesOrderRow[K]) {
    setRows((currentRows) =>
      currentRows.map((row, index) => (index === rowIndex ? { ...row, [key]: value } : row)),
    );
  }

  function startEditing(rowIndex: number, column: ColumnKey) {
    setEditingCell({ rowIndex, column });
  }

  function stopEditing() {
    setEditingCell(null);
  }

  function isEditing(rowIndex: number, column: ColumnKey) {
    return editingCell?.rowIndex === rowIndex && editingCell.column === column;
  }

  function handleEditorKeyDown(event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) {
    if (event.key === "Enter" || event.key === "Escape") {
      stopEditing();
    }
  }

  function commitTextCell<K extends keyof SalesOrderRow>(
    rowIndex: number,
    key: K,
    value: string,
  ) {
    updateRow(rowIndex, key, value as SalesOrderRow[K]);
  }

  return (
    <Table.ScrollArea maxW="100%">
      <Table.Root size="sm" variant="outline" striped>
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader {...gridCellStyles}>Order ID</Table.ColumnHeader>
            <Table.ColumnHeader {...gridCellStyles}>Date</Table.ColumnHeader>
            <Table.ColumnHeader {...gridCellStyles}>Customer</Table.ColumnHeader>
            <Table.ColumnHeader {...gridCellStyles}>Region</Table.ColumnHeader>
            <Table.ColumnHeader {...gridCellStyles}>Sales Rep</Table.ColumnHeader>
            <Table.ColumnHeader {...gridCellStyles}>Category</Table.ColumnHeader>
            <Table.ColumnHeader {...gridCellStyles}>Product</Table.ColumnHeader>
            <Table.ColumnHeader {...gridCellStyles} textAlign="end">
              Qty
            </Table.ColumnHeader>
            <Table.ColumnHeader {...gridCellStyles} textAlign="end">
              Unit Price
            </Table.ColumnHeader>
            <Table.ColumnHeader {...gridCellStyles}>Status</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row, rowIndex) => (
            <Table.Row key={`${row.orderId}-${rowIndex}`}>
              <Table.Cell {...gridCellStyles} fontFamily="mono" fontSize="xs">
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.orderId}
                  onValueCommit={(details) => commitTextCell(rowIndex, "orderId", details.value)}
                >
                  <EditablePreview
                    {...previewStyles}
                    fontFamily="mono"
                    fontSize="xs"
                  />
                  <EditableInput
                    {...inputStyles}
                    fontFamily="mono"
                    fontSize="xs"
                  />
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.orderDate}
                  onValueCommit={(details) => commitTextCell(rowIndex, "orderDate", details.value)}
                >
                  <EditablePreview {...previewStyles} />
                  <EditableInput {...inputStyles} />
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.customer}
                  onValueCommit={(details) => commitTextCell(rowIndex, "customer", details.value)}
                >
                  <EditablePreview {...previewStyles} />
                  <EditableInput {...inputStyles} />
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.region}
                  onValueCommit={(details) => commitTextCell(rowIndex, "region", details.value)}
                >
                  <EditablePreview {...previewStyles} />
                  <EditableInput {...inputStyles} />
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.rep}
                  onValueCommit={(details) => commitTextCell(rowIndex, "rep", details.value)}
                >
                  <EditablePreview {...previewStyles} />
                  <EditableInput {...inputStyles} />
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.category}
                  onValueCommit={(details) => commitTextCell(rowIndex, "category", details.value)}
                >
                  <EditablePreview {...previewStyles} />
                  <EditableInput {...inputStyles} />
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.product}
                  onValueCommit={(details) => commitTextCell(rowIndex, "product", details.value)}
                >
                  <EditablePreview {...previewStyles} />
                  <EditableInput {...inputStyles} />
                </EditableRoot>
              </Table.Cell>
              <Table.Cell
                {...gridCellStyles}
                textAlign="end"
                onDoubleClick={() => startEditing(rowIndex, "quantity")}
              >
                {isEditing(rowIndex, "quantity") ? (
                  <Input
                    {...inputStyles}
                    autoFocus
                    type="number"
                    textAlign="end"
                    value={row.quantity}
                    onBlur={stopEditing}
                    onChange={(event) =>
                      updateRow(rowIndex, "quantity", parseNumber(event.target.value))
                    }
                    onKeyDown={handleEditorKeyDown}
                  />
                ) : (
                  row.quantity
                )}
              </Table.Cell>
              <Table.Cell
                {...gridCellStyles}
                textAlign="end"
                onDoubleClick={() => startEditing(rowIndex, "unitPrice")}
              >
                {isEditing(rowIndex, "unitPrice") ? (
                  <Input
                    {...inputStyles}
                    autoFocus
                    type="number"
                    textAlign="end"
                    value={row.unitPrice}
                    onBlur={stopEditing}
                    onChange={(event) =>
                      updateRow(rowIndex, "unitPrice", parseNumber(event.target.value))
                    }
                    onKeyDown={handleEditorKeyDown}
                  />
                ) : (
                  currencyFormatter.format(row.unitPrice)
                )}
              </Table.Cell>
              <Table.Cell {...gridCellStyles} onDoubleClick={() => startEditing(rowIndex, "status")}>
                {isEditing(rowIndex, "status") ? (
                  <Box position="relative">
                    <select
                      autoFocus
                      style={selectFieldStyles}
                      value={row.status}
                      onBlur={stopEditing}
                      onChange={(event) =>
                        updateRow(rowIndex, "status", event.target.value as SalesOrderStatus)
                      }
                      onKeyDown={handleEditorKeyDown}
                    >
                      {salesOrderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Box
                      aria-hidden="true"
                      color="gray.500"
                      insetEnd="0"
                      pointerEvents="none"
                      position="absolute"
                      top="50%"
                      transform="translateY(-50%)"
                    >
                      ▾
                    </Box>
                  </Box>
                ) : (
                  <Badge colorPalette={statusColorPalette[row.status]} variant="subtle">
                    {row.status}
                  </Badge>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
