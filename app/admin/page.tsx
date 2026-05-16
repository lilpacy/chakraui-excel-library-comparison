// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Center,
  Container,
  Link as ChakraLink,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { getAllTodosStatsForAdmin } from "@/app/actions/todos";
import NextLink from "next/link";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchStats();
    }
  }, [isLoaded, user]);

  const fetchStats = async () => {
    try {
      const stats = await getAllTodosStatsForAdmin();
      setStats(stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" color="blue.600" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center minH="100vh" px="4">
        <Box textAlign="center">
          <Text as="h1" fontSize="2xl" fontWeight="bold" color="red.600" mb="4">
            Authentication Required
          </Text>
          <Text color="gray.600">Please sign in to access the dashboard.</Text>
          <ChakraLink
            asChild
            display="inline-flex"
            mt="4"
            bg="blue.600"
            color="white"
            px="4"
            py="2"
            rounded="md"
            fontWeight="medium"
            _hover={{ bg: "blue.700", textDecoration: "none" }}
          >
            <NextLink href="/sign-in">Sign In</NextLink>
          </ChakraLink>
        </Box>
      </Center>
    );
  }

  return (
    <Box py={{ base: 8, md: 10 }}>
      <Container maxW="6xl" px={{ base: 4, md: 6 }}>
        <Box mb="8">
          <Text as="h1" fontSize="3xl" fontWeight="bold">
            Dashboard
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
          <Box bg="whiteAlpha.900" borderWidth="1px" rounded="xl" boxShadow="sm" p="6">
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              Total Todos
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="bold">
              {stats.total}
            </Text>
          </Box>
          <Box bg="whiteAlpha.900" borderWidth="1px" rounded="xl" boxShadow="sm" p="6">
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              Completed
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="bold" color="green.600">
              {stats.completed}
            </Text>
          </Box>
          <Box bg="whiteAlpha.900" borderWidth="1px" rounded="xl" boxShadow="sm" p="6">
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              Pending
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="bold" color="orange.600">
              {stats.pending}
            </Text>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
