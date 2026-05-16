import { Box, Center, Link as ChakraLink, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function NotFound() {
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
          <Text as="h1" fontSize="6xl" fontWeight="bold" color="gray.900">
            404
          </Text>
          <Text as="h2" fontSize="2xl" fontWeight="semibold" color="gray.700" mt="2">
            Page Not Found
          </Text>
        </Box>
        <Text color="gray.600" mb="6">
          The page you are looking for does not exist or has been moved.
        </Text>
        <ChakraLink
          asChild
          display="inline-flex"
          bg="blue.600"
          color="white"
          px="6"
          py="3"
          rounded="lg"
          fontWeight="medium"
          _hover={{ bg: "blue.700", textDecoration: "none" }}
        >
          <NextLink href="/">Go Home</NextLink>
        </ChakraLink>
      </Box>
    </Center>
  );
}
