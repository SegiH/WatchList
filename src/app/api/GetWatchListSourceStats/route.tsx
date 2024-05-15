import { NextRequest } from 'next/server';
import { getUserID, sequelize } from "../lib";

/**
 * @swagger
 * /api/GetWatchListSourceStats:
 *    get:
 *        tags:
 *          - WatchListSources
 *        summary: Get the WatchList source stats for the current user
 *        description: Get the WatchList source stats that indicate how many times a movie/show was watched at a source (I.E Netflix) for the current user
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
export async function GET(request: NextRequest) {
     const userID = await getUserID(request);

     const searchParams = request.nextUrl.searchParams;

     const getDetail = typeof searchParams.get("GetDetail") !== "undefined" && searchParams.get("GetDetail") === "true" ? 1 : 0;

     if (userID === null) {
          return Response.json(["ERROR", "User ID is not set"]);
     }

     const SQL = "SELECT WatchList.WatchListSourceID, WatchListSources.WatchListSourceName, COUNT(WatchList.WatchListSourceID) AS SourceCount FROM WatchList LEFT JOIN WatchListSources ON WatchListSources.WatchListSourceID=WatchList.WatchListSourceID WHERE UserID=:UserID AND  WatchListSources.WatchListSourceName IS NOT NULL GROUP BY WatchList.WatchListSourceID,WatchListSources.WatchListSourceName ORDER BY SourceCount DESC";

     const detailSQL = "SELECT * FROM WatchList LEFT JOIN WatchListItems ON WatchListItems.WatchListItemID=WatchList.WatchListItemID LEFT JOIN WatchListSources ON WatchListSources.WatchListSourceID=WatchList.WatchListSourceID WHERE UserID=:UserID ORDER BY StartDate DESC";

     return sequelize.query(!getDetail ? SQL : detailSQL, { replacements: { UserID: userID } })
          .then((results: any) => {
               return Response.json(["OK", results[0]]);
          })
          .catch(function (err) {
               return Response.json(["ERROR", `/GetWatchListSourceStats: The error ${err.message} occurred getting the WatchList Source Stats`]);
          });
}