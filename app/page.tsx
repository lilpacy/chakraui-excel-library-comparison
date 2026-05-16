import type { Metadata } from "next";
import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { EditableSalesTable } from "@/app/components/tables/editable-sales-table";
import { HandsontableSalesTable } from "@/app/components/tables/handsontable";
import { StaticSalesTable } from "@/app/components/tables/static-sales-table";
import {
  dataGridBoxProps,
  heroTitleProps,
  sectionDescriptionProps,
  sectionTitleProps,
} from "@/app/design-system/patterns";
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
            <Text as="h1" {...heroTitleProps}>
              Sample Sales Table
            </Text>
            <Text mt="3" maxW="3xl" fontSize={{ base: "md", md: "lg" }} {...sectionDescriptionProps}>
              A concrete 10x10 dataset for a food-service wholesaler. This makes it easier to
              imagine sorting by region, filtering by status, or comparing pricing and quantities.
            </Text>
          </Box>

          <Box>
            <Text as="h2" {...sectionTitleProps}>
              Static Table
            </Text>
            <Text mt="2" {...sectionDescriptionProps}>
              The original display-only table.
            </Text>
          </Box>

          <Box {...dataGridBoxProps}>
            <StaticSalesTable rows={salesRows} />
          </Box>

          <Box>
            <Text as="h2" {...sectionTitleProps}>
              Editable Table
            </Text>
            <Text mt="2" {...sectionDescriptionProps}>
              A second table that renders inputs in each body cell for DOM comparison.
            </Text>
          </Box>

          <Box {...dataGridBoxProps}>
            <EditableSalesTable initialRows={salesRows} />
          </Box>

          <Box>
            <Text as="h2" {...sectionTitleProps}>
              Handsontable Table
            </Text>
            <Text mt="2" {...sectionDescriptionProps}>
              A spreadsheet-style editable grid powered by Handsontable for DOM comparison.
            </Text>
          </Box>

          <Box {...dataGridBoxProps}>
            <HandsontableSalesTable initialRows={salesRows} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
