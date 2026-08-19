import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Set in CI for GitHub Pages project sites, e.g. /my-repo */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  outputFileTracingRoot: path.join(__dirname),
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
