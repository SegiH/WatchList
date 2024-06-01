import { NextRequest } from 'next/server';
const axios = require("axios");
const https = require('https');

export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const bugLogName = searchParams.get("WLBugName");
     const addDate = searchParams.get("AddDate");
     const completedDate = searchParams.get("CompletedDate");

     const addBugLogURL = `https://nodejs-shovav.replit.app/AddBugLog?WLBugName=${encodeURIComponent(String(bugLogName))}&AddDate=${addDate}${completedDate !== null ? `&CompletedDate=${completedDate}` : ``}`;

     const agent = new https.Agent({
          rejectUnauthorized: false
     });

     return axios.get(addBugLogURL, { httpsAgent: agent })
          .then((response: any) => {
               return Response.json(response.data);
          })
          .catch((err: Error) => {
               return Response.json(["ERROR", err.message]);
          });
}