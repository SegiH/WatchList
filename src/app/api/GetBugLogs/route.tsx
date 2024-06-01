import { getBugLogModel } from '../lib';
const axios = require("axios");
const https = require('https');

export async function GET() {
     const getBugsLogURL = `https://nodejs-shovav.replit.app/GetBugLogs`;

     const agent = new https.Agent({
          rejectUnauthorized: false
     });

     return axios.get(getBugsLogURL, { httpsAgent: agent })
          .then(async (response: any) => {
               const data = await getBugLogModel(response.data[1])

               return Response.json(["OK", data]);
          })
          .catch((err: Error) => {
               return Response.json(["ERROR", err.message]);
          });
}