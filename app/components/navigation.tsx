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
import { designSystemClassNames } from "@/app/design-system/patterns";

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
    <Box as="nav" className={designSystemClassNames.surface} borderBottomWidth="1px" borderBottomColor="border">
      <Container maxW="6xl" px={{ base: 4, md: 6 }}>
        <HStack minH="16" justify="space-between">
          <ChakraLink
            asChild
            color="fg.brand"
            fontSize="xl"
            fontWeight="bold"
            _hover={{ color: "fg", textDecoration: "none" }}
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
                  borderColor={active ? "brand.solid" : "transparent"}
                  color={active ? "fg.brand" : "fg.muted"}
                  fontWeight={active ? "semibold" : "medium"}
                  transition="colors 0.2s ease, border-color 0.2s ease"
                  _hover={{
                    color: "fg.brand",
                    borderColor: active ? "brand.solid" : "brand.muted",
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
                colorPalette="brand"
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
            )}
          </HStack>

          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            display={{ base: "inline-flex", md: "none" }}
            variant="outline"
            colorPalette="brand"
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
                  bg={active ? "brand.subtle" : "transparent"}
                  color={active ? "fg.brand" : "fg.muted"}
                  fontWeight={active ? "semibold" : "medium"}
                  _hover={{
                    bg: active ? "brand.subtle" : "bg.subtle",
                    color: "fg.brand",
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
                  bg="brand.solid"
                  color="brand.contrast"
                  px="4"
                  py="2"
                  rounded="md"
                  fontWeight="medium"
                  _hover={{ bg: "brand.solid", opacity: "0.92", textDecoration: "none" }}
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
