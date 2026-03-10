import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configure image domains if using external images
    // domains: ['example.com'],
    // Enable modern formats
    formats: ["image/webp", "image/avif"],
    // Optimize images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Fix Turbopack root issue
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
