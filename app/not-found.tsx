import { Box, Center, Link as ChakraLink, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { designSystemClassNames } from "@/app/design-system/patterns";

export default function NotFound() {
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
          <Text as="h1" fontSize="6xl" fontWeight="bold" color="fg">
            404
          </Text>
          <Text as="h2" fontSize="2xl" fontWeight="bold" color="fg.muted" mt="2">
            Page Not Found
          </Text>
        </Box>
        <Text color="fg.muted" mb="6">
          The page you are looking for does not exist or has been moved.
        </Text>
        <ChakraLink
          asChild
          display="inline-flex"
          bg="brand.solid"
          color="brand.contrast"
          px="6"
          py="3"
          rounded="lg"
          fontWeight="medium"
          _hover={{ bg: "brand.solid", opacity: "0.92", textDecoration: "none" }}
        >
          <NextLink href="/">Go Home</NextLink>
        </ChakraLink>
      </Box>
    </Center>
  );
}
