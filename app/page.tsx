// app/page.tsx
import type { Metadata } from "next";
import { Badge, Box, Container, Table, Text, VStack } from "@chakra-ui/react";
import { getSalesOrders } from "@/lib/db/sales-orders";
import { salesOrderStatuses } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Home",
  description: "Next.js + Cloudflare Workers + D1 + R2 Boilerplate",
  openGraph: {
    title: "Cloudflare Next.js Boilerplate",
    description: "Production-ready boilerplate for Next.js on Cloudflare Workers",
    type: "website",
  },
};

type SalesOrderStatus = (typeof salesOrderStatuses)[number];

export const dynamic = "force-dynamic";

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

export default async function Home() {
  const salesRows = await getSalesOrders();

  return (
    <Box py={{ base: 12, md: 16 }}>
      <Container maxW="5xl" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap="6">
          <Box>
            <Text as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
              Sample Sales Table
            </Text>
            <Text mt="3" maxW="3xl" color="gray.600" fontSize={{ base: "md", md: "lg" }}>
              A concrete 10x10 dataset for a food-service wholesaler. This makes it easier to
              imagine sorting by region, filtering by status, or comparing pricing and quantities.
            </Text>
          </Box>

          <Box
            borderWidth="1px"
            rounded="xl"
            bg="whiteAlpha.900"
            boxShadow="sm"
            overflow="hidden"
          >
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
                  {salesRows.map((row) => (
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
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
