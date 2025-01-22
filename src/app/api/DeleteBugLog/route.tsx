import { NextRequest } from 'next/server';
import { execUpdateDelete, isLoggedIn } from "../lib";

/**
 * @swagger
 * /api/DeleteBugLog:
 *    put:
 *        tags:
 *          - BugLog
 *        summary: Delete a bug log
 *        description: Delete a bug log
 *        parameters:
 *           - name: BugLogId
 *             in: query
 *             description: ID of the bug
 *             required: true
 *             schema:
 *                  type: number
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;
     const BugLogId = searchParams.get("BugLogId");

     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     if (BugLogId === null) {
        return Response.json(["ERROR", "ID was not provided"])
   }

     const SQL = `DELETE FROM BugLogs WHERE BugLogId=?`;
     let params = [BugLogId];

     await execUpdateDelete(SQL, params);

     return Response.json(["OK"]);
}