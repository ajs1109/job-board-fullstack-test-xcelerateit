import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // This skips ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
