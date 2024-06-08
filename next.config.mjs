/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: 'http://15.165.4.45/:path*', // 백엔드 서버 IP로 변경
            },
        ];
    },
};

export default nextConfig;
