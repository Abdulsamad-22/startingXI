import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    "@remotion/cli",
  ],

  allowedDevOrigins: ["gumdrop-viability-broadband.ngrok-free.dev"],
};

export default nextConfig;
