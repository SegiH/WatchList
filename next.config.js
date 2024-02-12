/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const nextConfig = {
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
     async redirects() {
          return [
               {
                    source: '/api',
                    destination: '/api/DefaultRoute',
                    permanent: true,
               },
          ]
     },
     distDir: 'build',
}

module.exports = withPWA({
     disable: process.env.NODE_ENV === 'development',
     dest: "public",
     register: true,
     skipWaiting: true,
})(nextConfig);