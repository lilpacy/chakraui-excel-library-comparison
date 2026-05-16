// app/page.tsx
import type { Metadata } from "next";
import { Badge, Box, Container, Table, Text, VStack } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Home",
  description: "Next.js + Cloudflare Workers + D1 + R2 Boilerplate",
  openGraph: {
    title: "Cloudflare Next.js Boilerplate",
    description: "Production-ready boilerplate for Next.js on Cloudflare Workers",
    type: "website",
  },
};

type SampleRow = {
  orderId: string;
  date: string;
  customer: string;
  region: string;
  rep: string;
  category: string;
  product: string;
  quantity: number;
  unitPrice: number;
  status: "Delivered" | "In Transit" | "Pending";
};

const sampleRows: SampleRow[] = [
  {
    orderId: "SO-240501",
    date: "2026-05-01",
    customer: "Aoyama Coffee Roasters",
    region: "Tokyo",
    rep: "Mika Sato",
    category: "Beverages",
    product: "Cold Brew Bottles",
    quantity: 120,
    unitPrice: 480,
    status: "Delivered",
  },
  {
    orderId: "SO-240502",
    date: "2026-05-02",
    customer: "Kobe Harbor Bakery",
    region: "Hyogo",
    rep: "Riku Tanaka",
    category: "Packaging",
    product: "Takeout Paper Cups",
    quantity: 300,
    unitPrice: 92,
    status: "In Transit",
  },
  {
    orderId: "SO-240503",
    date: "2026-05-03",
    customer: "Sapporo Green Hotel",
    region: "Hokkaido",
    rep: "Aya Fujimoto",
    category: "Cleaning",
    product: "Eco Laundry Sheets",
    quantity: 180,
    unitPrice: 210,
    status: "Delivered",
  },
  {
    orderId: "SO-240504",
    date: "2026-05-04",
    customer: "Nagoya Bento Works",
    region: "Aichi",
    rep: "Daichi Mori",
    category: "Ingredients",
    product: "Premium Rice 10kg",
    quantity: 64,
    unitPrice: 3580,
    status: "Pending",
  },
  {
    orderId: "SO-240505",
    date: "2026-05-05",
    customer: "Fukuoka Fitness Club",
    region: "Fukuoka",
    rep: "Yuna Kato",
    category: "Snacks",
    product: "Protein Bars",
    quantity: 240,
    unitPrice: 165,
    status: "Delivered",
  },
  {
    orderId: "SO-240506",
    date: "2026-05-06",
    customer: "Kyoto Stay Hostel",
    region: "Kyoto",
    rep: "Mika Sato",
    category: "Amenities",
    product: "Travel Toiletry Sets",
    quantity: 150,
    unitPrice: 320,
    status: "In Transit",
  },
  {
    orderId: "SO-240507",
    date: "2026-05-07",
    customer: "Sendai Office Lounge",
    region: "Miyagi",
    rep: "Riku Tanaka",
    category: "Stationery",
    product: "A4 Copy Paper Cases",
    quantity: 42,
    unitPrice: 2850,
    status: "Delivered",
  },
  {
    orderId: "SO-240508",
    date: "2026-05-08",
    customer: "Naha Seaside Cafe",
    region: "Okinawa",
    rep: "Aya Fujimoto",
    category: "Desserts",
    product: "Mango Syrup",
    quantity: 96,
    unitPrice: 540,
    status: "Pending",
  },
  {
    orderId: "SO-240509",
    date: "2026-05-09",
    customer: "Yokohama Event Crew",
    region: "Kanagawa",
    rep: "Daichi Mori",
    category: "Supplies",
    product: "Disposable Gloves",
    quantity: 500,
    unitPrice: 28,
    status: "Delivered",
  },
  {
    orderId: "SO-240510",
    date: "2026-05-10",
    customer: "Osaka Craft Burger",
    region: "Osaka",
    rep: "Yuna Kato",
    category: "Ingredients",
    product: "Smoked Cheddar Slices",
    quantity: 210,
    unitPrice: 138,
    status: "In Transit",
  },
];

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const statusColorPalette = {
  Delivered: "green",
  "In Transit": "blue",
  Pending: "orange",
} as const;

export default function Home() {
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
                    <Table.ColumnHeader>Order ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Customer</Table.ColumnHeader>
                    <Table.ColumnHeader>Region</Table.ColumnHeader>
                    <Table.ColumnHeader>Sales Rep</Table.ColumnHeader>
                    <Table.ColumnHeader>Category</Table.ColumnHeader>
                    <Table.ColumnHeader>Product</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Qty</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Unit Price</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sampleRows.map((row) => (
                    <Table.Row key={row.orderId}>
                      <Table.Cell fontFamily="mono" fontSize="xs">
                        {row.orderId}
                      </Table.Cell>
                      <Table.Cell>{row.date}</Table.Cell>
                      <Table.Cell>{row.customer}</Table.Cell>
                      <Table.Cell>{row.region}</Table.Cell>
                      <Table.Cell>{row.rep}</Table.Cell>
                      <Table.Cell>{row.category}</Table.Cell>
                      <Table.Cell>{row.product}</Table.Cell>
                      <Table.Cell textAlign="end">{row.quantity}</Table.Cell>
                      <Table.Cell textAlign="end">
                        {currencyFormatter.format(row.unitPrice)}
                      </Table.Cell>
                      <Table.Cell>
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
