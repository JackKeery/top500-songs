module.exports = {
  reactStrictMode: true,
  output: 'export',
  async rewrites() {
    // Proxy /api/* to the Kotlin backend during local dev.
    // Ignored by `next build` (static export), where the Kotlin server handles /api directly.
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};