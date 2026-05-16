import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Box } from "@chakra-ui/react";
import "@glideapps/glide-data-grid/dist/index.css";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import "react-datasheet-grid/dist/style.css";
import "./styles/globals.scss";
import "./components/tables/ag-grid/styles.scss";
import "./components/tables/react-datasheet-grid/styles.scss";
import "./components/tables/glide-data-grid/styles.scss";
import "./components/tables/handsontable/styles.scss";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Provider } from "./components/ui/provider";
import Navigation from "./components/navigation";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ChakraUI Excel Library Comparison",
    template: "%s | ChakraUI Excel Library Comparison",
  },
  description: "Compare Chakra UI spreadsheet and data grid libraries on a shared dataset.",
  keywords: ["chakra ui", "excel", "data grid", "spreadsheet", "comparison"],
  authors: [{ name: "ChakraUI Excel Library Comparison" }],
  creator: "ChakraUI Excel Library Comparison",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ChakraUI Excel Library Comparison",
    title: "ChakraUI Excel Library Comparison",
    description: "Compare Chakra UI spreadsheet and data grid libraries on a shared dataset.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChakraUI Excel Library Comparison",
    description: "Compare Chakra UI spreadsheet and data grid libraries on a shared dataset.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Provider>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <Box minH="100vh" display="flex" flexDirection="column">
            <Navigation />
            <Box as="main" flex="1">
              {children}
            </Box>
            <Footer />
          </Box>
        </Provider>
        <div id="portal" style={{ position: "fixed", left: 0, top: 0, zIndex: 9999 }} />
      </body>
    </html>
  );
}
