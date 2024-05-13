/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const nextConfig = {
     experimental: {
          serverComponentsExternalPackages: ['config', 'sequelize'],
          missingSuspenseWithCSRBailout: false,
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
     distDir: 'build',
     transpilePackages: [
          "react-syntax-highlighter",
          "swagger-client",
          "swagger-ui-react",
     ],
}

module.exports = withPWA({
     disable: process.env.NODE_ENV === 'development',
     dest: "public",
     register: true,
     skipWaiting: true
})(nextConfig);