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
 *           - name: BugLogId
 *             in: query
 *             description: ID of the bug
 *             required: true
 *             schema:
 *                  type: number
 *           - name: BugName
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

    const BugLogId = searchParams.get("BugLogId");
    const bugLogName = searchParams.get("BugName");
    const addDate = searchParams.get("AddDate");
    const completedDate = searchParams.get("CompletedDate");
    const resolutionNotes = searchParams.get("ResolutionNotes");

    if (BugLogId === null) {
        return Response.json({ "ERROR": "Bug log ID is not set" });
    }

    let SQL = "UPDATE BugLogs SET ";
    let params: string[] = [];

    if (bugLogName !== null) {
        SQL += "BugName=?";
        params.push(bugLogName); // Client already encodes this. Do not encode it again or it will cause issues!
    }

    if (addDate !== null) {
        SQL += SQL != "" ? "," : "";
        SQL += "AddDate=?";
        params.push(encodeURIComponent(addDate));
    }

    if (completedDate !== null) {
        SQL += SQL != "" ? "," : "";
        
        if (completedDate !== "NULL") {
            SQL += "CompletedDate=?";
            params.push(encodeURIComponent(completedDate));
        } else {
            SQL += "CompletedDate=NULL";
        }
    }

    if (resolutionNotes !== null) {
        SQL += SQL != "" ? "," : "";
        SQL += "ResolutionNotes=?";
        params.push(resolutionNotes); // Client already encodes this. Do not encode it again or it will cause issues!
    }

    if (params.length === 0) {
        return Response.json(["ERROR", `No parameters were passed`]);
    }

    SQL += " WHERE BugLogId=?";
    params.push(BugLogId);

    await execUpdateDelete(SQL, params);

    return Response.json(["OK"]);
}