import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  allowedDevOrigins: ["192.168.1.39"],
  async rewrites() {
    return [
      { source: "/hub/p.js", destination: "https://portus.sh/p.js" },
      { source: "/hub/e", destination: "https://portus.sh/api/e" },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
