import type { NextConfig } from "next";

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // disable on Cloudflare workers
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    serverActions: {
      bodySizeLimit: "5mb", // for uploading profile image
    },
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
