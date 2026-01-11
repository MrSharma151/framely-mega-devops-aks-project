/**
 * - Next.js Config for Framely-Customer
 * - Enforces strict mode for dev hygiene
 * - Adds trailing slash for consistent routing
 * - Enables styled-components compiler support
 * - Configures external image hostnames for Next.js Image component
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
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
        hostname: 'cdn-icons-png.flaticon.com', // Flaticon icons
      },
    ],
  },
  transpilePackages: ['react-icons'],
  eslint: {
    // Disables ESLint during production builds
    // This will ignore ESLint errors during the build process
    ignoreDuringBuilds: true,
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  output: 'standalone', // Enables standalone output for easier deployment
};

module.exports = withBundleAnalyzer(nextConfig);