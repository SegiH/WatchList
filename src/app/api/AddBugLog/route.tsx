import { NextRequest } from 'next/server';
const axios = require("axios");
const https = require('https');
import { isLoggedIn } from "../lib";

export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const bugLogName = searchParams.get("WLBugName");
     const addDate = searchParams.get("AddDate");
     const completedDate = searchParams.get("CompletedDate");
     const resolutionNotes = searchParams.get("ResolutionNotes");

     const addBugLogURL = `https://nodejs-shovav.replit.app/AddBugLog?WLBugName=${encodeURIComponent(String(bugLogName))}&AddDate=${addDate}${completedDate !== null ? `&CompletedDate=${completedDate}` : ``}${resolutionNotes !== null ? `&ResolutionNotes=${resolutionNotes}` : ``}`;

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