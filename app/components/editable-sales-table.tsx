"use client";

import { useState } from "react";
import { Box, Input, Table } from "@chakra-ui/react";
import { salesOrderStatuses } from "@/lib/db/schema";

type SalesOrderStatus = (typeof salesOrderStatuses)[number];

type SalesOrderRow = {
  orderId: string;
  orderDate: string;
  customer: string;
  region: string;
  rep: string;
  category: string;
  product: string;
  quantity: number;
  unitPrice: number;
  status: SalesOrderStatus;
};

type EditableSalesTableProps = {
  initialRows: SalesOrderRow[];
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
  minW: "0",
  w: "full",
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
  minWidth: 0,
  padding: "0 1.25rem 0 0",
  width: "100%",
};

export function EditableSalesTable({ initialRows }: EditableSalesTableProps) {
  const [rows, setRows] = useState(initialRows);

  function updateRow<K extends keyof SalesOrderRow>(
    orderId: string,
    key: K,
    value: SalesOrderRow[K],
  ) {
    setRows((currentRows) =>
      currentRows.map((row) => (row.orderId === orderId ? { ...row, [key]: value } : row)),
    );
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
          {rows.map((row) => (
            <Table.Row key={row.orderId}>
              <Table.Cell {...gridCellStyles} fontFamily="mono" fontSize="xs">
                <Input
                  {...inputStyles}
                  fontFamily="mono"
                  fontSize="xs"
                  value={row.orderId}
                  onChange={(event) => updateRow(row.orderId, "orderId", event.target.value)}
                />
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <Input
                  {...inputStyles}
                  value={row.orderDate}
                  onChange={(event) => updateRow(row.orderId, "orderDate", event.target.value)}
                />
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <Input
                  {...inputStyles}
                  value={row.customer}
                  onChange={(event) => updateRow(row.orderId, "customer", event.target.value)}
                />
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <Input
                  {...inputStyles}
                  value={row.region}
                  onChange={(event) => updateRow(row.orderId, "region", event.target.value)}
                />
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <Input
                  {...inputStyles}
                  value={row.rep}
                  onChange={(event) => updateRow(row.orderId, "rep", event.target.value)}
                />
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <Input
                  {...inputStyles}
                  value={row.category}
                  onChange={(event) => updateRow(row.orderId, "category", event.target.value)}
                />
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <Input
                  {...inputStyles}
                  value={row.product}
                  onChange={(event) => updateRow(row.orderId, "product", event.target.value)}
                />
              </Table.Cell>
              <Table.Cell {...gridCellStyles} textAlign="end">
                <Input
                  {...inputStyles}
                  type="number"
                  textAlign="end"
                  value={row.quantity}
                  onChange={(event) =>
                    updateRow(row.orderId, "quantity", Number(event.target.value))
                  }
                />
              </Table.Cell>
              <Table.Cell {...gridCellStyles} textAlign="end">
                <Input
                  {...inputStyles}
                  type="number"
                  textAlign="end"
                  value={row.unitPrice}
                  onChange={(event) =>
                    updateRow(row.orderId, "unitPrice", Number(event.target.value))
                  }
                />
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <Box position="relative">
                  <select
                    style={selectFieldStyles}
                    value={row.status}
                    onChange={(event) =>
                      updateRow(
                        row.orderId,
                        "status",
                        event.target.value as SalesOrderStatus,
                      )
                    }
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
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
