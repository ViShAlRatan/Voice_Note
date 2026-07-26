import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false, // Ye 'N' logo ko gayab kar dega
    buildActivity: false, // (Optional) Compiling wale popup ko bhi hatane ke liye
  },
};

export default nextConfig;
