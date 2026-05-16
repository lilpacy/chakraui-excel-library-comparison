"use client";

import { useEffect } from "react";
import { Box, Button, Center, Link as ChakraLink, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

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
        w="full"
        maxW="md"
        px="6"
        py="8"
        bg="whiteAlpha.900"
        borderWidth="1px"
        boxShadow="lg"
        rounded="xl"
        textAlign="center"
      >
        <Box mb="4">
          <Text as="h1" fontSize="6xl" fontWeight="bold" color="red.600">
            Error
          </Text>
          <Text as="h2" fontSize="2xl" fontWeight="semibold" color="gray.700" mt="2">
            Something went wrong
          </Text>
        </Box>
        <Text color="gray.600" mb="6">
          An unexpected error occurred. Please try again.
        </Text>
        <VStack gap="3">
          <Button onClick={reset} colorPalette="blue" width="full">
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
