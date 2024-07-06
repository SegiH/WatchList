import { NextRequest } from 'next/server';
import { execSelect, isLoggedIn } from "../lib";

/**
 * @swagger
 * /api/GetWatchListItemDtl:
 *    get:
 *        tags:
 *          - WatchListItems
 *        summary: Get WatchList Item record based on the provided WatchListItemID
 *        description: Get WatchListItem record based on the provided WatchListItemID
 *        parameters:
 *           - name: WatchListItemID
 *             in: query
 *             description: WatchList Item ID of the record to return
 *             required: true
 *             schema:
 *                  type: number
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     if (!isLoggedIn(request)) {
          return Response.json(["ERROR", "Error. Not signed in"]);
     }

     const searchParams = request.nextUrl.searchParams;

     const watchListItemID = searchParams.get("WatchListItemID");

     if (watchListItemID === null) {
          return Response.json(["ERROR", "WatchList ItemID was not provided"]);
     }

     const SQL = `SELECT WatchListItems.*, WatchListTypeName FROM WatchListItems
                LEFT JOIN WatchListTypes ON WatchListTypes.WatchListTypeID=WatchListItems.WatchListTypeID
                WHERE WatchListItemID=?
                `;

     try {
          const results = await execSelect(SQL, [watchListItemID]);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `/GetWatchListItemDtl: The error ${e.message} occurred getting the WatchList Item Detail`]);
     }
}