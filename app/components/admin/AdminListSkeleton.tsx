"use client";

import { Box, Container, HStack, Skeleton, VStack } from "@chakra-ui/react";
import { surfaceBoxProps } from "@/app/design-system/patterns";

export default function AdminListSkeleton() {
  return (
    <Box py={{ base: 8, md: 10 }}>
      <Container maxW="6xl" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap="6">
          <Skeleton height="10" width="36" rounded="md" />
          <Box {...surfaceBoxProps} p="6">
            <VStack align="stretch" gap="4">
              {[1, 2, 3, 4, 5].map((i) => (
                <HStack key={i} gap="4">
                  <Skeleton height="4" flex="1" rounded="md" />
                  <Skeleton height="4" width="20" rounded="md" />
                  <Skeleton height="4" width="24" rounded="md" />
                  <Skeleton height="4" width="20" rounded="md" />
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
