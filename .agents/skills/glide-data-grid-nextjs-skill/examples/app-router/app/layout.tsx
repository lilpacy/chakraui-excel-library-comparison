import type { Metadata } from "next";
import "@glideapps/glide-data-grid/dist/index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export const metadata: Metadata = {
  title: "Glide Data Grid Example",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <div
          id="portal"
          style={{ position: "fixed", left: 0, top: 0, zIndex: 9999 }}
        />
      </body>
    </html>
  );
}
