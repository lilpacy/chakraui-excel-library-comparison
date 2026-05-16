// app/page.tsx
import type { Metadata } from "next";
import { Box, Container, HStack, Link as ChakraLink, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description: "Next.js + Cloudflare Workers + D1 + R2 Boilerplate",
  openGraph: {
    title: "Cloudflare Next.js Boilerplate",
    description: "Production-ready boilerplate for Next.js on Cloudflare Workers",
    type: "website",
  },
};

const features = [
  {
    title: "Next.js 15",
    description: "Latest React framework with App Router and Server Components",
  },
  {
    title: "Cloudflare Workers",
    description: "Deploy globally with edge computing",
  },
  {
    title: "D1 Database",
    description: "Serverless SQL database at the edge",
  },
  {
    title: "R2 Storage",
    description: "Object storage without egress fees",
  },
  {
    title: "Clerk Auth",
    description: "Drop-in authentication and user management",
  },
  {
    title: "Drizzle ORM",
    description: "Type-safe database queries with migrations",
  },
];

export default function Home() {
  return (
    <Box py={{ base: 12, md: 16 }}>
      <Container maxW="5xl" px={{ base: 4, md: 6 }}>
        <VStack gap="16" align="stretch">
          <VStack gap="4" textAlign="center">
            <Text as="h1" fontSize={{ base: "4xl", md: "5xl" }} fontWeight="bold" color="gray.900">
            Cloudflare Next.js Boilerplate
            </Text>
            <Text maxW="3xl" fontSize={{ base: "lg", md: "xl" }} color="gray.600">
              Production-ready template for Next.js on Cloudflare Workers with D1 and R2
            </Text>
            <HStack gap="4" justify="center" flexWrap="wrap">
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
                <NextLink href="/todos">View Demo App</NextLink>
              </ChakraLink>
              <ChakraLink
                href="https://github.com/lilpacy/cloudflare-next-boilerplate"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-flex"
                borderWidth="1px"
                borderColor="gray.300"
                bg="white"
                px="6"
                py="3"
                rounded="lg"
                fontWeight="medium"
                _hover={{ bg: "gray.50", textDecoration: "none" }}
              >
                GitHub
              </ChakraLink>
            </HStack>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6">
            {features.map((feature) => (
              <Box
                key={feature.title}
                bg="whiteAlpha.900"
                borderWidth="1px"
                borderColor="blackAlpha.100"
                rounded="xl"
                p="6"
                boxShadow="sm"
                transition="transform 0.2s ease, box-shadow 0.2s ease"
                _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
              >
                <Text as="h3" fontSize="lg" fontWeight="bold" color="gray.900" mb="2">
                  {feature.title}
                </Text>
                <Text color="gray.600">{feature.description}</Text>
              </Box>
            ))}
          </SimpleGrid>

          <Box bg="blackAlpha.50" rounded="xl" p={{ base: 6, md: 8 }}>
            <Text as="h2" fontSize="2xl" fontWeight="bold" color="gray.900" mb="4">
              Getting Started
            </Text>
            <VStack as="ol" align="stretch" gap="3">
              <HStack as="li" align="start" gap="3">
                <Text fontWeight="bold">1.</Text>
                <Text color="gray.700">Clone the repository and install dependencies</Text>
              </HStack>
              <HStack as="li" align="start" gap="3">
                <Text fontWeight="bold">2.</Text>
                <Text color="gray.700">Configure environment variables and Cloudflare settings</Text>
              </HStack>
              <HStack as="li" align="start" gap="3">
                <Text fontWeight="bold">3.</Text>
                <Text color="gray.700">Run migrations and start developing</Text>
              </HStack>
              <HStack as="li" align="start" gap="3">
                <Text fontWeight="bold">4.</Text>
                <Text color="gray.700">Deploy to Cloudflare Workers with a single command</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
