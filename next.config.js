/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  env: {
    // keep placeholders here too, but .env should be used
  }
};

module.exports = nextConfig;
