import type { NextConfig } from "next";

const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://localhost:5000";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
            },
        ];
    },
};

export default nextConfig;
