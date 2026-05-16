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
import { pageTitleProps, surfaceBoxProps } from "@/app/design-system/patterns";
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
        <Spinner size="lg" color="fg.brand" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center minH="100vh" px="4">
        <Box textAlign="center" {...surfaceBoxProps} px="8" py="8">
          <Text as="h1" fontSize="2xl" fontWeight="bold" color="fg.error" mb="4">
            Authentication Required
          </Text>
          <Text color="fg.muted">Please sign in to access the dashboard.</Text>
          <ChakraLink
            asChild
            display="inline-flex"
            mt="4"
            bg="brand.solid"
            color="brand.contrast"
            px="4"
            py="2"
            rounded="md"
            fontWeight="medium"
            _hover={{ bg: "brand.solid", opacity: "0.92", textDecoration: "none" }}
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
          <Text as="h1" {...pageTitleProps}>
            Dashboard
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
          <Box {...surfaceBoxProps} p="6">
            <Text fontSize="sm" fontWeight="bold" color="fg.subtle">
              Total Todos
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="bold">
              {stats.total}
            </Text>
          </Box>
          <Box {...surfaceBoxProps} p="6">
            <Text fontSize="sm" fontWeight="bold" color="fg.subtle">
              Completed
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="bold" color="green.fg">
              {stats.completed}
            </Text>
          </Box>
          <Box {...surfaceBoxProps} p="6">
            <Text fontSize="sm" fontWeight="bold" color="fg.subtle">
              Pending
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="bold" color="orange.fg">
              {stats.pending}
            </Text>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
