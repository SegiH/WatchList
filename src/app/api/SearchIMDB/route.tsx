import { NextRequest } from 'next/server';
const axios = require("axios");
const https = require('https');

export async function GET(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const searchCount = searchParams.get("SearchCount");
     const searchTerm = searchParams.get("SearchTerm");

     if (searchTerm === null) {
          return Response.json(["ERROR", "Search term not provided 1"]);
     } else {
          const searchURL = `https://nodejs-shovav.replit.app/SearchIMDB?SearchTerm=${encodeURIComponent(String(searchTerm))}&SearchCount=${searchCount}`;

          const agent = new https.Agent({
               rejectUnauthorized: false
          });
     
          axios.get(searchURL, { httpsAgent: agent })
               .then((response: any) => {
                    return Response.json(response.data);
               })
               .catch((err: Error) => {
                    return Response.json(["ERROR", err.message]);
               });
     }
}