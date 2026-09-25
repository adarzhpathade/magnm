import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-8abee449136941f5b0a1cd2c014534e9.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
