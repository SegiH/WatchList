if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>n(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(a(...e),t)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"4893c8c7f6150ab3cc5c0e7d6a3ac9ce"},{url:"/_next/static/chunks/141-b433a941e5b2c019.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/23-bfba54fa834bca3e.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/283-74b5b822501f9551.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/398-3df1c7a65dc8aede.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/79-f2e364545f034e9f.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/821-52bcad2dfc6db310.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/833-3f6df55af2374149.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/92407c65-e289f66086b283c2.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/Admin/page-f5ab34696f62f595.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/Login/page-77ab1698a51587a0.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/Setup/page-55542f948b937367.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/WatchList/Dtl/page-ca5c8e4665fa13d4.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/WatchList/page-773899f9d63dc61a.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/WatchListItems/Dtl/page-9e316e8cbc621e6d.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/WatchListItems/page-3d5f2f34e3609c2d.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/WatchListStats/page-e794fe25ab00c5db.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/_not-found/page-88e5ec60d72eb81e.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/layout-86e19bacd345def7.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/app/page-4430ab01a878d0b9.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/fd9d1056-90960e0a7e77703c.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/framework-aec844d2ccbe7592.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/main-739a4ecfe8c09211.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/main-app-fdf14622ec11e60e.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-a5f3a4ec988271d8.js",revision:"nTO-cnsx739eVIW2G63pi"},{url:"/_next/static/css/4303d93efbaf0c9a.css",revision:"4303d93efbaf0c9a"},{url:"/_next/static/media/05a31a2ca4975f99-s.woff2",revision:"f1b44860c66554b91f3b1c81556f73ca"},{url:"/_next/static/media/513657b02c5c193f-s.woff2",revision:"c4eb7f37bc4206c901ab08601f21f0f2"},{url:"/_next/static/media/51ed15f9841b9f9d-s.woff2",revision:"bb9d99fb9bbc695be80777ca2c1c2bee"},{url:"/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",revision:"74c3556b9dad12fb76f84af53ba69410"},{url:"/_next/static/media/d6b16ce4a6175f26-s.woff2",revision:"dd930bafc6297347be3213f22cc53d3e"},{url:"/_next/static/media/ec159349637c90ad-s.woff2",revision:"0e89df9522084290e01e4127495fae99"},{url:"/_next/static/media/fd4db3eb5472fc27-s.woff2",revision:"71f3fcaf22131c3368d9ec28ef839831"},{url:"/_next/static/nTO-cnsx739eVIW2G63pi/_buildManifest.js",revision:"2ec694eb52ae4f523f265a46bae4d768"},{url:"/_next/static/nTO-cnsx739eVIW2G63pi/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/assets/WatchList.png",revision:"eae4181d8795599fae3b3d6518f215ca"},{url:"/assets/maskable.png",revision:"6426cb8ae3fbdac170f3f421547667bb"},{url:"/favicon.ico",revision:"b62555aa58719b34be9ff16c44104307"},{url:"/manifest.json",revision:"c28c88f537275a40aa189bca09a35be7"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
