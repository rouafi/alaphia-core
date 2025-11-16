import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    // Set root directory to workspace root to silence lockfile warning
    // This also helps Turbopack resolve workspace dependencies correctly
    root: path.resolve(__dirname, ".."),
  },
};

export default nextConfig;
