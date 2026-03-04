import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDocker = process.env.DOCKER === 'true';
const backendBase = isDocker ? 'http://backend:3001' : 'http://localhost:3001';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendBase}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
