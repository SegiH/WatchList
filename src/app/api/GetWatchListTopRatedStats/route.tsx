import { NextRequest } from 'next/server';
import { execSelect, getUserID } from "../lib";

/**
 * @swagger
 * /api/GetWatchListTopRatedStats:
 *    get:
 *        tags:
 *          - WatchList
 *        summary: Get the WatchList top rated stats for the current user
 *        description: Get the WatchList top rated stats for the highest rated movie/shows for the current user
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const SQL = `SELECT WatchListItemName,Season,Rating,IMDB_URL FROM WatchList LEFT JOIN WatchListItems ON WatchListItems.WatchListItemID=WatchList.WatchListItemID WHERE Rating IS NOT NULL AND UserID=? ORDER BY Rating DESC LIMIT 10`;

     try {
          const results = await execSelect(SQL, [userID]);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `The error ${e.message} occurred getting the WatchList Top Rated Stats`]);
     }
}