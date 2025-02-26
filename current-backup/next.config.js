/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Remove appDir as it's now enabled by default in Next.js 15
  },
  // Enable React strict mode for improved error handling
  reactStrictMode: true,
  // Ensure that modularized imports work correctly
  modularizeImports: {
    '@/components': {
      transform: '@/components/{{member}}',
    },
  },
  // Configure module resolution for CSS
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
