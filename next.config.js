/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://webtechcnu.netlify.app'
      }
    ]
  }
}

module.exports = nextConfig
