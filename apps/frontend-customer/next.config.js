/**
 * - Next.js Config for Framely-Customer
 * - Enforces strict mode for dev hygiene
 * - Adds trailing slash for consistent routing
 * - Enables styled-components compiler support
 * - Configures external image hostnames for Next.js Image component
 * - Supports path-based routing for local Kubernetes (KIND)
 * - Cleanly disables basePath for production (AKS subdomain)
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * BASE PATH CONTROL (LOCAL vs PROD)
 *
 * Valid values:
 *  - undefined / empty  -> root path (production, subdomain-based)
 *  - /app               -> local customer app
 *
 * Invalid values (auto-ignored):
 *  - /
 */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const BASE_PATH =
  rawBasePath && rawBasePath !== '/'
    ? rawBasePath
    : undefined;

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  /**
   * Enable basePath & assetPrefix ONLY when BASE_PATH is defined
   * This avoids breaking root-path deployments
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
        protocol: 'https',
        hostname: 'framelystorage.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
    ],
  },

  transpilePackages: ['react-icons'],

  eslint: {
    ignoreDuringBuilds: true,
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },

  output: 'standalone',
};

module.exports = withBundleAnalyzer(nextConfig);
