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
  // 🔒 Security Headers Added (Checklist #15 & #16)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;