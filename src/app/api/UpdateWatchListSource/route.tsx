import { NextRequest } from 'next/server';
import { execUpdateDelete } from "../lib";

/**
 * @swagger
 * /api/UpdateWatchListSource:
 *    put:
 *        tags:
 *          - WatchListSources
 *        summary: Update a WatchListItem source
 *        description: Update a WatchListItem source
 *        parameters:
 *           - name: WatchListSourceID
 *             in: query
 *             description: New WatchListSource ID
 *             required: true
 *             schema:
 *                  type: string
 *           - name: WatchListSourceName
 *             in: query
 *             description: New WatchListSource Name
 *             required: true
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const watchListSourceID = searchParams.get("WatchListSourceID");
     const watchListSourceName = searchParams.get("WatchListSourceName");

     if (watchListSourceID === null) {
          return Response.json(["ERROR", "WatchList Source ID was not provided"]);
     } else if (watchListSourceName === null) {
          return Response.json(["ERROR", "WatchList Source Name was not provided"]);
     }

     const values: any = [watchListSourceName, watchListSourceID];

     try {
          const sql = `UPDATE WatchListSources SET WatchListSourceName=? WHERE WatchListSourceID=?`;

          await execUpdateDelete(sql, values);

          return Response.json(["OK"]);
     } catch (e) {
          return Response.json(["ERROR", `/UpdateWatchListSource: The error occurred updating the WatchList Source with ID ${watchListSourceID} with the error ${e.message}`]);
     }
}