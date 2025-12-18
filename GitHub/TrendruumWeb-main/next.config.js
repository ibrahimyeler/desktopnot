/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence workspace root inference warning by pinning the tracing root
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.trendruum.com',
      },
      {
        protocol: 'https',
        hostname: 'ge',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'tr-126.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    // Image optimization settings
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Device sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Image sizes
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: false, // Security
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Next.js 16 için gerekli quality ayarları
    qualities: [75, 80, 85, 90, 95, 100]
  },

  

  // Loglama seviyesini azalt
  logging: {
    level: 'error', // Sadece hataları göster
    debug: false, // Debug loglarını kapat
  },

  // Typescript hata kontrolünü devre dışı bırak
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint kontrolünü devre dışı bırak
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api.trendruum.com/api/v1/:path*',
      },
      // Add a more specific rewrite for categories
      {
        source: '/api/v1/categories/:slug*',
        destination: 'https://api.trendruum.com/api/v1/categories/:slug*',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://trendruum.com', 
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, Authorization',
          },
        ],
      },
    ];
  },

  // Prefetch'i global olarak devre dışı bırak
  experimental: {
    // Next.js'in otomatik prefetch'ini devre dışı bırak
    optimizePackageImports: ['@heroicons/react'],
  },

 
};

module.exports = nextConfig;
