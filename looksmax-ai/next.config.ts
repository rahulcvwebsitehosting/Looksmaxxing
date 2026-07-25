import type { NextConfig } from "next";
import { join } from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@freeharmony/engine", "@freeharmony/advice"],
  turbopack: {
    root: join(__dirname, ".."),
  },
};

export default nextConfig;
