// next.config.ts

import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

/**
 * BASE PATH CONTROL (LOCAL vs PROD)
 *
 * Valid values:
 *  - undefined / empty  -> root path (production, subdomain-based)
 *  - /admin             -> local admin app
 *
 * Invalid values (auto-ignored):
 *  - /
 */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const BASE_PATH =
  rawBasePath && rawBasePath !== "/"
    ? rawBasePath
    : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  /**
   * Enable basePath & assetPrefix ONLY when BASE_PATH is defined
   * This keeps production (subdomain) clean at root '/'
   */
  ...(BASE_PATH && {
    basePath: BASE_PATH,
    assetPrefix: BASE_PATH,
  }),

  compiler: {
    styledComponents: true,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framelystorage.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
    ],
  },

  transpilePackages: ["react-icons"],

  eslint: {
    ignoreDuringBuilds: true,
  },

  output: "standalone",
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
