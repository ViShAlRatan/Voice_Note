import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  // TypeScript ki errors ko build ke time ignore karega
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint ki errors ko build ke time ignore karega
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Jo 'N' logo hatane ke liye lagaya tha wo bhi yahin hai
  devIndicators: {
    appIsrStatus: false,
  },
 
};

export default nextConfig;
