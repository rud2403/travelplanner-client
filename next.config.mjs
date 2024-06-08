/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/tests/Docker-test',
                destination: 'http://15.165.4.45:8080/api/tests/Docker-test',
            },
        ];
    },
};

export default nextConfig;