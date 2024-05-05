import { NextRequest } from 'next/server';
const axios = require("axios");
const https = require('https');

export async function GET(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const queryTerm = searchParams.get("QueryTerm");
     const typeName = searchParams.get("Type");

     const recommendationsURL = `https://nodejs-shovav.replit.app/Recommendations?QueryTerm=${encodeURIComponent(String(queryTerm))}&Type=${typeName}`;

     const agent = new https.Agent({
          rejectUnauthorized: false
     });

     axios.get(recommendationsURL, { httpsAgent: agent })
          .then((response: any) => {
               return Response.json(["OK", response.data]);
          })
          .catch((err: Error) => {
               return Response.json(["ERROR", err.message]);
          });
}