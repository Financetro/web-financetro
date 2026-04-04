import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        destination: '/api/sw',
      },
    ];
  },
};

export default nextConfig;
