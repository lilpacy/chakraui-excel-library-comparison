import type { Metadata } from "next";
import Link from "next/link";
import { Box, Container, HStack, Text, VStack } from "@chakra-ui/react";
import { HandsontableCoreSalesTable } from "@/app/components/tables/handsontable/core";
import { HandsontableSalesTable } from "@/app/components/tables/handsontable";
import {
  handsontableFeaturePresets,
  resolveHandsontableFeaturePreset,
} from "@/app/components/tables/handsontable/profiles";
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

type HandsontableEngine = "wrapper" | "core";

type HandsontableOnlyPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function resolveHandsontableEngine(
  value: string | string[] | undefined,
): HandsontableEngine {
  return value === "core" ? "core" : "wrapper";
}

export default async function HandsontableOnlyPage({
  searchParams,
}: HandsontableOnlyPageProps) {
  const salesRows = await getSalesOrders();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const presetName = resolveHandsontableFeaturePreset(resolvedSearchParams?.preset);
  const engine = resolveHandsontableEngine(resolvedSearchParams?.engine);
  const featureProfile = handsontableFeaturePresets[presetName];

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
            <Text mt="3" fontSize="sm" {...sectionDescriptionProps}>
              Current preset: <strong>{presetName}</strong> / engine: <strong>{engine}</strong>
            </Text>
            <HStack mt="3" gap="4" wrap="wrap">
              {Object.keys(handsontableFeaturePresets).map((name) => (
                <Link key={name} href={`/handsontable-only?engine=${engine}&preset=${name}`}>
                  {name}
                </Link>
              ))}
            </HStack>
            <HStack mt="2" gap="4" wrap="wrap">
              <Link href={`/handsontable-only?engine=wrapper&preset=${presetName}`}>wrapper</Link>
              <Link href={`/handsontable-only?engine=core&preset=${presetName}`}>core</Link>
            </HStack>
          </Box>

          <Box>
            <Text as="h2" {...sectionTitleProps}>
              Isolated Grid
            </Text>
            <Text mt="2" {...sectionDescriptionProps}>
              Compare `engine=wrapper` against `engine=core`, and then compare `preset=full`
              against `preset=plain` to see whether the wrapper layer or Handsontable core is the
              dominant startup cost.
            </Text>
          </Box>

          <Box {...dataGridBoxProps}>
            {engine === "core" ? (
              <HandsontableCoreSalesTable initialRows={salesRows} featureProfile={featureProfile} />
            ) : (
              <HandsontableSalesTable initialRows={salesRows} featureProfile={featureProfile} />
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
