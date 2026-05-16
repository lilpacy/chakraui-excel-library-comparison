import { Box, Container, Link, Text } from "@chakra-ui/react";
import { designSystemClassNames } from "@/app/design-system/patterns";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" className={designSystemClassNames.surface} borderTopWidth="1px" borderTopColor="border">
      <Container maxW="6xl" px={{ base: 4, md: 6 }} py="6" textAlign="center">
        <Text fontSize="sm" color="fg.subtle">
          Built with{" "}
          <Link
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="ds-link"
            _hover={{ textDecoration: "underline" }}
          >
            Next.js
          </Link>
          ,{" "}
          <Link
            href="https://www.cloudflare.com/developer-platform/workers/"
            target="_blank"
            rel="noopener noreferrer"
            className="ds-link"
            _hover={{ textDecoration: "underline" }}
          >
            Cloudflare Workers
          </Link>
          ,{" "}
          <Link
            href="https://developers.cloudflare.com/d1/"
            target="_blank"
            rel="noopener noreferrer"
            className="ds-link"
            _hover={{ textDecoration: "underline" }}
          >
            D1
          </Link>
          , and{" "}
          <Link
            href="https://developers.cloudflare.com/r2/"
            target="_blank"
            rel="noopener noreferrer"
            className="ds-link"
            _hover={{ textDecoration: "underline" }}
          >
            R2
          </Link>
        </Text>
        <Text mt="2" fontSize="sm" color="fg.subtle">
          © {currentYear} ChakraUI Excel Library Comparison
        </Text>
      </Container>
    </Box>
  );
}
