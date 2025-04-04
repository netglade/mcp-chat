import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: "export",
    basePath: process.env.NODE_ENV === 'production' ? '/mcp-chat' : '',
    images: {
        unoptimized: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
