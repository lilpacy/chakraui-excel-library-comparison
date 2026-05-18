import type { Metadata } from "next";
import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { HandsontableSalesTable } from "@/app/components/tables/handsontable";
import {
  dataGridBoxProps,
  heroTitleProps,
  sectionDescriptionProps,
  sectionTitleProps,
} from "@/app/design-system/patterns";
import { getSalesOrders } from "@/lib/db/sales-orders";

export const metadata: Metadata = {
  title: "Handsontable Only",
  description: "Isolated Handsontable page for profiling and performance comparison.",
};

export const dynamic = "force-dynamic";

export default async function HandsontableOnlyPage() {
  const salesRows = await getSalesOrders();

  return (
    <Box py={{ base: 12, md: 16 }}>
      <Container maxW="5xl" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap="6">
          <Box>
            <Text as="h1" {...heroTitleProps}>
              Handsontable Only
            </Text>
            <Text mt="3" maxW="3xl" fontSize={{ base: "md", md: "lg" }} {...sectionDescriptionProps}>
              This route renders only the Handsontable implementation so browser profiling can
              separate Handsontable startup cost from the rest of the comparison page.
            </Text>
          </Box>

          <Box>
            <Text as="h2" {...sectionTitleProps}>
              Isolated Grid
            </Text>
            <Text mt="2" {...sectionDescriptionProps}>
              Compare this route against `/` to confirm whether the slowdown is inside
              Handsontable itself or caused by surrounding grids and page hydration.
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
