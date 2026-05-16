"use client";

import { Box, Container, HStack, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { designSystemClassNames } from "@/app/design-system/patterns";

export default function Navigation() {
  return (
    <Box as="nav" className={designSystemClassNames.surface} borderBottomWidth="1px" borderBottomColor="border">
      <Container maxW="6xl" px={{ base: 4, md: 6 }}>
        <HStack minH="16" justify="space-between">
          <ChakraLink
            asChild
            color="fg.brand"
            fontSize="xl"
            fontWeight="bold"
            _hover={{ color: "fg", textDecoration: "none" }}
          >
            <NextLink href="/">ChakraUI Excel Library Comparison</NextLink>
          </ChakraLink>
        </HStack>
      </Container>
    </Box>
  );
}
