import { NextRequest } from 'next/server';
import { DBType, getUserID, sequelize } from "../lib";

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

     const SQL =
          `WITH GetFrequentItems AS (SELECT UserID,WLI.WatchListItemName,MIN(StartDate) AS StartDate,MAX(StartDate) AS EndDate,COUNT(*) AS ItemCount FROM WatchList WL LEFT JOIN WatchListItems WLI ON WLI.WatchListItemID=WL.WatchListItemID LEFT JOIN WatchListTypes WLT ON WLT.WatchListTypeID=WLI.WatchListTypeID WHERE WLI.WatchListTypeID=2 AND WL.EndDate IS NOT NULL GROUP BY UserID,WatchListItemName) SELECT ${DBType === "MSSQL" ? ` TOP(10) ` : ``} *,(SELECT IMDB_URL FROM WatchListItems WHERE WatchListItemName=GetFrequentItems.WatchListItemName) AS IMDB_URL FROM GetFrequentItems WHERE UserID=:UserID AND ItemCount > 1 ORDER BY ItemCount DESC ${DBType == "SQLite" ? " LIMIT 10" : ""}`;

     return sequelize
          .query(SQL, { replacements: { UserID: userID } })
          .then((results) => {
               return Response.json(results[0]);
          })
          .catch(function (err) {
               return Response.json(["ERROR", `/GetWatchListTVStats: The error ${err.message} occurred getting the WatchList TV Stats`]);
          });
}