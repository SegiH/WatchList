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
 *           - name: WLBugID
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
     const wlBugID = searchParams.get("WLBugID");

     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     if (wlBugID === null) {
        return Response.json(["ERROR", "ID was not provided"])
   }

     const SQL = `DELETE FROM BugLogs WHERE WLBugID=?`;
     let params = [wlBugID];

     await execUpdateDelete(SQL, params);

     return Response.json(["OK"]);
}