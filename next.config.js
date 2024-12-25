/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const nextConfig = {
     serverExternalPackages: ['config'],
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
                    destination: '/',
                    permanent: true,
               },
          ]
     },
     transpilePackages: [
          "react-syntax-highlighter"
     ],
}

module.exports = withPWA({
     disable: process.env.NODE_ENV === 'development',
     dest: "public",
     register: true,
     skipWaiting: true
})(nextConfig);