import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
  return [
    { source: '/hub/p.js', destination: 'https://portus.sh/p.js' },
    { source: '/hub/e', destination: 'https://portus.sh/api/e' },
  ]
},

  allowedDevOrigins: ['192.168.1.39'],
};

export default nextConfig;
