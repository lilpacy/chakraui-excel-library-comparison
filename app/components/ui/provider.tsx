"use client";

import type { ReactNode } from "react";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { chakraConfig } from "@/app/design-system/theme";

const system = createSystem(defaultConfig, chakraConfig);

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
