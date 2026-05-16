"use client";

import type { ReactNode } from "react";
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";

const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: "blue",
    },
    body: {
      minHeight: "100vh",
      bg: "transparent",
      color: "fg",
    },
  },
  theme: {
    tokens: {
      fonts: {
        body: { value: "var(--font-geist-sans)" },
        heading: { value: "var(--font-geist-sans)" },
        mono: { value: "var(--font-geist-mono)" },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

type ProviderProps = {
  children: ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
