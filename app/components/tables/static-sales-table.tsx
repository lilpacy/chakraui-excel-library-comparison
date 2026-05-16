import { Badge, Table } from "@chakra-ui/react";
import {
  gridCellStyles,
  salesStatusColorPalette,
  tableHeaderRowProps,
} from "@/app/design-system/patterns";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";

type StaticSalesTableProps = {
  rows: SalesOrderRow[];
};

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const statusColorPalette: Record<SalesOrderStatus, string> = salesStatusColorPalette;

export function StaticSalesTable({ rows }: StaticSalesTableProps) {
  return (
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
          {rows.map((row) => (
            <Table.Row key={row.orderId}>
              <Table.Cell {...gridCellStyles} fontFamily="mono" fontSize="xs">
                {row.orderId}
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>{row.orderDate}</Table.Cell>
              <Table.Cell {...gridCellStyles}>{row.customer}</Table.Cell>
              <Table.Cell {...gridCellStyles}>{row.region}</Table.Cell>
              <Table.Cell {...gridCellStyles}>{row.rep}</Table.Cell>
              <Table.Cell {...gridCellStyles}>{row.category}</Table.Cell>
              <Table.Cell {...gridCellStyles}>{row.product}</Table.Cell>
              <Table.Cell {...gridCellStyles} textAlign="end">
                {row.quantity}
              </Table.Cell>
              <Table.Cell {...gridCellStyles} textAlign="end">
                {currencyFormatter.format(row.unitPrice)}
              </Table.Cell>
              <Table.Cell {...gridCellStyles}>
                <Badge colorPalette={statusColorPalette[row.status]} variant="subtle">
                  {row.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
