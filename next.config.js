/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Enable compression
  compress: true,
  // Generate sitemap at build time
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  // SEO-friendly trailing slashes
  trailingSlash: false,
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Power efficient
  poweredByHeader: false,
};

module.exports = nextConfig;