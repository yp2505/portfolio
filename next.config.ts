import type { NextConfig } from "next";

function getOsjsOrigin() {
  const value = process.env.NEXT_PUBLIC_OSJS_ORIGIN?.trim()

  if (!value) return undefined

  try {
    const url = new URL(value)
    const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1'

    // A deployed visitor cannot access the developer's computer.
    if (!isHttp || (process.env.NODE_ENV === 'production' && isLocalhost)) return undefined

    return url.origin
  } catch {
    return undefined
  }
}

const OSJS_ORIGIN = getOsjsOrigin()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "**.wikimedia.org",
      },
    ],
  },

  // ── CSP headers: allow the OS.js iframe to load ─────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow the OS.js server to be framed by this page
              `frame-src 'self'${OSJS_ORIGIN ? ` ${OSJS_ORIGIN}` : ''}`,
              // Scripts need unsafe-eval for OS.js Webpack bundle + Next.js
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://generativelanguage.googleapis.com https://api.notion.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
