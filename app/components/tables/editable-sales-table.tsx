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
import { updateSalesOrder } from "@/app/actions/sales-orders";
import {
  editableInputStyles as inputStyles,
  editablePreviewStyles as previewStyles,
  editableRootStyles,
  editableSelectStyles as selectFieldStyles,
  gridCellStyles,
  salesStatusColorPalette,
  tableHeaderRowProps,
} from "@/app/design-system/patterns";
import { salesOrderStatuses } from "@/lib/db/schema";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";

type EditableSalesTableProps = {
  initialRows: SalesOrderRow[];
};

type ColumnKey = keyof SalesOrderRow;

type EditingCell = {
  rowIndex: number;
  column: ColumnKey;
  originalRow: SalesOrderRow;
} | null;

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const statusColorPalette: Record<SalesOrderStatus, string> = salesStatusColorPalette;

function parseNumber(value: string) {
  return value === "" ? 0 : Number(value);
}

export function EditableSalesTable({ initialRows }: EditableSalesTableProps) {
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

  function handleEditorKeyDown(event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) {
    if (event.key === "Enter" || event.key === "Escape") {
      stopEditing();
    }
  }

  function persistRowChange(rowIndex: number, previousRow: SalesOrderRow, nextRow: SalesOrderRow) {
    if (JSON.stringify(previousRow) === JSON.stringify(nextRow)) {
      return;
    }

    replaceRow(rowIndex, nextRow);
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

  function commitTextCell<K extends keyof SalesOrderRow>(
    rowIndex: number,
    key: K,
    value: string,
  ) {
    const previousRow = rows[rowIndex];
    const nextRow = { ...previousRow, [key]: value as SalesOrderRow[K] };

    persistRowChange(rowIndex, previousRow, nextRow);
  }

  function commitNumberCell(
    rowIndex: number,
    key: "quantity" | "unitPrice",
    value: number,
  ) {
    const previousRow = editingCell?.rowIndex === rowIndex ? editingCell.originalRow : rows[rowIndex];
    const nextRow = { ...rows[rowIndex], [key]: value };

    stopEditing();
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
    key: "quantity" | "unitPrice",
  ) {
    if (event.key === "Escape") {
      revertCustomEdit(rowIndex);
      return;
    }

    if (event.key === "Enter") {
      commitNumberCell(rowIndex, key, parseNumber(event.currentTarget.value));
    }
  }

  return (
    <Box>
      <Table.ScrollArea maxW="100%">
        <Table.Root size="sm" variant="outline" striped>
          <Table.Header>
            <Table.Row {...tableHeaderRowProps}>
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
                  key={`orderId-${row.orderId}`}
                  onValueCommit={(details) => commitTextCell(rowIndex, "orderId", details.value)}
                >
                  <EditableArea>
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
                  </EditableArea>
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.orderDate}
                  key={`orderDate-${row.orderId}-${row.orderDate}`}
                  onValueCommit={(details) => commitTextCell(rowIndex, "orderDate", details.value)}
                >
                  <EditableArea>
                    <EditablePreview {...previewStyles} />
                    <EditableInput {...inputStyles} />
                  </EditableArea>
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.customer}
                  key={`customer-${row.orderId}-${row.customer}`}
                  onValueCommit={(details) => commitTextCell(rowIndex, "customer", details.value)}
                >
                  <EditableArea>
                    <EditablePreview {...previewStyles} />
                    <EditableInput {...inputStyles} />
                  </EditableArea>
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.region}
                  key={`region-${row.orderId}-${row.region}`}
                  onValueCommit={(details) => commitTextCell(rowIndex, "region", details.value)}
                >
                  <EditableArea>
                    <EditablePreview {...previewStyles} />
                    <EditableInput {...inputStyles} />
                  </EditableArea>
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.rep}
                  key={`rep-${row.orderId}-${row.rep}`}
                  onValueCommit={(details) => commitTextCell(rowIndex, "rep", details.value)}
                >
                  <EditableArea>
                    <EditablePreview {...previewStyles} />
                    <EditableInput {...inputStyles} />
                  </EditableArea>
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.category}
                  key={`category-${row.orderId}-${row.category}`}
                  onValueCommit={(details) => commitTextCell(rowIndex, "category", details.value)}
                >
                  <EditableArea>
                    <EditablePreview {...previewStyles} />
                    <EditableInput {...inputStyles} />
                  </EditableArea>
                </EditableRoot>
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <EditableRoot
                  {...editableRootStyles}
                  defaultValue={row.product}
                  key={`product-${row.orderId}-${row.product}`}
                  onValueCommit={(details) => commitTextCell(rowIndex, "product", details.value)}
                >
                  <EditableArea>
                    <EditablePreview {...previewStyles} />
                    <EditableInput {...inputStyles} />
                  </EditableArea>
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
                    onBlur={(event) =>
                      commitNumberCell(rowIndex, "quantity", parseNumber(event.target.value))
                    }
                    onChange={(event) =>
                      updateRow(rowIndex, "quantity", parseNumber(event.target.value))
                    }
                    onKeyDown={(event) => handleNumberEditorKeyDown(event, rowIndex, "quantity")}
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
                    onBlur={(event) =>
                      commitNumberCell(rowIndex, "unitPrice", parseNumber(event.target.value))
                    }
                    onChange={(event) =>
                      updateRow(rowIndex, "unitPrice", parseNumber(event.target.value))
                    }
                    onKeyDown={(event) => handleNumberEditorKeyDown(event, rowIndex, "unitPrice")}
                  />
                ) : (
                  currencyFormatter.format(row.unitPrice)
                )}
              </Table.Cell>
              <Table.Cell
                {...gridCellStyles}
                onDoubleClick={() => startEditing(rowIndex, "status")}
              >
                {isEditing(rowIndex, "status") ? (
                  <Box position="relative">
                    <select
                      autoFocus
                      style={selectFieldStyles}
                      value={row.status}
                      onBlur={stopEditing}
                      onChange={(event) =>
                        persistRowChange(rowIndex, row, {
                          ...row,
                          status: event.target.value as SalesOrderStatus,
                        })
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
