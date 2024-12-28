import { NextRequest } from 'next/server';
import { execUpdateDelete, isLoggedIn } from '../lib';

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

    let SQL = "UPDATE BugLogs SET ";
    let params: string[] = [];

    if (bugLogName !== null) {
        SQL += "WLBugName=?";
        params.push(bugLogName); // Client already encodes this. Do not encode it again or it will cause issues!
    }

    if (addDate !== null) {
        SQL += SQL != "" ? "," : "";
        SQL += "AddDate=?";
        params.push(encodeURIComponent(addDate));
    }

    if (completedDate !== null) {
        SQL += SQL != "" ? "," : "";
        SQL += "CompletedDate=?";
        params.push(encodeURIComponent(completedDate));
    }

    if (resolutionNotes !== null) {
        SQL += SQL != "" ? "," : "";
        SQL += "ResolutionNotes=?";
        params.push(resolutionNotes); // Client already encodes this. Do not encode it again or it will cause issues!
    }

    if (params.length === 0) {
        return Response.json(["ERROR", `No parameters were passed`]);
    }

    SQL += " WHERE WLBugID=?";
    params.push(bugLogID);

    await execUpdateDelete(SQL, params);

    return Response.json(["OK"]);
}