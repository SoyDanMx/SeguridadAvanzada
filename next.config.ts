import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.syscom.mx", pathname: "/**" },
      { protocol: "https", hostname: "developers.syscom.mx", pathname: "/**" },
    ],
  },
};
