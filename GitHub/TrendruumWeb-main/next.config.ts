import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./"),
      "@/components": path.resolve(__dirname, "./app/components"),
      "@/hooks": path.resolve(__dirname, "./app/hooks")
    };
    return config;
  }
};

export default nextConfig;
