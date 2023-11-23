/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
  modularizeImports: {
    '@phosphor-icons/react': {
      transform: '@phosphor-icons/react/dist/ssr{{member}}',
    },
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
}

module.exports = nextConfig
