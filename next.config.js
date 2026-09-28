/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  // The homepage is a single static file (public/home.html) so its design, calculator
  // and form stay exactly as approved. beforeFiles lets it take over from app/page.js.
  async rewrites() {
    return { beforeFiles: [{ source: '/', destination: '/home.html' }] }
  },
}
module.exports = nextConfig
