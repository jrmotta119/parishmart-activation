/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@parishmart/ui', '@parishmart/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
    ],
  },
};

export default nextConfig;
