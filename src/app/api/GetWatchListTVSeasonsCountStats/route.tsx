import { NextRequest } from 'next/server';
import { execSelect, getUserID } from "../lib";

/**
 * @swagger
 * /api/GetWatchListTVSeasonsCountStats:
 *    get:
 *        tags:
 *          - WatchList
 *        summary: Get count of how many TV seasons the current user watched
 *        description: Get count of how many TV seasons the current user watched
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const SQL = `SELECT COUNT(*) AS TVSeasonsCount FROM WatchList WL LEFT JOIN WatchListItems WLI ON WLI.WatchlistItemID=WL.WatchlistItemID LEFT JOIN WatchListTypes WLT ON WLT.WatchListTypeID=WLI.WatchListTypeID WHERE UserID=? AND WLT.WatchListTypeName='TV';`;

     try {
          const results = await execSelect(SQL, [userID]);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `/GetWatchListTVSeasonsCountStats: The error ${e.message} occurred getting the WatchList TV seasons count Stats`]);
     }
}