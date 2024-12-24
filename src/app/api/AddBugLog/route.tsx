import { NextRequest } from 'next/server';
import { execInsert, isLoggedIn } from "../lib";

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

     if (bugLogName === null) {
          return Response.json({ "ERROR": "Name was not provided" });
     }

     if (addDate === null) {
          return Response.json({ "ERROR": "AddDate was not provided" });
     }

     let SQL = `INSERT INTO BugLogs (WLBugName,AddDate`;
     let valuePlaceholder = ' VALUES (?,?';
     let params = [bugLogName, addDate];

     if (completedDate !== null) {
          SQL += ',CompletedDate';
          valuePlaceholder += ",?";
          params.push(completedDate);
     }

     SQL += ',ResolutionNotes';
     valuePlaceholder += ",?";
     params.push(resolutionNotes !== null ? resolutionNotes : ""); // Default ResolutionNotes to empty space

     SQL += ')';
     valuePlaceholder += ");";

     const result = await execInsert(SQL + valuePlaceholder, params);

     const newID = result.lastID;

     return Response.json(["OK", newID]);
}