import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      "9010-firebase-studio-1747131474128.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev",
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/agiled/:path*', // Requests to your app at /api/agiled/...
        destination: 'https://api.agiled.app/api/v1/:path*', // Will be proxied to Agiled CRM
      },
    ];
  },
};

export default nextConfig;