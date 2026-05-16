"use client";

import { useEffect } from "react";
import { Box, Button, Center, Link as ChakraLink, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { designSystemClassNames } from "@/app/design-system/patterns";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Center minH="100vh" px="4">
      <Box
        className={designSystemClassNames.surface}
        w="full"
        maxW="md"
        px="6"
        py="8"
        borderWidth="1px"
        rounded="lg"
        textAlign="center"
      >
        <Box mb="4">
          <Text as="h1" fontSize="6xl" fontWeight="bold" color="fg.error">
            Error
          </Text>
          <Text as="h2" fontSize="2xl" fontWeight="bold" color="fg.muted" mt="2">
            Something went wrong
          </Text>
        </Box>
        <Text color="fg.muted" mb="6">
          An unexpected error occurred. Please try again.
        </Text>
        <VStack gap="3">
          <Button onClick={reset} colorPalette="brand" width="full">
            Try Again
          </Button>
          <ChakraLink asChild width="full">
            <NextLink href="/">
              <Button as="span" width="full" variant="subtle">
                Go Home
              </Button>
            </NextLink>
          </ChakraLink>
        </VStack>
      </Box>
    </Center>
  );
}
