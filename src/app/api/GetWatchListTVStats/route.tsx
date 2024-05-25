import { NextRequest } from 'next/server';
import { execSelect, getUserID } from "../lib";

/**
 * @swagger
 * /api/GetWatchListTVStats:
 *    get:
 *        tags:
 *          - WatchList
 *        summary: Get the WatchList top rated TV show stats for the current user
 *        description: Get the WatchList top rated TV show stats for the current user
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const SQL = `WITH GetFrequentItems AS (SELECT UserID,WLI.WatchListItemName,MIN(StartDate) AS StartDate,MAX(StartDate) AS EndDate,COUNT(*) AS ItemCount FROM WatchList WL LEFT JOIN WatchListItems WLI ON WLI.WatchListItemID=WL.WatchListItemID LEFT JOIN WatchListTypes WLT ON WLT.WatchListTypeID=WLI.WatchListTypeID WHERE WLI.WatchListTypeID=2 AND WL.EndDate IS NOT NULL GROUP BY UserID,WatchListItemName) SELECT *,(SELECT IMDB_URL FROM WatchListItems WHERE WatchListItemName=GetFrequentItems.WatchListItemName) AS IMDB_URL FROM GetFrequentItems WHERE UserID=? AND ItemCount > 1 ORDER BY ItemCount DESC LIMIT 10`;

     try {
          const results = await execSelect(SQL, [userID]);

          return Response.json(["OK", results]);
     } catch (e) {
          return Response.json(["ERROR", `/GetWatchListTVStats: The error ${e.message} occurred getting the WatchList TV Stats`]);
     }
}