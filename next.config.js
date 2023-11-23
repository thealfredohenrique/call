/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  /* modularizeImports: {
    '@phosphor-icons/react': {
      transform: '@phosphor-icons/react/{{member}}',
    },
  }, */
}

module.exports = nextConfig
