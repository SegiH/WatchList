if(!self.define){let s,e={};const t=(t,a)=>(t=new URL(t+".js",a).href,e[t]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=t,s.onload=e,document.head.appendChild(s)}else s=t,importScripts(t),e()})).then((()=>{let s=e[t];if(!s)throw new Error(`Module ${t} didn’t register its module`);return s})));self.define=(a,n)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let c={};const u=s=>t(s,i),r={module:{uri:i},exports:c,require:u};e[i]=Promise.all(a.map((s=>r[s]||u(s)))).then((s=>(n(...s),c)))}}define(["./workbox-4754cb34"],(function(s){"use strict";importScripts(),self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"/404.jpg",revision:"0642c2085caacf45b22151e740707ff2"},{url:"/_next/app-build-manifest.json",revision:"4a2e7dce146d095b5d6c7ecbdf47b3ea"},{url:"/_next/static/MNZCXxZSsqnHEA0u5IAqq/_buildManifest.js",revision:"7b11221027b208e27c58453a21c0444b"},{url:"/_next/static/MNZCXxZSsqnHEA0u5IAqq/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1517-57b527523e91a370.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/2415-881526a42002740f.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/2670-8f37e7cd21582368.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/2680-ebe78bc97b1fb045.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/4116-58038fe21dddfe16.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/4781-74cad6dce1d38f20.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/4bd1b696-3f0bd84cf8e1ece4.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/5130-2f0f194018980775.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/5565-10422575dfa75d1c.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/6860-82750ae756c9fcc0.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/7975-d93487d0fc2ff052.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/8621-4ace2c087abe1aec.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/9334-b2d7a46906a0e57c.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/404/page-a237335771658a4d.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/Admin/page-8caec26f4138ad87.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/BugLog/page-d1f467816d22b145.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/Items/Dtl/page-c5b4b3b9720e7a3e.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/Items/page-73b60879528ce854.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/Login/page-84f5a9a25c34b654.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/Setup/page-22a84779d2465d42.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/WatchList/Dtl/page-ce161f7028ae0898.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/WatchList/page-28e35e11065a4e04.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/WatchListStats/page-c668d52a6abcd92a.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/_not-found/page-957405fc8adb3923.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/AddBugLog/route-764d5640d707d635.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/AddUser/route-f876e3a83ef115ea.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/AddWatchList/route-3964a6c2631ba7b8.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/AddWatchListItem/route-b87724daab852d65.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/AddWatchListSource/route-e41622915f01926d.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/AddWatchListType/route-ac2851757620599f.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/DeleteBugLog/route-c674b48b1e7c56b0.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/DeleteWatchListSource/route-b8480e8190687ff9.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/DeleteWatchListType/route-f862b135d1909f61.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetBugLogs/route-2c19eef64f38a0cb.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetIMDBDetails/route-4a2209d562725e8d.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetOptions/route-b084de418909a749.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetUsers/route-8b36390481023a4f.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchList/route-a7197d8dfefb1c3d.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListDtl/route-2200e202775f2b5c.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListItemDtl/route-0a49634858eb6fb1.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListItems/route-7b26d1666717a467.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListMovieCountStats/route-22d7bf66f6a0fda8.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListMovieTop10Stats/route-b6dc749294db71b4.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListSourceStats/route-e96525ac33f86465.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListSources/route-806b2894d14aba02.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListTVSeasonsCountStats/route-a98f3d36769d6fcb.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListTVTop10Stats/route-c736f9126d92214c.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListTVTotalCountStats/route-b5899a6f62acd01a.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListTopRatedStats/route-b7cb2d92241a37fa.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListTypes/route-ea6686bb3364aae9.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/GetWatchListWeeklyBreakdown/route-3846a8829049fa68.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/IsIMDBSearchEnabled/route-5877b814387cb966.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/IsLoggedIn/route-f9496a207e52e3e0.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/IsRecommendationsEnabled/route-63ce1c2441722ce5.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/Login/route-779c0ad1823bc439.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/Recommendations/route-3a1abb6dc37cb893.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/SearchIMDB/route-d0f2dc9ff5fedf93.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/Setup/route-60fbf3c25d22e990.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/SignOut/route-7238a1c14823ab0d.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/UpdateBugLog/route-7b9ad27cb07a1f26.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/UpdateMissingPosters/route-10bba1e7aeb7cbbb.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/UpdateOptions/route-fd562d97d1cbb198.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/UpdateUser/route-365c858d0e84c2e9.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/UpdateWatchList/route-8fabed096a9bd3a0.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/UpdateWatchListItem/route-bd1f6edfe9f795a0.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/UpdateWatchListSource/route-db0e333f9d672ecf.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/api/UpdateWatchListType/route-6f5df269658c7bbb.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/layout-5efa4dfd49095ff1.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/app/page-c8c3132261e11c2e.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/framework-1ec85e83ffeb8a74.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/main-7987d1685088ebcb.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/main-app-c42fb29e3171d898.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/pages/_app-5f03510007f8ee45.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-e1c7083ded6d6be9.js",revision:"MNZCXxZSsqnHEA0u5IAqq"},{url:"/_next/static/css/05259bd0a9b6b8ba.css",revision:"05259bd0a9b6b8ba"},{url:"/_next/static/css/1788ca8c347aa025.css",revision:"1788ca8c347aa025"},{url:"/_next/static/css/86bd603c5085a989.css",revision:"86bd603c5085a989"},{url:"/_next/static/css/b05575c41bad25e5.css",revision:"b05575c41bad25e5"},{url:"/_next/static/css/c3e638c44d6ed2dd.css",revision:"c3e638c44d6ed2dd"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/assets/WatchList.png",revision:"eae4181d8795599fae3b3d6518f215ca"},{url:"/assets/maskable.png",revision:"6426cb8ae3fbdac170f3f421547667bb"},{url:"/build-info.json",revision:"4c4ca88b67ec2abb5481bc7d7388bb42"},{url:"/favicon.ico",revision:"b62555aa58719b34be9ff16c44104307"},{url:"/manifest.json",revision:"c28c88f537275a40aa189bca09a35be7"}],{ignoreURLParametersMatching:[]}),s.cleanupOutdatedCaches(),s.registerRoute("/",new s.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:s,response:e,event:t,state:a})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new s.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new s.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new s.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/image\?url=.+$/i,new s.StaleWhileRevalidate({cacheName:"next-image",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp3|wav|ogg)$/i,new s.CacheFirst({cacheName:"static-audio-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp4)$/i,new s.CacheFirst({cacheName:"static-video-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:js)$/i,new s.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:css|less)$/i,new s.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new s.StaleWhileRevalidate({cacheName:"next-data",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:json|xml|csv)$/i,new s.NetworkFirst({cacheName:"static-data-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;const e=s.pathname;return!e.startsWith("/api/auth/")&&!!e.startsWith("/api/")}),new s.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;return!s.pathname.startsWith("/api/")}),new s.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>!(self.origin===s.origin)),new s.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
