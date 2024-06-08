/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://15.165.4.45:8080/api/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;
  