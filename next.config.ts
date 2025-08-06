import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Allow Supabase storage domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lglkgkbibwcwcmkbulub.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Compression
  compress: true,
  // Bundle optimization
  experimental: {
    optimizeCss: true,
  },
  // Reduce bundle size
  swcMinify: true,
  // Enable gzip compression
  poweredByHeader: false,
};

export default nextConfig;
