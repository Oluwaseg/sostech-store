import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // optional, good practice
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ⚡ accepts all hostnames
      },
    ],
  },
};

export default nextConfig;
