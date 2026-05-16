import type { Metadata } from "next";
import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { EditableSalesTable } from "@/app/components/tables/editable-sales-table";
import { HandsontableSalesTable } from "@/app/components/tables/handsontable-sales-table";
import { StaticSalesTable } from "@/app/components/tables/static-sales-table";
import { getSalesOrders } from "@/lib/db/sales-orders";

export const metadata: Metadata = {
  title: "Home",
  description: "Next.js + Cloudflare Workers + D1 + R2 Boilerplate",
  openGraph: {
    title: "Cloudflare Next.js Boilerplate",
    description: "Production-ready boilerplate for Next.js on Cloudflare Workers",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

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

          <Box>
            <Text as="h2" fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold">
              Static Table
            </Text>
            <Text mt="2" color="gray.600">
              The original display-only table.
            </Text>
          </Box>

          <Box
            borderWidth="1px"
            rounded="xl"
            bg="whiteAlpha.900"
            boxShadow="sm"
            overflow="hidden"
          >
            <StaticSalesTable rows={salesRows} />
          </Box>

          <Box>
            <Text as="h2" fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold">
              Editable Table
            </Text>
            <Text mt="2" color="gray.600">
              A second table that renders inputs in each body cell for DOM comparison.
            </Text>
          </Box>

          <Box
            borderWidth="1px"
            rounded="xl"
            bg="whiteAlpha.900"
            boxShadow="sm"
            overflow="hidden"
          >
            <EditableSalesTable initialRows={salesRows} />
          </Box>

          <Box>
            <Text as="h2" fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold">
              Handsontable Table
            </Text>
            <Text mt="2" color="gray.600">
              A spreadsheet-style editable grid powered by Handsontable for DOM comparison.
            </Text>
          </Box>

          <Box
            borderWidth="1px"
            rounded="xl"
            bg="whiteAlpha.900"
            boxShadow="sm"
            overflow="hidden"
          >
            <HandsontableSalesTable initialRows={salesRows} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
