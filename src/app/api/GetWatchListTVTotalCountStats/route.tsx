import { NextRequest } from 'next/server';
import { execSelect, getUserID } from "../lib";

/**
 * @swagger
 * /api/GetWatchListTVTotalCountStats:
 *    get:
 *        tags:
 *          - WatchList
 *        summary: Get total count of how many TV shows current user watched
 *        description: Get total count of how many TV shows current user watched
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const SQL = `SELECT COUNT(DISTINCT WatchListItemID) AS TVTotalCount FROM WatchList WHERE UserID=? AND WatchListItemID IN (SELECT WatchListItemID FROM WatchListItems WLI LEFT JOIN WatchListTypes WLT ON WLT.WatchListTypeID=WLI.WatchListTypeID WHERE WLT.WatchListTypeName='TV');`;

     try {
          const results = await execSelect(SQL, [userID]);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `/GetWatchListTVTotalCountStats: The error ${e.message} occurred getting the WatchList total TV count stats`]);
     }
}