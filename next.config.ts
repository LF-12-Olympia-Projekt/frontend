import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ============================================================
     Olympia 2026 – Next.js Configuration
     Based on: Entwickler-Spezifikation §8.2, §9, §11
     ============================================================ */

  // Security Headers (Spec §8.2)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' cdn.olympia2026.example data: blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' http://localhost:5184 http://localhost:5000",
            ].join("; "),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // German route aliases (Spec §5)
  async rewrites() {
    const locales = ["de", "de-BA", "fr-FR", "en-GB"];
    const rewrites: Array<{ source: string; destination: string }> = [];

    for (const locale of locales) {
      rewrites.push(
        {
          source: `/${locale}/ergebnisse`,
          destination: `/${locale}/results`,
        },
        {
          source: `/${locale}/ergebnisse/:sport`,
          destination: `/${locale}/sports/:sport/results`,
        },
        {
          source: `/${locale}/medaillen`,
          destination: `/${locale}/medals`,
        },
        {
          source: `/${locale}/land/:iso`,
          destination: `/${locale}/nations/:iso`,
        },
        {
          source: `/${locale}/athlet/:id`,
          destination: `/${locale}/athletes/:id`,
        },
        {
          source: `/${locale}/kampfrichter`,
          destination: `/${locale}/judge/dashboard`,
        },
        {
          source: `/${locale}/kampfrichter/:path*`,
          destination: `/${locale}/judge/:path*`,
        }
      );
    }

    return rewrites;
  },

  // Image optimization (Spec §9.1)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.olympia2026.example",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
