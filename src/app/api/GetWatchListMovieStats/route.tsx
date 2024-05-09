import { NextRequest } from 'next/server';
import { DBType, getUserID, sequelize } from "../lib";

/**
 * @swagger
 * /api/GetWatchListMovieStats:
 *    get:
 *        tags:
 *          - WatchList
 *        summary: Get stats for most watched Movies for the current user
 *        description: Get stats for most watched Movies for the current user
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const SQL = `WITH GetFrequentItems AS (SELECT UserID,WatchListItemName,COUNT(*) AS ItemCount FROM WatchList WL LEFT JOIN WatchListItems WLI ON WLI.WatchListItemID=WL.WatchListItemID WHERE WLI.WatchListTypeID=1 GROUP BY UserID,WatchListItemName) SELECT ${DBType === "MSSQL" ? ` TOP(10) ` : ``} *,(SELECT IMDB_URL FROM WatchListItems WHERE WatchListItemName=GetFrequentItems.WatchListItemName) AS IMDB_URL FROM GetFrequentItems WHERE UserID=:UserID AND ItemCount > 1 ORDER BY ItemCount DESC ${DBType == "SQLite" ? " LIMIT 10" : ""}`;

     return sequelize
          .query(SQL, { replacements: { UserID: userID } }).then((results: any) => {
               return Response.json(results[0]);
          }).catch(function (err: Error) {
               return Response.json(["ERROR", `/GetWatchListMovieStats: The error ${err.message} occurred getting the WatchList Movie Stats`]);
          });
}