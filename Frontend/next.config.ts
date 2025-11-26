import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  turbopack: {
    // Ensure Turbopack uses this project as its root
    root: process.cwd(),
  },
};

export default nextConfig;
