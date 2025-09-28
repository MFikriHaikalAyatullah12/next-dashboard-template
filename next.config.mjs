/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.app.github.dev', 'shiny-space-journey-x5wr575v7wg5fpgjj-3000.app.github.dev']
    }
  }
};

export default nextConfig;
