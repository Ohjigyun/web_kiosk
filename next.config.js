/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  reactStrictMode: true,
  images: {
    domains: ["kiosk-menu-images.s3.us-east-1.amazonaws.com"]
  }
}

module.exports = nextConfig
