/** @type {import('next').NextConfig} */
const path = require('path')
const withPWA = require("next-pwa");

const nextConfig = {
     output: "standalone",
     /*outputFileTracingRoot: path.join(__dirname),*/
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