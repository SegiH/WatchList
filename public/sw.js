if(!self.define){let c,e={};const s=(s,a)=>(s=new URL(s+".js",a).href,e[s]||new Promise((e=>{if("document"in self){const c=document.createElement("script");c.src=s,c.onload=e,document.head.appendChild(c)}else c=s,importScripts(s),e()})).then((()=>{let c=e[s];if(!c)throw new Error(`Module ${s} didn’t register its module`);return c})));self.define=(a,t)=>{const i=c||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let n={};const u=c=>s(c,i),r={module:{uri:i},exports:n,require:u};e[i]=Promise.all(a.map((c=>r[c]||u(c)))).then((c=>(t(...c),n)))}}define(["./workbox-4754cb34"],(function(c){"use strict";importScripts(),self.skipWaiting(),c.clientsClaim(),c.precacheAndRoute([{url:"/404.jpg",revision:"0642c2085caacf45b22151e740707ff2"},{url:"/_next/app-build-manifest.json",revision:"fcf5975317e8f070a9bd228812f05eb7"},{url:"/_next/static/5hmT39EVucacz99UOUAcF/_buildManifest.js",revision:"b02eeb7558bc55c319d984a511072a29"},{url:"/_next/static/5hmT39EVucacz99UOUAcF/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1517-c178b8e48b17808e.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/2670-2a9bf13f80e9ef6a.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/4781-9205eb46e200e57c.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/4bd1b696-3f0bd84cf8e1ece4.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/5130-2f0f194018980775.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/5565-10422575dfa75d1c.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/6860-f8fd0cee546b00c8.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/6948-3bb65bc039cf2f7a.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/7975-9a3df069acc40af6.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/8621-11360d8744a08c26.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/879-141666a848977ab4.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/895-8c6c91cad58fd457.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/9334-9ae07dd33bfe376d.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/404/page-77d0ca3011fa325c.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/Admin/page-847e7831c76899f1.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/BugLogs/page-2e923c24d8ba118b.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/Items/Dtl/page-17f261ecc49bde93.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/Items/page-75417064ba93f72c.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/Login/page-c10f20ef3492e99f.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/Setup/page-fd5b98a0bc9454d3.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/Stats/page-e54b1671faa74b69.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/WatchList/Dtl/page-f99f20f200097e03.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/WatchList/page-0ef9c8b2d07bd549.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/_not-found/page-957405fc8adb3923.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/AddBugLog/route-764d5640d707d635.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/AddUser/route-f876e3a83ef115ea.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/AddWatchList/route-3964a6c2631ba7b8.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/AddWatchListItem/route-b87724daab852d65.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/AddWatchListSource/route-e41622915f01926d.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/AddWatchListType/route-ac2851757620599f.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/DeleteBugLog/route-c674b48b1e7c56b0.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/DeleteWatchListSource/route-b8480e8190687ff9.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/DeleteWatchListType/route-f862b135d1909f61.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetBugLogs/route-2c19eef64f38a0cb.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetIMDBDetails/route-4a2209d562725e8d.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetOptions/route-b084de418909a749.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetUsers/route-8b36390481023a4f.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchList/route-a7197d8dfefb1c3d.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListDtl/route-2200e202775f2b5c.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListItemDtl/route-0a49634858eb6fb1.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListItems/route-7b26d1666717a467.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListMovieCountStats/route-22d7bf66f6a0fda8.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListMovieTop10Stats/route-b6dc749294db71b4.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListSourceStats/route-e96525ac33f86465.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListSources/route-806b2894d14aba02.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListTVSeasonsCountStats/route-a98f3d36769d6fcb.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListTVTop10Stats/route-c736f9126d92214c.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListTVTotalCountStats/route-b5899a6f62acd01a.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListTopRatedStats/route-b7cb2d92241a37fa.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListTypes/route-ea6686bb3364aae9.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/GetWatchListWeeklyBreakdown/route-3846a8829049fa68.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/IsIMDBSearchEnabled/route-5877b814387cb966.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/IsLoggedIn/route-f9496a207e52e3e0.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/IsRecommendationsEnabled/route-63ce1c2441722ce5.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/Login/route-779c0ad1823bc439.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/Recommendations/route-3a1abb6dc37cb893.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/SearchIMDB/route-d0f2dc9ff5fedf93.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/Setup/route-60fbf3c25d22e990.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/SignOut/route-7238a1c14823ab0d.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/UpdateBugLog/route-7b9ad27cb07a1f26.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/UpdateMissingPosters/route-10bba1e7aeb7cbbb.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/UpdateOptions/route-fd562d97d1cbb198.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/UpdateUser/route-365c858d0e84c2e9.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/UpdateWatchList/route-8fabed096a9bd3a0.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/UpdateWatchListItem/route-bd1f6edfe9f795a0.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/UpdateWatchListSource/route-db0e333f9d672ecf.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/api/UpdateWatchListType/route-6f5df269658c7bbb.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/layout-8628270dcad12641.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/app/page-94e74d67ebfd482f.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/framework-1ec85e83ffeb8a74.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/main-app-e1307c6b97a1370a.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/main-fb8b463a17019c14.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/pages/_app-5f03510007f8ee45.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-bb1d58db60b3902f.js",revision:"5hmT39EVucacz99UOUAcF"},{url:"/_next/static/css/86bd603c5085a989.css",revision:"86bd603c5085a989"},{url:"/_next/static/css/86e56b900a754520.css",revision:"86e56b900a754520"},{url:"/_next/static/css/c3e638c44d6ed2dd.css",revision:"c3e638c44d6ed2dd"},{url:"/_next/static/css/e93f0bbd9141dcb1.css",revision:"e93f0bbd9141dcb1"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/assets/WatchList.png",revision:"eae4181d8795599fae3b3d6518f215ca"},{url:"/assets/maskable.png",revision:"6426cb8ae3fbdac170f3f421547667bb"},{url:"/build-info.json",revision:"a179c18f0656ef649d3225c7b5e10526"},{url:"/favicon.ico",revision:"b62555aa58719b34be9ff16c44104307"},{url:"/manifest.json",revision:"c28c88f537275a40aa189bca09a35be7"}],{ignoreURLParametersMatching:[]}),c.cleanupOutdatedCaches(),c.registerRoute("/",new c.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:c,response:e,event:s,state:a})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),c.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new c.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new c.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),c.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new c.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new c.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),c.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new c.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new c.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),c.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new c.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new c.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),c.registerRoute(/\/_next\/image\?url=.+$/i,new c.StaleWhileRevalidate({cacheName:"next-image",plugins:[new c.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),c.registerRoute(/\.(?:mp3|wav|ogg)$/i,new c.CacheFirst({cacheName:"static-audio-assets",plugins:[new c.RangeRequestsPlugin,new c.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),c.registerRoute(/\.(?:mp4)$/i,new c.CacheFirst({cacheName:"static-video-assets",plugins:[new c.RangeRequestsPlugin,new c.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),c.registerRoute(/\.(?:js)$/i,new c.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new c.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),c.registerRoute(/\.(?:css|less)$/i,new c.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new c.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),c.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new c.StaleWhileRevalidate({cacheName:"next-data",plugins:[new c.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),c.registerRoute(/\.(?:json|xml|csv)$/i,new c.NetworkFirst({cacheName:"static-data-assets",plugins:[new c.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),c.registerRoute((({url:c})=>{if(!(self.origin===c.origin))return!1;const e=c.pathname;return!e.startsWith("/api/auth/")&&!!e.startsWith("/api/")}),new c.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new c.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),c.registerRoute((({url:c})=>{if(!(self.origin===c.origin))return!1;return!c.pathname.startsWith("/api/")}),new c.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new c.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),c.registerRoute((({url:c})=>!(self.origin===c.origin)),new c.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new c.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
