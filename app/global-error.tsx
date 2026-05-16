"use client";

import { useEffect } from "react";
import { Box, Button, Center, Text } from "@chakra-ui/react";
import { designSystemClassNames } from "@/app/design-system/patterns";
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
                  A critical error occurred
                </Text>
              </Box>
              <Text color="fg.muted" mb="6">
                A critical error occurred in the application. Please try again.
              </Text>
              <Button onClick={reset} colorPalette="brand">
                Try Again
              </Button>
            </Box>
          </Center>
        </Provider>
      </body>
    </html>
  );
}
