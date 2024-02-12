import { NextResponse } from "next/server";
const configFile = require("config");

export function middleware() {
     // retrieve the current response
     const res = NextResponse.next()

     // add the CORS headers to the response
     res.headers.append('Access-Control-Allow-Credentials', "true")
     res.headers.append('Access-Control-Allow-Origin', configFile.has(`CORS`) ? configFile.get(`CORS`) : []) // replace this your actual origin
     res.headers.append('Access-Control-Allow-Methods', 'GET,POST,PUT')
     res.headers.append(
         'Access-Control-Allow-Headers',
         'wl_username,wl_password,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
     )

     return res
}

// specify the path regex to apply the middleware to
export const config = {
     matcher: '/api/:path*',
}