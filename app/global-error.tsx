"use client";

import { useEffect } from "react";
import { Box, Button, Center, Text } from "@chakra-ui/react";
import { Provider } from "./components/ui/provider";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <Provider>
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
                  A critical error occurred
                </Text>
              </Box>
              <Text color="gray.600" mb="6">
                A critical error occurred in the application. Please try again.
              </Text>
              <Button onClick={reset} colorPalette="blue">
                Try Again
              </Button>
            </Box>
          </Center>
        </Provider>
      </body>
    </html>
  );
}
