import { NextRequest } from 'next/server';
const axios = require("axios");
const https = require('https');
import { isLoggedIn } from "../lib";

/**
 * @swagger
 * /api/AddBugLog:
 *    put:
 *        tags:
 *          - BugLog
 *        summary: Add a bug log
 *        description: Add a bug log
 *        parameters:
 *           - name: WLBugName
 *             in: query
 *             description: Description of the bug
 *             required: true
 *             schema:
 *                  type: string
 *           - name: AddDate
 *             in: query
 *             description: Date the bug log was added
 *             required: true
 *             schema:
 *                  type: string
 *           - name: CompletedDate
 *             in: query
 *             description: Date the bug was fixed
 *             required: true
 *             schema:
 *                  type: string
 *           - name: ResolutionNotes
 *             in: query
 *             description: Notes on what was done to fix the problem
 *             required: false
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
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