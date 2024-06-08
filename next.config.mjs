/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      // 환경에 따라 백엔드 서버 주소를 다르게 설정
      const isDevelopment = process.env.NODE_ENV === 'development';
      const backendUrl = isDevelopment ? 'http://localhost:8080' : 'http://15.165.4.45:8080';
  
      return [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ];
    },
  };
  
  export default nextConfig;
  