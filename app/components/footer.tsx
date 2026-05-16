import { Box, Container, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" borderTopWidth="1px" bg="whiteAlpha.800">
      <Container maxW="6xl" px={{ base: 4, md: 6 }} py="6" textAlign="center">
        <Text fontSize="sm" color="gray.500">
          Built with{" "}
          <Link
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.600"
            _hover={{ textDecoration: "underline" }}
          >
            Next.js
          </Link>
          ,{" "}
          <Link
            href="https://www.cloudflare.com/developer-platform/workers/"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.600"
            _hover={{ textDecoration: "underline" }}
          >
            Cloudflare Workers
          </Link>
          ,{" "}
          <Link
            href="https://developers.cloudflare.com/d1/"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.600"
            _hover={{ textDecoration: "underline" }}
          >
            D1
          </Link>
          , and{" "}
          <Link
            href="https://developers.cloudflare.com/r2/"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.600"
            _hover={{ textDecoration: "underline" }}
          >
            R2
          </Link>
        </Text>
        <Text mt="2" fontSize="sm" color="gray.500">
          © {currentYear} CF Next Boilerplate
        </Text>
      </Container>
    </Box>
  );
}
