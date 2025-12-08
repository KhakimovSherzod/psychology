import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iframe.mediadelivery.net',
      },
      {
        protocol: 'https',
        hostname: 'vz-645cd866-41b.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: '/api/image-proxy',
      },
    ],
  },
}

export default nextConfig
