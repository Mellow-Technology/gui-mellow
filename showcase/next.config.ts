import type { NextConfig } from "next";

// Served from a subpath on GitHub Pages (/gui-mellow); the deploy workflow
// sets this from the Pages configuration
const basePath = process.env.PAGES_BASE_PATH ?? "";

const config: NextConfig = {
  // Proves the components export statically
  output: "export",
  basePath,
  // For paths next/link can't prefix, such as <img> and background images
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default config;
