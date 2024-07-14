import { NextRequest } from 'next/server';
import { getBugLogModel, isLoggedIn } from '../lib';
const axios = require("axios");
const https = require('https');
const IBugLog = require("../../interfaces/IBugLog");

/**
 * @swagger
 * /api/GetBugLogs:
 *    put:
 *        tags:
 *          - BugLog
 *        summary: Get bug logs
 *        description: Get bug logs
 *        parameters:
 *           - name: GetActiveBugLogs
 *             in: query
 *             description: Get active/all bug logs
 *             required: true
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;
     const getActiveBugLogs = searchParams.get("GetActiveBugLogs");
     const getBugsLogURL = `https://nodejs-shovav.replit.app/GetBugLogs`;

     const agent = new https.Agent({
          rejectUnauthorized: false
     });

     return axios.get(getBugsLogURL, { httpsAgent: agent })
          .then(async (response: any) => {
               const data = await getBugLogModel(response.data[1])

               if (getActiveBugLogs === "true") {
                    const newFilteredBugLogs = data?.filter((bugLog: typeof IBugLog) => {
                         return typeof bugLog.CompletedDate === "undefined" || bugLog.CompletedDate === "";
                    });

                    return Response.json(["OK", newFilteredBugLogs]);
               } else {
                    return Response.json(["OK", data]);
               }
          })
          .catch((err: Error) => {
               return Response.json(["ERROR", err.message]);
          });
}