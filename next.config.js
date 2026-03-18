/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
     output: "standalone",
     outputFileTracingRoot: path.join(__dirname),
     devIndicators: false,
     turbopack: {
          root: path.join(__dirname, '..'),
     },
     images: {
          remotePatterns: [
               {
                    protocol: "http",
                    hostname: "**",
               },
               {
                    protocol: "https",
                    hostname: "**",
               },
          ],
     },
     async headers() {
          return [
               {
                    source: '/(.*)',
                    headers: [
                         {
                              key: 'X-Content-Type-Options',
                              value: 'nosniff',
                         },
                         {
                              key: 'X-Frame-Options',
                              value: 'DENY',
                         },
                         {
                              key: 'Referrer-Policy',
                              value: 'strict-origin-when-cross-origin',
                         },
                    ],
               },
               {
                    source: '/sw.js',
                    headers: [
                         {
                              key: 'Content-Type',
                              value: 'application/javascript; charset=utf-8',
                         },
                         {
                              key: 'Cache-Control',
                              value: 'no-cache, no-store, must-revalidate',
                         },
                         {
                              key: 'Content-Security-Policy',
                              value: "default-src 'self'; script-src 'self'",
                         },
                    ],
               },
          ]
     },
     async redirects() {
          return [
               {
                    source: '/api',
                    destination: '/',
                    permanent: true,
               },
          ]
     },
          transpilePackages: [
               "react-syntax-highlighter"
          ],
}

module.exports = (nextConfig);