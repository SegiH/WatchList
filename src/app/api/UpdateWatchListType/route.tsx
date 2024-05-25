import { NextRequest } from 'next/server';
import { execUpdateDelete } from "../lib";

/**
 * @swagger
 * /api/UpdateWatchListType:
 *    put:
 *        tags:
 *          - WatchListTypes
 *        summary: Update a WatchListItem Type
 *        description: Update a WatchListItem Type
 *        parameters:
 *           - name: WatchListTypeID
 *             in: query
 *             description: New WatchListType ID
 *             required: true
 *             schema:
 *                  type: string
 *           - name: WatchListTypeName
 *             in: query
 *             description: New WatchListType Name
 *             required: true
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function PUT(request: NextRequest) {
     const searchParams = request.nextUrl.searchParams;

     const watchListTypeID = searchParams.get("WatchListTypeID");
     const watchListTypeName = searchParams.get("WatchListTypeName");
     
     if (watchListTypeID === null) {
          return Response.json(["ERROR", "WatchList Type ID was not provided"]);
     } else if (watchListTypeName === null) {
          return Response.json(["ERROR", "WatchList Type Name was not provided"]);
     }

     const values: any = [watchListTypeName, watchListTypeID];

     try {
          const sql = `UPDATE WatchListTypes SET WatchListTypeName=? WHERE WatchListTypeID=?`;

          await execUpdateDelete(sql, values);

          return Response.json(["OK"]);
     } catch (e) {
          return Response.json(["ERROR", `/UpdateWatchListType: The error occurred updating the WatchList Type with ID ${watchListTypeID} with the error ${e.message}`]);
     }
}