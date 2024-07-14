import { NextRequest } from 'next/server';
import { isLoggedIn } from '../lib';

/**
 * @swagger
 * /api/UpdateBugLog:
 *    put:
 *        tags:
 *          - BugLog
 *        summary: Update a bug log
 *        description: Update a bug log
 *        parameters:
 *           - name: WLBugID
 *             in: query
 *             description: ID of the bug
 *             required: true
 *             schema:
 *                  type: number
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
    if (!isLoggedIn(request)) {
        return Response.json(["ERROR", "Error. Not signed in"]);
    }

    const searchParams = request.nextUrl.searchParams;

    const bugLogID = searchParams.get("WLBugID");
    const bugLogName = searchParams.get("WLBugName");
    const addDate = searchParams.get("AddDate");
    const completedDate = searchParams.get("CompletedDate");
    const resolutionNotes = searchParams.get("ResolutionNotes");

    if (bugLogID === null) {
        return Response.json({ "ERROR": "Bug log ID is not set" });
    }

    let params = "";

    if (bugLogName !== null) {
        params += "&WLBugName=" + encodeURIComponent(bugLogName);
    }

    if (addDate !== null) {
        params += "&AddDate=" + encodeURIComponent(addDate);
    }

    if (completedDate !== null) {
        params += "&CompletedDate=" + encodeURIComponent(completedDate);
    }

    if (resolutionNotes !== null) {
        params += "&ResolutionNotes=" + encodeURIComponent(resolutionNotes);
    }

    if (params === "") {
        return Response.json(["ERROR", `No parameters were passed`]);
    }

    params = "?WLBugID=" + bugLogID + params;

    const axios = require("axios");
    const https = require('https');

    const updateBugsLogURL = `https://nodejs-shovav.replit.app/UpdateBugLog`;

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    return axios.get(updateBugsLogURL + params, { httpsAgent: agent })
        .then(() => {
            return Response.json(["OK"]);
        })
        .catch((err: Error) => {
            return Response.json(["ERROR", err.message]);
        });
}