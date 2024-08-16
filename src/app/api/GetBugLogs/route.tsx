import { NextRequest } from 'next/server';
import { execSelect, isLoggedIn } from '../lib';

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

     let SQL = `SELECT * FROM BugLogs`;

     if (getActiveBugLogs !== null && getActiveBugLogs === "true") {
          SQL += " WHERE CompletedDate IS NULL"
     }



     const result = await execSelect(SQL, []);

     return Response.json(["OK", result]);
}