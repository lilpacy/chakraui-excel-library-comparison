"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Container,
  HStack,
  Link as ChakraLink,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { href: "/", label: "Home", exact: true },
    { href: "/todos", label: "Todos", exact: false },
    { href: "/profile", label: "Profile", exact: false },
    { href: "/admin", label: "Dashboard", exact: false },
  ];

  const isLinkActive = (link: (typeof navLinks)[number]) => {
    if (link.exact) {
      return isActive(link.href);
    }

    return isActive(link.href) || pathname?.startsWith(`${link.href}/`);
  };

  return (
    <Box as="nav" bg="whiteAlpha.900" borderBottomWidth="1px" boxShadow="sm">
      <Container maxW="6xl" px={{ base: 4, md: 6 }}>
        <HStack minH="16" justify="space-between">
          <ChakraLink
            asChild
            color="gray.900"
            fontSize="xl"
            fontWeight="bold"
            _hover={{ color: "gray.700", textDecoration: "none" }}
          >
            <NextLink href="/">CF Next Boilerplate</NextLink>
          </ChakraLink>

          <HStack gap="8" display={{ base: "none", md: "flex" }}>
            {navLinks.map((link) => {
              const active = isLinkActive(link);

              return (
                <ChakraLink
                  key={link.href}
                  asChild
                  pb="1"
                  borderBottomWidth="2px"
                  borderColor={active ? "blue.600" : "transparent"}
                  color={active ? "blue.600" : "gray.700"}
                  fontWeight={active ? "semibold" : "medium"}
                  transition="colors 0.2s ease, border-color 0.2s ease"
                  _hover={{
                    color: "blue.600",
                    borderColor: active ? "blue.600" : "blue.300",
                    textDecoration: "none",
                  }}
                >
                  <NextLink href={link.href}>{link.label}</NextLink>
                </ChakraLink>
              );
            })}
            {isSignedIn ? (
              <UserButton />
            ) : (
              <ChakraLink
                asChild
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
            )}
          </HStack>

          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            display={{ base: "inline-flex", md: "none" }}
            variant="outline"
            colorPalette="blue"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </Button>
        </HStack>

        {isMenuOpen && (
          <VStack
            display={{ base: "flex", md: "none" }}
            align="stretch"
            gap="2"
            pb="4"
            borderTopWidth="1px"
          >
            {navLinks.map((link) => {
              const active = isLinkActive(link);

              return (
                <ChakraLink
                  key={link.href}
                  asChild
                  px="3"
                  py="2"
                  rounded="md"
                  bg={active ? "blue.50" : "transparent"}
                  color={active ? "blue.600" : "gray.700"}
                  fontWeight={active ? "semibold" : "medium"}
                  _hover={{
                    bg: active ? "blue.50" : "gray.50",
                    color: "blue.600",
                    textDecoration: "none",
                  }}
                >
                  <NextLink href={link.href} onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </NextLink>
                </ChakraLink>
              );
            })}
            <Box pt="1">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <ChakraLink
                  asChild
                  display="inline-flex"
                  bg="blue.600"
                  color="white"
                  px="4"
                  py="2"
                  rounded="md"
                  fontWeight="medium"
                  _hover={{ bg: "blue.700", textDecoration: "none" }}
                >
                  <NextLink href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </NextLink>
                </ChakraLink>
              )}
            </Box>
          </VStack>
        )}
      </Container>
    </Box>
  );
}
