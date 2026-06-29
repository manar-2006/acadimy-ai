// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Proxy to Backend
      },
    ];
  },
  // Enable React strict mode and other modern features
  reactStrictMode: true,
// swcMinify removed
};

module.exports = nextConfig;
